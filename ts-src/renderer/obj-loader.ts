export interface GLObject {
  vertices: WebGLBuffer;
  faces: WebGLBuffer;
  vertexCount: number;
  faceCount: number;
}

export async function loadObject(
  path: string,
  gl: WebGLRenderingContext
): Promise<GLObject> {
  const objSource = await fetch(path).then((data) => data.text());
  const objLines = objSource.split("\n");

  const vertices = [];
  const faces = [];

  // parse the file
  for (const line of objLines) {
    if (line.startsWith("v ")) {
      vertices.push(
        ...line
          .substring(1)
          .trim()
          .split(" ")
          .map((value) => parseFloat(value))
      );
      continue;
    }
    if (line.startsWith("f ")) {
      const face = line
        .substring(1)
        .trim()
        .split(" ")
        .map((value) => {
          const idxFirstSlash = value.indexOf("/");
          if (idxFirstSlash > 0) {
            return parseInt(value.substring(0, idxFirstSlash));
          }
          return parseInt(value);
        })
        .map((index) => index - 1);
      if (face.length === 3) {
        faces.push(...face);
      } else if (face.length === 4) {
        // incase it uses quads
        faces.push(...[face[0], face[1], face[2], face[2], face[3], face[0]]);
      } else {
        console.log(faces.length);
      }
      continue;
    }
  }

  // load into glbuffers
  const vertexBuffer = <WebGLBuffer>gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const faceBuffer = <WebGLBuffer>gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(faces),
    gl.STATIC_DRAW
  );

  return {
    vertices: vertexBuffer,
    faces: faceBuffer,
    vertexCount: vertices.length,
    faceCount: faces.length,
  };
}
