const connection = require('../config/database');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// ============================
// Get all products
// ============================
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.name AS category_name,
      u.username AS seller_name,
      GROUP_CONCAT(img.image_path) AS images
    FROM products p
    LEFT JOIN product_images img ON p.product_id = img.product_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN users u ON p.seller_id = u.user_id
    GROUP BY p.product_id
    ORDER BY p.created_at DESC;
  `;

  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Query failed', details: err });

    const data = rows.map(row => ({
      ...row,
      images: row.images ? row.images.split(',') : []
    }));

    return res.status(200).json({ data });
  });
};

// ============================
// Get products for specific seller
// ============================
exports.getSellerProducts = (req, res) => {
  const sellerId = req.params.sellerId;
  
  const sql = `
    SELECT 
      p.*, 
      c.name AS category_name,
      GROUP_CONCAT(img.image_path) AS images
    FROM products p
    LEFT JOIN product_images img ON p.product_id = img.product_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.seller_id = ?
    GROUP BY p.product_id
    ORDER BY p.created_at DESC;
  `;

  connection.execute(sql, [sellerId], (err, rows) => {
    if (err) {
      console.error('Error fetching seller products:', err);
      return res.status(500).json({ error: 'Error fetching products', details: err });
    }

    const data = rows.map(row => ({
      ...row,
      images: row.images ? row.images.split(',') : []
    }));

    res.status(200).json({ success: true, products: data });
  });
};

// ============================
// Get single product
// ============================
exports.getSingleProduct = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.name AS category_name,
      u.username AS seller_name,
      GROUP_CONCAT(img.image_path) AS images
    FROM products p
    LEFT JOIN product_images img ON p.product_id = img.product_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN users u ON p.seller_id = u.user_id
    WHERE p.product_id = ?
    GROUP BY p.product_id;
  `;
  
  const values = [parseInt(req.params.id)];

  connection.execute(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Query error', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      ...result[0],
      images: result[0].images ? result[0].images.split(',') : []
    };

    return res.status(200).json({
      success: true,
      product: product
    });
  });
};

// ============================
// Create product (for sellers)
// ============================
exports.createProduct = (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const sellerId = req.params.sellerId;
  const images = req.files;

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const insertSql = `
    INSERT INTO products (name, description, price, stock, category_id, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [name, description, price, stock, category_id || null, sellerId];

  connection.execute(insertSql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error inserting product', details: err });

    const productId = result.insertId;

    if (images && images.length > 0) {
      const insertImageSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
      const imagePaths = images.map(file => [productId, file.path.replace(/\\/g, '/')]);

      connection.query(insertImageSql, [imagePaths], (err) => {
        if (err) return res.status(500).json({ error: 'Error inserting images', details: err });

        return res.status(201).json({
          success: true,
          message: 'Product and images saved successfully',
          productId
        });
      });
    } else {
      return res.status(201).json({
        success: true,
        message: 'Product saved without images',
        productId
      });
    }
  });
};

// ============================
// Update product (seller-specific)
// ============================
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const sellerId = req.params.sellerId;
  const { name, description, price, stock, category_id } = req.body;

  let imagePath = [];

  if (req.files && req.files.length > 0) {
    imagePath = req.files.map(file => file.path.replace(/\\/g, "/"));
  }

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // First check if the product belongs to the seller
  const checkSql = 'SELECT seller_id FROM products WHERE product_id = ?';
  connection.execute(checkSql, [id], (err, results) => {
    if (err) {
      console.error('Error checking product ownership:', err);
      return res.status(500).json({ error: 'Error checking product ownership' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (results[0].seller_id !== parseInt(sellerId)) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    // Update the product
    const updateSql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
      WHERE product_id = ?
    `;
    const values = [name, description, price, stock, category_id || null, id];

    connection.execute(updateSql, values, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error updating product', details: err });
      }

      // If new images uploaded, replace old ones
      if (imagePath.length > 0) {
        const deleteSql = 'DELETE FROM product_images WHERE product_id = ?';
        connection.execute(deleteSql, [id], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to delete old images' });
          }

          const insertSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
          const imageValues = imagePath.map(p => [id, p]);

          connection.query(insertSql, [imageValues], (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ error: 'Failed to insert new images' });
            }

            return res.status(200).json({ success: true, message: 'Product updated with new images' });
          });
        });
      } else {
        return res.status(200).json({ success: true, message: 'Product updated successfully (no new images)' });
      }
    });
  });
};

// ============================
// Delete product (seller-specific)
// ============================
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  const sellerId = req.params.sellerId;

  // First check if the product belongs to the seller
  const checkSql = 'SELECT seller_id FROM products WHERE product_id = ?';
  connection.execute(checkSql, [id], (err, results) => {
    if (err) {
      console.error('Error checking product ownership:', err);
      return res.status(500).json({ error: 'Error checking product ownership' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (results[0].seller_id !== parseInt(sellerId)) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    // Delete the product (images will be deleted by cascade if properly set up)
    const deleteSql = 'DELETE FROM products WHERE product_id = ?';
    connection.execute(deleteSql, [id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error deleting product', details: err });
      }
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    });
  });
};

// ============================
// Add new product for seller (simplified endpoint)
// ============================
// ============================
// Add new product for seller (with image support)
// ============================
exports.addProduct = (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const sellerId = req.params.sellerId;
  const images = req.files; // This will contain uploaded images

  console.log('Request body:', req.body);
  console.log('Uploaded files:', images);
  console.log('Seller ID:', sellerId);

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const insertSql = `
    INSERT INTO products (name, description, price, stock, category_id, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [name, description, parseFloat(price), parseInt(stock), category_id || null, sellerId];

  connection.execute(insertSql, values, (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ error: 'Error inserting product', details: err });
    }

    const productId = result.insertId;
    console.log('Product created with ID:', productId);

    // Insert images if any were uploaded
    if (images && images.length > 0) {
      console.log(`Processing ${images.length} images`);
      
      const insertImageSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
      const imagePaths = images.map(file => {
        const cleanPath = file.path.replace(/\\/g, '/');
        console.log('Processing image:', cleanPath);
        return [productId, cleanPath];
      });

      connection.query(insertImageSql, [imagePaths], (err) => {
        if (err) {
          console.error('Error inserting images:', err);
          return res.status(500).json({ error: 'Error inserting images', details: err });
        }

        console.log(`Successfully inserted ${images.length} images`);
        return res.status(201).json({
          success: true,
          message: 'Product and images saved successfully',
          product_id: productId,
          images_uploaded: images.length
        });
      });
    } else {
      console.log('No images to process');
      return res.status(201).json({
        success: true,
        message: 'Product saved without images',
        product_id: productId,
        images_uploaded: 0
      });
    }
  });
};

// ============================
// Get all categories
// ============================
exports.getAllCategories = (req, res) => {
  const sql = 'SELECT category_id, name FROM categories ORDER BY name ASC';

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Query failed', details: err });
    }
    return res.status(200).json({ categories: rows });
  });
};


// Create product (Admin)
// Create product (Admin)
exports.createAdminProduct = (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const images = req.files || [];

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Make sure req.user exists and has user_id
  const adminId = req.user?.user_id; // you should have a middleware that sets req.user after authentication
  if (!adminId) {
    return res.status(401).json({ error: 'Unauthorized: Admin ID not found' });
  }

  const insertSql = `
    INSERT INTO products (name, description, price, stock, category_id, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [name, description, parseFloat(price), parseInt(stock), category_id || null, adminId];

  connection.execute(insertSql, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting product (admin):', err);
      return res.status(500).json({ error: 'Error inserting product', details: err });
    }

    const productId = result.insertId;

    // handle images if uploaded
    if (images.length > 0) {
      const insertImageSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
      const imagePaths = images.map(file => [productId, file.path.replace(/\\/g, '/')]);

      connection.query(insertImageSql, [imagePaths], (err) => {
        if (err) {
          console.error('❌ Error inserting images:', err);
          return res.status(500).json({ error: 'Error inserting images', details: err });
        }

        return res.status(201).json({
          success: true,
          message: 'Admin product and images saved successfully',
          product_id: productId
        });
      });
    } else {
      return res.status(201).json({
        success: true,
        message: 'Admin product saved without images',
        product_id: productId
      });
    }
  });
};


// ============================
// Update product (Admin)
// ============================
exports.updateAdminProduct = (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock, category_id } = req.body;

  let imagePath = [];

  if (req.files && req.files.length > 0) {
    imagePath = req.files.map(file => file.path.replace(/\\/g, "/"));
  }

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

//   if (!category_id) {
//     return res.status(400).json({ error: 'Category is required' });
//   }

  const updateSql = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
    WHERE product_id = ?
  `;
  const values = [name, description, price, stock, category_id || null , id];

  connection.execute(updateSql, values, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating product', details: err });
    }

    // If new images uploaded, replace old ones
    if (imagePath.length > 0) {
      const deleteSql = 'DELETE FROM product_images WHERE product_id = ?';
      connection.execute(deleteSql, [id], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Failed to delete old images' });
        }

        const insertSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
        const imageValues = imagePath.map(p => [id, p]);

        connection.query(insertSql, [imageValues], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to insert new images' });
          }

          return res.status(200).json({ success: true, message: 'Product updated with new images' });
        });
      });
    } else {
      return res.status(200).json({ success: true, message: 'Product updated successfully (no new images)' });
    }
  });
};

// ============================
// Delete product (Admin)
// ============================
exports.deleteAdminProduct = (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM products WHERE product_id = ?';

  connection.execute(sql, [id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error deleting product', details: err });
    }
    return res.status(200).json({
      success: true,
      message: 'Product deleted'
    });
  });
};