import { useState } from "react"
import "./App.css"

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

const demoWallNotes = Array.from({ length: 46 }).map((_, i) => ({
  id: i,
  color: noteColors[(i * 3 + 1) % noteColors.length],
  shape: shapeOptions[(i * 5 + 2) % shapeOptions.length].id,
  stickerType: stickerOptions[(i * 4 + 1) % stickerOptions.length].id,
  stickerColor: stickerColors[(i * 7 + 3) % stickerColors.length],
  left: `${6 + ((i * 23) % 86)}%`,
  top: `${8 + ((i * 31) % 74)}%`,
  rotate: ((i * 11) % 32) - 16,
  scale: 0.72 + ((i * 13) % 45) / 100,
  delay: `${((i * 7) % 60) / 100}s`,
}))

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
  const [sentAnimationKey, setSentAnimationKey] = useState(0)

  const currentNote = {
    name: name.trim(),
    wish: wish.trim(),
    color,
    shape,
    stickerType,
    stickerColor,
  }

  function resetWriting() {
    setName("")
    setWish("")
    setWarning("")
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

 async function submitToForm() {
  console.log("准备提交到后端：", currentNote)

  const res = await fetch("http://localhost:3001/api/wishes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname: currentNote.name,
      wish: currentNote.wish,
      note_color: currentNote.color,
      note_shape: currentNote.shape,
      sticker_type: currentNote.stickerType,
      sticker_color: currentNote.stickerColor,
    }),
  })

  const data = await res.json()
  console.log("后端返回：", data)

  if (!data.success) {
    throw new Error(data.message || "提交失败")
  }

  return data
}

async function submitAndSend() {
  console.log("按钮被点击了")

  try {
    await submitToForm()

    setSentAnimationKey((prev) => prev + 1)
    setStep(5)
    setConfetti(true)

    setTimeout(() => {
      setConfetti(false)
    }, 1800)

    window.scrollTo({ top: 0, behavior: "smooth" })
  } catch (err) {
    console.error("提交出错：", err)
    alert("提交失败了，请检查后端是否启动。")
  }
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
              <button onClick={submitAndSend}>提交并贴到祝福墙</button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="screen sentScreen" key={sentAnimationKey}>
            <div className="fakeWall">
              {demoWallNotes.map((note) => (
                <DemoWallNote key={note.id} note={note} />
              ))}

              <div className="sentUserNote">
                <Note note={currentNote} />
              </div>

              <h2 className="sentTitle">
                你的祝福已发送至松鱼的生日宇宙！
              </h2>

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
              <button className="secondary" onClick={resetWriting}>
                再写一张便签
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function DemoWallNote({ note }) {
  return (
    <div
      className={`demoWallNote ${note.shape}`}
      style={{
        left: note.left,
        top: note.top,
        animationDelay: note.delay,
        "--r": `${note.rotate}deg`,
        "--s": note.scale,
      }}
    >
      <div className="demoNoteBody" style={{ background: note.color }}>
        <span className="demoLine short" />
        <span className="demoLine long" />
      </div>

      <div className="demoTopSticker">
        <Sticker type={note.stickerType} color={note.stickerColor} />
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