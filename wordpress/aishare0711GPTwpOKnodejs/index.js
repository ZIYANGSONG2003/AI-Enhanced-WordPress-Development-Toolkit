const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const mysql = require('mysql2');
const cors = require('cors');

// 加载环境变量
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // 允许所有来源

const openai = new OpenAI({
  apiKey: process.env.API_KEY
});

// 数据库配置
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database.');
  }
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('This is root syb page.');
});

app.get('/aishare', (req, res) => {
  res.send('This is the AI share page.');
});

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  res.send(`Name: ${name}, Email: ${email}, Message: ${message}`);
});

app.get('*', (req, res) => {
  res.send('Thank you');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// 文本对话
app.post("/chat/", async (req, res) => {
  const { message } = req.body;
  console.log('message:', message);
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    const result = completion.choices[0].message.content;

    // Insert the generated shortcode into the database
    const shortcodeName = 'generated_shortcode';
    const query = 'INSERT INTO wp_shortcode_visualizer (shortcode_name, shortcode_content) VALUES (?, ?)';
    db.query(query, [shortcodeName, result], (err, results) => {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ error: "Database insertion error" });
        return;
      }
      console.log('Shortcode inserted into database:', results);

      // Provide the result to the user
      res.json({ result });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "POST Error communicating with OpenAI" });
  }
});

// 生成图片
app.post('/create/image', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "1024x1024"
    });
    res.json({
      result: completion.data[0].url
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error generating image with OpenAI" });
  }
});

app.post('*', (req, res) => {
  res.json({
    message: 'Thank you',
    path: req.path,
    headers: req.headers,
    body: req.body
  });
});
