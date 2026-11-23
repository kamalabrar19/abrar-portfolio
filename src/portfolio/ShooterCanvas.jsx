import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Sparkles } from '@react-three/drei';
import { WORLD } from './shooterEngine';

function Fighter({ player, damaged }) {
  return <group position={[player.x, player.y, 0]} rotation={[.38, -.16, 0]}>
    <mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[.28, 1.7, 8]} /><meshStandardMaterial color={damaged ? '#ff968c' : '#dcead1'} metalness={.65} roughness={.28} /></mesh>
    <mesh position={[-.18, 0, 0]} scale={[.65, .21, .3]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#405346" metalness={.55} roughness={.3} /></mesh>
    <mesh position={[.15, .04, .22]} scale={[.31, .13, .12]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#66e4dd" emissive="#2a8c8a" emissiveIntensity={.5} metalness={.65} roughness={.12} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[-.26, side * .33, 0]} rotation={[0, 0, side * -.55]} scale={[.48, .5, .05]}><sphereGeometry args={[1, 4, 2]} /><meshStandardMaterial color="#b2cd83" metalness={.6} roughness={.3} /></mesh>
      <mesh position={[-.4, side * .35, .03]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.08, .09, .45, 12]} /><meshStandardMaterial color="#465c57" metalness={.8} roughness={.2} /></mesh>
      <mesh position={[-.8, side * .35, .03]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[.07, .38, 12]} /><meshBasicMaterial color="#b8fdf7" /></mesh>
    </group>)}
    <mesh position={[-.69, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[.12, .5, 12]} /><meshBasicMaterial color="#c7f36b" /></mesh>
    <mesh position={[.74, 0, 0]}><boxGeometry args={[.28, .065, .065]} /><meshBasicMaterial color="#c7f36b" /></mesh>
  </group>;
}
function Enemy({ enemy }) {
  return <group name={`enemy-${enemy.id}`} position={[enemy.x, enemy.y, 0]} rotation={[.25, .3, 0]}>
    <mesh>{enemy.shape === 'bug' ? <icosahedronGeometry args={[.37, 1]} /> : enemy.shape === 'workflow' ? <boxGeometry args={[.55, .55, .45]} /> : <octahedronGeometry args={[.42]} />}<meshStandardMaterial color={enemy.color} emissive={enemy.color} emissiveIntensity={.3} roughness={.45} /></mesh>
    <mesh position={[-.18, .09, .32]}><sphereGeometry args={[.075, 8, 8]} /><meshBasicMaterial color="#171a15" /></mesh>
    <mesh position={[.13, .09, .32]}><sphereGeometry args={[.075, 8, 8]} /><meshBasicMaterial color="#171a15" /></mesh>
  </group>;
}
function Scene({ game, onTick }) {
  const backdrop = useRef();
  useFrame((_, delta) => {
    onTick(delta);
    if (backdrop.current && game.playing) backdrop.current.position.x = -(game.time * .5 % 1);
  });
  return <>
    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={38} />
    <color attach="background" args={['#121811']} />
    <ambientLight intensity={1.4} /><directionalLight position={[1, 4, 6]} intensity={3} color="#efffe5" />
    <Fighter player={game.player} damaged={game.invulnerable > 0} />
    {game.bullets.map(bullet => <mesh name={`bullet-${bullet.id}`} key={bullet.id} position={[bullet.x, bullet.y, 0]}><boxGeometry args={[.48, .055, .055]} /><meshBasicMaterial color="#e3ff85" /></mesh>)}
    {game.enemies.map(enemy => <Enemy key={enemy.id} enemy={enemy} />)}
    {game.burst && <group position={[game.burst.x, game.burst.y, .1]}><Sparkles count={18} scale={[1.1, 1.1, .6]} size={5} speed={2} color={game.burst.color} /></group>}
    <group ref={backdrop}><gridHelper args={[16, 32, '#36543a', '#233126']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]} /></group>
    <mesh position={[0, WORLD.bottom - .3, -.6]}><boxGeometry args={[16, .1, 1.8]} /><meshStandardMaterial color="#4a573b" /></mesh>
  </>;
}
export default function ShooterCanvas({ game, onTick }) {
  return <Canvas dpr={[1, 1.25]} frameloop={game.playing ? 'always' : 'demand'} gl={{ antialias: true, powerPreference: 'low-power' }}
    fallback={<p role="alert">WebGL is unavailable. Try a browser with hardware acceleration.</p>}>
    <Scene game={game} onTick={onTick} />
  </Canvas>;
}
