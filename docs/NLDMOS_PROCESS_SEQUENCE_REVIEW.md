# nLDMOS process sequence: bounded source review

## Finding

There is no single sequence implied by the device label “nLDMOS.” Two public patent disclosures illustrate materially different P-body/gate orderings. They are evidence that both orderings have been described, not evidence of how common either ordering is or of a current foundry recipe.

## Disclosed chronology

| Source slice | Sequence stated or illustrated | What the slice establishes | Limits and confidence |
| --- | --- | --- | --- |
| US 7,405,117 B2, process 600, Figs. 7A–7H and 8A–8C | In the Fig. 7A example, p-type substrate and HV n-well precede a non-self-aligned P-body implant (steps 602–608). The P-body implant/drive is shown before LDMOS gate oxide (step 610), then polysilicon, optional shallow N-LD, and n+/p+ implants (steps 614–616). The description says N-LD may be before or after gate formation. | This particular process-600 example puts P-body before gate formation and explicitly describes a p-type substrate with HV n-well. The two-implant P-body implementation discusses control of vertical depth, channel length, surface concentration/threshold, and lateral diffusion. | High confidence in the patent’s stated example and options. The process-600 slice does not describe an N+ buried layer or epitaxial layer; that is a bounded observation about this slice, not a claim that the patent, all Volterra processes, or nLDMOS generally exclude them. The patent also describes other process embodiments, including process 1200. No prevalence or present-day manufacturing claim follows. |
| EP 1 119 050 A1, Table 1 and [0051]–[0061] | Table 1 lists P− substrate, N+ and P+ buried layers, epi growth, P+ isolation, and N+ sinker steps before poly/gate steps. Step 49 patterns polysilicon gates. Then steps 50–53 mask, implant, and drive the DMOS P-body; [0054] states the implant is self-aligned to the poly gate. Step 54 is N− LDD; steps 58–59 are N+ source/drain and emitter; steps 62–63 are P+ source/drain and emitter, including a P+ DMOS body contact in the illustrated embodiment. | This BiCDMOS embodiment places the patterned gate before its self-aligned P-body implant and body drive. Its broader platform flow includes NBL, N− epi, P+ isolation, and N+ sinkers before gate formation. | High confidence in the named table and paragraphs. The patent expressly says at [0020] that listed steps can be eliminated, reversed, or combined in some embodiments. It presents embodiments, not a universal order, statistical prevalence, or a modern foundry process specification. |

### US process 600 details

The patent’s process-600 description says the substrate may be p-type or n-type, then identifies the Fig. 7A example as p-type substrate 502 with an HV n-well. It next describes a non-self-aligned P-body implant into the HV n-well (steps 602–608; Figs. 7A–7D). In one implementation, two P-body implants provide separate control over depth and lateral diffusion; the text associates the second implant with channel length and surface concentration/threshold voltage, then describes a drive/anneal that limits lateral diffusion (Figs. 8A–8C). Gate oxide is step 610, followed by polysilicon; n+ source/drain and p+ source/body-contact regions are described at step 616 (Figs. 7E–7H). The patent explicitly allows the shallow N-LD implant before or after gate formation (step 614).

The illustrated slice is therefore useful evidence against treating “P-body must follow gate” as an invariant. It does not establish that pre-gate P-body is a common industry flow. The prose’s discussion of implant profile and lateral diffusion is specific to this disclosed implementation and should not be converted into dose, energy, anneal, or geometry guidance for another process.

### EP 1 119 050 A1 details

Table 1 orders the platform modules: P− substrate; N+ buried layer implant/diffusion; P+ buried layer implant; epi growth; wells; P+ isolation implant/diffusion; N+ sinker; then gate oxidation, poly deposition, and poly mask. Paragraphs [0051]–[0054] make the local device chronology explicit: poly is deposited and patterned at step 49, the DMOS P-body mask is formed at step 50, and the P-body is implanted self-aligned to the poly gate at step 51 and driven at step 53. Paragraph [0055] places blanket N− LDD after body drive; [0058]–[0059] describe N+ S/D implantation; [0060]–[0061] describe P+ implantation, including the annular P+ body contact in the illustrated embodiment.

This flow does not mean every BCD platform requires all these modules or this ordering. Paragraph [0020] explicitly qualifies Table 1’s step numbering. Figure 25’s structure also illustrates an N− epi layer, buried layers, and P-type isolation sinkers; it is a structure embodiment, not proof that every sequence variant has identical isolation or body-contact topology.

## Interpretation for educational material

- Describe the sequence as a named, source-bounded example. Avoid wording such as “the standard nLDMOS flow.”
- If a diagram shows pre-gate P-body, identify it as US 7,405,117 B2 process 600 / Fig. 7 example. If it shows gate-first self-aligned P-body in an epi platform, identify EP 1 119 050 A1 Table 1 / [0051]–[0054] as the example.
- Show the P+ body tie and explain its electrical role when representing an nLDMOS cross-section. The patent examples vary in whether the P+ contact connects only to the P-body or also to an isolation sinker.
- Do not infer mask counts, implant conditions, thermal budgets, process compatibility, or production prevalence from these disclosures.
- These sources do not validate a particular interactive lab preset. A preset that places n+ source/drain before gate geometry needs its own explicit source or an “illustrative, one possible ordering” label and a visible P+ body tie.

## Source access and traceability

The source inventory, exact paragraph/page locators, access status, and physics-source limits are in [V1_2_SOURCE_EVIDENCE.md](V1_2_SOURCE_EVIDENCE.md). Machine-readable claim records are in [V1_2_CRITICAL_CLAIMS.json](V1_2_CRITICAL_CLAIMS.json).
