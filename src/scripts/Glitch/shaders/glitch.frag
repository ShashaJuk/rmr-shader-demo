precision highp float;

#define PI 3.14159265359
#define u_radius 0.2

uniform float time;
uniform vec2 dimensions;

uniform vec2 mouse;

uniform float strength;

varying vec2 v_texCoord;

uniform sampler2D image;

void main() {
    
    vec2 uv = gl_FragCoord.xy / dimensions.xy;
    uv.y = 1.0 + uv.y * -1.0;
    vec2 muv = mouse.xy / dimensions.xy;

    vec2 diff = uv - muv;
    float distance = length(diff);

    float scale = (0.5 - cos(distance/u_radius * PI * 0.5));
    scale +=
    (
        mod(uv.x-muv.x, 0.01 + 0.1 * strength) +
        mod(uv.y-muv.y, 0.01 + 0.1 * strength)
    ) / ((1.0 + distance)*0.08);
    
    vec2 fishUv = muv + normalize(diff) * u_radius * scale;
    
    uv = uv * (1.0 - strength) + fishUv *  strength;

    gl_FragColor = vec4(texture2D(image, uv).rgb, 1.0);
}
