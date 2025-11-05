// =================== USER-SPECIFIC CART ===================

function getCartKey() {
    const userId = JSON.parse(sessionStorage.getItem('userId'));
    return userId ? `cart_${userId}` : 'cart_guest';
}

function getCart() {
    const cart = localStorage.getItem(getCartKey());
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

// =================== INITIALIZE CART ===================
let cart = getCart();

// =================== ADD TO CART ===================
function addToCart(product, redirectToCart = false) {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const price = typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
        : parseFloat(product.price);

    const existingItemIndex = cart.findIndex(item => item.id == product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name || 'Unnamed Product',
            price: price || 0,
            image: product.image || 'images/placeholder.jpg',
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} added to cart`);

    if (redirectToCart) {
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }
}

// =================== UPDATE CART COUNT ===================
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    $('.cart-count').text(count);
    return count;
}

// =================== SHOW TOAST ===================
function showToast(message, isError = false) {
    const toast = $(`
        <div class="toast ${isError ? 'error' : ''}">
            <div class="toast-message">${message}</div>
        </div>
    `);

    $('body').append(toast);

    setTimeout(() => toast.addClass('show'), 100);

    setTimeout(() => {
        toast.removeClass('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// =================== HANDLE BUTTONS ===================
function handleAddToCart(e) {
    e.stopPropagation();
    e.preventDefault();

    const $button = $(e.currentTarget);
    const product = {
        id: $button.data('id'),
        name: $button.data('name'),
        price: parseFloat($button.data('price')),
        image: $button.data('image')
    };

    addToCart(product, false);
}

$(document).on('click', '.btn-add-cart', handleAddToCart);

$(document).on('click', '.btn-buy-now', function(e) {
    e.stopPropagation();
    e.preventDefault();

    const $button = $(this);
    const product = {
        id: $button.data('id'),
        name: $button.data('name'),
        price: parseFloat($button.data('price')),
        image: $button.data('image')
    };
    addToCart(product, true);
});

// =================== CART.HTML FUNCTIONS ===================
function formatPrice(price) {
    return '₱' + parseFloat(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function renderCart() {
    const $cartItems = $('#cartItems');
    cart = getCart();

    if (cart.length === 0) {
        $cartItems.html(`
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="products.html" class="continue-shopping">
                    <i class="fas fa-arrow-left"></i>
                    Continue Shopping
                </a>
            </div>
        `);
        $('#subtotal').text('₱0.00');
        $('#total').text('₱0.00');
        $('#checkoutBtn').prop('disabled', true);
        return;
    }

    let itemsHtml = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        itemsHtml += `
<div class="cart-item" data-index="${index}">
    <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" class="cart-item-image" />
    <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
    </div>
    <div class="cart-item-price">${formatPrice(item.price)}</div>
    <div class="quantity-control">
        <button class="quantity-btn decrease">-</button>
        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
        <button class="quantity-btn increase">+</button>
    </div>
    <button class="remove-btn" title="Remove item">×</button>
    <div class="cart-item-total">${formatPrice(itemTotal)}</div>
</div>`;
    });

    $cartItems.html(itemsHtml);
    $('#subtotal').text(formatPrice(subtotal));
    $('#total').text(formatPrice(subtotal));
    $('#checkoutBtn').prop('disabled', false);
}

// =================== UPDATE QUANTITY ===================
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    cart[index].quantity = newQuantity;
    saveCart(cart);
    renderCart();
    updateCartCount();
}

// =================== REMOVE ITEM ===================
function removeItem(index) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartCount();
}

// =================== EVENT LISTENERS ===================
$(document)
    .on('click', '.quantity-btn', function() {
        const $item = $(this).closest('.cart-item');
        const index = $item.data('index');
        let quantity = parseInt($item.find('.quantity-input').val());

        if ($(this).hasClass('increase')) quantity++;
        else if ($(this).hasClass('decrease')) quantity--;

        if (quantity < 1) quantity = 1;
        $item.find('.quantity-input').val(quantity);
        updateQuantity(index, quantity);
    })
    .on('click', '.remove-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const index = $(this).closest('.cart-item').data('index');

        Swal.fire({
            title: 'Remove Item?',
            text: "Are you sure you want to remove this item?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) removeItem(index);
        });
    })
    .on('change', '.quantity-input', function() {
        const $item = $(this).closest('.cart-item');
        const index = $item.data('index');
        let quantity = parseInt($(this).val());

        if (isNaN(quantity) || quantity < 1) quantity = 1;
        $(this).val(quantity);
        updateQuantity(index, quantity);
    });

// =================== DOCUMENT READY ===================
$(document).ready(function() {
    cart = getCart();
    updateCartCount();
    renderCart();

    $('#checkoutBtn').click(checkout);
});

// =================== CHECKOUT FUNCTION ===================
// =================== CHECKOUT FUNCTION WITH DISCOUNT ===================
function checkout() {
    const userId = JSON.parse(sessionStorage.getItem('userId'));
    cart = getCart();

    if (!userId) return Swal.fire('Login required');
    if (!cart.length) return Swal.fire('Cart is empty');

    let totalAmount = cart.reduce((sum, c) => sum + (c.price * c.quantity), 0);
    let discountAmount = 0;
    
    if (appliedDiscount) {
      discountAmount = (appliedDiscount.percent / 100) * totalAmount;
      totalAmount -= discountAmount;
    }

    const payload = {
      user_id: userId,
      total_amount: totalAmount,
      discount_percent: appliedDiscount ? appliedDiscount.percent : 0,
      discount_amount: discountAmount,
      discount_code: appliedDiscount ? appliedDiscount.value : null,
      reward_id: appliedDiscount ? appliedDiscount.rewardId : null,
      payment_method: window._paymentUI?.getConfirmed() || 'Not Specified',
      items: cart.map(c => ({
        product_id: c.id,
        quantity: c.quantity,
        price: c.price,
        // Include discount info with each item
        discount_applied: appliedDiscount ? {
          code: appliedDiscount.value,
          percent: appliedDiscount.percent,
          amount: ((c.price * c.quantity) * appliedDiscount.percent) / 100
        } : null
      }))
    };

    $.ajax({
        method: 'POST',
        url: `${url}api/v1/order`,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
            // Remove applied discount from local UI/state
            if (appliedDiscount && appliedDiscount.rewardId) {
                const usedId = appliedDiscount.rewardId;
                userDiscounts = (userDiscounts || []).filter(d => String(d.reward_id) !== String(usedId));
                $(`[data-id="${usedId}"]`).remove();
                appliedDiscount = null;
            }

            localStorage.removeItem(getCartKey());
            cart = [];
            renderCart();
            updateCartCount();

            Swal.fire({
                icon: 'success',
                title: 'Thank You for Ordering!',
                text: 'Your order has been placed successfully.',
                confirmButtonText: 'Continue Shopping',
                confirmButtonColor: '#8B5E3C',
                background: '#fff8f0',
                color: '#5c4433'
            }).then(() => {
                // Refresh discounts
                if (userId) {
                  $.ajax({
                    url: `${url}api/v1/my-discounts/${userId}`,
                    method: 'GET',
                    success: function(d) {
                      userDiscounts = d.discounts || [];
                      const html = (userDiscounts || []).map(disc => `
                        <div class="discount-item" data-id="${disc.reward_id}" data-value="${disc.value}"
                          style="border:1px solid #ccc; border-radius:8px; padding:10px; margin:5px; cursor:pointer;">
                          <strong>${disc.value} OFF</strong><br>
                          <small>Click to use this coupon</small>
                        </div>
                      `).join('');
                      $('#discountListContainer').html(html);
                    }
                  });
                }
                window.location.href = 'products.html';
            });
        },
        error: function (xhr) {
            Swal.fire('Order failed', xhr.responseText || 'Server error', 'error');
        }
    });
}

// =================== DISCOUNT FEATURE ===================
let appliedDiscount = null;
let userDiscounts = [];

// Show discount modal
$('#useDiscountBtn').on('click', function() {
  const userId = JSON.parse(sessionStorage.getItem('userId'));
  if (!userId) return Swal.fire('Please log in first.');

  $.ajax({
    url: `${url}api/v1/my-discounts/${userId}`,
    method: 'GET',
    success: function(discounts) {
      userDiscounts = discounts.discounts || [];
      if (!userDiscounts.length) {
        Swal.fire('No available discounts', 'You currently have no discount coupons.', 'info');
        return;
      }

      const html = userDiscounts.map(d => `
        <div class="discount-item" data-id="${d.reward_id}" data-value="${d.value}"
          style="border:1px solid #ccc; border-radius:8px; padding:10px; margin:5px; cursor:pointer;">
          <strong>${d.value} OFF</strong><br>
          <small>Click to use this coupon</small>
        </div>
      `).join('');

      $('#discountListContainer').html(html);
      $('#discountModal').fadeIn();
    },
    error: function() {
      Swal.fire('Error', 'Failed to load your discounts.', 'error');
    }
  });
});

// Close modal
$('#closeDiscountModal').on('click', function() {
  $('#discountModal').fadeOut();
});

// Apply discount
$(document).on('click', '.discount-item', function() {
  const discountValue = $(this).data('value');
  const rewardId = $(this).data('id');

  const percent = parseFloat(discountValue.replace('%', ''));
  appliedDiscount = { percent, rewardId, value: discountValue };

  // Apply discount to total
  const subtotal = parseFloat($('#subtotal').text().replace(/[₱,]/g, ''));
  const discountAmount = subtotal * (percent / 100);
  const newTotal = subtotal - discountAmount;

  $('#total').html(`
    <div style="font-size:0.9em; color:#4ade80;">
      Discount (${discountValue}): -₱${discountAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
    </div>
    <div>₱${newTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
  `);
  
  Swal.fire('Discount Applied!', `${percent}% OFF has been applied to your total.`, 'success');
  $('#discountModal').fadeOut();
});

// Add this to your existing cart.js file - Checkout handler with payment method integration

// Checkout button handler
document.getElementById('checkoutBtn')?.addEventListener('click', async function() {
  try {
    // Check if user is logged in
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to be logged in to checkout',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Get cart items from localStorage or your cart management system
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Check if payment method is selected
    if (typeof window.getConfirmedPaymentMethod !== 'function') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Payment system not loaded. Please refresh the page.',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Get selected payment method
    const paymentMethod = window.getConfirmedPaymentMethod();
    const paymentLabel = window.getConfirmedPaymentLabel();
    
    // Calculate total amount
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    // Get discount information (if you have discount functionality)
    const discountPercent = parseFloat(document.getElementById('discountPercent')?.value) || 0;
    const discountCode = document.getElementById('discountCode')?.value || null;
    const discountAmount = (subtotal * discountPercent / 100);
    const totalAmount = subtotal - discountAmount;
    
    // Show confirmation dialog
    const result = await Swal.fire({
      icon: 'question',
      title: 'Confirm Order',
      html: `
        <div style="text-align:left; padding: 10px;">
          <p style="margin: 8px 0;"><strong>Payment Method:</strong> ${paymentLabel}</p>
          <p style="margin: 8px 0;"><strong>Items:</strong> ${cartItems.length} item(s)</p>
          <p style="margin: 8px 0;"><strong>Subtotal:</strong> ₱${subtotal.toFixed(2)}</p>
          ${discountAmount > 0 ? `<p style="margin: 8px 0;"><strong>Discount:</strong> -₱${discountAmount.toFixed(2)}</p>` : ''}
          <p style="margin: 8px 0; font-size: 1.1em;"><strong>Total:</strong> ₱${totalAmount.toFixed(2)}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Place Order',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#6c5ce7',
      cancelButtonColor: '#95a5a6'
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    // Show loading indicator
    Swal.fire({
      title: 'Processing Order...',
      html: 'Please wait while we process your order',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Prepare order items array
    const orderItems = cartItems.map(item => ({
      product_id: item.id || item.product_id,
      quantity: item.quantity,
      price: item.price
    }));
    
    // Prepare order data with items included
    const orderData = {
      user_id: parseInt(userId),
      items: orderItems,  // ✅ Include items in single request
      discount_percent: parseFloat(discountPercent),
      discount_amount: parseFloat(discountAmount.toFixed(2)),
      discount_code: discountCode,
      payment_method: paymentMethod, // ✅ Include payment method
      reward_id: null  // Add reward_id if you have reward system
    };
    
    console.log('Creating order with data:', orderData);
    
    // Create order in database (Node.js API)
    const response = await fetch(API_BASE_URL + '/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result_data = await response.json();
    
    if (result_data.success) {
      const orderId = result_data.orderId || result_data.order_id;
      
      console.log('Order created successfully. Order ID:', orderId);
      console.log('Payment method saved:', result_data.payment_method);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        html: `
          <div style="text-align:center; padding: 10px;">
            <p style="margin: 10px 0;">Order ID: <strong>#${orderId}</strong></p>
            <p style="margin: 10px 0;">Payment Method: <strong>${paymentLabel}</strong></p>
            <p style="margin: 10px 0;">Total: <strong>₱${totalAmount.toFixed(2)}</strong></p>
            <p style="margin: 10px 0; font-size: 0.9em; color: #666;">
              ${paymentMethod === 'gcash' ? 'Please complete your GCash payment. We will verify shortly.' : ''}
              ${paymentMethod === 'cod' ? 'Prepare exact amount for delivery.' : ''}
            </p>
          </div>
        `,
        confirmButtonText: 'View My Orders',
        confirmButtonColor: '#6c5ce7'
      });
      
      // Redirect to orders page or refresh cart
      if (typeof loadCartItems === 'function') {
        loadCartItems(); // Refresh cart display
      }
      
      // Optionally redirect to orders page
      // window.location.href = 'orders.html';
      
    } else {
      throw new Error(result_data.message || 'Failed to create order');
    }
    
  } catch (error) {
    console.error('Checkout error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Order Failed',
      text: error.message || 'Failed to place order. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#e74c3c'
    });
  }
});