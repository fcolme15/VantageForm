// Model.tsx
'use client'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group } from 'three'

useGLTF.preload('/football_balls_adidas_1k.glb')

interface ModelProps {
  rotationProgress: number
  isMobile?: boolean
}

const Model = ({ rotationProgress, isMobile = false }: ModelProps) => {
  const group = useRef<Group>(null)
  const { scene } = useGLTF('/football_balls_adidas_1k.glb')
  
  // Scale based on device type
  const modelPosition: [number, number, number] = isMobile ? [0, -0.5, 0] : [0, -1, 0] // Adjust position for mobile

  useFrame(() => {
    if (group.current) {
      // Apply rotation based on scroll progress
      group.current.rotation.y = rotationProgress * Math.PI * 2
    }
  })

  return (
    <group
      ref={group}
      scale={isMobile? [3,3,3] : [10,10,10]}
      position={modelPosition}
      rotation={[0, 0, 0]}
    >
      <primitive
        object={scene}
        rotation={[
          (-12 * Math.PI) / 180,
          (75 * Math.PI) / 180,
          (20 * Math.PI) / 180,
        ]}
      />
    </group>
  )
}

export default Model