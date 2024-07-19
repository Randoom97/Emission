import { mat4, vec3 } from "gl-matrix";
import { ProgramInfo, Scene, SceneObject } from "./structs";
import { Camera } from "./camera";

export function drawScene(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  scene: Scene
) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180;

  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    Camera.getRotation()[1],
    [1, 0, 0]
  );
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    Camera.getRotation()[0],
    [0, 1, 0]
  );

  mat4.translate(modelViewMatrix, modelViewMatrix, Camera.getPosition());

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  drawObject(gl, scene.world, programInfo);

  for (let object of scene.objects) {
    drawObject(gl, object, programInfo);
  }
}

function drawObject(
  gl: WebGLRenderingContext,
  object: SceneObject,
  programInfo: ProgramInfo
) {
  const transformMatrix = mat4.create();
  mat4.translate(transformMatrix, transformMatrix, object.position);
  mat4.scale(transformMatrix, transformMatrix, object.scale);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.transformMatrix,
    false,
    transformMatrix
  );

  gl.uniform3fv(programInfo.uniformLocations.color, object.color);

  gl.bindBuffer(gl.ARRAY_BUFFER, object.glObject.vertices);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.glObject.faces);
  gl.drawElements(
    gl.TRIANGLES,
    object.glObject.faceCount,
    gl.UNSIGNED_SHORT,
    0
  );
}
