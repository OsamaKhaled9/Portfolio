import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import './Lanyard.css';

import { cardGLB, lanyardTexture } from '../../../assets';

// Extend geometries
extend({ MeshLineGeometry, MeshLineMaterial });

// WebGL Context Handler Component
function WebGLContextManager({ children, onContextLost }) {
    const { gl } = useThree();
    const [contextLost, setContextLost] = useState(false);

    useEffect(() => {
        const canvas = gl.domElement;

        const handleContextLost = (event) => {
            console.log('WebGL context lost');
            event.preventDefault();
            setContextLost(true);
            onContextLost();
        };

        const handleContextRestored = () => {
            console.log('WebGL context restored');
            setContextLost(false);
        };

        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);

        return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, [gl, onContextLost]);

    if (contextLost) {
        return null;
    }

    return children;
}

// Band Component
function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const segmentProps = { 
    type: 'dynamic', 
    canSleep: true, 
    colliders: false, 
    angularDamping: 4, 
    linearDamping: 4 
  };
  
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardTexture);
  const [textureConfigured, setTextureConfigured] = useState(false);
  
  useEffect(() => {
      if (texture && !textureConfigured) {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.needsUpdate = true;
          setTextureConfigured(true);
      }
  }, [texture, textureConfigured]);
  
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(), 
      new THREE.Vector3(), 
      new THREE.Vector3(), 
      new THREE.Vector3()
    ])
  );
  
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  // Joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
        setIsSmall(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);

    // Store ref values in closure for cleanup
    const currentBand = band.current;

    return () => {
        window.removeEventListener('resize', handleResize);
        // Dispose resources using closure variable
        if (currentBand?.geometry) {
            currentBand.geometry.dispose();
        }
        if (currentBand?.material) {
            currentBand.material.dispose();
            if (currentBand.material.map) {
                currentBand.material.map.dispose();
            }
        }
    };
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ 
        x: vec.x - dragged.x, 
        y: vec.y - dragged.y, 
        z: vec.z - dragged.z 
      });
    }
    
    if (fixed.current && band.current?.geometry) {
        [j1, j2].forEach(ref => {
            if (!ref.current.lerped) {
                ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
            }
            const clampedDistance = Math.max(
                0.1,
                Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
            );
            ref.current.lerped.lerp(
                ref.current.translation(),
                delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
            );
        });

        const newPoints = [
            j3.current.translation(),
            j2.current.lerped,
            j1.current.lerped,
            fixed.current.translation()
        ];
        const needsUpdate = newPoints.some((p, i) =>
            !curve.points[i].equals(p)
        );

        if (needsUpdate) {
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            try {
                band.current.geometry.setPoints(curve.getPoints(16));
            } catch (error) {
                console.error('Error updating band geometry:', error);
            }
        }

        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  useEffect(() => {
    curve.curveType = 'chordal';
  }, [curve]);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={e => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={4}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [512, 1024] : [512, 512]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// Error Fallback Component
function ErrorFallback({ onRetry }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      flexDirection: 'column',
      gap: '1rem',
      color: '#06b6d4',
      fontFamily: 'Monaco, monospace',
      background: '#0a0a0a',
      borderRadius: '8px'
    }}>
      <div>WebGL Context Lost</div>
      <button 
        onClick={onRetry}
        style={{
          padding: '0.5rem 1rem',
          background: '#06b6d4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}
      >
        Reload Component
      </button>
    </div>
  );
}

// Main Lanyard Component
export default function Lanyard({ 
    position = [0, 0, 25],
    gravity = [0, -40, 0], 
    fov = 25,
    transparent = true,
    onError,
}) {
    const [key, setKey] = useState(0);
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
        console.log('Lanyard MOUNTED, key:', key);
        return () => {
            console.log('Lanyard UNMOUNTING, key:', key);
        };
    }, [key]);
    
    const handleContextLost = () => {
        console.log('Context lost handler called');
        setHasError(true);
        onError?.();
    };

    const handleRetry = () => {
        setHasError(false);
        setKey(prev => prev + 1);
    };

    if (hasError) {
        return (
            <div className="lanyard-wrapper">
                <ErrorFallback onRetry={handleRetry} />
            </div>
        );
    }

    return (
        <div className="lanyard-wrapper">
            <Canvas
                key={key}
                camera={{ 
                    position: position, 
                    fov: fov,
                    near: 0.1,
                    far: 1000
                }}
                gl={{ 
                    alpha: transparent,
                    preserveDrawingBuffer: false,
                    antialias: true,
                    powerPreference: "default"
                }}
                onCreated={({ gl, camera }) => {
                    gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
                    camera.lookAt(0, 0, 0);
                }}
                onError={() => setHasError(true)}
            >
                <WebGLContextManager onContextLost={handleContextLost}>
                    <ambientLight intensity={Math.PI * 0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={0.5} />
                    <Physics gravity={gravity} timeStep={1 / 30}>
                        <Band />
                    </Physics>
                    <Environment blur={0.75}>
                        <Lightformer
                            intensity={2}
                            color="white"
                            position={[0, -1, 5]}
                            rotation={[0, 0, Math.PI / 3]}
                            scale={[100, 0.1, 1]}
                        />
                        <Lightformer
                            intensity={3}
                            color="white"
                            position={[-1, -1, 1]}
                            rotation={[0, 0, Math.PI / 3]}
                            scale={[100, 0.1, 1]}
                        />
                        <Lightformer
                            intensity={3}
                            color="white"
                            position={[1, 1, 1]}
                            rotation={[0, 0, Math.PI / 3]}
                            scale={[100, 0.1, 1]}
                        />
                        <Lightformer
                            intensity={10}
                            color="white"
                            position={[-10, 0, 14]}
                            rotation={[0, Math.PI / 2, Math.PI / 3]}
                            scale={[100, 10, 1]}
                        />
                    </Environment>
                </WebGLContextManager>
            </Canvas>
        </div>
    );
}
