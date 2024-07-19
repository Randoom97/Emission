export async function createProgram(
  gl: WebGLRenderingContext,
  vertPath: string,
  fragPath: string
) {
  const vertShader = <WebGLShader>(
    await loadShader(gl, gl.VERTEX_SHADER, vertPath)
  );
  const fragShader = <WebGLShader>(
    await loadShader(gl, gl.FRAGMENT_SHADER, fragPath)
  );

  const shaderProgram = <WebGLProgram>gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

async function loadShader(
  gl: WebGLRenderingContext,
  type: GLenum,
  path: string
) {
  let shaderSource = await fetch(path).then((data) => data.text());

  const shader = <WebGLShader>gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
