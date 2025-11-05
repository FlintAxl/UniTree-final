const db = require('../config/database');

// 🧩 Get inventory
exports.getUserInventory = (req, res) => {
  const { user_id } = req.params;
  db.query(
    'SELECT item_type, quantity FROM user_inventory WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      const inventory = { water: 0, fertilizer: 0 };
      rows.forEach(r => inventory[r.item_type] = r.quantity);
      res.json({ success: true, inventory });
    }
  );
};

// .bili ng water and fertilizer

exports.buyItem = (req, res) => {
  const { user_id, item_type } = req.body;
  if (!user_id || !item_type) return res.status(400).json({ message: 'Missing data' });

  // ✅ Define cost per item
  const costMap = { water: 2, fertilizer: 5 };
  const cost = costMap[item_type];
  if (!cost) return res.status(400).json({ message: 'Invalid item type' });

  // ✅ Check user's available coins
  db.query(
    'SELECT COALESCE(SUM(coins_earned), 0) AS total_coins FROM transactions WHERE user_id = ?',
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      const totalCoins = result[0].total_coins;
      if (totalCoins < cost) return res.status(400).json({ message: 'Insufficient coins' });

      // ✅ Deduct cost (negative transaction)
      db.query(
        'INSERT INTO transactions (user_id, coins_earned) VALUES (?, ?)',
        [user_id, -cost],
        (err2) => {
          if (err2) return res.status(500).json({ error: 'DB error' });

          // ✅ Add item to inventory
          db.query(
            `INSERT INTO user_inventory (user_id, item_type, quantity)
             VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
            [user_id, item_type],
            (err3) => {
              if (err3) return res.status(500).json({ error: 'DB error' });
              res.json({ success: true, message: `Bought 1 ${item_type}`, cost });
            }
          );
        }
      );
    }
  );
};

