import logoImg from '../assets/mylogo.png'

export default function Logo({ size = 'md', className = '' }) {
  const heights = { sm: 32, md: 44, lg: 64 }
  const height = heights[size] || heights.md

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoImg}
        alt="City Vape"
        style={{ height: height, width: 'auto' }}
        className="object-contain"
      />
    </div>
  )
}

export function LogoMark({ size = 22 }) {
  return (
    <img
      src={logoImg}
      alt="City Vape"
      style={{ width: size, height: size }}
      className="object-contain rounded-full"
    />
  )
}