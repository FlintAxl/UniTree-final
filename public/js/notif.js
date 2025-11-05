// ============================================
// NOTIFICATION SYSTEM FOR INDEX.HTML
// ============================================

console.log('🔔 notif.js script loaded');

let notificationInterval = null;
let lastCheckedTime = null;
const url = 'http://localhost:3000/';

$(document).ready(function() {
  console.log('🔔 Document ready - notif.js');
  
  const token = sessionStorage.getItem('access_token');
  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('role');

  console.log('🔔 Auth Status:', {
    hasToken: !!token,
    userId: userId,
    userRole: userRole,
    isCustomer: userRole === 'customer'
  });

  // Only initialize notifications for logged-in customers
  if (token && userId && userRole === 'customer') {
    console.log('✅ User is customer, initializing notifications for:', userId);
    
    // Wait for header to be loaded
    $(document).on('headerLoaded', function() {
      console.log('🔔 Header loaded event received');
      initializeNotifications();
    });
    
    // Fallback: If header is already loaded
    if ($('#logoutNav').length > 0) {
      console.log('🔔 Header already exists, initializing now');
      initializeNotifications();
    }
  } else {
    console.log('❌ Skipping notification init - not a customer or not logged in');
  }
});

function initializeNotifications() {
  console.log('🔔 initializeNotifications called');
  
  // Header should be loaded by now
  if ($('#logoutNav').length === 0) {
    console.error('❌ #logoutNav still not found!');
    return;
  }
  
  console.log('✅ Header confirmed! Adding notification bell...');
  
  addNotificationBell();
  
  // Load last checked time
  lastCheckedTime = localStorage.getItem('lastNotificationCheck') || new Date().toISOString();
  console.log('🔔 Last checked time:', lastCheckedTime);
  
  // Check immediately
  checkForNewNotifications();
  
  // Check every 30 seconds
  notificationInterval = setInterval(checkForNewNotifications, 30000);
  console.log('✅ Notification polling started (every 30s)');
}

function addNotificationBell() {
  console.log('🔔 addNotificationBell called');
  
  // Check if logout button exists
  if ($('#logoutNav').length === 0) {
    console.error('❌ Cannot add bell - #logoutNav not found');
    return;
  }
  
  // Remove existing notification bell if any
  $('.notification-bell-container').remove();
  console.log('🔔 Removed any existing bell');
  
  // Create notification HTML
  const notificationHtml = `
    <li class="nav-item notification-bell-item">
      <div class="notification-bell-container">
        <button class="notification-bell-btn" id="notificationBell">
          <i class="fas fa-bell"></i>
          <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
        </button>
        
        <div class="notification-dropdown" id="notificationDropdown">
          <div class="notification-header">
            <h6>Notifications</h6>
            <span id="notificationCount">0 new</span>
          </div>
          <div class="notification-list" id="notificationList">
            <div class="no-notifications">
              <i class="fas fa-bell-slash"></i>
              <p>No notifications yet</p>
            </div>
          </div>
          <div class="notification-footer">
            <button class="mark-all-read-btn" id="markAllReadBtn">
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </li>
  `;
  
  // Insert the notification bell before the logout button
  $('#logoutNav').before(notificationHtml);
  console.log('✅ Bell HTML inserted before #logoutNav');
  
  // Verify insertion
  if ($('.notification-bell-container').length > 0) {
    console.log('✅ Bell container verified in DOM');
  } else {
    console.error('❌ Bell container not found after insertion!');
  }
  
  // Add CSS styles
  addNotificationStyles();
  
  // Attach event listeners
  attachNotificationListeners();
}

function addNotificationStyles() {
  if ($('#notification-styles').length) {
    console.log('🎨 Notification styles already exist');
    return;
  }
  
  console.log('🎨 Adding notification styles');
  
  const styles = `
    <style id="notification-styles">
      .notification-bell-item {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      
      .notification-bell-container {
        position: relative;
        display: inline-block;
      }
      
      .notification-bell-btn {
        background: none;
        border: none;
        color: #4ade80;
        font-size: 1.3rem;
        cursor: pointer;
        position: relative;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
      }
      
      .notification-bell-btn:hover {
        background: rgba(74, 222, 128, 0.1);
        color: #22c55e;
        transform: scale(1.1);
      }
      
      .notification-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border-radius: 50%;
        min-width: 18px;
        height: 18px;
        font-size: 0.65rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border: 2px solid #0f2027;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .notification-dropdown {
        display: none;
        position: absolute;
        right: 0;
        top: 100%;
        width: 380px;
        max-height: 500px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        overflow: hidden;
      }
      
      .notification-dropdown.show {
        display: block;
        animation: slideDown 0.3s ease;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .notification-header {
        padding: 1rem 1.25rem;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .notification-header h6 {
        margin: 0;
        font-weight: 600;
        font-size: 1rem;
      }
      
      .notification-list {
        max-height: 350px;
        overflow-y: auto;
      }
      
      .notification-item {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }
      
      .notification-item:hover {
        background: #f9fafb;
      }
      
      .notification-item.unread {
        background: #f0fdf4;
        border-left: 3px solid #22c55e;
      }
      
      .notification-content {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
      }
      
      .notification-icon.shipped {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
      }
      
      .notification-icon.pending {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
      }
      
      .notification-icon.received {
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: white;
      }
      
      .notification-icon.cancelled {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
      }
      
      .notification-text {
        flex: 1;
      }
      
      .notification-title {
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
      }
      
      .notification-description {
        color: #6b7280;
        font-size: 0.85rem;
        line-height: 1.4;
      }
      
      .notification-time {
        color: #9ca3af;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
      
      .notification-footer {
        padding: 0.75rem 1.25rem;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        background: #f9fafb;
      }
      
      .mark-all-read-btn {
        background: none;
        border: none;
        color: #16a34a;
        font-size: 0.85rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .mark-all-read-btn:hover {
        color: #22c55e;
        text-decoration: underline;
      }
      
      .no-notifications {
        text-align: center;
        padding: 3rem 1.5rem;
        color: #9ca3af;
      }
      
      .no-notifications i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      
      @media (max-width: 768px) {
        .notification-dropdown {
          width: 320px;
          right: -50px;
        }
        
        .notification-bell-item {
          margin-right: 5px;
        }
      }
    </style>
  `;
  
  $('head').append(styles);
  console.log('✅ Notification styles added');
}

function attachNotificationListeners() {
  console.log('🔔 Attaching event listeners');
  
  // Toggle notification dropdown
  $(document).on('click', '#notificationBell', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔔 Bell clicked');
    $('#notificationDropdown').toggleClass('show');
  });
  
  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.notification-bell-container').length) {
      $('#notificationDropdown').removeClass('show');
    }
  });
  
  // Mark all as read
  $(document).on('click', '#markAllReadBtn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔔 Mark all as read clicked');
    markAllNotificationsRead();
  });
  
  // Handle notification item clicks
  $(document).on('click', '.notification-item', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const orderId = $(this).data('order-id');
    console.log('🔔 Notification clicked for order:', orderId);
    if (orderId) {
      window.location.href = `myorders.html`;
    }
  });
  
  console.log('✅ Event listeners attached');
}

function checkForNewNotifications() {
  const token = sessionStorage.getItem('access_token');
  const userId = sessionStorage.getItem('userId');
  
  if (!token || !userId) {
    console.log('❌ No token or userId for notification check');
    return;
  }
  
  const apiUrl = `${url}api/v1/orders/user/${userId}/notifications`;
  console.log('📡 Checking notifications from:', apiUrl);
  
  $.ajax({
    url: apiUrl,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      since: lastCheckedTime
    },
    success: function(response) {
      console.log('📬 Notifications response:', response);
      
      if (response.success && response.notifications) {
        console.log(`✅ Found ${response.notifications.length} notifications`);
        displayNotifications(response.notifications);
        
        // Update last checked time
        lastCheckedTime = new Date().toISOString();
        localStorage.setItem('lastNotificationCheck', lastCheckedTime);
      } else {
        console.log('⚠️ Response successful but no notifications array');
      }
    },
    error: function(xhr) {
      console.error('❌ Error fetching notifications:', xhr.status, xhr.statusText);
      console.error('Response:', xhr.responseText);
    }
  });
}

function displayNotifications(notifications) {
  console.log('🔔 Displaying notifications:', notifications);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  console.log('📊 Unread count:', unreadCount);
  
  // Update badge
  if (unreadCount > 0) {
    $('#notificationBadge').text(unreadCount).show();
    $('#notificationCount').text(`${unreadCount} new`);
    console.log('✅ Badge updated with count:', unreadCount);
    
    // Show toast for new notifications
    if (notifications.length > 0 && !$('#notificationDropdown').hasClass('show')) {
      showNotificationToast(notifications[0]);
    }
  } else {
    $('#notificationBadge').hide();
    $('#notificationCount').text('0 new');
    console.log('📭 No unread notifications');
  }
  
  // Render notification list
  if (notifications.length === 0) {
    $('#notificationList').html(`
      <div class="no-notifications">
        <i class="fas fa-bell-slash"></i>
        <p>No notifications yet</p>
      </div>
    `);
    return;
  }
  
  const notificationHtml = notifications.map(notification => {
    const icon = getNotificationIcon(notification.status);
    const timeAgo = getTimeAgo(notification.created_at);
    const unreadClass = notification.is_read ? '' : 'unread';
    
    return `
      <div class="notification-item ${unreadClass}" data-order-id="${notification.order_id}" data-notification-id="${notification.notification_id}">
        <div class="notification-content">
          <div class="notification-icon ${notification.status}">
            ${icon}
          </div>
          <div class="notification-text">
            <div class="notification-title">Order #${notification.order_id} ${getStatusText(notification.status)}</div>
            <div class="notification-description">${notification.notes || 'Status updated'}</div>
            <div class="notification-time">${timeAgo}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  $('#notificationList').html(notificationHtml);
  console.log('✅ Notification list rendered');
}

function getNotificationIcon(status) {
  const icons = {
    'shipped': '🚚',
    'received': '✅',
    'pending': '⏳',
    'cancelled': '❌'
  };
  return icons[status] || '📦';
}

function getStatusText(status) {
  const texts = {
    'shipped': 'has been shipped!',
    'received': 'has been delivered!',
    'pending': 'is being processed',
    'cancelled': 'has been cancelled'
  };
  return texts[status] || 'status updated';
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function showNotificationToast(notification) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: `Order #${notification.order_id}`,
      text: `${getStatusText(notification.status)}`,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }
}

function markAllNotificationsRead() {
  const token = sessionStorage.getItem('access_token');
  const userId = sessionStorage.getItem('userId');
  
  if (!token || !userId) return;
  
  console.log('📖 Marking all notifications as read for user:', userId);
  
  $.ajax({
    url: `${url}api/v1/orders/user/${userId}/notifications/mark-read`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    success: function(response) {
      console.log('✅ Mark as read response:', response);
      
      if (response.success) {
        $('#notificationBadge').hide();
        $('#notificationCount').text('0 new');
        $('.notification-item').removeClass('unread');
        console.log('✅ All notifications marked as read');
      }
    },
    error: function(xhr) {
      console.error('❌ Error marking notifications as read:', xhr);
    }
  });
}

// Test function
window.testNotifications = function() {
  console.log('🧪 Running manual notification test...');
  
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('access_token');
  
  if (!userId || !token) {
    console.error('❌ Missing userId or token');
    return;
  }
  
  const testUrl = `${url}api/v1/orders/user/${userId}/notifications`;
  console.log('🧪 Testing URL:', testUrl);
  
  fetch(testUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(r => r.json())
  .then(data => {
    console.log('✅ Manual test result:', data);
    if (data.notifications) {
      console.log(`Found ${data.notifications.length} notifications`);
    }
  })
  .catch(err => console.error('❌ Manual test error:', err));
};

console.log('✅ notif.js fully loaded');