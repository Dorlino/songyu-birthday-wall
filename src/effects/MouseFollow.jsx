import { useState } from "react"

function MouseFollow() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  return (
    <div
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      style={{
        background: "black",
        color: "white",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Times New Roman"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: mouse.x,
          top: mouse.y,
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          transform: "translate(-50%, -50%)",
          filter: "blur(30px)",
          pointerEvents: "none"
        }}
      />

      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "52px"
      }}>
        Follow the cursor.
      </div>
    </div>
  )
}

export default MouseFollow