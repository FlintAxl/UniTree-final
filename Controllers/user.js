
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'customer';

        // ✅ Seller starts as 'pending', customer is 'approved'
        const status = userRole === 'seller' ? 'pending' : 'approved';

        const userSql = 'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)';
        connection.execute(userSql, [username, email, hashedPassword, userRole, status], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            const userId = result.insertId;

            // ✅ Send special message if seller
            let message = 'Registration successful!';
            if (userRole === 'seller') {
                message = 'Wait for approval and verification to register as seller.';
            }

            res.status(201).json({
                success: true,
                message,
                user: { user_id: userId, username, email, role: userRole, status },
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const sql = `SELECT user_id, username, email, password, role, status, token FROM users WHERE email = ?`;
    connection.execute(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error logging in' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = results[0];

        // ✅ Block seller login until approved
        if (user.role === 'seller' && user.status !== 'approved') {
            return res.status(403).json({
                error:
                    user.status === 'pending'
                        ? 'Your seller account is pending approval.'
                        : 'Your seller account has been rejected.'
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET);
        connection.execute('UPDATE users SET token = ? WHERE user_id = ?', [token, user.user_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: 'Error saving token' });

            delete user.password;
            res.status(200).json({
                success: true,
                user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role },
                token
            });
        });
    });
};


exports.logoutUser = (req, res) => {
    // Check Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Invalid token format' });

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = parseInt(req.body.id, 10);
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const sql = 'UPDATE users SET token = NULL WHERE user_id = ?';
    connection.execute(sql, [userId], (err, result) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Error logging out', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'Logout successful' });
    });
};

//ADMIN SIDE

// Get all users (for DataTable)
// controllers/adminUsers.js (or wherever your handler is)
exports.getAllUsers = (req, res) => {
    // If ?role=seller is present, return more seller fields (exclude sensitive ones)
    const { role } = req.query;

    let sql;
    if (role && role === 'seller') {
        // Return the seller fields we need for the PDF (exclude password, token, profile_picture, status)
        sql = `SELECT user_id, username, email, role, created_at,
                  first_name, last_name, age, birthday, address, gender
           FROM users
           WHERE role = 'seller'`;
    } else {
        // Default (keeps original behavior)
        sql = 'SELECT user_id, username, email, role, created_at FROM users';
    }

    connection.execute(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users', details: err });
        }
        res.status(200).json({ data: results });
    });
};


exports.getUserById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT user_id, username, email, role, created_at FROM users WHERE user_id = ?';
    connection.execute(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user', details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user: results[0] });
    });
};

// Create new user (Admin version, no login restriction)
exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    connection.execute(sql, [username, email, hashedPassword, role || 'customer'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating user', details: err });
        }
        res.status(201).json({ success: true, message: 'User created successfully', userId: result.insertId });
    });
};

// Update user (username, email, role)
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const sql = 'UPDATE users SET username = ?, email = ?, role = ? WHERE user_id = ?';
    connection.execute(sql, [username, email, role, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating user', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User updated successfully' });
    });
};

// Delete user (hard delete)
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE user_id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting user', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    });
};

// PROFILE FUNCTIONS - CORRECTED

// Get user profile (including profile_picture)
exports.getUserProfile = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT user_id, username, email, role, first_name, last_name, age, birthday, address, gender, profile_picture, contact_number, created_at
               FROM users WHERE user_id = ?`;

    connection.execute(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching user profile', details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        // Format birthday for frontend if it exists
        if (user.birthday) {
            user.birthday = new Date(user.birthday).toISOString().split('T')[0];
        }

        res.status(200).json({ success: true, user });
    });
};

// Update user profile (including profile_picture)
exports.updateUserProfile = (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name, age, birthday, address, gender, profile_picture, contact_number } = req.body;

    // Build dynamic SQL based on provided fields
    let updateFields = [];
    let values = [];

    if (username) {
        updateFields.push('username = ?');
        values.push(username);
    }
    if (email) {
        updateFields.push('email = ?');
        values.push(email);
    }
    if (first_name !== undefined) {
        updateFields.push('first_name = ?');
        values.push(first_name);
    }
    if (last_name !== undefined) {
        updateFields.push('last_name = ?');
        values.push(last_name);
    }
    if (age !== undefined) {
        updateFields.push('age = ?');
        values.push(age);
    }
    if (birthday !== undefined) {
        updateFields.push('birthday = ?');
        values.push(birthday);
    }
    if (address !== undefined) {
        updateFields.push('address = ?');
        values.push(address);
    }
    if (gender !== undefined) {
        updateFields.push('gender = ?');
        values.push(gender);
    }
    if (profile_picture !== undefined) {
        updateFields.push('profile_picture = ?');
        values.push(profile_picture);
    }
    if (contact_number !== undefined) {
        updateFields.push('contact_number = ?');
        values.push(contact_number);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id); // Add ID for WHERE clause
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;

    connection.execute(sql, values, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Error updating profile', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    });
};

exports.getSecurityInfo = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT username, email FROM users WHERE user_id = ?';

    connection.execute(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching security info', details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, user: results[0] });
    });
};


exports.changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    console.log('Password change request for user ID:', id);

    if (!currentPassword || !newPassword) {
        console.log('Missing password fields');
        return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
        console.log('New password too short');
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    try {

        const getUserSql = 'SELECT password FROM users WHERE user_id = ?';
        console.log('Fetching user with ID:', id);

        connection.execute(getUserSql, [id], async (err, results) => {
            if (err) {
                console.error('Database error fetching user:', err);
                return res.status(500).json({ error: 'Error fetching user data', details: err });
            }

            if (results.length === 0) {
                console.log('User not found with ID:', id);
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results[0];
            console.log('User found, verifying current password...');


            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            console.log('Current password valid:', isCurrentPasswordValid);

            if (!isCurrentPasswordValid) {
                console.log('Current password is incorrect');
                return res.status(400).json({ error: 'Current password is incorrect' });
            }


            console.log('Hashing new password...');
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            console.log('New password hashed successfully');

            const updateSql = 'UPDATE users SET password = ? WHERE user_id = ?';
            console.log('Updating password for user ID:', id);

            connection.execute(updateSql, [hashedNewPassword, id], (updateErr, result) => {
                if (updateErr) {
                    console.error('Update error:', updateErr);
                    return res.status(500).json({ error: 'Error updating password', details: updateErr });
                }

                console.log('Update result - affected rows:', result.affectedRows);

                if (result.affectedRows === 0) {
                    console.log('No rows affected - user not found');
                    return res.status(404).json({ error: 'User not found' });
                }

                console.log('Password updated successfully');
                res.status(200).json({ success: true, message: 'Password changed successfully' });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Add this function to your Controllers/user.js

// Improved version of getSellerAnalytics in your user.js controller

exports.getSellerAnalytics = (req, res) => {
    const { sellerId } = req.params;
    const { timeframe = 'month' } = req.query;

    // Validate sellerId
    if (!sellerId || isNaN(sellerId)) {
        return res.status(400).json({ error: 'Valid seller ID is required' });
    }

    // Get date range based on timeframe
    let dateCondition = '';
    let groupByFormat = '';

    switch (timeframe) {
        case 'week':
            dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
            groupByFormat = 'DATE(o.created_at)';
            break;
        case 'month':
            dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
            groupByFormat = 'DATE(o.created_at)';
            break;
        case 'year':
            dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
            groupByFormat = 'DATE_FORMAT(o.created_at, "%Y-%m")'; // Monthly aggregation for year view
            break;
        default:
            dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
            groupByFormat = 'DATE(o.created_at)';
    }

    // Fixed product sales query - use INNER JOIN to only get products with sales
    const productSalesQuery = `
    SELECT 
      p.name as product_name,
      p.product_id,
      COALESCE(SUM(oi.quantity), 0) as total_sold,
      COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
      COUNT(DISTINCT o.order_id) as order_count
    FROM products p
    INNER JOIN order_items oi ON p.product_id = oi.product_id
    INNER JOIN orders o ON oi.order_id = o.order_id
    WHERE p.seller_id = ? ${dateCondition}
    GROUP BY p.product_id, p.name
    ORDER BY total_sold DESC
    LIMIT 10
  `;

    // Improved daily sales query with better date formatting
    const dailySalesQuery = `
    SELECT 
      ${groupByFormat} as sale_date,
      COALESCE(SUM(oi.quantity), 0) as daily_quantity,
      COALESCE(SUM(oi.quantity * oi.price), 0) as daily_revenue,
      COUNT(DISTINCT o.order_id) as daily_orders
    FROM orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN products p ON oi.product_id = p.product_id
    WHERE p.seller_id = ? ${dateCondition}
    GROUP BY ${groupByFormat}
    ORDER BY sale_date ASC
  `;

    // Category sales query with null handling
    const categorySalesQuery = `
    SELECT 
      c.name as category_name,
      COALESCE(SUM(oi.quantity), 0) as category_quantity,
      COALESCE(SUM(oi.quantity * oi.price), 0) as category_revenue
    FROM categories c
    INNER JOIN products p ON c.category_id = p.category_id
    INNER JOIN order_items oi ON p.product_id = oi.product_id
    INNER JOIN orders o ON oi.order_id = o.order_id
    WHERE p.seller_id = ? ${dateCondition}
    GROUP BY c.category_id, c.name
    HAVING category_revenue > 0
    ORDER BY category_revenue DESC
  `;

    // Summary query for overall stats
    const summaryQuery = `
    SELECT 
      COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
      COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
      COUNT(DISTINCT o.order_id) as total_orders,
      COUNT(DISTINCT p.product_id) as products_sold
    FROM products p
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    WHERE p.seller_id = ? ${dateCondition}
  `;

    // Execute queries in parallel using Promise.all for better performance
    const executeQuery = (query, params) => {
        return new Promise((resolve, reject) => {
            connection.execute(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    };

    Promise.all([
        executeQuery(summaryQuery, [sellerId]),
        executeQuery(productSalesQuery, [sellerId]),
        executeQuery(dailySalesQuery, [sellerId]),
        executeQuery(categorySalesQuery, [sellerId])
    ])
        .then(([summaryResults, productResults, dailyResults, categoryResults]) => {
            const summary = summaryResults[0] || {
                total_revenue: 0,
                total_quantity_sold: 0,
                total_orders: 0,
                products_sold: 0
            };

            // Ensure arrays are never empty for frontend
            const responseData = {
                summary: {
                    totalRevenue: parseFloat(summary.total_revenue || 0).toFixed(2),
                    totalQuantitySold: parseInt(summary.total_quantity_sold || 0),
                    totalOrders: parseInt(summary.total_orders || 0),
                    productsSold: parseInt(summary.products_sold || 0),
                    timeframe
                },
                productSales: productResults || [],
                dailySales: dailyResults || [],
                categorySales: categoryResults || []
            };

            res.status(200).json({
                success: true,
                data: responseData
            });
        })
        .catch(error => {
            console.error('Analytics query error:', error);
            res.status(500).json({
                success: false,
                error: 'Error fetching analytics data',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        });
};


// =======================
// SELLER MANAGEMENT
// =======================

// Get all pending sellers
exports.getPendingSellers = (req, res) => {
    const sql = "SELECT user_id, username, email, status FROM users WHERE role='seller' AND status='pending'";
    connection.execute(sql, (err, results) => {
        if (err) {
            console.error('Error fetching pending sellers:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
};

// Approve seller
exports.approveSeller = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE users SET status='approved' WHERE user_id=?";
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            console.error('Error approving seller:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Seller approved' });
    });
};

// Reject seller
exports.rejectSeller = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE users SET status='rejected' WHERE user_id=?";
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            console.error('Error rejecting seller:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Seller rejected' });
    });
};

