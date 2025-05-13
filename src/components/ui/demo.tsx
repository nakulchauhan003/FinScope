import { useTheme } from "next-themes"
import { Waves } from "./waves-background.tsx"

function WavesDemo() {
  const { theme } = useTheme()
  
  return (
    <div className="relative h-[320vh] w-full bg-background/80 rounded-lg">
      <div className="absolute inset-0 z-[-1]">
        <Waves
          lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
    </div>
  )
}

export { WavesDemo } 