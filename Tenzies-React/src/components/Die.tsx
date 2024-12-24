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
    >
      {value}
    </div>
  )
} 