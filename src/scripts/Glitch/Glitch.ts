import { createProgram } from "./webGLHelpers/createProgram";
import { setAttributes } from "./webGLHelpers/setAttributes";
import { bindTexture } from "./webGLHelpers/bindTexture";
import { addTexture } from "./webGLHelpers/addTexture";
import { createTexture } from "./webGLHelpers/createTexture";
import vertexShader from "./shaders/default.vert?raw";
import fogShader from "./shaders/glitch.frag?raw";

interface GlitchConfig {
  canvas: HTMLCanvasElement;
}

interface UniformParams {
  time: WebGLUniformLocation | null;
  dimensions: WebGLUniformLocation | null;
  mouse: WebGLUniformLocation | null;
  strength: WebGLUniformLocation | null;
}

export class Glitch {
  canvas;

  gl: WebGLRenderingContext | null;

  glitchProgramm;

  uniformParams: UniformParams = {
    time: null,
    dimensions: null,
    mouse: null,
    strength: null,
  };

  originTexture;

  constructor(config: GlitchConfig) {
    this.canvas = config.canvas;
    this.gl = this.canvas.getContext("webgl", { premultipliedAlpha: false });

    if (!this.gl) return;
    this.glitchProgramm = createProgram(this.gl, vertexShader, fogShader);
    this.gl.useProgram(this.glitchProgramm);

    // init uniform params
    if (!this.glitchProgramm) return;
    this.uniformParams.dimensions = this.gl.getUniformLocation(this.glitchProgramm, "dimensions");
    this.uniformParams.time = this.gl.getUniformLocation(this.glitchProgramm, "time");
    this.uniformParams.mouse = this.gl.getUniformLocation(this.glitchProgramm, "mouse");
    this.uniformParams.strength = this.gl.getUniformLocation(this.glitchProgramm, "strength");

    this.originTexture = createTexture(this.gl);

    this.gl.uniform2fv(this.uniformParams.dimensions, [this.canvas.offsetWidth * window.devicePixelRatio, this.canvas.offsetHeight * window.devicePixelRatio]);
    setAttributes(this.gl, this.glitchProgramm);
  }

  initTexture(texture: TexImageSource) {
    if (!this.gl || !this.originTexture) return;
    bindTexture(this.gl, this.originTexture);
    addTexture(this.gl, texture);
  }

  resize() {
    if (!this.gl) return;

    this.gl.viewport(0, 0, this.canvas.offsetWidth * window.devicePixelRatio, this.canvas.offsetHeight * window.devicePixelRatio);

    this.gl.uniform2fv(this.uniformParams.dimensions, [this.canvas.offsetWidth * window.devicePixelRatio, this.canvas.offsetHeight * window.devicePixelRatio]);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  draw(tick: number, position: { x: number; y: number }, strength: number) {
    if (!this.gl) return;

    this.gl.uniform1f(this.uniformParams.time, tick);
    this.gl.uniform2f(this.uniformParams.mouse, position.x, position.y);
    this.gl.uniform1f(this.uniformParams.strength, strength);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
