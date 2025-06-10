// SceneWrapper.tsx
'use client'

import { useInView } from 'react-intersection-observer'
import Scene from './Scene'

export default function SceneWrapper() {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false })

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      className="scroll-section-wrapper"
    >
      <Scene rotationActive={inView} />
    </div>
  )
}
