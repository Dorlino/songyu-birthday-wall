import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_APP_TOKEN,
  FEISHU_TABLE_ID,
} = process.env

async function getTenantAccessToken() {
  const res = await axios.post(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET,
    }
  )

  if (res.data.code !== 0) {
    throw new Error(JSON.stringify(res.data))
  }

  return res.data.tenant_access_token
}

app.post("/api/wishes", async (req, res) => {
  try {
    const {
      nickname,
      wish,
      note_color,
      note_shape,
      sticker_type,
      sticker_color,
    } = req.body

    if (!nickname || !wish) {
      return res.status(400).json({
        success: false,
        message: "nickname 和 wish 不能为空",
      })
    }

    const token = await getTenantAccessToken()

    const result = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`,
      {
        fields: {
          nickname,
          wish,
          note_color,
          note_shape,
          sticker_type,
          sticker_color,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (result.data.code !== 0) {
      return res.status(500).json({
        success: false,
        message: "飞书写入失败",
        detail: result.data,
      })
    }

    res.json({
      success: true,
      data: result.data.data,
    })
  } catch (err) {
    console.error(err.response?.data || err.message)

    res.status(500).json({
      success: false,
      message: "服务器错误",
      detail: err.response?.data || err.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Feishu server running at http://localhost:${PORT}`)
})