import { useState } from "react"
import "./App.css"

export default function App() {
  const [cards, setCards] = useState([])
  const [selected, setSelected] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)

  const pairs = [
    {
      concept: "债券价格",
      meaning: "与市场利率通常呈反向关系",
    },
    {
      concept: "市场利率",
      meaning: "资金供求达到平衡时形成的价格",
    },
    {
      concept: "贴现债券",
      meaning: "低于面值发行，到期按面值偿还",
    },
    {
      concept: "永久债券",
      meaning: "没有到期日，持续支付固定利息",
    },
    {
      concept: "回报率",
      meaning: "收益与购买价格之间的比率",
    },
  ]

  function startGame() {
    const newCards = pairs.flatMap((pair, index) => [
      {
        id: `concept-${index}`,
        pairId: index,
        type: "concept",
        text: pair.concept,
      },
      {
        id: `meaning-${index}`,
        pairId: index,
        type: "meaning",
        text: pair.meaning,
      },
    ])

    setCards(shuffle(newCards))
    setSelected([])
    setMatched([])
    setMoves(0)
  }

  function chooseCard(card) {
    if (selected.length === 2) return
    if (selected.find((item) => item.id === card.id)) return
    if (matched.includes(card.pairId)) return

    const nextSelected = [...selected, card]
    setSelected(nextSelected)

    if (nextSelected.length === 2) {
      setMoves(moves + 1)

      const [first, second] = nextSelected

      if (
        first.pairId === second.pairId &&
        first.type !== second.type
      ) {
        setTimeout(() => {
          setMatched([...matched, first.pairId])
          setSelected([])
        }, 500)
      } else {
        setTimeout(() => {
          setSelected([])
        }, 800)
      }
    }
  }

  function isOpen(card) {
    return (
      selected.some((item) => item.id === card.id) ||
      matched.includes(card.pairId)
    )
  }

  const finished = cards.length > 0 && matched.length === pairs.length

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-cyan-300 mb-2">AI Knowledge Game</p>
        <h1 className="text-4xl font-bold mb-3">知识卡牌配对游戏</h1>
        <p className="text-zinc-400 mb-8">
          点击两张卡片，把“概念”和“解释”正确配对。
        </p>

        {cards.length === 0 && (
          <button
            onClick={startGame}
            className="rounded-2xl bg-cyan-300 text-black px-8 py-4 font-bold"
          >
            开始游戏
          </button>
        )}

        {cards.length > 0 && (
          <>
            <div className="mb-6 text-zinc-400">
              步数：{moves}　已配对：{matched.length} / {pairs.length}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => chooseCard(card)}
                  className={`min-h-36 rounded-3xl p-4 border text-lg font-bold transition ${
                    isOpen(card)
                      ? "bg-cyan-300 text-black border-cyan-200"
                      : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                  }`}
                >
                  {isOpen(card) ? card.text : "？"}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="mt-8 rounded-2xl bg-white/10 px-6 py-3 hover:bg-white/20"
            >
              重新开始
            </button>
          </>
        )}

        {finished && (
          <div className="mt-8 rounded-3xl bg-white/10 p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-2">完成！</h2>
            <p className="text-zinc-300">
              你用了 {moves} 步完成全部配对。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}