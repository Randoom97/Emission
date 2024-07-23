attribute vec4 vertexPosition;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformMatrix;

varying lowp vec3 position;

void main(void) {
    gl_Position = projectionMatrix * viewMatrix * transformMatrix * vertexPosition;
    position = (transformMatrix * vertexPosition).xyz;
}