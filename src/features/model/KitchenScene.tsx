import { Canvas } from '@react-three/fiber';
import { Edges, Html, OrbitControls } from '@react-three/drei';
import { useMemo, type RefObject } from 'react';
import type { Member, ZoneModel } from '../../model';
import { kindColors } from './colors';

const selectedColor = '#d6336c';

interface KitchenSceneProps {
  zone: ZoneModel;
  stage: number | null;
  selectedId: string | null;
  showLabels: boolean;
  onSelect: (id: string) => void;
  /** Overlay the labels render into, so unmounting the canvas never touches React-owned nodes. */
  labelLayer: RefObject<HTMLDivElement | null>;
}

export default function KitchenScene({ zone, stage, selectedId, showLabels, onSelect, labelLayer }: KitchenSceneProps) {
  const portal = labelLayer as RefObject<HTMLElement>;
  // Frame the whole zone (not just the visible stage) so the camera stays put between stages.
  const bounds = useMemo(() => {
    const boxes = zone.members.map((member) => member.box);
    const minX = Math.min(...boxes.map((b) => b.x));
    const maxX = Math.max(...boxes.map((b) => b.x + b.dx));
    const minY = Math.min(...boxes.map((b) => b.y));
    const maxY = Math.max(...boxes.map((b) => b.y + b.dy));
    const maxZ = Math.max(...boxes.map((b) => b.z + b.dz));
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, sx: maxX - minX, sy: maxY - minY, maxZ };
  }, [zone]);

  const visible = useMemo(() => zone.members.filter((member) => !member.pairOf && (stage === null || member.stage <= stage)), [zone, stage]);
  // Selecting the track half of a box highlights the box it belongs to.
  const highlightId = zone.members.find((member) => member.id === selectedId)?.pairOf ?? selectedId;

  // Plan coordinates → scene: the zero point sits on the right, as in the drawings.
  const toScene = (x: number, y: number, z: number): [number, number, number] => [bounds.cx - x, z, bounds.cy - y];
  const center = (member: Member) => {
    const { x, y, z, dx, dy, dz } = member.box;
    return toScene(x + dx / 2, y + dy / 2, z + dz / 2);
  };

  const narrow = typeof window !== 'undefined' && window.innerWidth < 700 ? 1.9 : 1;
  const scale = (Math.max(bounds.sx, bounds.sy * 2.2, 240) / 250) * narrow;
  const target: [number, number, number] = [0, bounds.maxZ * 0.4, 0];

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [-150 * scale, target[1] + 120 * scale, 250 * scale], fov: 40, near: 1, far: 5000 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#eef2ef']} />
      <hemisphereLight args={['#ffffff', '#b9c4bf', 1.6]} />
      <directionalLight position={[-120, 300, 200]} intensity={1.4} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[bounds.sx + 80, bounds.sy + 80]} />
        <meshStandardMaterial color="#e2ddd3" />
      </mesh>
      <gridHelper args={[Math.max(bounds.sx, bounds.sy) + 80, 32, '#c9c2b4', '#d8d2c6']} />

      {visible.map((member) => {
        const current = stage === null || member.stage === stage;
        const selected = member.id === highlightId;
        const { dx, dy, dz } = member.box;
        return (
          <mesh
            key={member.id}
            position={center(member)}
            rotation={[0, 0, member.tilt ? (member.tilt * Math.PI) / 180 : 0]}
            onClick={(event) => { event.stopPropagation(); onSelect(member.id); }}
            onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = ''; }}
          >
            <boxGeometry args={[dx, dz, dy]} />
            <meshStandardMaterial
              color={selected ? selectedColor : kindColors[member.kind]}
              transparent={!current && !selected}
              opacity={current || selected ? 1 : 0.22}
              depthWrite={current || selected}
            />
            {(current || selected) && <Edges color={selected ? '#7a1238' : '#33434a'} threshold={15} />}
            {(selected || (showLabels && current && stage !== null)) && (
              <Html center zIndexRange={[20, 0]} portal={portal}>
                <span className={selected ? 'scene-label scene-label-selected' : 'scene-label'}>{member.netLength}</span>
              </Html>
            )}
          </mesh>
        );
      })}

      {zone.markers.map((marker) => (
        <Html key={marker.label} position={toScene(marker.x, marker.y, 0)} center zIndexRange={[10, 0]} portal={portal}>
          <span className="scene-marker">{marker.label}</span>
        </Html>
      ))}

      <OrbitControls makeDefault target={target} enableDamping={false} minDistance={60} maxDistance={1400} maxPolarAngle={Math.PI / 2 - 0.02} />
    </Canvas>
  );
}
