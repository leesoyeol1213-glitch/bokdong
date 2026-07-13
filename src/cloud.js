// ═══ cloud.js — 클라우드 계정 + 세이브 (로드 순서: … logic → cloud → boot)
// $0 로드맵 1단계. 로컬 플레이는 절대 건드리지 않음 — 클라우드는 "추가 레이어":
//   · 미로그인/미설정: 아무 동작 없음(로컬 localStorage 그대로).
//   · 로그인: 저장 시 클라우드에도 백업(upsert), 다른 기기/캐시삭제 후엔 로그인으로 복원.
// 인증: Supabase GoTrue 이메일 매직링크(비밀번호 없음). 저장: PostgREST `saves`(RLS로 본인 행만).
(function(){
  var GLOBAL = (function(){ return this; })() || (typeof globalThis!=='undefined' ? globalThis : {});

  // 레이드와 같은 Supabase 프로젝트. anon 키는 RLS로 보호되는 공개 키(커밋 정상).
  var CLOUD = {
    url: 'https://xaqrklunbxqvcxbxaapl.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcXJrbHVuYnhxdmN4YnhhYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjY5MTcsImV4cCI6MjA5OTI0MjkxN30.j0laJ9YvXo30umfma-4gybaIxrNQ1T542CkigJUPrdU',
    SESS_KEY: 'bkdng_cloud_sess'
  };
  var session = null;          // {access_token, refresh_token, expires_at(ms), user:{id,email}}
  var _pushTimer = 0, _lastPush = 0;

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function lsDel(k){ try{ localStorage.removeItem(k); }catch(e){} }

  function authHeaders(useUserToken){
    var h = { 'apikey': CLOUD.anonKey, 'Content-Type': 'application/json' };
    h['Authorization'] = 'Bearer ' + ((useUserToken && session && session.access_token) ? session.access_token : CLOUD.anonKey);
    return h;
  }

  function saveSession(s){ session = s; if(s) lsSet(CLOUD.SESS_KEY, JSON.stringify(s)); else lsDel(CLOUD.SESS_KEY); cloudUpdateUI(); }
  function loadStoredSession(){ try{ var raw=lsGet(CLOUD.SESS_KEY); session = raw ? JSON.parse(raw) : null; }catch(e){ session=null; } return session; }

  // GoTrue 토큰 응답 → 표준 세션 객체
  function toSession(j){
    if(!j || !j.access_token) return null;
    return {
      access_token: j.access_token,
      refresh_token: j.refresh_token,
      expires_at: Date.now() + ((j.expires_in||3600)*1000) - 60000, // 만료 1분 전으로 보수적
      user: j.user ? { id: j.user.id, email: j.user.email } : (session&&session.user)||null
    };
  }

  // ── 매직링크 로그인: 이메일 발송 ──
  GLOBAL.cloudSignIn = function(email){
    email = (email||'').trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ showSt('올바른 이메일을 입력하세요'); return; }
    var redirect = (GLOBAL.location && GLOBAL.location.origin) ? GLOBAL.location.origin + GLOBAL.location.pathname : '';
    fetch(CLOUD.url+'/auth/v1/otp', {
      method:'POST', headers: authHeaders(false),
      body: JSON.stringify({ email: email, create_user: true, options: { email_redirect_to: redirect } })
    }).then(function(r){ return r.ok ? r.json().catch(function(){return {};}) : r.json().then(function(e){ return Promise.reject(e); }); })
      .then(function(){ showSt('📧 로그인 링크를 이메일로 보냈어요! 확인 후 클릭'); addLog('good','📧 '+email+' 로 로그인 링크 발송'); cloudUpdateUI(); })
      .catch(function(e){ showSt('메일 발송 실패 — 잠시 후 다시'); addLog('bad','클라우드 로그인 실패: '+((e&&e.msg)||(e&&e.error_description)||'')); });
  };

  // ── 매직링크 클릭 후 복귀: URL 해시에서 토큰 파싱(순수 함수로 분리 — 테스트 용이) ──
  GLOBAL.cloudParseHash = function(hash){
    if(!hash || hash.indexOf('access_token=')<0) return null;
    var q = {}; hash.replace(/^#/,'').split('&').forEach(function(kv){ var p=kv.split('='); if(p[0]) q[decodeURIComponent(p[0])]=decodeURIComponent(p[1]||''); });
    if(!q.access_token) return null;
    return { access_token:q.access_token, refresh_token:q.refresh_token, expires_in: parseInt(q.expires_in||'3600',10) };
  };

  // 세션 유효화(만료 시 refresh). 콜백(ok:boolean).
  function ensureValidSession(cb){
    if(!session){ cb(false); return; }
    if(session.expires_at && Date.now() < session.expires_at){ cb(true); return; }
    if(!session.refresh_token){ cb(false); return; }
    fetch(CLOUD.url+'/auth/v1/token?grant_type=refresh_token', { method:'POST', headers: authHeaders(false), body: JSON.stringify({ refresh_token: session.refresh_token }) })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function(j){ var s=toSession(j); if(s){ saveSession(s); cb(true); } else cb(false); })
      .catch(function(){ cb(false); });
  }

  // 로그인한 유저 정보 조회(토큰 검증 겸)
  function fetchUser(cb){
    fetch(CLOUD.url+'/auth/v1/user', { headers: authHeaders(true) })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function(u){ if(u&&u.id){ session.user={id:u.id,email:u.email}; saveSession(session); } cb && cb(true); })
      .catch(function(){ cb && cb(false); });
  }

  // ── 클라우드 저장(upsert) ── 로컬 저장 직후 호출(스로틀). 최신 localStorage 세이브를 그대로 올림.
  GLOBAL.cloudPush = function(force){
    if(!session) return;
    var now=Date.now(); if(!force && now-_lastPush < 20000) return; // 20s 스로틀
    ensureValidSession(function(ok){
      if(!ok){ return; }
      var raw = lsGet('bkdng_v45'); if(!raw) return;
      var payload; try{ payload = JSON.parse(raw); }catch(e){ return; }
      _lastPush = Date.now();
      fetch(CLOUD.url+'/rest/v1/saves', {
        method:'POST',
        headers: Object.assign(authHeaders(true), { 'Prefer':'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify([{ user_id: session.user.id, data: payload, updated_at: new Date().toISOString() }])
      }).then(function(){ cloudUpdateUI(); }).catch(function(){});
    });
  };
  // 자동저장이 호출하는 스로틀 래퍼
  GLOBAL.cloudPushThrottled = function(){ if(!session) return; if(_pushTimer) return; _pushTimer=setTimeout(function(){ _pushTimer=0; cloudPush(false); }, 1500); };

  // ── 로컬 vs 클라우드 최신본 판정(순수 함수 — 테스트 용이). lpt(마지막 플레이 시각) 우선, 없으면 진행도(totKm). ──
  GLOBAL.pickNewerSave = function(localD, cloudD){
    if(!cloudD) return 'local';
    if(!localD) return 'cloud';
    var ll = (localD.lpt)||0, cl = (cloudD.lpt)||0;
    if(cl>ll) return 'cloud';
    if(ll>cl) return 'local';
    var lk = (localD.S&&localD.S.totKm)||0, ck = (cloudD.S&&cloudD.S.totKm)||0;
    return ck>lk ? 'cloud' : 'local';
  };

  // ── 클라우드에서 세이브 가져와 로컬보다 최신이면 적용 ──
  GLOBAL.cloudPull = function(){
    if(!session) return;
    ensureValidSession(function(ok){
      if(!ok) return;
      fetch(CLOUD.url+'/rest/v1/saves?user_id=eq.'+encodeURIComponent(session.user.id)+'&select=data,updated_at', { headers: authHeaders(true) })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function(rows){
          if(!rows || !rows.length || !rows[0].data) return; // 클라우드 세이브 없음 → 로컬 유지(다음 저장 때 업로드됨)
          var cloudD = rows[0].data, localD=null;
          try{ var raw=lsGet('bkdng_v45'); localD = raw?JSON.parse(raw):null; }catch(e){}
          if(pickNewerSave(localD, cloudD)==='cloud'){
            try{ lsSet('bkdng_v45', JSON.stringify(cloudD)); }catch(e){}
            if(typeof doLoad==='function' && doLoad(cloudD)){ showSt('☁️ 클라우드 진행도 불러옴!'); addLog('good','☁️ 클라우드에서 최신 진행도 복원'); }
          }
          cloudUpdateUI();
        }).catch(function(){});
    });
  };

  GLOBAL.cloudSignOut = function(){ saveSession(null); showSt('로그아웃됨 (로컬 진행은 그대로예요)'); addLog('neutral','☁️ 클라우드 로그아웃'); };
  GLOBAL.cloudIsSignedIn = function(){ return !!(session && session.user); };
  GLOBAL.cloudEmail = function(){ return (session && session.user && session.user.email) || ''; };

  // ── 부팅 시 초기화: 매직링크 복귀 처리 → 저장세션 복원 → 클라우드 pull ──
  GLOBAL.cloudInit = function(){
    // 1) 매직링크로 돌아온 경우 해시 토큰 처리
    var parsed = GLOBAL.location ? cloudParseHash(GLOBAL.location.hash||'') : null;
    if(parsed){
      saveSession(toSession(parsed));
      // URL에서 토큰 흔적 제거(공유/북마크 안전)
      try{ if(GLOBAL.history && GLOBAL.history.replaceState) GLOBAL.history.replaceState(null,'',GLOBAL.location.pathname + GLOBAL.location.search); }catch(e){}
      fetchUser(function(){ showSt('☁️ 로그인 완료!'); addLog('good','☁️ 클라우드 로그인 완료: '+cloudEmail()); cloudPull(); });
      return;
    }
    // 2) 기존 세션 복원
    loadStoredSession();
    if(session){ ensureValidSession(function(ok){ if(ok){ fetchUser(function(){ cloudPull(); }); } else { /* 재로그인 필요 — 로컬 플레이는 계속 */ cloudUpdateUI(); } }); }
    else cloudUpdateUI();
  };

  // UI 갱신 훅(백업 모달이 열려 있으면 상태부 다시 그림)
  GLOBAL.cloudUpdateUI = function(){ try{ if(typeof refreshCloudSection==='function') refreshCloudSection(); }catch(e){} };

  // 상태 요약(검증/디버그)
  GLOBAL.__cloud = { session:function(){return session;}, config:CLOUD, pickNewerSave:function(a,b){return pickNewerSave(a,b);} };
})();
