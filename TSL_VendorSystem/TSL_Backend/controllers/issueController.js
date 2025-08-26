const db = require('../models/db');

exports.getAllIssues = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM issues");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createIssue = async (req, res) => {
  const { title, description, date, vendor, issueType, status } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO issues (title, description, date, vendor, issueType, status) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, date, vendor, issueType, status || 'Open']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIssue = async (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE issues SET status = ? WHERE issue_id = ?",
      [status, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Issue updated successfully' });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
