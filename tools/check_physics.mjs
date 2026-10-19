#!/usr/bin/env node
// Local scientific regression checks for illustrative PMICBook process models.
// Executable code: MIT; see ../LICENSE-MIT. No external packages or hosted CI.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = { window: {}, document: { documentElement: { lang: 'en' }, querySelectorAll: () => [] } };
runInNewContext(readFileSync(new URL('../js/xsec.js', import.meta.url), 'utf8'), context);
runInNewContext(readFileSync(new URL('../js/ldmos-sequence.js', import.meta.url), 'utf8'), context);
const XS = context.window.XS;
const LD = context.window.PMICLDMOS;
const incidentDose = 1e14;

function doseInMap(sim, species, energy) {
  const concentration = XS.range(species, energy).type === 'n' ? sim.nd : sim.na;
  let sum = 0;
  for (const value of concentration) sum += value;
  return sum * sim.dx * 1e-7 / sim.W;
}

let implantCases = 0;
for (const species of ['B', 'P', 'As', 'BF2']) {
  for (const energy of [1, 30, 200]) {
    for (const channel of [0, 0.3]) {
      for (const tilt of [0, 30]) {
        // 10 nm is intentionally coarse for 1 keV implants; the deep slab
        // also separates finite-window loss from numerical integration error.
        const sim = new XS.Sim({ W: 16, H: 500, dx: 10, surf: 10 });
        sim.implant({ species, E: energy, dose: incidentDose, channel, tilt });
        const ratio = doseInMap(sim, species, energy) / incidentDose;
        assert.ok(Math.abs(ratio - 1) < 0.005,
          `${species} ${energy} keV, channel=${channel}, tilt=${tilt}: dose ratio ${ratio}`);
        implantCases++;
      }
    }
  }
}

// An oxide screen may retain incident dose; it must not create silicon dose.
const screened = new XS.Sim({ W: 16, H: 100, dx: 10, surf: 10 });
screened.rect('ox', 0, 160, -40, 0);
screened.implant({ species: 'As', E: 1, dose: incidentDose, channel: 0, tilt: 0 });
let siliconDose = 0;
for (let y = screened.surf; y < screened.H; y++) {
  for (let x = 0; x < screened.W; x++) siliconDose += screened.nd[y * screened.W + x];
}
siliconDose *= screened.dx * 1e-7 / screened.W;
assert.ok(siliconDose >= 0 && siliconDose < incidentDose * 0.01,
  `screened 1 keV As silicon dose ${siliconDose}`);

let diffusionCases = 0;
for (const dx of [2, 10]) {
  for (const species of ['B', 'BF2', 'As']) {
    const energy = species === 'As' ? 30 : 1;
    const sim = new XS.Sim({ W: 8, H: 300, dx, surf: 10 });
    sim.implant({ species, E: energy, dose: incidentDose, channel: 0, tilt: 0 });
    const before = doseInMap(sim, species, energy);
    sim.diffuse({ T: species === 'As' ? 1200 : 1100, time: species === 'As' ? 60 : 10 });
    const after = doseInMap(sim, species, energy);
    const concentration = XS.range(species, energy).type === 'n' ? sim.nd : sim.na;
    assert.ok(Math.abs(after / before - 1) < 1e-5,
      `${species} ${dx} nm diffusion mass ratio ${after / before}`);
    assert.ok(concentration.every(value => value >= 0), `${species} produced negative concentration`);
    diffusionCases++;
  }
}

// A uniform slab is stationary under a no-flux diffusion operator.
const uniform = new XS.Sim({ W: 8, H: 160, dx: 2, surf: 10 });
for (let i = uniform.surf * uniform.W; i < uniform.na.length; i++) uniform.na[i] = 1e16;
uniform.diffuse({ T: 1100, time: 10 });
for (let i = uniform.surf * uniform.W; i < uniform.na.length; i++) {
  assert.ok(Math.abs(uniform.na[i] / 1e16 - 1) < 1e-6, 'uniform slab changed under no-flux diffusion');
}

// A full oxide or empty-cell barrier disconnects semiconductor regions.
// The Gaussian tail must not jump across a masked cell even when both endpoints are silicon.
for (const barrier of [XS.ID.ox, 0]) {
  const vertical = new XS.Sim({ W: 8, H: 80, dx: 10, surf: 10 });
  for (let x = 0; x < vertical.W; x++) {
    vertical.mat[20 * vertical.W + x] = barrier;
    vertical.nd[19 * vertical.W + x] = 1e18;
  }
  const initial = vertical.nd.reduce((sum, value) => sum + value, 0);
  vertical.diffuse({ T: 1100, time: 10 });
  let upper = 0, lower = 0;
  for (let y = vertical.surf; y < vertical.H; y++) {
    for (let x = 0; x < vertical.W; x++) {
      const value = vertical.nd[y * vertical.W + x];
      if (y < 20) upper += value;
      if (y > 20) lower += value;
    }
  }
  assert.equal(lower, 0, `donors crossed ${barrier ? 'oxide' : 'void'} row`);
  assert.ok(Math.abs(upper / initial - 1) < 1e-6, 'barrier changed donor mass');
}

// Two oxide columns separate a periodic row into two components, including the wrap edge.
const separated = new XS.Sim({ W: 12, H: 80, dx: 10, surf: 10 });
for (let y = separated.surf; y < separated.H; y++) {
  separated.mat[y * separated.W] = XS.ID.ox;
  separated.mat[y * separated.W + 6] = XS.ID.ox;
  separated.na[y * separated.W + 1] = 1e18;
}
const initialAcceptor = separated.na.reduce((sum, value) => sum + value, 0);
separated.diffuse({ T: 1100, time: 10 });
let left = 0, right = 0;
for (let y = separated.surf; y < separated.H; y++) {
  for (let x = 1; x < 6; x++) left += separated.na[y * separated.W + x];
  for (let x = 7; x < separated.W; x++) right += separated.na[y * separated.W + x];
}
assert.equal(right, 0, 'acceptors crossed periodic oxide columns');
assert.ok(Math.abs(left / initialAcceptor - 1) < 1e-6, 'oxide columns changed acceptor mass');

// An interior delta should spread with variance approximately 2Dt when resolved.
const impulse = new XS.Sim({ W: 8, H: 160, dx: 2, surf: 10 });
for (let x = 0; x < impulse.W; x++) impulse.na[80 * impulse.W + x] = 1e18;
impulse.diffuse({ T: 1100, time: 10 });
let mass = 0, secondMoment = 0;
for (let y = impulse.surf; y < impulse.H; y++) {
  const value = impulse.na[y * impulse.W];
  mass += value;
  secondMoment += value * ((y - 80) * impulse.dx) ** 2;
}
const expectedVariance = 2 * XS.diffusivity('B', 1100) * 10 * 1e14; // cm² to nm²
assert.ok(Math.abs(secondMoment / mass / expectedVariance - 1) < 0.05,
  `interior variance ${(secondMoment / mass).toFixed(3)} vs ${expectedVariance.toFixed(3)} nm²`);

// Direct implant patches must stop at the existing gate or spacer; a later
// formed junction may laterally extend beneath the gate.
const early = LD.stages.find(stage => stage.key === 'junctionImplant');
const aligned = LD.gateAlignedStages.find(stage => stage.key === 'epiSourceImplant');
const blanket = LD.gateAlignedStages.find(stage => stage.key === 'blanketLdd');
const earlySvg = LD.drawing(early, 'en', 7);
const alignedSvg = LD.drawing(aligned, 'en', 11);
const blanketSvg = LD.drawing(blanket, 'en', 10);
assert.match(earlySvg, /x="280" y="91" width="47"/); // end x327 = spacer edge
assert.match(alignedSvg, /x="280" y="91" width="60"/); // end x340 = gate edge
for (const [x, width] of [[95, 245], [469, 21], [607, 103]]) {
  assert.match(blanketSvg, new RegExp(`x="${x}" y="91" width="${width}"`));
}

// Conventional-current continuity gives both carrier densities the same
// positive generation rate in a homogeneous isolated region.
const physics = readFileSync(new URL('../docs/NLDMOS_DEVICE_PHYSICS.md', import.meta.url), 'utf8');
assert.ok(physics.includes('\\nabla\\!\\cdot\\mathbf J_n=q\\,\\partial n/\\partial t-q(G-R)'));
assert.ok(physics.includes('\\nabla\\!\\cdot\\mathbf J_p=q(G-R)-q\\,\\partial p/\\partial t'));
const generation = 7, recombination = 2, electronCurrentDivergence = 0, holeCurrentDivergence = 0;
const dnDt = electronCurrentDivergence + generation - recombination;
const dpDt = generation - recombination - holeCurrentDivergence;
assert.equal(dnDt, 5);
assert.equal(dpDt, 5);

console.log(`Physics checks passed: ${implantCases} implant doses, ${diffusionCases} diffusion masses, no-flux uniformity/variance, oxide/void barriers, staged geometry, continuity signs.`);
