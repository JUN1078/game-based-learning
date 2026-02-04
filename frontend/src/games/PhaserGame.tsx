import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Phaser from 'phaser'

export interface PhaserGameRef {
  game: Phaser.Game | null
  scene: Phaser.Scene | null
}

interface PhaserGameProps {
  config: Phaser.Types.Core.GameConfig
  onGameReady?: (game: Phaser.Game) => void
}

const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(
  ({ config, onGameReady }, ref) => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      game: gameRef.current,
      scene: gameRef.current?.scene.getScenes(true)[0] || null,
    }))

    useEffect(() => {
      if (!containerRef.current) return

      // Create Phaser game instance
      const gameConfig: Phaser.Types.Core.GameConfig = {
        ...config,
        parent: containerRef.current,
      }

      gameRef.current = new Phaser.Game(gameConfig)

      if (onGameReady) {
        onGameReady(gameRef.current)
      }

      // Cleanup
      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true)
          gameRef.current = null
        }
      }
    }, [])

    return <div ref={containerRef} className="phaser-game-container" />
  }
)

PhaserGame.displayName = 'PhaserGame'

export default PhaserGame
