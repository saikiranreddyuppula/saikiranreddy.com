import { useEffect, useState } from "react";
import {
  Bloom,
  EffectComposer,
  HueSaturation,
  N8AO,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

interface CinematicPostProps {
  /** Ambient-occlusion radius in world units */
  aoRadius?: number;
  aoIntensity?: number;
  bloom?: number;
  bloomThreshold?: number;
}

/**
 * Shared "filmed, not rendered" finish for the WebGL sections: contact
 * shadows (AO), bloom on light sources, filmic tone mapping, vignette and
 * film grain. The final desaturate pass guarantees the monochrome rule
 * whatever the lighting does. AO is skipped on small screens for speed.
 */
const CinematicPost = ({
  aoRadius = 0.8,
  aoIntensity = 2.5,
  bloom = 0.7,
  bloomThreshold = 0.9,
}: CinematicPostProps) => {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setLowPower(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  // The finishing passes shared by both quality tiers
  const finish = [
    <Bloom
      key="bloom"
      mipmapBlur
      intensity={bloom}
      luminanceThreshold={bloomThreshold}
      luminanceSmoothing={0.25}
    />,
    <ToneMapping key="tone" mode={ToneMappingMode.ACES_FILMIC} />,
    <Vignette key="vignette" offset={0.28} darkness={0.7} />,
    <Noise key="grain" premultiply blendFunction={BlendFunction.ADD} opacity={0.35} />,
    <HueSaturation key="mono" saturation={-1} />,
  ];

  if (lowPower) {
    return <EffectComposer multisampling={0}>{finish}</EffectComposer>;
  }

  return (
    <EffectComposer multisampling={4}>
      <N8AO
        aoRadius={aoRadius}
        intensity={aoIntensity}
        distanceFalloff={1}
        halfRes
        quality="medium"
      />
      {finish}
    </EffectComposer>
  );
};

export default CinematicPost;
