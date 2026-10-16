/* PMICBook original educational sequence. Executable code: MIT; explanatory text and
   schematic geometry: CC BY 4.0. See LICENSE.md. No calibrated process/TCAD data. */
(function () {
  "use strict";

  // A bounded reading of US7405117B2, process 600 / Figs. 5A and 7A–7H.
  // The last contact stage is an electrical-connection inference, not a patent step.
  var stages = [
    { key: "substrate", flags: [], mask: "none", thermal: "starting material" },
    { key: "well", flags: ["well"], mask: "HV n-well", thermal: "well formation; profile unspecified here" },
    { key: "bodyImplant", flags: ["well", "bodyImplant"], mask: "P-body opening", thermal: "as-implanted profile; inactive fraction unknown" },
    { key: "bodyDrive", flags: ["well", "body"], mask: "mask removed", thermal: "P-body drive/RTA; lateral diffusion matters" },
    { key: "oxide", flags: ["well", "body", "oxide"], mask: "gate dielectric definition", thermal: "later heat can move the earlier body edge" },
    { key: "gate", flags: ["well", "body", "oxide", "gate"], mask: "polysilicon gate pattern", thermal: "body-to-gate placement fixes channel overlap" },
    { key: "drainExtension", flags: ["well", "body", "oxide", "gate", "drainExtension"], mask: "N-LD drain opening", thermal: "implant shown before final junction activation" },
    { key: "junctionImplant", flags: ["well", "body", "oxide", "gate", "drainExtension", "spacers", "junctionImplant"], mask: "n+ source/drain and p+ body contact", thermal: "new junction implants; active fraction unknown" },
    { key: "junctionDrive", flags: ["well", "body", "oxide", "gate", "drain", "spacers", "junctions"], mask: "masks removed", thermal: "activation/redistribution; final profiles need measurement" },
    { key: "contacts", flags: ["well", "body", "oxide", "gate", "drain", "spacers", "junctions", "contacts"], mask: "contact openings and interconnect", thermal: "contact resistance and thermal budget remain platform specific" }
  ];
  // EP1119050A1 Table 1 and [0025]–[0038], [0051]–[0061], DMOS region A.
  // Shared-platform modules are condensed; this is not a literal mask traveler.
  var gateAlignedRows = [
    { key: "epiSubstrate", add: [], mask: "starting p substrate", maskKo: "시작 p형 기판", thermal: "starting material", thermalKo: "시작 재료" },
    { key: "nblImplant", add: ["nblImplant"], mask: "N+ buried-layer opening", maskKo: "N+ 매몰층 개구", thermal: "as-implanted N+ footprint", thermalKo: "주입 직후 N+ 영역" },
    { key: "nblDrive", remove: ["nblImplant"], add: ["nbl"], mask: "buried-layer mask removed", maskKo: "매몰층 마스크 제거", thermal: "N+ buried-layer drive", thermalKo: "N+ 매몰층 확산" },
    { key: "epi", add: ["epi"], mask: "epi growth; no new implant mask", maskKo: "에피 성장; 새 주입 마스크 없음", thermal: "N− epi; buried profile moves during growth", thermalKo: "N− 에피; 성장 중 매몰 분포 변화" },
    { key: "sinker", add: ["sinker"], mask: "N+ sinker opening", maskKo: "N+ 싱커 개구", thermal: "sinker diffusion toward buried layer", thermalKo: "매몰층 방향 싱커 확산" },
    { key: "epiField", add: ["fieldOxide"], mask: "active/field definition", maskKo: "활성/필드 영역 정의", thermal: "field oxide and implants; isolation modules elsewhere", thermalKo: "필드 산화막·주입; 절연 모듈은 다른 영역에도 적용" },
    { key: "epiOxide", add: ["oxide"], mask: "gate dielectric formation", maskKo: "게이트 절연막 형성", thermal: "oxide/interface state after earlier thermal cycles", thermalKo: "선행 열 이력 후 산화막·계면 상태" },
    { key: "epiGate", add: ["gate"], mask: "patterned polysilicon gate", maskKo: "패턴된 폴리실리콘 게이트", thermal: "gate edge exists before P-body implant", thermalKo: "P바디 주입 전에 게이트 경계 존재" },
    { key: "alignedBodyImplant", add: ["bodyImplant"], mask: "P-body opening plus gate edge", maskKo: "P바디 개구와 게이트 경계", thermal: "self-aligned implanted footprint, not active channel", thermalKo: "게이트 정렬 주입 분포; 활성 채널 아님" },
    { key: "alignedBodyDrive", remove: ["bodyImplant"], add: ["body"], mask: "body mask removed", maskKo: "바디 마스크 제거", thermal: "P-body vertical and lateral diffusion", thermalKo: "P바디 수직·측방 확산" },
    { key: "blanketLdd", add: ["drainExtension"], mask: "blanket N− LDD; gate/field oxide screen", maskKo: "전면 N− LDD; 게이트·필드 산화막 차폐", thermal: "new low-dose region; final active contour unknown", thermalKo: "저도즈 영역; 최종 활성 경계 미상" },
    { key: "epiSourceImplant", add: ["sourceImplant"], mask: "N+ source / sinker opening", maskKo: "N+ 소스·싱커 개구", thermal: "N+ source implant in P-body", thermalKo: "P바디 내 N+ 소스 주입" },
    { key: "epiBodyContact", add: ["bodyContactImplant"], mask: "P+ body-contact opening", maskKo: "P+ 바디 접점 개구", thermal: "P+ implant follows N+ module", thermalKo: "N+ 모듈 뒤 P+ 주입" },
    { key: "epiJunctions", remove: ["sourceImplant", "bodyContactImplant", "drainExtension"], add: ["junctions", "drain"], mask: "contact-region masks removed", maskKo: "접점 영역 마스크 제거", thermal: "schematic post-implant profiles; activation not quantified", thermalKo: "주입 후 개념 분포; 활성화 미정량" },
    { key: "epiContacts", add: ["contacts"], mask: "contact openings and interconnect", maskKo: "콘택트 개구와 배선", thermal: "terminal sketch beyond implant sequence", thermalKo: "주입 순서 이후의 단자 개념도" }
  ];
  var gateAlignedStages = [], gateFlags = [];
  gateAlignedRows.forEach(function (row) {
    (row.remove || []).forEach(function (flag) { gateFlags = gateFlags.filter(function (item) { return item !== flag; }); });
    gateFlags = gateFlags.concat(row.add);
    gateAlignedStages.push({ key: row.key, flags: gateFlags.slice(), mask: row.mask, maskKo: row.maskKo, thermal: row.thermal, thermalKo: row.thermalKo });
  });
  var words = {
    en: {
      prev: "Previous stage", next: "Next stage", stage: "Stage", mask: "Mask / alignment", thermal: "Profile / thermal state",
      choose: "Documented sequence", early: "P-body before gate · US7405117B2 process 600", aligned: "Gate-aligned P-body · EP1119050A1",
      substrate: ["P-type substrate", "Start with the p-type substrate of the selected disclosed HV n-well example. No NBL, epitaxial layer, gate, or source/drain is shown at this stage."],
      well: ["HV n-well", "A masked n-type high-voltage well establishes the host region. This source's example does not prescribe a buried layer, epitaxy, or a universal isolation module."],
      bodyImplant: ["P-body implant before the gate", "A separate opening admits p-type body implants into the HV n-well. The dashed region is an as-implanted distribution, not an electrically proven channel."],
      bodyDrive: ["Body drive and lateral diffusion", "The disclosed drive/RTA redistributes the P-body before gate oxide. Depth beneath the source affects source-to-substrate punch-through; lateral edge and surface concentration affect channel length and threshold."],
      oxide: ["Gate dielectric", "Gate oxide is formed after this example's P-body drive. Oxide choice and later heat can change interface charge and the final body profile; neither is solved by this drawing."],
      gate: ["Defined polysilicon gate", "Only now is the gate drawn. Its placement relative to the previously masked/diffused body edge sets the channel overlap; mask misregistration is a real design variable."],
      drainExtension: ["Shallow n-type drain extension", "One disclosed option places N-LD after gate definition. The gate/body/drain mask spacing affects field distribution and series resistance; the patent also permits a pre-gate N-LD option."],
      junctionImplant: ["Spacers and contact-region implants", "The illustrated CMOS-compatible module uses spacers and masked n+ source/drain plus p+ body contact implants. Dashed implants are not yet a measured active junction profile."],
      junctionDrive: ["Activated junctions", "Later heat activates and redistributes the junctions. Source is n+ in p-body, drain is n+ in the n-type drain path, and p+ permits a low-resistance body tie. No dose, junction depth, or BV is predicted."],
      contacts: ["Terminal connections", "Schematic contacts connect n+ source and p+ body together, gate separately, and n+ drain separately. The contact/interconnect sketch is an educational completion beyond the patent's stated implant sequence."],
      epiSubstrate: ["P-type starting substrate", "This second disclosure starts with a p substrate. The N+ buried layer and N− epitaxy are not yet present; this is a different architecture from the HV n-well example."],
      nblImplant: ["N+ buried-layer implant", "A separate opening admits N+ dopant at the substrate surface. The dashed region is an implant footprint, not a completed buried conductor."],
      nblDrive: ["Buried-layer drive", "The disclosed N+ drive changes the chemical profile before epitaxial growth. Later growth and heat redistribute it again; its electrical resistance cannot be inferred from color."],
      epi: ["N− epitaxial layer", "N− epitaxy is grown over the p substrate and earlier N+ buried layer. This layer provides the lateral DMOS drift material in the shown region, unlike the first example's implanted HV n-well."],
      sinker: ["N+ sinker to buried layer", "The DMOS region receives an N+ sinker that reaches toward its N+ buried layer. This supports a drain path in the disclosed structure; other shared-platform isolation modules are not shown inside this cropped cell."],
      epiField: ["Field definition", "The platform defines active and field regions and grows field oxide before its gate. P+ isolation is a platform module for selected regions, not a proven ring around this particular cropped DMOS cell."],
      epiOxide: ["Gate dielectric", "The gate dielectric is formed after the earlier buried, epi, sinker, and field modules. Oxide/interface state is affected by the accumulated thermal history."],
      epiGate: ["Patterned polysilicon gate", "EP1119050A1 [0052] explicitly etches and defines the DMOS poly gate before the P-body implant. Poly deposition alone would not establish the alignment edge."],
      alignedBodyImplant: ["Gate-aligned P-body implant", "A P-body mask exposes the gate and adjacent silicon; the patterned gate edge self-aligns the dashed implanted body boundary. It does not fix the final electrical channel length."],
      alignedBodyDrive: ["P-body drive after gate", "The disclosed body drive moves dopant vertically and laterally under the defined gate. Gate alignment removes one overlay dependency, while diffusion and surface concentration still affect threshold and overlap."],
      blanketLdd: ["Blanket N− LDD implant", "The later N− implant has no separate LDD mask in this disclosure: the patterned gate and field oxide screen the exposed surface. Dashed patches show exposed source- and drain-side portions within this cropped cell, not implant beneath the field oxide or solved RESURF charge."],
      epiSourceImplant: ["N+ source and sinker implant", "A masked N+ step forms a source inside the P-body and increases doping at the sinker contact path. The P+ body tie has not been implanted yet."],
      epiBodyContact: ["P+ body-contact implant", "A later, separate P+ step makes the body-contact region. The source/body electrical short is made only after contacts and interconnect; this sketch does not imply simultaneous N+ and P+ implants."],
      epiJunctions: ["Post-implant terminal regions", "The drawing now shows n+ source, p+ body contact, and drain-side sinker contact as formed regions. Their active profiles, silicide, and contact resistance require process-specific evidence."],
      epiContacts: ["Terminal connections", "This educational completion ties n+ source to p+ body, connects gate separately, and reaches the drain through N+ sinker/buried layer. Exact metal/contact layout is not supplied by the implant steps."],
      region: "P substrate · HV n-well · P-body · N-LD · n+ source/drain · p+ body tie",
      implanted: "Dashed = implant footprint; solid = formed/activated region (schematic)",
      visual: "Schematic nLDMOS cross-section at stage ",
      noValues: "Not to scale. No electric field, charge, activation fraction, breakdown voltage, or on-resistance is calculated."
    },
    ko: {
      prev: "이전 단계", next: "다음 단계", stage: "단계", mask: "마스크 / 정렬", thermal: "도핑 분포 / 열 이력",
      choose: "공개된 공정 순서", early: "게이트 전 P바디 · US7405117B2 공정 600", aligned: "게이트 정렬 P바디 · EP1119050A1",
      masks: ["없음", "고전압 n웰", "p바디 개구", "마스크 제거", "게이트 절연막 형성", "폴리실리콘 게이트 패턴", "N-LD 드레인 개구", "n+ 소스/드레인 및 p+ 바디 접점", "마스크 제거", "콘택트 개구와 배선"],
      thermals: ["시작 기판", "웰 형성; 여기서는 분포 미지정", "주입 직후 분포; 비활성 비율 미상", "p바디 확산/RTA; 측방 이동 중요", "후속 열처리로 바디 경계 이동 가능", "바디-게이트 위치가 채널 겹침 결정", "최종 접합 활성화 전 주입", "새 접합 주입; 활성 비율 미상", "활성화/재분포; 최종 분포 측정 필요", "콘택트 저항과 열 이력은 공정별로 다름"],
      substrate: ["p형 기판", "선택한 공개 고전압 n웰 예시의 p형 기판에서 시작합니다. 이 단계에는 매몰 n층, 에피층, 게이트, 소스·드레인을 그리지 않습니다."],
      well: ["고전압 n웰", "마스크로 형성한 n형 고전압 웰이 소자 영역을 마련합니다. 이 자료의 예시는 매몰층, 에피 성장, 보편적인 절연 모듈을 규정하지 않습니다."],
      bodyImplant: ["게이트 전 p바디 주입", "별도 개구를 통해 고전압 n웰에 p형 바디를 주입합니다. 점선 영역은 주입 직후 분포이며 전기적으로 검증된 채널이 아닙니다."],
      bodyDrive: ["바디 확산과 측방 이동", "공개된 확산/RTA 단계는 게이트 산화막 전에 p바디를 재분포시킵니다. 소스 아래 깊이는 소스-기판 펀치스루에, 측방 가장자리와 표면 농도는 채널 길이와 문턱 전압에 영향을 줍니다."],
      oxide: ["게이트 절연막", "이 예시는 p바디 확산 후 게이트 산화막을 형성합니다. 산화막 선택과 후속 열처리는 계면 전하와 최종 바디 분포를 바꿀 수 있으나 이 그림은 이를 계산하지 않습니다."],
      gate: ["패턴된 폴리실리콘 게이트", "이 단계에서 처음으로 게이트를 그립니다. 먼저 마스킹·확산한 바디 가장자리와 게이트의 상대 위치가 채널 겹침을 정하며 마스크 정렬 오차도 설계 변수입니다."],
      drainExtension: ["얕은 n형 드레인 확장부", "공개된 한 선택지는 게이트 패턴 후 N-LD를 형성합니다. 게이트·바디·드레인 마스크 간격은 전계와 직렬 저항에 영향을 줍니다. 이 특허는 게이트 전 N-LD 선택지도 허용합니다."],
      junctionImplant: ["스페이서와 접점 영역 주입", "표시한 CMOS 호환 모듈은 스페이서와 마스킹한 n+ 소스·드레인 및 p+ 바디 접점 주입을 이용합니다. 점선 주입 영역은 아직 측정된 활성 접합 분포가 아닙니다."],
      junctionDrive: ["활성화된 접합", "후속 열처리로 접합을 활성화하고 재분포시킵니다. 소스는 p바디 안의 n+, 드레인은 n형 드레인 경로의 n+, p+는 저항이 낮은 바디 연결을 돕습니다. 도즈·접합 깊이·항복 전압을 예측하지 않습니다."],
      contacts: ["단자 연결", "개념적 콘택트는 n+ 소스와 p+ 바디를 함께, 게이트와 n+ 드레인을 각각 별도로 연결합니다. 콘택트·배선 그림은 특허에 명시된 주입 순서를 넘어서는 교육용 마무리입니다."],
      epiSubstrate: ["시작 p형 기판", "두 번째 공개 예시는 p형 기판에서 시작합니다. 아직 N+ 매몰층과 N− 에피층이 없으며 앞의 고전압 n웰 예시와 다른 구조입니다."],
      nblImplant: ["N+ 매몰층 주입", "별도 개구로 기판 표면에 N+ 도펀트를 주입합니다. 점선은 주입 범위이지 완성된 매몰 전도층이 아닙니다."],
      nblDrive: ["매몰층 확산", "공개된 N+ 확산으로 에피 성장 전에 화학적 분포가 바뀝니다. 후속 성장과 열처리가 다시 분포를 바꾸므로 색만으로 전기적 저항을 알 수 없습니다."],
      epi: ["N− 에피층", "기존 N+ 매몰층과 p형 기판 위에 N− 에피층을 성장시킵니다. 표시한 DMOS 영역에서는 이 층이 횡방향 드리프트 재료이며 첫 예시의 주입된 고전압 n웰과 다릅니다."],
      sinker: ["매몰층에 닿는 N+ 싱커", "DMOS 영역에 N+ 싱커를 형성하여 N+ 매몰층 방향의 드레인 경로를 마련합니다. 공유 플랫폼의 다른 절연 모듈은 잘라낸 이 셀 안에 표시하지 않습니다."],
      epiField: ["필드 영역 정의", "플랫폼은 활성·필드 영역을 정의하고 게이트 전에 필드 산화막을 형성합니다. P+ 절연은 선택 영역용 플랫폼 모듈이며 잘라낸 DMOS 셀 주위의 확인된 고리가 아닙니다."],
      epiOxide: ["게이트 절연막", "매몰층·에피·싱커·필드 모듈 뒤에 게이트 절연막을 형성합니다. 산화막과 계면 상태는 누적 열 이력의 영향을 받습니다."],
      epiGate: ["패턴된 폴리실리콘 게이트", "EP1119050A1 [0052]는 P바디 주입 전에 DMOS 폴리 게이트를 실제로 식각·정의합니다. 폴리 증착만으로 정렬 경계가 생기지는 않습니다."],
      alignedBodyImplant: ["게이트 정렬 P바디 주입", "P바디 마스크가 게이트와 인접 실리콘을 열고, 패턴된 게이트 경계가 점선 바디 주입 경계를 자기 정렬합니다. 최종 전기적 채널 길이까지 고정하지는 않습니다."],
      alignedBodyDrive: ["게이트 후 P바디 확산", "공개된 바디 확산으로 도펀트가 정의된 게이트 아래 수직·측방으로 이동합니다. 게이트 정렬로 정렬 오차 의존성 하나가 줄지만 확산과 표면 농도는 여전히 문턱 전압과 겹침에 영향을 줍니다."],
      blanketLdd: ["전면 N− LDD 주입", "이 공개 예시에는 별도 LDD 마스크가 없고 패턴된 게이트와 필드 산화막이 노출 표면을 가립니다. 점선은 이 잘라낸 셀에서 노출된 소스·드레인 쪽 부분을 나타내며 필드 산화막 아래 주입이나 계산된 RESURF 전하가 아닙니다."],
      epiSourceImplant: ["N+ 소스·싱커 주입", "마스킹한 N+ 단계로 P바디 안의 소스를 형성하고 싱커 접점 경로의 도핑을 높입니다. P+ 바디 연결은 아직 주입하지 않았습니다."],
      epiBodyContact: ["P+ 바디 접점 주입", "뒤이은 별도 P+ 단계가 바디 접점 영역을 만듭니다. 소스·바디 전기적 단락은 콘택트와 배선 뒤에 이루어지며 N+와 P+가 동시에 주입된다는 뜻이 아닙니다."],
      epiJunctions: ["주입 후 단자 영역", "이제 n+ 소스, p+ 바디 접점, 드레인 측 싱커 접점을 형성된 영역으로 그립니다. 활성 분포, 실리사이드, 콘택트 저항에는 공정별 증거가 필요합니다."],
      epiContacts: ["단자 연결", "교육용 마무리 그림은 n+ 소스와 p+ 바디를 연결하고 게이트는 분리하며 N+ 싱커·매몰층을 통해 드레인에 닿습니다. 정확한 금속·콘택트 배치는 주입 단계에 제시되지 않습니다."],
      region: "p형 기판 · 고전압 n웰 · p바디 · N-LD · n+ 소스/드레인 · p+ 바디 연결",
      implanted: "점선 = 주입 직후 범위, 실선 = 형성/활성화 영역(개념도)",
      visual: "단계별 nLDMOS 개념 단면, 단계 ",
      noValues: "축척 아님. 전계, 전하, 활성화율, 항복 전압, 온저항을 계산하지 않습니다."
    }
  };

  function has(stage, flag) { return stage.flags.indexOf(flag) !== -1; }
  function rect(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function drawing(stage, language, index) {
    var t = words[language], body = '', epitaxial = has(stage, 'epi');
    body += rect(30, 90, 740, 175, '#b6afbf', 'stroke="#61596b" stroke-width="2"');
    if (has(stage, 'nblImplant')) body += rect(95, 90, 615, 26, 'url(#ld-hatch)', 'stroke="#246388" stroke-dasharray="7 5" stroke-width="2"');
    if (has(stage, 'nbl')) body += rect(95, epitaxial ? 185 : 90, 615, 25, '#4a94c4', 'stroke="#246388" stroke-width="2"');
    if (epitaxial) body += rect(95, 90, 615, 95, '#a9d5e9', 'stroke="#337c9e" stroke-width="2"');
    if (has(stage, 'well')) body += '<path d="M95 90 H710 V213 H95 Z" fill="#a9d5e9" stroke="#337c9e" stroke-width="2"/>';
    if (has(stage, 'sinker')) body += rect(615, 92, 65, 96, '#4a94c4', 'stroke="#246388" stroke-width="2"');
    if (has(stage, 'bodyImplant')) body += rect(175, 92, epitaxial ? 165 : 202, 72, 'url(#ld-hatch)', 'stroke="#32733b" stroke-width="2" stroke-dasharray="7 5"');
    if (has(stage, 'body')) body += '<path d="M165 90 H390 V166 H165 Z" fill="#aadd9d" stroke="#32733b" stroke-width="2"/>';
    if (has(stage, 'drainExtension')) {
      if (epitaxial) {
        body += rect(95, 91, 245, 20, 'url(#ld-hatch)', 'stroke="#337c9e" stroke-width="1" stroke-dasharray="4 3"');
        body += rect(469, 91, 21, 20, 'url(#ld-hatch)', 'stroke="#337c9e" stroke-width="1" stroke-dasharray="4 3"');
        body += rect(607, 91, 103, 20, 'url(#ld-hatch)', 'stroke="#337c9e" stroke-width="1" stroke-dasharray="4 3"');
      } else body += rect(485, 92, 160, 47, 'url(#ld-hatch)', 'stroke="#337c9e" stroke-width="2" stroke-dasharray="7 5"');
    }
    if (has(stage, 'drain') && !epitaxial) body += rect(485, 92, 160, 47, '#6cb5da', 'stroke="#337c9e" stroke-width="2"');
    if (has(stage, 'junctionImplant') || has(stage, 'sourceImplant')) {
      // The dashed implant stops at the spacer (early branch) or poly edge
      // (EP branch). Only the later formed junction may extend under the gate.
      body += rect(280, 91, has(stage, 'spacers') ? 47 : 60, 29, 'url(#ld-hatch)', 'stroke="#185887" stroke-width="2" stroke-dasharray="5 4"');
      if (!epitaxial) body += rect(615, 91, 65, 29, 'url(#ld-hatch)', 'stroke="#185887" stroke-width="2" stroke-dasharray="5 4"');
    }
    if (has(stage, 'junctionImplant') || has(stage, 'bodyContactImplant')) {
      body += rect(182, 91, 48, 29, 'url(#ld-hatch)', 'stroke="#853e52" stroke-width="2" stroke-dasharray="5 4"');
    }
    if (has(stage, 'junctions')) {
      body += rect(280, 91, 68, 29, '#2478ad', 'stroke="#185887" stroke-width="2"');
      if (!epitaxial) body += rect(615, 91, 65, 29, '#2478ad', 'stroke="#185887" stroke-width="2"');
      body += rect(182, 91, 48, 29, '#d98798', 'stroke="#853e52" stroke-width="2"');
    }
    if (has(stage, 'fieldOxide')) body += rect(490, 76, 117, 14, '#e6d3aa', 'stroke="#9d6b24"');
    if (has(stage, 'oxide')) body += rect(332, 82, 145, 8, '#f4bd6c', 'stroke="#9d6b24"');
    if (has(stage, 'gate')) body += rect(340, 51, 129, 31, '#555e70', 'stroke="#303747" stroke-width="2"');
    if (has(stage, 'spacers')) {
      body += rect(327, 55, 13, 35, '#e6d3aa');
      body += rect(469, 55, 13, 35, '#e6d3aa');
    }
    if (has(stage, 'contacts')) {
      body += rect(199, 58, 15, 33, '#8b6854');
      body += rect(300, 58, 15, 33, '#8b6854');
      body += rect(395, 37, 16, 14, '#8b6854');
      body += rect(635, 58, 15, 33, '#8b6854');
      body += '<path d="M205 56 H308 M205 56 V42 H308" stroke="#aa8029" stroke-width="8" fill="none"/>';
    }
    var labels = language === 'ko' ? ["p형 기판", epitaxial ? "N− 에피" : "고전압 n웰", "p바디", "n+ 소스", "p+ 바디", "n형 드리프트/N-LD", epitaxial ? "N+ 싱커/드레인" : "n+ 드레인", "게이트", "N+ 매몰층"] : ["p substrate", epitaxial ? "N− epi" : "HV n-well", "P-body", "n+ source", "p+ body", "n drift / N-LD", epitaxial ? "N+ sinker / drain" : "n+ drain", "gate", "N+ buried layer"];
    body += '<g fill="currentColor" font-family="system-ui,sans-serif" font-size="16">';
    body += '<text x="35" y="287">' + labels[0] + '</text>';
    if (has(stage, 'well') || epitaxial) body += '<text x="558" y="173">' + labels[1] + '</text>';
    if (has(stage, 'nbl')) body += '<text x="470" y="232">' + labels[8] + '</text>';
    if (has(stage, 'body') || has(stage, 'bodyImplant')) body += '<text x="201" y="151">' + labels[2] + '</text>';
    if (has(stage, 'junctions') || has(stage, 'junctionImplant') || has(stage, 'sourceImplant')) body += '<text x="275" y="39">' + labels[3] + '</text>';
    if (has(stage, 'junctions') || has(stage, 'junctionImplant') || has(stage, 'bodyContactImplant')) body += '<text x="122" y="76">' + labels[4] + '</text>';
    if (has(stage, 'junctions') || has(stage, 'junctionImplant') || has(stage, 'sinker')) body += '<text x="611" y="39">' + labels[6] + '</text>';
    if (has(stage, 'drain') || has(stage, 'drainExtension')) body += '<text x="493" y="161">' + labels[5] + '</text>';
    if (has(stage, 'gate')) body += '<text x="376" y="30">' + labels[7] + '</text>';
    body += '</g>';
    return '<svg viewBox="0 0 800 310" role="img" aria-labelledby="ld-seq-title ld-seq-desc" xmlns="http://www.w3.org/2000/svg">' +
      '<title id="ld-seq-title">' + t.visual + (index + 1) + '</title><desc id="ld-seq-desc">' + t[stage.key][1] + ' ' + t.noValues + '</desc>' +
      '<defs><pattern id="ld-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 L8 0" stroke="#4c6a75" stroke-width="2"/></pattern></defs>' + body + '</svg>';
  }
  function mount(host, language) {
    var t = words[language === 'ko' ? 'ko' : 'en'], index = 0, active = stages;
    host.innerHTML = '<label class="ld-sequence-variant"><span></span><select><option value="early"></option><option value="aligned"></option></select></label>' +
      '<div class="ld-sequence-controls"><button type="button" data-dir="-1"></button><output aria-live="polite"></output><button type="button" data-dir="1"></button></div>' +
      '<div class="ld-sequence-figure"></div><div class="ld-sequence-detail" aria-live="polite"></div><div class="ld-sequence-steps" role="group"></div>';
    var buttons = host.querySelectorAll('[data-dir]'), output = host.querySelector('output'), figure = host.querySelector('.ld-sequence-figure'), detail = host.querySelector('.ld-sequence-detail'), list = host.querySelector('.ld-sequence-steps'), selector = host.querySelector('select');
    buttons[0].textContent = t.prev; buttons[1].textContent = t.next;
    host.querySelector('.ld-sequence-variant span').textContent = t.choose;
    selector.options[0].textContent = t.early; selector.options[1].textContent = t.aligned;
    function buildSteps() {
      list.innerHTML = '';
      active.forEach(function (s, i) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = (i + 1) + '. ' + t[s.key][0];
        b.addEventListener('click', function () { index = i; render(); }); list.appendChild(b);
      });
    }
    function render() {
      var s = active[index];
      buttons[0].disabled = index === 0; buttons[1].disabled = index === active.length - 1;
      output.textContent = t.stage + ' ' + (index + 1) + '/' + active.length + ': ' + t[s.key][0];
      figure.innerHTML = drawing(s, language, index);
      detail.innerHTML = '<p>' + t[s.key][1] + '</p><dl><div><dt>' + t.mask + '</dt><dd>' + (active === stages && t.masks ? t.masks[index] : language === 'ko' ? s.maskKo : s.mask) + '</dd></div><div><dt>' + t.thermal + '</dt><dd>' + (active === stages && t.thermals ? t.thermals[index] : language === 'ko' ? s.thermalKo : s.thermal) + '</dd></div></dl>';
      Array.prototype.forEach.call(list.children, function (b, i) { b.setAttribute('aria-current', i === index ? 'step' : 'false'); });
    }
    buttons[0].addEventListener('click', function () { if (index > 0) { index--; render(); } });
    buttons[1].addEventListener('click', function () { if (index < active.length - 1) { index++; render(); } });
    selector.addEventListener('change', function () { active = selector.value === 'aligned' ? gateAlignedStages : stages; index = 0; buildSteps(); render(); });
    buildSteps();
    render();
  }
  window.PMICLDMOS = { stages: stages, gateAlignedStages: gateAlignedStages, mount: mount, drawing: drawing };
  Array.prototype.forEach.call(document.querySelectorAll('[data-ldmos-sequence]'), function (host) { mount(host, host.getAttribute('data-ldmos-sequence')); });
}());
