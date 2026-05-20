import { useState } from "react"

function App() {

  const [tab, setTab] = useState("medical")

  const content = {
    medical: {
      title: "Medical Records",
      text: `
      Patient exhibits symptoms of memory distortion,
      emotional instability,
      and persistent hallucinations.
      `
    },

    family: {
      title: "Family Files",
      text: `
      Family relationships appear fragmented.
      Several conversations have been intentionally erased.
      `
    },

    timeline: {
      title: "Timeline",
      text: `
      1997 — First incident reported.
      2001 — Patient disappeared for three days.
      2004 — Archive sealed.
      `
    }
  }

  return (
    <div className="
      h-screen
      bg-black
      text-white
      flex
      font-serif
    ">

      {/* 左侧栏 */}
      <div className="
        w-[300px]
        border-r
        border-zinc-800
        bg-zinc-950
        p-8
      ">

        <div className="
          text-3xl
          mb-10
        ">
          ARCHIVE
        </div>

        <div className="space-y-4">

          <button
            onClick={() => setTab("medical")}
            className="
              w-full
              text-left
              p-4
              rounded-xl

              hover:bg-zinc-800
              transition
            "
          >
            Medical Records
          </button>

          <button
            onClick={() => setTab("family")}
            className="
              w-full
              text-left
              p-4
              rounded-xl

              hover:bg-zinc-800
              transition
            "
          >
            Family Files
          </button>

          <button
            onClick={() => setTab("timeline")}
            className="
              w-full
              text-left
              p-4
              rounded-xl

              hover:bg-zinc-800
              transition
            "
          >
            Timeline
          </button>

        </div>
      </div>

      {/* 右侧内容 */}
      <div className="
        flex-1
        p-16

        bg-gradient-to-b
        from-black
        to-zinc-900
      ">

        <div className="
          text-6xl
          mb-8
        ">
          {content[tab].title}
        </div>

        <div className="
          text-zinc-400
          leading-8
          text-xl
          max-w-[800px]
          whitespace-pre-line
        ">
          {content[tab].text}
        </div>

      </div>

    </div>
  )
}

export default App