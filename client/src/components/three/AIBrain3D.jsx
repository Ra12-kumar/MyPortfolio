import { lazy } from 'react';
import { CssOrb } from '@/site/three/Lazy3D';
import { Scene3DFrame } from './Scene3DFrame';

const BrainScene = lazy(() => import('./BrainScene'));

/** Interactive 3D AI brain / neural network. Falls back to a CSS orb without WebGL. */
export function AIBrain3D({ className = 'aspect-square w-full max-w-[520px]' }) {
  return (
    <Scene3DFrame
      Scene={BrainScene}
      fallback={
        <div className="relative aspect-square w-full max-w-[520px]">
          <CssOrb />
        </div>
      }
      className={className}
      fallbackClassName="mx-auto w-full max-w-[520px]"
      label="Interactive 3D visualization of an AI brain with glowing neural connections"
    />
  );
}
