import { proxy } from "valtio";

const state = proxy({
  intro: true,
  customize: false,
  showcase: false,
  color: "#EFBD48",
  // color1: "",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
});

export default state;
