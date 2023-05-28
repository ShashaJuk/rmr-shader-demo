export function addTexture(gl: WebGLRenderingContext, source: TexImageSource) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}
