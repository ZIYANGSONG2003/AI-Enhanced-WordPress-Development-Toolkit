const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// 处理根路径的 GET 请求
app.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 打开远程网页
        await page.goto('https://chatgpt.com');

        // 获取远程网页的标题和内容
        const title = await page.title();
        const content = await page.content(); // 获取页面的 HTML 内容

        // 关闭 Puppeteer 浏览器实例
      //  await browser.close();

        // 生成动态网页内容
        const dynamicHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>
            <body>
                <h1>${title}</h1>
                <div>
                    <h2>远程网页内容：</h2>
                    ${content}
                </div>
            </body>
            </html>
        `;

        // 将生成的动态网页内容发送给客户端浏览器
        console.log(dynamicHTML); // 输出生成的动态网页内容

        res.send(dynamicHTML);
    } catch (error) {
        console.error('获取远程网页信息出错:', error);
        res.status(500).send('服务器出错');
    }
});


const { OpenAIApi } = require('openai');
const { Configuration } = require('openai');


// 使用你的 OpenAI API 密钥
const configuration = new Configuration({
  apiKey: 'apikey',});

const openai = new OpenAIApi(configuration);

async function getChatGPTResponse(prompt) {
  try {
    const response = await openai.createCompletion({
      model: "gpt-4", // 或者你想要使用的其他模型
      prompt: prompt,
      max_tokens: 150, // 根据需要调整
      temperature: 0.7, // 根据需要调整
    });

    console.log(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
  }
}

// 示例调用
getChatGPTResponse("介绍一下Node.js");




// 启动 Express 服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});