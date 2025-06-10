import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Html, OrbitControls, useProgress } from '@react-three/drei'
import Model from './Model'

function Loader (){
    const { progress } = useProgress()
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene({ rotationActive }: { rotationActive: boolean }) {
  return (
    <Canvas 
      gl={{ antialias: true }} 
      dpr={[1, 1.5]}  
      camera={{ position: [-5, 0, 5], fov: 50 }} 
      className="!absolute !inset-0 overflow-visible"
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={5} />
      <Suspense fallback={<Loader />}>
        <Model rotationActive={rotationActive} />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
