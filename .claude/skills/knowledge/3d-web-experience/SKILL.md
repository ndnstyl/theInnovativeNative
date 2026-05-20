---
name: 3d-web-experience
description: |
  Expert knowledge for building 3D web experiences using Three.js, React Three Fiber, and Spline.
  Use this skill when:
  - Creating 3D scenes, models, or interactive experiences for the web
  - Integrating Spline scenes into React/Next.js
  - Working with Three.js, R3F, or WebGL
  - Adding 3D elements to website pages
  - Building product configurators, 3D portfolios, or immersive sections
  - Connecting Spline to external data (Airtable, APIs, webhooks)
  - Using Spell AI for 3D world generation
  - Exporting 3D to iOS, Android, or video (Remotion)
triggers:
  - "3d"
  - "three.js"
  - "threejs"
  - "react three fiber"
  - "r3f"
  - "spline"
  - "webgl"
  - "3d web"
  - "interactive 3d"
  - "spell ai"
  - "3d generation"
---

# 3D Web Experience Skill

Build production-ready 3D web experiences using Three.js, React Three Fiber (R3F), and Spline. This skill covers the full stack from scene setup to interactive deployment, including data-driven 3D, AI generation, and multi-platform export.

## Stack Compatibility

- **Current website**: Next.js 13 (Pages Router), React 18, SCSS, GSAP
- **Spline**: `@splinetool/react-spline` + `@splinetool/runtime`
- **R3F**: `@react-three/fiber` + `@react-three/drei`
- **Three.js**: r160+

---

## Spline Integration (Fastest Path to 3D)

Spline is a browser-based 3D design tool. Scenes export directly to React.

### Installation

```bash
npm install @splinetool/react-spline @splinetool/runtime
```

### Basic Usage (Next.js Pages Router)

```tsx
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="spline-loader">Loading 3D...</div>
})

export default function Hero3D() {
  return (
    <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
  )
}
```

### Next.js App Router (SSR with Blurred Placeholder)

```tsx
import Spline from '@splinetool/react-spline/next'

export default function Hero3D() {
  return (
    <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
  )
}
```

The `/next` import renders a blurred placeholder server-side while the 3D scene loads client-side.

### Component Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `scene` | string | Scene file URL (from Spline export) |
| `onLoad?` | `(spline: Application) => void` | Fires when scene loads — gives runtime access |
| `renderOnDemand?` | boolean | Enable on-demand rendering (default: true) |
| `className?` | string | CSS classes for wrapper |
| `style?` | object | CSS styles for wrapper |
| `onSplineMouseDown?` | `(e: SplineEvent) => void` | Mouse down on object |
| `onSplineMouseUp?` | `(e: SplineEvent) => void` | Mouse up on object |
| `onSplineMouseHover?` | `(e: SplineEvent) => void` | Hover over object |
| `onSplineKeyDown?` | `(e: SplineEvent) => void` | Key press |
| `onSplineKeyUp?` | `(e: SplineEvent) => void` | Key release |
| `onSplineStart?` | `(e: SplineEvent) => void` | Scene start |
| `onSplineLookAt?` | `(e: SplineEvent) => void` | Look-at trigger |
| `onSplineFollow?` | `(e: SplineEvent) => void` | Follow trigger |
| `onSplineScroll?` | `(e: SplineEvent) => void` | Scroll event |

### Runtime API (Application Methods)

Access via `onLoad` callback or ref:

```tsx
import { useRef } from 'react'
import type { Application } from '@splinetool/runtime'

function Scene() {
  const splineRef = useRef<Application>()

  function onLoad(spline: Application) {
    splineRef.current = spline
  }

  return <Spline scene={sceneUrl} onLoad={onLoad} />
}
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `findObjectByName` | `(name: string) => SPEObject` | Find object by name |
| `findObjectById` | `(uuid: string) => SPEObject` | Find object by UUID |
| `emitEvent` | `(eventName, nameOrUuid) => void` | Trigger animation event |
| `emitEventReverse` | `(eventName, nameOrUuid) => void` | Reverse animation event |
| `setVariable` | `(name: string, value: any) => void` | Set a Spline variable |
| `getVariable` | `(name: string) => any` | Get a Spline variable value |
| `setZoom` | `(zoom: number) => void` | Set initial camera zoom |

**Event names for emitEvent**: `mouseDown`, `mouseHover`, `mouseUp`, `keyDown`, `keyUp`, `start`, `lookAt`, `follow`

### Object Manipulation

```tsx
function onLoad(spline: Application) {
  const obj = spline.findObjectByName('Cube')
  if (obj) {
    obj.position.x = 100
    obj.position.y = 50
    obj.scale.set(2, 2, 2)
    obj.rotation.y = Math.PI / 4
  }
}
```

### Triggering Animations from React

```tsx
function triggerHover() {
  splineRef.current?.emitEvent('mouseHover', 'ButtonObject')
}

function reverseAnimation() {
  splineRef.current?.emitEventReverse('mouseDown', 'Card')
}
```

### Lazy Loading (Code Splitting)

```tsx
import React, { Suspense } from 'react'

const Spline = React.lazy(() => import('@splinetool/react-spline'))

function Page() {
  return (
    <Suspense fallback={<div className="spline-loader">Loading 3D...</div>}>
      <Spline scene={sceneUrl} />
    </Suspense>
  )
}
```

---

## Spline Variables & Data Binding

Variables let you drive 3D scenes with external data — the bridge between your second brain and visual output.

### Variable Types

- **Number** — numeric values (counters, scores, progress)
- **String** — text values (labels, names, statuses)
- **Boolean** — toggle states (visibility, active/inactive)

### Setting Variables from React

```tsx
function onLoad(spline: Application) {
  // Drive scene with data
  spline.setVariable('temperature', 72)
  spline.setVariable('userName', 'Drew')
  spline.setVariable('isActive', true)
}

// Read variables
const temp = splineRef.current?.getVariable('temperature')
```

### Data-Driven 3D (Airtable Example)

```tsx
import { useEffect, useRef } from 'react'
import type { Application } from '@splinetool/runtime'

function DataDriven3D({ projectData }) {
  const spline = useRef<Application>()

  function onLoad(app: Application) {
    spline.current = app
    // Push Airtable data into the 3D scene
    app.setVariable('projectName', projectData.name)
    app.setVariable('progress', projectData.percentComplete)
    app.setVariable('statusColor', projectData.status === 'active')
  }

  // React to data changes
  useEffect(() => {
    if (spline.current && projectData) {
      spline.current.setVariable('progress', projectData.percentComplete)
    }
  }, [projectData.percentComplete])

  return <Spline scene={sceneUrl} onLoad={onLoad} />
}
```

---

## Spline Webhooks (External Data → 3D)

Webhooks let external services push data into Spline scenes in real-time — no React wrapper needed.

### Setup in Spline Editor

1. Open **Variables & Data Panel** (right sidebar, nothing selected)
2. Go to **Webhooks** tab
3. Click **New Webhook** — Spline generates a unique URL
4. Click **+** to define incoming variables (String, Number, Boolean)
5. Copy the generated cURL snippet for testing

### Triggering from n8n / External Services

```bash
# cURL example — push data to a Spline webhook
curl -X POST "https://hooks.spline.design/YOUR_WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{"temperature": 85, "status": "active", "label": "Project Alpha"}'
```

### Webhook → Variable → Visual Update

In the Spline editor:
1. Add a **Webhook Called Event** on the target object
2. Select which webhook to listen to
3. Map incoming data fields to Spline variables
4. Use **Variable Change Events** to trigger animations when values update

### Second Brain Integration Pattern

```
Airtable record updated
  → n8n webhook trigger
    → n8n HTTP POST to Spline webhook URL
      → Spline variable updates
        → 3D scene reacts (color change, animation, counter update)
```

---

## Spline Real-Time API (Scene → External Services)

Spline scenes can also fetch and send data to external APIs directly.

### Setup in Spline Editor

1. Open **Variables & Data Panel** → **APIs** tab
2. Click **New API** → configure URL, method (GET/POST/PUT/DELETE/PATCH)
3. Add headers (Key-Value pairs) for auth tokens
4. Enable **Request on Start** for auto-loading
5. Map response fields to Spline variables

### Event-Driven API Calls

1. Select target object → add an event (e.g., Mouse Down)
2. Add **API Request Action** → select your configured API
3. Add **API Updated Event** to handle the response
4. Map response data to variables for visual updates

### Use Cases

- **Live dashboards**: Fetch Airtable data on scene load → display in 3D
- **Product configurators**: POST selections to your backend → receive pricing
- **IoT visualization**: Poll sensor API → animate gauges/indicators
- **AI integration**: Call OpenAI API from Spline → display responses as 3D text

---

## Spell AI — 3D World Generation

Spell is Spline's AI model for generating 3D worlds from text or images using Gaussian Splatting.

### Access

- URL: https://spell.spline.design/
- Pricing: $99/month (Early Supporter Plan)
- Status: Early access

### Capabilities

- **Text-to-3D**: Describe a scene → get 4 generated images → pick one → 3D world
- **Image-to-3D**: Upload an image → get 3 variations + original → 3D world
- Multi-view consistency across wide range of subjects (people, objects, environments, characters)
- Simulates physical materials (reflections, refractions, roughness, depth of field)
- Controlled camera paths within generated scenes

### Output

Spell generates Gaussian Splat volumes that render as navigable 3D scenes in the Spline editor. These can be:
- Published as interactive web scenes
- Exported to React/Next.js
- Used as environments in larger Spline projects
- Combined with hand-modeled objects

### Second Brain Workflow

```
Brand concept (Airtable)
  → Gemini generates scene description
    → Feed to Spell as text prompt
      → 3D world generated
        → Embed in website or Remotion video
```

---

## Spline AI Features (In-Editor)

Beyond Spell, Spline has built-in AI tools:

- **AI 3D Generation**: Generate 3D objects from text prompts within the editor
- **AI Style Transfer**: Apply visual styles to existing scenes
- **AI Texture Generation**: Generate textures from text descriptions
- **AI Assistant Events**: Trigger/listen to AI assistant interactions in scenes

---

## Spline MCP Server (Claude ↔ Spline)

An MCP server exists for programmatic Spline control from Claude Desktop.

### Repository

`github.com/aydinfer/spline-mcp-server`

### Capabilities

- Create, modify, delete 3D objects programmatically
- Control positioning, rotation, scaling, visibility
- Generate runtime code (JS, React, Next.js)
- Create layered materials with full customization
- 20+ event types, 15+ action types
- Webhook integration for real-time data
- Build complete interactive scenes from conversation

### Setup

```bash
git clone https://github.com/aydinfer/spline-mcp-server.git
cd spline-mcp-server && npm install
cp config/.env.example .env
# Configure .env with your Spline credentials

# Modes:
node bin/cli.js --mode mcp --transport stdio    # Claude Desktop
node bin/cli.js --mode webhook --port 3000      # Webhook server
node bin/cli.js --mode minimal                  # Lightweight
```

---

## Multi-Platform Export

Spline scenes export to all major platforms:

| Platform | Method | Notes |
|----------|--------|-------|
| **Web (React)** | `@splinetool/react-spline` | SSR via `/next` import |
| **Web (Vanilla)** | `@splinetool/runtime` | For non-React sites |
| **Web (Embed)** | Public URL / iframe | Zero-code embed |
| **iOS (Swift)** | SwiftUI API + native embed | visionOS Mirror support |
| **Android** | Kotlin API + native embed | APK/AAB export |
| **3D Print** | STL export | |
| **AR** | USDZ export | |
| **3D Standard** | GLTF/GLB export | |
| **Video** | Image/video export from editor | |
| **Remotion** | `@remotion/spline` | Programmatic 3D video |

### Integrations (No-Code Embed)

Figma, Framer, Webflow, Wix Studio, Notion, Shopify, Toddle, Typedream, Instant.so, Play, Tome

---

## React Three Fiber + Spline (Advanced)

For full programmatic control, use the r3f-spline hook:

```bash
npm install @splinetool/r3f-spline @react-three/fiber three
```

```tsx
import useSpline from '@splinetool/r3f-spline'
import { Canvas } from '@react-three/fiber'

function Scene() {
  const { nodes, materials } = useSpline('https://prod.spline.design/YOUR_ID/scene.splinecode')
  return (
    <group>
      <mesh geometry={nodes.Cube.geometry} material={materials.Default} />
    </group>
  )
}

export default function Page() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <Scene />
    </Canvas>
  )
}
```

---

## React Three Fiber (R3F) Fundamentals

R3F is the React renderer for Three.js — declarative 3D in JSX.

### Installation

```bash
npm install @react-three/fiber @react-three/drei three
npm install -D @types/three
```

### Canvas Setup

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      shadows
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} castShadow />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}
```

### useFrame (Animation Loop)

```tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function RotatingBox() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.5
  })
  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

### Loading GLTF/GLB Models

```tsx
import { useGLTF } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

// Preload for performance
useGLTF.preload('/models/my-model.glb')
```

### Drei Helpers (Essential)

```tsx
import {
  OrbitControls,    // Camera orbit
  Environment,      // HDR environment lighting
  Float,            // Floating animation
  Text3D,           // 3D text
  Center,           // Auto-center children
  MeshReflectorMaterial,  // Reflective floors
  ContactShadows,   // Soft contact shadows
  Stars,            // Starfield background
  Sky,              // Procedural sky
  useTexture,       // Texture loading
  useEnvironment,   // Environment map loading
} from '@react-three/drei'
```

---

## Three.js Fundamentals (Non-React)

For cases where raw Three.js is needed.

### Scene Setup

```javascript
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

camera.position.set(0, 2, 5)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
```

### Materials (PBR)

```javascript
// Standard PBR
const material = new THREE.MeshStandardMaterial({
  color: 0x4a90d9,
  metalness: 0.3,
  roughness: 0.4,
})

// Physical (glass, car paint, fabric)
const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1.0,
  roughness: 0.05,
  thickness: 0.5,
  ior: 1.5,
})
```

### Lighting Setup (Three-Point)

```javascript
// Key light
const key = new THREE.DirectionalLight(0xffffff, 1.5)
key.position.set(5, 5, 5)
key.castShadow = true
scene.add(key)

// Fill light
const fill = new THREE.HemisphereLight(0x8888ff, 0x443322, 0.5)
scene.add(fill)

// Rim light
const rim = new THREE.PointLight(0xffffff, 0.5)
rim.position.set(-5, 3, -5)
scene.add(rim)
```

### Post-Processing

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(width, height),
  0.5,  // strength
  0.4,  // radius
  0.85  // threshold
))

// In animation loop:
composer.render()  // instead of renderer.render()
```

---

## Shaders (GLSL)

### Custom ShaderMaterial

```tsx
// R3F version
<mesh>
  <planeGeometry args={[2, 2, 32, 32]} />
  <shaderMaterial
    vertexShader={`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `}
    fragmentShader={`
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
        gl_FragColor = vec4(vUv.x, wave, vUv.y, 1.0);
      }
    `}
    uniforms={{ uTime: { value: 0 } }}
  />
</mesh>
```

### Common Shader Patterns

- **Fresnel**: Edge glow effect — `pow(1.0 - dot(viewDirection, normal), power)`
- **Noise**: Use Simplex/Perlin noise for organic displacement
- **Gradient**: `mix(colorA, colorB, vUv.y)` for smooth color blending
- **Dissolve**: `if (noise(vUv) < threshold) discard;`

---

## Physics (Rapier)

```bash
npm install @react-three/rapier
```

```tsx
import { Physics, RigidBody } from '@react-three/rapier'

<Canvas>
  <Physics gravity={[0, -9.81, 0]}>
    <RigidBody type="dynamic">
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
    <RigidBody type="fixed">
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[10, 0.5, 10]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  </Physics>
</Canvas>
```

---

## Interaction Patterns

### Hover/Click

```tsx
<mesh
  onPointerEnter={() => setHovered(true)}
  onPointerLeave={() => setHovered(false)}
  onClick={() => setClicked(!clicked)}
>
  <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
</mesh>
```

### Drag Controls

```tsx
import { DragControls } from '@react-three/drei'

<DragControls>
  <mesh><boxGeometry /><meshStandardMaterial /></mesh>
</DragControls>
```

### Scroll-Linked 3D

```tsx
import { ScrollControls, useScroll } from '@react-three/drei'

function AnimatedScene() {
  const scroll = useScroll()
  useFrame(() => {
    const offset = scroll.offset // 0 to 1
    mesh.current.rotation.y = offset * Math.PI * 2
  })
  return <mesh ref={mesh}>...</mesh>
}

<Canvas>
  <ScrollControls pages={3}>
    <AnimatedScene />
  </ScrollControls>
</Canvas>
```

---

## Spline Event System (Complete)

### Editor Event Types (25+)

| Category | Events |
|----------|--------|
| **Mouse** | mouseDown, mouseUp, mouseHover, mousePress |
| **Keyboard** | keyDown, keyUp, keyPress |
| **Physics** | collision |
| **Spatial** | follow, lookAt, scroll, distance, triggerArea |
| **Lifecycle** | start, screenResize, stateChange |
| **Data** | apiUpdated, webhookCalled, variableChange |
| **Drag** | dragStart, dragEnd, dragDrop |
| **Game** | gameControl |
| **AI** | assistantTrigger, assistantListener |

### Editor Action Types (16)

animation, apiRequest, createObject, destroyObject, sceneTransition, switchCamera, particlesControl, playSound, playVideo, conditionalLogic, setVariable, clearLocalStorage, resetScene, openLink, customCode, triggerWebhook

### Spline Materials (17 Layer Types)

color, gradient, noise, glass, toon, matcap, fresnel, displacement, normal, bump, roughness, outline, pattern, rainbow, lighting, depth/3D gradient, video, image

---

## Performance Guidelines

1. **Instancing**: Use `InstancedMesh` for 100+ identical objects
2. **LOD**: `THREE.LOD` for distance-based detail reduction
3. **Texture compression**: Use KTX2/Basis for GPU-compressed textures
4. **Model optimization**: Draco compression for GLTF (`useGLTF.preload`)
5. **Pixel ratio**: Cap at 2 — `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
6. **Dispose**: Always clean up geometries, materials, textures when unmounting
7. **Lazy load**: Dynamic import Canvas for code splitting
8. **Shadows**: Limit shadow-casting lights, use `ContactShadows` from Drei for cheap soft shadows

## Next.js Considerations

- **SSR**: Always dynamic import Canvas with `ssr: false` (Pages Router) or use `@splinetool/react-spline/next` (App Router)
- **Bundle**: Three.js is ~600KB — use dynamic imports for 3D pages
- **Images as textures**: Use `next/image` for 2D, raw paths for 3D textures

---

## Remotion + Spline

Remotion has native Spline support for programmatic 3D video:

```tsx
import { SplineScene } from '@remotion/spline'

function MyVideo() {
  return (
    <SplineScene
      scene="https://prod.spline.design/ID/scene.splinecode"
      style={{ width: 1920, height: 1080 }}
    />
  )
}
```

---

## Quick Reference

| Need | Tool |
|------|------|
| Visual 3D design (non-code) | Spline editor |
| Drop 3D into React fast | `@splinetool/react-spline` |
| Full programmatic 3D | React Three Fiber + Drei |
| Raw WebGL control | Three.js directly |
| 3D in video | Remotion + Spline |
| Physics | `@react-three/rapier` |
| Post-processing | R3F `@react-three/postprocessing` or Three.js EffectComposer |
| Data-driven 3D | Spline Variables + `setVariable()` API |
| External data → 3D | Spline Webhooks (n8n, Zapier, custom) |
| 3D → External APIs | Spline Real-Time API (in-editor) |
| AI 3D generation | Spell AI (spell.spline.design) |
| Claude ↔ Spline | Spline MCP Server |
| iOS/Android native | Spline native exports (Swift/Kotlin) |
