import { FC, useEffect, useState } from 'react'

interface DieProps {
  value: number
  isFrozen: boolean
  isRolling: boolean
  onClick: () => void
}

export const Die: FC<DieProps> = ({ value, isFrozen, isRolling, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    console.log('Die rendered with value:', value)
    if (isRolling && !isFrozen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isRolling, isFrozen, value])

  return (
    <div 
      className={`die ${isFrozen ? 'frozen' : ''} ${isAnimating ? 'rolling' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isFrozen}
      data-value={value}
    >
      {value}
    </div>
  )
} 