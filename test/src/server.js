const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors'); // 添加 CORS 支持

const app = express();
app.use(express.json());
app.use(cors()); // 允许所有跨域请求

// 数据库连接设置
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// 用户登录
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error on the server.', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Password is not correct.' });
    }
    res.json({ message: 'Login successful!', user: { id: user.id, email: user.email } });
  });
});

// 服务器启动
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
