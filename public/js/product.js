

$(document).ready(function () {

    const token = sessionStorage.getItem('access_token');

    const table = $('#itable').DataTable({
        ajax: {
            url: `${url}api/v1/products`,
            dataSrc: "data",
            headers: { "Authorization": `Bearer ${token}` }
        },
                dom: 'Bfrtip',
        buttons: [
            {
                text: 'Export Products (PDF)',
                className: 'btn btn-secondary',
                action: function () {
                    generateProductsPdf();
                }
            },
            'excel',
            {
                text: 'Add product',
                className: 'btn btn-primary',
                action: function () {
                    $('#createProductForm')[0].reset();
                    $('#createProductModal').modal('show');
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
            { data: 'price' },
            { data: 'stock' },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-sm btn-info editProductBtn" data-id="${data.product_id}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteProductBtn" data-id="${data.product_id}">Delete</button>
                    `;
                }
            }
        ],
    });

    // ================= CREATE PRODUCT =================
    $("#productSubmit").on('click', function (e) {
        e.preventDefault();

        let form = $('#createProductForm')[0]; // ✅ correct form
        let formData = new FormData(form);

        $.ajax({
            method: "POST",
           url: `${url}api/v1/products/admin`,
            data: formData,
            contentType: false,
            processData: false,
            headers: { Authorization: `Bearer ${token}` },
            success: function () {
                Swal.fire({ icon: "success", text: "Product created successfully!" });
                $("#createProductModal").modal("hide"); // ✅ close correct modal
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
                Swal.fire({ icon: "error", text: error.responseJSON?.error || "Failed to save product." });
            }
        });
    });

   // ================= EDIT PRODUCT (open modal) =================
$(document).on('click', '.editProductBtn', function () {
    const id = $(this).data('id');

    $.ajax({
        method: "GET",
       url: `${url}api/v1/products/admin/${id}`,
        dataType: "json",
        headers: { Authorization: `Bearer ${token}` },   // ✅ Add token here
        success: function (data) {
            const product = data.result ? data.result[0] : data.product;

            $('#u_productId').val(product.product_id);
            $('#u_name').val(product.name);
            $('#u_description').val(product.description);
            $('#u_price').val(product.price);
            $('#u_stock').val(product.stock);
            $('#u_category_id').val(product.category_id);

            $('#updateProductModal').modal('show');
        },
        error: function (xhr) {
            console.error("❌ Error fetching product:", xhr.responseText);
            Swal.fire({ icon: "error", text: "Failed to fetch product details." });
        }
    });
});


    // ================= UPDATE PRODUCT =================
    $("#productUpdate").on('click', function (e) {
        e.preventDefault();
        const id = $('#u_productId').val();
        let form = $('#updateProductForm')[0]; // ✅ correct form
        let formData = new FormData(form);

       $.ajax({
    method: "PUT",
    url: `${url}api/v1/products/admin/${id}`,   // ✅ match route
    data: formData,
    contentType: false,
    processData: false,
    headers: { Authorization: `Bearer ${token}` },
    success: function () {
        Swal.fire({ icon: "success", text: "Product updated successfully!" });
        $('#updateProductModal').modal("hide");
        table.ajax.reload();
    },
    error: function (xhr) {
        console.error("❌ Error updating product:", xhr.responseText); // ✅ add log
        Swal.fire({ icon: "error", text: "Failed to update product." });
    }
});

    });

    // ================= DELETE PRODUCT =================
    $(document).on('click', '.deleteProductBtn', function () {
        const id = $(this).data('id');
        $('#deleteProductId').val(id);
        $('#deleteProductModal').modal('show'); // ✅ open delete modal
    });

    $("#confirmDeleteProduct").on('click', function () {
        const id = $('#deleteProductId').val();

        $.ajax({
            method: "DELETE",
             url: `${url}api/v1/products/admin/${id}`,   // ✅ match route
            headers: { Authorization: `Bearer ${token}` },
            success: function () {
                Swal.fire({ icon: "success", text: "Product deleted successfully!" });
                $('#deleteProductModal').modal("hide"); // ✅ close modal
                table.ajax.reload();
            },
            error: function () {
                Swal.fire({ icon: "error", text: "Failed to delete product." });
            }
        });
    });
});

function loadCategories(callback = null) {
    $.ajax({
        url: `${url}api/v1/categories`,
        method: 'GET',
        success: function (response) {
            let options = response.categories.map(c =>
                `<option value="${c.category_id}">${c.name}</option>`
            ).join('');
            $("#c_category_id").html(options);
            $("#u_category_id").html(options);

            if (typeof callback === 'function') callback();
        },
        error: function (xhr, status, error) {
            console.error("Failed to load categories:", error);
        }
    });
}

$(document).ready(function() {
   loadCategories();
});

// ======================
// Generate Products PDF (portrait, with Seller column)
// ======================
async function generateProductsPdf() {
  const token = sessionStorage.getItem('access_token');
  if (!token) {
    Swal.fire('Error', 'Not authenticated', 'error');
    return;
  }

  try {
    if (window.Swal) {
      Swal.fire({ title: 'Preparing PDF...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    }

    // 1) Fetch products
    const res = await $.ajax({
      url: `${url}api/v1/products`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    const products = res.data || [];
    if (!Array.isArray(products) || products.length === 0) {
      Swal.close();
      Swal.fire('Info', 'No products found', 'info');
      return;
    }

    // Helper: convert first image -> PNG dataURL fixed size (48x48)
    async function toPngDataUrlFixedSize(imageUrl, thumbW = 48, thumbH = 48) {
      try {
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : (url + imageUrl.replace(/^\/+/, ''));
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Image load error'));
          image.src = fullUrl;
        });

        let w = img.width || thumbW;
        let h = img.height || thumbH;
        const scale = Math.min(thumbW / w, thumbH / h, 1);
        const drawW = Math.round(w * scale);
        const drawH = Math.round(h * scale);

        const canvas = document.createElement('canvas');
        canvas.width = thumbW;
        canvas.height = thumbH;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const dx = Math.round((thumbW - drawW) / 2);
        const dy = Math.round((thumbH - drawH) / 2);

        ctx.drawImage(img, dx, dy, drawW, drawH);
        return canvas.toDataURL('image/png', 0.9);
      } catch (err) {
        console.warn('toPngDataUrlFixedSize failed for', imageUrl, err);
        return null;
      }
    }

    // 2) Prepare rows: ensure the visible "image" field is empty string
    const thumbW = 48, thumbH = 48;
    const MAX_DESC = 140; // shorten description to avoid wide cells

    const prepared = [];
    for (const p of products) {
      let images = [];
      if (Array.isArray(p.images)) images = p.images;
      else if (typeof p.images === 'string' && p.images.length) images = p.images.split(',').map(s => s.trim()).filter(Boolean);

      const firstImg = images.length > 0 ? images[0] : null;
      let thumbData = null;
      if (firstImg) thumbData = await toPngDataUrlFixedSize(firstImg, thumbW, thumbH).catch(() => null);

      const desc = p.description ? String(p.description).replace(/\r?\n/g, ' ').trim() : '';
      const shortDesc = desc.length > MAX_DESC ? desc.slice(0, MAX_DESC - 3) + '...' : desc;

      prepared.push({
        product_id: p.product_id || '',
        image: '',                       // visible value (empty) so base64 won't be printed
        _thumbDataUrl: thumbData || '',  // store actual dataURL in raw
        name: p.name || '',
        seller_name: p.seller_name || '', // <-- seller name from backend
        category_name: p.category_name || '',
        description: shortDesc,
        price: p.price != null ? parseFloat(p.price).toFixed(2) : '',
        stock: p.stock != null ? p.stock : ''
      });
    }

    // 3) Create PDF in portrait with conservative widths (include Seller column)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const leftMargin = 36;
    doc.setFontSize(13);
    doc.text('Products Catalog', leftMargin, 36);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, leftMargin, 52);

    // Columns: image visible cell is empty; actual image in raw._thumbDataUrl
    const columns = [
      { header: 'ID', dataKey: 'product_id' },
      { header: 'Image', dataKey: 'image' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Seller', dataKey: 'seller_name' },     // new Seller column
      { header: 'Category', dataKey: 'category_name' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Price', dataKey: 'price' },
      { header: 'Stock', dataKey: 'stock' }
    ];

    doc.autoTable({
      startY: 70,
      head: [columns.map(c => c.header)],
      body: prepared,
      columns: columns,
      styles: {
        fontSize: 8,
        cellPadding: 5,
        valign: 'middle'
      },
      columnStyles: {
        product_id: { cellWidth: 30 },
        image: { cellWidth: thumbW + 12 },
        name: { cellWidth: 100 },
        seller_name: { cellWidth: 90 },
        category_name: { cellWidth: 70 },
        description: { cellWidth: 140, overflow: 'linebreak' },
        price: { cellWidth: 50 },
        stock: { cellWidth: 40 }
      },
      tableWidth: 'auto',
      margin: { left: leftMargin, right: 20 },
      headStyles: { fillColor: [40,40,40], textColor: [255,255,255] },

      didDrawCell: function (data) {
        // Draw image from data.row.raw._thumbDataUrl when column is the visible 'image'
        if (data.section === 'body' && data.column.dataKey === 'image') {
          const raw = data.row.raw;
          if (!raw) return;
          const imgData = raw._thumbDataUrl;
          const cell = data.cell;
          const pad = 4;
          const maxW = Math.min(thumbW, cell.width - pad*2);
          const maxH = Math.min(thumbH, cell.height - pad*2);
          const drawX = cell.x + (cell.width - maxW) / 2;
          const drawY = cell.y + (cell.height - maxH) / 2;

          if (!imgData) {
            doc.setFontSize(7);
            doc.setTextColor(120);
            const txtX = cell.x + 6;
            const txtY = cell.y + cell.height / 2 + 3;
            doc.text('No image', txtX, txtY);
            doc.setTextColor(0);
            return;
          }

          try {
            doc.addImage(imgData, 'PNG', drawX, drawY, maxW, maxH);
          } catch (err) {
            console.warn('Failed to add image for product', raw.product_id, err);
            doc.setFontSize(7);
            doc.setTextColor(120);
            const txtX = cell.x + 6;
            const txtY = cell.y + cell.height / 2 + 3;
            doc.text('No image', txtX, txtY);
            doc.setTextColor(0);
          }
        }
      }
    });

    // 4) Save
    Swal.close();
    const now = new Date();
    const filename = `products_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.pdf`;
    doc.save(filename);

  } catch (err) {
    console.error('generateProductsPdf error', err);
    Swal.close();
    Swal.fire('Error', 'Failed to generate PDF. See console for details.', 'error');
  }
}
