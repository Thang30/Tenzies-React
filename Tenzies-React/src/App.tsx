import { useState, useCallback, useEffect } from 'react'
import { Die } from './components/Die'
import './App.css'

interface DieState {
  id: string
  value: number
  isFrozen: boolean
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

  const generateNewValue = (): number => Math.ceil(Math.random() * 6)

  const handleDieClick = useCallback((id: string) => {
    if (isRolling) return
    setDice(prevDice => 
      prevDice.map(die => 
        die.id === id 
          ? { ...die, isFrozen: !die.isFrozen }
          : die
      )
    )
  }, [isRolling])

  const rollDice = useCallback(() => {
    if (isRolling) return // Prevent multiple rolls while animation is playing

    setIsRolling(true)
    
    // Create intermediate values for rolling animation
    const rollInterval = setInterval(() => {
      setDice(prevDice =>
        prevDice.map(die =>
          die.isFrozen
            ? die
            : { ...die, value: generateNewValue() }
        )
      )
    }, 50) // Roll animation speed

    // Stop rolling and set final values
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
    }, 500) // Total roll duration

    // Cleanup function
    return () => clearInterval(rollInterval)
  }, [isRolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => setIsRolling(false)
  }, [])

  return (
    <div className="app">
      <h1>Tenzies</h1>
      <div className="dice-container">
        {dice.map(die => (
          <Die
            key={die.id}
            value={die.value}
            isFrozen={die.isFrozen}
            isRolling={isRolling}
            onClick={() => handleDieClick(die.id)}
          />
        ))}
      </div>
      <button 
        className={`roll-button ${isRolling ? 'rolling' : ''}`} 
        onClick={rollDice}
        disabled={isRolling}
      >
        {isRolling ? 'Rolling...' : 'Roll'}
      </button>
    </div>
  )
}
