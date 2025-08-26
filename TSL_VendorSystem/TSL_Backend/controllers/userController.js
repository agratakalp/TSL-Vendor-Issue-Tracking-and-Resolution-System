const db = require('../models/db');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, role, created_at FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role || 'user']
    );
    res.status(201).json({ id: result.insertId, message: 'User created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE users SET username = ?, role = ? WHERE id = ?",
      [username, role, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 