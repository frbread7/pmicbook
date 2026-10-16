# nLDMOS device physics: derivations, domains, and evidence

This is an original engineering derivation for the two **disclosed examples** in [the process-sequence review](NLDMOS_PROCESS_SEQUENCE_REVIEW.md). It is not a compact model, calibrated TCAD deck, or foundry rule. The public full texts used here are [del Alamo's p–n junction lecture 13, pp. 6–10](https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/e241bb54d370c62ff3d8089062ed74f5_lecture13.pdf), [Hower and Pendharkar, IRPS 2005, pp. 1–4](https://k5tra.net/tech%20library/LDMOS/LDMOS%20SOA%20Considerations.pdf), and [Infineon's gate-drive application note, pp. 8–16](https://www.infineon.com/assets/row/public/documents/24/42/infineon-gate-drive-for-power-mosfets-in-switchtin-applications-applicationnotes-en.pdf). Exact source status and technology scope are recorded in [the source register](V1_2_SOURCE_EVIDENCE.md). The derivations below follow electrostatics and continuity; they are not copied diagrams or reported device results.

## 1. State the structure before solving it

An n-channel lateral DMOS has an n+ source in a p-type body, an inversion channel under a gate, a lateral n-type drift path, an n+ drain path, and a p+ body contact. Drain voltage is supported across the body–drift junction and depleted drift region when the gate is off. Current in the on state travels through channel, accumulation/drift, contact and interconnect regions; the p+ body tie keeps the body potential controlled and shunts holes that could otherwise drive the source–body–drift parasitic npn. The substrate and vertical isolation determine additional parasitic paths. **Topology is not universal:** US7405117B2 process 600 uses a p substrate and HV n-well in the selected slice; EP1119050A1's shown BiCDMOS platform uses N+ buried layer, N− epitaxy and N+ sinker, and has P+ isolation modules elsewhere in the platform. Gate/body order differs. Neither patent is prevalence evidence.

For a specified geometry, the first coupled equations are

\[
\nabla\!\cdot(\epsilon\nabla\psi)=-q(p-n+N_D^+-N_A^-),\qquad
\nabla\!\cdot\mathbf J_n=q\,\partial n/\partial t-q(G-R),\qquad
\nabla\!\cdot\mathbf J_p=q(G-R)-q\,\partial p/\partial t.
\]

Here \(q>0\), \(\mathbf J_n\) and \(\mathbf J_p\) are **conventional** electron and hole current densities, and \(G-R\) is net electron–hole-pair generation in cm⁻³s⁻¹. Potential \(\psi\) is in V, permittivity \(\epsilon\) in F/cm, charge density in C/cm³, and current densities in A/cm² when lengths use cm. A sign check is a spatially uniform isolated region: if \(\nabla\cdot\mathbf J_n=\nabla\cdot\mathbf J_p=0\) and \(G>R\), both carrier densities rise at \(G-R\). Dopant symbols are **ionized/active** concentrations, not the implanted chemical-dose map. Transport closure (mobility, diffusion, high-field velocity), generation/recombination, impact-ionization and heat-flow laws must be selected separately. Contact bias, body/substrate ties, temperature and geometry are boundary conditions, not consequences of Poisson's equation. PMICBook's stage viewer solves none of these equations. The [pinned TCADBook equations and mesh chapters](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/equations.html) cover the general numerical framework; an LDMOS result also needs convergence and measurement checks.

## 2. Depletion and RESURF: useful scaling, not a breakdown formula

For an abrupt, uniformly doped **one-dimensional** p–n junction in depletion, charge neutrality gives \(N_Ax_p=N_Dx_n\), and integrating \(dE/dx=\rho/\epsilon_{Si}\) gives

\[
W=\sqrt{\frac{2\epsilon_{Si}(V_{bi}+V_R)}{q}\left(\frac1{N_A}+\frac1{N_D}\right)},
\quad |E_{max}|=\frac{qN_Dx_n}{\epsilon_{Si}}=\frac{qN_Ax_p}{\epsilon_{Si}},
\quad V_{bi}+V_R=\tfrac12|E_{max}|W.
\]

The last relation is the area of the triangular **1-D** field profile. For \(N_A\gg N_D\), most depletion width lies on the n side and \(W\simeq\sqrt{2\epsilon_{Si}(V_{bi}+V_R)/(qN_D)}\). Units check: \(\epsilon V/(qN)\) is cm². The result shows why lower drift charge helps voltage support; it does not set BV for a lateral device with gate, field oxide, curved junctions, and surface/interface charge. The actual field is two-dimensional and often has a local peak at a curvature or gate/field-plate edge. The [MIT full lecture](https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/e241bb54d370c62ff3d8089062ed74f5_lecture13.pdf) derives the 1-D relation on pp. 7–9.

For a uniform n-type slab of thickness \(t_n\), the positive **depleted sheet charge** is \(Q_n/A=qN_Dt_n\) C/cm². In a RESURF-like stack, negative charge in an adjacent p region can help deplete this slab and redistribute surface field; the useful condition depends on both regions' *integrated active charge*, vertical/lateral geometry, oxide charge and boundary potentials. It is **not** the universal equality \(N_Dt_n=N_At_p\), nor does satisfying an approximate charge balance prove complete depletion or a particular BV. Hower and Pendharkar discuss this charge-sharing mechanism for their lateral device on paper p. 2/Fig. 3. As an arithmetic check only, \(N_D=10^{16}\) cm⁻³ and \(t_n=0.5\) µm give \(N_Dt_n=5\times10^{11}\) cm⁻² and \(Q_n/A\simeq8.0\times10^{-8}\) C/cm². These are deliberately chosen numbers, not a reported process.

## 3. On resistance and its coupling to voltage rating

At small drain bias with a uniform undepleted rectangular n-drift slab, \(\sigma=q\mu_n n\) (S/cm), so

\[
R_{drift}=\frac{L_d}{q\mu_n n\,t_n W_{eff}};\qquad
R_{on}=R_{source/contact}+R_{ch}+R_{access}+R_{drift}+R_{drain/contact}+R_{metal}+\cdots.
\]

\(L_d,t_n,W_{eff}\) must all use the same length unit; \(q\mu n\) is S/cm. If one defines \(R_{on,sp}=R_{on}A_{footprint}\), its units are Ω·cm²; it must name the footprint convention and measurement bias/temperature. The drift formula is a **fixed-mobility uniform-slab screen**. Accumulation under the gate/field plate, depleted cross-section, nonuniform doping, lateral current spreading, effective cell width, mobility versus field/concentration/temperature, self-heating, silicide, vias and package all break a direct mapping to silicon BV. A wider/longer depleted region can support more voltage yet add series resistance and gate/drain charge. A process design therefore optimizes a measured or simulated Pareto surface, not a universal \(R_{on,sp}\propto BV^m\) law for every lateral architecture.

## 4. Avalanche, leakage, and safe operating area

Off-state drain leakage can include reverse-junction generation, surface/interface paths, field-enhanced mechanisms, drain/body/substrate parasitics and package contamination. A terminal leakage measurement alone does not identify which term dominates. With large field, carriers can create electron–hole pairs by impact ionization. A common **local-field** model evaluates \(\alpha_n(E)\) and \(\alpha_p(E)\) and integrates multiplication along a path, but a one-dimensional criterion such as \(\int\alpha(E)\,dx\sim1\) is a heuristic unless carrier trajectories, energy relaxation, boundary conditions and coupled generation are specified. A measured BV also depends on gate/source/body/substrate bias, current criterion, pulse duration and temperature. The [pinned TCADBook high-field chapter](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/highfield.html) distinguishes avalanche postprocessing from coupled generation and warns about local-field limits; it is foundational, not calibrated LDMOS evidence.

Impact-generated holes flowing through finite body resistance can raise local body potential. If the source/body junction forward-biases enough, the parasitic npn may conduct and snap back; a low-resistance p+ body tie reduces, but does not mathematically eliminate, this route. Electrical SOA then differs from thermally limited SOA. For heating, the screening relation \(\Delta T_j(t)\simeq P(t)Z_{th}(t)\) applies only to a defined power pulse and thermal boundary, with \(Z_{th}\) in K/W; a constant \(R_{th}\) is a steady-state limit under specified conditions. Device current and dissipation depend on temperature, so electrothermal instability requires coupled analysis. Hower and Pendharkar report distinct electrical and thermal SOA mechanisms, and their Fig. 8's extracted critical temperatures are **for two investigated designs**, not a universal failure threshold. See paper pp. 2–4.

## 5. Charge and switching in a PMIC circuit

Gate charge is \(Q_G=\int i_Gdt\), and the Miller interval is associated with gate–drain charge \(Q_{GD}\) as \(V_{DS}\) changes. The crude switching-overlap estimate \(E_{sw}\sim\tfrac12V_{bus}I_D(t_r+t_f)\) assumes approximately linear voltage/current overlap, ignores reverse recovery and ringing, and must not be presented as an LDMOS material constant. Charge curves depend on drain bias and operating point because capacitances are nonlinear; \(P_{gate}\simeq Q_GV_{drive}f_s\) is driver-supply energy under a specified swing/frequency, not all transistor switching loss. The [full Infineon note](https://www.infineon.com/assets/row/public/documents/24/42/infineon-gate-drive-for-power-mosfets-in-switchtin-applications-applicationnotes-en.pdf), pp. 9–16, supports these generic MOS gate-drive relationships and explicitly displays changing \(Q_{GD}\). Its illustrated devices are not proof of a PMIC nLDMOS's charge values. Package/loop inductance, dead time, body-diode conduction and protection clamp operation require a **circuit** model and measured waveforms.

## 6. What would validate a particular technology

| Claim to test | Minimum matched conditions and observation | Why an image alone is insufficient |
| --- | --- | --- |
| Body/drift profile and channel edge | Process traveler or cross-section plus calibrated SIMS/SCM/spreading-resistance where suitable, electrical \(V_{th}\) and lateral geometry; record every later heat step. | An implant mask or SEM shape is not the final active dopant contour. |
| BV and leakage mechanism | Same gate/source/body/substrate biases, current criterion, temperature, dwell/pulse history; separate body/substrate currents and surface leakage where accessible. | A breakdown number and a defect image do not identify avalanche versus surface/parasitic paths. |
| \(R_{on,sp}\), current crowding and self-heating | Small-\(V_{DS}\) transfer/output curves at stated \(V_{GS}\), temperature, cell/footprint definition and pulse width; Kelvin/contact separation and transient thermal data. | A plan-view width or voltage-contrast spot does not partition channel, drift, contacts and metal losses. |
| SOA and switching | Pulsed \(I_D,V_{DS},V_{GS}\) at controlled temperature and gate drive, protection thresholds, bus/loop impedance, duty cycle and recovery history. | A single hot spot, nanoprobe reading or epi-defect observation localizes evidence but cannot prove causal order without controls and corroboration. |

These are investigation requirements, not a promise that any one measurement will uniquely identify mechanism. PMICBook's [WAT and characterization](../chapters/metrology.html), [reliability](../chapters/reliability.html), and [failure-analysis](../chapters/failure-analysis.html) chapters separate measurement, stress, localization and causal confirmation. Inaccessible foundry process/design data are listed in [the research inbox](PMIC_RESEARCH_INBOX.md).
