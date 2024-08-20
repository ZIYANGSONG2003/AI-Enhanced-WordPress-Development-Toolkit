const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());

dotenv.config(); // 加载环境变量

const openai = new OpenAI({
  apiKey: process.env.API_KEY // 使用环境变量中的 API_KEY
});

// 文本对话
app.get("", async (req, res) => {
    const message = "who are you";
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }]
        });
        res.json({
            result: completion.choices[0].message.content // 返回信息
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});

// 文本对话
app.post("/chat", async (req, res) => {
    const { message } = req.body; // message 就是你要问的问题
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        });
        res.json({
            result: completion.choices[0].message.content // 返回信息
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});

// 生成图片
app.post('/create/image', async (req, res) => {
    const { prompt } = req.body; // 你要描述的图片信息
    try {
        const completion = await openai.images.generate({
            model: "dall-e-2", // 使用的模型
            prompt,
            n: 1,
            size: "1024x1024"
        });
        res.json({
            result: completion.data[0].url // 返回图片地址
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error generating image with OpenAI" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
