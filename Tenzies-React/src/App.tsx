import { useState, useCallback, useEffect } from 'react'
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
}

export function App() {
  const [dice, setDice] = useState<DieState[]>(() => {
    const initialDice = Array.from({ length: 10 }, () => ({
      id: crypto.randomUUID(),
      value: Math.ceil(Math.random() * 6),
      isFrozen: false
    }))
    return initialDice
  })
  const [isRolling, setIsRolling] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    isWon: false,
    targetValue: null
  })

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

  const startNewGame = () => {
    setDice(prevDice => 
      prevDice.map(() => ({
        id: crypto.randomUUID(),
        value: Math.ceil(Math.random() * 6),
        isFrozen: false
      }))
    )
    setGameState({
      isWon: false,
      targetValue: null
    })
  }

  return (
    <div className="app">
      <h1>Tenzies</h1>
      {gameState.targetValue && (
        <p className="target-value">
          Match all dice to {gameState.targetValue}
        </p>
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
        onClick={gameState.isWon ? startNewGame : rollDice}
        disabled={isRolling}
      >
        {gameState.isWon 
          ? 'New Game' 
          : isRolling 
            ? 'Rolling...' 
            : 'Roll'}
      </button>
      {gameState.isWon && (
        <div className="win-message">
          🎉 Congratulations! You won! 🎉
        </div>
      )}
    </div>
  )
}
