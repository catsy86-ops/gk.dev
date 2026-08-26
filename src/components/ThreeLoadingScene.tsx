import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeLoadingScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if WebGL is supported in the current environment
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch {
        return false;
      }
    };

    if (!isWebGLAvailable()) {
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 24;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 3. Central Holographic 3D Geometric Core (GK.DEV Nexus)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer Wireframe Icosahedron
    const icosaGeometry = new THREE.IcosahedronGeometry(4.2, 1);
    const icosaMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const icosaMesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
    coreGroup.add(icosaMesh);

    // Inner Glowing Core (Octahedron)
    const octaGeometry = new THREE.OctahedronGeometry(2.4, 0);
    const octaMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const octaMesh = new THREE.Mesh(octaGeometry, octaMaterial);
    coreGroup.add(octaMesh);

    // Dual Orbiting Cybernetic Rings
    const ring1Geometry = new THREE.TorusGeometry(5.8, 0.04, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geometry = new THREE.TorusGeometry(6.6, 0.03, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 4. 3D Matrix Digital Rain Particles
    const rainCount = 1400;
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainSpeeds = new Float32Array(rainCount);
    const rainColors = new Float32Array(rainCount * 3);

    const colorPalette = [
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0x3b82f6), // Blue
      new THREE.Color(0x34d399), // Mint
    ];

    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 60; // X
      rainPositions[i * 3 + 1] = (Math.random() - 0.5) * 50; // Y
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 40; // Z

      rainSpeeds[i] = 0.2 + Math.random() * 0.45;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      rainColors[i * 3] = col.r;
      rainColors[i * 3 + 1] = col.g;
      rainColors[i * 3 + 2] = col.b;
    }

    rainGeometry.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    rainGeometry.setAttribute("color", new THREE.BufferAttribute(rainColors, 3));

    // Custom Canvas Particle Texture for sharp glowing Matrix dots
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(16, 185, 129, 0.9)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const rainMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const rainPoints = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainPoints);

    // 5. Mouse Parallax Interaction
    let targetRotX = 0;
    let targetRotY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = normX * 0.4;
      targetRotX = normY * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 6. Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate 3D Holographic Core
      icosaMesh.rotation.x += 0.4 * delta;
      icosaMesh.rotation.y += 0.6 * delta;

      octaMesh.rotation.x -= 0.8 * delta;
      octaMesh.rotation.z += 0.5 * delta;

      ring1.rotation.z += 0.5 * delta;
      ring2.rotation.x += 0.4 * delta;

      // Gentle pulsating breath scale
      const pulseScale = 1 + Math.sin(elapsed * 2.5) * 0.05;
      coreGroup.scale.set(pulseScale, pulseScale, pulseScale);

      // Mouse Parallax Lerp
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.05;

      // Animate Matrix Digital Rain Falling Downward
      const positions = rainGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= rainSpeeds[i];
        if (positions[i * 3 + 1] < -25) {
          positions[i * 3 + 1] = 25;
          positions[i * 3] = (Math.random() - 0.5) * 60;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 8. Strict Cleanup (Dispose all geometries, materials, textures, renderer)
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      icosaGeometry.dispose();
      icosaMaterial.dispose();
      octaGeometry.dispose();
      octaMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();

      rainGeometry.dispose();
      rainMaterial.dispose();
      particleTexture.dispose();

      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}
