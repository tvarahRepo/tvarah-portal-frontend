'use client'
import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const NODE_COUNT = 70
const MAX_DIST = 170
const SPEED = 0.4

export default function WebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * SPEED * (0.3 + Math.random() * 0.7),
        vy: Math.sin(angle) * SPEED * (0.3 + Math.random() * 0.7),
        size: Math.random() * 1.5 + 0.5,
      }
    })

    let time = 0
    let rafId: number

    function draw() {
      if (!canvas || !ctx) return
      const { width: w, height: h } = canvas
      const cx = w / 2
      const cy = h / 2
      time++

      // Slow oscillating scale (zoom in/out) + slow rotation
      const scale = 0.88 + 0.24 * (0.5 + 0.5 * Math.sin(time / 280 * Math.PI * 2))
      const rotation = time * 0.00025

      // Move nodes, bounce off edges
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
        node.x = Math.max(0, Math.min(w, node.x))
        node.y = Math.max(0, Math.min(h, node.y))
      }

      ctx.clearRect(0, 0, w, h)

      // Apply slow zoom + rotation from center
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)
      ctx.scale(scale, scale)
      ctx.translate(-cx, -cy)

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.3
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 212, 200, ${alpha})`
            ctx.lineWidth = 0.7
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 200, 0.5)'
        ctx.fill()
      }

      ctx.restore()

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
