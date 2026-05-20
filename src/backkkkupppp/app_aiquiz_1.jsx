import { useState } from "react"
import "./App.css"

export default function App() {
  const [text, setText] = useState("")
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)

  async function generateQuestions() {
    if (text.trim().length < 20) {
      alert("请先粘贴一段稍微完整的知识文本")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      const data = await res.json()

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setCurrent(0)
        setScore(0)
      } else {
        alert(data.error || "AI 没有生成出题目")
      }
    } catch (err) {
      console.error(err)
      alert("连接后端失败，请确认 npm run server 正在运行")
    } finally {
      setLoading(false)
    }
  }

  function choose(option) {
    if (option === questions[current].answer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      setCurrent(current + 1)
    }, 200)
  }

  function restart() {
    setQuestions([])
    setCurrent(0)
    setScore(0)
  }

  const gameOver = questions.length > 0 && current >= questions.length
  const currentQuestion = questions[current]

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <p className="text-sm text-cyan-300 mb-2">AI Knowledge Game</p>
          <h1 className="text-4xl font-bold mb-3">知识小游戏生成器</h1>
          <p className="text-zinc-400">
            粘贴知识文档，AI 会自动识别核心考点，生成填空选择题。
          </p>
        </header>

        {questions.length === 0 && (
          <div className="rounded-3xl bg-white/10 border border-white/10 p-6 shadow-xl">
            <textarea
              className="w-full h-72 rounded-2xl bg-black/40 border border-white/10 p-4 outline-none text-white placeholder:text-zinc-500 leading-relaxed"
              placeholder="把课程笔记、PPT内容、知识点粘贴到这里……"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={generateQuestions}
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-cyan-300 text-black px-6 py-3 font-bold hover:bg-cyan-200 disabled:opacity-50"
            >
              {loading ? "AI 正在生成题目……" : "生成小游戏"}
            </button>
          </div>
        )}

        {questions.length > 0 && !gameOver && currentQuestion && (
          <div>
            <div className="mb-4 text-zinc-400">
              第 {current + 1} 题 / 共 {questions.length} 题　得分：{score}
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 p-8 mb-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">填空挑战</h2>
              <p className="text-xl leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  className="rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 p-5 text-lg text-left transition"
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={restart}
              className="mt-6 text-zinc-400 hover:text-white"
            >
              返回重新生成
            </button>
          </div>
        )}

        {gameOver && (
          <div className="rounded-3xl bg-white/10 border border-white/10 p-8 max-w-xl shadow-xl">
            <h2 className="text-3xl font-bold mb-4">游戏结束</h2>
            <p className="text-xl mb-6">
              你的得分：{score} / {questions.length}
            </p>

            <button
              onClick={restart}
              className="rounded-2xl bg-cyan-300 text-black px-6 py-3 font-bold hover:bg-cyan-200"
            >
              再生成一次
            </button>
          </div>
        )}
      </div>
    </div>
  )
}