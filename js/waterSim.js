import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

export default function initWaterSim(containerId) {
  const RES = 512,
    VISCOSITY = 0.985,
    STRENGTH = 0.5;
  const container = document.getElementById(containerId);

  // Scene & Camera
  const scene = new THREE.Scene();
  let aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Render targets
  let targetA = new THREE.WebGLRenderTarget(RES, RES, {
    type: THREE.FloatType,
  });
  let targetB = targetA.clone();

  // Simulation material
  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tPrev: { value: null },
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uAspect: { value: aspect },
      uViscosity: { value: VISCOSITY },
      uStrength: { value: STRENGTH },
      uRes: { value: new THREE.Vector2(RES, RES) },
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D tPrev;
            uniform vec2 uMouse;
            uniform float uAspect;
            uniform float uViscosity;
            uniform float uStrength;
            uniform vec2 uRes;
            varying vec2 vUv;
            void main() {
                vec2 texel = 1.0 / uRes;
                float h = (
                    texture2D(tPrev, vUv + vec2(texel.x, 0.0)).r +
                    texture2D(tPrev, vUv + vec2(-texel.x, 0.0)).r +
                    texture2D(tPrev, vUv + vec2(0.0, texel.y)).r +
                    texture2D(tPrev, vUv + vec2(0.0, -texel.y)).r
                ) * 0.5 - texture2D(tPrev, vUv).g;
                h *= uViscosity;

                vec2 diff = vUv - uMouse;
                diff.x *= uAspect;
                if(length(diff) < 0.02) h += uStrength;

                gl_FragColor = vec4(h, texture2D(tPrev, vUv).r, 0.0, 1.0);
            }
        `,
  });

  // Simulation scene
  const simScene = new THREE.Scene();
  const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial));

  // Water material
  const waterMat = new THREE.ShaderMaterial({
    uniforms: {
      tHeight: { value: null },
      uRes: { value: new THREE.Vector2(RES, RES) },
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D tHeight;
            uniform vec2 uRes;
            void main() {
                vec2 off = vec2(1.0/uRes.x, 0.0);
                float hL = texture2D(tHeight, vUv - off.xy).r;
                float hR = texture2D(tHeight, vUv + off.xy).r;
                float hD = texture2D(tHeight, vUv - off.yx).r;
                float hU = texture2D(tHeight, vUv + off.yx).r;

                vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.15));
                vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
                float spec = pow(max(dot(normal, lightDir), 0.0), 30.0);

                vec3 baseColor = vec3(0.0, 0.0, 0.01);
                vec3 rippleColor = vec3(0.3,0.3,0.3) * (hR*8.0);

                gl_FragColor = vec4(baseColor + rippleColor + spec, 1.0);
            }
        `,
  });

  const waterMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(aspect * 2, 2),
    waterMat,
  );
  scene.add(waterMesh);

  // Mouse
  window.addEventListener("pointerdown", (e) => {
    simMaterial.uniforms.uMouse.value.set(
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight,
    );
  });

  // Animate
  function animate() {
    simMaterial.uniforms.tPrev.value = targetA.texture;
    renderer.setRenderTarget(targetB);
    renderer.render(simScene, simCamera);

    simMaterial.uniforms.uMouse.value.set(-1, -1);

    waterMat.uniforms.tHeight.value = targetB.texture;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    [targetA, targetB] = [targetB, targetA];
    requestAnimationFrame(animate);
  }
  animate();

  // Resize
  window.addEventListener("resize", () => {
    aspect = window.innerWidth / window.innerHeight;
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();

    simMaterial.uniforms.uAspect.value = aspect;
    waterMesh.geometry = new THREE.PlaneGeometry(aspect * 2, 2);
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
