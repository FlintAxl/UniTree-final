// js/payment.js
(function(){
  // ------------------------------
  // Payment options data
  // ------------------------------
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
    number: '0917-123-4567',
    label: 'GCash'
  };

  // ------------------------------
  // DOM elements
  // ------------------------------
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

  // ------------------------------
  // Helpers
  // ------------------------------
  function formatPHP(amount) {
    const n = Number(amount) || 0;
    const parts = n.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `₱${parts.join('.')}`;
  }

  function getTotalAmount() {
    const el = document.getElementById('total');
    if (!el) return 0;
    const txt = (el.textContent || el.innerText || '').trim();
    const num = txt.replace(/[^0-9.\-]/g, '');
    return parseFloat(num) || 0;
  }

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
  }

  // ------------------------------
  // Payment option creation
  // ------------------------------
  function createPaymentNode(opt, clickHandler) {
    const div = document.createElement('div');
    div.className = 'payment-option';
    div.dataset.id = opt.id;

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
      const parent = div.parentElement;
      markSelected(parent, opt.id);
      if (typeof clickHandler === 'function') clickHandler(opt);
    });

    return div;
  }

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

  // ------------------------------
  // Populate quick & all lists
  // ------------------------------
  function populateQuick() {
    quickPaymentList.innerHTML = '';
    const quickOptions = paymentOptions.slice(0,2);
    quickOptions.forEach(opt => {
      const node = createPaymentNode(opt, (option) => {
        if (option.id === 'gcash') {
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

  function populateAll() {
    allPaymentList.innerHTML = '';
    paymentOptions.forEach(opt => {
      const node = createPaymentNode(opt, (option) => {
        selectedPayment = option.id;
      });
      allPaymentList.appendChild(node);
    });

    if (selectedPayment) markSelected(allPaymentList, selectedPayment);
  }

  function finalizePaymentSelection() {
    const p = paymentOptions.find(x => x.id === confirmedPayment);
    if (p) {
      paymentLabel.textContent = p.label;
      paymentLabel.dataset.id = p.id;
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
      }
    }
  }

  // ------------------------------
  // GCash modal behaviors
  // ------------------------------
  function openGcashModal() {
    if (gcashNameEl) gcashNameEl.textContent = gcashDetails.name;
    if (gcashNumberEl) gcashNumberEl.textContent = gcashDetails.number;
    openModal(gcashQrModal);
  }
  function closeGcashModal() {
    closeModal(gcashQrModal);
  }

  function copyToClipboard(text) {
    if (!navigator.clipboard) {
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

  // ------------------------------
  // Events - payment UI
  // ------------------------------
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
      if (window.Swal) {
        Swal.fire({ icon:'info', text:'Please choose a payment method first.' });
      } else {
        alert('Please choose a payment method first.');
      }
      return;
    }

    if (selectedPayment === 'gcash') {
      closeModal(allPaymentsModal);
      openGcashModal();
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

  // GCash modal event handlers (copy & cancel)
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

  // ------------------------------
  // iHavePaid handler (GCash-like receipt)
  // ------------------------------
  iPaidBtn?.addEventListener('click', () => {
    confirmedPayment = 'gcash';
    finalizePaymentSelection();
    closeGcashModal();

    const amount = getTotalAmount();
    const formattedAmount = formatPHP(amount);
    const now = new Date();
    const ts = now.toLocaleString();
    const receiptId = `UT-${now.getTime().toString().slice(-8)}-${Math.floor(Math.random()*9000+1000)}`;

    const receiptText = [
      `UniTree Flowers — GCash Receipt`,
      `Receipt ID: ${receiptId}`,
      `Amount: ${formattedAmount}`,
      `Payment Method: GCash`,
      `Description: Paid`,
      `Date: ${ts}`
    ].join('\n');

    // GCash-like styled receipt HTML (no logos used)
    const receiptHtml = `
      <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0b2f1a;">
        <!-- Header -->
        <div style="background:linear-gradient(90deg,#00b04a,#00d66a);padding:14px 16px;border-radius:12px 12px 8px 8px;color:#fff;display:flex;align-items:center;justify-content:space-between;">
          <div style="font-weight:700;font-size:1rem;">UNITREE- Receipt</div>
          <div style="font-size:0.86rem;opacity:0.95;">${ts}</div>
        </div>

        <!-- Receipt card -->
        <div style="background:#fff;border-radius:10px;padding:14px;margin-top:12px;box-shadow:0 6px 18px rgba(2,46,21,0.06);border:1px solid rgba(2,46,21,0.04);">
          <div style="display:flex;align-items:center;gap:12px;">
            <!-- QR-looking square -->
            <div style="width:78px;height:78px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#f0fff6,#fff);border:1px solid rgba(2,46,21,0.06);">
              <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" x="0" y="0" fill="#0b3f24"/>
                <rect width="8" height="8" x="20" y="20" fill="#0b3f24"/>
                <rect width="10" height="10" x="40" y="0" fill="#0b3f24"/>
                <rect width="6" height="6" x="40" y="40" fill="#0b3f24"/>
                <rect width="6" height="6" x="10" y="36" fill="#0b3f24"/>
              </svg>
            </div>

            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <div style="font-weight:700;font-size:0.98rem;">${gcashDetails.name}</div>
                  <div style="font-size:0.86rem;color:#3a5b45;margin-top:4px;">${gcashDetails.number}</div>
                </div>

                <div style="text-align:right;">
                  <div style="font-size:0.88rem;color:#6b9a7b;margin-bottom:6px;"><span style="background:#e9f8ee;color:#0b5a2f;padding:6px 8px;border-radius:12px;font-weight:600;">Paid</span></div>
                  <div style="font-weight:800;font-size:1.25rem;color:#0b3f24;">${formattedAmount}</div>
                </div>
              </div>

              <div style="margin-top:10px;font-size:0.86rem;color:#556b59;">
                <div>Receipt ID: <span style="font-family:monospace;">${receiptId}</span></div>
                <div style="margin-top:6px;">Payment Method: <strong>GCash</strong></div>
                <div style="margin-top:4px;">Description: <strong>Paid</strong></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button id="copyReceiptBtn" class="swal2-confirm swal2-styled" style="flex:1;background:#07b65c;border:none;color:#fff;padding:8px 10px;border-radius:8px;font-weight:700;">Copy Receipt</button>
          <button id="downloadReceiptBtn" class="swal2-cancel swal2-styled" style="flex:1;background:#f1f5f3;border:1px solid #e6efe6;color:#0b3f24;padding:8px 10px;border-radius:8px;font-weight:700;">Download</button>
        </div>
      </div>
    `;

    // Save last receipt for other scripts
    window.lastGcashReceipt = {
      receiptId,
      amount,
      formattedAmount,
      paymentMethod: 'gcash',
      description: 'Paid',
      timestamp: now.toISOString(),
      displayText: receiptText
    };

    // Show SweetAlert2 receipt modal and attach handlers to the copy & download buttons
    if (window.Swal) {
      Swal.fire({
        title: '',
        html: receiptHtml,
        showConfirmButton: false,
        showCloseButton: false,
        didOpen: () => {
          const popup = Swal.getPopup();
          if (!popup) return;

          const copyBtn = popup.querySelector('#copyReceiptBtn');
          const downloadBtn = popup.querySelector('#downloadReceiptBtn');

          if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
              try {
                await navigator.clipboard.writeText(receiptText);
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Receipt copied to clipboard',
                  showConfirmButton: false,
                  timer: 1400
                });
              } catch (err) {
                Swal.fire({
                  icon: 'error',
                  title: 'Copy failed',
                  text: 'Could not copy. Please copy manually from the receipt.'
                });
              }
            });
          }

          if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
              try {
                // Create a simple text file download (client-side). For a nicer PDF use jsPDF.
                const blob = new Blob([receiptText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${receiptId}.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Receipt downloaded',
                  showConfirmButton: false,
                  timer: 1200
                });
              } catch (e) {
                Swal.fire({
                  icon: 'error',
                  title: 'Download failed',
                  text: 'Could not download receipt.'
                });
              }
            });
          }
        }
      });
    } else {
      try { navigator.clipboard.writeText(receiptText); } catch(e){}
      alert(`Payment noted.\n\n${receiptText}`);
    }

    // update UI label to show paid state
    if (paymentLabel) {
      paymentLabel.textContent = `${gcashDetails.label || 'GCash'} (Paid)`;
      paymentLabel.dataset.id = 'gcash';
      paymentLabel.dataset.paid = 'true';
    }

    // add small persistent Paid badge to selectedPaymentDisplay
    try {
      const paidBadgeId = 'paidBadgeText';
      let badge = document.getElementById(paidBadgeId);
      if (!badge) {
        badge = document.createElement('span');
        badge.id = paidBadgeId;
        badge.style.background = '#e9f7ef';
        badge.style.color = '#0f5132';
        badge.style.padding = '4px 8px';
        badge.style.borderRadius = '8px';
        badge.style.fontSize = '0.85rem';
        badge.style.marginLeft = '10px';
        badge.textContent = 'Paid';
        const container = document.getElementById('selectedPaymentDisplay');
        if (container) {
          container.appendChild(badge);
        }
      } else {
        badge.textContent = 'Paid';
      }
    } catch(e) {
      // ignore failures
    }
  });

  // ========================================
  // EXPOSE PAYMENT METHOD FOR CART.JS
  // ========================================
  function getConfirmedPaymentMethod() {
    return confirmedPayment || 'cod';
  }
  function getConfirmedPaymentLabel() {
    const p = paymentOptions.find(x => x.id === (confirmedPayment || 'cod'));
    return p ? p.label : 'Cash on Delivery';
  }
  function isPaymentMethodSelected() {
    return confirmedPayment !== null;
  }

  // ========================================
  // GLOBAL EXPOSURE
  // ========================================
  window.getConfirmedPaymentMethod = getConfirmedPaymentMethod;
  window.getConfirmedPaymentLabel = getConfirmedPaymentLabel;
  window.isPaymentMethodSelected = isPaymentMethodSelected;

  window._paymentUI = {
    getConfirmed: () => confirmedPayment,
    getSelected: () => selectedPayment,
    openPaymentModal: () => { populateQuick(); openModal(paymentModal); },
    openGcash: () => openGcashModal()
  };

})();
