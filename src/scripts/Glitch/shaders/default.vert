attribute vec4 position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = position;
  v_texCoord = a_texCoord;
}