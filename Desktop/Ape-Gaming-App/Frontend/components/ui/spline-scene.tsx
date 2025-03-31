"use client"

import { Suspense, lazy, type ReactNode } from "react"
const Spline = lazy(() => import("@splinetool/react-spline"))

interface SplineSceneProps {
  scene?: string
  className?: string
  children?: ReactNode
  fallback?: ReactNode
}

export function SplineScene({ scene, className, children, fallback }: SplineSceneProps) {
  const defaultFallback = (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loader"></span>
    </div>
  )

  // If children are provided, render them instead of Spline
  if (children) {
    return <div className={className}>{children}</div>
  }

  // Otherwise, render Spline with the scene
  return (
    <Suspense fallback={fallback || defaultFallback}>
      {scene && <Spline scene={scene} className={className} />}
    </Suspense>
  )
}

