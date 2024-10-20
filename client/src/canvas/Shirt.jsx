import React from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shift = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  //const { nodes, materials } = useGLTF("/shiba.glb");

  console.log(nodes);

  //From store/index.js
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal); //entire shirt

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
  );

  // useFrame((state, delta) =>
  //   easing.dampC(materials.default.color, snap.color, 0.25, delta)
  // );

  // create a string of state to keeps track of state changes and render the change
  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        //castShadow
        // geometry={nodes.Box002_default_0.geometry}
        // material={materials.default}
        // material-roughness={1}
        // dispose={null}
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* if full texture or full shirt */}
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {/* if logo */}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shift;
