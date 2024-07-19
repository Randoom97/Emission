import { vec3 } from "gl-matrix";
import { GLObject } from "./obj-loader";

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: GLint;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    transformMatrix: WebGLUniformLocation;
    color: WebGLUniformLocation;
  };
}

export interface SceneObject {
  glObject: GLObject;
  position: vec3;
  scale: vec3;
  color: vec3;
}

export interface Scene {
  world: SceneObject;
  objects: SceneObject[];
}
