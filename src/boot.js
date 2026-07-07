// ═══ boot.js — 시동 — 애니메이션 시작·자동 불러오기/자동저장
// game.js(v9.19, 4758줄)에서 분할. 로드 순서: data → render → logic → boot (index.html)
// 전역 공유(모듈 아님) — 분할 전과 의미 동일.

// 즉시 호출 대신 다음 프레임에 시작 — 모든 정의가 끝난 후 실행되도록
requestAnimationFrame(animLoop);

// ── 자동 불러오기 + 자동저장 시동 (v9.19) ─────────────────
// 방치형 UX: 시작 시 자동 로드(+오프라인 보상), 30초 주기·탭 이탈·닫기 시 자동 저장.
(function initPersistence(){
  let raw=null;
  try{raw=localStorage.getItem('bkdng_v45');}catch(e){}
  if(raw){
    let d=null;
    try{d=JSON.parse(raw);}catch(e){}
    if(d && doLoad(d)){
      showSt('📂 자동 불러오기 완료!');
    }else{
      // 손상 데이터 보호: 자동저장을 켜면 손상본을 새 게임으로 덮어씀 → 꺼둔 채 안내
      showSt('⚠️ 저장 데이터 손상 — 보호를 위해 자동저장 중지. [초기화]로 새로 시작할 수 있어요.');
    }
  }else{
    saveReady=true; // 새 게임 — 바로 자동저장 시작
  }
  setInterval(()=>doSave(false),30000);                                                  // 30초 주기
  document.addEventListener('visibilitychange',()=>{if(document.hidden)doSave(false);}); // 탭 이탈·홈버튼(모바일)
  window.addEventListener('pagehide',()=>doSave(false));                                 // 페이지 종료(모바일 신뢰)
  window.addEventListener('beforeunload',()=>doSave(false));                             // 데스크톱 창 닫기
})();
update();
