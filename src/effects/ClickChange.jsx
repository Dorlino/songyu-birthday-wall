import { useState } from "react"

function ClickChange() {
  const [clicked, setClicked] = useState(false)

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0
  })

  return (
    <div
      onMouseMove={(e) => {
        setMouse({
          x: e.clientX,
          y: e.clientY
        })
      }}
      style={{
        background: clicked ? "white" : "black",
        color: clicked ? "black" : "white",

        height: "100vh",

        display: "flex",
        flexDirection: "column",

        justifyContent: "center",
        alignItems: "center",

        fontSize: "52px",
        fontFamily: "Times New Roman",

        transition: "all 1s",

        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
  style={{
    position: "absolute",

    left: mouse.x,
    top: mouse.y,

    transform: "translate(-50%, -50%)",

    fontSize: "40px",

    filter: "blur(2px)",

    opacity: 0.7

  }}
>
  ✦
</div>

      <div
        style={{
          opacity: clicked ? 1 : 0.6,

          transform: clicked
            ? "scale(1.2) rotate(5deg)"
            : "scale(1) rotate(0deg)",

          transition: "all 1s",

          zIndex: 1
        }}
      >
        {clicked
          ? "Nothing stays."
          : "Everything was temporary."}
      </div>

      <button
        onClick={() => setClicked(!clicked)}
        style={{
          marginTop: "40px",

          padding: "12px 28px",

          fontSize: "18px",

          borderRadius: "999px",

          border: "1px solid currentColor",

          background: "transparent",

          color: "inherit",

          cursor: "pointer",

          zIndex: 1
        }}
      >
        Click
      </button>
    </div>
  )
}

export default ClickChange