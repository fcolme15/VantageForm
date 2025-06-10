import { useGLTF, useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Group } from "three"
import { degToRad } from "three/src/math/MathUtils.js"

useGLTF.preload("/football_balls_adidas_1k.glb")

const Model = ({ rotationActive }: { rotationActive: boolean }) => {
  const group = useRef<Group>(null)
  const { scene } = useGLTF("/football_balls_adidas_1k.glb")

  useFrame(() => {
    if (!group.current) return

    if (rotationActive) {
      // rotate around Y axis based on time to create smooth rotation while in view
      group.current.rotation.y += 0.01
    }
  })

  return (
    <group
      ref={group}
      scale={[10, 10, 10]}
      position={[0, -1, 0]}
      rotation={[0, degToRad(360),0]}  
    >
      <primitive object={scene} rotation={[degToRad(-12), degToRad(75), degToRad(20)]} />
    </group>
  )
}

export default Model
