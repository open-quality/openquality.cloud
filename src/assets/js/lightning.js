const vertexShaderSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 10

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1.0, 0.0));
    float c = hash12(ip + vec2(0.0, 1.0));
    float d = hash12(ip + vec2(1.0, 1.0));

    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.x += uXOffset;

    uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

    float dist = abs(uv.x);
    vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
    vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
    col = pow(col, vec3(1.0));
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

const defaultOptions = {
  hue: 230,
  xOffset: 0,
  speed: 1,
  intensity: 1,
  size: 1,
}

class LightningBackground {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.options = { ...defaultOptions, ...options }
    this.gl = null
    this.program = null
    this.animationId = 0
    this.startTime = 0
    this.uniforms = {}
    this.handleResize = this.handleResize.bind(this)
    this.render = this.render.bind(this)
    this.init()
  }

  init() {
    this.gl = this.canvas.getContext('webgl')
    if (!this.gl) {
      console.warn('WebGL not supported for lightning background')
      return
    }
    const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER)
    const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return
    this.program = this.gl.createProgram()
    if (!this.program) return
    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program))
      return
    }
    this.gl.useProgram(this.program)
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)
    const aPosition = this.gl.getAttribLocation(this.program, 'aPosition')
    this.gl.enableVertexAttribArray(aPosition)
    this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0)
    this.uniforms = {
      iResolution: this.gl.getUniformLocation(this.program, 'iResolution'),
      iTime: this.gl.getUniformLocation(this.program, 'iTime'),
      uHue: this.gl.getUniformLocation(this.program, 'uHue'),
      uXOffset: this.gl.getUniformLocation(this.program, 'uXOffset'),
      uSpeed: this.gl.getUniformLocation(this.program, 'uSpeed'),
      uIntensity: this.gl.getUniformLocation(this.program, 'uIntensity'),
      uSize: this.gl.getUniformLocation(this.program, 'uSize'),
    }
    this.startTime = performance.now()
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    this.render()
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type)
    if (!shader) return null
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }
    return shader
  }

  handleResize() {
    const rect = this.canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(rect.width || window.innerWidth, 300)
    const height = Math.max(rect.height || window.innerHeight, 300)
    this.canvas.width = width * dpr
    this.canvas.height = height * dpr
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.display = 'block'
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
  }

  render() {
    if (!this.gl || !this.program) return
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    const elapsed = (performance.now() - this.startTime) / 1000
    this.gl.uniform2f(this.uniforms.iResolution, this.canvas.width, this.canvas.height)
    this.gl.uniform1f(this.uniforms.iTime, elapsed)
    this.gl.uniform1f(this.uniforms.uHue, this.options.hue)
    this.gl.uniform1f(this.uniforms.uXOffset, this.options.xOffset)
    this.gl.uniform1f(this.uniforms.uSpeed, this.options.speed)
    this.gl.uniform1f(this.uniforms.uIntensity, this.options.intensity)
    this.gl.uniform1f(this.uniforms.uSize, this.options.size)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    this.animationId = requestAnimationFrame(this.render)
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId)
    window.removeEventListener('resize', this.handleResize)
  }
}

const bootLightning = () => {
  const canvas = document.querySelector('[data-lightning-canvas]')
  if (!canvas) return null
  return new LightningBackground(canvas, {
    hue: 230,
    xOffset: 0,
    speed: 1,
    intensity: 1,
    size: 1,
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootLightning)
} else {
  bootLightning()
}
