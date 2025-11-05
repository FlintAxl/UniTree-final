$(document).ready(function () {
    console.log("user.js loaded");

    const token = sessionStorage.getItem('access_token');
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('user_name');
    const userEmail = sessionStorage.getItem('user_email');

    // =====================
    // Initialize Navigation
    // =====================
    initializeNavigation();

    // =====================
    // Auto toggle Login/Register vs Profile Dropdown
    // =====================
    function initializeNavigation() {
        if (userId && token) {
            // User is logged in - show profile dropdown
            showProfileDropdown();
        } else {
            // User is not logged in - show Join Now dropdown
            showJoinNowDropdown();
        }
    }

    function showProfileDropdown() {
        // Hide login/register links if they exist
        $('#loginLink, #registerLink').hide();

        // Get user info
        const name = userName || 'User';
        const email = userEmail || '';
        const userInitial = name.charAt(0).toUpperCase();

        // Update the dropdown button and menu
        $('#joinNowBtn').html(`
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                    display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
          ${userInitial}
        </div>
        <span>${name}</span>
      </div>
    `);

        $('#joinDropdown').html(`
      <div class="dropdown-header">
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                      display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${userInitial}
          </div>
          <div>
            <div style="font-weight: bold;">${name}</div>
            <div style="font-size: 0.8rem; color: #666;">${email}</div>
          </div>
        </div>
      </div>
      <a href="profile.html">Profile Information</a>
     
      <a href="#" id="logoutBtn">Logout</a>
    `);


        $(document).off('click', '#logoutBtn').on('click', '#logoutBtn', handleLogout);
    }

    function showJoinNowDropdown() {

        $('#joinNowBtn').text('Join Now');
        $('#joinDropdown').html(`
      <a href="login.html">Log In</a>
      <a href="register.html">Register</a>
    `);
    }


    function handleLogout(e) {
        e.preventDefault();

        if (!userId || !token) {
            Swal.fire('Notice', 'You are not logged in.', 'info');
            return;
        }


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
                $.ajax({
                    method: 'POST',
                    url: '/api/v1/logout',
                    contentType: 'application/json',
                    headers: { 'Authorization': `Bearer ${token}` },
                    data: JSON.stringify({ id: parseInt(userId, 10) }),
                    success: function () {

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

                console.log('Logout cancelled by user');
            }
        });
    }


    $('#registerBtn').on('click', function () {
        const username = $('#regUsername').val();
        const email = $('#regEmail').val();
        const password = $('#regPassword').val();
        const role = $('#userRole').val(); // Get the selected role

        $.ajax({
            method: 'POST',
            url: '/api/v1/register',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, password, role }), // Include role
            success: function (res) {
                const user = res.user;
                const message = res.message || 'Registration successful!';

                if (user && user.user_id) {
                    sessionStorage.setItem('userId', user.user_id);
                    sessionStorage.setItem('user_name', user.username || user.name || 'User');
                    sessionStorage.setItem('user_email', user.email || '');
                }

                Swal.fire('Success', message, 'success').then(() => {
                    // Redirect based on role
                    if (user.role === 'seller') {
                        // Seller must wait for approval
                        window.location.href = 'login.html';
                    } else {
                        window.location.href = 'choose.html';
                    }
                });
            }
            ,
            error: function (xhr) {
                Swal.fire('Error', xhr.responseJSON?.error || 'Registration failed', 'error');
            }
        });
    });

    $('#loginBtn').on('click', function () {
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        $.ajax({
            method: 'POST',
            url: '/api/v1/login',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function (res) {
                const token = res.token || res.access_token;
                const user = res.user || res.data || res.account;

                if (token && user) {
                    sessionStorage.setItem('access_token', token);
                    sessionStorage.setItem('userId', user.user_id || user.id);
                    sessionStorage.setItem('user_name', user.username || user.name || 'User');
                    sessionStorage.setItem('user_email', user.email || '');
                    sessionStorage.setItem('role', user.role);


                    initializeNavigation();

                    Swal.fire('Success', 'Login successful!', 'success').then(() => {
                        // Redirect based on user role
                        if (user.role === 'seller') {
                            window.location.href = 'seller.html';
                        } else if (user.role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'index.html';
                        }
                    });
                } else {
                    Swal.fire('Error', 'Invalid login response', 'error');
                }
            },
            error: function (xhr) {
                Swal.fire('Error', xhr.responseJSON?.message || 'Login failed', 'error');
            }
        });
    });


    $(document).on('click', '#joinNowBtn', function (e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            $('#joinDropdown').toggleClass('show');
        }
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#joinNowBtn').length && !$(e.target).closest('#joinDropdown').length) {
            $('#joinDropdown').removeClass('show');
        }
    });
});


function loadUserProfile(userId, token, callback) {
    $.ajax({
        method: 'GET',
        url: `/api/v1/profile/${userId}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            if (response.success && response.user) {
                callback(null, response.user);
            } else {
                callback('Invalid response format', null);
            }
        },
        error: function (xhr) {
            console.error('Error loading profile:', xhr);
            const errorMsg = xhr.responseJSON?.error || 'Failed to load profile';
            callback(errorMsg, null);
        }
    });
}

function updateUserProfile(userId, token, profileData, callback) {
    $.ajax({
        method: 'PUT',
        url: `/api/v1/profile/${userId}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(profileData),
        success: function (response) {
            if (response.success) {

                if (profileData.username) {
                    sessionStorage.setItem('user_name', profileData.username);
                }
                if (profileData.email) {
                    sessionStorage.setItem('user_email', profileData.email);
                }
                callback(null, response);
            } else {
                callback('Update failed', null);
            }
        },
        error: function (xhr) {
            console.error('Error updating profile:', xhr);
            const errorMsg = xhr.responseJSON?.error || 'Failed to update profile';
            callback(errorMsg, null);
        }
    });
}


function validateProfileForm(formData) {
    const errors = [];

    if (!formData.username || formData.username.trim().length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }


    if (formData.age && (formData.age < 1 || formData.age > 120)) {
        errors.push('Age must be between 1 and 120');
    }

    return errors;
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function calculateAge(birthday) {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}