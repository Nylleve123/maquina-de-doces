"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { CoinSlot } from "./coin-slot"
import { CandyDisplay } from "./candy-display"
import { OutputTray } from "./output-tray"

export interface PurchaseResult {
  candyName: string
  candyEmoji: string
  change: number
}

const CANDIES = [
  { id: "a", name: "Doce A", price: 6, emoji: "🍬", color: "neon-pink" },
  { id: "b", name: "Doce B", price: 7, emoji: "🍭", color: "neon-cyan" },
  { id: "c", name: "Doce C", price: 8, emoji: "🍫", color: "neon-yellow" },
] as const

export function VendingMachine() {
  const [balance, setBalance] = useState(0)
  const [purchase, setPurchase] = useState<PurchaseResult | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [insertedCoin, setInsertedCoin] = useState<number | null>(null)
  
  // Estados da Música e Áudio
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.2) // Volume inicial em 20%
  const [hasStartedOnce, setHasStartedOnce] = useState(false)

  const musicaRef = useRef<HTMLAudioElement | null>(null)
  const moneyRef = useRef<HTMLAudioElement | null>(null)
  const doceRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio("/musica.mp3")
    audio.loop = true
    audio.volume = volume // Aplica o volume inicial
    
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
    audio.onloadedmetadata = () => setDuration(audio.duration)
    
    musicaRef.current = audio
    moneyRef.current = new Audio("/money.mp3")
    doceRef.current = new Audio("/doce.mp3")

    return () => audio.pause()
  }, [])

  // Função para controlar o volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (musicaRef.current) {
      musicaRef.current.volume = newVolume
    }
  }

  const toggleMusic = () => {
    if (musicaRef.current) {
      if (isMusicPlaying) {
        musicaRef.current.pause()
      } else {
        musicaRef.current.play().catch(() => {})
        setHasStartedOnce(true)
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    if (musicaRef.current) {
      musicaRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleInsertMoney = useCallback(
    (amount: number) => {
      if (isAnimating) return
      
      if (moneyRef.current) {
        moneyRef.current.currentTime = 0
        moneyRef.current.play()
      }

      if (!hasStartedOnce && musicaRef.current?.paused) {
        musicaRef.current.play()
          .then(() => {
            setIsMusicPlaying(true)
            setHasStartedOnce(true)
          })
          .catch(() => {})
      }

      setInsertedCoin(amount)
      setTimeout(() => {
        setBalance((prev) => prev + amount)
        setInsertedCoin(null)
      }, 400)
    },
    [isAnimating, hasStartedOnce]
  )

  const handleBuyCandy = useCallback(
    (candyId: string) => {
      const candy = CANDIES.find((c) => c.id === candyId)
      if (!candy || balance < candy.price || isAnimating) return

      setIsAnimating(true)
      const change = balance - candy.price

      setTimeout(() => {
        if (doceRef.current) {
            doceRef.current.currentTime = 0
            doceRef.current.play()
        }
        
        setPurchase({
          candyName: candy.name,
          candyEmoji: candy.emoji,
          change,
        })
        setBalance(0)
        setIsAnimating(false)
      }, 1200)
    },
    [balance, isAnimating]
  )

  const handleDismissPurchase = useCallback(() => {
    setPurchase(null)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a1a] p-4 relative overflow-hidden font-sans">
      
      {/* MUSIC PLAYER - TOPO DIREITO */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 rounded-2xl border border-neon-cyan/20 bg-card/60 p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.15)] w-72 transition-all hover:border-neon-cyan/40">
        
        {/* Info e Play/Pause */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col overflow-hidden">
            <span className="text-[7px] uppercase tracking-[0.2em] text-muted-foreground font-bold">System Audio</span>
            <span className="text-[10px] font-mono text-neon-cyan truncate"> Ark Patrol - Let Go</span>
          </div>
          
          <button 
            onClick={toggleMusic}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-pink bg-background text-neon-pink shadow-[0_0_10px_rgba(255,45,107,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            {isMusicPlaying ? <span className="text-[10px] font-bold">II</span> : <span className="text-[10px] ml-0.5">▶</span>}
          </button>
        </div>

        {/* Barra de Progresso da Música */}
        <div className="flex flex-col gap-1">
            <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-neon-cyan"
            />
            <div className="flex justify-between text-[8px] font-mono text-muted-foreground">
                <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
                <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
            </div>
        </div>

        {/* CONTROLE DE VOLUME */}
        <div className="flex items-center gap-3 border-t border-border pt-2">
            <span className="text-[10px] text-muted-foreground">Vol</span>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-neon-pink"
            />
            <span className="text-[8px] font-mono text-muted-foreground w-6 text-right">
                {Math.round(volume * 100)}%
            </span>
        </div>
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center">
        <div className="relative w-full overflow-hidden rounded-xl border-4 border-neon-pink bg-card shadow-[0_0_30px_rgba(255,45,107,0.3),0_0_60px_rgba(0,229,255,0.15)]">
          <div className="relative flex items-center justify-center border-b-2 border-border bg-secondary px-4 py-5">
            <h1 className="relative text-center text-xs tracking-wider text-neon-pink drop-shadow-[0_0_10px_rgba(255,45,107,0.8)] sm:text-sm">
              MÁQUINA DE DOCE
            </h1>
          </div>

          <div className="flex items-center justify-center border-b-2 border-border bg-muted px-4 py-3">
            <div className="flex items-center gap-3 rounded-lg border border-neon-cyan/30 bg-background px-5 py-2">
              <span className="text-[10px] uppercase text-muted-foreground">Saldo</span>
              <span className={`font-mono text-lg ${balance > 0 ? "text-neon-green" : "text-muted-foreground"}`}>
                R$ {balance.toFixed(2)}
              </span>
            </div>
          </div>

          <CandyDisplay candies={CANDIES} balance={balance} isAnimating={isAnimating} onBuy={handleBuyCandy} />
          <CoinSlot onInsert={handleInsertMoney} isAnimating={isAnimating} insertedCoin={insertedCoin} />
          <OutputTray purchase={purchase} isAnimating={isAnimating} onDismiss={handleDismissPurchase} />
        </div>

        <div className="flex w-full justify-between px-8">
          <div className="h-6 w-8 rounded-b-md bg-secondary" />
          <div className="h-6 w-8 rounded-b-md bg-secondary" />
        </div>
      </div>
    </main>
  )
}