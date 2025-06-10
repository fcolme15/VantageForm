import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Group } from "three"

useGLTF.preload("/football_balls_adidas_1k.glb")

const Model = () => {
  const group = useRef<Group>(null)
  const { scene, nodes, materials, animations } = useGLTF("/football_balls_adidas_1k.glb")

  const {actions, clips} = useAnimations(animations, scene)
  console.log(actions) //No animations for adidas

  return (
    <group ref={group} scale={[6, 6, 6]}>
      <primitive object={scene} />
    </group>
  )
}

export default Model
