# CLAUDE.md — 임복동 세계일주 (bokdong)

> 이 파일은 매 Claude Code 세션에 자동 로드됩니다. 여기 규칙을 지켜서 작업합니다.
> 진행상황·남은 일은 [BACKLOG.md](./BACKLOG.md), 초기 이식 배경은 [CLAUDE_CODE_이식가이드.md](./CLAUDE_CODE_이식가이드.md)(v9.18 기준·역사적 자료).

## 제품 개요
자전거로 전국+일본을 여행하는 **한국어 픽셀아트 방치형(idle) 웹게임**.
- 창업자(비개발자)의 개발 여정 시작점. **애착이 큰 프로젝트** — 정식 출시 제품 기준으로 품질 관리.
- NPC = 사용자의 실제 친구/베타테스터들.
- **connectia-b2b와 완전 별개 프로젝트**(별도 저장소·별도 배포). 섞지 말 것.

## 기술 스택 / 실행
- **순수 HTML/CSS/JavaScript** (프레임워크 없음), Canvas 2D 렌더링.
- 배포: **Vercel** (https://bokdong.vercel.app) · GitHub: leesoyeol1213-glitch/bokdong (main).
- 비동기 협동(전국 레이드)만 **Supabase**(Postgres + PostgREST + RLS) 사용.
- 로컬 실행: 정적 서버 필요(파일 CORS 회피).
  ```bash
  cd C:\projects\bokdong_claude
  python -m http.server 8000   # http://localhost:8000
  ```
- 저장: **localStorage** — 게임데이터 키 `bkdng_v45`, 사운드 `bkdng_sound`. 백업/복원은 인게임 "🔑 백업" 코드.

## 파일 구조 (로드 순서 중요)
`index.html`이 아래 순서로 전역(global) 스크립트를 로드 — **순서 바꾸면 깨짐**:
```
src/analytics.js → 제공자 독립 계측(전역 track()). 제공자 미연결 시 외부 전송 0.
                   (로드는 data.js보다 먼저)
src/data.js    → 상수·상태·데이터 (CITIES, VEHS, FOODS, ACHIEVEMENTS, DAILY/WEEKLY_COURSES, freshState 등)
src/render.js  → Canvas 그리기 (drawScene, drawBokdown, drawVehPixel, 이펙트, 슈퍼샘플링)
src/logic.js   → 게임 로직·UI (tick, trackMission, 탭 렌더, 코스/보스러시/레이드) — 가장 큼
src/cloud.js   → 클라우드 계정(이메일 매직링크)+세이브. logic 다음·boot 전 로드. 미로그인 시 무동작.
src/boot.js    → 시동
```
- 버전 표기: **`index.html`의 `<title>임복동 세계일주 vX.XX</title>`** 단일 출처. 작업 시 올릴 것.
- `assets/`: 스프라이트·배경. NPC 초상/탈것 도감 이미지는 마젠타 크로마키 추출 파이프라인으로 생성.

## 작업 원칙 (사용자 강력 요구 — 반드시 준수)
1. **추측 금지.** 코드를 실제로 읽고 작업. "아마 이럴 것"으로 수정 금지.
2. **한 곳만 고치고 "됐다" 금지.** 증상 관련 모든 코드 경로를 전수조사 후 수정.
3. **검증 후 보고.** 수정 후 실제 동작 확인(실행/스크린샷/헤드리스)하고 완료 보고. 못 찾으면 솔직히 "못 찾았다".
4. **작업 단위마다 자동 커밋+푸시.** Vercel이 자동 재배포 → 테스터가 즉시 최신본을 받음. 이게 기본 워크플로.
5. 큰 작업은 쪼개서 확인받으며 진행.

## 렌더링 핵심 (건드릴 때 주의)
- **슈퍼샘플링**: `SS=max(3, min(4, ceil(dpr)+1))`, 매 프레임 `ctx.setTransform(SS,0,0,SS,0,0)`, 백킹 420×210×SS. `#cv`는 `image-rendering:auto`(글씨 선명). 보조 픽셀 이미지만 `pixelated`.
- **탈것 도감 이미지 게이트**: `drawVehPixel`에서 `if(s < 0.9 && hasAsset('veh_'+id))`만 카탈로그 이미지 사용. **`s<0.9` 게이트 제거 금지** — 없으면 라이딩 중 복동이가 카탈로그 이미지로 교체돼 사라짐(과거 버그).
- 앱 셸 레이아웃: `#app` flex column + `.app-head`(고정) + `.app-body`(스크롤). 모바일 safe-area 반영. 라이딩 애니는 항상 상단 고정.

## 도메인 규칙
- 자전거 **15대**(v1~v15). 과거 30대에서 축소하며 세이브 마이그레이션 존재(비례 환산) — 대수 바꾸면 마이그레이션도 함께.
- 일본은 **부산 페리로만** 진입(`enforceJapanRule`).
- 함정도시(신한/청학동): 8초마다 탈출 주사위, 실패할수록 필요 눈금↓(천장), 6번째 무조건 성공. 속도 무관.
- 특별코스: 일일/주간(`DAILY/WEEKLY_COURSES`, `S.course`, `bumpCourse`). 주간 7대죄 보스러시(`SIN_RUSH_IDS`, 주사위 ≥3 승).

## 보안 (Supabase)
- **anon(public) 키는 클라이언트 코드에 두는 게 정상** — RLS로 보호되는 표준 관행. 커밋해도 됨.
- **service_role(secret) 키는 절대 금지** — 클라이언트/커밋/채팅에 넣지 말 것.
- 레이드는 익명 `player_id`로 4개 필드만 공유(player_id, nickname, week, km). 닉네임은 리더보드 표시용. km는 라이딩 시 45초 스로틀 자동 제출. km CHECK 클램프(0~500000)로 어뷰징 방지.

## 🎯 북극성: $0 출시 로드맵 (사용자 결정 — 인생 게임개발 프로젝트를 무비용으로 실제 출시까지)
목표는 "수익"이 아니라 **프로토→개발→출시 전 과정을 돈 안 들이고 완주**. 순서 = 측정→리텐션→계정→PWA→출시.
- **0. 측정** ✅ (v9.59) — `src/analytics.js` 전역 `track()`. 핵심 퍼널 이벤트 심음(app_open/new_game/load_game/city_arrive/bike_buy/gacha_roll/prestige). **제공자 미연결이라 아직 외부 전송 0.**
  - 활성화(무료): PostHog 무료 계정 → 프로젝트 키를 `analytics.js`의 `ANALYTICS_CONFIG`에 넣고 `sendToProvider` 주석 해제 + index.html에 posthog 스니펫. (또는 GA4/Cloudflare)
- **1. 계정+클라우드 세이브** ✅ (v9.60~65) — `src/cloud.js` 이메일 매직링크 로그인 + 세이브 push/pull. Supabase `saves` 테이블+RLS 생성 완료, 실제 로그인 동작 확인됨(2026-07-13). 게임 내 🔑 백업 → ☁️ 클라우드 세이브.
- **2. 온보딩** ✅ (v9.61) — 첫 실행 환영 모달 → 닉네임 입력(레이드 리더보드용) → 시작 힌트. `showOnboarding/obStep2/obFinish`, boot new_game 시 1회(`bkdng_onboarded` 플래그). 이벤트 계측(onboarding_start/nickname_set/done/skip).
- **3. PWA** ✅ (v9.62) — `manifest.json`(아이콘 192·512, standalone) + `sw.js`(네트워크 우선→오프라인 캐시, 업데이트 안전) + head 메타. 홈화면 설치가능. 아이콘은 복동이 스프라이트를 헤드리스 Chrome로 렌더($0). SW는 HTTPS/localhost에서만 등록(boot.js).
- **4. 출시 준비** ✅ 자료 완료 (v9.63) — `privacy.html`(수집 항목·처리자 Vercel/Supabase/PostHog 명시, 연락처 placeholder) + 게임 내 링크. `LAUNCH_itch.md`(스토어 문구·태그·업로드 가이드·스크린샷 리스트). 히어로 스크린샷 `launch/shot_main.png`.
- **5. 출시&관찰** ✅ **출시됨!** (2026-07-13) — itch.io에 브랜디드 런처(`itch/index.html`) + 커버(`launch/cover.png`)로 공개. 순수 $0 달성. 이제 관찰(PostHog 리텐션)→개선 루프.
- 참고: 실제 돈(가챠 현금화) 붙이면 **한국 확률형 아이템 확률 공시 의무**(게임산업법, 2024.3) 적용.

## 남은 작업 (BACKLOG.md 참고)
- Supabase 테스트 행 정리(`bd_verify_a`, `bd_verify_b`, `bd_testrunner1` — 모두 지난주 2026-28, 현재 순위 무영향. anon DELETE 불가 시 대시보드에서 삭제).
- (유저 증가 시) Edge Function 서버측 검증 강화. (첫 실행 닉네임 팝업 ✅ v9.61 온보딩에 포함)

### 완료
- ✅ **0단계 측정 계측**(v9.59) — `src/analytics.js` 제공자 독립 `track()`. 실제 브라우저에서 5개 이벤트 발생·외부 전송 0 검증. Node 하네스 64/64.
- ✅ 전국 레이드 **실연결됨**(테이블 `raid_progress` 생성·가동 중, 실제 테스터 주간 km 제출 확인). CLAUDE.md 옛 "테이블 생성 대기" 메모는 폐기.
- ✅ **구간별 상위 랭커 박스**(v9.56) — 지난주 최종 순위 정산 → 🥇1·🥈2·🥉3위 전설~신화 랜덤박스(1위 신화확정, 2위40%/3위20%). `settleRaidRankReward`→`applyRankSettlement`, `S.raidRankClaimedWeek` dedup.
- ✅ 버그: **대구 OX 퀴즈 먹통**(해설 큰따옴표가 onclick 속성 조기 종료) — 문제를 전역 `curOX`에 저장, 버튼은 pick만 전달(v9.55). **가챠 천장 전설 유실**(가방 가득 시 무조건 자동분해) — 과금 전 가방 가득 가드(v9.55).
- ✅ **새 버전 감지 배너**(v9.57, `boot.js` initUpdateCheck) — 테스터가 옛 JS를 캐시/메모리에 문 채 플레이해 고친 버그가 남아 보이는 문제 대응. index.html을 no-store로 재조회해 `<title>` 버전이 다르면 하단 배너로 새로고침 유도(탭 복귀 시 + 5분 주기). 실제 브라우저 검증 완료.
  - 교훈: 스크립트는 캐시버스팅 쿼리가 없음(`./src/*.js`). 캐시 헤더가 `max-age=0,must-revalidate`라 **새로고침하면** 최신을 받지만, 열어둔 세션은 안 받음 → 배너로 해결.
- ✅ 전국 레이드 **공동 목표 달성 보상**(v9.53~54) — 서버 확인 합산이 `RAID_GOAL`(현재 **5만km**, 베타 규모 조정) 도달 시 주당 1회 **₩50만+🎟️2** 지급(`claimRaidRewardIfDone`, `S.raidRewardClaimed` 주차 dedup). 주간반복이라 영구 SP는 제외.
- ✅ BACKLOG **F: #10 자전거 도감 + 가챠권**(v9.52) — 도감 자전거 섹션, 신규 구매 시 🎟️가챠권 +1, 가챠권 뽑기.
- ✅ 강화 표기 15%↔8% 불일치 — 확인 결과 이미 해결됨(효과·표기·메시지 모두 +8%).
