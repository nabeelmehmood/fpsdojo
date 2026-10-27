import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { cloudFloorTexture, gradientTexture } from '../textures';
import {
  beadArcTexture,
  butterflyTexture,
  chickTexture,
  cloverTexture,
  flowerTexture,
  ladybugTexture,
  pastelCloudTexture
} from '../storybook';
import { noRaycast, SkyDome } from './common';

// A soft storybook sky: cream all round, flat pastel clouds, and a few little friends at the edges.
// Everything sits beside the board (past 38° either side) or above its top (~19°), so the targets
// keep a calm background. Confetti and sparkles are the theme's ambient particles.

const SKY = [[0, '#f3eee3'], [0.45, '#faf6ee'], [1, '#faf6ee']];
const MINT = '#e5efe4';
const PEACH = '#f6e6dc';
const LAVENDER = '#ebe7f2';

// [x, y, z, width, colour]; the cloud art is twice as wide as it is tall.
const CLOUDS = [
  [-30, 24, -48, 36, MINT],
  [34, 20, -52, 40, PEACH],
  [2, 40, -95, 34, LAVENDER],
  [-54, 8, -62, 30, PEACH],
  [58, 12, -72, 34, MINT],
  [-15, 1.2, -12, 14, MINT],
  [17, 0.4, -13, 15, LAVENDER]
];

function Sprite({ texture, position, size, opacity = 1, spriteRef }) {
  return (
    <sprite ref={spriteRef} position={position} scale={[size[0], size[1], 1]} raycast={noRaycast}>
      <spriteMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

// Little friends bob gently; butterflies flap by squeezing their sprite sideways.
const FRIENDS = [
  { key: 'chick', texture: chickTexture, position: [-15.5, 3.4, -11.6], size: 3, bob: 0.12, speed: 1.1 },
  { key: 'ladybug', texture: ladybugTexture, position: [-16, 9, -13], size: 2.2, bob: 0.25, speed: 0.7 },
  { key: 'clover', texture: cloverTexture, position: [16.5, 5.5, -13], size: 2.6, bob: 0.2, speed: 0.6 },
  { key: 'butterfly-lilac', texture: () => butterflyTexture('lilac', '#d7c9ee', '#ece4f8'), position: [-11, 15, -14], size: 1.3, bob: 0.3, speed: 0.9, flap: true },
  { key: 'butterfly-peach', texture: () => butterflyTexture('peach', '#f6cdb8', '#fbe5d8'), position: [17, 10.5, -14], size: 1.1, bob: 0.3, speed: 1.2, flap: true },
  { key: 'flower-lilac', texture: () => flowerTexture('lilac', '#cdb8ec'), position: [-13.4, 2.6, -11.3], size: 1, bob: 0, speed: 0 },
  { key: 'flower-peach', texture: () => flowerTexture('peach', '#f4c2a8'), position: [-17.4, 2.3, -11.8], size: 0.9, bob: 0, speed: 0 }
];

function Friends() {
  const sprites = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    FRIENDS.forEach(({ position, size, bob, speed, flap }, i) => {
      const sprite = sprites.current[i];
      if (!sprite) return;
      sprite.position.y = position[1] + Math.sin(t * speed + i) * bob;
      if (flap) sprite.scale.x = size * (0.55 + 0.45 * Math.abs(Math.cos(t * 2.2 + i)));
    });
  });
  return FRIENDS.map(({ key, texture, position, size }, i) => (
    <Sprite
      key={key}
      texture={texture()}
      position={position}
      size={[size, size]}
      spriteRef={sprite => {
        sprites.current[i] = sprite;
      }}
    />
  ));
}

export default function Daydream() {
  return (
    <>
      <color attach="background" args={['#faf6ee']} />
      <fog attach="fog" args={['#f8f3e9', 45, 170]} />
      <SkyDome texture={gradientTexture('daydream', SKY)} />
      <hemisphereLight args={['#fffaf0', '#e6dff0', 1.5]} />
      <directionalLight position={[10, 20, 12]} intensity={1.2} color="#fff6e8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[320, 320]} />
        <meshBasicMaterial map={cloudFloorTexture([18, 18])} toneMapped={false} />
      </mesh>

      {CLOUDS.map(([x, y, z, width, color]) => (
        <Sprite key={`${x}-${z}`} texture={pastelCloudTexture(color, color)} position={[x, y, z]} size={[width, width / 2]} />
      ))}
      <Sprite texture={beadArcTexture()} position={[-21, 14, -24]} size={[9, 9]} opacity={0.6} />
      <Friends />
    </>
  );
}
