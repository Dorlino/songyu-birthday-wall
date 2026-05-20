import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabase"

import bowSvg from "./assets/bow.svg"
import flowerSvg from "./assets/flower.svg"
import cloverSvg from "./assets/clover.svg"
import strawberrySvg from "./assets/strawberry.svg"

const noteColors = ["#FFE3EC", "#E1F7F0", "#FFF3C8", "#E6EEFF", "#F1E5FF", "#FFE4D3"]
const stickerColors = ["#F8AFCB", "#F6C985", "#A9DED5", "#B7C7F5", "#D8BFF5", "#F5BCA6"]

const shapeOptions = [
  { id: "sharp", name: "直角方形" },
  { id: "rounded", name: "圆角方形" },
  { id: "circle", name: "圆形" },
  { id: "blob", name: "软糖形" },
]

const stickerOptions = [
  { id: "bowSticker", name: "蝴蝶结" },
  { id: "flowerSticker", name: "花朵" },
  { id: "cloverSticker", name: "四叶草" },
  { id: "strawberrySticker", name: "草莓" },
  { id: "heartSticker", name: "爱心" },
  { id: "starSticker", name: "星星" },
  { id: "tapeSticker", name: "纸胶带" },
]

export default function App() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [wish, setWish] = useState("")
  const [warning, setWarning] = useState("")
  const [color, setColor] = useState(noteColors[0])
  const [shape, setShape] = useState("rounded")
  const [stickerType, setStickerType] = useState("bowSticker")
  const [stickerColor, setStickerColor] = useState(stickerColors[0])
  const [confetti, setConfetti] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)

  const currentNote = {
    name: name.trim(),
    wish: wish.trim(),
    color,
    shape,
    stickerType,
    stickerColor,
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("读取祝福失败：", error)
      return
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      wish: item.wish,
      color: item.color,
      shape: item.shape,
      stickerType: item.sticker_type,
      stickerColor: item.sticker_color,
      rotate: item.rotate,
      createdAt: item.created_at,
    }))

    setNotes(formatted)
  }

  function resetWriting() {
    setName("")
    setWish("")
    setWarning("")
    setSelectedNote(null)
    setStep(2)
  }

  function checkStep2() {
    const noName = !name.trim()
    const noWish = !wish.trim()

    if (noName && noWish) return setWarning("你还什么都没有写呢！")
    if (noName) return setWarning("朋友，你还没有告诉她你的代号是什么呢！")
    if (noWish) return setWarning("朋友，写一句生日快乐就好啦~")

    setWarning("")
    setStep(3)
  }

  function getHeartPosition(index, total) {
    if (total < 8) {
      const smallLayout = [
        [50, 32],
        [35, 45],
        [65, 45],
        [28, 62],
        [72, 62],
        [42, 72],
        [58, 72],
      ]
      const point = smallLayout[index % smallLayout.length]
      return { left: `${point[0]}%`, top: `${point[1]}%` }
    }

    const t = (Math.PI * 2 * index) / total
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)

    const scale = total > 45 ? 1.9 : total > 25 ? 2.1 : 2.32

    return {
      left: `${50 + x * scale}%`,
      top: `${51 - y * scale}%`,
    }
  }

  function getWallSize(total) {
    if (total <= 6) return "largeWallNote"
    if (total <= 14) return "mediumWallNote"
    if (total <= 28) return "smallWallNote"
    if (total <= 45) return "tinyWallNote"
    return "microWallNote"
  }

  async function addToWall() {
    if (loading) return

    setLoading(true)

    const newNote = {
      name: currentNote.name,
      wish: currentNote.wish,
      color: currentNote.color,
      shape: currentNote.shape,
      sticker_type: currentNote.stickerType,
      sticker_color: currentNote.stickerColor,
      rotate: Math.random() * 6 - 3,
    }

    const { error } = await supabase.from("wishes").insert([newNote])

    if (error) {
      console.error("上传祝福失败：", error)
      alert("上传失败了，检查一下 Supabase 配置或网络。")
      setLoading(false)
      return
    }

    await fetchNotes()

    setConfetti(true)
    setTimeout(() => setConfetti(false), 1800)

    setLoading(false)
    setStep(5)
  }

  function saveImage() {
    alert("保存图片功能后面再接 html2canvas。现在公共祝福墙已经可以用了。")
  }

  return (
    <div className="app">
      <div className="panel">
        {step === 1 && (
          <section className="screen welcome">
            <div className="welcomeDots" />
            <div className="welcomeFireworks">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className={`fw fw${i + 1}`}>
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </span>
              ))}
            </div>

            <p className="eyebrow">Birthday Wall</p>
            <h1>欢迎来到松鱼的生日祝福墙</h1>
            <button onClick={() => setStep(2)}>继续</button>
          </section>
        )}

        {step === 2 && (
          <section className="screen writeScreen">
            <div className="stationery leftStationery">
              <span className="pencil" />
              <span className="eraser" />
              <span className="pen" />
            </div>

            <div className="stationery rightStationery">
              <span className="ruler" />
              <span className="clip" />
              <span className="dotBlock" />
            </div>

            <h2>如果你愿意的话，请为她送上一句祝福语吧 o(^▽^)o</h2>

            <input
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 15))}
              placeholder="你的昵称：例：不愿透露姓名的草莓"
            />
            <p className="counter">{name.length}/15</p>

            <textarea
              maxLength={30}
              value={wish}
              onChange={(e) => setWish(e.target.value.slice(0, 30))}
              placeholder="祝福语：例：生日快乐🎊🎊🎊"
            />
            <p className="counter">{wish.length}/30</p>

            {warning && <p className="warning">{warning}</p>}

            <button onClick={checkStep2}>写好了</button>
          </section>
        )}

        {step === 3 && (
          <section className="screen editor">
            <div className="doodleLayer">
              <span className="candyLine candyOne" />
              <span className="candyLine candyTwo" />
              <span className="candyLine candyThree" />
              <span className="candyLine candyFour" />
              <span className="candyDot dotOne" />
              <span className="candyDot dotTwo" />
              <span className="candyDot dotThree" />
              <span className="candyRing ringOne" />
              <span className="candyRing ringTwo" />
            </div>

            <h2>选择便签的样式</h2>

            <p className="label">便签颜色</p>
            <div className="optionRow">
              {noteColors.map((c) => (
                <button
                  key={c}
                  className={`colorDot ${color === c ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>

            <p className="label">便签形状</p>
            <div className="optionRow">
              {shapeOptions.map((s) => (
                <button
                  key={s.id}
                  className={shape === s.id ? "chip activeChip" : "chip"}
                  onClick={() => setShape(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <p className="label">贴纸颜色</p>
            <div className="optionRow">
              {stickerColors.map((c) => (
                <button
                  key={c}
                  className={`colorDot smallColorDot ${stickerColor === c ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setStickerColor(c)}
                />
              ))}
            </div>

            <p className="label">选择贴住便签的贴纸</p>
            <div className="optionRow">
              {stickerOptions.map((t) => (
                <button
                  key={t.id}
                  className={stickerType === t.id ? "stickerPick activeChip" : "stickerPick"}
                  onClick={() => setStickerType(t.id)}
                >
                  <Sticker type={t.id} color={stickerColor} preview />
                </button>
              ))}
            </div>

            <Preview note={currentNote} />

            <div className="bottom">
              <button className="secondary" onClick={() => setStep(2)}>上一步</button>
              <button onClick={() => setStep(4)}>继续</button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="screen">
            <h2>完成！很棒的作品，谢谢你 (*^^*)</h2>
            <Preview note={currentNote} />

            <div className="bottom">
              <button className="secondary" onClick={() => setStep(3)}>上一步</button>
              <button onClick={addToWall}>
                {loading ? "正在贴上去..." : "贴到祝福墙上"}
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="screen wallScreen">
            <div className="wall">
              {notes.map((note, i) => {
                const pos = getHeartPosition(i, notes.length)
                const sizeClass = getWallSize(notes.length)

                return (
                  <button
                    key={note.id}
                    className="wallNoteWrap flyIn"
                    onClick={() => setSelectedNote(note)}
                    style={{
                      left: pos.left,
                      top: pos.top,
                      zIndex: i + 1,
                      transform: `translate(-50%, -50%) rotate(${note.rotate || 0}deg)`,
                    }}
                  >
                    <Note note={note} wallSize={sizeClass} />
                  </button>
                )
              })}

              {confetti &&
                Array.from({ length: 120 }).map((_, i) => (
                  <span
                    key={i}
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.7}s`,
                      width: `${4 + Math.random() * 7}px`,
                      height: `${6 + Math.random() * 10}px`,
                    }}
                  />
                ))}
            </div>

            <div className="bottom">
              <button className="secondary" onClick={resetWriting}>继续写祝福</button>
              <button onClick={saveImage}>保存图片</button>
            </div>

            {selectedNote && (
              <div className="modalOverlay" onClick={() => setSelectedNote(null)}>
                <div className="modalCard" onClick={(e) => e.stopPropagation()}>
                  <button className="modalClose" onClick={() => setSelectedNote(null)}>
                    ×
                  </button>
                  <Note note={selectedNote} wallSize="detailNote" />
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function Preview({ note }) {
  return (
    <div className="previewWrap">
      <Note note={note} />
    </div>
  )
}

function Note({ note, wallSize }) {
  return (
    <div className={`noteWrap ${note.shape || "rounded"} ${wallSize || ""}`}>
      <div className="note" style={{ background: note.color || noteColors[0] }}>
        <div className="noteText">
          <strong>{note.name}</strong>
          <span>{note.wish}</span>
        </div>
      </div>

      <div className="topSticker">
        <Sticker
          type={note.stickerType || "bowSticker"}
          color={note.stickerColor || "#F8AFCB"}
        />
      </div>
    </div>
  )
}

function Sticker({ type, color, preview }) {
  const svgMap = {
    bowSticker: bowSvg,
    flowerSticker: flowerSvg,
    cloverSticker: cloverSvg,
    strawberrySticker: strawberrySvg,
  }

  if (svgMap[type]) {
    const mask = `url("${svgMap[type]}") center / contain no-repeat`

    return (
      <span className={`stickerSvgWrap ${type} ${preview ? "previewSticker" : ""}`}>
        <span className="stickerSvgOutline" style={{ WebkitMask: mask, mask }} />
        <span
          className="stickerSvgFill"
          style={{ "--sticker-color": color, WebkitMask: mask, mask }}
        />
      </span>
    )
  }

  return (
    <span className={`cssStickerWrap ${type} ${preview ? "previewSticker" : ""}`}>
      <span className="cssStickerOutline" />
      <span className="cssStickerFill" style={{ "--sticker-color": color }} />
    </span>
  )
}