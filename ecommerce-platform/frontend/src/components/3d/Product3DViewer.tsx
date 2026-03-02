'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Float,
  Html,
  useGLTF,
  Stage,
  PresentationControls
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Maximize2, RotateCw, Zap } from 'lucide-react';
import * as THREE from 'three';

interface Product3DViewerProps {
  productName: string;
  modelUrl?: string;
  images?: string[];
}

// Fallback 3D Product Model (when no GLB provided)
function FallbackProductModel({ color = '#D4AF37' }: { color?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Luxury Product Box */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Gold Accent Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={1}
            roughness={0}
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 3;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.5,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

// Main 3D Product Component
function Product3DModel({ modelUrl }: { modelUrl?: string }) {
  if (modelUrl) {
    try {
      const { scene } = useGLTF(modelUrl);
      return <primitive object={scene} scale={2} />;
    } catch (error) {
      console.warn('Failed to load 3D model, using fallback');
      return <FallbackProductModel />;
    }
  }
  return <FallbackProductModel />;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  productName,
  modelUrl,
  images = []
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-royal-purple-dark via-royal-purple to-royal-purple-light rounded-3xl overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="w-full h-full"
      >
        <Suspense fallback={
          <Html center>
            <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Loading 3D Model...</span>
            </div>
          </Html>
        }>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />
          
          {/* Product Model */}
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Product3DModel modelUrl={modelUrl} />
          </PresentationControls>

          {/* Environment & Shadows */}
          <Environment preset="city" />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={3}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={15}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setAutoRotate(!autoRotate)}
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
        >
          <RotateCw className={`w-5 h-5 text-white ${autoRotate ? 'animate-spin' : ''}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Info Badge */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
        <div className="flex items-center gap-2 text-white">
          <Zap className="w-4 h-4 text-royal-gold" />
          <span className="text-sm font-medium">360° Interactive View</span>
        </div>
      </div>

      {/* Product Name Overlay */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20">
        <h3 className="text-white font-display text-lg">{productName}</h3>
      </div>
    </div>
  );
};
