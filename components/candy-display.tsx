"use client"

import { useState } from "react"

interface Candy {
  id: string
  name: string
  price: number
  emoji: string
  color: string
}

interface CandyDisplayProps {
  candies: readonly Candy[]
  balance: number
  isAnimating: boolean
  onBuy: (id: string) => void
}

export function CandyDisplay({ candies, balance, isAnimating, onBuy }: CandyDisplayProps) {
  const [fallingCandy, setFallingCandy] = useState<string | null>(null)

  const handleBuy = (candy: Candy) => {
    if (balance < candy.price || isAnimating) return
    setFallingCandy(candy.id)
    onBuy(candy.id)
    setTimeout(() => setFallingCandy(null), 1200)
  }

  return (
    <div className="grid grid-cols-3 gap-3 bg-background/50 px-4 py-5">
      {candies.map((candy) => {
        const canAfford = balance >= candy.price
        const isFalling = fallingCandy === candy.id

        const colorMap: Record<string, { border: string; bg: string; text: string; shadow: string; glow: string }> = {
          "neon-pink": {
            border: "border-neon-pink",
            bg: "bg-neon-pink/10",
            text: "text-neon-pink",
            shadow: "shadow-[0_0_15px_rgba(255,45,107,0.3)]",
            glow: "drop-shadow-[0_0_8px_rgba(255,45,107,0.8)]",
          },
          "neon-cyan": {
            border: "border-neon-cyan",
            bg: "bg-neon-cyan/10",
            text: "text-neon-cyan",
            shadow: "shadow-[0_0_15px_rgba(0,229,255,0.3)]",
            glow: "drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]",
          },
          "neon-yellow": {
            border: "border-neon-yellow",
            bg: "bg-neon-yellow/10",
            text: "text-neon-yellow",
            shadow: "shadow-[0_0_15px_rgba(255,215,0,0.3)]",
            glow: "drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]",
          },
        }

        const colors = colorMap[candy.color] || colorMap["neon-pink"]

        return (
          <button
            key={candy.id}
            onClick={() => handleBuy(candy)}
            disabled={!canAfford || isAnimating}
            aria-label={`Comprar ${candy.name} por R$ ${candy.price}`}
            className={`
              group relative flex flex-col items-center gap-2 rounded-lg border-2 px-2 py-4 transition-all duration-300
              ${
                canAfford && !isAnimating
                  ? `cursor-pointer ${colors.border} ${colors.bg} ${colors.shadow} hover:scale-105 hover:${colors.shadow} active:scale-95`
                  : "cursor-not-allowed border-border bg-muted/30 opacity-40"
              }
            `}
          >
            {/* Candy Emoji with falling animation */}
            <div className="relative h-12 w-full overflow-hidden">
              <span
                className={`
                  absolute left-1/2 -translate-x-1/2 text-3xl transition-all
                  ${
                    isFalling
                      ? "animate-candy-fall"
                      : canAfford && !isAnimating
                        ? "top-1 animate-candy-float"
                        : "top-1 grayscale"
                  }
                `}
                role="img"
                aria-hidden="true"
              >
                {candy.emoji}
              </span>
            </div>

            {/* Name */}
            <span
              className={`text-[8px] uppercase tracking-wider transition-colors ${
                canAfford ? colors.text : "text-muted-foreground"
              }`}
            >
              {candy.name}
            </span>

            {/* Price */}
            <span
              className={`rounded-md border px-2 py-1 font-mono text-[9px] transition-all ${
                canAfford
                  ? `${colors.border} ${colors.bg} ${colors.text} ${colors.glow}`
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              R${candy.price}
            </span>

            {/* Glow pulse when affordable */}
            {canAfford && !isAnimating && (
              <span
                className={`absolute inset-0 animate-pulse rounded-lg ${colors.bg} opacity-0 transition-opacity group-hover:opacity-100`}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
