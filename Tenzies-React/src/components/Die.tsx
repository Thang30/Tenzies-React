import { FC, useEffect, useState } from 'react'

interface DieProps {
  value: number
  isFrozen: boolean
  isRolling: boolean
  isWinner: boolean
  onClick: () => void
}

export const Die: FC<DieProps> = ({ 
  value, 
  isFrozen, 
  isRolling, 
  isWinner,
  onClick 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isRolling && !isFrozen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isRolling, isFrozen])

  return (
    <div 
      className={`
        die 
        ${isFrozen ? 'frozen' : ''} 
        ${isAnimating ? 'rolling' : ''} 
        ${isWinner ? 'winner' : ''}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isFrozen}
    >
      {value}
    </div>
  )
} 