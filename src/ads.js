// ═══ ads.js — 보상형 광고 프레임워크 (제공자 독립) ═══════════════════════════
//  analytics.js와 같은 철학: AdMob 미연결 시 무동작(버튼 숨김). 실제 광고는 네이티브 앱(Capacitor)에서만.
//  연결 방법: @capacitor-community/admob 플러그인 설치 → AD_CONFIG.provider에 래퍼 연결 + rewardedUnitId 세팅.
//  로드 순서: logic.js 다음(전역 게임 함수 사용). index.html에서 cloud.js 앞.
//  미리보기/검증: URL에 ?adtest=1 → 광고 없이 보상 즉시 지급(테스트용).

var AD_CONFIG = { provider: null, rewardedUnitId: '' };   // AdMob 붙일 때 채움

function _adTestMode(){ try{ return location.search.indexOf('adtest=1') >= 0; }catch(e){ return false; } }
// 네이티브(Capacitor) + AdMob 연결 시에만 실제 광고 가능. 웹/PWA는 리워드 동영상 불가.
function adsAvailable(){
  try{ return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && AD_CONFIG.provider); }
  catch(e){ return false; }
}
// 광고 보상 버튼을 노출할지 — 실제 광고 가능하거나 테스트 모드일 때만(프로덕션 웹은 깔끔하게 숨김).
function adRewardAvailable(){ return adsAvailable() || _adTestMode(); }

// 보상형 광고 표시 → 시청 완료 시 onReward() 호출.
function showRewardedAd(rewardType, onReward){
  if(typeof track==='function') track('ad_request',{type:rewardType});
  if(_adTestMode()){ onReward && onReward(); return; }               // 테스트: 즉시 지급
  if(!adsAvailable()){ if(typeof showSt==='function') showSt('📺 광고 보상은 앱에서 이용할 수 있어요'); return; }
  try{
    AD_CONFIG.provider.showRewarded(AD_CONFIG.rewardedUnitId, function(completed){
      if(completed){ if(typeof track==='function') track('ad_complete',{type:rewardType}); onReward && onReward(); }
    });
  }catch(e){ if(typeof showSt==='function') showSt('광고를 불러오지 못했어요'); }
}

// ── 보상 1: 오프라인 보상 2배 ─────────────────────────────
function adRewardOfflineDouble(){
  var g = window._lastOfflineGain;
  if(!g || (!g.money && !g.xp)){ if(typeof showSt==='function') showSt('2배로 받을 오프라인 보상이 없어요'); return; }
  showRewardedAd('offline2x', function(){
    S.money += g.money||0; S.xp += (g.xp||0);
    while(S.xp>=S.xpMax){ S.xp-=S.xpMax; S.lv++; S.xpMax=Math.floor(S.xpMax*1.22); S.sp++; }
    window._lastOfflineGain = null;   // 1회만
    if(typeof addLog==='function') addLog('good','📺 오프라인 보상 2배! +₩'+(g.money||0).toLocaleString()+' · XP+'+(g.xp||0));
    if(typeof showSt==='function') showSt('📺 오프라인 보상 2배 획득!');
    if(typeof track==='function') track('ad_reward',{type:'offline2x', money:g.money||0});
    var m=document.getElementById('modal-area'); if(m) m.innerHTML='';
    if(typeof save==='function') save(); if(typeof update==='function') update();
  });
}

// ── 보상 2: 30분 부스터(속도 ×2, HP 소모 없음) ─────────────
function adRewardBoost30(){
  showRewardedAd('boost30', function(){
    var base = Math.max(S.adBoostUntil||0, Date.now());
    S.adBoostUntil = base + 30*60*1000;
    if(typeof addLog==='function') addLog('good','📺 30분 부스터 발동! 속도 ×2 (HP 소모 없음)');
    if(typeof showSt==='function') showSt('📺 30분 부스터 ON!');
    if(typeof track==='function') track('ad_reward',{type:'boost30'});
    var m=document.getElementById('modal-area'); if(m) m.innerHTML='';
    if(typeof save==='function') save(); if(typeof update==='function') update();
  });
}

// ── 보상 3: 가챠권 10장 (레어~전설, 하루 1회) ──────────────
function _adTodayStr(){ try{ return new Date().toISOString().slice(0,10); }catch(e){ return ''; } }
function adGacha10Available(){ return S.adGachaDay !== _adTodayStr(); }
function adRewardGacha10(){
  if(!adGacha10Available()){ if(typeof showSt==='function') showSt('오늘은 이미 받았어요 (내일 또 와요!)'); return; }
  showRewardedAd('gacha10', function(){
    S.gachaTicket = (S.gachaTicket||0) + 10;
    S.adGachaDay = _adTodayStr();
    if(typeof addLog==='function') addLog('good','📺 무료 가챠권 10장 획득! (레어~전설) 🎟️×10');
    if(typeof showSt==='function') showSt('📺 🎟️가챠권 +10!');
    if(typeof track==='function') track('ad_reward',{type:'gacha10'});
    var m=document.getElementById('modal-area'); if(m) m.innerHTML='';
    if(typeof save==='function') save(); if(typeof update==='function') update();
    if(typeof curTab!=='undefined' && curTab==='gacha' && typeof renderGacha==='function') renderGacha();
  });
}

// ── 광고 보상 모달(메인 버튼에서 열림) ─────────────────────
function showAdRewardsModal(){
  var u='var(--u)', fs=function(px){return 'font-size:calc('+px+'px * '+u+')';};
  var boostOn = (typeof adBoostActive==='function' && adBoostActive());
  var remain = boostOn ? Math.ceil((S.adBoostUntil-Date.now())/60000) : 0;
  var g10 = adGacha10Available();
  document.getElementById('modal-area').innerHTML =
  '<div class="px-panel" style="border-color:#7C3AED;background:linear-gradient(135deg,#F3E8FF,#FFF8E1);margin-bottom:5px;box-shadow:0 0 calc(12px * '+u+') #B388FF;">'
  + '<div style="'+fs(11)+';color:#4C1D95;text-align:center;margin-bottom:calc(8px * '+u+');">🎁 광고 보상</div>'
  + '<div style="'+fs(7)+';color:#5C3D1E;text-align:center;margin-bottom:calc(8px * '+u+');">짧은 광고를 보고 무료 보상을 받아요 (선택)</div>'
  + '<button class="px-btn" style="width:100%;'+fs(9)+';padding:calc(9px * '+u+');background:#FB8C00;border-color:#E65100;color:#fff;margin-bottom:calc(5px * '+u+');box-shadow:calc(3px * '+u+') calc(3px * '+u+') 0 #B23C00;" onclick="adRewardBoost30()">'
  + (boostOn ? '⚡ 30분 부스터 (남은 '+remain+'분 · 연장)' : '📺 ⚡ 30분 부스터 (속도 ×2)') + '</button>'
  + '<button class="px-btn" style="width:100%;'+fs(9)+';padding:calc(9px * '+u+');margin-bottom:calc(5px * '+u+');'
  + (g10 ? 'background:#7C3AED;border-color:#4C1D95;color:#fff;box-shadow:calc(3px * '+u+') calc(3px * '+u+') 0 #2E1065;' : 'opacity:.5;')
  + '" ' + (g10 ? 'onclick="adRewardGacha10()"' : 'disabled') + '>'
  + (g10 ? '📺 🎟️ 가챠권 10장 (레어~전설, 일 1회)' : '🎟️ 가챠권 10장 — 오늘 수령 완료 (내일 또!)') + '</button>'
  + '<button class="px-btn px-btn-gray" style="width:100%;'+fs(8)+';" onclick="document.getElementById(\'modal-area\').innerHTML=\'\';">닫기</button>'
  + '</div>';
}
