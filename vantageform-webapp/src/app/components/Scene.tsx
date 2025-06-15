// Scene.tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { Html, OrbitControls, useProgress } from '@react-three/drei'
import Model from './Model'

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  const [rotationProgress, setRotationProgress] = useState(0)
  const sceneRef = useRef<HTMLDivElement>(null)
  const accumulatedScrollRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const lastScrollDirectionRef = useRef<'up' | 'down'>('down')
  const animationCooldownRef = useRef(false) // Prevent immediate re-triggering
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)
  
  // Responsive scaling state
  const [modelScale, setModelScale] = useState<[number, number, number]>([1.0, 1.0, 1.0])
  
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth < 768 ||
                           ('ontouchstart' in window)
      setIsMobile(isMobileDevice)
    }
    
    const updateScale = () => {
      const width = window.innerWidth
      
      if (width < 500) { // Phone
        setModelScale([2.1, 2.1, 2.1])
      } else if (width < 1100) { // Tablet/Medium screens
        setModelScale([0.9, 0.9, 0.9])
      } else { // Desktop
        setModelScale([1.0, 1.0, 1.0])
      }
    }
    
    // Initial setup
    checkMobile()
    updateScale()
    
    const handleResize = () => {
      checkMobile()
      updateScale()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ========== ANIMATION PARAMETERS - CUSTOMIZE THESE ==========
  
  // Scroll & Rotation Control
  const SCROLL_DISTANCE_FOR_FULL_ROTATION = isMobile ? 600 : 900 // Faster on mobile
  const NUMBER_OF_ROTATIONS = 1 // how many full rotations (1 = 360°, 2 = 720°, etc.)
  
  // Trigger Zone Control
  const ANIMATION_ZONE_THRESHOLD = isMobile ? 75 : 50 // Larger trigger zone on mobile
  const COOLDOWN_DISTANCE = 200 // pixels user must scroll away before animation can trigger again
  
  // Exit Behavior
  const EXIT_SCROLL_AMOUNT = 150 // pixels to auto-scroll after animation completes
  const EXIT_DELAY = 100 // milliseconds to wait before auto-exit scroll
  
  // Animation Feel
  const ENABLE_EASING = true // smooth animation vs linear
  let ROTATION_DIRECTION = 1 // 1 for normal, -1 for reverse
  

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sceneRef.current) return

      const rect = sceneRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const sceneMiddle = rect.top + rect.height / 2
      const viewportMiddle = viewportHeight / 2
      const distanceFromCenter = Math.abs(sceneMiddle - viewportMiddle)
      
      // Track scroll direction
      lastScrollDirectionRef.current = e.deltaY > 0 ? 'down' : 'up'
      
      // Check if we're in the animation trigger zone
      const isInTriggerZone = distanceFromCenter < ANIMATION_ZONE_THRESHOLD

      if (isInTriggerZone && !isAnimatingRef.current && !animationCooldownRef.current) {
        // Start animation - prevent scrolling and begin rotation
        e.preventDefault()
        isAnimatingRef.current = true
        accumulatedScrollRef.current = 0
        setRotationProgress(0)
      }

      if (isAnimatingRef.current) {
        // We're in animation mode - prevent normal scrolling
        e.preventDefault()
        
        // Accumulate scroll for rotation
        accumulatedScrollRef.current += Math.abs(e.deltaY)
        
        // Calculate rotation progress with optional easing
        const rawProgress = Math.min(accumulatedScrollRef.current / SCROLL_DISTANCE_FOR_FULL_ROTATION, 1)
        const easedProgress = ENABLE_EASING 
          ? rawProgress * rawProgress * (3 - 2 * rawProgress) // Smoothstep easing
          : rawProgress // Linear
        
        // Apply rotation direction and number of rotations
        const finalProgress = easedProgress * NUMBER_OF_ROTATIONS * ROTATION_DIRECTION
        setRotationProgress(finalProgress)

        // Complete animation when full rotation is done
        if (rawProgress >= 1) {
          isAnimatingRef.current = false
          animationCooldownRef.current = true // Start cooldown period
          accumulatedScrollRef.current = 0
          ROTATION_DIRECTION *= -1
          
          // Allow one final scroll to exit the animation zone
          setTimeout(() => {
            const exitScrollAmount = lastScrollDirectionRef.current === 'down' ? EXIT_SCROLL_AMOUNT : -EXIT_SCROLL_AMOUNT
            window.scrollBy({
              top: exitScrollAmount,
              behavior: 'smooth'
            })
          }, EXIT_DELAY)
        }
      }

      // Emergency exit: if somehow we're animating but far from trigger zone, reset
      if (isAnimatingRef.current && distanceFromCenter > ANIMATION_ZONE_THRESHOLD * 3) {
        isAnimatingRef.current = false
        setRotationProgress(0)
        accumulatedScrollRef.current = 0
      }
    }

    // Also handle regular scroll events for when we're not animating
    const handleScroll = () => {
      if (!sceneRef.current || isAnimatingRef.current) return

      const rect = sceneRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const sceneMiddle = rect.top + rect.height / 2
      const viewportMiddle = viewportHeight / 2
      const distanceFromCenter = Math.abs(sceneMiddle - viewportMiddle)

      // Reset rotation if we're far from the animation zone and not animating
      if (distanceFromCenter > ANIMATION_ZONE_THRESHOLD * 2) {
        setRotationProgress(0)
      }

      // End cooldown period when user has scrolled far enough away
      if (animationCooldownRef.current && distanceFromCenter > COOLDOWN_DISTANCE) {
        animationCooldownRef.current = false
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      ref={sceneRef} 
      className='relative h-[50vh] md:h-[90vh] lg:h-[100vh]'
    >
      <Canvas
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ 
          position: isMobile ? [-3, 0, 3] : [-5, 0, 5], // Closer camera on mobile
          fov: isMobile ? 60 : 50 // Wider FOV on mobile for better view
        }}
        className="!absolute !inset-0"
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={5} />
        <Suspense fallback={<Loader />}>
          <group scale={modelScale}>
            <Model 
              rotationProgress={rotationProgress} 
              isMobile={isMobile}
            />
          </group>
        </Suspense>
        {/* Conditionally render OrbitControls - disabled on mobile */}
        {!isMobile && (
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true}
          />
        )}
      </Canvas>
    </div>
  )
}