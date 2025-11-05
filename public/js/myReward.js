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

    // Fetch total coins only
    $.ajax({
        url: `${url}api/v1/my-rewards/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            if (response && response.data && response.data.total_coins !== undefined) {
                $('#totalCoins').text(response.data.total_coins);
            } else {
                $('#totalCoins').text('0');
            }
        },
        error: function () {
            Swal.fire('Error', 'Failed to load rewards. Please try again.', 'error');
            $('#totalCoins').text('0');
        }
    });

    // ✅ Function to get frame color based on level
    function getFrameColor(level) {
        if (level < 4) return ''; // No special color for levels 1-3

        const colors = ['lightblue', 'purple', 'pink', 'yellow', 'green'];
        const index = (level - 4) % colors.length;
        return colors[index];
    }

    // ✅ NEW: Fetch and display user's pet
    $.ajax({
        url: `${url}api/v1/pets/user/${userId}`,
        method: 'GET',
        success: function (response) {
            if (response.success && response.pet) {
                const pet = response.pet;
                // Prefer server-provided display_image when available.
                // Otherwise clamp client-side: any level >= 3 uses level3 image.
                let currentImage = pet.display_image || null;
                if (!currentImage) {
                    const lvl = Number(pet.level) || 1;
                    if (lvl >= 3) currentImage = pet.level3_image || pet.level2_image || pet.level1_image;
                    else if (lvl === 2) currentImage = pet.level2_image || pet.level1_image;
                    else currentImage = pet.level1_image || 'default-pet.png';
                }

                // ensure a filename string and compute gif fallback
                currentImage = currentImage || 'default-pet.png';
                const currentGif = currentImage.endsWith('.png')
                    ? currentImage.replace(/\.png$/i, '.gif')
                    : currentImage + '.gif';

                // Get frame color based on level
                const frameColor = getFrameColor(pet.level);
                const frameStyle = frameColor ? `border: 4px solid ${frameColor}; box-shadow: 0 0 15px ${frameColor};` : '';

                const petHtml = `
<div class="card pet-card text-center" style="${frameStyle}">
  <div class="card-body">
  <!--PNG + GIF-->
    <img src="/images/${currentImage}" alt="${pet.pet_name}" 
         class="pet-image img-fluid rounded-circle" 
         style="width: 150px; height: 150px; object-fit: cover;">
    <img src="/images/${currentGif}" alt="${pet.pet_name} Eating" 
         class="pet-gif img-fluid rounded-circle" 
         style="width: 150px; height: 150px; object-fit: cover; display: none;">
    <h3 style="color: rgba(34, 197, 94, 0.6)">${pet.pet_name}</h3>
    <p style="color: rgba(0, 0, 0, 0.3)"><i class="fa-solid fa-paw"></i> Level: ${pet.level}</p>

    <!-- XP progress bar -->
    <div class="pet-progress mb-2">
      <div class="pet-progress-bar" id="xpBar" style="width: ${Math.min(100, pet.xp || 0)}%;"></div>
    </div>
    <p class="mb-0">XP: ${pet.xp || 0} / 100</p>

    <p class="text-muted">Last Fed: ${pet.last_fed ? new Date(pet.last_fed).toLocaleString() : 'Never'}</p>
    <p>Use your earned coins to level up and care for ${pet.pet_name}!</p>

    <button class="pet-action-btn mt-2"><i class="fa-solid fa-bone"></i> Feed ${pet.pet_name}</button>
  </div>
</div>
`;
                $('#petSection').html(petHtml);
            } else {
                // No pet: Show message with link to create
                const noPetHtml = `
        <div class="col-md-12">
          <div class="alert alert-info text-center">
            <i class="fa-solid fa-heart fa-2x mb-3"></i>
            <h4>No Pet Yet?</h4>
            <p>You haven't created a pet. Choose one to start earning rewards and caring for it!</p>
            <a href="choose.html" class="btn btn-primary">Create My Pet</a>
          </div>
        </div>
      `;
                $('#petSection').html(noPetHtml);
            }
        },
        error: function () {
            // Fallback: Show error in pet section
            $('#petSection').html(`
      <div class="col-md-12">
        <div class="alert alert-warning text-center">
          <p>Unable to load pet information. <a href="javascript:location.reload()">Refresh</a> to try again.</p>
        </div>
      </div>
    `);
            Swal.fire('Error', 'Failed to load pet details.', 'error');
        }
    });


    // Handle pet action button (e.g., feeding)

    // ================= INVENTORY AND FEED SYSTEM =================
    let totalCoins = 0;
    let petId = null;
    let inventory = { water: 0, fertilizer: 0 };

    function loadCoins() {
        $.ajax({
            url: `${url}api/v1/my-rewards/${userId}`,
            headers: { Authorization: `Bearer ${token}` },
            success: (res) => {
                totalCoins = res.data.total_coins || 0;
                $('#totalCoins').text(totalCoins);
            }
        });
    }

    function loadInventory() {
        $.ajax({
            url: `${url}api/v1/inventory/${userId}`,
            headers: { Authorization: `Bearer ${token}` },
            success: (res) => {
                inventory = res.inventory || { water: 0, fertilizer: 0 };
                $('#waterCount').text(inventory.water);
                $('#fertilizerCount').text(inventory.fertilizer);
            }
        });
    }

    // Load coins + inventory initially
    loadCoins();
    loadInventory();

    // ✅ BUY WATER
    $('#buyWaterBtn').click(() => {
        if (totalCoins < 2) return Swal.fire('Oops', 'Insufficient coins!', 'warning');
        $.ajax({
            url: `${url}api/v1/inventory/buy`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId,
                item_type: 'water'
            }),
            success: function (res) {
                Swal.fire('Purchased!', 'You bought 1 Water Bucket!', 'success');
                loadCoins();
                loadInventory();
            },
            error: function (xhr) {
                Swal.fire('Error', xhr.responseJSON?.message || 'Purchase failed', 'error');
            }
        });
    });

    $('#buyFertilizerBtn').click(() => {
        if (totalCoins < 5) return Swal.fire('Oops', 'Insufficient coins!', 'warning');
        $.ajax({
            url: `${url}api/v1/inventory/buy`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId,
                item_type: 'fertilizer'
            }),
            success: function (res) {
                Swal.fire('Purchased!', 'You bought 1 Fertilizer!', 'success');
                loadCoins();
                loadInventory();
            },
            error: function (xhr) {
                Swal.fire('Error', xhr.responseJSON?.message || 'Purchase failed', 'error');
            }
        });
    });



    // ✅ FEED PET
    $(document).on('click', '.pet-action-btn', () => {
        Swal.fire({
            title: 'Choose what to feed',
            showDenyButton: true,
            confirmButtonText: '💧 Water',
            denyButtonText: '🌱 Fertilizer',
        }).then((result) => {
            if (result.isConfirmed) feedPetWithAnimation('water');
            else if (result.isDenied) feedPetWithAnimation('fertilizer');
        });
    });

    // ==================== 🎮 PET FEEDING ANIMATIONS ====================

    // Water droplet animation - Extended to 4 seconds
    function createWaterDroplets() {
        const petCard = $('.pet-card');
        const petImage = $('.pet-image');

        if (petCard.length === 0) return;

        // Add drinking animation to pet (head tilts, gulps)
        petImage.addClass('drinking');
        setTimeout(() => petImage.removeClass('drinking'), 4000);

        // Create multiple water droplets over time
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const droplet = $('<div class="water-droplet"></div>');
                const randomX = Math.random() * 120 - 60; // Random horizontal position
                const randomDelay = Math.random() * 0.4;

                droplet.css({
                    left: `calc(50% + ${randomX}px)`,
                    top: '-80px',
                    animationDelay: `${randomDelay}s`
                });

                petCard.append(droplet);

                // Create splash effect when droplet "lands"
                setTimeout(() => {
                    createSplash(petImage);
                }, 1800 + (randomDelay * 1000));

                // Remove droplet after animation
                setTimeout(() => droplet.remove(), 3500);
            }, i * 120);
        }
    }

    // Splash effect
    function createSplash(petImage) {
        const splash = $('<div class="water-splash"></div>');
        const petCard = petImage.closest('.pet-card');

        splash.css({
            left: '50%',
            top: petImage.position().top + petImage.height() - 25,
            transform: 'translateX(-50%)'
        });

        petCard.append(splash);
        setTimeout(() => splash.remove(), 1000);
    }

    // Food/Fertilizer eating animation - Extended to 5 seconds
    function createFoodAnimation() {
        const petCard = $('.pet-card');
        const petImage = $('.pet-image');

        if (petCard.length === 0) return;

        // Add eating animation to pet (mouth opens/closes, chews)
        petImage.addClass('eating');
        setTimeout(() => petImage.removeClass('eating'), 5000);

        // Food emojis to show
        const foodEmojis = ['🌱', '🍃', '🌿', '💚', '🌾', '🥬'];

        // Create multiple food items over time
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const food = $('<div class="food-item"></div>');
                const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
                const randomX = Math.random() * 100 - 50;
                const randomDelay = Math.random() * 0.3;

                food.text(randomEmoji);
                food.css({
                    left: `calc(50% + ${randomX}px)`,
                    top: '-50px',
                    animationDelay: `${randomDelay}s`
                });

                petCard.append(food);

                // Remove food after animation
                setTimeout(() => food.remove(), 4000);
            }, i * 200);
        }

        // Add happy sparkles after eating
        setTimeout(() => createSparkles(), 2500);
    }

    // Happy sparkles effect - Extended
    function createSparkles() {
        const petCard = $('.pet-card');
        const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💖', '🎉'];

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sparkle = $('<div class="sparkle"></div>');
                const randomEmoji = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
                const randomX = Math.random() * 140 - 70;

                sparkle.text(randomEmoji);
                sparkle.css({
                    left: `calc(50% + ${randomX}px)`,
                    top: '60%'
                });

                petCard.append(sparkle);
                setTimeout(() => sparkle.remove(), 2500);
            }, i * 250);
        }
    }

    // Update the feedPet function to include animations - Extended delay
    function feedPetWithAnimation(type) {
        const petImage = $('.pet-image');
        const petGif = $('.pet-gif');

        // Show the GIF and hide the static image
        petImage.hide();
        petGif.show();

        // Add shake animation and remove it after it's done
        petGif.addClass('shake');
        setTimeout(() => {
            petGif.removeClass('shake');
        }, 820); // Match animation duration

        // Trigger animation first
        if (type === 'water') {
            createWaterDroplets();
        } else if (type === 'fertilizer') {
            createFoodAnimation();
        }

        // Then call the API after animation completes (4-5 seconds)
        setTimeout(() => {
            // Hide the GIF and show the static image again
            petGif.hide();
            petImage.show();

            $.ajax({
                url: `${url}api/v1/pets/feed`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ user_id: userId, item_type: type }),
                success: function (res) {
                    if (res.rewards) {
                        let rewardList = res.rewards.map(r => `${r.reward_type}: ${r.value}`).join('<br>');
                        Swal.fire({
                            title: '🎉 Level Up!',
                            html: `<br><b>Rewards:</b><br>${rewardList}`,
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            loadInventory();
                            location.reload();
                        });
                    } else {
                        Swal.fire('Yum!', `Your pet gained XP!`, 'success');
                        loadInventory();
                        setTimeout(() => location.reload(), 1000);
                    }
                },
                error: function (xhr) {
                    const msg = xhr.responseJSON?.message || 'Feeding failed.';
                    Swal.fire('Error', msg, 'error');
                    // ✅ Reset to static image even on error
                    petGif.hide();
                    petImage.show();
                }
            });
        }, type === 'water' ? 4000 : 5000); // 4 seconds for water, 5 seconds for food
    }


    function loadDiscounts() {
        console.log('Loading discounts for user:', userId); // Debug log

        $.ajax({
            url: `${url}api/v1/my-discounts/${userId}`,
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            success: function (res) {
                console.log('Discount API Response:', res); // Debug log

                // Check if response has discounts array
                const discounts = res.discounts || res.data?.discounts || [];
                console.log('Found discounts:', discounts); // Debug log

                if (discounts.length === 0) {
                    $('#discountList').html('<p class="text-muted">No coupons or discounts yet. Reach Level 3 to unlock discounts!</p>');
                } else {
                    // Try different possible field names for discount data
                    const html = discounts.map(d => {
                        const discountValue = d.value || d.discount_value || d.amount || 'Unknown';
                        const discountCode = d.code || d.discount_code || 'No code';
                        const isUsed = d.is_used || d.used || false;
                        const discountType = d.reward_type || d.type || 'discount';

                        return `
          <div class="discount-item alert ${isUsed ? 'alert-secondary' : 'alert-success'} mb-2">
            <i class="fa-solid fa-ticket"></i>
            <b>${discountValue} OFF</b><br>
            <small>Code: <code>${discountCode}</code></small><br>
            ${isUsed ?
                                '<span class="badge bg-secondary">Used</span>' :
                                '<span class="badge bg-success">Active</span>'
                            }
            ${discountType !== 'discount' ? `<br><small>Type: ${discountType}</small>` : ''}
          </div>
        `;
                    }).join('');

                    $('#discountList').html(html);
                }
            },
            error: function (xhr, status, error) {
                console.error('Discount API Error:', error, xhr.responseJSON); // Debug log
                $('#discountList').html(`
      <div class="alert alert-warning">
        <p>Failed to load discounts.</p>
        <small>Error: ${xhr.status} - ${xhr.statusText}</small>
      </div>
    `);
            }
        });
    }
    loadDiscounts();

    // ==================== DISCOUNT TRADE SECTION ====================

    // Available discounts and their coin costs
    const discountOptions = [
        { percent: 5, cost: 10 },
        { percent: 10, cost: 20 },
        { percent: 15, cost: 30 },
        { percent: 20, cost: 40 },
        { percent: 30, cost: 60 },
        { percent: 40, cost: 80 },
        { percent: 45, cost: 90 },
        { percent: 50, cost: 100 }
    ];

    // Render buttons for discounts
    function renderDiscountOptions() {
        const html = discountOptions.map(d => `
    <button class="btn btn-outline-primary trade-discount-btn"
            data-percent="${d.percent}"
            data-cost="${d.cost}">
      ${d.percent}% OFF - ${d.cost} coins
    </button>
  `).join('');
        $('#discountOptions').html(html);
    }

    // Handle trade button click
    $(document).on('click', '.trade-discount-btn', function () {
        const percent = $(this).data('percent');
        const cost = $(this).data('cost');

        if (totalCoins < cost) {
            return Swal.fire('Insufficient Coins', 'You do not have enough coins for this discount.', 'warning');
        }

        Swal.fire({
            title: `Trade ${cost} coins for ${percent}% OFF coupon?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, trade now!'
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${url}api/v1/trade-discount`,
                    method: 'POST',
                    contentType: 'application/json',
                    headers: { Authorization: `Bearer ${token}` },
                    data: JSON.stringify({
                        user_id: userId,
                        percent: percent,
                        cost: cost
                    }),
                    success: function (res) {
                        Swal.fire('Success!', res.message || 'Discount traded successfully!', 'success');
                        loadCoins();
                        loadDiscounts();
                    },
                    error: function (xhr) {
                        Swal.fire('Error', xhr.responseJSON?.message || 'Failed to trade discount.', 'error');
                    }
                });
            }
        });
    });

    renderDiscountOptions();



});