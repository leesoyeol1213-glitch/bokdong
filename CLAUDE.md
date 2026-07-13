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
src/data.js    → 상수·상태·데이터 (CITIES, VEHS, FOODS, ACHIEVEMENTS, DAILY/WEEKLY_COURSES, freshState 등)
src/render.js  → Canvas 그리기 (drawScene, drawBokdown, drawVehPixel, 이펙트, 슈퍼샘플링)
src/logic.js   → 게임 로직·UI (tick, trackMission, 탭 렌더, 코스/보스러시/레이드) — 가장 큼
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

## 남은 작업 (BACKLOG.md 참고)
- Supabase 테스트 행 정리(`bd_verify_a`, `bd_verify_b`, `bd_testrunner1` — 모두 지난주 2026-28, 현재 순위 무영향. anon DELETE 불가 시 대시보드에서 삭제).
- (유저 증가 시) Edge Function 서버측 검증 강화, 첫 실행 닉네임 팝업.

### 완료
- ✅ 전국 레이드 **실연결됨**(테이블 `raid_progress` 생성·가동 중, 실제 테스터 주간 km 제출 확인). CLAUDE.md 옛 "테이블 생성 대기" 메모는 폐기.
- ✅ 전국 레이드 **공동 목표(100만km) 달성 보상**(v9.53) — 서버 확인 합산이 목표 도달 시 주당 1회 ₩100만+SP2+🎟️3 지급(`claimRaidRewardIfDone`, `S.raidRewardClaimed` 주차 dedup).
- ✅ BACKLOG **F: #10 자전거 도감 + 가챠권**(v9.52) — 도감 자전거 섹션, 신규 구매 시 🎟️가챠권 +1, 가챠권 뽑기.
- ✅ 강화 표기 15%↔8% 불일치 — 확인 결과 이미 해결됨(효과·표기·메시지 모두 +8%).
