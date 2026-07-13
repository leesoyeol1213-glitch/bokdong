// ═══ boot.js — 시동 — 애니메이션 시작·자동 불러오기/자동저장
// game.js(v9.19, 4758줄)에서 분할. 로드 순서: data → render → logic → boot (index.html)
// 전역 공유(모듈 아님) — 분할 전과 의미 동일.

// 캔버스 텍스트용 갈무리 폰트 미리 로드 → 로드되면 애니메이션 글씨가 한글로 크리스프하게 렌더
try{ if(document.fonts && document.fonts.load){ document.fonts.load('11px Galmuri11'); document.fonts.load('bold 11px Galmuri11'); } }catch(e){}

// 즉시 호출 대신 다음 프레임에 시작 — 모든 정의가 끝난 후 실행되도록
requestAnimationFrame(animLoop);

// ── 자동 불러오기 + 자동저장 시동 (v9.19) ─────────────────
// 방치형 UX: 시작 시 자동 로드(+오프라인 보상), 30초 주기·탭 이탈·닫기 시 자동 저장.
(function initPersistence(){
  let raw=null;
  try{raw=localStorage.getItem('bkdng_v45');}catch(e){}
  track('app_open',{returning:!!raw});
  if(raw){
    let d=null;
    try{d=JSON.parse(raw);}catch(e){}
    if(d && doLoad(d)){
      showSt('📂 자동 불러오기 완료!');
      track('load_game',{prestige:S.prestige||0, totKm:Math.floor(S.totKm||0), lv:S.lv||1});
    }else{
      // 손상 데이터 보호: 자동저장을 켜면 손상본을 새 게임으로 덮어씀 → 꺼둔 채 안내
      showSt('⚠️ 저장 데이터 손상 — 보호를 위해 자동저장 중지. [초기화]로 새로 시작할 수 있어요.');
      track('save_corrupt');
    }
  }else{
    saveReady=true; // 새 게임 — 바로 자동저장 시작
    track('new_game');
  }
  if(typeof cloudInit==='function') cloudInit();  // 클라우드 계정: 매직링크 복귀·세션 복원·최신본 pull (로그인 안 했으면 무동작)
  setInterval(()=>doSave(false),30000);                                                  // 30초 주기
  document.addEventListener('visibilitychange',()=>{if(document.hidden)doSave(false);}); // 탭 이탈·홈버튼(모바일)
  window.addEventListener('pagehide',()=>doSave(false));                                 // 페이지 종료(모바일 신뢰)
  window.addEventListener('beforeunload',()=>doSave(false));                             // 데스크톱 창 닫기
})();

// ── 새 버전 감지 → 새로고침 안내 ─────────────────────────
// 테스터가 옛 JS를 캐시/메모리에 문 채 계속 플레이하면 이미 고친 버그가 남아 보인다.
// index.html을 no-store로 다시 받아 <title> 버전이 바뀌었으면 하단 배너로 새로고침을 유도.
(function initUpdateCheck(){
  const runVer=(document.title.match(/v[\d.]+/)||[])[0]||'';
  if(!runVer) return;
  let notified=false;
  function showUpdateBanner(newVer){
    if(notified) return; notified=true;
    let b=document.getElementById('update-banner');
    if(!b){
      b=document.createElement('div'); b.id='update-banner';
      b.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0284c7;color:#fff;text-align:center;padding:calc(10px + env(safe-area-inset-bottom)) 10px 10px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 -2px 10px rgba(0,0,0,.35);';
      b.onclick=()=>{ try{doSave(true);}catch(e){} location.reload(); };
      document.body.appendChild(b);
    }
    b.textContent='🔄 새 버전 '+newVer+' 나왔어요! 탭하여 새로고침';
  }
  function check(){
    fetch('index.html?_='+Date.now(),{cache:'no-store'})
      .then(r=>r.ok?r.text():Promise.reject())
      .then(html=>{ const m=html.match(/<title>[^<]*?(v[\d.]+)<\/title>/); if(m && m[1]!==runVer) showUpdateBanner(m[1]); })
      .catch(()=>{});
  }
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) check(); }); // 탭 복귀 시
  setInterval(check, 5*60*1000);   // 5분 주기
  setTimeout(check, 15000);        // 최초 15초 후 1회
})();

update();
