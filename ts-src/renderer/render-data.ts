import { GLObject, loadObject } from "./obj-loader";
import { createProgram } from "./shader-constructor";

export interface ProgramInfo {
  program: WebGLProgram;
  attributes: Record<string, GLint>;
  uniforms: Record<string, WebGLUniformLocation>;
}

export class RenderData {
  static map: GLObject;
  static sphere: GLObject;

  static objectProgramInfo: ProgramInfo;

  static async init(gl: WebGLRenderingContext) {
    // So we don't flashbang users while stuff is loading
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.map = await loadObject("./objects/EmissionRoom.obj", gl);
    this.sphere = await loadObject("./objects/sphere.obj", gl);

    const objectProgram = <WebGLProgram>(
      await createProgram(gl, "./shaders/object.vs", "./shaders/object.fs")
    );
    this.objectProgramInfo = {
      program: objectProgram,
      attributes: {
        vertexPosition: gl.getAttribLocation(objectProgram, "aVertexPosition"),
      },
      uniforms: {
        projectionMatrix: <WebGLUniformLocation>(
          gl.getUniformLocation(objectProgram, "uProjectionMatrix")
        ),
        modelViewMatrix: <WebGLUniformLocation>(
          gl.getUniformLocation(objectProgram, "uModelViewMatrix")
        ),
        transformMatrix: <WebGLUniformLocation>(
          gl.getUniformLocation(objectProgram, "transformMatrix")
        ),
        color: <WebGLUniformLocation>(
          gl.getUniformLocation(objectProgram, "color")
        ),
      },
    };
  }
}
