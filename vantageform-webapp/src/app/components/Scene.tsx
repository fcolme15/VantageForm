'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Html, OrbitControls, ScrollControls, useProgress } from '@react-three/drei'
import Model from './Model'

function Loader (){
    const { progress, active } = useProgress()
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  return (
    <Canvas gl={{ antialias: true}} dpr={[1, 1.5]}  camera={{ position: [0, 0, 5], fov: 50 }} className='relative h-svh'>
      {/* <directionalLight position={[-10, 10, 5]} intensity={4} /> */}
      <ambientLight intensity={4} />
      <Suspense fallback={<Loader/>}>
        <ScrollControls damping={0.2} pages={2}>
            <Model />
        </ScrollControls>
        
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
