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

  const viewMatrix = mat4.create();
  mat4.rotate(viewMatrix, viewMatrix, -Player.rotation[1], [1, 0, 0]);
  mat4.rotate(viewMatrix, viewMatrix, -Player.rotation[0], [0, 1, 0]);
  // this is reversed because we're moving the world, not the player
  const reversePlayerPosition = vec3.create();
  vec3.scale(reversePlayerPosition, Player.getPosition(), -1);
  mat4.translate(viewMatrix, viewMatrix, reversePlayerPosition);

  drawWorld(gl, projectionMatrix, viewMatrix);
  drawObjects(gl, projectionMatrix, viewMatrix);
}

function drawWorld(
  gl: WebGLRenderingContext,
  projectionMatrix: mat4,
  viewMatrix: mat4
) {
  gl.useProgram(RenderData.worldProgramInfo.program);

  const uniforms = RenderData.worldProgramInfo.uniforms;
  gl.uniformMatrix4fv(uniforms.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(uniforms.viewMatrix, false, viewMatrix);

  const allLights = [World.targetObject, ...World.buildingBlocks];

  const lights: number[] = [];
  allLights.forEach((item) => lights.push(...item.position));
  gl.uniform3fv(uniforms.lightPositions, new Float32Array(lights));

  const lightColors: number[] = [];
  allLights.forEach((item) => lightColors.push(...item.color));
  gl.uniform3fv(uniforms.lightColors, new Float32Array(lightColors));

  const lightLuminance = allLights.map((item) => item.luminosity);
  gl.uniform1iv(uniforms.lightLuminance, new Int32Array(lightLuminance));

  const lightShape = allLights.map((item) => item.shape);
  gl.uniform1iv(uniforms.lightShape, new Int32Array(lightShape));

  gl.uniform1i(uniforms.lightCount, lights.length / 3);

  bindObject(
    gl,
    RenderData.map,
    RenderData.worldProgramInfo.attributes.vertexPosition
  );
  drawObject(
    gl,
    RenderData.map.faceCount,
    vec3.create(),
    vec3.fromValues(4.5, 4.5, 4.5),
    RenderData.worldProgramInfo
  );
}

function drawObjects(
  gl: WebGLRenderingContext,
  projectionMatrix: mat4,
  viewMatrix: mat4
) {
  gl.useProgram(RenderData.objectProgramInfo.program);
  gl.uniformMatrix4fv(
    RenderData.objectProgramInfo.uniforms.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    RenderData.objectProgramInfo.uniforms.viewMatrix,
    false,
    viewMatrix
  );

  bindObject(
    gl,
    RenderData.sphere,
    RenderData.objectProgramInfo.attributes.vertexPosition
  );

  // draw the target object
  gl.uniform3f(RenderData.objectProgramInfo.uniforms.color, 0.1, 0.1, 0.1);
  drawObject(
    gl,
    RenderData.sphere.faceCount,
    World.targetObject.position,
    sphereScale,
    RenderData.objectProgramInfo
  );

  // draw the building blocks
  gl.uniform3f(RenderData.objectProgramInfo.uniforms.color, 1, 1, 1);
  for (let object of World.buildingBlocks) {
    drawObject(
      gl,
      RenderData.sphere.faceCount,
      object.position,
      sphereScale,
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
  gl.drawElements(gl.TRIANGLES, faceCount, gl.UNSIGNED_SHORT, 0);
}
