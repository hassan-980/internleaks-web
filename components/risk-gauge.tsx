"use client"

import { useEffect, useState } from "react"

interface RiskGaugeProps {
  percentage: number
  size?: number
}

function riskColor(p: number) {
  if (p >= 75) return "#ef4444" // neon red
  if (p >= 45) return "#f59e0b" // amber
  return "#34d399" // mint
}

export function RiskGauge({ percentage, size = 200 }: RiskGaugeProps) {
  const stroke = size * 0.08
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const color = riskColor(percentage)

  // animate the ring fill: jump to target on next frame so the CSS
  // stroke-dashoffset transition runs from 0 -> target over 1.5s
  const [ringTarget, setRingTarget] = useState(0)
  // count the number up over the same duration
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setRingTarget(percentage))

    const duration = 1500
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutCubic to match the ring easing
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(percentage * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(id)
      cancelAnimationFrame(raf)
    }
  }, [percentage])

  const offset = circumference - (ringTarget / 100) * circumference

  return (
    <div className="overflow-visible p-8">
      <div
        className="relative flex items-center justify-center overflow-visible"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 overflow-visible"
          style={{ overflow: "visible" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 24px ${color}aa)`,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className="text-4xl font-extrabold tabular-nums"
            style={{ color, textShadow: `0 0 16px ${color}66` }}
          >
            {Math.round(display)}%
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">
            Risk
          </span>
        </div>
      </div>
    </div>
  )
}
