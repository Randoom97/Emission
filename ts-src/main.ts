import { vec3 } from "gl-matrix";
import { Camera } from "./camera";
import { drawScene } from "./draw-scene";
import { setupListeners } from "./listeners";
import { loadObject } from "./obj-loader";
import { ProgramInfo, Scene } from "./structs";
import { createProgram } from "./shader-constructor";

main();

async function main() {
  const canvas = <HTMLCanvasElement>document.querySelector("#glcanvas");
  const gl = <WebGLRenderingContext>canvas.getContext("webgl");

  setupListeners(gl);

  // So we don't flashbang users while stuff is loading
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const objectShaderProgram = <WebGLProgram>(
    await createProgram(gl, "./shaders/object.vs", "./shaders/object.fs")
  );

  const programInfo: ProgramInfo = {
    program: objectShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(
        objectShaderProgram,
        "aVertexPosition"
      ),
    },
    uniformLocations: {
      projectionMatrix: <WebGLUniformLocation>(
        gl.getUniformLocation(objectShaderProgram, "uProjectionMatrix")
      ),
      modelViewMatrix: <WebGLUniformLocation>(
        gl.getUniformLocation(objectShaderProgram, "uModelViewMatrix")
      ),
      transformMatrix: <WebGLUniformLocation>(
        gl.getUniformLocation(objectShaderProgram, "transformMatrix")
      ),
      color: <WebGLUniformLocation>(
        gl.getUniformLocation(objectShaderProgram, "color")
      ),
    },
  };

  const world = await loadObject("./objects/EmissionRoom.obj", gl);
  const sphere = await loadObject("./objects/sphere.obj", gl);

  const targetPosition = vec3.fromValues(0.05, 1, -2.7);
  const rightmostSpot = vec3.fromValues(-2.4, 1, 2.85);
  const leftmostSpot = vec3.fromValues(2.5, 1, 2.85);

  const sphreScale = vec3.fromValues(0.1, 0.1, 0.1);

  const scene: Scene = {
    world: {
      glObject: world,
      position: vec3.create(),
      scale: vec3.fromValues(4.5, 4.5, 4.5),
      color: vec3.fromValues(0.4, 0.4, 0.45),
    },
    objects: [
      {
        glObject: sphere,
        position: targetPosition,
        scale: sphreScale,
        color: vec3.fromValues(0.1, 0.1, 0.1),
      },
      {
        glObject: sphere,
        position: rightmostSpot,
        scale: sphreScale,
        color: vec3.fromValues(1.0, 1.0, 1.0),
      },
      {
        glObject: sphere,
        position: leftmostSpot,
        scale: sphreScale,
        color: vec3.fromValues(1.0, 1.0, 1.0),
      },
    ],
  };

  function render() {
    drawScene(gl, programInfo, scene);
    Camera.step();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
