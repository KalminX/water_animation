# ⚡ Glitch Text + WebGL Water Simulation

A visually immersive frontend experiment combining:

- 🔥 **GSAP-powered glitch typography**
- 🌊 **Real-time GPU water ripple simulation using Three.js**
- 🎮 Interactive pointer-based distortion
- ⚙️ Custom GLSL shaders (no external water libraries)

This project creates a dark, cyberpunk-style interface with erratic glitching hero text and a dynamic ripple simulation rendered entirely on the GPU.

---

## 🚀 Features

### 1️⃣ Glitch Text Animation
- Each character of `.hero-text` is wrapped in a `<span>`
- Random vertical jitter using GSAP
- Flickering opacity
- Step-based animation easing
- Dynamic grayscale + blur distortion
- Occasional horizontal “shiver” glitch
- Button flicker effect

### 2️⃣ WebGL Water Simulation
- Built with Three.js
- GPU-based height map simulation using ping-pong framebuffers
- Custom GLSL fragment shaders
- Real-time ripple generation on pointer click
- Specular highlights for realistic water lighting
- Responsive resizing

---

## 📦 Dependencies

You need:

- **GSAP**
- **Three.js (v0.152.2 or compatible)**

Example CDN usage:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script type="module">
  import * as THREE from "https://cdn.skypack.dev/three@0.152.2";
</script>
```

---

## 🗂 Project Structure

```
/project-root
│
├── main.js
├── glitchText.js
├── waterSim.js
└── index.html
```

---

## 🧠 How It Works

### 🔤 Glitch Text Logic

1. Select `.hero-text`
2. Wrap each character in a `<span>`
3. Animate characters using GSAP with:
   - Random Y displacement
   - Step easing
   - Random opacity
4. Use `requestAnimationFrame()` for:
   - Grayscale shifts
   - Blur distortion
   - Brightness fluctuation
   - Horizontal jitter

---

### 🌊 Water Simulation Logic

The water effect uses a **height-field simulation** implemented with:

- Two `WebGLRenderTarget`s (ping-pong technique)
- A simulation shader to calculate wave propagation
- A display shader to compute lighting and normals

Each frame:
1. Read previous height texture
2. Compute new wave heights
3. Inject ripple force if mouse interaction occurs
4. Swap render targets
5. Render water surface

---

## 🎮 Interaction

Click (pointer down) anywhere on screen to:

- Inject wave energy into the simulation
- Create ripple expansion effect

---

## 🛠 Configuration Variables

Inside `initWaterSim()`:

```js
const RES = 512;       // Simulation resolution
const VISCOSITY = 0.985;  // Wave damping factor
const STRENGTH = 0.5;     // Ripple force strength
```

You can tweak these for:
- Sharper waves
- Slower damping
- Stronger ripples
- Higher quality simulation

---

## 📱 Responsive Behavior

- Automatically recalculates aspect ratio
- Updates orthographic camera bounds
- Resizes render targets
- Adjusts water mesh geometry

---

## 🎨 Visual Style

- Dark minimal base color
- Subtle ripple luminance
- High specular reflection
- Monochrome glitch aesthetic
- Stepped animation easing for retro digital feel

---

## ⚙️ Initialization

In `main.js`:

```js
import initGlitchText from "./glitchText.js";
import initWaterSim from "./waterSim.js";

initGlitchText();
initWaterSim("canvas-container");
```

Make sure your HTML contains:

```html
<div id="canvas-container"></div>
<h1 class="hero-text">GLITCH WATER</h1>
<button class="btn">ENTER</button>
```

---

## 🧪 Performance Notes

- Uses `FloatType` render targets (requires WebGL support)
- Runs entirely on GPU for simulation
- Designed for desktop performance
- High simulation resolution may impact low-end devices

---

## 💡 Ideas for Expansion

- Add chromatic aberration to glitch text
- Add RGB split shader pass
- Implement ripple from mouse movement instead of click
- Add post-processing bloom
- Integrate audio-reactive waves
- Convert to a landing page hero section

---

## 📄 License

Free to use for experimentation, learning, and creative projects.

---

## ✨ Author

Built as an experimental shader + animation playground combining GSAP and Three.js.

