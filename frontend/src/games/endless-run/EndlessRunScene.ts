import Phaser from 'phaser'

export interface EndlessRunConfig {
  onScoreChange?: (score: number) => void
  onGameOver?: (finalScore: number) => void
  onQuestionTrigger?: (question: any) => void
  questions?: any[]
}

export class EndlessRunScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle
  private obstacles: Phaser.GameObjects.Rectangle[] = []
  private coins: Phaser.GameObjects.Ellipse[] = []
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private gameSpeed: number = 300
  private isGameOver: boolean = false
  private lanes: number[] = [150, 250, 350]
  private currentLane: number = 1
  private config: EndlessRunConfig
  private questionCounter: number = 0
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private _ground!: Phaser.GameObjects.Rectangle
  private clouds: Phaser.GameObjects.Ellipse[] = []

  constructor(config: EndlessRunConfig = {}) {
    super({ key: 'EndlessRunScene' })
    this.config = config
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Sky background
    this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB)

    // Create clouds
    this.createClouds()

    // Ground
    this.ground = this.add.rectangle(width / 2, height - 30, width, 60, 0x8B4513)

    // Player (character)
    this.player = this.add.rectangle(
      100,
      this.lanes[this.currentLane],
      40,
      40,
      0xFF6B6B
    )
    this.player.setStrokeStyle(2, 0xFFFFFF)

    // Score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 },
    })

    // Instructions
    this.add.text(width / 2, 50, 'Use ↑/↓ Arrow Keys to Move', {
      fontSize: '16px',
      color: '#000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5)

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()

    // Start spawning
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    })

    this.time.addEvent({
      delay: 800,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true,
    })

    // Increase difficulty over time
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.gameSpeed += 20
      },
      callbackScope: this,
      loop: true,
    })
  }

  update() {
    if (this.isGameOver) return

    // Move clouds
    this.clouds.forEach((cloud) => {
      cloud.x -= 0.5
      if (cloud.x < -50) {
        cloud.x = this.cameras.main.width + 50
      }
    })

    // Player movement
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      if (this.currentLane > 0) {
        this.currentLane--
        this.tweens.add({
          targets: this.player,
          y: this.lanes[this.currentLane],
          duration: 150,
          ease: 'Power2',
        })
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
      if (this.currentLane < this.lanes.length - 1) {
        this.currentLane++
        this.tweens.add({
          targets: this.player,
          y: this.lanes[this.currentLane],
          duration: 150,
          ease: 'Power2',
        })
      }
    }

    // Move and check obstacles
    this.obstacles.forEach((obstacle, index) => {
      obstacle.x -= this.gameSpeed * 0.016

      // Check collision
      if (this.checkCollision(this.player, obstacle)) {
        this.gameOver()
      }

      // Remove off-screen obstacles
      if (obstacle.x < -50) {
        obstacle.destroy()
        this.obstacles.splice(index, 1)
        this.addScore(10)
      }
    })

    // Move and collect coins
    this.coins.forEach((coin, index) => {
      coin.x -= this.gameSpeed * 0.016

      // Check collection
      if (this.checkCollision(this.player, coin)) {
        coin.destroy()
        this.coins.splice(index, 1)
        this.addScore(50)

        // Play collect sound effect
        this.tweens.add({
          targets: this.player,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 100,
          yoyo: true,
        })
      }

      // Remove off-screen coins
      if (coin.x < -50) {
        coin.destroy()
        this.coins.splice(index, 1)
      }
    })

    // Trigger question every 500 points
    if (this.score > 0 && this.score % 500 === 0 && this.score !== this.questionCounter) {
      this.questionCounter = this.score
      this.triggerQuestion()
    }
  }

  private createClouds() {
    const width = this.cameras.main.width
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(30, 100),
        Phaser.Math.Between(60, 100),
        40,
        0xFFFFFF,
        0.7
      )
      this.clouds.push(cloud)
    }
  }

  private spawnObstacle() {
    if (this.isGameOver) return

    const lane = Phaser.Math.Between(0, 2)
    const obstacle = this.add.rectangle(
      this.cameras.main.width + 50,
      this.lanes[lane],
      50,
      50,
      0xFF4444
    )
    obstacle.setStrokeStyle(2, 0x000000)
    this.obstacles.push(obstacle)
  }

  private spawnCoin() {
    if (this.isGameOver) return

    const lane = Phaser.Math.Between(0, 2)
    const coin = this.add.ellipse(
      this.cameras.main.width + 50,
      this.lanes[lane],
      30,
      30,
      0xFFD700
    )
    coin.setStrokeStyle(2, 0xFFA500)
    this.coins.push(coin)

    // Coin sparkle animation
    this.tweens.add({
      targets: coin,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    })
  }

  private checkCollision(obj1: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Ellipse, obj2: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Ellipse): boolean {
    const bounds1 = obj1.getBounds()
    const bounds2 = obj2.getBounds()
    return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2)
  }

  private addScore(points: number) {
    this.score += points
    this.scoreText.setText(`Score: ${this.score}`)

    if (this.config.onScoreChange) {
      this.config.onScoreChange(this.score)
    }
  }

  private triggerQuestion() {
    if (this.config.onQuestionTrigger && this.config.questions && this.config.questions.length > 0) {
      // Pause the game
      this.scene.pause()

      // Get random question
      const question = Phaser.Math.RND.pick(this.config.questions)
      this.config.onQuestionTrigger(question)
    }
  }

  private gameOver() {
    if (this.isGameOver) return

    this.isGameOver = true

    // Flash effect
    this.cameras.main.flash(300, 255, 0, 0)

    // Stop all movement
    this.obstacles.forEach(obs => obs.destroy())
    this.coins.forEach(coin => coin.destroy())
    this.obstacles = []
    this.coins = []

    // Game over text
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)

    this.add.text(width / 2, height / 2 - 50, 'GAME OVER!', {
      fontSize: '48px',
      color: '#FF0000',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 20, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#FFFFFF',
    }).setOrigin(0.5)

    // Notify callback
    if (this.config.onGameOver) {
      this.time.delayedCall(2000, () => {
        this.config.onGameOver!(this.score)
      })
    }
  }

  public resumeGame() {
    this.scene.resume()
  }

  public getScore(): number {
    return this.score
  }
}
