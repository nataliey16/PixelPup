import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef(); //used to update state
  const snap = useSnapshot(state);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
