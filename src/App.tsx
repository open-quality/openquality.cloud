import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import './App.css'

// Liquid sphere component (kept for later use)
// @ts-expect-error - Kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AnimatedSphere() {
  return (
    <Sphere args={[1, 128, 128]} scale={2.5}>
      <MeshDistortMaterial
        color="#007AFF"
        attach="material"
        distort={0.6}
        speed={2}
        roughness={0}
        metalness={0.1}
        opacity={0.9}
        transparent={true}
      />
    </Sphere>
  )
}

// Shining Stars component - round with glow
function ShiningStars() {
  const pointsRef = useRef<THREE.Points>(null)

  // Create round star texture with bright sharp core
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    // Create radial gradient with sharp bright core
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)

    // Add larger bright white circle in center for sharp visible core
    ctx.beginPath()
    ctx.arc(32, 32, 12, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  const particlesGeometry = useMemo(() => {
    const count = 150
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    // Star temperature colors: blue (hot) -> white/yellow -> orange -> red (cool)
    // Using moderate brightness (1.0-1.5 range) for visible colors
    const starColors = [
      { r: 0.8, g: 1.0, b: 1.5 },   // Light blue (hot stars)
      { r: 1.0, g: 1.2, b: 1.5 },   // Blue-white
      { r: 1.5, g: 1.5, b: 1.5 },   // White
      { r: 1.5, g: 1.5, b: 1.0 },   // Yellow-white
      { r: 1.5, g: 1.3, b: 0.8 },   // Yellow
      { r: 1.5, g: 1.0, b: 0.7 },   // Orange
      { r: 1.5, g: 0.8, b: 0.7 },   // Light red
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2

      // Random star color from the temperature range
      const colorIndex = Math.floor(Math.random() * starColors.length)
      const color = starColors[colorIndex]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        // Simple twinkling by slightly moving stars
        const i3 = i / 3
        positions[i + 2] = Math.sin(clock.elapsedTime + i3) * 0.1 + ((i3 % 100) / 100) * 6 - 5
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Custom shader material for colored stars
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: starTexture }
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 1.5 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;

        void main() {
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * texColor.rgb, texColor.a);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true
    })
  }, [starTexture])

  return (
    <points ref={pointsRef} geometry={particlesGeometry} material={shaderMaterial} />
  )
}

// Plasma Infinity component
function PlasmaInfinity() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.3
      meshRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  // Create infinity curve geometry
  const geometry = useMemo(() => {
    // Generate infinity symbol points
    const points = []
    const scale = 2
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const angle = t * Math.PI * 2
      const x = scale * Math.cos(angle)
      const y = scale * Math.sin(angle) * Math.cos(angle) * 0.7
      const z = 0
      points.push(new THREE.Vector3(x, y, z))
    }

    const curve = new THREE.CatmullRomCurve3(points, true)
    return new THREE.TubeGeometry(curve, 200, 0.3, 32, true)
  }, [])

  // Plasma shader material
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    vec3 palette(float t) {
      vec3 a = vec3(0.2, 0.5, 0.8);
      vec3 b = vec3(0.5, 0.3, 0.6);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.0, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      float time = uTime * 0.5;

      // Plasma effect
      float plasma1 = sin(vPosition.x * 3.0 + time);
      float plasma2 = sin(vPosition.y * 3.0 + time * 1.3);
      float plasma3 = sin((vPosition.x + vPosition.y) * 2.0 + time * 0.7);
      float plasma = (plasma1 + plasma2 + plasma3) / 3.0;

      // Color from palette
      vec3 color = palette(plasma * 0.5 + 0.5);

      // Add glow effect (brighter)
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      color += fresnel * vec3(0.3, 0.5, 0.8);

      // Pulsing brightness (lighter)
      float pulse = sin(time * 2.0) * 0.1 + 0.75;
      color *= pulse;

      gl_FragColor = vec4(color, 0.9);
    }
  `

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <a href="#" className="logo">
              <img src="/logo.svg" alt="OpenQuality" />
              <span>OpenQuality</span>
            </a>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#use-cases">Use Cases</a>
              <a href="#docs">Docs</a>
              <a href="https://github.com/open-quality" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Animation */}
      <section className="hero">
        <div className="hero-3d">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.2} />
            <ShiningStars />
            <PlasmaInfinity />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>
        </div>
        <div className="container">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              From Test To Trust
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              An <b className="text-white">Open Source</b>, modern, lightweight platform that brings clarity, traceability, and actionable insights to software quality assurance
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a href="#get-started" className="btn btn-primary">Get Started</a>
              <a href="https://github.com/open-quality" className="btn btn-secondary">View on GitHub</a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>The Problem</h2>
              <p className="text-large">
                Modern software teams face a critical challenge: <strong>test data is scattered, unstructured, and invisible</strong>.
              </p>
              <ul className="feature-list">
                <li>Test results buried in CI/CD logs</li>
                <li>No visibility into quality trends</li>
                <li>Expensive commercial tools ($50-200/user/month)</li>
                <li>Complex setup and rigid workflows</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>The Solution</h2>
              <p className="text-large">
                OpenQuality centralizes your test execution data in a <strong>lightweight, self-hosted platform</strong>.
              </p>
              <ul className="feature-list">
                <li>Complete visibility across all environments</li>
                <li>Actionable insights and quality trends</li>
                <li>100% open source, zero licensing costs</li>
                <li>Deploy in minutes, own your data</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section-dark">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Key Features
          </motion.h2>
          <div className="grid-3">
            {[
              {
                icon: '✨',
                title: 'Complete Visibility',
                description: 'See all test results across all environments in one centralized platform'
              },
              {
                icon: '📊',
                title: 'Actionable Insights',
                description: 'Track pass rates, identify flaky tests, and spot quality trends instantly'
              },
              {
                icon: '🔗',
                title: 'Universal Integration',
                description: 'REST API works with any testing framework or CI/CD system'
              },
              {
                icon: '🚀',
                title: 'Deploy in Minutes',
                description: 'Single binary + PostgreSQL. No complex infrastructure required'
              },
              {
                icon: '💰',
                title: 'Zero Licensing Costs',
                description: '100% open source with unlimited users and tests'
              },
              {
                icon: '🔒',
                title: 'Data Ownership',
                description: 'Your data stays on your infrastructure, fully under your control'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Use Cases
          </motion.h2>
          <div className="grid-2">
            {[
              {
                title: 'CI/CD Integration',
                description: 'POST test results from GitHub Actions, Jenkins, GitLab CI, or any CI/CD platform'
              },
              {
                title: 'Multi-Environment Testing',
                description: 'Track the same tests across dev, staging, and production environments'
              },
              {
                title: 'Regression Analysis',
                description: 'Identify which tests fail most often and prioritize fixes effectively'
              },
              {
                title: 'Release Confidence',
                description: 'See pass rates and quality metrics before deploying to production'
              },
              {
                title: 'Compliance & Audits',
                description: 'Historical record of all test executions with complete timestamps'
              },
              {
                title: 'Team Collaboration',
                description: 'Share quality insights across engineering, QA, and product teams'
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                className="use-case-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="section section-dark">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built For
          </motion.h2>
          <div className="grid-2">
            {[
              {
                title: 'Small to Medium Teams',
                description: 'Teams outgrowing spreadsheets but can\'t justify expensive enterprise tools',
                benefit: 'Get enterprise features without enterprise pricing'
              },
              {
                title: 'DevOps/Platform Teams',
                description: 'Teams building internal developer platforms who need quality visibility',
                benefit: 'Integrate seamlessly into your platform'
              },
              {
                title: 'Regulated Industries',
                description: 'Healthcare, finance, aerospace requiring audit trails and compliance',
                benefit: 'Self-hosted security and complete audit trails'
              },
              {
                title: 'Open Source Projects',
                description: 'Communities needing transparent quality tracking and collaboration',
                benefit: 'Free forever with full transparency'
              }
            ].map((audience, index) => (
              <motion.div
                key={index}
                className="audience-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
                <div className="benefit">{audience.benefit}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Tech Stack
          </motion.h2>
          <div className="tech-stack">
            <div className="tech-item">
              <strong>Backend:</strong> Golang + Echo framework
            </div>
            <div className="tech-item">
              <strong>Frontend:</strong> Vue 3 + Quasar framework
            </div>
            <div className="tech-item">
              <strong>Database:</strong> PostgreSQL with Bun ORM
            </div>
            <div className="tech-item">
              <strong>CLI Tools:</strong> Cobra + go-pretty
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="section section-dark">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Quick Start
          </motion.h2>
          <motion.div
            className="code-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <pre><code>{`# 1. Install dependencies
make init

# 2. Build BackOffice tool
make build-bo

# 3. Setup database
make setup
make migrate-example

# 4. Run backend
make run

# 5. Run frontend (in another terminal)
make dev-ui

# Access at http://localhost:9000`}</code></pre>
          </motion.div>
          <div className="cta-buttons">
            <a href="https://github.com/open-quality" className="btn btn-primary">View on GitHub</a>
            <a href="#docs" className="btn btn-secondary">Read Documentation</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/logo.svg" alt="OpenQuality" />
              <span>OpenQuality</span>
            </div>
            <div className="footer-links">
              <a href="https://github.com/open-quality">GitHub</a>
              <a href="#docs">Documentation</a>
              <a href="#features">Features</a>
              <a href="#use-cases">Use Cases</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>MIT License | Open Source Test Management Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
