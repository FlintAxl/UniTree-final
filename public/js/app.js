// =====================
// Toast Notification
// =====================
function showToast(message, type = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: type,
        title: message
    });
}

// =====================
// Image Error Handler
// =====================
function getPlaceholderImage() {
    // Create a data URL for a simple gray placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No Image', 150, 100);
    return canvas.toDataURL();
}

function handleImageError(img) {
    img.onerror = null; // Prevent infinite loop
    img.src = getPlaceholderImage();
}

// =====================
// Navigation Management
// =====================
function initializeNavigation() {
    const token = sessionStorage.getItem('access_token');
    const userId = sessionStorage.getItem('userId');
    const joinNowBtn = document.getElementById('joinNowBtn');
    const joinDropdown = document.getElementById('joinDropdown');
  
    if (!joinNowBtn || !joinDropdown) return;
  
    if (userId && token) {
      // User is logged in - show profile dropdown
      const userName = sessionStorage.getItem('user_name') || 'User';
      const userEmail = sessionStorage.getItem('user_email') || '';
      const userInitial = userName.charAt(0).toUpperCase();
  
      // SHOW ONLY THE INITIAL CIRCLE (NO USERNAME TEXT)
      joinNowBtn.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                    display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
          ${userInitial}
        </div>
      `;
  
      joinDropdown.innerHTML = `
        <div class="dropdown-header">
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                        display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
              ${userInitial}
            </div>
            <div>
              <div style="font-weight: bold;">${userName}</div>
              <div style="font-size: 0.8rem; color: #666;">${userEmail}</div>
            </div>
          </div>
        </div>
        <a href="profile.html">Profile Information</a>
        <a href="security.html">Security & Password</a>
        <a href="#" id="logoutBtnNav">Logout</a>
      `;
  
      // Attach logout handler AFTER HTML injection
      const logoutBtn = document.getElementById('logoutBtnNav');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
      }
  
    } else {
      // Not logged in -> show Join Now menu
      showJoinNowDropdown();
    }
  }
  
  // Reset nav to default state (Join Now + Login/Register links)
  function showJoinNowDropdown() {
    const joinNowBtn = document.getElementById('joinNowBtn');
    const joinDropdown = document.getElementById('joinDropdown');
    if (!joinNowBtn || !joinDropdown) return;
  
    joinNowBtn.innerHTML = 'Join Now';
    joinDropdown.innerHTML = `
      <a href="login.html">Log In</a>
      <a href="register.html">Register</a>
    `;
  }
  
  // =====================
  // Logout Handler
  // =====================
  function handleLogout(e) {
    e.preventDefault();
  
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('access_token');
  
    if (!userId || !token) {
      Swal.fire('Notice', 'You are not logged in.', 'info');
      return;
    }
  
    // Ask for confirmation before logging out
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4ade80',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, stay logged in'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes" - proceed with logout
        $.ajax({
          method: 'POST',
          url: '/api/v1/logout',
          contentType: 'application/json',
          headers: { 'Authorization': `Bearer ${token}` },
          data: JSON.stringify({ id: parseInt(userId, 10) }),
          success: function () {
            // Clear session storage
            sessionStorage.clear();
            showJoinNowDropdown();
  
            Swal.fire({
              icon: 'success',
              title: 'Logged out!',
              text: 'You have been logged out successfully.',
              showConfirmButton: true
            }).then(() => {
              window.location.href = 'index.html';
            });
          },
          error: function (xhr) {
            console.error('Logout error:', xhr.responseText);
            // Still clear session even if backend logout fails
            sessionStorage.clear();
            showJoinNowDropdown();
  
            Swal.fire({
              icon: 'success',
              title: 'Logged out!',
              text: 'You have been logged out successfully.',
              showConfirmButton: true
            }).then(() => {
              window.location.href = 'index.html';
            });
          }
        });
      } else {
        // User cancelled logout
        console.log('Logout cancelled by user');
      }
    });
  }
  
  
  // =====================
  // Existing functionality
  // =====================
  async function fetchProducts() {
      const res = await fetch("/api/v1/products");
      const json = await res.json();
      // Backend returns { data: [...] }
      return Array.isArray(json?.data) ? json.data : [];
  }
  
  // Fetch sellers from the backend API
  async function fetchSellers() {
      try {
          // First, fetch all products to get unique seller IDs
          const productsRes = await fetch("/api/v1/products");
          const productsData = await productsRes.json();
          const products = Array.isArray(productsData?.data) ? productsData.data : [];
          
          console.log("Products for sellers:", products);
          
          if (products.length === 0) {
              console.warn("No products found");
              return [];
          }
          
          // Get unique seller IDs from products
          const sellerIds = [...new Set(products.map(p => p.seller_id).filter(id => id))];
          console.log("Unique seller IDs found:", sellerIds);
          
          if (sellerIds.length === 0) {
              console.warn("No seller IDs found in products");
              return [];
          }
          
          // Create sellers array from unique seller IDs
          const sellers = sellerIds.map(sellerId => {
              const sellerProducts = products.filter(p => p.seller_id === sellerId);
              const productCount = sellerProducts.length;
              
              // Get seller info from first product (if available in product data)
              const firstProduct = sellerProducts[0];
              const sellerName = firstProduct.seller_name || firstProduct.seller_username || `Seller ${sellerId}`;
              
              return {
                  id: sellerId,
                  name: sellerName,
                  username: sellerName.toLowerCase().replace(/\s+/g, ''),
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=16a34a&color=fff&size=200&bold=true`,
                  rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0-5.0
                  products_count: productCount,
                  role: 'seller'
              };
          });
          
          console.log("Sellers created:", sellers);
          return sellers;
          
      } catch (error) {
          console.error("Error fetching sellers:", error);
          return [];
      }
  }
  
  async function fetchCategories() {
    try {
        const res = await fetch("/api/v1/categories");
        const json = await res.json();
        const categories = Array.isArray(json?.categories) ? json.categories : [];
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// FIXED: Get product count by category from all products
async function getProductCountByCategory(categoryId) {
    try {
        // Fetch all products
        const products = await fetchProducts();
        
        // Filter products by category_id
        const categoryProducts = products.filter(p => 
            p.category_id == categoryId || p.categoryId == categoryId
        );
        
        return categoryProducts.length;
    } catch (error) {
        console.error('Error getting product count for category:', categoryId, error);
        return 0;
    }
}
  
  // Check login status for UI elements
  const isLoggedIn = sessionStorage.getItem('access_token') !== null;

  // ----------------------------
  // Render Products (NFTs)
  // ----------------------------
  const nftContainer = document.getElementById("popularCards");
  const allProductsContainer = document.getElementById("allProducts");
  
  function renderProducts() {
      fetchProducts().then(products => {
          console.log("Products fetched:", products);
          nftContainer.innerHTML = "";
          
          // Render popular products (first 10)
          const popularProducts = products.slice(0, 10);
          renderProductCarousel(popularProducts, nftContainer);
          
          // Render all products
          renderProductCarousel(products, allProductsContainer, 'all-products');
          
          // Initialize carousels
          initCarousel('.product-carousel', '.carousel-prev', '.carousel-next');
          initCarousel('.all-products-carousel', '.all-products-prev', '.all-products-next');
      });
  }
  
  function renderProductCarousel(products, container, type = 'popular') {
      container.innerHTML = "";
      
      // Create a wrapper for the carousel items
      const carouselWrapper = document.createElement('div');
      carouselWrapper.style.display = 'flex';
      carouselWrapper.style.gap = '1.5rem';
      carouselWrapper.style.width = 'max-content';
      carouselWrapper.style.padding = '1rem 2rem';
      
      products.forEach(product => {
          const firstImage = Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : getPlaceholderImage();
          const productId = product.product_id ?? product.id ?? '';
          const title = product.name ?? product.title ?? 'Untitled';
          const price = Number(product.price).toFixed(2);
          const rating = product.rating || (Math.random() * 1 + 4).toFixed(1);
          
          const productCard = document.createElement('div');
          productCard.className = 'product-card';
          productCard.style.flex = '0 0 280px';
          productCard.style.scrollSnapAlign = 'start';
          productCard.style.background = '#fff';
          productCard.style.borderRadius = '12px';
          productCard.style.overflow = 'hidden';
          productCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
          productCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          productCard.style.cursor = 'pointer';
          productCard.style.position = 'relative';
              
              productCard.innerHTML = `
                  <div style="position: relative; padding-bottom: 75%; overflow: hidden;">
                      <img src="${firstImage}" 
                           alt="${title}" 
                           style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
                           onerror="handleImageError(this)"
                      >
                  </div>
                  <div style="padding: 1.25rem;">
                      <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${title}
                      </h3>
                      <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
                          <span style="font-size: 1.1rem; font-weight: 700; color: #111827;">₱${price}</span>
                          <div style="margin-left: auto; display: flex; align-items: center; background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px;">
                              <span style="color: #f59e0b; margin-right: 0.25rem;">★</span>
                              <span style="font-size: 0.875rem; color: #4b5563;">${rating}</span>
                          </div>
                      </div>
                      <div style="display: flex; gap: 0.5rem;">
                          <button class="btn-add-cart" 
                                  style="flex: 1; background: #10b981; color: white; border: none; border-radius: 6px; padding: 0.5rem; font-weight: 500; cursor: pointer; transition: background 0.2s ease;"
                                  data-id="${productId}"
                                  data-name="${title}"
                                  data-price="${price}"
                                  data-image="${firstImage}">
                              Add to Cart
                          </button>
                          <button class="btn-view-details" 
                                  style="background: none; border: 1px solid #d1d5db; border-radius: 6px; padding: 0.5rem; cursor: pointer; transition: background 0.2s ease;"
                                  onclick="window.location.href='product-details.html?id=${productId}'">
                              <i class="fas fa-arrow-right" style="color: #4b5563;"></i>
                          </button>
                      </div>
                  </div>
              `;
              
              // Add hover effect
              productCard.addEventListener('mouseenter', () => {
                  productCard.style.transform = 'translateY(-5px)';
                  productCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                  productCard.querySelector('img').style.transform = 'scale(1.05)';
              });
              
              productCard.addEventListener('mouseleave', () => {
                  productCard.style.transform = 'translateY(0)';
                  productCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  productCard.querySelector('img').style.transform = 'scale(1)';
              });
              
              container.appendChild(productCard);
          });
  }
  
  function initCarousel(carouselSelector, prevBtnSelector, nextBtnSelector) {
      const carousel = document.querySelector(carouselSelector);
      const prevBtn = document.querySelector(prevBtnSelector);
      const nextBtn = document.querySelector(nextBtnSelector);
      const itemWidth = 300; // Width of each card (280px) + gap (20px)
      
      if (!carousel || !prevBtn || !nextBtn) return;
      
      // Ensure carousel has proper styles for horizontal scrolling
      carousel.style.display = 'flex';
      carousel.style.overflowX = 'auto';
      carousel.style.scrollBehavior = 'smooth';
      carousel.style.scrollSnapType = 'x mandatory';
      carousel.style.webkitOverflowScrolling = 'touch';
      carousel.style.scrollbarWidth = 'none'; // Firefox
      carousel.style.msOverflowStyle = 'none'; // IE/Edge
      
      // Hide scrollbar for Webkit browsers
      carousel.style.overflow = '-webkit-paged-x';
      carousel.style.overflow = '-moz-scrollbars-none';
      
      // Calculate how many items are fully visible
      const getVisibleItemsCount = () => {
          return Math.floor(carousel.clientWidth / itemWidth) || 1;
      };
      
      // Navigation handlers with dynamic scroll amount
      const scrollNext = () => {
          const visibleItems = getVisibleItemsCount();
          carousel.scrollBy({
              left: itemWidth * visibleItems,
              behavior: 'smooth'
          });
      };
      
      const scrollPrev = () => {
          const visibleItems = getVisibleItemsCount();
          carousel.scrollBy({
              left: -itemWidth * visibleItems,
              behavior: 'smooth'
          });
      };
      
      nextBtn.addEventListener('click', scrollNext);
      prevBtn.addEventListener('click', scrollPrev);
      
      // Enable/disable buttons based on scroll position
      const updateNavButtons = () => {
          const maxScroll = carousel.scrollWidth - carousel.clientWidth;
          const isAtStart = carousel.scrollLeft < 10;
          const isAtEnd = carousel.scrollLeft > maxScroll - 10;
          
          prevBtn.disabled = isAtStart;
          nextBtn.disabled = isAtEnd;
          
          // Visual feedback
          prevBtn.style.opacity = isAtStart ? '0.5' : '1';
          prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
          
          nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
          nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
      };
      
      // Initialize
      carousel.addEventListener('scroll', updateNavButtons);
      window.addEventListener('resize', updateNavButtons);
      updateNavButtons();
      
      // Add touch support for mobile
      let isDown = false;
      let startX;
      let scrollLeft;
      
      carousel.addEventListener('mousedown', (e) => {
          isDown = true;
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
          carousel.style.cursor = 'grabbing';
          carousel.style.scrollSnapType = 'none';
      });
      
      carousel.addEventListener('mouseleave', () => {
          isDown = false;
          carousel.style.cursor = 'grab';
          carousel.style.scrollSnapType = 'x mandatory';
      });
      
      carousel.addEventListener('mouseup', () => {
          isDown = false;
          carousel.style.cursor = 'grab';
          carousel.style.scrollSnapType = 'x mandatory';
      });
      
      carousel.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          const walk = (x - startX) * 1.5; // Scroll speed
          carousel.scrollLeft = scrollLeft - walk;
      });
  }
  
  // ----------------------------
  // Render Sellers
  // ----------------------------
  const sellerContainer = document.getElementById("sellerCards");
  
  function renderSellers() {
      console.log("Fetching sellers...");
      fetchSellers().then(sellers => {
          console.log("Sellers fetched:", sellers);
          sellerContainer.innerHTML = "";
          
          if (!sellers || !sellers.length) {
              console.warn("No sellers found or empty response");
              sellerContainer.innerHTML = `
                  <div style="text-align: center; padding: 2rem; color: #6b7280; width: 100%;">
                      <p>No sellers available at the moment.</p>
                      <p>Check the console for more details.</p>
                  </div>
              `;
              return;
          }
  
          sellers.forEach((seller, index) => {
              console.log(`Processing seller ${index + 1}:`, seller);
              const sellerCard = document.createElement('div');
              sellerCard.className = 'seller-card';
              sellerCard.style.flex = '0 0 200px';
              sellerCard.style.scrollSnapAlign = 'start';
              sellerCard.style.background = '#fff';
              sellerCard.style.borderRadius = '12px';
              sellerCard.style.overflow = 'hidden';
              sellerCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              sellerCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
              sellerCard.style.cursor = 'pointer';
              sellerCard.style.position = 'relative';
              sellerCard.style.textAlign = 'center';
              sellerCard.style.padding = '1.5rem 1rem';
              
              const sellerImage = seller.avatar || getPlaceholderImage();
              const sellerName = seller.name || seller.username || 'Seller';
              const sellerRating = seller.rating || (Math.random() * 1 + 4).toFixed(1);
              const productsCount = seller.products_count || Math.floor(Math.random() * 50) + 10;
              
              sellerCard.innerHTML = `
                  <div style="width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; border: 3px solid #f3f4f6;">
                      <img src="${sellerImage}" 
                           alt="${sellerName}" 
                           style="width: 100%; height: 100%; object-fit: cover;"
                           onerror="handleImageError(this)"
                      >
                  </div>
                  <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 600; color: #1f2937;">
                      ${sellerName}
                  </h3>
                  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                      <span style="color: #f59e0b; margin-right: 0.25rem;">★</span>
                      <span style="font-size: 0.9rem; color: #4b5563;">${sellerRating}</span>
                  </div>
                  <div style="font-size: 0.85rem; color: #6b7280;">
                      ${productsCount} products
                  </div>
                  <button class="btn-view-shop" 
                          style="margin-top: 1rem; background: #f3f4f6; border: none; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.9rem; cursor: pointer; transition: background 0.2s ease;"
                          data-seller-id="${seller.id || ''}">
                      View Shop
                  </button>
              `;
              
              // Add hover effect
              sellerCard.addEventListener('mouseenter', () => {
                  sellerCard.style.transform = 'translateY(-5px)';
                  sellerCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              });
              
              sellerCard.addEventListener('mouseleave', () => {
                  sellerCard.style.transform = 'translateY(0)';
                  sellerCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              });
              
              sellerContainer.appendChild(sellerCard);
          });
          
          // Add click handler for View Shop buttons
          document.addEventListener('click', function(e) {
              if (e.target.closest('.btn-view-shop')) {
                  e.preventDefault();
                  e.stopPropagation();
                  const sellerId = e.target.closest('.btn-view-shop').getAttribute('data-seller-id');
                  if (sellerId) {
                      window.location.href = `seller-profile.html?id=${sellerId}`;
                  }
              } else if (e.target.closest('.seller-card')) {
                  // If clicking anywhere on the seller card (except the button), also navigate to the shop
                  const btn = e.target.closest('.seller-card').querySelector('.btn-view-shop');
                  if (btn) {
                      const sellerId = btn.getAttribute('data-seller-id');
                      if (sellerId) {
                          window.location.href = `seller-profile.html?id=${sellerId}`;
                      }
                  }
              }
          });
          
          // Initialize sellers carousel
          initCarousel('.sellers-carousel', '.sellers-prev', '.sellers-next');
      });
  }
  
  // ----------------------------
  // Render Categories
  // ----------------------------
  const categoryContainer = document.getElementById("categoryCards");
  
  async function renderCategories() {
    try {
      const categories = await fetchCategories();
      console.log("Categories fetched:", categories);
      categoryContainer.innerHTML = "";

      // Define the desired category order
      const categoryOrder = ['Craft', 'Necessity', 'Tech'];
      
      // Sort categories based on the defined order
      const sortedCategories = [...categories].sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.name);
          const indexB = categoryOrder.indexOf(b.name);
          
          // If a category is not in the order array, put it at the end
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
      });

      // Process each category and get their counts in parallel
      const categoriesWithCounts = await Promise.all(
        sortedCategories.map(async (category) => {
          const categoryId = category.id || category.category_id;
          const itemCount = await getProductCountByCategory(categoryId);
          return { ...category, itemCount };
        })
      );

      // Now render the categories with their counts
      categoriesWithCounts.forEach(category => {
          const categoryId = category.id || category.category_id;
          const categoryEmoji = getCategoryEmoji(category.name);
          const categoryImage = getCategoryImage(category.name);
          const itemCount = category.itemCount;
            
          categoryContainer.innerHTML += `
                <div class="product-card" style="cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;"
                     onclick="viewCategory('${categoryId}')">
                    <div class="product-card-image" style="height: 200px; overflow: hidden;">
                        <img src="${category.image || categoryImage}" 
                             alt="${category.name}" 
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="handleImageError(this)" />
                    </div>
                    <div class="product-card-content" style="padding: 1rem;">
                        <h3 class="product-title" style="margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: 600;">
                            ${category.name}
                        </h3>
                        <div class="product-stats" style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="product-price-small" style="font-size: 0.9rem; color: #4b5563;">
                                ${itemCount} Item${itemCount !== 1 ? 's' : ''}
                            </span>
                            <span class="product-rating" style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">
                                ${categoryEmoji}
                            </span>
                        </div>
                        <div class="product-actions" style="margin-top: 1rem;">
                            <button class="btn btn-primary" 
                                    style="width: 100%; padding: 0.5rem; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
                                    onclick="event.stopPropagation(); viewCategory('${categoryId}')">
                                View Items
                            </button>
                        </div>
                    </div>
                </div>
            `;
      });
    } catch (error) {
      console.error('Error rendering categories:', error);
      categoryContainer.innerHTML = '<p>Error loading categories. Please try again later.</p>';
    }
  }

// Helper function to get emoji based on category name
function getCategoryEmoji(categoryName) {
    if (!categoryName) return '🔥 Popular';
    
    const name = categoryName.toLowerCase();
    if (name.includes('craft')) return '🎨 Crafts';
    if (name.includes('necessity')) return '🛍️ Necessities';
    if (name.includes('tech')) return '💻 Tech';
    return '🔥 Popular';
}

// Helper function to get category-specific image
function getCategoryImage(categoryName) {
    if (!categoryName) return getPlaceholderImage();
    
    const name = categoryName.toLowerCase();
    if (name.includes('craft')) return 'images/crafts.jpg';
    if (name.includes('necessity')) return 'images/necessity.jpg';
    if (name.includes('tech')) return 'images/tech.jpg';
    return getPlaceholderImage();
}
  
  function initHorizontalScroll() {
      const productGrid = document.querySelector('.product-grid');
      if (!productGrid) return;
  
      const scrollAmount = 300;
  
      document.getElementById('scrollLeft')?.addEventListener('click', () => {
          productGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
  
      document.getElementById('scrollRight')?.addEventListener('click', () => {
          productGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
  
      let isDown = false, startX, scrollLeft;
  
      productGrid.addEventListener('mousedown', (e) => {
          isDown = true;
          startX = e.pageX - productGrid.offsetLeft;
          scrollLeft = productGrid.scrollLeft;
          productGrid.style.cursor = 'grabbing';
      });
  
      productGrid.addEventListener('mouseleave', () => {
          isDown = false;
          productGrid.style.cursor = 'grab';
      });
  
      productGrid.addEventListener('mouseup', () => {
          isDown = false;
          productGrid.style.cursor = 'grab';
      });
  
      productGrid.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - productGrid.offsetLeft;
          const walk = (x - startX) * 2;
          productGrid.scrollLeft = scrollLeft - walk;
      });
  }
  
  // ----------------------------
  // Horizontal Scroll for Sellers
  // ----------------------------
  function initSellersHorizontalScroll() {
      const sellersGrid = document.querySelector('.sellers-grid');
      if (!sellersGrid) return;
  
      const scrollAmount = 220;
  
      document.getElementById('sellersScrollLeft')?.addEventListener('click', () => {
          sellersGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
  
      document.getElementById('sellersScrollRight')?.addEventListener('click', () => {
          sellersGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
  
      let isDown = false, startX, scrollLeft;
  
      sellersGrid.addEventListener('mousedown', (e) => {
          isDown = true;
          sellersGrid.classList.add('active');
          startX = e.pageX - sellersGrid.offsetLeft;
          scrollLeft = sellersGrid.scrollLeft;
          sellersGrid.style.cursor = 'grabbing';
      });
  
      sellersGrid.addEventListener('mouseleave', () => {
          isDown = false;
          sellersGrid.classList.remove('active');
          sellersGrid.style.cursor = 'grab';
      });
  
      sellersGrid.addEventListener('mouseup', () => {
          isDown = false;
          sellersGrid.classList.remove('active');
          sellersGrid.style.cursor = 'grab';
      });
  
      sellersGrid.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - sellersGrid.offsetLeft;
          const walk = (x - startX) * 2;
          sellersGrid.scrollLeft = scrollLeft - walk;
      });
  
      sellersGrid.style.cursor = 'grab';
  
      document.addEventListener('keydown', (e) => {
          if (e.target.closest('.sellers-grid')) {
              if (e.key === 'ArrowLeft') {
                  sellersGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              } else if (e.key === 'ArrowRight') {
                  sellersGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }
          }
      });
  }
  
  // ----------------------------
  // Scroll reveal for sections
  // ----------------------------
  function initScrollReveal() {
      const elements = document.querySelectorAll('.scroll-reveal');
      if (elements.length === 0) return;
  
      const reveal = (entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
          }
      };
  
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(reveal);
      }, { threshold: 0.1 });
  
      elements.forEach(el => observer.observe(el));
  }
  
  // =====================
  // Dropdown functionality
  // =====================
  function setupDropdown() {
      const joinBtn = document.getElementById('joinNowBtn');
      const dropdown = document.querySelector('.dropdown');
      const joinDropdown = document.getElementById('joinDropdown');
  
      if (joinBtn && joinDropdown) {
          // Desktop hover behavior
          if (window.innerWidth > 768) {
              dropdown.addEventListener('mouseenter', () => {
                  joinDropdown.classList.add('show');
              });
              
              dropdown.addEventListener('mouseleave', () => {
                  joinDropdown.classList.remove('show');
              });
          }
          
          // Mobile click behavior
          joinBtn.addEventListener('click', (e) => {
              if (window.innerWidth <= 768) {
                  e.stopPropagation();
                  joinDropdown.classList.toggle('show');
              }
          });
  
          // Close dropdown when clicking outside
          document.addEventListener('click', (e) => {
              if (!dropdown.contains(e.target)) {
                  joinDropdown.classList.remove('show');
              }
          });
      }
  }

  // =====================
// View Category Function
// =====================
function viewCategory(categoryId) {
    if (!categoryId) {
        console.error('No category ID provided');
        return;
    }
    window.location.href = `category-products.html?id=${categoryId}`;
}
  
  // =====================
  // Initialize everything when DOM is loaded
  // =====================
  document.addEventListener('DOMContentLoaded', function() {
      // Initialize navigation first
      initializeNavigation();
      
      // Setup dropdown functionality
      setupDropdown();
      
      // Initialize your existing functionality
      renderProducts();
      renderSellers();
      renderCategories();
      initHorizontalScroll();
      initSellersHorizontalScroll();
  });