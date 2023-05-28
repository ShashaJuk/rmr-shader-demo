import { GlitchAnimation } from "./Glitch/GlitchAnimation";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const image = document.createElement("img");

image.onload = () => {
  new GlitchAnimation({ canvas: canvas, texture: image });
};

image.src = "https://images.unsplash.com/photo-1641840918928-4db8c04f1993?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";
image.crossOrigin = "anonymous";