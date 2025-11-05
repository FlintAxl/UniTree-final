const API_BASE = '/api/v1';
        let categoryProducts = [];

        function getCategoryId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }

        //category
        async function loadCategoryDetails(categoryId) {
            try {
                const response = await fetch(`${API_BASE}/categories`);
                const data = await response.json();
                const category = data.categories?.find(cat => cat.category_id.toString() === categoryId.toString());

                if (category) {
                    $('#categoryName').text(category.name || 'Category');
                    $('#categoryDescription').text(category.description || 'Browse our products');
                } else {
                    $('#categoryName').text('Category Not Found');
                    $('#categoryDescription').text('The requested category could not be found.');
                }
            } catch {
                $('#categoryName').text('Error Loading Category');
            }
        }

        //categ items
        async function loadCategoryProducts(categoryId) {
            try {
                $('#productGrid').html('<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>');
                const response = await fetch(`${API_BASE}/products`);
                const data = await response.json();

                const products = data.data?.filter(p => p.category_id?.toString() === categoryId.toString()) || [];

                if (!products.length) {
                    $('#productGrid').html(`
                        <div class="empty">
                            <i class="fas fa-box-open" style="font-size:3rem;opacity:0.5;"></i>
                            <p>No products found in this category.</p>
                            <a href="products.html" class="btn btn-primary" style="margin-top:1rem;">Browse All Products</a>
                        </div>
                    `);
                    return;
                }

                categoryProducts = products;
                $('#productCountDisplay').text(`${products.length} ${products.length === 1 ? 'Product' : 'Products'}`);
                $('#currentCount').text(products.length);
                displayProducts(products);

                $('#sortSelect').on('change', function() {
                    displayProducts(sortProducts(products, $(this).val()));
                });
            } catch {
                $('#productGrid').html(`
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading products. Please try again later.</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top:1rem;">Return to Home</a>
                    </div>
                `);
            }
        }

        //products display
        function displayProducts(products) {
            const grid = $('#productGrid').empty();

            if (!products.length) {
                grid.html(`<div class="empty"><i class="fas fa-box-open" style="font-size:3rem;opacity:0.5;"></i><p>No products found.</p></div>`);
                return;
            }

            products.forEach(p => {
                const img = Array.isArray(p.images) && p.images.length ? p.images[0] : 'https://via.placeholder.com/300x200?text=No+Image';
                const price = Number(p.price).toFixed(2);
                const rating = p.rating || (Math.random() * 1 + 4).toFixed(1);

                grid.append(`
                    <div class="product-card" data-product-id="${p.product_id || p.id}" onclick="window.location.href='product-details.html?id=${p.product_id || p.id}'">
                        <div class="product-image">
                            <img src="${img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${p.name}</h3>
                            <div class="product-price-row">
                                <span class="product-price">$${price}</span>
                                <div class="product-rating">
                                    <span class="star">★</span>
                                    <span class="rating-value">${rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });
        }

        //filter
        function sortProducts(products, sortBy) {
            const sorted = [...products];
            switch (sortBy) {
                case 'price-low': return sorted.sort((a, b) => a.price - b.price);
                case 'price-high': return sorted.sort((a, b) => b.price - a.price);
                case 'name-az': return sorted.sort((a, b) => a.name.localeCompare(b.name));
                case 'name-za': return sorted.sort((a, b) => b.name.localeCompare(a.name));
                default: return sorted;
            }
        }

        $(document).ready(() => {
            const categoryId = getCategoryId();
            if (!categoryId) {
                $('#productGrid').html(`
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>No category specified. Please select a category from the home page.</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top:1rem;">Return to Home</a>
                    </div>
                `);
                return;
            }
            loadCategoryDetails(categoryId);
            loadCategoryProducts(categoryId);
        });