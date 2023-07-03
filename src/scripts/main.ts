import { GlitchAnimation } from "./Glitch/PixelationAnimation";

const pixelationStep = 2;
const pixelSize = pixelationStep * 32;
const animationInterval = 50;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// ДЛЯ КАРТИНКИ

const image = document.createElement("img");

image.onload = () => {
  new GlitchAnimation({
    canvas: canvas,
    texture: image,
    pixelationStep,
    pixelSize,
    animationInterval,
    dimensions: [image.width, image.height],
  });
};

image.src =
  "https://images.unsplash.com/photo-1641840918928-4db8c04f1993?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";
image.crossOrigin = "anonymous";

// ДЛЯ ВИДЕО

// const video = document.createElement("video") as HTMLVideoElement;
// video.style.position = "fixed";
// video.style.opacity = "0";
// canvas.insertAdjacentElement("afterend", video);

// video.onloadedmetadata = () => {
//   console.log("loaded", video);
//   setTimeout(() => {
//     new GlitchAnimation({
//       canvas: canvas,
//       texture: video,
//       pixelationStep,
//       pixelSize,
//       animationInterval,
//       dimensions: [video.videoWidth, video.videoHeight],
//       onAnimationEnded: () => {
//         video.play();
//         video.style.removeProperty("position");
//         video.style.removeProperty("opacity");

//         canvas.style.display = "none";
//       },
//     });
//   }, 100); // chrome first frame issue fix
// };

// video.src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
// video.crossOrigin = "anonymous";

// video.muted = true;
// video.playsInline = true;
// video.loop = true;

// video.load();
