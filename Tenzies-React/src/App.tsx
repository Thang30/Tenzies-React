import { useState, useCallback, useEffect } from 'react'
import Confetti from 'react-confetti'
import { nanoid } from 'nanoid'
import { Die } from './components/Die'
import './App.css'

interface DieState {
  id: string
  value: number
  isFrozen: boolean
}

interface GameState {
  isWon: boolean
  targetValue: number | null
  rollCount: number
}

export function App() {
  const [dice, setDice] = useState<DieState[]>(() => {
    const initialDice = Array.from({ length: 10 }, () => ({
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isFrozen: false
    }))
    return initialDice
  })
  const [isRolling, setIsRolling] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    isWon: false,
    targetValue: null,
    rollCount: 0
  })

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const generateNewValue = (): number => Math.ceil(Math.random() * 6)

  // Check for win condition
  useEffect(() => {
    if (isRolling) return

    const allFrozen = dice.every(die => die.isFrozen)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)

    if (allFrozen && allSameValue) {
      setGameState(prev => ({ ...prev, isWon: true }))
    }
  }, [dice, isRolling])

  const handleDieClick = useCallback((id: string) => {
    if (isRolling || gameState.isWon) return
    
    setDice(prevDice => {
      const clickedDie = prevDice.find(die => die.id === id)
      if (!clickedDie) return prevDice

      // If this is the first frozen die, set it as the target value
      if (!gameState.targetValue && !clickedDie.isFrozen) {
        setGameState(prev => ({ ...prev, targetValue: clickedDie.value }))
      }

      return prevDice.map(die => 
        die.id === id 
          ? { ...die, isFrozen: !die.isFrozen }
          : die
      )
    })
  }, [isRolling, gameState.isWon, gameState.targetValue])

  const rollDice = useCallback(() => {
    if (isRolling || gameState.isWon) return

    setIsRolling(true)
    setGameState(prev => ({ ...prev, rollCount: prev.rollCount + 1 }))
    
    const rollInterval = setInterval(() => {
      setDice(prevDice =>
        prevDice.map(die =>
          die.isFrozen
            ? die
            : { ...die, value: generateNewValue() }
        )
      )
    }, 50)

    setTimeout(() => {
      clearInterval(rollInterval)
      setDice(prevDice =>
        prevDice.map(die =>
          die.isFrozen
            ? die
            : { ...die, value: generateNewValue() }
        )
      )
      setIsRolling(false)
    }, 500)

    return () => clearInterval(rollInterval)
  }, [isRolling, gameState.isWon])

  const resetGame = () => {
    // Confirm reset if game is in progress
    if (!gameState.isWon && (gameState.rollCount > 0 || dice.some(die => die.isFrozen))) {
      if (!window.confirm('Are you sure you want to reset the game?')) {
        return
      }
    }

    setDice(prevDice => 
      prevDice.map(() => ({
        id: nanoid(),
        value: Math.ceil(Math.random() * 6),
        isFrozen: false
      }))
    )
    setGameState({
      isWon: false,
      targetValue: null,
      rollCount: 0
    })
    setIsRolling(false)
  }

  return (
    <div className="app">
      {gameState.isWon && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
          <div className="win-overlay">
            <div className="win-message">
              <h2>🎉 Congratulations! 🎉</h2>
              <p>You've won the game!</p>
              <button 
                className="new-game-button"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </div>
        </>
      )}
      <div className="game-header">
        <h1>Tenzies</h1>
        <button 
          className="reset-button"
          onClick={resetGame}
          disabled={isRolling}
        >
          New Game
        </button>
      </div>
      {gameState.targetValue && (
        <div className="game-info">
          <p className="target-value">
            Match all dice to {gameState.targetValue}
          </p>
          <p className="roll-count">
            Rolls: {gameState.rollCount}
          </p>
        </div>
      )}
      <div className="dice-container">
        {dice.map(die => (
          <Die
            key={die.id}
            value={die.value}
            isFrozen={die.isFrozen}
            isRolling={isRolling}
            isWinner={gameState.isWon}
            onClick={() => handleDieClick(die.id)}
          />
        ))}
      </div>
      <button 
        className={`roll-button ${isRolling ? 'rolling' : ''} ${gameState.isWon ? 'winner' : ''}`}
        onClick={gameState.isWon ? resetGame : rollDice}
        disabled={isRolling}
      >
        {gameState.isWon 
          ? 'New Game' 
          : isRolling 
            ? 'Rolling...' 
            : 'Roll'}
      </button>
    </div>
  )
}
