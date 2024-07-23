attribute vec4 vertexPosition;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformMatrix;

void main(void) {
    gl_Position = projectionMatrix * viewMatrix * transformMatrix * vertexPosition;
}