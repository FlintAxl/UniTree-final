const connection = require('../config/database');

// ================= HELPER: Create Notification for Customer =================
function createNotificationForCustomer(orderId, status, notes, callback) {
    console.log('Creating notification for order:', orderId, 'status:', status);

    const getCustomerQuery = 'SELECT user_id FROM orders WHERE order_id = ?';

    connection.query(getCustomerQuery, [orderId], (err, results) => {
        if (err) {
            console.error('Error getting customer ID:', err);
            return callback(err);
        }

        if (results.length === 0) {
            console.error('Order not found when creating notification');
            return callback(new Error('Order not found'));
        }

        const customerId = results[0].user_id;
        const notificationNotes = notes || `Your order status has been updated to ${status}`;

        console.log('Inserting notification for user:', customerId);

        const insertNotificationQuery = `
            INSERT INTO notifications (order_id, user_id, status, notes, is_read, created_at, updated_at)
            VALUES (?, ?, ?, ?, false, NOW(), NOW())
        `;

        connection.query(
            insertNotificationQuery,
            [orderId, customerId, status, notificationNotes],
            (insertErr, result) => {
                if (insertErr) {
                    console.error('Error creating notification:', insertErr);
                    return callback(insertErr);
                }

                console.log(`✅ Notification created successfully for user ${customerId}, order ${orderId}`);
                callback(null, result.insertId);
            }
        );
    });
}

// ================= HELPER: Award Coins =================
function awardCoins(orderId, callback) {
    connection.query('SELECT user_id, total_amount FROM orders WHERE order_id = ?', [orderId], (err, rows) => {
        if (err) {
            console.error('Error fetching order for coins:', err);
            return callback(err);
        }
        if (rows.length === 0) {
            return callback(new Error('Order not found'));
        }

        const { user_id, total_amount } = rows[0];
        const coins_earned = Math.floor(total_amount * 0.1);

        connection.query('SELECT * FROM transactions WHERE order_id = ?', [orderId], (err2, transRows) => {
            if (err2) {
                console.error('Error checking transaction:', err2);
                return callback(err2);
            }
            if (transRows.length > 0) {
                console.log(`Coins already awarded for order ${orderId}`);
                return callback(null);
            }

            connection.query(
                'INSERT INTO transactions (user_id, order_id, coins_earned) VALUES (?, ?, ?)',
                [user_id, orderId, coins_earned],
                (err3) => {
                    if (err3) {
                        console.error('Error awarding coins:', err3);
                        return callback(err3);
                    }
                    console.log(`✅ Coins awarded: ${coins_earned} for order ${orderId} to user ${user_id}`);
                    callback(null);
                }
            );
        });
    });
}

// ================= CREATE ORDER (WITH PAYMENT METHOD) =================
exports.createOrder = (req, res) => {
    const {
        user_id,
        items,
        discount_percent,
        discount_amount,
        discount_code,
        reward_id,
        payment_method
    } = req.body;

    if (!user_id || !Array.isArray(items)) {
        return res.status(400).json({ error: "Missing user_id or items" });
    }

    const validPaymentMethods = ['cod', 'gcash', 'maya', 'online_bank', 'bank_transfer'];
    const finalPaymentMethod = validPaymentMethods.includes(payment_method) ? payment_method : 'cod';

    console.log('💳 Payment method for order:', finalPaymentMethod);

    const checkStockSql = `
        SELECT product_id, stock 
        FROM products 
        WHERE product_id IN (${items.map(() => '?').join(',')})
    `;
    const productIds = items.map(i => i.product_id);

    connection.query(checkStockSql, productIds, (err, stockRows) => {
        if (err) return res.status(500).json({ error: 'Stock check failed', details: err });

        for (const item of items) {
            const dbItem = stockRows.find(r => r.product_id === item.product_id);
            if (!dbItem || dbItem.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for product_id ${item.product_id}`
                });
            }
        }

        const orderSql = `
            INSERT INTO orders 
            (user_id, total_amount, discount_percent, discount_amount, discount_code, reward_id, payment_method) 
            VALUES (?, 0, ?, ?, ?, ?, ?)
        `;

        connection.execute(
            orderSql,
            [
                user_id,
                discount_percent || 0,
                discount_amount || 0,
                discount_code || null,
                reward_id || null,
                finalPaymentMethod
            ],
            (err2, result) => {
                if (err2) {
                    console.error('Insert order failed:', err2);
                    return res.status(500).json({ error: 'Insert order failed', details: err2 });
                }

                const orderId = result.insertId;
                console.log(`✅ Order ${orderId} created with payment method: ${finalPaymentMethod}`);

                const orderLines = items.map(item => [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]);

                const orderLineSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';

                connection.query(orderLineSql, [orderLines], (err3) => {
                    if (err3) return res.status(500).json({ error: 'Insert order_items failed', details: err3 });

                    let totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                    if (discount_percent && discount_percent > 0) {
                        const discountValue = (discount_percent / 100) * totalAmount;
                        totalAmount -= discountValue;
                        console.log(`✅ Discount applied: ${discount_percent}% (₱${discountValue.toFixed(2)})`);
                    }

                    function finalizeAfterRewardUpdate() {
                        connection.execute(
                            'UPDATE orders SET total_amount = ? WHERE order_id = ?',
                            [totalAmount, orderId],
                            (err4) => {
                                if (err4) return res.status(500).json({ error: 'Failed to update total amount', details: err4 });

                                const updateStockQueries = items.map(item => {
                                    return new Promise((resolve, reject) => {
                                        const updateSql = 'UPDATE products SET stock = stock - ? WHERE product_id = ?';
                                        connection.execute(updateSql, [item.quantity, item.product_id], (err5) => {
                                            if (err5) reject(err5);
                                            else resolve();
                                        });
                                    });
                                });

                                Promise.all(updateStockQueries)
                                    .then(() => {
                                        console.log(`✅ Order ${orderId} created successfully with payment: ${finalPaymentMethod}`);
                                        return res.status(200).json({
                                            success: true,
                                            orderId,
                                            order_id: orderId,
                                            payment_method: finalPaymentMethod
                                        });
                                    })
                                    .catch(err6 => {
                                        return res.status(500).json({ error: 'Stock deduction failed', details: err6 });
                                    });
                            }
                        );
                    }

                    if (reward_id) {
                        const rid = parseInt(reward_id, 10);
                        connection.execute(
                            'UPDATE rewards SET is_used = 1, used_at = NOW() WHERE reward_id = ?',
                            [rid],
                            (err) => {
                                if (err) console.error('Failed to mark discount used:', err);
                                else console.log(`✅ Reward ${rid} marked as used for order ${orderId}`);
                                finalizeAfterRewardUpdate();
                            }
                        );
                    } else {
                        finalizeAfterRewardUpdate();
                    }
                });
            }
        );
    });
};

// ================= GET CUSTOMER ORDERS =================
exports.getCustomerOrders = (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
        SELECT 
            o.order_id, 
            o.date_placed, 
            o.status,
            o.payment_method,
            o.discount_percent,
            o.discount_amount,
            o.discount_code,
            GROUP_CONCAT(CONCAT(p.name, ' x', oi.quantity) SEPARATOR ', ') AS items,
            SUM(oi.price * oi.quantity) AS total_price,
            o.total_amount
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = ?
        GROUP BY o.order_id
        ORDER BY o.date_placed DESC
    `;

    connection.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('❌ Error fetching customer orders:', err);
            return res.status(500).json({ error: 'Failed to fetch orders', details: err });
        }

        console.log('✅ Customer orders fetched');
        res.status(200).json({ data: result });
    });
};

// ================= CANCEL ORDER (with required cancellation reason + transaction) =================
exports.cancelOrder = (req, res) => {
  const { order_id, reason } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: 'order_id is required' });
  }

  // reason must be provided and non-empty (trimmed)
  if (!reason || String(reason).trim().length === 0) {
    return res.status(400).json({ error: 'Cancellation reason is required' });
  }

  // begin transaction
  connection.beginTransaction((txErr) => {
    if (txErr) return res.status(500).json({ error: 'Failed to start transaction', details: txErr });

    // Check order exists and is in pending status, and fetch its items
    const getOrderSql = 'SELECT status FROM orders WHERE order_id = ? FOR UPDATE';
    connection.query(getOrderSql, [order_id], (errOrder, orderRows) => {
      if (errOrder) {
        return connection.rollback(() => {
          return res.status(500).json({ error: 'Failed to fetch order', details: errOrder });
        });
      }

      if (!orderRows || orderRows.length === 0) {
        return connection.rollback(() => {
          return res.status(404).json({ error: 'Order not found' });
        });
      }

      const currentStatus = orderRows[0].status;
      if (currentStatus !== 'pending') {
        return connection.rollback(() => {
          return res.status(400).json({ error: 'Only pending orders can be cancelled' });
        });
      }

      // fetch items for the order
      const getItemsSql = 'SELECT product_id, quantity FROM order_items WHERE order_id = ?';
      connection.query(getItemsSql, [order_id], (errItems, itemRows) => {
        if (errItems) {
          return connection.rollback(() => {
            return res.status(500).json({ error: 'Failed to fetch order items', details: errItems });
          });
        }

        // If no items found, still allow cancellation but warn
        if (!itemRows || itemRows.length === 0) {
          // proceed to update order status and reason
          const updateOrderSql = `
            UPDATE orders
            SET status = 'cancelled',
                cancellation_reason = ?,
                cancellation_date = NOW()
            WHERE order_id = ? AND status = 'pending'
          `;
          connection.query(updateOrderSql, [String(reason).trim(), order_id], (errUpd, resultUpd) => {
            if (errUpd) {
              return connection.rollback(() => {
                return res.status(500).json({ error: 'Failed to cancel order', details: errUpd });
              });
            }

            if (resultUpd.affectedRows === 0) {
              return connection.rollback(() => {
                return res.status(400).json({ error: 'Order not found or not in pending status' });
              });
            }

            // commit
            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  return res.status(500).json({ error: 'Transaction commit failed', details: commitErr });
                });
              }
              return res.status(200).json({ success: true, message: 'Order cancelled (no items) and reason saved' });
            });
          });

          return;
        }

        // Build queries to restore stock for each item
        // Use Promise chain to update stock sequentially (or use Promise.all with callbacks)
        const stockUpdates = itemRows.map(item => {
          return new Promise((resolve, reject) => {
            const rollbackSql = 'UPDATE products SET stock = stock + ? WHERE product_id = ?';
            connection.query(rollbackSql, [item.quantity, item.product_id], (errStock) => {
              if (errStock) return reject(errStock);
              return resolve();
            });
          });
        });

        Promise.all(stockUpdates)
          .then(() => {
            // After stock rolled back, update order status + reason + cancellation_date
            const updateStatusSql = `
              UPDATE orders
              SET status = 'cancelled',
                  cancellation_reason = ?,
                  cancellation_date = NOW()
              WHERE order_id = ? AND status = 'pending'
            `;

            connection.query(updateStatusSql, [String(reason).trim(), order_id], (errUpdate, result) => {
              if (errUpdate) {
                return connection.rollback(() => {
                  return res.status(500).json({ error: 'Failed to cancel order', details: errUpdate });
                });
              }

              if (result.affectedRows === 0) {
                return connection.rollback(() => {
                  return res.status(400).json({ error: 'Order not found or not in pending status' });
                });
              }

              // commit transaction
              connection.commit((commitErr) => {
                if (commitErr) {
                  return connection.rollback(() => {
                    return res.status(500).json({ error: 'Transaction commit failed', details: commitErr });
                  });
                }

                return res.status(200).json({
                  success: true,
                  message: 'Order cancelled, stock rolled back and cancellation reason saved'
                });
              });
            });
          })
          .catch(stockErr => {
            return connection.rollback(() => {
              return res.status(500).json({ error: 'Stock rollback failed', details: stockErr });
            });
          });
      }); // end getItems query
    }); // end getOrder query
  }); // end beginTransaction
};

// ================= ADMIN: GET ALL ORDERS =================
exports.getAllOrders = (req, res) => {
    const sql = `
        SELECT 
            o.order_id,
            u.username AS customer_name,
            o.date_placed,
            o.status,
            o.payment_method,
            o.total_amount,
            (
                SELECT GROUP_CONCAT(p.name SEPARATOR ', ')
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = o.order_id
            ) AS items
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        ORDER BY o.date_placed DESC
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
    });
};

// ================= ADMIN: UPDATE ORDER STATUS =================
exports.updateOrderStatus = (req, res) => {
    const { order_id, status } = req.body;

    const validStatuses = ['pending', 'received', 'cancelled', 'shipped'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    if (status === 'cancelled') {
        const getItemsSql = 'SELECT product_id, quantity FROM order_items WHERE order_id = ?';

        connection.query(getItemsSql, [order_id], (err, itemRows) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch order items', details: err });

            const rollbackPromises = itemRows.map(item => {
                return new Promise((resolve, reject) => {
                    const rollbackSql = 'UPDATE products SET stock = stock + ? WHERE product_id = ?';
                    connection.query(rollbackSql, [item.quantity, item.product_id], (err2) => {
                        if (err2) reject(err2);
                        else resolve();
                    });
                });
            });

            Promise.all(rollbackPromises)
                .then(() => {
                    finalizeStatusUpdate(order_id, status, res);
                })
                .catch(err3 => {
                    return res.status(500).json({ error: 'Stock rollback failed', details: err3 });
                });
        });
    } else {
        finalizeStatusUpdate(order_id, status, res);
    }
};

function finalizeStatusUpdate(order_id, status, res) {
    connection.execute(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        [status, order_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to update status', details: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

            if (status === 'received') {
                awardCoins(order_id, (err) => {
                    if (err) console.error('Failed to award coins:', err);
                });
            }

            return res.status(200).json({ success: true, message: 'Status updated successfully' });
        }
    );
}

// ================= GET SELLER ORDERS =================
// ================= GET SELLER ORDERS =================
exports.getSellerOrders = (req, res) => {
    const { sellerId } = req.params;

    const sql = `
        SELECT 
            o.order_id,
            o.user_id,
            o.status,
            o.date_placed,
            o.date_shipped,
            o.payment_method,
            o.discount_percent,
            o.discount_amount,
            o.discount_code,
            o.reward_id,
            o.cancellation_reason,
            o.cancellation_date,
            oi.order_item_id,
            oi.quantity,
            oi.price,
            p.name,
            p.product_id,
            u.username,
            u.email
        FROM orders o
        INNER JOIN order_items oi ON o.order_id = oi.order_id
        INNER JOIN products p ON oi.product_id = p.product_id
        INNER JOIN users u ON o.user_id = u.user_id
        WHERE p.seller_id = ?
        ORDER BY o.date_placed DESC
    `;

    connection.query(sql, [sellerId], (err, results) => {
        if (err) {
            console.error('Error fetching seller orders:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch orders',
                details: err
            });
        }

        // results already include cancellation_reason & cancellation_date,
        // pass them through to the frontend unchanged.
        res.json({
            success: true,
            orders: results
        });
    });
};


// ================= UPDATE ORDER STATUS (Seller) =================
exports.updateOrderStatusSeller = (req, res) => {
    const { orderId } = req.params;
    const { status, notes, notify_customer = true } = req.body;

    console.log('🔔 Updating order status:', { orderId, status, notes, notify_customer });

    const validStatuses = ['pending', 'shipped', 'received', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid status value'
        });
    }

    let updateSql = 'UPDATE orders SET status = ?';
    let params = [status];

    if (status === 'shipped') {
        updateSql += ', date_shipped = NOW()';
    }

    updateSql += ' WHERE order_id = ?';
    params.push(orderId);

    connection.execute(updateSql, params, (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to update order status',
                details: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        console.log(`✅ Order ${orderId} status updated to ${status}`);

        if (notify_customer) {
            createNotificationForCustomer(orderId, status, notes, (notificationErr) => {
                if (notificationErr) {
                    console.error('❌ Failed to create notification:', notificationErr);
                } else {
                    console.log(`✅ Notification sent for order ${orderId}`);
                }
            });
        }

        if (status === 'received') {
            awardCoins(orderId, (coinErr) => {
                if (coinErr) console.error('Failed to award coins:', coinErr);
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    });
};

// ================= GET USER REWARDS =================
exports.getUserRewards = (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ success: false, error: 'User ID required' });
    }

    connection.query(
        'SELECT COALESCE(SUM(coins_earned), 0) as total_coins FROM transactions WHERE user_id = ?',
        [user_id],
        (err, sumResult) => {
            if (err) {
                console.error('Error fetching total coins:', err);
                return res.status(500).json({ success: false, error: 'Database error' });
            }

            const total_coins = sumResult[0].total_coins;

            res.json({
                success: true,
                data: {
                    total_coins
                }
            });
        }
    );
};

// ================= GET USER DISCOUNTS =================
exports.getUserDiscounts = (req, res) => {
    const user_id = req.params.user_id;
    connection.query(
        'SELECT reward_id, reward_type, value, is_used FROM rewards WHERE user_id = ? AND is_used = 0',
        [user_id],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false, error: 'DB error' });
            res.json({ success: true, discounts: rows });
        }
    );
};

// ================= TRADE DISCOUNT =================
exports.tradeDiscount = (req, res) => {
    const { user_id, percent, cost } = req.body;

    if (!user_id || !percent || !cost) {
        return res.status(400).json({ success: false, message: 'Missing data.' });
    }

    connection.query(
        'SELECT COALESCE(SUM(coins_earned), 0) AS total_coins FROM transactions WHERE user_id = ?',
        [user_id],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error.' });

            const total_coins = rows[0].total_coins;
            if (total_coins < cost) {
                return res.status(400).json({ success: false, message: 'Insufficient coins.' });
            }

            connection.query(
                'SELECT pet_id FROM pets WHERE user_id = ? LIMIT 1',
                [user_id],
                (errPet, petRows) => {
                    if (errPet || petRows.length === 0) {
                        return res.status(500).json({ success: false, message: 'No pet found for user.' });
                    }
                    const pet_id = petRows[0].pet_id;

                    connection.query(
                        'INSERT INTO transactions (user_id, order_id, coins_earned) VALUES (?, NULL, ?)',
                        [user_id, -cost],
                        (err2) => {
                            if (err2) return res.status(500).json({ success: false, message: 'Failed to deduct coins.' });

                            connection.query(
                                'INSERT INTO rewards (user_id, pet_id, reward_type, value) VALUES (?, ?, "discount", ?)',
                                [user_id, pet_id, `${percent}%`],
                                (err3) => {
                                    if (err3) return res.status(500).json({ success: false, message: 'Failed to save discount.' });

                                    res.json({ success: true, message: `You received a ${percent}% OFF coupon!` });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

// ================= GET USER NOTIFICATIONS =================
exports.getUserNotifications = (req, res) => {
    try {
        const { userId } = req.params;
        const { since } = req.query;

        console.log('📬 Fetching notifications for user:', userId);

        let query = `
            SELECT 
                notification_id,
                order_id,
                user_id,
                status,
                notes,
                is_read,
                created_at,
                updated_at
            FROM notifications
            WHERE user_id = ?
        `;

        const params = [userId];

        if (since) {
            query += ' AND created_at > ?';
            params.push(since);
        }

        query += ' ORDER BY created_at DESC LIMIT 50';

        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('❌ Error fetching notifications:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to fetch notifications',
                    details: err.message
                });
            }

            console.log(`✅ Found ${results.length} notifications`);

            res.json({
                success: true,
                notifications: results
            });
        });

    } catch (error) {
        console.error('❌ Error in getUserNotifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications',
            details: error.message
        });
    }
};

// ================= MARK NOTIFICATIONS AS READ =================
exports.markNotificationsAsRead = (req, res) => {
    try {
        const { userId } = req.params;

        console.log('📖 Marking notifications as read for user:', userId);

        const query = 'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false';

        connection.query(query, [userId], (err, result) => {
            if (err) {
                console.error('❌ Error marking notifications as read:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to mark notifications as read',
                    details: err
                });
            }

            console.log(`✅ Marked ${result.affectedRows} notifications as read`);

            res.json({
                success: true,
                message: `Marked ${result.affectedRows} notifications as read`,
                updated_count: result.affectedRows
            });
        });

    } catch (error) {
        console.error('❌ Error in markNotificationsAsRead:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark notifications as read'
        });
    }
};

// ================= TEST: Create Manual Notification =================
exports.createTestNotification = (req, res) => {
    const { userId, orderId, status, notes } = req.body;

    console.log('🧪 Creating test notification:', { userId, orderId, status, notes });

    const insertQuery = `
        INSERT INTO notifications (order_id, user_id, status, notes, is_read, created_at, updated_at)
        VALUES (?, ?, ?, ?, false, NOW(), NOW())
    `;

    connection.query(insertQuery, [orderId, userId, status, notes || 'Test notification'], (err, result) => {
        if (err) {
            console.error('❌ Error creating test notification:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to create test notification',
                details: err
            });
        }

        console.log(`✅ Test notification created with ID: ${result.insertId}`);

        res.json({
            success: true,
            message: 'Test notification created',
            notification_id: result.insertId
        });
    });
};