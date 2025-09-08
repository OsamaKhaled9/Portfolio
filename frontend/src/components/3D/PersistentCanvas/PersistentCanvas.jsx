import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';

const PersistentCanvas = ({ children, ...canvasProps }) => {
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef();

  const handleContextLost = useCallback((e) => {
    e.preventDefault();
    console.log('WebGL context lost, preparing recovery...');
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored, reinitializing...');
    setContextLost(false);
    setCanvasKey(prev => prev + 1); // Force complete remount
  }, []);

  if (contextLost) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: '#06b6d4',
        fontFamily: 'Monaco, monospace',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(6, 182, 212, 0.3)',
          borderTop: '3px solid #06b6d4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div>Recovering 3D Context...</div>
      </div>
    );
  }

  return (
    <Canvas
      key={canvasKey} // Force remount on context restore
      ref={canvasRef}
      gl={{
        alpha: true,
        antialias: false, // Disable for better performance
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false
      }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x000000), 0);
        
        // Add context event listeners
        gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);
      }}
      {...canvasProps}
    >
      <Physics
        gravity={[0, -9.81, 0]}
        timeStep={1/60}
      >
        {children}
      </Physics>
    </Canvas>
  );
};

export default PersistentCanvas;
