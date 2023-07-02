import { Glitch } from "./Pixelation";

interface GlitchAnimationConfig {
  canvas: HTMLCanvasElement;
  texture: HTMLImageElement | HTMLVideoElement;
  dimensions: [number, number];
  pixelSize: number;
  pixelationStep: number;
  animationInterval: number;
  onAnimationEnded?: () => void;
}

export class GlitchAnimation {
  pixelSize: number;
  pixelationStep: number;
  animationInterval;

  canvas;
  glitch;

  timeoutId?: number;

  onAnimationEnded;

  constructor(config: GlitchAnimationConfig) {
    this.canvas = config.canvas;

    this.pixelSize = config.pixelSize;
    this.pixelationStep = config.pixelationStep;
    this.animationInterval = config.animationInterval;

    this.onAnimationEnded = config.onAnimationEnded;

    this.glitch = new Glitch({
      canvas: this.canvas,
    });

    this.glitch.resize(config.dimensions);
    this.glitch.initTexture(config.texture);

    this.loop = this.loop.bind(this);

    this.glitch.draw(this.pixelSize);
    this.loop();
  }

  loop() {
    this.pixelSize -= this.pixelationStep;
    if (this.pixelSize <= 1) {
      this.glitch.draw(1);
      if (this.onAnimationEnded) this.onAnimationEnded();
    } else {
      this.glitch.draw(this.pixelSize);
      this.timeoutId = setTimeout(this.loop, this.animationInterval);
    }
  }

  destroy() {
    clearTimeout(this.timeoutId);
  }
}
