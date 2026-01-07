/**
 * CHE·NU™ — AdvancedShaders Stub
 */
export const shaderLibrary = {
  pbr: { vertex: '', fragment: '' },
  toon: { vertex: '', fragment: '' },
  glass: { vertex: '', fragment: '' },
};
export const compileShader = (name: keyof typeof shaderLibrary) => shaderLibrary[name];
