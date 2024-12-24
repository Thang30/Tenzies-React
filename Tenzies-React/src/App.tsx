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
    console.log('Initializing dice state...')
    const initialDice = Array.from({ length: 10 }, () => ({
      id: crypto.randomUUID(),
      value: Math.ceil(Math.random() * 6),
      isFrozen: false
    }))
    console.log('Initial dice:', initialDice)
    return initialDice
  })
  const [isRolling, setIsRolling] = useState(false)

  const handleDieClick = useCallback((id: string) => {
    if (isRolling) return
    setDice(prevDice => {
      console.log('Freezing die:', id)
      return prevDice.map(die => 
        die.id === id 
          ? { ...die, isFrozen: !die.isFrozen }
          : die
      )
    })
  }, [isRolling])

  const rollDice = useCallback(() => {
    console.log('Rolling dice...')
    setIsRolling(true)
    
    setDice(prevDice => {
      console.log('Previous dice:', prevDice)
      const newDice = prevDice.map(die => {
        if (die.isFrozen) {
          console.log('Die', die.id, 'is frozen with value:', die.value)
          return die
        }
        const newValue = Math.ceil(Math.random() * 6)
        console.log('Die', die.id, 'new value:', newValue)
        return { ...die, value: newValue }
      })
      console.log('New dice:', newDice)
      return newDice
    })

    setTimeout(() => setIsRolling(false), 500)
  }, [])

  // Debug effect to monitor dice state
  useEffect(() => {
    console.log('Dice state updated:', dice)
  }, [dice])

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
        Roll
      </button>
    </div>
  )
}
