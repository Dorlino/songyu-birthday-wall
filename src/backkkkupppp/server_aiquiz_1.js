import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: "2mb" }))

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 测试首页
app.get("/", (req, res) => {
  res.send("AI server is running")
})

// AI 出题接口
app.post("/api/generate", async (req, res) => {
  console.log("收到生成请求")

  try {
    const { text } = req.body

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        error: "文本太短",
      })
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
你是一个教育题库生成 AI。

任务：
1. 根据知识文本生成 5 道填空选择题
2. 自动识别核心知识点
3. 错误选项必须是相近概念
4. 不要太简单
5. 不要重复
6. 只能返回 JSON
7. 不要 markdown
8. 不要解释

返回格式：

{
  "questions": [
    {
      "question": "债券价格与市场利率呈____关系",
      "answer": "反向",
      "options": ["反向", "正向", "随机", "线性"]
    }
  ]
}
`,
        },
        {
          role: "user",
          content: text,
        },
      ],

      temperature: 0.7,
    })

    let output = completion.choices[0].message.content

    console.log("AI 原始返回：")
    console.log(output)

    // 清理 markdown
    output = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    // 截取 JSON
    const start = output.indexOf("{")
    const end = output.lastIndexOf("}")

    if (start !== -1 && end !== -1) {
      output = output.slice(start, end + 1)
    }

    const data = JSON.parse(output)

    console.log("解析成功")

    res.json(data)
  } catch (err) {
    console.log("========== SERVER ERROR ==========")
    console.log(err)

    res.status(500).json({
      error: err.message || "生成失败",
    })
  }
})

// 启动服务器
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})

// 防止终端自动退出
setInterval(() => {}, 1000)