import { vec3 } from "gl-matrix";

export function raySphereIntersect(
  rayOrigin: vec3,
  rayDirection: vec3,
  sphereCenter: vec3,
  radius: number
) {
  const L = vec3.create();
  vec3.subtract(L, sphereCenter, rayOrigin);
  const tc = vec3.dot(L, rayDirection);

  if (tc < 0.0) return false;

  const Llength = vec3.length(L);
  const d = Math.sqrt(Llength * Llength - tc * tc);
  if (d > radius) return false;
  return true;
}

/** Returns a random number between 0 and max (inclusive) */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

export function shuffle<T>(list: T[]): void {
  for (let i = list.length - 1; i > 0; i--) {
    const j = getRandomInt(i);
    [list[i], list[j]] = [list[j], list[i]];
  }
}
