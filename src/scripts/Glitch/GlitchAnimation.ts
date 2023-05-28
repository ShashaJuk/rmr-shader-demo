import { Glitch } from "./Glitch";
import { lerp } from "./lerp";

interface GlitchAnimationConfig {
  canvas: HTMLCanvasElement;
  texture: HTMLImageElement;
}

export class GlitchAnimation {
  distance = 0;
  distanceHistoryMaxLength = 2;
  distanceHistory: { value: number; time: number }[] = [];
  velocityHistoryMaxLength = 2;
  velocityHistory: number[] = [];
  acceleration: number = 0;

  position?: { x: number; y: number };
  prevPosition?: { x: number; y: number };

  prevTime?: number;

  canvas;
  glitch;

  requestId?: number;

  constructor(config: GlitchAnimationConfig) {
    this.canvas = config.canvas;

    this.setSize();

    this.glitch = new Glitch({
      canvas: this.canvas,
    });

    this.glitch.initTexture(config.texture);

    this.resizeHandler = this.resizeHandler.bind(this);
    this.move = this.move.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener("pointermove", this.move);
    window.addEventListener("resize", this.resizeHandler);

    this.glitch.draw(performance.now(), { x: 0, y: 0 }, 0);
    this.loop();
  }

  move(e: PointerEvent) {
    this.position = { x: e.clientX, y: e.clientY };
  }

  calcVelocity(position: { x: number; y: number }) {
    if (this.prevPosition && this.prevTime !== undefined) {
      const distance = Math.sqrt((position.x - this.prevPosition.x) ** 2 + (position.y - this.prevPosition.y) ** 2);
      const elapsed = performance.now() - this.prevTime;
      this.distanceHistory.push({ value: distance, time: elapsed });

      let sumDistance = 0;
      let sumTime = 0;
      for (let distance of this.distanceHistory) {
        sumDistance += distance.value;
        sumTime += distance.time;
      }

      this.velocityHistory.push(sumDistance / sumTime);

      let sumVelocity = 0;
      for (let velocity of this.velocityHistory) {
        sumVelocity += velocity;
      }

      this.acceleration = lerp(this.acceleration, sumVelocity / sumTime, 0.01);

      if (this.distanceHistory.length > this.distanceHistoryMaxLength) {
        this.distanceHistory.shift();
      }
      if (this.velocityHistory.length > this.velocityHistoryMaxLength) {
        this.velocityHistory.shift();
      }
    }

    this.prevPosition = position;
    this.prevTime = performance.now();
  }

  loop() {
    if (this.position) {
      this.calcVelocity(this.position);
      this.glitch.draw(
        performance.now(),
        { x: this.position.x * window.devicePixelRatio, y: this.position.y * window.devicePixelRatio },
        this.acceleration * 10
      );
    }
    this.requestId = requestAnimationFrame(this.loop);
  }

  resizeHandler() {
    this.setSize();
    this.glitch.resize();
  }

  setSize() {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
  }

  destroy() {
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("pointermove", this.move);
    if (this.requestId !== undefined) {
      cancelAnimationFrame(this.requestId);
    }
  }
}
