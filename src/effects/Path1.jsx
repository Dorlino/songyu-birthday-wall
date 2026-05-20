import { useState } from "react"

function Path1() {
  const [choice, setChoice] = useState("start")

  const scenes = {
    start: {
      text: "You stand before the door.",
      background: "black",
      color: "white",
      options: [
        { label: "Open it", next: "open" },
        { label: "Walk away", next: "away" }
      ]
    },

    open: {
      text: "The room is full of light.",
      background: "white",
      color: "black",
      options: [
        { label: "Step inside", next: "inside" },
        { label: "Close the door", next: "start" }
      ]
    },

    away: {
      text: "You leave, but the door follows you.",
      background: "#111827",
      color: "white",
      options: [
        { label: "Run", next: "run" },
        { label: "Turn back", next: "start" }
      ]
    },

    inside: {
      text: "Nothing was waiting for you.",
      background: "#f5f5f5",
      color: "black",
      options: [
        { label: "Restart", next: "start" }
      ]
    },

    run: {
      text: "The hallway never ends.",
      background: "#1f2937",
      color: "white",
      options: [
        { label: "Restart", next: "start" }
      ]
    }
  }

  const current = scenes[choice]

  return (
    <div
      style={{
        background: current.background,
        color: current.color,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Times New Roman",
        transition: "all 1s",
        textAlign: "center",
        padding: "40px"
      }}
    >
      <div
        style={{
          fontSize: "52px",
          maxWidth: "900px",
          marginBottom: "50px",
          transition: "all 1s"
        }}
      >
        {current.text}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {current.options.map((option) => (
          <button
            key={option.label}
            onClick={() => setChoice(option.next)}
            style={{
              padding: "14px 30px",
              borderRadius: "999px",
              border: "1px solid currentColor",
              background: "transparent",
              color: "inherit",
              fontSize: "18px",
              cursor: "pointer",
              fontFamily: "Times New Roman"
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Path1