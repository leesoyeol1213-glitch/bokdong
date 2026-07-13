// ═══ analytics.js — 제공자 독립 계측 레이어 (로드 순서: analytics → data → render → logic → boot)
// 목적: 리텐션·퍼널을 "눈으로" 보기 위한 이벤트 계측.
// 프라이버시: 제공자(PostHog/GA 등)를 연결하기 전에는 외부로 아무것도 전송하지 않는다.
//            연결 전엔 메모리 버퍼 + (디버그시)콘솔만. → 커밋해도 데이터가 새지 않음.
// 연결법(무료 계정 키 받은 뒤): ANALYTICS_CONFIG 채우고 sendToProvider 몇 줄만 활성화.
(function(){
  var GLOBAL = (function(){ return this; })() || (typeof globalThis!=='undefined' ? globalThis : {});

  // 제공자 연결 전엔 provider=null → 전송 안 함. 예) {provider:'posthog', key:'phc_...', host:'https://us.i.posthog.com'}
  var ANALYTICS_CONFIG = { provider: null, key: null, host: null };

  var buffer = [];
  var anonId = null, firstSeen = null;
  var sessionStart = Date.now();

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

  function getAnonId(){
    if(anonId) return anonId;
    anonId = lsGet('bkdng_aid');
    if(!anonId){ anonId = 'a_'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); lsSet('bkdng_aid', anonId); }
    return anonId;
  }
  function getFirstSeen(){
    if(firstSeen) return firstSeen;
    firstSeen = lsGet('bkdng_first');
    if(!firstSeen){ firstSeen = String(Date.now()); lsSet('bkdng_first', firstSeen); }
    return firstSeen;
  }
  function daysSinceFirst(){ return Math.floor((Date.now()-parseInt(getFirstSeen(),10))/86400000); }

  // 제공자 전송부 — 키를 받으면 여기만 채우면 실측 시작.
  function sendToProvider(evt){
    // if(ANALYTICS_CONFIG.provider==='posthog' && GLOBAL.posthog){ GLOBAL.posthog.capture(evt.event, evt.props); }
    // if(ANALYTICS_CONFIG.provider==='ga' && GLOBAL.gtag){ GLOBAL.gtag('event', evt.event, evt.props); }
  }

  // 전역 track(event, props). 앱 어디서나 track('bike_buy',{id:'v6'}) 형태로 호출.
  GLOBAL.track = function(event, props){
    var evt = {
      event: event,
      props: Object.assign({ day: daysSinceFirst(), sess_s: Math.floor((Date.now()-sessionStart)/1000) }, props||{}),
      t: Date.now(),
      aid: getAnonId()
    };
    buffer.push(evt);
    if(buffer.length > 300) buffer.shift();
    if(GLOBAL.__ANALYTICS_DEBUG){ try{ console.log('[track]', event, evt.props); }catch(e){} }
    if(ANALYTICS_CONFIG.provider){ try{ sendToProvider(evt); }catch(e){} }
  };

  // 검증/디버그용 진입점
  GLOBAL.__analytics = {
    buffer: function(){ return buffer.slice(); },
    anonId: getAnonId,
    daysSinceFirst: daysSinceFirst,
    config: ANALYTICS_CONFIG
  };
})();
