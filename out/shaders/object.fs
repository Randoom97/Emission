uniform lowp vec3 color;
uniform lowp float highlight;

void main(void) {
    gl_FragColor = vec4 (mix(color * min(gl_FragCoord.w, 1.0), vec3(0.0, 1.0, 0.0), highlight), 1.0);
}