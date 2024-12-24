import { useState, useCallback } from 'react'
import { Die } from './components/Die'
import './App.css'

interface DieState {
  id: string
  value: number
  isFrozen: boolean
}

export function App() {
  const [dice, setDice] = useState<DieState[]>(() => 
    Array.from({ length: 10 }, () => ({
      id: crypto.randomUUID(),
      value: Math.ceil(Math.random() * 6),
      isFrozen: false
    }))
  )

  const handleDieClick = useCallback((id: string) => {
    setDice(prevDice => 
      prevDice.map(die => 
        die.id === id 
          ? { ...die, isFrozen: !die.isFrozen }
          : die
      )
    )
  }, [])

  const rollDice = () => {
    setDice(prevDice =>
      prevDice.map(die =>
        die.isFrozen
          ? die
          : { ...die, value: Math.ceil(Math.random() * 6) }
      )
    )
  }

  return (
    <div className="app">
      <h1>Tenzies</h1>
      <div className="dice-container">
        {dice.map(die => (
          <Die
            key={die.id}
            value={die.value}
            isFrozen={die.isFrozen}
            onClick={() => handleDieClick(die.id)}
          />
        ))}
      </div>
      <button className="roll-button" onClick={rollDice}>
        Roll
      </button>
    </div>
  )
}
