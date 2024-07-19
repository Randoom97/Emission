attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 transformMatrix;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * transformMatrix * aVertexPosition;
}