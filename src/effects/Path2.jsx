function Path2() {
  return (
    <div className="
      relative
      min-h-screen
      overflow-hidden

      bg-gradient-to-b
      from-black
      to-zinc-900

      flex
      items-center
      justify-center
      text-white
      font-serif
    ">

      {/* 背景光球 */}
      <div className="
        absolute
        w-[500px]
        h-[500px]
        bg-purple-500/20
        rounded-full
        blur-3xl

        top-[-100px]
        left-[-100px]

        animate-pulse
      " />

      <div className="
        absolute
        w-[400px]
        h-[400px]
        bg-blue-500/20
        rounded-full
        blur-3xl

        bottom-[-100px]
        right-[-100px]

        animate-pulse
      " />

      {/* 卡片 */}
      <div className="
        relative
        z-10

        w-[600px]

        p-12

        rounded-3xl

        bg-white/10
        backdrop-blur-xl

        border
        border-white/10

        shadow-2xl

        transition
        duration-500

        hover:scale-[1.02]
      ">

        <div className="
          text-6xl
          leading-tight
          mb-8
        ">
          Everything was temporary.
        </div>

        <div className="
          text-zinc-300
          text-lg
          leading-8
        ">
          Some memories survive only as light,
          reflections,
          unfinished conversations.
        </div>

        <button className="
          mt-10

          px-8
          py-4

          rounded-full

          bg-white
          text-black

          hover:bg-zinc-200
          hover:scale-105

          transition
          duration-500
        ">
          Enter
        </button>
      </div>
    </div>
  )
}

export default Path2