"use client"

interface CoinSlotProps {
  onInsert: (amount: number) => void
  isAnimating: boolean
  insertedCoin: number | null
}

const BILLS = [
  { value: 1, label: "R$ 1" },
  { value: 2, label: "R$ 2" },
  { value: 5, label: "R$ 5" },
] as const

export function CoinSlot({ onInsert, isAnimating, insertedCoin }: CoinSlotProps) {
  return (
    <div className="border-t-2 border-border bg-secondary px-4 py-4">
      <p className="mb-3 text-center text-[8px] uppercase tracking-widest text-muted-foreground">
        Inserir Nota
      </p>
      <div className="flex items-center justify-center gap-3">
        {BILLS.map((bill) => (
          <button
            key={bill.value}
            onClick={() => onInsert(bill.value)}
            disabled={isAnimating}
            aria-label={`Inserir nota de ${bill.label}`}
            className={`
              group relative overflow-hidden rounded-lg border-2 px-4 py-3
              text-[10px] font-bold tracking-wider transition-all duration-200
              ${
                isAnimating
                  ? "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50"
                  : "cursor-pointer border-neon-green/50 bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.15)] hover:border-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-95"
              }
              ${insertedCoin === bill.value ? "animate-bounce scale-95 border-neon-green bg-neon-green/30" : ""}
            `}
          >
            <span className="relative z-10">{bill.label}</span>
            {!isAnimating && (
              <span className="absolute inset-0 -translate-x-full bg-neon-green/10 transition-transform duration-300 group-hover:translate-x-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
