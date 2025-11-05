// js/payment.js
(function(){
  // Payment options data
  const paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive order' },
    { id: 'gcash', label: 'GCash', sub: 'Pay via QR or GCash number' },
    { id: 'maya', label: 'Maya', sub: 'Maya e-wallet' },
    { id: 'online_bank', label: 'Online Banking', sub: 'Pay via bank gateway' },
    { id: 'bank_transfer', label: 'Bank Transfer', sub: 'Manual bank deposit' }
  ];

  // GCash mock details (edit to your actual account)
  const gcashDetails = {
    name: 'UniTree Flowers',
    number: '0917-123-4567'
    // If you have an actual QR image URL, you could replace the SVG in HTML or update src here.
  };

  // Elements
  const usePaymentBtn = document.getElementById('usePaymentBtn');
  const paymentModal = document.getElementById('paymentModal');
  const quickPaymentList = document.getElementById('quickPaymentList');
  const closePaymentModal = document.getElementById('closePaymentModal');
  const viewAllPaymentBtn = document.getElementById('viewAllPaymentBtn');

  const allPaymentsModal = document.getElementById('allPaymentsModal');
  const allPaymentList = document.getElementById('allPaymentList');
  const closeAllPaymentsBtn = document.getElementById('closeAllPaymentsBtn');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

  const paymentLabel = document.getElementById('paymentLabel');
  const selectedPaymentDisplay = document.getElementById('selectedPaymentDisplay');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // GCash QR modal elements
  const gcashQrModal = document.getElementById('gcashQrModal');
  const closeGcashQrModal = document.getElementById('closeGcashQrModal');
  const copyGcashBtn = document.getElementById('copyGcashBtn');
  const gcashNumberEl = document.getElementById('gcashNumber');
  const gcashNameEl = document.getElementById('gcashName');
  const iPaidBtn = document.getElementById('iPaidBtn');
  const cancelGcashBtn = document.getElementById('cancelGcashBtn');

  let selectedPayment = null; // holds id chosen in "all" modal (not yet confirmed)
  let confirmedPayment = null; // holds id confirmed for checkout

  // Utility to create option element
  function createPaymentNode(opt, clickHandler) {
    const div = document.createElement('div');
    div.className = 'payment-option';
    div.dataset.id = opt.id;

    // icon: choose icon by id (simple mapping)
    let iconClass = 'fa-solid fa-hand-holding-dollar';
    if (opt.id === 'gcash') iconClass = 'fa-solid fa-qrcode';
    if (opt.id === 'cod') iconClass = 'fa-solid fa-box';
    if (opt.id === 'maya') iconClass = 'fa-solid fa-wallet';
    if (opt.id === 'online_bank') iconClass = 'fa-solid fa-university';
    if (opt.id === 'bank_transfer') iconClass = 'fa-solid fa-building-columns';

    div.innerHTML = `
      <div class="payment-icon"><i class="${iconClass}"></i></div>
      <div>
        <div class="payment-name">${opt.label}</div>
        <div class="payment-sub">${opt.sub}</div>
      </div>
      <div class="payment-sub" style="margin-left:auto;">
        <i class="fa-regular fa-circle"></i>
      </div>
    `;

    div.addEventListener('click', () => {
      // visual marking of selected in whichever container this is placed
      const parent = div.parentElement;
      markSelected(parent, opt.id);

      // call provided handler so caller can respond to selection
      if (typeof clickHandler === 'function') clickHandler(opt);
    });

    return div;
  }

  // mark selected in a given container
  function markSelected(container, id) {
    if (!container) return;
    const options = container.querySelectorAll('.payment-option');
    options.forEach(o => {
      const iconEl = o.querySelector('.payment-sub i');
      if (o.dataset.id === id) {
        o.classList.add('selected');
        if (iconEl) iconEl.className = 'fa-solid fa-circle-check';
      } else {
        o.classList.remove('selected');
        if (iconEl) iconEl.className = 'fa-regular fa-circle';
      }
    });
  }

  // populate quick modal (show first two options)
  function populateQuick() {
    quickPaymentList.innerHTML = '';
    const quickOptions = paymentOptions.slice(0,2);
    quickOptions.forEach(opt => {
      const node = createPaymentNode(opt, (option) => {
        // For quick selection: handle GCash specially (open QR), else confirm
        if (option.id === 'gcash') {
          // open QR modal
          openGcashModal();
        } else {
          confirmedPayment = option.id;
          finalizePaymentSelection();
          closeModal(paymentModal);
        }
      });
      quickPaymentList.appendChild(node);
    });
  }

  // populate all payments list
  function populateAll() {
    allPaymentList.innerHTML = '';
    paymentOptions.forEach(opt => {
      const node = createPaymentNode(opt, (option) => {
        // selecting in all list sets selectedPayment (not confirmed)
        selectedPayment = option.id;
      });
      allPaymentList.appendChild(node);
    });

    // if previously selected, mark it
    if (selectedPayment) markSelected(allPaymentList, selectedPayment);
  }

  // finalize & reflect selection to UI
  function finalizePaymentSelection() {
    const p = paymentOptions.find(x => x.id === confirmedPayment);
    if (p) {
      paymentLabel.textContent = p.label;
      paymentLabel.dataset.id = p.id;
      // enable checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
      }
    }
  }

  // simple modal open/close helpers
  function openModal(modal) {
    modal.style.display = 'flex';
  }
  function closeModal(modal) {
    modal.style.display = 'none';
  }

  // GCash modal behaviors
  function openGcashModal() {
    // populate gcash details
    if (gcashNameEl) gcashNameEl.textContent = gcashDetails.name;
    if (gcashNumberEl) gcashNumberEl.textContent = gcashDetails.number;
    openModal(gcashQrModal);
  }
  function closeGcashModal() {
    closeModal(gcashQrModal);
  }

  // Copy to clipboard helper
  function copyToClipboard(text) {
    if (!navigator.clipboard) {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(el);
      return Promise.resolve();
    }
    return navigator.clipboard.writeText(text);
  }

  // events - payment UI
  usePaymentBtn?.addEventListener('click', () => {
    populateQuick();
    openModal(paymentModal);
  });

  closePaymentModal?.addEventListener('click', () => closeModal(paymentModal));
  viewAllPaymentBtn?.addEventListener('click', () => {
    closeModal(paymentModal);
    populateAll();
    openModal(allPaymentsModal);
  });

  closeAllPaymentsBtn?.addEventListener('click', () => {
    selectedPayment = null;
    closeModal(allPaymentsModal);
  });

  confirmPaymentBtn?.addEventListener('click', () => {
    if (!selectedPayment) {
      // nicer feedback using SweetAlert2 if available
      if (window.Swal) {
        Swal.fire({ icon:'info', text:'Please choose a payment method first.' });
      } else {
        alert('Please choose a payment method first.');
      }
      return;
    }

    // If selected GCash, open QR modal; otherwise confirm directly
    if (selectedPayment === 'gcash') {
      closeModal(allPaymentsModal);
      openGcashModal();
      // leave confirmedPayment to be set by "I have paid" action
      return;
    }

    confirmedPayment = selectedPayment;
    finalizePaymentSelection();
    closeModal(allPaymentsModal);
  });

  // close modals when clicking outside the modal-content
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
  });

  // initialize checkout state
  (function init(){
    if (!confirmedPayment) {
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
      }
    } else {
      finalizePaymentSelection();
    }
  })();

  // GCash modal event handlers
  closeGcashQrModal?.addEventListener('click', () => closeGcashModal());
  cancelGcashBtn?.addEventListener('click', () => closeGcashModal());

  copyGcashBtn?.addEventListener('click', () => {
    copyToClipboard(gcashDetails.number).then(() => {
      if (window.Swal) {
        Swal.fire({ icon:'success', text:'GCash number copied to clipboard' , timer: 1200, showConfirmButton:false});
      } else {
        alert('GCash number copied to clipboard');
      }
    }).catch(() => {
      if (window.Swal) {
        Swal.fire({ icon:'error', text:'Failed to copy. Please copy manually.'});
      } else {
        alert('Failed to copy. Please copy manually.');
      }
    });
  });

  iPaidBtn?.addEventListener('click', () => {
    // Mark GCash as confirmed payment
    confirmedPayment = 'gcash';
    finalizePaymentSelection();
    closeGcashModal();

    if (window.Swal) {
      Swal.fire({ icon:'success', title:'Payment noted', text:'Thank you — we will verify your payment shortly.' , timer:1400, showConfirmButton:false});
    }
  });

  // ========================================
  // 🆕 EXPOSE PAYMENT METHOD FOR CART.JS
  // ========================================
  
  // Function to get confirmed payment method (for order creation)
  function getConfirmedPaymentMethod() {
    // Return confirmed payment, default to 'cod' if none selected
    return confirmedPayment || 'cod';
  }
  
  // Function to get payment label for display
  function getConfirmedPaymentLabel() {
    const p = paymentOptions.find(x => x.id === (confirmedPayment || 'cod'));
    return p ? p.label : 'Cash on Delivery';
  }
  
  // Check if payment method is selected
  function isPaymentMethodSelected() {
    return confirmedPayment !== null;
  }

  // ========================================
  // GLOBAL EXPOSURE FOR USE IN OTHER SCRIPTS
  // ========================================
  
  window.getConfirmedPaymentMethod = getConfirmedPaymentMethod;
  window.getConfirmedPaymentLabel = getConfirmedPaymentLabel;
  window.isPaymentMethodSelected = isPaymentMethodSelected;

  // expose for debugging if needed
  window._paymentUI = {
    getConfirmed: () => confirmedPayment,
    getSelected: () => selectedPayment,
    openPaymentModal: () => { populateQuick(); openModal(paymentModal); },
    openGcash: () => openGcashModal()
  };
})();