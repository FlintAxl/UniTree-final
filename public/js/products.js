// Main Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const recommendedProducts = document.getElementById('recommendedProducts');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const searchInput = document.querySelector('#searchInput, .search-container input');
    const searchButton = document.getElementById('searchButton');
    
    // State
    let products = [];
    let filteredProducts = [];
    let categories = [];
    let currentPage = 1;
    const productsPerPage = 12;
    
    // Initialize the page
    function init() {
        fetchProducts();
        fetchRecommendations();
        setupEventListeners();
        updateCartCount();
    }
    
    // Update cart count in the header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(el => el.textContent = totalItems);
    }
    
    // Fetch products from API
    async function fetchProducts() {
        showLoading();
        try {
            const response = await fetch('/api/v1/products');
            const data = await response.json();
            products = Array.isArray(data.data) ? data.data : [];
            filteredProducts = [...products];
            
            // Extract categories from products
            extractCategories();
            populateCategoryFilter();
            
            renderProducts(filteredProducts);
            sortProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            showError('Failed to load products. Please try again later.');
        } finally {
            hideLoading();
        }
    }
    
    // Fetch recommendations (you can modify this to get specific recommended products)
    async function fetchRecommendations() {
        try {
            const response = await fetch('/api/v1/products');
            const data = await response.json();
            const allProducts = Array.isArray(data.data) ? data.data : [];
            
            // Get first 6 products as recommendations (you can implement better logic)
            const recommendations = allProducts.slice(0, 6);
            renderRecommendations(recommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            if (recommendedProducts) {
                recommendedProducts.innerHTML = '<div class="empty-state"><p>Unable to load recommendations</p></div>';
            }
        }
    }
    
    // Extract categories from products
    function extractCategories() {
        const categorySet = new Set();
        products.forEach(product => {
            if (product.category) {
                categorySet.add(product.category);
            } else if (product.category_name) {
                categorySet.add(product.category_name);
            }
        });
        categories = Array.from(categorySet);
    }
    
    // Populate category filter dropdown
    function populateCategoryFilter() {
        if (!categoryFilter) return;
        
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // Search functionality
    function searchProducts() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => {
                const name = (product.name || product.product_name || '').toLowerCase();
                const category = (product.category || product.category_name || '').toLowerCase();
                const description = (product.description || '').toLowerCase();
                
                return name.includes(searchTerm) || 
                       category.includes(searchTerm) || 
                       description.includes(searchTerm);
            });
        }
        
        // Apply category filter if selected
        if (categoryFilter && categoryFilter.value) {
            const selectedCategory = categoryFilter.value;
            filteredProducts = filteredProducts.filter(product => 
                (product.category === selectedCategory) || 
                (product.category_name === selectedCategory)
            );
        }
        
        sortProducts();
    }
    
    // Sort products based on selected option
    function sortProducts() {
        if (!sortBy) return;
        
        const sortValue = sortBy.value;
        let sortedProducts = [...filteredProducts];
        
        sortedProducts.sort((a, b) => {
            switch (sortValue) {
                case 'price_low':
                    return (parseFloat(a.price || a.product_price || 0)) - (parseFloat(b.price || b.product_price || 0));
                case 'price_high':
                    return (parseFloat(b.price || b.product_price || 0)) - (parseFloat(a.price || a.product_price || 0));
                case 'name_asc':
                    return (a.name || a.product_name || '').localeCompare(b.name || b.product_name || '');
                case 'name_desc':
                    return (b.name || b.product_name || '').localeCompare(a.name || a.product_name || '');
                case 'newest':
                default:
                    return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
            }
        });
        
        renderProducts(sortedProducts);
    }
    
    // Render products in the grid
    function renderProducts(productsToRender) {
        if (!productsGrid) return;
        
        if (!productsToRender || productsToRender.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = productsToRender.map(product => createProductCard(product)).join('');
        productsGrid.innerHTML = productsHTML;
    }
    
    // Render recommendations
    function renderRecommendations(recommendationsToRender) {
        if (!recommendedProducts) return;
        
        if (!recommendationsToRender || recommendationsToRender.length === 0) {
            recommendedProducts.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>No recommendations available</h3>
                    <p>Check back later for personalized recommendations</p>
                </div>
            `;
            return;
        }
        
        const recommendationsHTML = recommendationsToRender.map(product => createProductCard(product)).join('');
        recommendedProducts.innerHTML = recommendationsHTML;
    }
    
    // Create HTML for a single product card
    function createProductCard(product) {
        const productId = product.id || product._id || product.product_id;
        const productName = product.name || product.product_name || 'Unnamed Product';
        const productPrice = parseFloat(product.price || product.product_price || 0);
        
        // Handle product images - support both string and array formats
        let productImage = 'https://via.placeholder.com/300x220?text=No+Image';
        if (Array.isArray(product.images) && product.images.length > 0) {
            productImage = product.images[0].startsWith('http') ? product.images[0] : `/${product.images[0]}`;
        } else if (typeof product.image === 'string' && product.image) {
            productImage = product.image.startsWith('http') ? product.image : `/${product.image}`;
        } else if (product.image_url) {
            productImage = product.image_url.startsWith('http') ? product.image_url : `/${product.image_url}`;
        }
        
        const productCategory = product.category || product.category_name || 'Uncategorized';
        const isOnSale = product.onSale || product.on_sale || false;
        const originalPrice = product.originalPrice || product.original_price || productPrice;
        
        // Format price with 2 decimal places
        const formattedPrice = productPrice.toFixed(2);
        const formattedOriginalPrice = parseFloat(originalPrice).toFixed(2);
        
        return `
            <div class="product-card">
                ${isOnSale ? `<div class="product-badge">Sale</div>` : ''}
                
                <div class="product-image-container">
                    <img src="${productImage}" 
                         class="product-image" 
                         alt="${productName}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/300x220?text=Image+Not+Available'"
                         onclick="viewDetails('${productId}')">
                </div>
                
                <div class="product-info">
                    <div class="product-category">${productCategory}</div>
                    
                    <h3 class="product-title">${productName}</h3>
                    
                    <div class="product-price">
                        $${formattedPrice}
                        ${isOnSale && originalPrice > productPrice ? 
                            `<span class="product-original-price">$${formattedOriginalPrice}</span>` : ''
                        }
                    </div>
                    
                    <div class="product-actions">
                        <button class="add-to-cart" 
                                data-id="${productId}"
                                data-name="${productName.replace(/"/g, '&quot;')}"
                                data-price="${productPrice}"
                                data-image="${productImage}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        
                        <button class="buy-now" 
                                data-id="${productId}"
                                data-name="${productName.replace(/"/g, '&quot;')}"
                                data-price="${productPrice}"
                                data-image="${productImage}">
                            <i class="fas fa-bolt"></i>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Filter products by category
    function filterProducts() {
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        
        if (!selectedCategory) {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => 
                (product.category === selectedCategory) || 
                (product.category_name === selectedCategory)
            );
        }
        
        // Apply search if there's a search term
        if (searchInput && searchInput.value.trim()) {
            searchProducts();
        } else {
            sortProducts();
        }
    }
    
    // Helper functions
    function showLoading() {
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            `;
        }
    }
    
    function hideLoading() {
        // Loading will be replaced when products are rendered
    }
    
    function showError(message) {
        console.error(message);
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Products</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', debounce(searchProducts, 300));
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchProducts();
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                searchProducts();
            });
        }
        
        // Category filter change
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterProducts);
        }
        
        // Sort by change
        if (sortBy) {
            sortBy.addEventListener('change', sortProducts);
        }
        
        // Handle both Add to Cart and Buy Now button clicks
        document.addEventListener('click', function(e) {
            // Handle Add to Cart button
            if (e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-cart');
                const productId = button.getAttribute('data-id');
                const productName = button.getAttribute('data-name');
                const productPrice = parseFloat(button.getAttribute('data-price'));
                const productImage = button.getAttribute('data-image');
                
                // Check if user is logged in
                const isLoggedIn = sessionStorage.getItem('access_token') !== null;
                if (!isLoggedIn) {
                    if (confirm('You need to log in to add items to your cart. Would you like to log in now?')) {
                        window.location.href = 'login.html';
                    }
                    return;
                }
                
                // Create product object with all necessary data
                const productData = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Add to cart using cart.js function
                if (typeof addToCart === 'function') {
                    addToCart(productData);
                } else {
                    // Fallback: add directly to localStorage
                    addToCartFallback(productData);
                }
                
                // Show success message
                showToast(`${productName} added to cart!`);
                
                // Update cart count
                updateCartCount();
            }
            
            // Handle Buy Now button
            if (e.target.closest('.buy-now')) {
                e.preventDefault();
                const button = e.target.closest('.buy-now');
                const productId = button.getAttribute('data-id');
                const productName = button.getAttribute('data-name');
                const productPrice = parseFloat(button.getAttribute('data-price'));
                const productImage = button.getAttribute('data-image');
                
                // Check if user is logged in
                const isLoggedIn = sessionStorage.getItem('access_token') !== null;
                if (!isLoggedIn) {
                    if (confirm('You need to log in to proceed with your purchase. Would you like to log in now?')) {
                        window.location.href = 'login.html';
                    }
                    return;
                }
                
                // Create product object with all necessary data
                const productData = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Add to cart using cart.js function or fallback
                if (typeof addToCart === 'function') {
                    addToCart(productData);
                } else {
                    addToCartFallback(productData);
                }
                
                // Show success message and redirect
                showToast(`Added ${productName} to cart! Redirecting to checkout...`);
                
                // Redirect to cart page after a short delay
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1000);
            }
        });
    }
    
    // Fallback function to add to cart if cart.js is not loaded
    function addToCartFallback(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Show toast notification
    function showToast(message) {
        // Use SweetAlert2 if available
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Success!',
                text: message,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });
            return;
        }
        
        // Fallback toast
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
        }, 3000);
    }
    
    // Global functions for other pages to use
    window.viewDetails = function(productId) {
        window.location.href = `product-details.html?id=${productId}`;
    };
    
    window.showLoginModal = function() {
        if (confirm('You need to log in to continue. Would you like to log in now?')) {
            window.location.href = 'login.html';
        }
    };
    
    // Initialize the page
    init();
});