import { FC } from 'react'

interface DieProps {
  value: number
  isFrozen: boolean
  onClick: () => void
}

export const Die: FC<DieProps> = ({ value, isFrozen, onClick }) => {
  return (
    <div 
      className={`die ${isFrozen ? 'frozen' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isFrozen}
    >
      {value}
    </div>
  )
} 