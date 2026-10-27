import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import { gradientTexture, sprinkleGroundTexture, swirlTexture, waffleTexture, wrapperTexture } from '../textures';
import { starFaceTexture, sunFaceTexture } from '../storybook';
import { Cloud, noRaycast, SkyDome } from './common';

// Candy-land with faces on everything. The big props stand beside the board (past 38° either side)
// and the sun, stars and clouds sit above its top (~19°), so they're in view during a run without
// crowding the targets.

const SKY = [[0, '#ffa6d2'], [0.42, '#ffd3ea'], [0.5, '#fff0f7'], [1, '#fff0f7']];
const RAINBOW = ['#ff9aa2', '#ffc38a', '#fff3a0', '#9ff0b0', '#9fd6ff', '#c9b3ff'];
const INK = '#5a2a4a';

// Eyes, blush and a smile, about 3.6 wide at scale 1, facing +z.
function Face({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {[-0.9, 0.9].map(x => (
        <group key={x} position={[x, 0.3, 0]}>
          <mesh raycast={noRaycast}>
            <sphereGeometry args={[0.24, 12, 8]} />
            <meshBasicMaterial color={INK} />
          </mesh>
          <mesh position={[0.07, 0.08, 0.2]} raycast={noRaycast}>
            <sphereGeometry args={[0.07, 8, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
      {[-1.6, 1.6].map(x => (
        <mesh key={x} position={[x, -0.3, -0.05]} raycast={noRaycast}>
          <circleGeometry args={[0.38, 20]} />
          <meshBasicMaterial color="#ff9cc4" transparent opacity={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -0.2, 0.05]} rotation={[0, 0, Math.PI]} raycast={noRaycast}>
        <torusGeometry args={[0.35, 0.07, 6, 16, Math.PI]} />
        <meshBasicMaterial color={INK} />
      </mesh>
    </group>
  );
}

function Rainbow(props) {
  return (
    <group {...props}>
      {RAINBOW.map((color, i) => (
        <mesh key={color} raycast={noRaycast}>
          <torusGeometry args={[110 - i * 4, 2.1, 8, 120, Math.PI]} />
          <meshBasicMaterial color={color} toneMapped={false} fog={false} />
        </mesh>
      ))}
    </group>
  );
}

function HappyCloud({ position, scale, phase }) {
  const group = useRef(null);
  useFrame(({ clock }) => {
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + phase) * 0.6;
  });
  return (
    <group ref={group} position={position} scale={scale}>
      <Cloud emissive="#fff4fa" emissiveIntensity={0.4}>
        <Face position={[0, 0, 2.5]} />
      </Cloud>
    </group>
  );
}

const SPRINKLES = ['#ff6fa8', '#ffd84d', '#6fc8ff', '#a98bff', '#7fe0a8'];

function Cupcake({ position, scale = 1 }) {
  const top = [
    [-0.7, 2.35, 0.9, 0.4], [0.5, 2.4, 1.0, -0.6], [0.9, 2.05, 0.7, 1.1], [-1.0, 2.0, 0.5, -1.2],
    [-0.2, 2.9, 0.6, 0.8], [0.3, 2.85, -0.5, -0.3], [-0.6, 2.6, -0.8, 1.4], [0.8, 2.3, -0.6, 0.2]
  ];
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[1.6, 1.25, 1.8, 28]} />
        <meshStandardMaterial map={wrapperTexture('pink', '#ffb3d1', '#ff8fbf', [12, 1])} roughness={0.8} />
      </mesh>
      <Face position={[0, 0.95, 1.47]} scale={0.42} />
      <mesh position={[0, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.55, 14, 32]} />
        <meshStandardMaterial color="#fff2f8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.45, 14, 28]} />
        <meshStandardMaterial color="#fff2f8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <sphereGeometry args={[0.55, 20, 14]} />
        <meshStandardMaterial color="#fff2f8" roughness={0.6} />
      </mesh>
      {top.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, r]}>
          <capsuleGeometry args={[0.05, 0.18, 4, 6]} />
          <meshStandardMaterial color={SPRINKLES[i % SPRINKLES.length]} />
        </mesh>
      ))}
      <mesh position={[0, 3.75, 0]}>
        <sphereGeometry args={[0.36, 16, 12]} />
        <meshStandardMaterial color="#ff4f74" roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 4.2, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
        <meshStandardMaterial color="#5f9b4a" />
      </mesh>
    </group>
  );
}

function IceCream({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.25, 3.2, 24]} />
        <meshStandardMaterial map={waffleTexture([4, 3])} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <sphereGeometry args={[1.35, 24, 18]} />
        <meshStandardMaterial color="#bdf2d6" roughness={0.6} />
      </mesh>
      <Face position={[0, 3.35, 1.3]} scale={0.4} />
      <mesh position={[0, 4.85, 0]}>
        <sphereGeometry args={[1.1, 24, 18]} />
        <meshStandardMaterial color="#ffc3d9" roughness={0.6} />
      </mesh>
      <mesh position={[0, 6.05, 0]}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial color="#ff4f74" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Turned to face the camera, so the ones far to the side don't show up edge-on.
function Lollipop({ position, scale = 1, flavour }) {
  const [key, a, b] = flavour;
  return (
    <group position={position} scale={scale} rotation={[0, Math.atan2(-position[0], 5 - position[2]), 0]}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 3.6, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.3, 32]} />
        <meshStandardMaterial color={a} />
      </mesh>
      <mesh position={[0, 3.6, 0.16]}>
        <circleGeometry args={[1.3, 32]} />
        <meshStandardMaterial map={swirlTexture(key, a, b)} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function Mushroom({ position, scale = 1 }) {
  const dots = [[0.5, 0.75, 0.6], [-0.6, 0.7, 0.5], [0, 0.95, 0.2], [0.2, 0.6, -0.8], [-0.4, 0.8, -0.5]];
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.38, 1, 12]} />
        <meshStandardMaterial color="#fff6ea" />
      </mesh>
      <Face position={[0, 0.5, 0.36]} scale={0.12} />
      <mesh position={[0, 1, 0]} scale={[1, 0.7, 1]}>
        <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff6f91" />
      </mesh>
      {dots.map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y + 0.6, z]}>
          <sphereGeometry args={[0.13, 8, 6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function FaceSprite({ texture, position, size, phase }) {
  const sprite = useRef(null);
  useFrame(({ clock }) => {
    sprite.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + phase) * 0.5;
  });
  return (
    <sprite ref={sprite} position={position} scale={[size, size, 1]} raycast={noRaycast}>
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} fog={false} />
    </sprite>
  );
}

const FLAVOURS = [
  ['pink', '#ff8fc7', '#ffffff'],
  ['mint', '#7ee0b5', '#ffffff'],
  ['lavender', '#c4a7ff', '#ffffff'],
  ['lemon', '#ffe27a', '#ff9ac9']
];

// [x, z, scale, flavour]
const LOLLIPOPS = [
  [-21, -17, 1.3, 0], [23, -20, 1.5, 1], [-28, -30, 1.7, 2], [30, -34, 1.6, 3], [-30, -16, 1.4, 1], [33, -18, 1.5, 2]
];

// [x, y, z, scale, bob phase]
const CLOUDS = [
  [-34, 30, -70, 1.4, 0], [28, 33, -78, 1.5, 1.2], [4, 46, -100, 1.6, 2.4], [-62, 22, -90, 1.5, 3.1], [62, 26, -95, 1.6, 0.7]
];

export default function Kawaii() {
  return (
    <>
      <color attach="background" args={['#fff0f7']} />
      <fog attach="fog" args={['#ffe6f2', 60, 180]} />
      <SkyDome texture={gradientTexture('kawaii', SKY)} />
      <ambientLight intensity={0.9} color="#fff0f7" />
      <directionalLight position={[8, 18, 14]} intensity={1.6} />

      {/* Squashed so it arcs over the board (top ~24° up) and lands just past its edges (~41°). */}
      <Rainbow position={[0, -1, -120]} scale={[1, 0.55, 1]} />
      <FaceSprite texture={sunFaceTexture()} position={[-40, 40, -85]} size={20} phase={0} />
      <FaceSprite texture={starFaceTexture('lemon', '#ffe27a')} position={[30, 30, -60]} size={6} phase={1.3} />
      <FaceSprite texture={starFaceTexture('lilac', '#d8c4ff')} position={[-24, 22, -45]} size={4} phase={2.6} />
      {CLOUDS.map(([x, y, z, s, phase]) => (
        <HappyCloud key={x} position={[x, y, z]} scale={s} phase={phase} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[320, 320]} />
        <meshBasicMaterial map={sprinkleGroundTexture([60, 60])} toneMapped={false} />
      </mesh>
      {LOLLIPOPS.map(([x, z, s, f]) => (
        <Lollipop key={`${x}-${z}`} position={[x, -1, z]} scale={s} flavour={FLAVOURS[f]} />
      ))}
      <Cupcake position={[-16.5, -1, -11]} scale={1.3} />
      <IceCream position={[16.5, -1, -11.5]} scale={1.2} />
      <Mushroom position={[13, -1, -6.5]} scale={0.9} />
    </>
  );
}
