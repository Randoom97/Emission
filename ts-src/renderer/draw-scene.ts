import { mat4, vec3 } from "gl-matrix";
import { Player } from "../objects/player";
import { GLObject } from "./obj-loader";
import { World } from "../objects/world";
import { ProgramInfo, RenderData } from "./render-data";

const sphereScale = vec3.fromValues(0.1, 0.1, 0.1);

export function drawScene(gl: WebGLRenderingContext) {
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
  mat4.rotate(modelViewMatrix, modelViewMatrix, -Player.rotation[1], [1, 0, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, -Player.rotation[0], [0, 1, 0]);
  // this is reversed because we're moving the world, not the player
  const reversePlayerPosition = vec3.create();
  vec3.scale(reversePlayerPosition, Player.getPosition(), -1);
  mat4.translate(modelViewMatrix, modelViewMatrix, reversePlayerPosition);

  gl.useProgram(RenderData.objectProgramInfo.program);

  gl.uniformMatrix4fv(
    RenderData.objectProgramInfo.uniforms.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    RenderData.objectProgramInfo.uniforms.modelViewMatrix,
    false,
    modelViewMatrix
  );

  // draw the world
  bindObject(
    gl,
    RenderData.map,
    RenderData.objectProgramInfo.attributes.vertexPosition
  );
  drawObject(
    gl,
    RenderData.map.faceCount,
    vec3.create(),
    vec3.fromValues(4.5, 4.5, 4.5),
    vec3.fromValues(0.4, 0.4, 0.45),
    RenderData.objectProgramInfo
  );

  bindObject(
    gl,
    RenderData.sphere,
    RenderData.objectProgramInfo.attributes.vertexPosition
  );
  // draw the target object
  drawObject(
    gl,
    RenderData.sphere.faceCount,
    World.targetObject.position,
    sphereScale,
    vec3.fromValues(0.1, 0.1, 0.1),
    RenderData.objectProgramInfo
  );

  // draw the building blocks
  for (let object of World.buildingBlocks) {
    drawObject(
      gl,
      RenderData.sphere.faceCount,
      object.position,
      sphereScale,
      vec3.fromValues(1, 1, 1),
      RenderData.objectProgramInfo
    );
  }
}

function bindObject(
  gl: WebGLRenderingContext,
  object: GLObject,
  vertexAttribLoc: GLint
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, object.vertices);
  gl.vertexAttribPointer(vertexAttribLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexAttribLoc);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.faces);
}

function drawObject(
  gl: WebGLRenderingContext,
  faceCount: number,
  position: vec3,
  scale: vec3,
  color: vec3,
  programInfo: ProgramInfo
) {
  const transformMatrix = mat4.create();
  mat4.translate(transformMatrix, transformMatrix, position);
  mat4.scale(transformMatrix, transformMatrix, scale);
  gl.uniformMatrix4fv(
    programInfo.uniforms.transformMatrix,
    false,
    transformMatrix
  );

  gl.uniform3fv(programInfo.uniforms.color, color);
  gl.drawElements(gl.TRIANGLES, faceCount, gl.UNSIGNED_SHORT, 0);
}
