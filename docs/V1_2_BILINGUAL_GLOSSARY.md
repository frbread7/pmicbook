# PMICBook v1.2 bilingual technical glossary

Use these as preferred learner-facing terms, then check each sentence in context. Korean usage varies by company and specialty; this is an editorial baseline, not a claim of native-speaker approval. Preserve standard acronyms where engineers commonly use them, and define them at first use in each chapter where needed.

| English | Preferred Korean | Notes |
|---|---|---|
| power management IC (PMIC) | 전력 관리 IC (PMIC) | Keep PMIC as the standard acronym. |
| power rail | 전원 레일 | Distinguish the electrical rail from a power domain (전원 도메인). |
| low-dropout regulator (LDO) | 저드롭아웃 레귤레이터 (LDO) | Avoid translating dropout as simple output failure. |
| bias / bias circuit | 바이어스 / 바이어스 회로 | Use consistently for operating-point bias. |
| breakdown voltage | 항복 전압 | Keep separate from operating voltage rating. |
| specific on-resistance / area-normalized on-resistance (RDS(on),sp) | 면적 정규화 온저항 (RDS(on),sp) | The glossary source uses “area-normalized on-resistance”; preserve the area-normalized quantity and do not shorten it to ordinary on-resistance. Confirm notation against the displayed equation. |
| drift region | 드리프트 영역 | Common device term; explain its voltage-support role. |
| body tie | 바디 접속 / 바디 타이 | Select one label per figure and define that it ties the body region to a reference node. |
| buried layer | 매몰층 | Add polarity only when known (e.g. n형 매몰층). |
| epitaxial layer (EPI) | 에피택셜층 (에피층) | Define EPI; do not imply every BCD platform uses the same stack. |
| isolation | 절연 / 소자 격리 | Use 소자 격리 for isolation between devices when context requires. |
| field plate | 필드 플레이트 | Explain field shaping; avoid implying a universal structure. |
| specific on-resistance vs. breakdown trade-off | 비저항 온저항과 항복 전압 간 상충 관계 | Use 상충 관계 for trade-off; give axes/conditions for quantitative comparisons. |
| parasitic | 기생 성분 | Name the electrical quantity when known: 기생 저항/커패시턴스/인덕턴스. |
| voltage coefficient | 전압 계수 | For capacitance/resistance, say which parameter varies with voltage. |
| guard band | 가드 밴드 (여유 폭) | Define whether it is a test limit margin, specification margin, or statistical allowance. |
| measurement uncertainty | 측정 불확도 | Distinguish from measurement error and repeatability. |
| wafer acceptance test (WAT) | 웨이퍼 인수 시험 (WAT) | If the chapter uses 공정 모니터링, distinguish WAT structures/data from die sort. |
| electrical die sorting (EDS) | 전기적 다이 선별 (EDS) | Korean industry pages also use EDS; define once. |
| wafer sort / probe test | 웨이퍼 소트 / 프로브 검사 | State wafer-level electrical test context; do not treat as synonymous with WAT. |
| failure analysis (FA) | 고장 분석 (FA) | Keep failure localization, physical analysis, and root-cause conclusion distinct. |
| electromigration (EM) | 일렉트로마이그레이션 (EM) | May gloss as 전자 이동에 의한 금속 배선 열화. |
| time-dependent dielectric breakdown (TDDB) | 시간 의존 절연막 파괴 (TDDB) | Keep the acronym. |
| bias temperature instability (BTI) | 바이어스 온도 불안정성 (BTI) | Avoid presenting one polarity/model as universal. |
| hot-carrier injection (HCI) | 핫 캐리어 주입 (HCI) | Use consistently with hot-carrier degradation context. |
| latch-up | 래치업 | Explain parasitic regenerative conduction; do not call it generic short circuit. |
| junction temperature | 접합 온도 | Keep distinct from ambient and case temperature. |
| thermal resistance | 열저항 | State boundary/reference nodes (junction-to-case, etc.). |
| thermal budget | 열 예산 | Define as cumulative process thermal exposure, not a financial budget. |
| process integration | 공정 통합 | Preserve distinction from process sequence alone. |
| source/drain | 소스/드레인 | Keep polarity and implant species explicit when the source supports them. |
| positive/negative photoresist | 포지티브/네거티브 포토레지스트 | Avoid relying on polarity shorthand without explaining mask-tone meaning. |

## Review checklist

- Preserve the same physical quantity, assumptions, units, polarity, and uncertainty in both languages.
- Translate explanation rather than acronym spelling where Korean technical usage retains English acronyms.
- Keep “illustrative,” “platform-specific,” and “not calibrated” limitations in both versions.
- Reconcile chapter terminology with the glossary after a native-speaker review; this draft itself is not that review.
