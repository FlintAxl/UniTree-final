$(document).ready(function () {
    const token = sessionStorage.getItem('access_token');
    const sellerId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('role');

    // Check if user is a seller
    if (userRole !== 'seller' || !sellerId) {
        Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Only sellers can access this page.'
        }).then(() => {
            window.location.href = 'index.html';
        });
        return;
    }

    // Initialize DataTable for seller's products
    const table = $('#sellerProductsTable').DataTable({
        ajax: {
            url: `${url}api/v1/products/seller/${sellerId}`,
            dataSrc: "products",
            headers: { "Authorization": `Bearer ${token}` }
        },
        dom: 'Bfrtip',
        buttons: [
            'pdf', 'excel',
            {
                text: 'Add Product',
                className: 'btn btn-primary',
                action: function () {
                    $('#createSellerProductForm')[0].reset();
                    $('#createSellerProductModal').modal('show');
                }
            }
        ],
        columns: [
            { data: 'product_id' },
            {
                data: 'images',
                render: function (images) {
                    if (!images || images.length === 0) return 'No image';
                    return images.map(img => `<img src="${url}${img}" width="50" height="50">`).join('');
                }
            },
            { data: 'name' },
            { data: 'category_name', defaultContent: 'No Category' },
            { data: 'description' },
            { 
                data: 'price',
                render: function(data) {
                    return `₱${parseFloat(data).toFixed(2)}`;
                }
            },
            { data: 'stock' },
            {
                data: 'created_at',
                render: function(data) {
                    return new Date(data).toLocaleDateString();
                }
            },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-sm btn-info editSellerProductBtn" data-id="${data.product_id}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteSellerProductBtn" data-id="${data.product_id}">Delete</button>
                    `;
                }
            }
        ],
    });

    // ================= CREATE SELLER PRODUCT =================
    $("#sellerProductSubmit").on('click', function (e) {
        e.preventDefault();

        const name = $('#s_name').val().trim();
        const description = $('#s_description').val().trim();
        const price = $('#s_price').val();
        const stock = $('#s_stock').val();
        const category_id = $('#s_category_id').val();

        if (!name || !description || !price || !stock) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields.'
            });
            return;
        }

        const productData = {
            name: name,
            description: description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category_id: category_id || null
        };

        $.ajax({
            method: "POST",
            url: `${url}api/v1/products/seller/${sellerId}`,
            data: JSON.stringify(productData),
            contentType: 'application/json',
            headers: { Authorization: `Bearer ${token}` },
            success: function (response) {
                Swal.fire({ 
                    icon: "success", 
                    title: "Success!",
                    text: "Product created successfully!" 
                });
                $("#createSellerProductModal").modal("hide");
                table.ajax.reload();
            },
            error: function (xhr) {
                console.log(xhr);
                const errorMsg = xhr.responseJSON?.error || "Failed to create product.";
                Swal.fire({ 
                    icon: "error", 
                    title: "Error",
                    text: errorMsg 
                });
            }
        });
    });

    // ================= EDIT SELLER PRODUCT (open modal) =================
    $(document).on('click', '.editSellerProductBtn', function () {
        const id = $(this).data('id');

        $.ajax({
            method: "GET",
            url: `${url}api/v1/products/${id}`,
            headers: { Authorization: `Bearer ${token}` },
            success: function (data) {
                if (data.success && data.product) {
                    const product = data.product;
                    
                    // Check if this product belongs to the current seller
                    if (product.seller_id != sellerId) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Access Denied',
                            text: 'You can only edit your own products.'
                        });
                        return;
                    }

                    $('#us_productId').val(product.product_id);
                    $('#us_name').val(product.name);
                    $('#us_description').val(product.description);
                    $('#us_price').val(product.price);
                    $('#us_stock').val(product.stock);
                    $('#us_category_id').val(product.category_id);

                    $('#updateSellerProductModal').modal('show');
                } else {
                    Swal.fire({ 
                        icon: "error", 
                        text: "Failed to fetch product details." 
                    });
                }
            },
            error: function () {
                Swal.fire({ 
                    icon: "error", 
                    text: "Failed to fetch product details." 
                });
            }
        });
    });

    // ================= UPDATE SELLER PRODUCT =================
    $("#sellerProductUpdate").on('click', function (e) {
        e.preventDefault();
        const id = $('#us_productId').val();
        
        const name = $('#us_name').val().trim();
        const description = $('#us_description').val().trim();
        const price = $('#us_price').val();
        const stock = $('#us_stock').val();
        const category_id = $('#us_category_id').val();

        if (!name || !description || !price || !stock) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields.'
            });
            return;
        }

        const productData = {
            name: name,
            description: description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category_id: category_id || null
        };

        $.ajax({
            method: "PUT",
            url: `${url}api/v1/products/seller/${sellerId}/${id}`,
            data: JSON.stringify(productData),
            contentType: 'application/json',
            headers: { Authorization: `Bearer ${token}` },
            success: function () {
                Swal.fire({ 
                    icon: "success", 
                    title: "Success!",
                    text: "Product updated successfully!" 
                });
                $('#updateSellerProductModal').modal("hide");
                table.ajax.reload();
            },
            error: function (xhr) {
                const errorMsg = xhr.responseJSON?.error || "Failed to update product.";
                Swal.fire({ 
                    icon: "error", 
                    title: "Error",
                    text: errorMsg 
                });
            }
        });
    });

    // ================= DELETE SELLER PRODUCT =================
    $(document).on('click', '.deleteSellerProductBtn', function () {
        const id = $(this).data('id');
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: "DELETE",
                    url: `${url}api/v1/products/seller/${sellerId}/${id}`,
                    headers: { Authorization: `Bearer ${token}` },
                    success: function () {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Product deleted successfully!"
                        });
                        table.ajax.reload();
                    },
                    error: function (xhr) {
                        const errorMsg = xhr.responseJSON?.error || "Failed to delete product.";
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: errorMsg
                        });
                    }
                });
            }
        });
    });

    // Load categories for dropdowns
    loadSellerCategories();
});

// Function to load categories for seller forms
function loadSellerCategories() {
    $.ajax({
        url: `${url}api/v1/categories`,
        method: 'GET',
        success: function (response) {
            if (response.categories) {
                let options = '<option value="">Select Category (Optional)</option>' + 
                    response.categories.map(c =>
                        `<option value="${c.category_id}">${c.name}</option>`
                    ).join('');
                $("#s_category_id").html(options);
                $("#us_category_id").html(options);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to load categories:", error);
        }
    });
}