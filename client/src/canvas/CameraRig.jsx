import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef(); //used to update state
  const snap = useSnapshot(state);

  //useFrameallows you to execute code on every rendered frame, thus run different effects, update controls and more
  //delta - difference from the last frame that happened
  useFrame((state, delta) => {
    //make website responsive
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600; //600px

    // Set a target point for the camera to look at (x, y, z)
    // const lookAtTarget = new THREE.Vector3(0, 0, 0); // The point where you want the camera to look

    //set initial position of the model
    //let targetPosition = [-10, -100, 40];
    // let targetPosition = [-1, 0, 5];
    // //home
    // if (snap.intro) {
    //   if (isBreakpoint) {
    //     targetPosition = [0, 0, 10];
    //   }
    //   if (isMobile) {
    //     targetPosition = [0, 0.2, 10];
    //   }
    // } else {
    //   if (isMobile) {
    //     targetPosition = [0, 0.09, 5.5];
    //   } else {
    //     targetPosition = [0, 0, 5];
    //   }
    // }
    let targetPosition = [-0.4, 0, 2];
    //home
    if (snap.intro) {
      if (isBreakpoint) {
        targetPosition = [0, 0, 2];
      }
      if (isMobile) {
        targetPosition = [0, 0.2, 2.5];
      }
    } else {
      if (isMobile) {
        targetPosition = [0, 0.2, 2.5];
      } else {
        targetPosition = [0, 0, 2];
      }
    }

    //set model camera position

    // easing.damp3(state.camera.position, targetPosition, 0.25, delta);
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // Make the camera look at the target point
    // state.camera.lookAt(lookAtTarget);

    //set the model rotation smoothly
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
