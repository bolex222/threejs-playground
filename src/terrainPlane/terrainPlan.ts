import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

export default class TerrainPlane {
  planMesh: Mesh;

  constructor(size: number, gridScale: number = 1) {
    const planeGeometry = new PlaneGeometry(size, size);
    const mat = new ShaderMaterial({
      vertexShader: `
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    vUv = uv;
}
      `,
      fragmentShader: `
uniform float u_size;
uniform float u_gridFactor;
varying vec2 vUv;

void main() {

    vec2 ov = vUv;
    ov = fract(ov * (u_size / u_gridFactor));

    vec2 fogS = vUv;
    fogS -= 0.5; 
    fogS *= 10.;
    fogS += 0.5;
    float fog = distance(fogS, vec2(0.5));

    float line_size = 0.01 + (0.1 * fog);

    float grid = (1. - step(line_size, ov.x) * step(line_size, ov.y)) + (1. - step(ov.x, 1.-line_size) * step(ov.y, 1.-line_size)); 
    grid = clamp(grid, 0., 1.);
    // vec3 color = vec3(0.827,0.827,0.827); 
    vec3 color = vec3(0.427,0.416,0.459); 



    gl_FragColor = vec4(grid * color , grid * (1. - fog));
}
      `,
      transparent: true,
      uniforms: {
        u_size: {
          value: size,
        },
        u_gridFactor: {
          value: gridScale,
        },
      },
    });
    mat.side = DoubleSide;
    this.planMesh = new Mesh(planeGeometry, mat);
    this.planMesh.rotation.set(-1.5708, 0, 0);
  }
}
