const userId = sessionStorage.getItem('userId');


//my orders page
$(document).ready(function () {
    const token = sessionStorage.getItem('access_token');
    const userId = sessionStorage.getItem('userId');
    if (!token || !userId) {
        Swal.fire({
            icon: 'warning',
            text: 'You must be logged in to access this page.',
            showConfirmButton: true
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    $('#customerOrdersTable').DataTable({
        ajax: {
            url: `${url}api/v1/my-orders/${userId}`,
            dataSrc: 'data'
        },
        columns: [
            { data: 'order_id' }, // ✅ matches SELECT o.order_id
            { data: 'items' },    // ✅ matches GROUP_CONCAT alias "items"
            {
                data: 'total_price', // ✅ matches SUM(...) alias "total_price"
                render: function (data) {
                    return '₱' + parseFloat(data).toFixed(2);
                }
            },
            { data: 'status' },   // ✅ matches o.status
            {
                data: 'date_placed', // ✅ matches o.date_placed
                render: function (data) {
                    return new Date(data).toLocaleString();
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.status === 'pending') {
                        return `<button class="btn btn-sm btn-danger" onclick="cancelOrder(${data.order_id})">Cancel</button>`;
                    } else if (data.status === 'shipped') {
                        return `<button class="btn btn-sm btn-success" onclick="markAsReceived(${data.order_id})">Mark as Received</button>`;
                    } else if (data.status === 'received') {
                        return `<button class="btn btn-sm btn-primary" onclick="openReviewModal(${data.order_id})">Leave a Review</button> 
                  <button class="btn btn-sm btn-info" onclick="openReceiptModal(${data.order_id})" style="margin-left: 5px;">Receipt</button>`;
                    }
                    return '<span class="text-muted">No actions</span>';
                }
            }
        ]
    });
});

function cancelOrder(orderId) {
  Swal.fire({
    title: 'Cancel this order?',
    text: "Please provide a reason for cancelling this order. This is required.",
    icon: 'warning',
    input: 'textarea',
    inputLabel: 'Reason for cancellation',
    inputPlaceholder: 'Type your reason here...',
    inputAttributes: {
      'aria-label': 'Reason for cancellation',
      maxlength: 500,
      rows: 4
    },
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return 'A cancellation reason is required.';
      }
      if (value.trim().length < 5) {
        return 'Please provide a more detailed reason (at least 5 characters).';
      }
      return null;
    },
    showCancelButton: true,
    confirmButtonText: 'Cancel Order',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      const reason = (result.value || '').trim();

      // show a small loading modal while calling API
      Swal.fire({
        title: 'Cancelling...',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
      });

      $.ajax({
        method: 'PATCH',
        url: `${url}api/v1/cancel-order`,
        contentType: 'application/json',
        data: JSON.stringify({ order_id: orderId, reason: reason }),
        success: function (resp) {
          Swal.close();
          Swal.fire('Cancelled', resp.message || 'Your order was cancelled', 'success');
          $('#customerOrdersTable').DataTable().ajax.reload();
        },
        error: function (xhr) {
          Swal.close();
          let text = 'Failed to cancel order';
          if (xhr && xhr.responseJSON && xhr.responseJSON.error) {
            text = xhr.responseJSON.error;
          } else if (xhr && xhr.responseText) {
            try {
              const j = JSON.parse(xhr.responseText);
              if (j && j.error) text = j.error;
            } catch (e) { /* ignore parse error */ }
          }

          Swal.fire('Error', text, 'error');
        }
      });
    }
  });
}


function markAsReceived(orderId) {
    Swal.fire({
        title: 'Confirm Receipt?',
        text: "Mark this order as received?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, I received it'
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'PATCH',
                url: `${url}admin/orders/update-status`,
                contentType: 'application/json',
                data: JSON.stringify({ order_id: orderId, status: 'received' }),
                success: function () {
                    Swal.fire('Thank you!', 'Order marked as received', 'success');
                    $('#customerOrdersTable').DataTable().ajax.reload();
                },
                error: function () {
                    Swal.fire('Error', 'Failed to update order status', 'error');
                }
            });
        }
    });
}


function openReviewModal(orderId) {
    $.ajax({
        url: `${url}api/v1/order-items/${orderId}?user_id=${userId}`,
        method: 'GET',
        success: function (res) {
            const items = res.data;
            let html = '';

            items.forEach(item => {
                const hasReview = item.rating !== null && item.comment !== null;

                html += `
          <div class="form-group border rounded p-3 mb-3">
            <h5>${item.product_name}</h5>
            <input type="hidden" class="product-id" value="${item.product_id}" />
            <input type="hidden" class="order-id" value="${orderId}" />
            <input type="hidden" class="user-id" value="${userId}" />
            
            ${hasReview ? `
              <p><strong>Your Rating:</strong> ${item.rating}</p>
              <p><strong>Your Comment:</strong> ${item.comment}</p>
              <div class="alert alert-info">You have already reviewed this item.</div>
            ` : `
              <label for="rating-${item.product_id}">Rating (1-5)</label>
              <input type="number" id="rating-${item.product_id}" class="form-control rating-input" min="1" max="5" required>

              <label for="comment-${item.product_id}">Comment</label>
              <textarea id="comment-${item.product_id}" class="form-control comment-input" required></textarea>
            `}
          </div>
        `;
            });

            $('#reviewModalBody').html(html);

            $('#submitReviewBtn').off('click').on('click', function () {
                const reviews = [];

                $('#reviewModalBody .form-group').each(function () {
                    // Skip items with existing reviews
                    if ($(this).find('.rating-input').length === 0) return;

                    const product_id = $(this).find('.product-id').val();
                    const order_id = $(this).find('.order-id').val();
                    const user_id = $(this).find('.user-id').val();
                    const rating = $(this).find('.rating-input').val();
                    const comment = $(this).find('.comment-input').val();

                    if (!rating || !comment) return;

                    reviews.push({
                        product_id,
                        order_id,
                        user_id,
                        rating,
                        comment
                    });
                });

                if (reviews.length === 0) {
                    return Swal.fire('Notice', 'No new reviews to submit.', 'info');
                }

                $.ajax({
                    url: `${url}api/v1/reviews`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ reviews }),
                    success: function () {
                        Swal.fire('Thank you!', 'Your reviews have been submitted.', 'success');
                        $('#reviewModal').modal('hide');
                        $('#customerOrdersTable').DataTable().ajax.reload();
                    },
                    error: function () {
                        Swal.fire('Error', 'Failed to submit reviews.', 'error');
                    }
                });
            });

            $('#reviewModal').modal('show');
        },
        error: function () {
            Swal.fire('Error', 'Failed to fetch order items.', 'error');
        }
    });
}

function openReceiptModal(orderId) {
    // Fetch order details for receipt
    $.ajax({
        url: `${url}api/v1/my-orders/${userId}`,
        method: 'GET',
        success: function (res) {
            const orders = res.data;
            const order = orders.find(o => o.order_id == orderId);

            if (!order) {
                Swal.fire('Error', 'Order not found', 'error');
                return;
            }

            // Fetch detailed order items
            $.ajax({
                url: `${url}api/v1/order-items/${orderId}?user_id=${userId}`,
                method: 'GET',
                success: function (itemRes) {
                    const items = itemRes.data;

                    // Fetch user information
                    $.ajax({
                        url: `${url}api/v1/profile/${userId}`,
                        method: 'GET',
                        success: function (userRes) {
                            const user = userRes.user;
                            displayReceipt(order, items, user);
                        },
                        error: function () {
                            // If user profile fails, use basic info
                            displayReceipt(order, items, { username: 'User', email: 'N/A' });
                        }
                    });
                },
                error: function () {
                    Swal.fire('Error', 'Failed to fetch order details', 'error');
                }
            });
        },
        error: function () {
            Swal.fire('Error', 'Failed to fetch order information', 'error');
        }
    });
}

function displayReceipt(order, items, user) {
    const receiptDate = new Date().toLocaleString();
    const orderDate = new Date(order.date_placed).toLocaleString();
    let itemsHtml = '';
    let subtotal = 0;

    // Ensure items is an array
    if (!Array.isArray(items)) {
        items = [];
    }

    items.forEach((item, index) => {
        // Try different possible field names for price
        let itemPrice = 0;
        if (item.price !== undefined) {
            itemPrice = parseFloat(item.price) || 0;
        } else if (item.unit_price !== undefined) {
            itemPrice = parseFloat(item.unit_price) || 0;
        } else if (item.item_price !== undefined) {
            itemPrice = parseFloat(item.item_price) || 0;
        }

        // Try different possible field names for quantity
        let itemQuantity = 0;
        if (item.quantity !== undefined) {
            itemQuantity = parseInt(item.quantity) || 0;
        } else if (item.qty !== undefined) {
            itemQuantity = parseInt(item.qty) || 0;
        }

        const itemTotal = itemPrice * itemQuantity;
        subtotal += itemTotal;

        itemsHtml += `
            <tr>
                <td>${item.product_name || item.name || 'Unknown Item'}</td>
                <td>${itemQuantity}</td>
                <td>₱${itemPrice.toFixed(2)}</td>
                <td>₱${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    // DEBUG: Log all data to console to see what's available
    console.log('Order data:', order);
    console.log('Items data:', items);
    console.log('User data:', user);

    // Calculate discount - check multiple possible locations and field names
    let discountAmount = 0;
    let discountPercent = 0;
    let discountCode = '';
    let hasDiscount = false;

    // Method 1: Check if discount_amount is already provided (pre-calculated in database)
    if (order.discount_amount !== undefined && order.discount_amount !== null && parseFloat(order.discount_amount) > 0) {
        hasDiscount = true;
        discountAmount = parseFloat(order.discount_amount);
        discountPercent = parseFloat(order.discount_percent || 0);
        discountCode = order.discount_code || `${discountPercent}%`;
        console.log('Discount found (pre-calculated):', discountCode, discountPercent, discountAmount);
    }
    // Method 2: Check order object for discount_percent to calculate
    else if (order.discount_percent !== undefined && order.discount_percent !== null && parseFloat(order.discount_percent) > 0) {
        hasDiscount = true;
        discountPercent = parseFloat(order.discount_percent);
        discountCode = order.discount_code || `${discountPercent}%`;
        discountAmount = (subtotal * discountPercent) / 100;
        console.log('Discount calculated from percent:', discountCode, discountPercent, discountAmount);
    }
    // Method 3: Check items array for discount (in case discount is stored per item)
    else if (items.length > 0 && items[0].discount_percent !== undefined && parseFloat(items[0].discount_percent) > 0) {
        hasDiscount = true;
        discountPercent = parseFloat(items[0].discount_percent);
        discountCode = items[0].discount_code || `${discountPercent}%`;
        if (items[0].discount_amount !== undefined) {
            discountAmount = parseFloat(items[0].discount_amount);
        } else {
            discountAmount = (subtotal * discountPercent) / 100;
        }
        console.log('Discount found in items array:', discountCode, discountPercent, discountAmount);
    } else {
        console.log('No discount detected');
    }

    // Build discount HTML
    let discountHtml = `
        <tr class="subtotal-row">
            <td colspan="3"><strong>Subtotal:</strong></td>
            <td><strong>₱${subtotal.toFixed(2)}</strong></td>
        </tr>
    `;

    if (hasDiscount && discountPercent > 0) {
        discountHtml += `
            <tr class="discount-row">
                <td colspan="3"><strong>Discount (${discountCode} - ${discountPercent}%):</strong></td>
                <td style="color:#ef4444;"><strong>-₱${discountAmount.toFixed(2)}</strong></td>
            </tr>
        `;
    } else {
        discountHtml += `
            <tr class="discount-row">
                <td colspan="3"><strong>Discount:</strong></td>
                <td style="color:#6b7280;"><strong>No Discount</strong></td>
            </tr>
        `;
    }

    const finalTotal = subtotal - discountAmount;

    // Get user display name
    const displayName = user.first_name
        ? `${user.first_name} ${user.last_name || ''}`.trim()
        : (user.username || 'Unknown User');

    // ✅ Payment method mapping (from payment.js)
    const paymentMethodMap = {
        'cod': 'Cash on Delivery',
        'gcash': 'GCash',
        'maya': 'Maya',
        'online_bank': 'Online Banking',
        'bank_transfer': 'Bank Transfer'
    };

    // ✅ Get payment method - check multiple possible field names
    let paymentMethodId = order.payment_method || order.payment_mode || order.mode_of_payment || 'cod';
    let paymentMethodDisplay = 'Cash on Delivery'; // Default

    if (paymentMethodId) {
        // Convert to lowercase for matching
        const methodId = paymentMethodId.toLowerCase();
        // Get the display label from the map, or use the original value
        paymentMethodDisplay = paymentMethodMap[methodId] || paymentMethodId;
        console.log('Payment method found:', paymentMethodId, '→', paymentMethodDisplay);
    } else {
        console.log('No payment method detected in order data, using default COD');
    }

    // ✅ Get payment icon for visual display
    const paymentIconMap = {
        'cod': '💵',
        'gcash': '📱',
        'maya': '💳',
        'online_bank': '🏦',
        'bank_transfer': '🏛️'
    };
    const paymentIcon = paymentIconMap[paymentMethodId?.toLowerCase()] || '💳';

    const receiptHtml = `
        <div class="receipt-container">
            <div class="receipt-header">
                <h2>UniTree</h2>
                <p>Order Receipt</p>
                <p><strong>Receipt Date:</strong> ${receiptDate}</p>
            </div>

            <div class="receipt-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> #${order.order_id}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Status:</strong> <span class="status-received">${order.status}</span></p>
                <p><strong>Payment Method:</strong> ${paymentIcon} ${paymentMethodDisplay}</p>
            </div>

            <div class="receipt-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${displayName}</p>
                <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
                <p><strong>Address:</strong> ${user.address || 'Not provided'}</p>
                <p><strong>Contact Number:</strong> ${user.contact_number || 'Not provided'}</p>
            </div>

            <div class="receipt-section">
                <h4>Order Items</h4>
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        ${discountHtml}
                        <tr class="total-row">
                            <td colspan="3"><strong>Total Amount:</strong></td>
                            <td><strong>₱${finalTotal.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="receipt-footer">
                <p>Thank you for your purchase!</p>
                <p>This is your official receipt.</p>
            </div>
        </div>
    `;

    $('#receiptModalBody').html(receiptHtml);
    $('#receiptModal').modal('show');
}