"use client"

import type { PurchaseResult } from "./vending-machine"

interface OutputTrayProps {
  purchase: PurchaseResult | null
  isAnimating: boolean
  onDismiss: () => void
}

export function OutputTray({ purchase, isAnimating, onDismiss }: OutputTrayProps) {
  return (
    <div className="relative border-t-2 border-border bg-muted">
      {/* Tray slot */}
      <div className="mx-auto h-2 w-3/4 rounded-b-lg bg-background shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />

      {/* Output area */}
      <div className="flex min-h-[100px] items-center justify-center px-4 py-4">
        {isAnimating && !purchase && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-neon-pink [animation-delay:0ms]" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-neon-cyan [animation-delay:150ms]" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-neon-yellow [animation-delay:300ms]" />
            </div>
            <p className="text-[8px] uppercase tracking-widest text-muted-foreground">
              Preparando...
            </p>
          </div>
        )}

        {purchase && (
          <button
            onClick={onDismiss}
            className="group flex w-full animate-slide-up cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-neon-green/50 bg-neon-green/5 px-4 py-4 transition-all hover:border-neon-green hover:bg-neon-green/10"
            aria-label="Fechar mensagem de compra"
          >
            <span className="animate-candy-bounce text-4xl" role="img" aria-hidden="true">
              {purchase.candyEmoji}
            </span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
                {purchase.candyName}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-foreground">
                {purchase.change > 0
                  ? `Troco: R$ ${purchase.change.toFixed(2)}`
                  : "Sem troco"}
              </span>
            </div>
            <span className="text-[7px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
              Clique para fechar
            </span>
          </button>
        )}

        {!purchase && !isAnimating && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl opacity-20" role="img" aria-hidden="true">
              🎰
            </span>
            <p className="text-[7px] uppercase tracking-widest text-muted-foreground">
              Insira notas e escolha seu doce
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
