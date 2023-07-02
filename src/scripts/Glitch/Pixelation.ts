import { createProgram } from "./webGLHelpers/createProgram";
import { setAttributes } from "./webGLHelpers/setAttributes";
import { bindTexture } from "./webGLHelpers/bindTexture";
import { addTexture } from "./webGLHelpers/addTexture";
import { createTexture } from "./webGLHelpers/createTexture";
import vertexShader from "./shaders/default.vert?raw";
import pixelationShader from "./shaders/pixelation.frag?raw";

interface GlitchConfig {
  canvas: HTMLCanvasElement;
}

interface UniformParams {
  dimensions: WebGLUniformLocation | null;
  pixelSize: WebGLUniformLocation | null;
}

export class Glitch {
  canvas;

  gl: WebGLRenderingContext | null;

  glitchProgramm;

  uniformParams: UniformParams = {
    dimensions: null,
    pixelSize: null,
  };

  originTexture;

  constructor(config: GlitchConfig) {
    this.canvas = config.canvas;
    this.gl = this.canvas.getContext("webgl", { premultipliedAlpha: false });

    if (!this.gl) return;
    this.glitchProgramm = createProgram(this.gl, vertexShader, pixelationShader);
    this.gl.useProgram(this.glitchProgramm);

    if (!this.glitchProgramm) return;
    this.uniformParams.dimensions = this.gl.getUniformLocation(this.glitchProgramm, "dimensions");
    this.uniformParams.pixelSize = this.gl.getUniformLocation(this.glitchProgramm, "pixelSize");

    this.originTexture = createTexture(this.gl);

    this.gl.uniform2fv(this.uniformParams.dimensions, [this.canvas.offsetWidth * window.devicePixelRatio, this.canvas.offsetHeight * window.devicePixelRatio]);
    setAttributes(this.gl, this.glitchProgramm);
  }

  initTexture(texture: TexImageSource) {
    if (!this.gl || !this.originTexture) return;

    bindTexture(this.gl, this.originTexture);
    addTexture(this.gl, texture);
  }

  resize(dimensions: [number, number]) {
    if (!this.gl) return;

    [this.canvas.width, this.canvas.height] = dimensions;
    this.gl.viewport(0, 0, ...dimensions);
    this.gl.uniform2fv(this.uniformParams.dimensions, dimensions);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  draw(pixelSize: number) {
    if (!this.gl) return;

    this.gl.uniform1f(this.uniformParams.pixelSize, pixelSize);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
