import { lazy } from 'react';
import { HeroVisual } from '@/components/mockups/HeroVisual';
import { Scene3DFrame } from './Scene3DFrame';

const WorkspaceScene = lazy(() => import('./WorkspaceScene'));

/**
 * Hero visual: interactive 3D developer workspace. Falls back to the original
 * illustrative dashboard mockup when WebGL is unavailable or motion is reduced.
 */
export function DeveloperWorkspace3D() {
  return (
    <Scene3DFrame
      Scene={WorkspaceScene}
      fallback={<HeroVisual />}
      className="mx-auto h-[300px] w-full max-w-[640px] sm:h-[400px] lg:h-[520px] lg:max-w-none"
      label="Interactive 3D illustration of a laptop showing code, surrounded by JavaScript, React, Node.js and database icons"
    />
  );
}
