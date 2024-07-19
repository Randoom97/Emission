uniform lowp vec3 color;

void main(void) {
    gl_FragColor = vec4 (color * min(gl_FragCoord.w, 1.0), 1.0);
}