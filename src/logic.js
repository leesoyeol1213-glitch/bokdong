// ═══ logic.js — 게임 로직·이벤트·미션·장비·저장/백업·탭 UI
// game.js(v9.19, 4758줄)에서 분할. 로드 순서: data → render → logic → boot (index.html)
// 전역 공유(모듈 아님) — 분할 전과 의미 동일.

// ── 게임 로직 ──────────────────────────────────────────
function cv2(){return VEHS.find(v=>v.id===S.vId)||VEHS[0];}

// 1번: 랜덤 다이스 시스템 제거됨 — autoPickNextDestination()이 도착 시 자동 호출

function toggleRide(){
  enforceJapanRule();  // 출발 직전 일본 규칙 강제
  // 1번: 목적지 없고 한국 일반 도시면 자동 랜덤 목적지 (컨셉: 충동적 세계일주)
  if(!S.dest && S.city!=='달' && !S.trapZone) autoPickNextDestination();
  S.riding=!S.riding;document.getElementById('ride-btn').textContent=S.riding?'■ 정지':'▶ 출발!';
  if(S.riding){tickIv=setInterval(tick,1000);startNpcTimer();}else{clearInterval(tickIv);tickIv=null;clearTimeout(npcIv);}
}
function startNpcTimer(){clearTimeout(npcIv);npcIv=setTimeout(()=>{if(S.riding)fireNpc();startNpcTimer();},60000+Math.random()*60000);}
// 일본 진입 규칙 강제: 일본은 부산 페리(buyFerryFromModal)로만 진입 가능.
// 한국에 있는데 목적지가 일본이면 → 잘못된 상태이므로 즉시 초기화 (어떤 경로로 오염됐든 자동 복구)
// 단, 정식 페리 탑승(S.onFerryToJapan=true)으로 부산→후쿠오카 가는 중은 예외.
function enforceJapanRule(){
  // 정식 페리로 일본행 중이면 통과 (부산→후쿠오카)
  if(S.onFerryToJapan && S.dest==='후쿠오카') return false;
  const cur = CITIES.find(c=>c.n===S.city);
  const inKorea = cur && cur.region !== '일본';
  if(inKorea && S.dest){
    const destCity = CITIES.find(c=>c.n===S.dest);
    if(destCity && destCity.region === '일본'){
      // 페리를 안 탔는데 일본이 목적지 = 비정상. 목적지 제거 후 한국 도시 재설정
      addLog('bad','⚠️ 일본은 부산 페리로만! 잘못된 목적지('+S.dest+') 취소');
      S.dest = null; S.sgKm = 0;
      if(!S.riding) autoPickNextDestination();
      return true;
    }
  }
  return false;
}
function tick(){
  enforceJapanRule();  // 매 tick마다 일본 규칙 강제
  if(S.hp<=0){
    S.riding=false;clearInterval(tickIv);tickIv=null;clearTimeout(npcIv);
    document.getElementById('ride-btn').textContent='▶ 출발!';
    addLog('bad','체력 바닥! 잠시 쉬어가자... (오프라인 시 1분당 체력+1)');
    playSfx('bad');
    // 7번 fix: 체력 고갈 시 강제 모달로 알림 (놓치지 않게)
    const u = 'var(--u)';
    const fs = px => `font-size:calc(${px<11?px+2:px}px * ${u})`;
    const hasApple = (S.ap||0) > 0;
    const hasJuice = (S.jc||0) > 0;
    const modalArea = document.getElementById('modal-area');
    if(modalArea){
      modalArea.innerHTML = `
      <div class="px-panel" style="border-color:#B71C1C;background:linear-gradient(135deg,#FFEBEE,#FFCDD2);margin-bottom:5px;box-shadow:0 0 calc(10px * ${u}) #E53935;">
        <div style="${fs(10)};color:#B71C1C;text-align:center;margin-bottom:6px;">💔 체력 고갈!</div>
        <div style="${fs(6)};color:#5C3D1E;background:#FFF8DC;border:2px solid #B71C1C;border-radius:6px;padding:8px;margin-bottom:8px;line-height:1.9;text-align:center;">
          임복동이 지쳤어요...<br>
          회복 후 다시 출발할 수 있어요!
        </div>
        <div style="${fs(6)};color:#3D2510;background:#FFF;border-radius:6px;padding:6px;margin-bottom:8px;line-height:1.8;">
          <b>회복 방법:</b><br>
          🍎 사과 (보유 ${S.ap||0}): 체력 +30<br>
          🧃 사과즙 (보유 ${S.jc||0}): 응급 +20 + 부스터<br>
          💤 오프라인 (앱 닫기): 1분당 +1
        </div>
        ${hasApple ? `<button class="px-btn" style="width:100%;${fs(7)};background:#4CAF50;border-color:#1B5E20;color:#FFF;margin-bottom:4px;" onclick="useApple();document.getElementById('modal-area').innerHTML='';">🍎 사과 먹기 (+30)</button>` : ''}
        ${hasJuice ? `<button class="px-btn" style="width:100%;${fs(7)};background:#FB8C00;border-color:#E65100;color:#FFF;margin-bottom:4px;" onclick="useJuice();document.getElementById('modal-area').innerHTML='';">🧃 사과즙 (응급+20)</button>` : ''}
        ${!hasApple && !hasJuice ? `<div style="${fs(5)};color:#B71C1C;text-align:center;padding:6px;background:#FFE0E0;border-radius:4px;margin-bottom:4px;">⚠️ 회복 아이템 없음! 잠시 앱을 닫아 오프라인 회복하세요.</div>` : ''}
        <button class="px-btn px-btn-gray" style="${fs(6)};width:100%;" onclick="document.getElementById('modal-area').innerHTML='';">닫기</button>
      </div>`;
    }
    update();
    return;
  }
  // 6번: 번개 직격 — 30초 정지
  if(S.disasterUntil && Date.now() < S.disasterUntil){
    update(); return;
  } else if(S.disasterUntil && Date.now() >= S.disasterUntil){
    S.disasterUntil = 0; S.disasterType = null;
    addLog('good','⚡ 회복! 다시 달릴 수 있다.');
  }
  // 5번: 독사과 도트 데미지 — 체력 10이 될 때까지
  if(S.poisonUntil && Date.now() < S.poisonUntil && S.hp > 10){
    S.hp = Math.max(10, S.hp - 0.4);
  } else if(S.poisonUntil && (Date.now() >= S.poisonUntil || S.hp <= 10)){
    S.poisonUntil = 0;
    addLog('neutral','☠️ 독 효과가 사라졌다.');
  }
  // 5번(재설계): 비자금 환수 — 거리 무관·시간 기반(고속 자전거에서도 반응/사용 시간 보장)
  if(S.blackMoneyUntil && Date.now() >= S.blackMoneyUntil){
    S.money -= 1000000;
    S.blackMoneyUntil = 0;
    S.blackMoneyTrigger = 0;
    addLog('bad','🚓 경찰: "비자금 환수합니다!" ₩1,000,000 회수');
  }
  if(S.riding&&!isResting)tyBuff();
  ensureWeather();
  const weather = getWeather();
  const eqBonus = getEquippedBonus();
  const v=cv2();
  // 7대죄 효과: 분노(속도+50%) / 색욕(속도-50%)
  let sinSpeedMult = 1.0;
  if(S.wrathUntil && Date.now() < S.wrathUntil) sinSpeedMult *= 1.5;
  else if(S.wrathUntil) S.wrathUntil = 0;
  if(S.lustUntil && Date.now() < S.lustUntil) sinSpeedMult *= 0.5;
  else if(S.lustUntil) S.lustUntil = 0;
  // 나태: 부스터 강제 차단
  if(S.slothUntil && Date.now() < S.slothUntil){
    if(S.dopT > 0) S.dopT = 0;
  } else if(S.slothUntil) {
    S.slothUntil = 0;
    addLog('good','😴 나태 효과 종료. 부스터 사용 가능!');
  }
  // 시기/식탐/교만 만료 알림
  if(S.envyUntil && Date.now() >= S.envyUntil){
    S.envyUntil = 0;
    addLog('good','😒 시기 효과 종료. 회복 아이템 사용 가능!');
  }
  if(S.wrathUntil===0 && S._wrathPrev){addLog('good','😡 분노 효과 종료.');}
  if(S.lustUntil===0 && S._lustPrev){addLog('good','💋 색욕 효과 종료.');}
  S._wrathPrev = !!S.wrathUntil;
  S._lustPrev = !!S.lustUntil;

  const baseSp = (v.sp + (S.dopT>0?S.dopSp:0) + (eqBonus.speedBonus||0)) * sinSpeedMult * prestigeMult();
  const wMod = weather.mod.speedMult || 1.0;
  const km=(baseSp * wMod)*.05;
  S.sgKm+=km;S.totKm+=km;
  const speedHpDrain = 0.30 * (v.sp / 6);
  const boostDrain = S.dopT > 0 ? 0.4 : 0;
  // 분노 시 체력 소모 ↑ (속도 +50%만큼 추가 소모)
  const wrathDrain = (S.wrathUntil && Date.now() < S.wrathUntil) ? 0.5 : 0;
  const totalDrain = speedHpDrain + boostDrain + wrathDrain;
  const regenAmount = (eqBonus.hpRegen || 0) * 0.25;
  const hpDrain = Math.max(0.05, totalDrain - regenAmount);
  S.hp=Math.max(0, Math.min(S.mhp, S.hp - hpDrain));
  // #2 자동 사과: 체력 30% 이하 + 사과 보유 시 자동 섭취(방치 지원). 조용히(로그 스팸 방지).
  if(S.autoApple && S.hp <= S.mhp*0.3 && S.ap>0){ S.ap--; S.hp=Math.min(S.mhp, S.hp+30); }
  const xpMult = 1 + (eqBonus.xpBonus||0);
  S.xp += km*2.5 * xpMult;
  if(S.dopT>0)S.dopT--;
  // 2번: 탐욕의 프레드 — 100km마다 약탈
  if(S.disasterFred){
    const f = S.disasterFred;
    const traveled = S.totKm - f.kmStart;
    if(traveled >= 1000){
      S.disasterFred = null;
      addLog('good','💸 탐욕의 프레드의 저주가 풀렸다!');
    } else if(S.totKm - f.lastTickKm >= 100){
      const loss = Math.floor(S.money * f.lossPct);
      if(loss > 0){
        S.money = Math.max(0, S.money - loss);
        addLog('bad','💸 탐욕의 프레드: 또 ₩'+loss.toLocaleString()+' 약탈! ('+Math.floor(traveled)+'/1000km)');
      }
      f.lastTickKm = S.totKm;
    }
  }
  trackMission('km', km);
  // 5번: 펫 진화 체크
  const prevStage = S._petStage || 1;
  const curStage = getPetStage().stage;
  if(curStage > prevStage){
    const newPet = getPetStage();
    addLog('good','✨ TY 진화! '+newPet.name+' (누적 '+Math.floor(S.totKm).toLocaleString()+'km)');
    S._petStage = curStage;
  } else if(!S._petStage){
    S._petStage = curStage;
  }
  if(S.xp>=S.xpMax){S.xp-=S.xpMax;S.lv++;S.xpMax=Math.floor(S.xpMax*1.35);S.sp++;S.money+=5000*S.lv;addLog('good','LEVEL UP! Lv.'+S.lv+' SP+1');playSfx('levelup');}
  if(S.dest&&S.sgKm>=S.sgTot){
    // 도착 보상에 장비 돈 보너스 + 컬렉션 보너스 + 날씨 돈 보너스 적용
    const total = Math.floor((S.visited.length/CITIES.length + S.foodDone.length/FOODS.length + S.npcs.filter(n=>n.met&&!n.locked).length/Math.max(1,S.npcs.filter(n=>!n.locked).length)) /3 * 100);
    const codexBonus = 1 + Math.floor(total/10) * 0.02;
    const moneyMult = (1 + (eqBonus.moneyBonus||0)) * codexBonus * (weather.mod.moneyMult || 1.0);
    let arriveMoney = Math.floor(20000 * moneyMult * prestigeMult());
    // 7대죄 #6 교만: 다음 도시 보상 -90%
    if(S.prideNextCity){
      arriveMoney = Math.floor(arriveMoney * 0.1);
      S.prideNextCity = false;
      addLog('bad','🦚 교만의 가오지훈의 저주! 도착 보상 -90%');
    }
    S.city=S.dest;S.dest=null;S.sgKm=0;S.money+=arriveMoney;S._jinchonForkShown=false;
    const ci=CITIES.find(c=>c.n===S.city)||CITIES[0];
    // 일본 도착 완료 → 페리 플래그 해제 (이후 일본 내 이동은 currentInJapan 로직이 담당)
    if(ci.region==='일본') S.onFerryToJapan = false;
    if(!S.visited.includes(S.city)){
      S.visited.push(S.city);
      // #6 여행 엽서 수집(도시별 1장, 첫 도착 시)
      collectPostcard(S.city);
    }
    addLog('good','🎉 '+S.city+' 도착! ₩'+arriveMoney.toLocaleString());addLog('neutral','📜 '+ci.hist);
    playSfx('arrive');
    trackMission('arrive');
    if(S.city==='달') trackMission('moon');
    showHistModal(ci);
  }
  // 2번: 달에서 — 목적지 없이 200km 라이딩, moonKm 누적
  if(S.city==='달'&&S.dest===null){
    S.moonKm = (S.moonKm||0) + km;
    if(S.moonKm>=200){
      S.moonKm=0;S.city='충주';S.money+=1000000;
      addLog('good','🌍 달 200km 완주! 충주로 귀환! ₩1,000,000 보상!!');
      addLog('neutral','"지구가... 이렇게 작아 보이는구나."');
      showHistModal(CITIES.find(c=>c.n==='충주')||CITIES[0]);
    }
  }
  // 3번(재설계): 함정 도시(신한/청학동) — 거리 무관·시간 기반 탈출 주사위(천장 있음)
  // 자전거 속도가 빨라도 자동으로 안 풀림 → 주사위가 실제로 의미 있음. 실패할수록 쉬워짐(rollEscapeDice).
  if(S.trapZone){
    const tz = S.trapZone;
    tz.secIn = (tz.secIn||0) + 1;   // tick = 1초
    tz.kmIn = (tz.kmIn||0) + km;     // 표시용(헛바퀴 누적 거리)
    // 8초마다 탈출 주사위 기회 +1 (속도 무관하게 일정)
    const reached = Math.floor(tz.secIn / 8);
    if(reached > (tz.lastChargeAt||0)){
      const gained = reached - (tz.lastChargeAt||0);
      tz.lastChargeAt = reached;
      tz.diceCharges = (tz.diceCharges||0) + gained;
      addLog('neutral','🎲 탈출 주사위 기회 +'+gained+' (메인 화면에서 굴리기!)');
    }
    // 자동 탈출 없음 — 오직 주사위로만 탈출
  }
  S.ecool--;if(S.ecool<=0&&Math.random()<.06){fireRandEvent();S.ecool=18;}
  // #5 진천 갈림길 표지판 (태양열 부스터 미획득 + 라이딩 중 + 한국 + 도착 임박 아닐 때)
  if(S.riding && S.dest && S.dest!=='진천' && !S.solarBoost && !S.trapZone && S.city!=='달'
     && !S._jinchonForkShown && S.sgKm < S.sgTot*0.8
     && document.getElementById('modal-area').innerHTML===''){
    const inJapan=(CITIES.find(c=>c.n===S.city)||{}).region==='일본';
    // 완주형 플레이어(6곳+ 방문했지만 진천 미방문)에겐 확률 상향, 그 외 기본 0.8%/초
    const p = (S.visited.length>=6 && !S.visited.includes('진천')) ? 0.02 : 0.008;
    if(!inJapan && Math.random()<p){ S._jinchonForkShown=true; offerJinchonFork(); }
  }
  checkAchievements();update();
}

// 3번: 모든 이벤트에 애니메이션 연동 + 2번: 달 우주 컨셉 이벤트
function fireRandEvent(){
  // 2번: 달에서는 우주 컨셉 이벤트만!
  if(S.city==='달'){
    const moonEvs=[
      {t:'good', m:'🐕 달사냥개가 꼬리를 흔든다! 체력+25', w:5,
        f:s=>{s.hp=Math.min(s.mhp,s.hp+25);evAnim='moondog';evTimer=120;}},
      {t:'good', m:'👽 외계 유튜버 협찬! ₩200,000', w:4,
        f:s=>{s.money+=200000;evAnim='alien_youtuber';evTimer=130;}},
      {t:'good', m:'🌕 달주민이 토끼떡을 줬다! 체력+30, 🍎+1', w:4,
        f:s=>{s.hp=Math.min(s.mhp,s.hp+30);s.ap+=1;evAnim='moonresident';evTimer=120;}},
      {t:'bad',  m:'☄️ 운석 충돌! 체력-20', w:3,
        f:s=>{s.hp=Math.max(0,s.hp-20);evAnim='meteor';evTimer=85;}},
      {t:'good', m:'⭐ 별똥별 소원! ₩50,000 + XP+100', w:4,
        f:s=>{s.money+=50000;s.xp+=100;evAnim='shooting_star';evTimer=120;}},
      {t:'bad',  m:'🌑 무중력 구간! -8km', w:3,
        f:s=>{s.moonKm=Math.max(0,(s.moonKm||0)-8);evAnim='zero_gravity';evTimer=90;}},
      {t:'good', m:'🛸 UFO 견인! +15km', w:3,
        f:s=>{s.moonKm=(s.moonKm||0)+15;evAnim='ufo';evTimer=110;}},
      {t:'good', m:'🌌 은하수 발견! XP+200', w:3,
        f:s=>{s.xp+=200;evAnim='galaxy';evTimer=110;}},
      {t:'bad',  m:'🦀 달 게가 다리를 물었다! 체력-10', w:2,
        f:s=>{s.hp=Math.max(0,s.hp-10);evAnim='mooncrab';evTimer=90;}},
      {t:'good', m:'💎 달 광물 채취! ₩300,000', w:2,
        f:s=>{s.money+=300000;evAnim='moon_mineral';evTimer=110;}},
    ];
    const total=moonEvs.reduce((sum,e)=>sum+e.w,0);
    let r=Math.random()*total;
    let ev=moonEvs[0];
    for(const e of moonEvs){r-=e.w; if(r<=0){ev=e;break;}}
    ev.f(S); addLog(ev.t, ev.m);
    return;
  }
  const evs=[
    {t:'good',m:'맑은 날씨! +4km',     w:5, f:s=>{s.sgKm+=4;}},
    {t:'bad', m:'소나기! 체력-15',      w:5, f:s=>{s.hp=Math.max(0,s.hp-15);evAnim='rain';evTimer=85;}},
    {t:'good',m:'내리막! +6km',         w:5, f:s=>{s.sgKm+=6;evAnim='downhill';evTimer=70;}},
    {t:'bad', m:'오르막 체력-10',        w:5, f:s=>{s.hp=Math.max(0,s.hp-10);evAnim='uphill';evTimer=70;}},
    {t:'good',m:'주민 음식! 체력+20',   w:4, f:s=>{s.hp=Math.min(s.mhp,s.hp+20);evAnim='food';evTimer=120;}},
    {t:'bad', m:'타이어 펑크! -12km',   w:4, f:s=>{s.sgKm=Math.max(0,s.sgKm-12);evAnim='flat';evTimer=75;}},
    {t:'good',m:'유튜버 촬영! ₩15,000',w:4, f:s=>{s.money+=15000;evAnim='youtuber';evTimer=120;}},
    {t:'bad', m:'강아지 추격! 체력-8',  w:4, f:s=>{s.hp=Math.max(0,s.hp-8);evAnim='dog';evTimer=110;}},
    // 1번: 킥라니 — 너무 자주 안 나오게 가중치 낮음
    {t:'bad', m:'🛴 킥라니 출현! 깜짝 놀랐다! 체력-8', w:1.5,
      f:s=>{
        evAnim='kicker';evTimer=110;s.hp=Math.max(0,s.hp-8);
        // 목적지는 절대 바꾸지 않음 (방향성 유지 컨셉) — 체력만 감소
      }},
    // 6번: 천재지변 — 매우 드물게
    {t:'bad', m:'⚡ 번개 직격! 30초 운행 정지!', w:0.4,
      f:s=>{s.disasterUntil = Date.now()+30000; s.disasterType='lightning'; evAnim='lightning';evTimer=180;
        s.hp=Math.max(5, s.hp-25);
      }},
    {t:'bad', m:'🌪️ 회오리바람! 30초간 펫·수호천사 효과 상실!', w:0.4,
      f:s=>{s.tornadoUntil = Date.now()+30000; evAnim='tornado';evTimer=180;}},
  ];
  // 가중치 기반 추첨
  const total = evs.reduce((sum,e)=>sum+e.w, 0);
  let r = Math.random()*total;
  let ev = evs[0];
  for(const e of evs){r -= e.w; if(r<=0){ev=e;break;}}
  ev.f(S);addLog(ev.t, ev.m);
}

// NPC 등급별 확률 + 7번: 전설 NPC 연고지 도착 시 +5% 보너스
var LEGEND_HOMETOWN = {
  rk:'서울', mc:'서울', ky:'부산', gu:'제천', hm:'충주', md:'인천', sx:'강릉', tk:'여수', br:'목포'
};
function fireNpc(){
  const rnd=Math.random();
  const god      =S.npcs.find(n=>n.grade==='god'   &&!n.met&&!n.locked);
  const epics    =S.npcs.filter(n=>n.grade==='epic' &&!n.met&&!n.locked);
  const legends  =S.npcs.filter(n=>n.grade==='legend'&&!n.met&&!n.locked);
  const disasters=S.npcs.filter(n=>n.grade==='disaster'&&!n.met&&!n.locked);
  const uniques  =S.npcs.filter(n=>n.grade==='unique'&&!n.met&&!n.locked);
  const rares    =S.npcs.filter(n=>n.grade==='rare'  &&!n.met&&!n.locked);
  const normals  =S.npcs.filter(n=>n.grade==='normal' &&!n.met&&!n.locked);
  // 7번: 연고지 보너스 — 전설 NPC가 자기 연고지에 있으면 5%p 가산
  const homeBonus = legends.some(n=>LEGEND_HOMETOWN[n.id]===S.city) ? 0.05 : 0;
  if(god      &&rnd<.012) {showNpcModal(god);return;}
  // 2번: 재앙 NPC — 전설과 동급 확률 (만나지 않은 경우만)
  if(disasters.length&&rnd<.020) {showDisasterNpcModal(disasters[Math.floor(Math.random()*disasters.length)]);return;}
  if(epics.length    &&rnd<.042) {showNpcModal(epics  [Math.floor(Math.random()*epics.length)]);return;}
  if(legends.length  &&rnd<(.122+homeBonus)) {
    // 1번 fix: 연고지 NPC만 100% 고정되는 버그 수정
    // 연고지 전설이 있으면 60% 확률로 우선, 40%는 전체 전설 풀에서 랜덤
    const homeLegends = legends.filter(n=>LEGEND_HOMETOWN[n.id]===S.city);
    let pool;
    if(homeLegends.length > 0 && Math.random() < 0.6){
      pool = homeLegends;  // 60% 확률로 연고지 우선
    } else {
      pool = legends;  // 40%는 전체에서 랜덤 (다양성 확보)
    }
    showNpcModal(pool[Math.floor(Math.random()*pool.length)]);return;
  }
  if(uniques.length&&rnd<.342) {showNpcModal(uniques[Math.floor(Math.random()*uniques.length)]);return;}
  if(rares.length  &&rnd<.692) {showNpcModal(rares  [Math.floor(Math.random()*rares.length)]);return;}
  if(normals.length&&rnd<.942) {showNpcModal(normals[Math.floor(Math.random()*normals.length)]);return;}
  // #4 여기 도달 = 이번 타이밍에 첫 만남 없음(대개 로스터를 다 만난 상태) → 재회 이벤트로 채움.
  //  긍정 NPC만, 축소 보상. 도감 완성 후에도 만남 이벤트가 살아있게 한다.
  const metPositive=S.npcs.filter(n=>n.met&&!n.locked&&n.grade!=='disaster');
  if(metPositive.length && Math.random()<0.4){
    showNpcReunion(metPositive[Math.floor(Math.random()*metPositive.length)]);
  }
}
// #4 NPC 재회 모달 (축소 보상 · met 변경 없음 · 아이템/eff 없음)
function showNpcReunion(npc){
  const wr=S.riding;if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}
  const em=NPC_EMOJI[npc.id]||'👤';
  const gc=GRADE_COLOR[npc.grade]||'#5C3D1E';
  const gb=GRADE_BG[npc.grade]||'#F5E6C8';
  const money=REUNION_MONEY[npc.grade]||500;
  const xp=Math.max(10,Math.floor(money/10));
  const line=REUNION_LINES[Math.floor(Math.random()*REUNION_LINES.length)];
  const key='npc_'+npc.id;
  const portrait=hasAsset(key)
    ? `<img src="${ASSETS_SOURCES[key]}" style="width:44px;height:44px;border:3px solid ${gc};border-radius:8px;image-rendering:pixelated;background:${gb};flex-shrink:0;box-shadow:2px 2px 0 ${gc};">`
    : `<div style="width:44px;height:44px;background:${gb};border:3px solid ${gc};border-radius:8px;box-shadow:2px 2px 0 ${gc};display:flex;align-items:center;justify-content:center;font-size:calc(22px * var(--u));flex-shrink:0;">${em}</div>`;
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:${gc};margin-bottom:5px;">
    <div style="text-align:center;font-size:calc(8px * var(--u));color:#8B6340;margin-bottom:5px;">🔄 다시 만난 인연</div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">
      ${portrait}
      <div><div style="font-size:calc(9px * var(--u));color:#3D2510;">${npc.n}</div>
      <div style="font-size:calc(8px * var(--u));color:#8B6340;">${npc.role}</div></div>
    </div>
    <div style="font-size:calc(9px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #D4B483;border-left:4px solid ${gc};border-radius:0 6px 6px 0;padding:7px 9px;margin-bottom:8px;line-height:2;">"${line}"</div>
    <div style="font-size:calc(8px * var(--u));color:#8B6340;margin-bottom:10px;">재회 선물: <span style="color:#3D2510;">₩${money.toLocaleString()} · XP+${xp}</span></div>
    <button class="px-btn px-btn-green" style="width:100%;font-size:calc(9px * var(--u));" onclick="acceptReunion('${npc.id}',${money},${xp},${wr})">반가워! 계속 달리자 ▶</button>
  </div>`;
}
function acceptReunion(id,money,xp,wr){
  const n=S.npcs.find(x=>x.id===id);
  S.money+=money;S.xp+=xp;
  if(n){evAnimNpc=n;evAnim='npc_reward';evTimer=100;addLog('good','🔄 '+(NPC_EMOJI[id]||'👤')+' '+n.n+' 재회! ₩'+money.toLocaleString()+', XP+'+xp);
    awardMythicIfLucky(n.grade); // 전설·에픽·신 재회 시에도 신화 드롭 가능(월간 미션 달성 경로)
  }
  closeModal(wr);
}
// 1번: 휴식 기능 제거됨. 오프라인 시 visibilitychange 핸들러에서 1분당 체력+1 회복
function doRest(){addLog('neutral','💡 휴식 기능은 제거됐어요. 오프라인 시 1분당 체력+1 자동 회복!');}
function useApple(){
  if(S.envyUntil && Date.now() < S.envyUntil){addLog('bad','😒 시기 효과: 회복 아이템 사용 불가!');return;}
  if(S.ap<=0){addLog('bad','사과 없음!');return;}
  S.ap--;S.hp=Math.min(S.mhp,S.hp+30);addLog('good','🍎 사과! 체력+30');
  playSfx('apple');
  // 1번 fix: 체력 0이었다가 회복됐고, 라이딩 중이 아니면 자동 출발 가능
  if(S.hp > 0 && !S.riding && !tickIv){
    addLog('good','🚴 체력 회복 완료! 출발 버튼을 눌러 다시 달리자!');
  }
  update();
}
function useJuice(){
  if(S.slothUntil && Date.now() < S.slothUntil){addLog('bad','😴 나태 효과: 부스터 사용 불가!');return;}
  if(S.envyUntil && Date.now() < S.envyUntil){addLog('bad','😒 시기 효과: 회복 아이템(부스터) 사용 불가!');return;}
  if(S.jc<=0){addLog('bad','사과즙 없음!');return;}
  // 1번 fix: 체력 0이면 부스터 사용 시 약간 회복도 (응급)
  if(S.hp <= 0){
    S.hp = 20;
    addLog('good','💉 응급 회복! 체력 20 (사과를 먹는 게 좋겠어!)');
  }
  S.jc--;
  const dur=Math.round(40+(S.end||0)*0.5);
  S.dopT=dur;
  boosterBubble=110;S.boostCount=(S.boostCount||0)+1;
  addLog('good','⚡ 부스터 ON! '+dur+'초 (기본 40 + 지구력 보너스)');
  playSfx('boost');
  update();
}
function checkAchievements(){
  ACHIEVEMENTS.forEach(ach=>{
    if(S.achievements.includes(ach.id))return;
    let ok=false;try{ok=ach.check(S);}catch(e){}
    if(ok){
      S.achievements.push(ach.id);
      const r=ach.rw;
      if(r.money)S.money+=r.money;if(r.xp)S.xp+=r.xp;if(r.sp)S.sp+=r.sp;if(r.jc)S.jc+=r.jc;if(r.hp)S.hp=Math.min(S.mhp,S.hp+r.hp);
      addLog('good','🏆 업적! '+ach.emoji+' '+ach.name);
    }
  });
}
// #1 오프라인 여행 진행 — 자리 비운 시간만큼 실제로 여정을 굴린다(방치형 핵심).
//  - 라이딩 중이었으면: 사과(연료)가 허용하는 만큼 이동·도착·레벨업 시뮬 → "여행 일지" 요약
//  - 정지 상태였으면: 기존대로 체력만 회복
//  이동거리는 (현재체력 + 사과수×30)km 로 자연 상한(사과가 연료). 시간 상한 8시간.
function applyOfflineReward(lastTime, wasRiding){
  const now=Date.now();
  const rawSec=Math.floor((now-lastTime)/1000);
  if(rawSec<60)return;
  const capped = rawSec > 8*3600;
  const sec=Math.min(rawSec,8*3600);
  const hm=(s)=>{const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return (h?h+'시간 ':'')+m+'분';};

  // 정지 상태로 나감 → 체력만 회복(1분당 +1)
  if(!wasRiding || !S.dest){
    const minutes=Math.floor(sec/60);
    const before=S.hp;
    S.hp=Math.min(S.mhp, S.hp+minutes);
    const hpRec=Math.round(S.hp-before); // 표시용 정수(내부 hp는 소수 유지)
    S.offlineCount=(S.offlineCount||0)+1;
    showTravelLog({resting:true, timeStr:hm(sec), hpRec, capped});
    return;
  }

  // 라이딩 중 → 여정 시뮬레이션
  window._offlineSim=true;
  const v=cv2();
  const kmPerSec=v.sp*0.05*prestigeMult(); // 프레스티지 배수(오프라인 이동 거리도 늘어남)
  const drainPerSec=Math.max(0.05, 0.05*v.sp); // tick과 동일한 ≈1HP/km
  let hp=S.hp, dist=0, moneyGain=0, xpGain=0, applesUsed=0, levelsUp=0, stoppedNoApple=false, arrivedCount=0;
  const arrived=[];
  let t=0;
  for(t=0;t<sec;t++){
    if(hp - drainPerSec <= 0){
      if(S.ap>0){ S.ap--; applesUsed++; hp=Math.min(S.mhp, hp+30); }
      else { stoppedNoApple=true; break; }
    }
    hp-=drainPerSec;
    dist+=kmPerSec; S.sgKm+=kmPerSec; S.totKm+=kmPerSec; xpGain+=kmPerSec*2.5;
    if(S.dest && S.sgKm>=S.sgTot){
      const city=S.dest;
      S.city=city; S.dest=null; S.sgKm=0;
      if(!S.visited.includes(city))S.visited.push(city);
      const m=20000; S.money+=m; moneyGain+=m; arrivedCount++;
      if(arrived.length<12) arrived.push(city);
      autoPickNextDestination(); // 조용히(로그 억제) 다음 목적지
      if(!S.dest) break; // 달·함정 등으로 더 못 가면 종료
    }
  }
  // 남은 시간은 정지 휴식 회복
  if(stoppedNoApple){ const restMin=Math.floor((sec-t)/60); hp=Math.min(S.mhp,hp+restMin); }
  S.hp=Math.max(0,Math.min(S.mhp,hp));
  // XP → 레벨업 일괄 처리
  S.xp+=xpGain;
  while(S.xp>=S.xpMax){ S.xp-=S.xpMax; S.lv++; S.xpMax=Math.floor(S.xpMax*1.35); S.sp++; const lm=5000*S.lv; S.money+=lm; moneyGain+=lm; levelsUp++; }
  S.offlineCount=(S.offlineCount||0)+1;
  window._offlineSim=false;
  showTravelLog({resting:false, timeStr:hm(sec), dist:Math.floor(dist), arrived, arrivedCount,
    moneyGain, xpGain:Math.floor(xpGain), applesUsed, levelsUp, stoppedNoApple, capped});
}

// #1 "여행 일지" 복귀 리포트 모달
function showTravelLog(info){
  const B='calc(6px * var(--u))', T='calc(8px * var(--u))', S6='calc(6px * var(--u))';
  let body;
  if(info.resting){
    body=`<div style="font-size:${S6};color:#5C3D1E;line-height:2;text-align:center;">
      💤 <b>${info.timeStr}</b> 동안 자리를 비웠어요.<br>
      ${info.hpRec>0?`❤️ 체력 +${info.hpRec} 회복`:'푹 쉬었어요.'}
      ${info.capped?'<br><span style="color:#8B6340;font-size:calc(7px * var(--u));">(최대 8시간까지 반영)</span>':''}
    </div>`;
  }else{
    const row=(label,val)=>`<div style="display:flex;justify-content:space-between;padding:calc(2px * var(--u)) 0;border-bottom:1px dashed #E0C9A6;"><span style="color:#8B6340;">${label}</span><b style="color:#5C3D1E;">${val}</b></div>`;
    const cities=info.arrivedCount>0
      ? info.arrived.join(', ')+(info.arrivedCount>info.arrived.length?` 외 ${info.arrivedCount-info.arrived.length}곳`:'')
      : '아직 도착 전';
    body=`<div style="font-size:${S6};color:#5C3D1E;line-height:1.7;">
      <div style="text-align:center;margin-bottom:calc(6px * var(--u));">🌏 <b>${info.timeStr}</b> 동안의 여정</div>
      ${row('🚴 이동 거리', info.dist.toLocaleString()+'km')}
      ${row('📍 도착', info.arrivedCount+'곳')}
      ${info.arrivedCount>0?`<div style="font-size:calc(7px * var(--u));color:#8B6340;padding:calc(3px * var(--u)) 0;text-align:center;">${cities}</div>`:''}
      ${row('💰 벌이', '₩'+info.moneyGain.toLocaleString())}
      ${row('⭐ 경험치', 'XP +'+info.xpGain.toLocaleString()+(info.levelsUp>0?` (Lv +${info.levelsUp})`:''))}
      ${row('🍎 사과 사용', info.applesUsed+'개')}
      ${info.stoppedNoApple?`<div style="color:#B71C1C;font-size:calc(7px * var(--u));text-align:center;padding-top:calc(4px * var(--u));">🍎 사과가 떨어져 도중에 멈췄어요! 출발 전 넉넉히 챙겨가세요.</div>`:''}
      ${info.capped?`<div style="color:#8B6340;font-size:calc(7px * var(--u));text-align:center;">(최대 8시간까지 반영)</div>`:''}
    </div>`;
  }
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:#1976D2;margin-bottom:5px;box-shadow:0 0 calc(10px * var(--u)) #64B5F6;">
    <div style="font-size:${T};color:#1976D2;text-align:center;margin-bottom:calc(8px * var(--u));">📖 여행 일지</div>
    <div style="background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:calc(8px * var(--u));margin-bottom:calc(8px * var(--u));">${body}</div>
    <button class="px-btn px-btn-green" style="width:100%;font-size:calc(9px * var(--u));padding:calc(10px * var(--u));" onclick="document.getElementById('modal-area').innerHTML='';if(typeof update==='function')update();">확인 ▶</button>
  </div>`;
}

// ── 팝업 ───────────────────────────────────────────────
function showHistModal(ci){
  const wr=S.riding;if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}

  // 2번 fix: 부산 도착 — 일본행 페리 구매 팝업 (100% 등장, 도쿄/오사카만 갈 수 있는 유일한 경로)
  if(ci.special==='ferry'){
    // 3번 fix: 일본 코스 5개 완주 직후 부산 귀국 시는 페리 안 띄움 (쿨다운)
    // S.justReturnedFromJapan 플래그가 있으면 일반 OX 퀴즈로 진행
    if(S.justReturnedFromJapan){
      S.justReturnedFromJapan = false;
      addLog('good','🇰🇷 일본 코스 완주 후 부산 귀국! 잠시 쉬어가자.');
      // 일반 OX 퀴즈로 fall through
    } else {
    const ferryPrice = 200000;
    const canAfford = S.money >= ferryPrice;
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:#0277BD;background:linear-gradient(135deg,#E1F5FE,#FFF8E1);margin-bottom:5px;box-shadow:0 0 calc(12px * var(--u)) #29B6F6;">
      <div style="font-size:calc(11px * var(--u));color:#01579B;text-align:center;margin-bottom:6px;">⛴️ 부산 도착!</div>
      <div style="font-size:calc(8px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #0277BD;border-radius:5px;padding:6px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(9px * var(--u));color:#01579B;background:linear-gradient(135deg,#E1F5FE,#B3E5FC);border:3px dashed #0277BD;border-radius:8px;padding:10px;margin-bottom:8px;text-align:center;line-height:2;">
        🇯🇵 <b>일본행 페리 출항 가능!</b><br>
        <span style="font-size:calc(10px * var(--u));color:#B71C1C;">₩${ferryPrice.toLocaleString()}</span><br>
        <span style="font-size:calc(7px * var(--u));color:#8B6340;line-height:1.6;">⛴️ 부산 ↔ 후쿠오카 페리<br>🍣 5개 일본 도시 탐험 가능<br>🛒 부산에서만 구매 가능!</span>
      </div>
      ${canAfford
        ? `<button class="px-btn" style="width:100%;font-size:calc(10px * var(--u));padding:calc(10px * var(--u));background:#0277BD;border-color:#01579B;margin-bottom:6px;box-shadow:calc(3px * var(--u)) calc(3px * var(--u)) 0 #002F5F;color:#FFF;" onclick="buyFerryFromModal(${wr})">⛴️ 구매하시겠습니까? (₩${ferryPrice.toLocaleString()})</button>`
        : `<div style="font-size:calc(9px * var(--u));color:#B71C1C;background:#FFE0E0;border:2px solid #E53935;border-radius:6px;padding:8px;text-align:center;margin-bottom:6px;line-height:1.8;">자금 부족!<br>보유: ₩${S.money.toLocaleString()} / 필요: ₩${ferryPrice.toLocaleString()}</div>`}
      <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(9px * var(--u));" onclick="closeModal(${wr})">다음 기회에... ▶</button>
    </div>`;
    return;
    }
  }

  // 나로호발사센터 특별 도착 화면 — 로켓 구매 전용 팝업 (희소!)
  if(ci.special==='rocket'){
    const hasRocket=vehOwned('rocket');
    const canAfford=S.money>=80000;
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:#FF6D00;background:linear-gradient(135deg,#FFF3E0,#E3F2FD);margin-bottom:5px;box-shadow:0 0 calc(12px * var(--u)) #FFCC02;">
      <div style="font-size:calc(11px * var(--u));color:#E65100;text-align:center;margin-bottom:6px;">🚀 나로호발사센터 도착!</div>
      <div style="font-size:calc(8px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #FF6D00;border-radius:5px;padding:6px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(9px * var(--u));color:#E65100;background:linear-gradient(135deg,#FFF8E1,#FFE082);border:3px dashed #FFCC02;border-radius:8px;padding:10px;margin-bottom:8px;text-align:center;line-height:2;">
        ${hasRocket
          ? '🚀 <b>임복동1호 보유 중!</b><br>발사하시겠어요?'
          : `✨ <b>임복동1호 구매 기회!</b><br><span style="font-size:calc(10px * var(--u));color:#B71C1C;">₩80,000</span><br><span style="font-size:calc(7px * var(--u));color:#8B6340;line-height:1.6;">⚠️ 1회용 · 5% 폭발 확률<br>🌕 발사 성공 시 달 도착<br>🛒 이곳에서만 구매 가능!</span>`}
      </div>
      ${hasRocket
        ? `<button class="px-btn" style="width:100%;font-size:calc(10px * var(--u));padding:calc(10px * var(--u));background:#E53935;border-color:#B71C1C;margin-bottom:6px;box-shadow:calc(3px * var(--u)) calc(3px * var(--u)) 0 #6D0000;" onclick="closeModalAndLaunch(${wr})">🚀 지금 발사!</button>`
        : (canAfford
          ? `<button class="px-btn px-btn-green" style="width:100%;font-size:calc(10px * var(--u));padding:calc(10px * var(--u));margin-bottom:6px;" onclick="buyRocketFromModal(${wr})">💰 구매하시겠습니까? (₩80,000)</button>`
          : `<div style="font-size:calc(9px * var(--u));color:#B71C1C;background:#FFE0E0;border:2px solid #E53935;border-radius:6px;padding:8px;text-align:center;margin-bottom:6px;line-height:1.8;">자금 부족!<br>보유: ₩${S.money.toLocaleString()} / 필요: ₩80,000</div>`)
      }
      <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(9px * var(--u));" onclick="closeModal(${wr})">${hasRocket?'나중에 발사':'다음 기회에...'} ▶</button>
    </div>`;
    return;
  }

  // 4번: 달 특별 도착 화면
  if(ci.special==='moon'){
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:#FFD700;background:linear-gradient(135deg,#0A0A2E,#1A1A4E);margin-bottom:5px;">
      <div style="font-size:calc(11px * var(--u));color:#FFD700;text-align:center;margin-bottom:8px;">🌕 달 도착!!</div>
      <div style="font-size:calc(8px * var(--u));color:#E0E0FF;background:rgba(255,255,255,.08);border:2px solid #FFD700;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2.2;text-align:center;">
        히든스페이스 발견!<br>🐰 토끼가 반겨준다<br>
        <span style="font-size:calc(7px * var(--u));color:#AAAAFF;">달에서 200km를 달리면<br>충주로 귀환합니다</span>
      </div>
      <div style="font-size:calc(8px * var(--u));color:#FFD700;background:rgba(255,215,0,.12);border:2px solid #FFD700;border-radius:6px;padding:6px;text-align:center;margin-bottom:8px;">
        🎉 달 도착 보상: ₩500,000
      </div>
      <button class="px-btn" style="width:100%;font-size:calc(9px * var(--u));background:#FFD700;border-color:#B8860B;color:#1A0A00;" onclick="closeModal(${wr})">달 라이딩 시작! 🌕</button>
    </div>`;
    return;
  }

  // 3번: 신한 / 지리산청학동 — 함정 도시 (200km 무의미 라이딩)
  if(ci.special==='trap_shinhan' || ci.special==='trap_cheonghak'){
    const isShinhan = ci.special==='trap_shinhan';
    const titleColor = isShinhan ? '#FF6F00' : '#33691E';
    const bgGradient = isShinhan
      ? 'linear-gradient(135deg,#FFF3E0,#FFE082)'
      : 'linear-gradient(135deg,#E8F5E9,#C8E6C9)';
    const subText = isShinhan
      ? '☀️ 햇빛이 너무 따갑다... 멀리서 염전 노예가 손짓한다.<br><span style="color:#B71C1C;">"형씨, 잠깐만 와봐~ 도와줘~"</span>'
      : '⛰️ 갓을 쓴 훈장님이 회초리를 들고 다가온다.<br><span style="color:#B71C1C;">"교통법규 교육 시간이다. 200km 강행군!"</span>';
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:${titleColor};background:${bgGradient};margin-bottom:5px;">
      <div style="font-size:calc(10px * var(--u));color:${titleColor};text-align:center;margin-bottom:6px;">⚠️ ${ci.n} 도착!! ⚠️</div>
      <div style="font-size:calc(8px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid ${titleColor};border-radius:6px;padding:7px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(8px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2;text-align:center;">${subText}</div>
      <div style="font-size:calc(8px * var(--u));color:#B71C1C;background:#FFE0E0;border:2px solid #B71C1C;border-radius:6px;padding:6px;margin-bottom:8px;text-align:center;line-height:1.8;">
        🚷 무의미한 라이딩 200km 진행<br>50km마다 주사위 6 나오면 탈출 가능
      </div>
      <button class="px-btn px-btn-red" style="width:100%;font-size:calc(9px * var(--u));" onclick="enterTrapZone('${ci.special}',${wr})">탈출 시도 시작...</button>
    </div>`;
    return;
  }

  // 2번: 대구 서커스(불의 고리) 삭제됨 — 일반 도시로 처리

  // 8번: 진천 — 닥터 오 등장 + 태양열 부스터 업그레이드 퀴즈
  if(ci.special==='jinchon'){
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:#FF8F00;background:linear-gradient(135deg,#FFF8E1,#FFECB3);margin-bottom:5px;">
      <div style="font-size:calc(10px * var(--u));color:#E65100;text-align:center;margin-bottom:6px;">☀️ 진천 도착!</div>
      <div style="font-size:calc(8px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #FF8F00;border-radius:5px;padding:6px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(8px * var(--u));color:#3D2510;background:#FFF;border:2px solid #FFD54F;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2;text-align:center;">
        👩‍🔬 <b>닥터 오</b>: "어서 오세요!<br>퀴즈 3문제를 맞추면 사과즙을<br><b style="color:#E65100;">태양열 부스터</b>로 업그레이드해드릴게요!"
        ${S.solarBoost?'<br><br><span style="color:#1B5E20;">✅ 이미 업그레이드 완료!</span>':''}
      </div>
      ${S.solarBoost
        ? `<button class="px-btn" style="width:100%;font-size:calc(9px * var(--u));" onclick="closeModal(${wr})">계속 달리자 ▶</button>`
        : `<button class="px-btn px-btn-orange" style="width:100%;font-size:calc(9px * var(--u));margin-bottom:5px;" onclick="startDrOQuiz(${wr})">퀴즈 도전!</button>
           <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(9px * var(--u));" onclick="closeModal(${wr})">나중에</button>`}
    </div>`;
    return;
  }

  // 3번: 도시별 OX 퀴즈 풀에서 랜덤 선택
  const cityQs=OX_BY_CITY[ci.n]||OX_QS;
  const q=cityQs[Math.floor(Math.random()*cityQs.length)];
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:#C0A060;background:#FFF8DC;margin-bottom:5px;">
    <div style="font-size:calc(9px * var(--u));color:#5C3D1E;text-align:center;margin-bottom:5px;">🎉 ${ci.n} 도착!</div>
    <div style="font-size:calc(9px * var(--u));color:#8B6340;background:#F5E6C8;border:2px solid #C0A060;border-radius:5px;padding:6px;margin-bottom:8px;line-height:1.9;">📜 ${ci.hist}</div>
    <div style="font-size:calc(9px * var(--u));color:#5C3D1E;margin-bottom:6px;">역사 OX 퀴즈!</div>
    <div style="font-size:calc(9px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:7px;margin-bottom:10px;line-height:1.9;">${q.q}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">
      <button class="px-btn px-btn-gray" style="font-size:calc(9px * var(--u));padding:12px;" onclick="ansOX(true,${q.a},\`${q.ex}\`,${wr})">O</button>
      <button class="px-btn px-btn-red" style="font-size:calc(9px * var(--u));padding:12px;" onclick="ansOX(false,${q.a},\`${q.ex}\`,${wr})">X</button>
    </div>
    <div style="font-size:calc(9px * var(--u));color:#8B6340;text-align:center;">정답시 ₩5,000 + XP+20</div>
  </div>`;
}

// ── 3번(재설계): 함정 도시 — 시간 기반 탈출 주사위 + 천장(실패할수록 쉬워짐) ─────
function enterTrapZone(special, wr){
  // secIn: 갇힌 초, lastChargeAt: 마지막 기회 지급 시점(8초 단위), tries: 실패 횟수(천장용)
  S.trapZone = {special, secIn: 0, kmIn: 0, lastChargeAt: 0, diceCharges: 1, tries: 0};
  S.dest = null; S.sgKm = 0;
  // closeModal이 wr이면 자동으로 riding 재개. 중복 setInterval 방지.
  closeModal(wr);
  if(!wr && !S.riding){
    S.riding=true;
    document.getElementById('ride-btn').textContent='■ 정지';
    if(!tickIv){tickIv=setInterval(tick,1000);startNpcTimer();}
  }
  addLog('bad', special==='trap_shinhan' ? '🏖️ 신한 탈출 시작! 주사위 6이면 탈출 — 실패할수록 쉬워져요! (8초마다 기회+1)' : '⛰️ 청학동 탈출 시작! 주사위 6이면 탈출 — 실패할수록 쉬워져요! (8초마다 기회+1)');
}
// 필요 눈금: 실패 없을 땐 6, 1번 실패마다 -1 → 6번째엔 무조건 성공(천장)
function escapeNeed(tries){ return Math.max(1, 6 - (tries||0)); }
function rollEscapeDice(){
  const tz = S.trapZone;
  if(!tz) return;
  if((tz.diceCharges||0) <= 0){ showSt('탈출 기회 없음 — 잠시 뒤 기회가 생겨요 (8초마다 +1)'); return; }
  tz.diceCharges -= 1; // 기회 1회 소진
  const need = escapeNeed(tz.tries);
  diceAnim = 60;
  diceVal = Math.ceil(Math.random()*6);
  update(); // 남은 기회 즉시 버튼에 반영
  setTimeout(()=>{
    if(!S.trapZone){ return; } // 이미 탈출/이동한 경우 방어
    if(diceVal >= need){
      addLog('good','🎲 '+diceVal+'! (필요 '+need+'↑) 탈출 성공!');
      S.trapZone = null;
      S.money += 100000;
      showEscapeDestModal();
    } else {
      S.trapZone.tries = (S.trapZone.tries||0) + 1;
      const nextNeed = escapeNeed(S.trapZone.tries);
      addLog('bad','🎲 '+diceVal+'... (필요 '+need+'↑) 실패! 다음엔 '+nextNeed+'↑면 성공 (기회 '+(S.trapZone.diceCharges||0)+'회 남음)');
      update();
    }
  }, 800);
}

// 3번: 함정 탈출 후 목적지 선택 모달
function showEscapeDestModal(){
  const wr = S.riding;
  if(S.riding){S.riding=false;clearInterval(tickIv);tickIv=null;}
  // 이동 가능한 도시 목록 (현재 도시·달·일본·진천·함정 제외)
  const isJapan = c => c.region==='일본';
  const candidates = CITIES.filter(c =>
    c.n !== S.city &&
    c.n !== '달' &&
    c.n !== '진천' &&
    c.region !== '함정' &&
    !isJapan(c)
  );
  // #4: 안 가본 도시를 최소 1곳 보장(도시 컬렉션 유도), 나머지는 랜덤
  const visited = S.visited || [];
  const unvisited = candidates.filter(c => !visited.includes(c.n));
  const picked = [];
  if(unvisited.length){
    picked.push(unvisited[Math.floor(Math.random() * unvisited.length)]);
  }
  const pool = candidates.filter(c => !picked.includes(c));
  while(picked.length < 4 && pool.length > 0){
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  const u = 'var(--u)';
  const fs = px => `font-size:calc(${px<11?px+2:px}px * ${u})`;
  const btnsHtml = picked.map(c => {
    const isNew = !visited.includes(c.n);
    const badge = isNew ? ` <span style="${fs(5)};background:#FFEB3B;color:#5D4037;border-radius:4px;padding:0 calc(3px * ${u});">NEW</span>` : '';
    return `<button class="px-btn" style="${fs(7)};padding:calc(8px * ${u});background:#43A047;border-color:#1B5E20;color:#FFF;width:100%;margin-bottom:calc(4px * ${u});" onclick="selectEscapeDest('${c.n}',${wr})">📍 ${c.n} <span style="${fs(5)};opacity:.85;">(${c.region})</span>${badge}</button>`;
  }).join('');
  document.getElementById('modal-area').innerHTML = `
  <div class="px-panel" style="border-color:#43A047;background:linear-gradient(135deg,#E8F5E9,#FFFDE7);box-shadow:0 0 calc(10px * ${u}) #66BB6A;margin-bottom:5px;">
    <div style="${fs(9)};color:#1B5E20;text-align:center;margin-bottom:6px;">🎉 탈출 성공!</div>
    <div style="${fs(6)};color:#5C3D1E;background:#FFF8DC;border:2px solid #43A047;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2;text-align:center;">
      💰 보상 ₩100,000 획득!<br>
      이제 어디로 떠날까?
    </div>
    ${btnsHtml}
    <button class="px-btn px-btn-gray" style="${fs(6)};width:100%;margin-top:calc(2px * ${u});" onclick="selectEscapeDest('충주',${wr})">🏠 그냥 충주로 귀환</button>
  </div>`;
}

function selectEscapeDest(destName, wr){
  // 4번 fix: 현재 도시(신한/청학동)를 그대로 두고 새 목적지로 출발 (자연스러움)
  // 단, S.city가 함정 도시면 가장 가까운 일반 도시(충주)로 우선 이동했다고 처리
  const fromCity = (S.city === '신한' || S.city === '지리산청학동') ? S.city : (S.city || '충주');
  S.dest = destName;
  S.sgKm = 0;
  S.sgTot = getCityDist(fromCity, destName);
  // 거리가 음수/NaN이면 폴백
  if(!S.sgTot || S.sgTot <= 0) S.sgTot = 100;
  addLog('good','🚴 '+fromCity+'에서 '+destName+'까지 ('+S.sgTot+'km) 출발!');
  document.getElementById('modal-area').innerHTML = '';
  // 라이딩 자동 재개
  if(wr || !S.riding){
    S.riding = true;
    document.getElementById('ride-btn').textContent = '■ 정지';
    if(!tickIv){tickIv=setInterval(tick,1000);startNpcTimer();}
  }
  update();
}

// ── 8번: 닥터 오 퀴즈 — 태양열 부스터 ────────────────
var DR_O_QUIZ = [
  {q:'태양광 발전의 핵심 소재는?', opts:['실리콘','구리','알루미늄','철'], ans:0,
   ex:'실리콘 반도체로 광기전 효과 발생'},
  {q:'태양은 평균적으로 지구 표면 1m²에 약 몇 W의 에너지를 전달할까?',
   opts:['100W','500W','1,000W','5,000W'], ans:2, ex:'정오 기준 약 1,000W/m²'},
  {q:'태양광 패널의 최대 효율은 보통 몇 % 정도일까?',
   opts:['10%','20%','40%','80%'], ans:1, ex:'상용 패널은 약 18~22%'},
  {q:'한국에서 태양광 발전이 가장 왕성한 도시는?',
   opts:['진천','강릉','부산','목포'], ans:0, ex:'진천 솔라파크가 유명'},
  {q:'태양열을 이용한 자전거 부스터의 원리에 가장 가까운 것은?',
   opts:['핵분열','광합성','광기전 효과','전자기 유도'], ans:2, ex:'광기전 효과(PV)'},
];
function startDrOQuiz(wr){
  S.drOQuiz = {step:0, correct:0, wr};
  showDrOQuestion();
}
function showDrOQuestion(){
  const q = DR_O_QUIZ[S.drOQuiz.step];
  document.getElementById('modal-area').innerHTML = `
  <div class="px-panel" style="border-color:#FF8F00;background:#FFF8E1;margin-bottom:5px;">
    <div style="font-size:calc(9px * var(--u));color:#E65100;text-align:center;margin-bottom:5px;">👩‍🔬 닥터 오 퀴즈 (${S.drOQuiz.step+1}/3)</div>
    <div style="font-size:calc(8px * var(--u));color:#8B6340;text-align:center;margin-bottom:6px;">맞춘 개수: ${S.drOQuiz.correct}</div>
    <div style="font-size:calc(9px * var(--u));color:#3D2510;background:#FFF;border:2px solid #FFD54F;border-radius:6px;padding:8px;margin-bottom:9px;line-height:1.9;">${q.q}</div>
    ${q.opts.map((o,i)=>`<button class="px-btn px-btn-sm" style="width:100%;margin-bottom:4px;text-align:left;font-size:calc(8px * var(--u));" onclick="answerDrO(${i})">${i+1}. ${o}</button>`).join('')}
  </div>`;
}
function answerDrO(sel){
  const q = DR_O_QUIZ[S.drOQuiz.step];
  if(sel===q.ans){
    S.drOQuiz.correct++;
    addLog('good','✅ 정답! ('+q.ex+')');
  } else {
    addLog('bad','❌ 오답... 정답: '+q.opts[q.ans]+' ('+q.ex+')');
  }
  S.drOQuiz.step++;
  if(S.drOQuiz.step >= 3){
    // 3문제 완료 — 2개 이상 맞으면 통과
    const pass = S.drOQuiz.correct >= 2;
    const wr = S.drOQuiz.wr;
    if(pass){
      S.solarBoost = true;
      S.dopSp = (S.dopSp||5) + 5; // 부스터 추가 속도 +5
      addLog('good','☀️ 태양열 부스터 업그레이드 완료! 부스터 속도 +5 영구 강화!');
      document.getElementById('modal-area').innerHTML = `
      <div class="px-panel" style="border-color:#FFD700;background:linear-gradient(135deg,#FFF8E1,#FFE082);margin-bottom:5px;">
        <div style="font-size:calc(11px * var(--u));color:#E65100;text-align:center;margin-bottom:8px;">☀️ 태양열 부스터 획득!</div>
        <div style="font-size:calc(8px * var(--u));color:#3D2510;text-align:center;margin-bottom:8px;line-height:2;">
          닥터 오: "축하해요!<br>이제 부스터가 태양에너지로 강화됐어요."<br>
          <span style="color:#E65100;font-weight:bold;">부스터 속도 +5 영구!</span>
        </div>
        <button class="px-btn" style="width:100%;font-size:calc(9px * var(--u));" onclick="closeModal(${wr})">감사합니다!</button>
      </div>`;
    } else {
      addLog('bad','퀴즈 통과 실패... ('+S.drOQuiz.correct+'/3) 다음에 다시 도전!');
      document.getElementById('modal-area').innerHTML = `
      <div class="px-panel" style="border-color:#B71C1C;margin-bottom:5px;">
        <div style="font-size:calc(10px * var(--u));color:#B71C1C;text-align:center;margin-bottom:8px;">😔 퀴즈 실패</div>
        <div style="font-size:calc(8px * var(--u));color:#3D2510;text-align:center;margin-bottom:8px;line-height:2;">
          닥터 오: "아쉽네요... ${S.drOQuiz.correct}/3<br>다음에 다시 와주세요!"
        </div>
        <button class="px-btn" style="width:100%;font-size:calc(9px * var(--u));" onclick="closeModal(${wr})">아쉽다...</button>
      </div>`;
    }
    S.drOQuiz = null;
    update();
  } else {
    showDrOQuestion();
  }
}

// ── 2번: 재앙 NPC 모달 ─────────────────────────────────
function showDisasterNpcModal(npc){
  playSfx('sin');
  const wr=S.riding;if(S.riding){S.riding=false;clearInterval(tickIv);tickIv=null;}
  evAnimNpc=npc;evAnim='npc';evTimer=240;
  const line = npc.lines[Math.floor(Math.random()*npc.lines.length)];
  const em = NPC_EMOJI[npc.id]||'☠️';
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:#5D0303;background:linear-gradient(135deg,#3D0000,#7B1FA2);margin-bottom:5px;">
    <div style="font-size:calc(10px * var(--u));color:#FFE082;text-align:center;margin-bottom:6px;">☠️ 재앙 NPC 출현 ☠️</div>
    <div style="text-align:center;font-size:calc(28px * var(--u));margin-bottom:8px;">${em}</div>
    <div style="font-size:calc(10px * var(--u));color:#FFCDD2;text-align:center;margin-bottom:4px;">${npc.n}</div>
    <div style="font-size:calc(8px * var(--u));color:#FFAB91;text-align:center;margin-bottom:8px;">${npc.role}</div>
    <div style="font-size:calc(8px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #5D0303;border-radius:5px;padding:7px;margin-bottom:8px;line-height:2;">"${line}"</div>
    <div style="font-size:calc(8px * var(--u));color:#FFE082;background:rgba(255,255,255,.1);border:2px solid #FFE082;border-radius:6px;padding:6px;margin-bottom:8px;text-align:center;">⚠️ ${npc.reward}</div>
    <button class="px-btn px-btn-red" style="width:100%;font-size:calc(9px * var(--u));" onclick="acceptNpc('${npc.id}',${wr})">…피할 수 없다</button>
  </div>`;
}

// ── 5번: 사과즙 박스 ───────────────────────────────────
function buyJuiceBox(){
  if(S.money<15000){addLog('bad','돈 부족! (₩15,000 필요)');return;}
  S.money -= 15000;
  const r = Math.random();
  let type;
  if(r < 0.96) type='normal';
  else if(r < 0.99) type='poison';
  else type='blackmoney';
  showJuiceBoxResult(type);
}
// 1번: 결과를 아이템 탭에 인라인으로 표시 (8초 후 자동 사라짐)
var juiceBoxResult = null;  // {type, title, msg, color, bg, until}
function showJuiceBoxResult(type){
  let title, color, bg, msg, logMsg, logKind;
  if(type==='normal'){
    const heal = Math.floor(S.mhp * 0.8);
    S.hp = Math.min(S.mhp, S.hp + heal);
    title = '🍎 정상 사과즙!';
    color = '#2E7D32'; bg = 'linear-gradient(135deg,#E8F5E9,#C8E6C9)';
    msg = `정말 깨끗하고 맛있는 사과즙이다.<br><b style="color:#1B5E20;">체력 ${heal} 회복!</b>`;
    logMsg = '🍎 정상 사과즙! 체력 +'+heal;
    logKind = 'good';
  } else if(type==='poison'){
    S.poisonUntil = Date.now() + 60000;
    title = '☠️ 독 사과즙!';
    color = '#5D0303'; bg = 'linear-gradient(135deg,#FFCDD2,#EF9A9A)';
    msg = `<span style="color:#5D0303;">악취가 진동하는 액체다...<br>지속적으로 체력이 감소한다!</span><br><b style="color:#B71C1C;">체력 10까지 도트 데미지 (60초)</b>`;
    logMsg = '☠️ 독 사과즙... 체력 도트 데미지 시작!';
    logKind = 'bad';
  } else {
    S.money += 1000000;
    S.blackMoneyUntil = Date.now() + 40000;   // 40초 뒤 경찰 환수(속도 무관, 그 안에 쓰면 이득)
    title = '💰 비자금 사과박스!';
    color = '#E65100'; bg = 'linear-gradient(135deg,#FFF3E0,#FFD54F)';
    msg = `<span style="color:#3D2510;">박스 안에 빳빳한 만원권이 가득!</span><br><b style="color:#E65100;">₩1,000,000 즉시 입금!</b><br><span style="font-size:calc(7px * var(--u));color:#B71C1C;">⚠️ 약 40초 후 경찰 환수 — 그 전에 쓰면 이득!</span>`;
    logMsg = '💰 비자금 박스! ₩1,000,000 입금 (곧 경찰...)';
    logKind = 'good';
  }
  juiceBoxResult = {type, title, msg, color, bg, until: Date.now()+8000};
  addLog(logKind, logMsg);
  // 아이템 탭이 현재 보이는 중이면 즉시 갱신
  if(curTab==='item') renderItems();
  // 8초 후 자동 사라짐 → 아이템 탭 갱신
  setTimeout(()=>{
    juiceBoxResult = null;
    if(curTab==='item') renderItems();
  }, 8000);
  update();
}
function dismissJuiceBoxResult(){
  juiceBoxResult = null;
  if(curTab==='item') renderItems();
}
function ansOX(pick,ans,ex,wr){
  if(pick===ans){
    S.money+=5000;S.xp+=20;
    addLog('good','OX 정답! ₩5,000 + XP+20');
    oxResult={type:'correct',timer:90,msg:'정답! +₩5,000'};
    setTimeout(()=>dropGear('quiz'), 300);
  }else{
    addLog('bad','OX 오답 ('+ex+')');
    oxResult={type:'wrong',timer:90,msg:'오답... ('+ex+')'};
  }
  closeModal(wr);
}

// 1번: 다음 목적지 선택 모달 (사용자가 직접 고름)
function showNpcModal(npc){
  const wr=S.riding;if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}
  evAnimNpc=npc;evAnim='npc';evTimer=240;
  const line=npc.lines[Math.floor(Math.random()*npc.lines.length)];
  const em=NPC_EMOJI[npc.id]||'👤';
  const gc=GRADE_COLOR[npc.grade]||'#5C3D1E';
  const gb=GRADE_BG[npc.grade]||'#F5E6C8';
  const gl=GRADE_LABEL[npc.grade]||'일반';
  const isCV=npc.id==='cv';
  // 🎨 NPC 픽셀 초상화 등록되어 있으면 이미지 사용, 없으면 이모지
  const npcAssetKey = 'npc_' + npc.id;
  const portraitHtml = hasAsset(npcAssetKey)
    ? `<img src="${ASSETS_SOURCES[npcAssetKey]}" style="width:48px;height:48px;border:3px solid ${gc};border-radius:8px;image-rendering:pixelated;flex-shrink:0;background:${gb};box-shadow:2px 2px 0 ${gc};">`
    : `<div style="width:48px;height:48px;background:${gb};border:3px solid ${gc};border-radius:8px;box-shadow:2px 2px 0 ${gc};display:flex;align-items:center;justify-content:center;font-size:calc(24px * var(--u));flex-shrink:0;">${em}</div>`;
  // 🎨 UI 프레임 등록되어 있으면 모달 배경에 적용
  const useFrame = hasAsset('ui_npc_frame');
  const panelExtra = useFrame
    ? `background:url('${ASSETS_SOURCES.ui_npc_frame}') center/100% 100% no-repeat;border:none;box-shadow:none;padding:24px;`
    : (isCV?'background:linear-gradient(135deg,#E3F2FD,#F3E5F5);border-color:#1565C0;':'');
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="${panelExtra}margin-bottom:5px;">
    <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">
      ${portraitHtml}
      <div>
        <div style="font-size:calc(9px * var(--u));color:#3D2510;margin-bottom:3px;">${npc.n}</div>
        <div style="font-size:calc(9px * var(--u));color:#8B6340;margin-bottom:4px;">${npc.role}</div>
        <span style="background:${gc};color:#FFF;font-size:calc(9px * var(--u));padding:2px 5px;border-radius:3px;">[${gl}]</span>
      </div>
    </div>
    ${isCV?`<div style="font-size:calc(9px * var(--u));color:#1565C0;background:#E3F2FD;border-radius:6px;padding:5px 8px;margin-bottom:8px;font-style:italic;">${npc.special||''}</div>`:''}
    <div style="font-size:calc(9px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #D4B483;border-left:4px solid ${gc};border-radius:0 6px 6px 0;padding:7px 9px;margin-bottom:8px;line-height:2;">"${line}"</div>
    <div style="font-size:calc(9px * var(--u));color:#8B6340;margin-bottom:10px;">보상: <span style="color:#3D2510;">${npc.reward}</span></div>
    <button class="px-btn" style="width:100%;font-size:calc(9px * var(--u));" onclick="acceptNpc('${npc.id}',${wr})">${isCV?'...잘 가. (음료를 받는다)':'고마워! 계속 달리자! ▶'}</button>
  </div>`;
}
function acceptNpc(id,wr){
  const n=S.npcs.find(x=>x.id===id);
  if(n&&!n.locked){
    n.eff(S);n.met=true;
    addLog(n.grade==='disaster'?'bad':'good',(NPC_EMOJI[n.id]||'👤')+' '+n.n+(n.grade==='disaster'?' 의 저주!':' 만남! ')+n.reward);
    // 재앙 NPC는 보상 애니 대신 빨간 화면 효과
    if(n.grade==='disaster'){
      evAnim='disaster_aftermath'; evTimer=120;
    } else {
      evAnimNpc=n;evAnim='npc_reward';evTimer=100;
      trackMission('npc');
    }
    awardMythicIfLucky(n.grade);
  }
  closeModal(wr);
}
// 전설·에픽·신 NPC(첫 만남/재회 공용)에서 확률적으로 신화 장비 지급. 월간 '신화 장비' 미션의 반복 획득 경로.
function awardMythicIfLucky(grade){
  if(!['legend','epic','god'].includes(grade)) return;
  const mythicItem = tryDropMythic(grade);
  if(!mythicItem) return;
  S.inventory = S.inventory || [];
  if(S.inventory.length < BAG_CAPACITY){
    S.inventory.push(mythicItem);
  } else {
    const order = {common:0,rare:1,unique:2,legend:3,epic:4,mythic:5};
    let lowestIdx=0;
    for(let i=1;i<S.inventory.length;i++) if(order[S.inventory[i].rarity]<order[S.inventory[lowestIdx].rarity]) lowestIdx=i;
    S.gearDust=(S.gearDust||0)+RARITY_DUST[S.inventory[lowestIdx].rarity];
    S.inventory.splice(lowestIdx,1);
    S.inventory.push(mythicItem);
  }
  const r = GEAR_RARITY.find(rr=>rr.key==='mythic');
  addLog('good', `✨🌟 [${r.label}] 등장! ${getSlotIcon(mythicItem.slot)} ${mythicItem.name} 획득!! 🌟✨`);
  setTimeout(()=>showGearDropAnim(mythicItem), 500);
  playSfx('mythic');
  trackMission('mythic');
  refreshTabBadges();
}
let pendingSpecial=null; // 맛집 후 다시 띄울 특수 이벤트 도시(부산 페리·나로호·진천 등)
function openFood(){
  const food=FOODS.find(f=>f.c===S.city);
  if(!food){ if(!modalOpen())addLog('neutral','등록된 맛집 없음'); return; }
  ensureMissions();  // 자정 지났으면 오늘 방문 기록(foodToday) 리셋
  if((S.foodToday||[]).includes(S.city)){ if(!modalOpen())addLog('neutral','오늘 이미 방문! (자정에 초기화돼요)'); return; }
  // 특수 이벤트 모달이 열린 채 맛집을 누르면, 맛집이 끝난 뒤 그 이벤트를 다시 띄운다(이벤트 손실 방지)
  const ci=CITIES.find(c=>c.n===S.city);
  if(modalOpen() && ci && ci.special && !['moon','trap_shinhan','trap_cheonghak'].includes(ci.special)){
    pendingSpecial = ci;
  }
  const wr=S.riding;if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}
  if(food.type==='timing')showTimingGame(food,wr);
  else if(food.type==='rps')showRpsGame(food,wr);
  else showTapGame(food,wr);
}
// 8번: 가위바위보 미니게임 (3판 2선승)
function showRpsGame(food,wr){
  const isMoon = food.c==='달';
  const npcName = isMoon ? '🐰 달토끼 사장' : '🚀 로켓단 두목';
  const intro = isMoon ? '"가위바위보로 떡 받아가렴~"' : '"가위바위보 이기면 식사 무료!"';
  const headerBg = isMoon ? 'background:linear-gradient(135deg,#FFE0F0,#FFF8DC);' : 'background:linear-gradient(135deg,#FFE0CC,#FFF8DC);';
  document.getElementById('modal-area').innerHTML = `
  <div class="px-panel" style="${headerBg}border-color:${isMoon?'#FFB6C1':'#FF6D00'};margin-bottom:5px;">
    <div style="text-align:center;font-size:calc(10px * var(--u));margin-bottom:5px;">${food.e}</div>
    <div style="font-size:calc(9px * var(--u));color:#3D2510;text-align:center;margin-bottom:3px;">${food.n}</div>
    <div style="font-size:calc(8px * var(--u));color:#8B6340;text-align:center;margin-bottom:6px;">${npcName} — ${intro}</div>
    <div id="rps-score" style="font-size:calc(9px * var(--u));color:#5C3D1E;text-align:center;margin-bottom:8px;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:5px;">나 0 : 0 ${isMoon?'토끼':'두목'} (3판 2선승)</div>
    <div id="rps-result" style="font-size:calc(9px * var(--u));color:#5C3D1E;text-align:center;margin-bottom:8px;min-height:calc(30px * var(--u));">선택해 주세요!</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:calc(5px * var(--u));">
      <button class="px-btn" style="font-size:calc(10px * var(--u));padding:calc(10px * var(--u));" onclick="doRps('rock')">✊<br>바위</button>
      <button class="px-btn" style="font-size:calc(10px * var(--u));padding:calc(10px * var(--u));" onclick="doRps('paper')">🖐️<br>보</button>
      <button class="px-btn" style="font-size:calc(10px * var(--u));padding:calc(10px * var(--u));" onclick="doRps('scissor')">✌️<br>가위</button>
    </div>
  </div>`;
  rpsState = {food, wr, my:0, op:0, finished:false};
}
var rpsState = null;
const RPS_EMOJI = {rock:'✊', paper:'🖐️', scissor:'✌️'};
const RPS_NAME  = {rock:'바위', paper:'보',  scissor:'가위'};
function doRps(myPick){
  if(!rpsState || rpsState.finished) return;
  const opts = ['rock','paper','scissor'];
  const opPick = opts[Math.floor(Math.random()*3)];
  let outcome; // 'win'|'lose'|'draw'
  if(myPick===opPick) outcome='draw';
  else if(
    (myPick==='rock'&&opPick==='scissor') ||
    (myPick==='paper'&&opPick==='rock') ||
    (myPick==='scissor'&&opPick==='paper')
  ) outcome='win';
  else outcome='lose';

  if(outcome==='win') rpsState.my++;
  if(outcome==='lose') rpsState.op++;

  const isMoon = rpsState.food.c==='달';
  const opName = isMoon?'토끼':'두목';
  document.getElementById('rps-score').textContent = `나 ${rpsState.my} : ${rpsState.op} ${opName}`;
  document.getElementById('rps-result').innerHTML =
    `<div style="font-size:calc(13px * var(--u));margin:3px 0;">${RPS_EMOJI[myPick]} VS ${RPS_EMOJI[opPick]}</div>`+
    `<div style="font-size:calc(9px * var(--u));color:${outcome==='win'?'#1B5E20':outcome==='lose'?'#B71C1C':'#5C3D1E'};">`+
    (outcome==='win'?'🎉 이겼다!':outcome==='lose'?'😢 졌다':'🤝 비김')+`</div>`;

  // 2선승 결과 처리
  if(rpsState.my>=2 || rpsState.op>=2){
    rpsState.finished = true;
    setTimeout(()=>{
      if(rpsState.my>=2) foodOk(rpsState.food, rpsState.wr, isMoon?2000:1500);
      else foodFail(rpsState.food, rpsState.wr);
      rpsState=null;
    }, 900);
  }
}
function showTimingGame(food,wr){
  let pos=0,dir=1,spd=2.8,running=true,iv;
  document.getElementById('modal-area').innerHTML=`<div class="px-panel" style="margin-bottom:5px;"><div style="text-align:center;font-size:calc(9px * var(--u));margin-bottom:4px;">${food.e}</div><div style="font-size:calc(9px * var(--u));color:#3D2510;text-align:center;margin-bottom:2px;">${food.n}</div><div style="font-size:calc(9px * var(--u));color:#8B6340;text-align:center;margin-bottom:9px;">초록 구간에서 클릭!</div><div style="position:relative;background:#5C3D1E;border:3px solid #3D2510;border-radius:3px;height:20px;margin-bottom:11px;overflow:hidden;"><div style="position:absolute;top:3px;bottom:3px;left:38%;width:24%;background:#4CAF50;border-radius:2px;"></div><div id="t-ind" style="position:absolute;top:2px;bottom:2px;width:14px;background:#E53935;border-radius:2px;left:0%;transition:none;"></div></div><button class="px-btn px-btn-blue" style="width:100%;font-size:calc(9px * var(--u));padding:12px;" onclick="doTiming()">지금!</button></div>`;
  window.doTiming=()=>{running=false;clearInterval(iv);if(pos>=37&&pos<=63)foodOk(food,wr,800);else foodFail(food,wr);};
  iv=setInterval(()=>{if(!running)return;pos+=dir*spd;if(pos>=95){pos=95;dir=-1;}else if(pos<=0){pos=0;dir=1;}const el=document.getElementById('t-ind');if(el)el.style.left=pos+'%';},40);
}
function showTapGame(food,wr){
  let cnt=0,alive=true;
  document.getElementById('modal-area').innerHTML=`<div class="px-panel" style="margin-bottom:5px;"><div style="text-align:center;font-size:calc(9px * var(--u));margin-bottom:4px;">${food.e}</div><div style="font-size:calc(9px * var(--u));color:#3D2510;text-align:center;margin-bottom:2px;">${food.n}</div><div style="font-size:calc(9px * var(--u));color:#8B6340;text-align:center;margin-bottom:8px;">5초 안에 12번!</div><div style="font-size:calc(9px * var(--u));color:#3D2510;text-align:center;margin:6px 0;" id="tap-cnt">0 / 12</div><div style="font-size:calc(9px * var(--u));color:#8B6340;text-align:center;margin-bottom:9px;" id="tap-t">5초</div><button class="px-btn px-btn-green" style="width:100%;font-size:calc(9px * var(--u));padding:13px;" onclick="doTap()">먹어! 🍴</button></div>`;
  let t=5;const iv=setInterval(()=>{t--;const el=document.getElementById('tap-t');if(el)el.textContent=t+'초';if(t<=0){clearInterval(iv);alive=false;if(cnt<12)foodFail(food,wr);}},1000);
  window.doTap=()=>{if(!alive)return;cnt++;const el=document.getElementById('tap-cnt');if(el)el.textContent=cnt+' / 12';if(cnt>=12){clearInterval(iv);alive=false;foodOk(food,wr,800);}};
}
function showFoodQuiz(food,wr){
  const qd=FOOD_QUIZ[food.c]||{q:'퀴즈!',opts:['A','B','C','D'],ans:0};
  document.getElementById('modal-area').innerHTML=`<div class="px-panel" style="margin-bottom:5px;"><div style="text-align:center;font-size:calc(9px * var(--u));margin-bottom:4px;">${food.e}</div><div style="font-size:calc(9px * var(--u));color:#3D2510;text-align:center;margin-bottom:8px;">${food.n} 퀴즈!</div><div style="font-size:calc(9px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #D4B483;border-radius:5px;padding:7px;margin-bottom:9px;line-height:1.9;">${qd.q}</div>${qd.opts.map((o,i)=>`<button class="px-btn px-btn-sm" style="width:100%;margin-bottom:4px;text-align:left;font-size:calc(9px * var(--u));" onclick="checkFoodQ(${i},${qd.ans},'${food.c}',${wr})">${i+1}. ${o}</button>`).join('')}</div>`;
}
function checkFoodQ(sel,ans,city,wr){const food=FOODS.find(f=>f.c===city);if(sel===ans)foodOk(food,wr,800);else foodFail(food,wr);}
function foodOk(food,wr,bonus){
  if(!S.foodDone.includes(food.c)) S.foodDone.push(food.c);   // 도감용 영구 기록
  S.foodToday = S.foodToday || []; if(!S.foodToday.includes(food.c)) S.foodToday.push(food.c); // 오늘 방문(자정 리셋)
  S.foodStreak = (S.foodStreak||0) + 1;
  const reward=bonus*10;
  S.money+=reward;S.xp+=500;S.hp=Math.min(S.mhp,S.hp+20);
  addLog('good',food.e+' '+food.n+' 성공! ₩'+reward.toLocaleString());
  evAnim='food_ok';evTimer=100;
  trackMission('food');
  closeModal(wr);
  setTimeout(()=>{
    if(food.c==='달') dropGear('moon');
    else              dropGear('food');
  }, 300);
}
function foodFail(food,wr){
  S.money+=2000; // 2번: 실패도 10배
  addLog('bad',food.e+' 아쉽... ₩2,000');
  evAnim='food_fail';evTimer=80;
  closeModal(wr);
}
// 모달(팝업)이 열려 있는지 — 메인 화면 버튼이 열린 모달을 덮어쓰는 사고 방지용
function modalOpen(){
  const m=document.getElementById('modal-area');
  return !!(m && m.innerHTML.trim()!=='');
}
function closeModal(wr){
  document.getElementById('modal-area').innerHTML='';
  // 맛집 등으로 잠시 가려졌던 특수 이벤트(페리·로켓·닥터오)를 다시 띄운다.
  // 도착 시점처럼 라이딩 상태로 복원해, 이벤트를 닫으면 정상적으로 다시 달리게 한다.
  if(pendingSpecial){ const ci=pendingSpecial; pendingSpecial=null; S.riding=true; showHistModal(ci); return; }
  // 1번: 모달 닫힐 때 목적지가 없고 함정/달도 아니면 자동으로 새 목적지 설정
  autoPickNextDestination();
  if(wr&&!isResting){S.riding=true;tickIv=setInterval(tick,1000);startNpcTimer();}
  update();
}
// 1번: 자동으로 다음 목적지 설정 (충동적 세계일주 컨셉)
function autoPickNextDestination(){
  if(S.dest) return;        // 이미 목적지 있으면 절대 변경 안 함 (방향성 유지)
  if(S.riding) return;      // 1번 fix: 라이딩 중엔 목적지 재설정 차단 (안전장치)
  if(S.city==='달') return;
  if(S.trapZone) return;
  // 후보: 현재 도시 제외, 달 제외, 진천 제외(특수)
  const isJapan = c => c.region==='일본';
  const currentInJapan = isJapan(CITIES.find(c=>c.n===S.city)||{});
  let others=CITIES.filter(c=>c.n!==S.city && c.n!=='달' && c.n!=='진천');
  if(currentInJapan){
    // 3번 fix: 일본 5개 도시 모두 방문해야 부산으로 귀국 가능 (코스 완주 룰)
    const japanCities = CITIES.filter(c=>isJapan(c)).map(c=>c.n);
    const visitedJapan = japanCities.filter(c=>S.visited.includes(c));
    const allJapanDone = visitedJapan.length >= japanCities.length;
    if(allJapanDone){
      // 모든 일본 도시 방문 완료 → 부산으로 귀국 강제
      others = [CITIES.find(c=>c.n==='부산')];
      S.justReturnedFromJapan = true;  // 3번 fix: 페리 쿨다운 플래그
    } else {
      // 아직 일본 코스 미완 → 미방문 일본 도시만 후보
      const unvisited = others.filter(c=>isJapan(c) && !S.visited.includes(c.n));
      if(unvisited.length > 0){
        others = unvisited;
      } else {
        // 전부 방문했으면 부산
        others = [CITIES.find(c=>c.n==='부산')];
      }
    }
  } else {
    // 한국에 있으면 한국 도시만. 일본 진입은 부산 도착 시 페리 팝업으로만 가능
    others = others.filter(c=>!isJapan(c));
  }
  if(!others.length) return;
  const pick=others[Math.floor(Math.random()*others.length)];
  S.dest=pick.n;
  S.sgKm=0;
  S.sgTot=getCityDist(S.city,pick.n);
  if(window._offlineSim) return; // 오프라인 시뮬 중엔 로그 스팸 방지(여행 일지로 대신 요약)
  if(currentInJapan && pick.n==='부산'){
    addLog('good','⛴️ 일본 코스 완주! 부산으로 귀국! ('+S.sgTot+'km)');
  } else if(currentInJapan){
    addLog('neutral','🚴 일본 코스 진행 중... '+S.city+'→'+pick.n+' ('+S.sgTot+'km)');
  } else {
    addLog('neutral','🎲 충동! '+S.city+'→'+pick.n+' ('+S.sgTot+'km)');
  }
}

// #5 진천 갈림길 표지판 — 라이딩 중 진천 태양광단지 우회를 제안(유일한 진천 진입 경로).
//  "충동 여행(목적지 랜덤)" 컨셉을 지키면서 딱 하나의 선택권을 준다. 태양열 부스터 획득 후엔 안 뜸.
function offerJinchonFork(){
  const dist=getCityDist(S.city,'진천');
  showConfirmModal({
    title:'🛤 갈림길 발견!',
    message:`'진천 태양광단지 →' 표지판이 보인다.\n닥터 오 박사가 사과즙을 태양열 부스터로\n강화해준다는데... 들러볼까? (${dist}km)`,
    okText:'☀️ 진천으로', cancelText:'그냥 지나친다', color:'#E65100',
    onOk:()=>{
      S.dest='진천'; S.sgKm=0; S.sgTot=dist; S._jinchonForkShown=true;
      addLog('good','🛤 샛길로! 진천 태양광단지로 향한다 ('+dist+'km)');
      update();
    }
  });
}

// ── 1번: 일일/주간/월간 미션 시스템 ────────────────────
var MISSIONS = {
  daily: [
    {id:'d_km',     emoji:'🚴', name:'오늘 100km',      desc:'오늘 100km 달리기',          target:100,  type:'todayKm',     rw:{money:30000, xp:100}},
    {id:'d_arrive', emoji:'📍', name:'한 곳 도착',       desc:'아무 도시 1번 도착',         target:1,    type:'todayArrive', rw:{money:20000, xp:80}},
    {id:'d_food',   emoji:'🍴', name:'맛집 한 곳',       desc:'맛집 1곳 클리어',            target:1,    type:'todayFood',   rw:{money:25000, jc:1}},
    {id:'d_npc',    emoji:'🤝', name:'NPC 1명',         desc:'NPC 아무나 1명 만나기',      target:1,    type:'todayNpc',    rw:{money:30000, xp:80}},
  ],
  weekly: [
    {id:'w_km',     emoji:'🛣️', name:'주간 1,000km',    desc:'이번 주 1,000km 달리기',     target:1000, type:'weekKm',      rw:{money:300000, sp:1}},
    {id:'w_npc',    emoji:'👥', name:'NPC 5명',         desc:'이번 주 NPC 5명 만나기',     target:5,    type:'weekNpc',     rw:{money:200000, xp:400}},
    {id:'w_legend', emoji:'⭐', name:'전설 장비',        desc:'전설 등급 장비 1개 획득',    target:1,    type:'weekLegend',  rw:{money:500000, sp:1}},
    {id:'w_moon',   emoji:'🌕', name:'달 방문',          desc:'달 1회 방문',                target:1,    type:'weekMoon',    rw:{money:1000000, sp:2}},
  ],
  monthly: [
    {id:'m_km',     emoji:'🏔️', name:'월간 5,000km',    desc:'이번 달 5,000km 누적',       target:5000, type:'monthKm',     rw:{money:1500000, sp:3}},
    {id:'m_mythic', emoji:'✨', name:'신화 장비',        desc:'신화 장비 1개 획득',         target:1,    type:'monthMythic', rw:{money:5000000, sp:5}},
    {id:'m_food',   emoji:'🍱', name:'전국 미식회',      desc:'이번 달 맛집 10곳',          target:10,   type:'monthFood',   rw:{money:1000000, sp:2}},
  ],
};
// 미션 진행도 추적 + 자동 리셋
function ensureMissions(){
  if(!S.missions) S.missions = {progress:{}, claimed:[], dailyResetAt:0, weeklyResetAt:0, monthlyResetAt:0};
  const now = Date.now();
  const day = 24*60*60*1000;
  // 일일 리셋
  if(!S.missions.dailyResetAt || now > S.missions.dailyResetAt){
    MISSIONS.daily.forEach(m=>{S.missions.progress[m.id]=0; S.missions.claimed = S.missions.claimed.filter(id=>id!==m.id);});
    S.foodToday = [];  // #2: 맛집 오늘 방문 기록 자정 리셋 → 매일 재방문 가능
    const next = new Date(); next.setHours(24,0,0,0); S.missions.dailyResetAt = next.getTime();
  }
  // 주간 리셋 (월요일 00:00)
  if(!S.missions.weeklyResetAt || now > S.missions.weeklyResetAt){
    MISSIONS.weekly.forEach(m=>{S.missions.progress[m.id]=0; S.missions.claimed = S.missions.claimed.filter(id=>id!==m.id);});
    const d = new Date(); const day0 = d.getDay()===0?7:d.getDay(); // 일=7
    d.setDate(d.getDate()+(8-day0)); d.setHours(0,0,0,0);
    S.missions.weeklyResetAt = d.getTime();
  }
  // 월간 리셋 (1일 00:00)
  if(!S.missions.monthlyResetAt || now > S.missions.monthlyResetAt){
    MISSIONS.monthly.forEach(m=>{S.missions.progress[m.id]=0; S.missions.claimed = S.missions.claimed.filter(id=>id!==m.id);});
    const d = new Date(); d.setMonth(d.getMonth()+1, 1); d.setHours(0,0,0,0);
    S.missions.monthlyResetAt = d.getTime();
  }
}
function trackMission(type, amount){
  ensureMissions();
  amount = amount || 1;
  // 6번 fix: 미션 달성 감지용 — 진행도 변경 전 상태 저장
  function bumpProgress(m, add){
    const before = S.missions.progress[m.id] || 0;
    const after = before + add;
    S.missions.progress[m.id] = after;
    // 달성 순간 감지 (이전엔 미달, 이번에 달성)
    if(before < m.target && after >= m.target && !S.missions.claimed.includes(m.id)){
      addLog('good','🎯 미션 달성! [' + m.name + '] — 미션 탭에서 보상 수령!');
      playSfx('good');
    }
  }
  Object.values(MISSIONS).flat().forEach(m=>{
    if(m.type===type) bumpProgress(m, amount);
  });
  // 일일/주간/월간 km 동시 추적용 alias
  if(type==='km'){
    ['todayKm','weekKm','monthKm'].forEach(k=>{
      Object.values(MISSIONS).flat().forEach(m=>{
        if(m.type===k) bumpProgress(m, amount);
      });
    });
  }
  if(type==='arrive'){
    Object.values(MISSIONS).flat().forEach(m=>{
      if(m.type==='todayArrive') bumpProgress(m, 1);
    });
  }
  if(type==='food'){
    ['todayFood','monthFood'].forEach(k=>{
      Object.values(MISSIONS).flat().forEach(m=>{
        if(m.type===k) bumpProgress(m, 1);
      });
    });
  }
  if(type==='npc'){
    ['todayNpc','weekNpc'].forEach(k=>{
      Object.values(MISSIONS).flat().forEach(m=>{
        if(m.type===k) bumpProgress(m, 1);
      });
    });
  }
  if(type==='legend'){
    Object.values(MISSIONS).flat().forEach(m=>{
      if(m.type==='weekLegend') bumpProgress(m, 1);
    });
  }
  if(type==='mythic'){
    Object.values(MISSIONS).flat().forEach(m=>{
      if(m.type==='monthMythic') bumpProgress(m, 1);
    });
  }
  if(type==='moon'){
    Object.values(MISSIONS).flat().forEach(m=>{
      if(m.type==='weekMoon') bumpProgress(m, 1);
    });
  }
}
function claimMission(id){
  ensureMissions();
  const m = Object.values(MISSIONS).flat().find(x=>x.id===id);
  if(!m) return;
  if(S.missions.claimed.includes(id)) return;
  if((S.missions.progress[id]||0) < m.target) return;
  S.missions.claimed.push(id);
  // 어떤 풀에 속한 미션인지 찾아서 누적 카운트
  if(MISSIONS.daily.find(x=>x.id===id))   S.missions.totalDailyClaimed   = (S.missions.totalDailyClaimed||0) + 1;
  if(MISSIONS.weekly.find(x=>x.id===id))  S.missions.totalWeeklyClaimed  = (S.missions.totalWeeklyClaimed||0) + 1;
  if(MISSIONS.monthly.find(x=>x.id===id)) S.missions.totalMonthlyClaimed = (S.missions.totalMonthlyClaimed||0) + 1;
  if(m.rw.money) S.money += m.rw.money;
  if(m.rw.xp) S.xp += m.rw.xp;
  if(m.rw.sp) S.sp += m.rw.sp;
  if(m.rw.jc) S.jc += m.rw.jc;
  addLog('good','🎯 '+m.name+' 보상 수령! +₩'+(m.rw.money||0).toLocaleString()+(m.rw.sp?' SP+'+m.rw.sp:'')+(m.rw.xp?' XP+'+m.rw.xp:'')+(m.rw.jc?' 🧃+'+m.rw.jc:''));
  renderMission();update();
}
function renderMission(){
  ensureMissions();
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  const sectionTitles = {daily:'📅 일일 미션', weekly:'🗓️ 주간 미션', monthly:'📆 월간 미션'};
  const resetKeys = {daily:'dailyResetAt', weekly:'weeklyResetAt', monthly:'monthlyResetAt'};
  let html = '';
  ['daily','weekly','monthly'].forEach(period=>{
    const resetAt = S.missions[resetKeys[period]];
    const left = resetAt ? Math.max(0, resetAt - Date.now()) : 0;
    const h = Math.floor(left/3600000), m = Math.floor((left%3600000)/60000);
    const lbl = period==='daily' ? `(${h}h ${m}m 후 리셋)` : period==='weekly' ? `(${Math.floor(h/24)}일 ${h%24}h 후)` : `(${Math.floor(h/24)}일 후)`;
    html += `<div class="px-panel" style="margin-bottom:calc(6px * ${u});">
      <div style="${fs(8)};color:#3D2510;margin-bottom:calc(6px * ${u});">${sectionTitles[period]} <span style="${fs(5)};color:#8B6340;">${lbl}</span></div>`;
    MISSIONS[period].forEach(mn=>{
      const prog = Math.floor(Math.min(mn.target, S.missions.progress[mn.id]||0));
      const pct = Math.min(100, Math.floor(prog/mn.target*100));
      const done = prog >= mn.target;
      const claimed = S.missions.claimed.includes(mn.id);
      const rwTxt = (mn.rw.money?'₩'+mn.rw.money.toLocaleString():'')+(mn.rw.sp?' SP+'+mn.rw.sp:'')+(mn.rw.xp?' XP+'+mn.rw.xp:'')+(mn.rw.jc?' 🧃'+mn.rw.jc:'');
      html += `<div style="border:2px solid ${claimed?'#8B6340':done?'#4CAF50':'#D4B483'};background:${claimed?'#E8E8E8':done?'#E8F5E9':'#FFF8DC'};border-radius:calc(6px * ${u});padding:calc(5px * ${u});margin-bottom:calc(4px * ${u});">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:calc(3px * ${u});">
          <div style="${fs(7)};color:#3D2510;">${mn.emoji} ${mn.name}</div>
          <div style="${fs(5)};color:#8B6340;">${rwTxt}</div>
        </div>
        <div style="${fs(5)};color:#8B6340;margin-bottom:calc(3px * ${u});">${mn.desc}</div>
        <div style="display:flex;align-items:center;gap:calc(5px * ${u});">
          <div class="px-bar-bg" style="flex:1;height:calc(8px * ${u});"><div class="px-bar-fill" style="width:${pct}%;background:${done?'#4CAF50':'#1976D2'};"></div></div>
          <div style="${fs(5)};color:#3D2510;min-width:calc(45px * ${u});text-align:right;">${prog}/${mn.target}</div>
          ${done && !claimed
            ? `<button class="px-btn px-btn-sm px-btn-green" style="${fs(5)};" onclick="claimMission('${mn.id}')">수령</button>`
            : claimed
              ? `<span style="${fs(5)};color:#8B6340;padding:0 calc(6px * ${u});">완료 ✓</span>`
              : ''}
        </div>
      </div>`;
    });
    html += `</div>`;
  });
  document.getElementById('mission-panel') && (document.getElementById('mission-panel').innerHTML = html);
}
var GEAR_SLOTS = [
  {key:'head',  label:'머리', icon:'⛑️', desc:'헬멧'},
  {key:'eyes',  label:'눈',   icon:'🥽', desc:'고글'},
  {key:'hands', label:'손',   icon:'🧤', desc:'장갑'},
  {key:'feet',  label:'발',   icon:'👟', desc:'신발'},
  {key:'body',  label:'몸',   icon:'🦺', desc:'의류'},
];
var GEAR_RARITY = [
  {key:'common',   label:'일반',   color:'#6B4A2A', bg:'#F5E6C8', glow:'#8B6340', mult:1.0,  weight:50},
  {key:'rare',     label:'레어',   color:'#1565C0', bg:'#E3F2FD', glow:'#42A5F5', mult:1.5,  weight:25},
  {key:'unique',   label:'유니크', color:'#2E7D32', bg:'#E8F5E9', glow:'#66BB6A', mult:2.2,  weight:13},
  {key:'legend',   label:'전설',   color:'#F9A825', bg:'#FFFDE7', glow:'#FFD700', mult:3.5,  weight:8},
  {key:'epic',     label:'에픽',   color:'#6A1B9A', bg:'#F3E5F5', glow:'#BA68C8', mult:5.5,  weight:3.5},
  {key:'mythic',   label:'신화',   color:'#D81B60', bg:'#FCE4EC', glow:'#FF4081', mult:9.0,  weight:0.5},
];
// 부위×등급별 이름 풀
var GEAR_NAMES = {
  head: {
    common:['낡은 캡모자','동네 헬멧','자전거 헬멧'],
    rare:['카본 헬멧','라이더 캡','윈드캡'],
    unique:['프로 라이더 헬멧','제트 헬멧','커스텀 헬멧'],
    legend:['전설의 헬멧','챔피언 헬멧','드래곤 헬멧'],
    epic:['신성한 투구','우주 헬멧','오라 헬멧'],
    mythic:['임복동의 왕관','신의 머리띠','우주의 면류관'],
  },
  eyes: {
    common:['플라스틱 고글','선글라스','학생 안경'],
    rare:['스포츠 고글','UV 차단 고글','경주용 고글'],
    unique:['프로 고글','폭풍 고글','카본 고글'],
    legend:['전설의 고글','이글 아이','매의 눈'],
    epic:['우주 고글','홀로 고글','시간의 안경'],
    mythic:['천리안','신의 눈','만물을 보는 눈'],
  },
  hands: {
    common:['목장갑','동네 장갑','자전거 장갑'],
    rare:['그립 장갑','윈드 글러브','전문 장갑'],
    unique:['카본 글러브','프로 라이딩 글러브','쿨링 글러브'],
    legend:['전설의 건틀릿','드래곤 글러브','챔피언 글러브'],
    epic:['용의 손아귀','우주 건틀릿','신성한 장갑'],
    mythic:['임복동의 신권','신의 손','만능의 글러브'],
  },
  feet: {
    common:['운동화','동네 슬리퍼','면 양말'],
    rare:['러닝화','클립 슈즈','윈드 슈즈'],
    unique:['프로 라이딩화','카본 슈즈','쿠션 운동화'],
    legend:['전설의 부츠','바람의 신발','7리그 부츠'],
    epic:['용의 발톱','우주 부츠','순간이동 슈즈'],
    mythic:['임복동의 헤르메스화','신의 발걸음','시공간 슈즈'],
  },
  body: {
    common:['면 티셔츠','체육복','등산 조끼'],
    rare:['라이딩 저지','윈드 자켓','쿨링 셔츠'],
    unique:['카본 슈트','프로 저지','컴프레션 슈트'],
    legend:['전설의 갑옷','챔피언 슈트','드래곤 슈트'],
    epic:['신성한 흉갑','우주복','오라 자켓'],
    mythic:['임복동의 신복','신의 갑주','우주의 옷'],
  },
};
// 부위별 고유 효과 (장착 시 적용) — 등급별 차등 명확화
// 등급별 효과량 테이블 (key: rarity)
var GEAR_EFFECT_TABLE = {
  head: {  // 최대체력 +
    common: 5,  rare: 10, unique: 18, legend: 30, epic: 50, mythic: 80,
  },
  eyes: {  // XP 획득 +%
    common: 5,  rare: 10, unique: 18, legend: 30, epic: 50, mythic: 80,
  },
  hands: { // 돈 획득 +%
    common: 3,  rare: 7,  unique: 13, legend: 22, epic: 38, mythic: 60,
  },
  feet: {  // 속도 +
    common: 1,  rare: 2,  unique: 4,  legend: 7,  epic: 12, mythic: 20,
  },
  body: {  // 체력 회복 +/초
    common: 1,  rare: 2,  unique: 4,  legend: 7,  epic: 12, mythic: 20,
  },
};
// 강화(plus) 보너스 — +1당 약 8% 추가
function getGearEffectValue(slot, rarity, plus){
  const base = (GEAR_EFFECT_TABLE[slot] || {})[rarity] || 0;
  const plusBonus = 1 + (plus||0) * 0.08;
  return base * plusBonus;
}
var GEAR_EFFECT = {
  head:  (mult, item)=>({mhpBonus: Math.round(getGearEffectValue('head', item?.rarity||'common', item?.plus||0))}),
  eyes:  (mult, item)=>({xpBonus: getGearEffectValue('eyes', item?.rarity||'common', item?.plus||0) / 100}),
  hands: (mult, item)=>({moneyBonus: getGearEffectValue('hands', item?.rarity||'common', item?.plus||0) / 100}),
  feet:  (mult, item)=>({speedBonus: Math.round(getGearEffectValue('feet', item?.rarity||'common', item?.plus||0))}),
  body:  (mult, item)=>({hpRegen: Math.round(getGearEffectValue('body', item?.rarity||'common', item?.plus||0))}),
};
function effectText(slot, mult, item){
  const ef = GEAR_EFFECT[slot](mult, item);
  if(slot==='head')  return '최대체력 +'+ef.mhpBonus;
  if(slot==='eyes')  return 'XP 획득 +'+Math.round(ef.xpBonus*100)+'%';
  if(slot==='hands') return '돈 획득 +'+Math.round(ef.moneyBonus*100)+'%';
  if(slot==='feet')  return '속도 +'+ef.speedBonus;
  if(slot==='body')  return '체력 회복 +'+ef.hpRegen+'/초';
  return '';
}

// 등급 가중치 기반 랜덤 추출 (드롭 풀에서)
function pickRarity(pool){
  const total = pool.reduce((s,r)=>s+r.weight, 0);
  let roll = Math.random()*total;
  for(const r of pool){ roll -= r.weight; if(roll<=0) return r; }
  return pool[0];
}
// 일반~전설 풀 (맛집/퀴즈 보상)
var GEAR_POOL_NORMAL = GEAR_RARITY.filter(r=>['common','rare','unique','legend'].includes(r.key));
// 유니크~에픽 풀 (달 보상)
var GEAR_POOL_MOON   = GEAR_RARITY.filter(r=>['unique','legend','epic'].includes(r.key));
// 신화 풀 (전설/에픽/신 NPC만, 매우 낮은 확률)
function tryDropMythic(npcGrade){
  // 전설 0.3%, 에픽 1%, 신 5%
  const probMap = {legend:0.003, epic:0.01, god:0.05};
  const p = probMap[npcGrade] || 0;
  if(Math.random() < p){
    return generateGear('mythic');
  }
  return null;
}

// 장비 ID 생성
var _gearIdSeq = 1;
function generateGear(rarityKey, slotKey){
  const rarity = GEAR_RARITY.find(r=>r.key===rarityKey) || GEAR_RARITY[0];
  const slot = slotKey || GEAR_SLOTS[Math.floor(Math.random()*GEAR_SLOTS.length)].key;
  const names = GEAR_NAMES[slot][rarity.key];
  const name = names[Math.floor(Math.random()*names.length)];
  return {
    id: 'g_' + Date.now() + '_' + (_gearIdSeq++),
    slot, rarity:rarity.key, name,
    mult: rarity.mult,
  };
}

// 드롭 처리
function dropGear(source){
  let pool;
  if(source==='moon')      pool = GEAR_POOL_MOON;
  else                      pool = GEAR_POOL_NORMAL;
  const rarity = pickRarity(pool);
  const item = generateGear(rarity.key);
  S.inventory = S.inventory || [];
  // 가방 가득 시 — 새 아이템 등급 ≤ 인벤토리 최저 등급이면 자동 분해, 아니면 최저 등급 자동 분해
  if(S.inventory.length >= BAG_CAPACITY){
    const order = {common:0,rare:1,unique:2,legend:3,epic:4,mythic:5};
    const newOrder = order[item.rarity];
    let lowestIdx = 0;
    for(let i=1;i<S.inventory.length;i++){
      if(order[S.inventory[i].rarity] < order[S.inventory[lowestIdx].rarity]) lowestIdx = i;
    }
    const lowest = S.inventory[lowestIdx];
    if(order[lowest.rarity] >= newOrder){
      // 새 아이템이 더 낮거나 같음 → 새 아이템 자동 분해
      S.gearDust = (S.gearDust||0) + RARITY_DUST[item.rarity];
      addLog('neutral','🎒 가방 가득! '+item.name+' 자동 분해 → 강화석 +'+RARITY_DUST[item.rarity]);
      return null;
    } else {
      // 인벤토리 최저 등급 분해 후 새 아이템 추가
      S.gearDust = (S.gearDust||0) + RARITY_DUST[lowest.rarity];
      if(S.equipped && S.equipped[lowest.slot]===lowest.id) S.equipped[lowest.slot]=null;
      S.inventory.splice(lowestIdx,1);
      addLog('neutral','🎒 가방 가득! '+lowest.name+' 자동 분해 → 강화석 +'+RARITY_DUST[lowest.rarity]);
    }
  }
  S.inventory.push(item);
  const r = GEAR_RARITY.find(rr=>rr.key===item.rarity);
  addLog('good', `🎁 [${r.label}] ${getSlotIcon(item.slot)} ${item.name} 획득!`);
  showGearDropAnim(item);
  // 미션 추적
  if(item.rarity==='legend') trackMission('legend');
  refreshTabBadges();
  return item;
}
function getSlotIcon(slot){
  const s = GEAR_SLOTS.find(x=>x.key===slot);
  return s?s.icon:'🎁';
}

// 장비 드롭 애니메이션 (캔버스)
var gearDropAnim = null;
function showGearDropAnim(item){
  gearDropAnim = {item, timer:120};
}
function drawGearDropAnim(){
  if(!gearDropAnim) return;
  const t = gearDropAnim.timer;
  if(t<=0){gearDropAnim=null;return;}
  const item = gearDropAnim.item;
  const r = GEAR_RARITY.find(rr=>rr.key===item.rarity);
  const alpha = Math.min(1, t<25?t/25:1);
  const lift = (120-t)*0.4;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(210, 105 - lift);
  // 배경 광채
  ctx.fillStyle = r.bg;
  ctx.strokeStyle = r.color;
  ctx.lineWidth = 3;
  ctx.beginPath();ctx.roundRect(-95,-32,190,64,12);ctx.fill();ctx.stroke();
  // 등급 라벨
  ctx.fillStyle = r.color;
  ctx.font = 'bold 8px Galmuri11, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🎁 ['+r.label+'] 획득!', 0, -16);
  // 아이콘 + 이름
  ctx.font = '18px Galmuri11, monospace';
  ctx.fillText(getSlotIcon(item.slot), -70, 12);
  // 이름·효과는 아이콘 오른쪽에 왼쪽정렬 (위 라벨의 center가 남아 길이별로 쏠리던 버그 수정)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#3D2510';
  ctx.font = 'bold 8px Galmuri11, monospace';
  ctx.fillText(item.name, -52, 6);
  ctx.font = '6px Galmuri11, monospace';
  ctx.fillStyle = r.color;
  ctx.fillText(effectText(item.slot, item.mult, item), -52, 20);
  ctx.textAlign = 'center';
  // 파티클 (rare 이상)
  if(item.rarity!=='common'){
    for(let i=0;i<6;i++){
      const a = (i/6)*Math.PI*2 + frame*.05;
      const d = 110;
      ctx.fillStyle = r.glow;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();ctx.arc(Math.cos(a)*d, Math.sin(a)*40, 3, 0, Math.PI*2);ctx.fill();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  gearDropAnim.timer--;
}

// 장착 효과 합산
function getEquippedBonus(){
  const bonus = {mhpBonus:0, xpBonus:0, moneyBonus:0, speedBonus:0, hpRegen:0};
  if(!S.equipped) return bonus;
  for(const slot of Object.keys(S.equipped)){
    const itemId = S.equipped[slot];
    if(!itemId) continue;
    const item = (S.inventory||[]).find(x=>x.id===itemId);
    if(!item) continue;
    const ef = GEAR_EFFECT[slot](item.mult, item);
    Object.keys(ef).forEach(k=>bonus[k]=(bonus[k]||0)+ef[k]);
  }
  return bonus;
}

// 장착/해제
function equipGear(itemId){
  const item = (S.inventory||[]).find(x=>x.id===itemId);
  if(!item) return;
  S.equipped = S.equipped || {head:null,eyes:null,hands:null,feet:null,body:null};
  S.equipped[item.slot] = itemId;
  // 헬멧이면 mhp 즉시 갱신 (1번 fix: SP 투자분 보존!)
  if(item.slot==='head'){
    refreshMhpFromHelmet();
  }
  addLog('good','✅ '+item.name+' 장착');
  renderGear();update();
}
function unequipGear(slot){
  if(!S.equipped) return;
  S.equipped[slot] = null;
  if(slot==='head'){
    // SP 투자분은 유지, 헬멧 보너스만 제거
    refreshMhpFromHelmet();
  }
  addLog('neutral','장비 해제');
  renderGear();update();
}

// 장비 탭 렌더
function renderGear(){
  S.equipped = S.equipped || {head:null,eyes:null,hands:null,feet:null,body:null};
  S.inventory = S.inventory || [];
  S.gearDust = S.gearDust || 0;
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  const bonus = getEquippedBonus();

  let html = `<div class="px-panel" style="margin-bottom:5px;">
    <div style="${fs(8)};color:#3D2510;text-align:center;margin-bottom:calc(8px * ${u});">🦺 임복동의 장비</div>
    <div style="${fs(6)};color:#8B6340;text-align:center;margin-bottom:calc(6px * ${u});line-height:1.7;">
      체력+${bonus.mhpBonus} · XP+${Math.round(bonus.xpBonus*100)}% · 돈+${Math.round(bonus.moneyBonus*100)}%<br>속도+${bonus.speedBonus} · 회복+${bonus.hpRegen}/초
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;background:#FFF8DC;border:2px solid #D4B483;border-radius:calc(5px * ${u});padding:calc(5px * ${u}) calc(8px * ${u});margin-bottom:calc(6px * ${u});">
      <div style="${fs(6)};color:#8B6340;">🎒 가방 ${S.inventory.length}/${BAG_CAPACITY}</div>
      <div style="${fs(6)};color:#E65100;">💎 강화석 ${S.gearDust}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:calc(5px * ${u});">`;

  GEAR_SLOTS.forEach(slot=>{
    const eqId = S.equipped[slot.key];
    const item = eqId ? S.inventory.find(x=>x.id===eqId) : null;
    const r = item ? GEAR_RARITY.find(rr=>rr.key===item.rarity) : null;
    html += `<div style="border:2px solid ${r?r.color:'#8B6340'};border-radius:calc(8px * ${u});padding:calc(6px * ${u});background:${r?r.bg:'#F5E6C8'};">
      <div style="${fs(6)};color:#8B6340;margin-bottom:calc(2px * ${u});">${slot.icon} ${slot.label}</div>
      ${item
        ? `<div style="${fs(7)};color:${r.color};font-weight:bold;">${item.name}${item.plus?' +'+item.plus:''}</div>
           <div style="${fs(5)};color:${r.color};">[${r.label}]</div>
           <div style="${fs(5)};color:#5C3D1E;margin-top:calc(2px * ${u});">${effectText(slot.key, item.mult, item)}</div>
           <button class="px-btn px-btn-sm px-btn-gray" style="${fs(5)};margin-top:calc(4px * ${u});width:100%;" onclick="unequipGear('${slot.key}')">해제</button>`
        : `<div style="${fs(6)};color:#AAAAAA;font-style:italic;">비어있음</div>`}
    </div>`;
  });
  html += `</div></div>`;

  // 인벤토리
  html += `<div class="px-panel">
    <div style="${fs(7)};color:#3D2510;margin-bottom:calc(6px * ${u});">📦 보유 장비 (${S.inventory.length}/${BAG_CAPACITY})</div>`;
  if(S.inventory.length===0){
    html += `<div style="${fs(6)};color:#8B6340;text-align:center;padding:calc(10px * ${u});">아직 보유한 장비가 없어요.<br>맛집 미션, 도시 OX 퀴즈, NPC 만남으로 획득!</div>`;
  } else {
    const order = {mythic:0,epic:1,legend:2,unique:3,rare:4,common:5};
    const sorted = [...S.inventory].sort((a,b)=>order[a.rarity]-order[b.rarity]);
    sorted.forEach(item=>{
      const r = GEAR_RARITY.find(rr=>rr.key===item.rarity);
      const eq = S.equipped[item.slot]===item.id;
      const slotInfo = GEAR_SLOTS.find(s=>s.key===item.slot);
      const plus = item.plus||0;
      const enhanceCost = (plus+1) * RARITY_DUST[item.rarity];
      html += `<div style="display:flex;align-items:center;gap:calc(6px * ${u});padding:calc(5px * ${u});margin-bottom:calc(4px * ${u});background:${r.bg};border:2px solid ${r.color};border-radius:calc(6px * ${u});${eq?'box-shadow:0 0 calc(8px * '+u+') '+r.glow+';':''}">
        <div style="${fs(13)};">${slotInfo.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="${fs(7)};color:${r.color};font-weight:bold;">${item.name}${plus?' <span style="color:#E65100;">+'+plus+'</span>':''}${eq?' ✅':''}</div>
          <div style="${fs(5)};color:#5C3D1E;">[${r.label}] ${slotInfo.label} · ${effectText(item.slot, item.mult, item)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:calc(2px * ${u});">
          ${eq
            ? `<button class="px-btn px-btn-sm px-btn-gray" style="${fs(5)};" onclick="unequipGear('${item.slot}')">해제</button>`
            : `<button class="px-btn px-btn-sm px-btn-green" style="${fs(5)};" onclick="equipGear('${item.id}')">장착</button>`}
          ${plus<10
            ? `<button class="px-btn px-btn-sm px-btn-orange" style="${fs(5)};" onclick="enhanceGear('${item.id}')" title="강화석 ${enhanceCost} 필요">+${plus+1} (💎${enhanceCost})</button>`
            : `<span style="${fs(5)};color:#E65100;text-align:center;">MAX</span>`}
          <button class="px-btn px-btn-sm px-btn-red" style="${fs(5)};" onclick="dismantleGear('${item.id}')">분해</button>
        </div>
      </div>`;
    });
  }
  html += `</div>`;

  document.getElementById('gear-panel').innerHTML = html;
}

// ── 2번: 도감(컬렉션) ─────────────────────────────────
function renderCodex(){
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  const visited = S.visited || [];
  const foodDone = S.foodDone || [];
  const npcMet = S.npcs.filter(n=>n.met&&!n.locked).length;
  const npcTotal = S.npcs.filter(n=>!n.locked).length;
  const cityPct = Math.floor(visited.length / CITIES.length * 100);
  const foodPct = Math.floor(foodDone.length / FOODS.length * 100);
  const npcPct = Math.floor(npcMet / npcTotal * 100);
  const total = Math.floor((cityPct + foodPct + npcPct) / 3);

  let html = `<div class="px-panel" style="margin-bottom:5px;text-align:center;">
    <div style="${fs(9)};color:#3D2510;margin-bottom:calc(6px * ${u});">📖 임복동 도감</div>
    <div style="${fs(7)};color:#8B6340;margin-bottom:calc(6px * ${u});">전체 컬렉션 ${total}%</div>
    <div class="px-bar-bg" style="height:calc(14px * ${u});"><div class="px-bar-fill" style="width:${total}%;background:linear-gradient(90deg,#FF9800,#FFC107);"></div></div>
  </div>`;

  // 도시 도감
  html += `<div class="px-panel" style="margin-bottom:5px;">
    <div style="${fs(7)};color:#3D2510;margin-bottom:calc(5px * ${u});">🏙️ 도시 (${visited.length}/${CITIES.length}) — ${cityPct}%</div>
    <div style="display:flex;flex-wrap:wrap;gap:calc(4px * ${u});">`;
  CITIES.forEach(c=>{
    const got = visited.includes(c.n);
    html += `<span style="${fs(5)};padding:calc(3px * ${u}) calc(6px * ${u});border:2px solid ${got?'#4CAF50':'#AAA'};background:${got?'#E8F5E9':'#EEE'};border-radius:calc(4px * ${u});color:${got?'#2E7D32':'#888'};">${got?c.n:'???'}</span>`;
  });
  html += `</div></div>`;

  // 맛집 도감
  html += `<div class="px-panel" style="margin-bottom:5px;">
    <div style="${fs(7)};color:#3D2510;margin-bottom:calc(5px * ${u});">🍜 맛집 (${foodDone.length}/${FOODS.length}) — ${foodPct}%</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:calc(4px * ${u});">`;
  FOODS.forEach(f=>{
    const got = foodDone.includes(f.c);
    html += `<div style="${fs(5)};padding:calc(4px * ${u});border:2px solid ${got?'#FF9800':'#AAA'};background:${got?'#FFF3E0':'#EEE'};border-radius:calc(4px * ${u});">
      <span style="${fs(8)};">${got?f.e:'❓'}</span>
      <span style="color:${got?'#3D2510':'#888'};">${got?f.n:'???'}</span>
    </div>`;
  });
  html += `</div></div>`;

  // NPC 도감 (등급별)
  html += `<div class="px-panel">
    <div style="${fs(7)};color:#3D2510;margin-bottom:calc(5px * ${u});">👥 NPC (${npcMet}/${npcTotal}) — ${npcPct}%</div>`;
  ['normal','rare','unique','legend','epic','god'].forEach(grade=>{
    const grpAll = S.npcs.filter(n=>n.grade===grade && !n.locked);
    if(!grpAll.length) return;
    const grpMet = grpAll.filter(n=>n.met).length;
    const gc = GRADE_COLOR[grade]||'#5C3D1E';
    const gradeLabel = {normal:'일반',rare:'레어',unique:'유니크',legend:'전설',epic:'에픽',god:'신'}[grade];
    html += `<div style="margin-bottom:calc(5px * ${u});">
      <div style="${fs(6)};color:${gc};margin-bottom:calc(2px * ${u});">${gradeLabel} ${grpMet}/${grpAll.length}</div>
      <div style="display:flex;flex-wrap:wrap;gap:calc(3px * ${u});">`;
    grpAll.forEach(n=>{
      const em = NPC_EMOJI[n.id]||'👤';
      html += `<span title="${n.met?n.n:'???'}" style="${fs(11)};padding:calc(2px * ${u});filter:${n.met?'none':'grayscale(1) brightness(0.5)'};">${em}</span>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;

  // 누적 보너스
  const bonusMoney = Math.floor(total/10) * 2; // 10%당 2%
  html += `<div class="px-panel" style="background:#FFF8DC;border-color:#FFD700;">
    <div style="${fs(6)};color:#8B6340;text-align:center;line-height:1.8;">
      📜 컬렉션 보너스 (자동 적용)<br>
      <span style="${fs(7)};color:#E65100;">돈 획득 +${bonusMoney}%</span>
    </div>
  </div>`;

  document.getElementById('codex-panel') && (document.getElementById('codex-panel').innerHTML = html);
}

// ── 3번 (사용자 추가): 날씨/시간대 시스템 ─────────────
var WEATHER_TYPES = [
  {key:'clear',  name:'맑음',     emoji:'☀️',  weight:55, mod:{}},
  {key:'cloud',  name:'흐림',     emoji:'☁️',  weight:25, mod:{}},
  {key:'rain',   name:'비',       emoji:'🌧️', weight:12, mod:{speedMult:0.85, moneyMult:1.2}},
  {key:'fog',    name:'안개',     emoji:'🌫️', weight:5,  mod:{speedMult:0.9}},
  {key:'snow',   name:'눈',       emoji:'❄️',  weight:3,  mod:{speedMult:0.75, moneyMult:1.5}},
];
function pickWeather(){
  const total = WEATHER_TYPES.reduce((s,w)=>s+w.weight,0);
  let r = Math.random()*total;
  for(const w of WEATHER_TYPES){r -= w.weight; if(r<=0) return w;}
  return WEATHER_TYPES[0];
}
function ensureWeather(){
  if(!S.weather) S.weather = {key:'clear', untilMs:0};
  const now = Date.now();
  if(now > S.weather.untilMs){
    const w = pickWeather();
    S.weather = {key:w.key, untilMs: now + (3+Math.floor(Math.random()*5))*60*1000}; // 3~8분
    addLog('neutral', w.emoji+' 날씨가 '+w.name+'(으)로 바뀌었어요.');
  }
}
function getWeather(){
  ensureWeather();
  return WEATHER_TYPES.find(w=>w.key===S.weather.key) || WEATHER_TYPES[0];
}
function getTimeOfDay(){
  const h = new Date().getHours();
  if(h>=5 && h<10) return {key:'morning', name:'아침', emoji:'🌅', skyTint:null};
  if(h>=10 && h<17) return {key:'day',   name:'낮',   emoji:'☀️', skyTint:null};
  // 노을/밤 — 농도 대폭 낮춤 (뿌염 방지). 화면 상단(하늘)에만 살짝 적용
  if(h>=17 && h<20) return {key:'sunset',name:'노을', emoji:'🌇', skyTint:'rgba(255,140,80,0.10)', topOnly:true};
  return {key:'night', name:'밤', emoji:'🌙', skyTint:'rgba(30,30,90,0.22)', topOnly:true};
}

// ── 장비 분해 / 강화 / 가방 용량 ────────────────────────
var BAG_CAPACITY = 30;
var RARITY_DUST = {common:1, rare:3, unique:8, legend:20, epic:50, mythic:200};
// #3: 분해 시 강화석과 함께 지급하는 골드(고렙 골드 수급처 보강). +강화 수치에 비례.
var RARITY_GOLD = {common:2000, rare:6000, unique:15000, legend:40000, epic:100000, mythic:400000};

// ❌ 페인트 시스템 제거 — 자전거는 PNG 스프라이트로 그려져서 색상 변경 의미 없음
// 호환성을 위해 빈 함수만 남김
var PAINT_POOL = [];
function getOwnedPaints(){ return []; }
function getActivePaint(){ return null; }
function rollPaint(){ addLog('bad','페인트 시스템은 제거됐어요'); }
function applyPaint(){}
function renderPaintShop(){}

// 2번: 장비 가챠 — 일반~전설, 천장 50회 시 전설 확정
var GACHA_PROBS = [
  {key:'common', weight:60},
  {key:'rare',   weight:25},
  {key:'unique', weight:12},
  {key:'legend', weight:3},
];
function rollGearGacha(){
  if(S.money < 100000){addLog('bad','자금 부족! (₩100,000 필요)');return;}
  S.money -= 100000;
  S.gachaCount = (S.gachaCount||0) + 1;
  let rarityKey;
  // 천장 — 50회마다 전설 확정
  if(S.gachaCount >= 50){
    rarityKey = 'legend';
    S.gachaCount = 0;
    addLog('good','🎯 천장! 50회 누적 → 전설 확정!');
  } else {
    const total = GACHA_PROBS.reduce((s,p)=>s+p.weight,0);
    let r = Math.random() * total;
    rarityKey = 'common';
    for(const p of GACHA_PROBS){r -= p.weight; if(r<=0){rarityKey = p.key; break;}}
    if(rarityKey === 'legend') S.gachaCount = 0; // 전설 나오면 카운트 리셋
  }
  const item = generateGear(rarityKey);
  S.inventory = S.inventory || [];
  if(S.inventory.length < BAG_CAPACITY){
    S.inventory.push(item);
  } else {
    // 가방 가득 → 자동 분해
    S.gearDust = (S.gearDust||0) + RARITY_DUST[item.rarity];
    addLog('neutral','가방 가득! 자동 분해: '+item.name+' → 강화석+'+RARITY_DUST[item.rarity]);
  }
  const r = GEAR_RARITY.find(x=>x.key===rarityKey);
  addLog('good','⚔️ 장비 가챠 ['+r.label+'] '+getSlotIcon(item.slot)+' '+item.name+' 획득!');
  if(rarityKey==='legend') playSfx('mythic');
  else playSfx('gear');
  showGachaResult('gear', item, true);
}

// 가챠 결과를 가챠 탭에 인라인 표시 (8초 후 자동 사라짐)
var gachaResult = null;
function showGachaResult(type, item, isNew){
  gachaResult = {type, item, isNew, until: Date.now()+8000};
  if(curTab==='gacha') renderGachaShop();
  setTimeout(()=>{
    gachaResult = null;
    if(curTab==='gacha') renderGachaShop();
  }, 8000);
  update();
}
function dismissGachaResult(){
  gachaResult = null;
  if(curTab==='gacha') renderGachaShop();
}
function dismantleGear(itemId){
  const idx = (S.inventory||[]).findIndex(x=>x.id===itemId);
  if(idx<0) return;
  const item = S.inventory[idx];
  // 5번 fix: 장착 중인 아이템은 분해 차단 (실수 방지)
  if(S.equipped && S.equipped[item.slot] === itemId){
    addLog('bad','🛡️ 장착 중! 해제 후 분해해주세요.');
    playSfx('bad');
    return;
  }
  S.inventory.splice(idx,1);
  const mult = (1 + (item.plus||0));
  const dust = RARITY_DUST[item.rarity] * mult;
  const gold = (RARITY_GOLD[item.rarity]||0) * mult;
  S.gearDust = (S.gearDust||0) + dust;
  S.money = (S.money||0) + gold;
  addLog('neutral','🔨 '+item.name+' 분해 → 강화석 +'+dust+' · ₩'+gold.toLocaleString());
  playSfx('good');
  renderGear();update();
}
function enhanceGear(itemId){
  const item = (S.inventory||[]).find(x=>x.id===itemId);
  if(!item) return;
  const plus = item.plus || 0;
  if(plus>=10){addLog('bad','이미 최대 강화 (+10)');return;}
  const cost = (plus+1) * RARITY_DUST[item.rarity];
  if((S.gearDust||0) < cost){addLog('bad','강화석 부족! 필요: '+cost);return;}
  // 성공 확률 (레벨이 오를수록 어려워짐)
  const successProbs = [1.0,1.0,0.95,0.85,0.7,0.55,0.4,0.3,0.2,0.15,0.1];
  const prob = successProbs[plus] || 0.1;
  S.gearDust -= cost;
  if(Math.random() < prob){
    item.plus = plus + 1;
    // 강화 효과는 getGearEffectValue(rarity + plus×8%)로만 계산된다. (과거 item.mult*=1.15는 미사용 죽은 코드 → 제거)
    addLog('good','✨ '+item.name+' +'+item.plus+' 강화 성공! (효과 +8%)');
  } else {
    addLog('bad','💥 '+item.name+' 강화 실패... (강화석 -'+cost+')');
  }
  // 헬멧 강화 시 mhp 갱신 (1번 fix: SP 투자분 보존)
  if(item.slot==='head' && S.equipped && S.equipped.head===item.id){
    refreshMhpFromHelmet();
  }
  renderGear();update();
}

// ── 2번: 커스텀 확인 모달 (모바일 confirm 호환) ─────────
function showConfirmModal(opts){
  // opts: {title, message, okText, cancelText, onOk, onCancel, color}
  const wr = S.riding;
  if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}
  const color = opts.color || '#5C3D1E';
  document.getElementById('modal-area').innerHTML = `
  <div class="px-panel" style="border-color:${color};margin-bottom:5px;">
    <div style="font-size:calc(10px * var(--u));color:${color};text-align:center;margin-bottom:8px;">${opts.title}</div>
    <div style="font-size:calc(9px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:calc(8px * var(--u));margin-bottom:calc(10px * var(--u));line-height:2;text-align:center;">
      ${opts.message.replace(/\n/g,'<br>')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:calc(6px * var(--u));">
      <button class="px-btn px-btn-gray" style="font-size:calc(9px * var(--u));padding:calc(10px * var(--u));" onclick="_confirmCancel()">${opts.cancelText||'취소'}</button>
      <button class="px-btn px-btn-green" style="font-size:calc(9px * var(--u));padding:calc(10px * var(--u));" onclick="_confirmOk()">${opts.okText||'확인'}</button>
    </div>
  </div>`;
  window._pendingConfirm = {ok: opts.onOk, cancel: opts.onCancel, wr};
}
function _confirmOk(){
  const p = window._pendingConfirm;
  if(!p) return;
  document.getElementById('modal-area').innerHTML = '';
  if(p.wr){S.riding=true;tickIv=setInterval(tick,1000);startNpcTimer();document.getElementById('ride-btn').textContent='■ 정지';}
  window._pendingConfirm = null;
  if(p.ok) p.ok();
}
function _confirmCancel(){
  const p = window._pendingConfirm;
  if(!p) return;
  document.getElementById('modal-area').innerHTML = '';
  if(p.wr){S.riding=true;tickIv=setInterval(tick,1000);startNpcTimer();document.getElementById('ride-btn').textContent='■ 정지';}
  window._pendingConfirm = null;
  if(p.cancel) p.cancel();
}

// ── 저장/불러오기 ───────────────────────────────────────
// 9번/2번: 커스텀 팝업 사용
// ── 자동저장 (v9.19) ────────────────────────────────────
// saveReady: 시작 시 자동 불러오기가 끝나기 전에 자동저장이 기존 세이브를
// 새 게임 상태로 덮어쓰는 사고 방지. 로드 성공/새 게임/초기화 시에만 true.
let saveReady=false;
/** 실제 저장 쓰기(공용). showToast=true면 수동 저장 피드백 표시. */
function doSave(showToast){
  if(!saveReady)return false;
  try{
    const d={S:{...S,npcs:S.npcs.map(n=>({id:n.id,met:n.met}))},log:logs.slice(0,15),at:new Date().toLocaleString(),lpt:Date.now()};
    localStorage.setItem('bkdng_v45',JSON.stringify(d));
    if(showToast){showSt('💾 저장 완료!');addLog('good','💾 저장 완료');}
    return true;
  }catch(e){if(showToast){showSt('저장 실패');addLog('bad','저장 실패');}return false;}
}
// 수동 저장 버튼 — 자동저장 도입으로 확인 모달 제거(즉시 저장). 어차피 30초마다 덮어씀.
function save(){doSave(true);}

// ── 저장코드 백업/복원 (v9.19) ──────────────────────────
// localStorage 하나에만 있던 세이브를 코드 문자열로 내보내/가져오기.
// 용도: 브라우저 데이터 삭제 대비 보관, 폰↔PC 이동. 포맷: 'BKDNG1.' + base64(UTF-8 JSON)
function _encodeSave(str){return 'BKDNG1.'+btoa(unescape(encodeURIComponent(str)));}
function _decodeSave(code){
  const t=(code||'').trim();
  if(!t.startsWith('BKDNG1.'))return null;
  try{return decodeURIComponent(escape(atob(t.slice(7))));}catch(e){return null;}
}
function openBackup(){
  if(modalOpen()){showSt('진행 중인 선택을 먼저 마쳐주세요');return;}
  const wr=S.riding;
  if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}
  doSave(false); // 최신 상태를 코드에 반영
  let code='';
  try{const raw=localStorage.getItem('bkdng_v45');if(raw)code=_encodeSave(raw);}catch(e){}
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:#1976D2;margin-bottom:5px;">
    <div style="font-size:calc(10px * var(--u));color:#1976D2;text-align:center;margin-bottom:6px;">🔑 저장코드 백업/복원</div>
    <div style="font-size:calc(8px * var(--u));color:#5C3D1E;margin-bottom:4px;">📤 내 저장코드 — 복사해서 메모장·카톡(나에게) 등에 보관:</div>
    <textarea id="bk-out" readonly style="width:100%;height:calc(40px * var(--u));font-size:calc(7px * var(--u));border:2px solid #D4B483;border-radius:5px;padding:4px;box-sizing:border-box;resize:none;word-break:break-all;">${code}</textarea>
    <button class="px-btn px-btn-blue" style="width:100%;font-size:calc(9px * var(--u));margin:4px 0 10px;" onclick="copyBackupCode()">📋 코드 복사</button>
    <div style="font-size:calc(8px * var(--u));color:#5C3D1E;margin-bottom:4px;">📥 코드를 붙여넣어 복원 — <b style="color:#B71C1C;">현재 진행은 사라져요!</b></div>
    <textarea id="bk-in" placeholder="BKDNG1. 로 시작하는 코드 붙여넣기" style="width:100%;height:calc(30px * var(--u));font-size:calc(7px * var(--u));border:2px solid #D4B483;border-radius:5px;padding:4px;box-sizing:border-box;resize:none;word-break:break-all;"></textarea>
    <button class="px-btn px-btn-green" style="width:100%;font-size:calc(9px * var(--u));margin-top:4px;" onclick="importBackupCode()">📥 복원하기</button>
    <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(9px * var(--u));margin-top:6px;" onclick="closeModal(${wr})">닫기 ▶</button>
  </div>`;
}
function copyBackupCode(){
  const ta=document.getElementById('bk-out');
  if(!ta||!ta.value){showSt('저장코드가 없어요 — 먼저 게임을 진행하세요');return;}
  ta.select();ta.setSelectionRange(0,999999); // 모바일 대비
  const done=()=>showSt('📋 복사 완료! 메모장·카톡(나에게) 등에 보관하세요');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(ta.value).then(done).catch(()=>{try{document.execCommand('copy');done();}catch(e){showSt('복사 실패 — 직접 길게 눌러 복사하세요');}});
  }else{
    try{document.execCommand('copy');done();}catch(e){showSt('복사 실패 — 직접 길게 눌러 복사하세요');}
  }
}
function importBackupCode(){
  const ta=document.getElementById('bk-in');
  const json=_decodeSave(ta?ta.value:'');
  if(!json){showSt('⚠️ 코드가 올바르지 않아요 (BKDNG1. 으로 시작하는지 확인)');return;}
  let d=null;try{d=JSON.parse(json);}catch(e){}
  if(!d||!d.S){showSt('⚠️ 코드 내용이 손상됐어요');return;}
  try{localStorage.setItem('bkdng_v45',json);}catch(e){showSt('저장 실패');return;}
  document.getElementById('modal-area').innerHTML='';
  if(doLoad(d)){showSt('📥 저장코드 복원 완료!');addLog('good','🔑 저장코드로 복원 완료');}
}
function load(){
  if(modalOpen()){showSt('진행 중인 선택을 먼저 마쳐주세요');return;}
  const raw=localStorage.getItem('bkdng_v45');
  if(!raw){
    showConfirmModal({title:'📂 저장 없음',message:'저장된 데이터가 없습니다.',okText:'확인',cancelText:'닫기',color:'#8B6340'});
    return;
  }
  let parsedD;
  try{ parsedD = JSON.parse(raw); }catch(e){showSt('데이터 손상');return;}
  const at = parsedD.at || '알 수 없음';
  showConfirmModal({
    title:'📂 불러올까요?',
    message:`마지막 저장: ${at}\n현재 진행 상황은 사라집니다.`,
    okText:'불러오기',cancelText:'취소',color:'#1976D2',
    onOk:()=>{doLoad(parsedD);}
  });
}
/** 저장 데이터 적용(마이그레이션 포함) — 수동 로드·자동 로드 공용. 성공 시 자동저장 활성화. */
function doLoad(parsedD){
      try{
        const d = parsedD;
        const nm=NPCS.map(n=>({...n}));
        if(d.S.npcs)d.S.npcs.forEach(sn=>{const f=nm.find(n=>n.id===sn.id);if(f)f.met=sn.met;});
        S={...d.S,npcs:nm};
        if(!S.vehs)S.vehs=VEHS.map(v=>({id:v.id,owned:v.owned}));
        // 탈것 전격교체 마이그레이션: 옛 id(t/a2/avant/ninja 등) → 새 자전거 체계(v1~v30)
        // 옛 데이터면 보유했던 탈것 수만큼 v1부터 순서대로 보유 처리 (진행도 보존)
        const _validIds = VEHS.map(v=>v.id);
        const _hasOldVeh = (S.vehs||[]).some(sv=>!_validIds.includes(sv.id));
        if(_hasOldVeh || !S.vehs){
          const ownedCount = (S.vehs||[]).filter(v=>v.owned && v.id!=='rocket').length || 1;
          const hadRocket = (S.vehs||[]).some(v=>v.id==='rocket' && v.owned);
          // v1부터 보유했던 개수만큼 보유 처리 (최소 1개 = 세발자전거)
          S.vehs = VEHS.map((v,i)=>({
            id: v.id,
            owned: v.id==='rocket' ? hadRocket : (i < Math.max(1, ownedCount))
          }));
          // 현재 타던 탈것도 보유 범위의 최고 단계로
          const topBike = VEHS.filter(v=>v.cat==='bike')[Math.max(0, Math.min(29, ownedCount-1))];
          if(!_validIds.includes(S.vId)) S.vId = topBike ? topBike.id : 'v1';
          addLog('neutral','🚲 탈것 시스템 개편! 자전거 '+Math.max(1,ownedCount)+'단계로 이전됨');
        }
        if(!S.achievements)S.achievements=[];if(!S.boostCount)S.boostCount=0;if(!S.offlineCount)S.offlineCount=0;if(typeof S.autoApple!=='boolean')S.autoApple=false;if(typeof S.prestige!=='number')S.prestige=0;
        // #6 엽서 마이그레이션: 없으면 이미 방문한 도시들로 소급 생성
        if(!Array.isArray(S.postcards)){ S.postcards=[]; (S.visited||[]).forEach(c=>collectPostcard(c)); }
        if(!S.equipped)S.equipped={head:null,eyes:null,hands:null,feet:null,body:null};
        if(!S.inventory)S.inventory=[];
        // 1번 fix: 기존 저장 마이그레이션 — mhpSpBonus 없으면 추정 계산
        if(typeof S.mhpSpBonus !== 'number'){
          // 현재 mhp - 탈것기본(prevBaseMhp) - 헬멧보너스 = SP 투자분
          const helmetBonus = (S.equipped&&S.equipped.head&&S.inventory)
            ? (function(){
                const hi = S.inventory.find(x=>x.id===S.equipped.head);
                return hi ? (GEAR_EFFECT.head(hi.mult, hi).mhpBonus||0) : 0;
              })()
            : 0;
          S.mhpSpBonus = Math.max(0, (S.mhp||100) - (S.prevBaseMhp||100) - helmetBonus);
        }
        // 2번: 페인트/가챠 마이그레이션
        if(!S.paints) S.paints = ['gray'];
        if(!S.activePaint) S.activePaint = 'gray';
        if(typeof S.gachaCount !== 'number') S.gachaCount = 0;
        // 2번 fix: seenTabs 마이그레이션 — 없거나 잘못된 값이면 현재 보유 갯수로 보정
        if(!S.seenTabs) S.seenTabs = {npc:0, veh:0, ach:0, gear:0};
        // veh/gear는 한번도 없던 사용자는 0인데 시작 자전거 't'가 있으니 보정 필요
        const curVehOwn = (S.vehs||[]).filter(v=>v.owned).length;
        const curGearOwn = (S.inventory||[]).length;
        // seenTabs > 현재값이면 잘못된 데이터 (아이템 분해/판매 등) → 현재값으로 정정
        if((S.seenTabs.veh||0) > curVehOwn) S.seenTabs.veh = curVehOwn;
        if((S.seenTabs.gear||0) > curGearOwn) S.seenTabs.gear = curGearOwn;
        if(tickIv){clearInterval(tickIv);tickIv=null;}S.riding=false;isResting=false;
        // 저장 데이터 마이그레이션: 한국에 있는데 일본이 목적지면 초기화 (라이딩 여부 무관)
        const _isJapanCity = n => CITIES.some(c=>c.n===n && c.region==='일본');
        if(S.dest && _isJapanCity(S.dest) && !_isJapanCity(S.city)){
          addLog('bad','⚠️ 저장된 목적지('+S.dest+') 초기화 — 일본은 부산 페리로만!');
          S.dest = null; S.sgKm = 0;
        }
        // 페리 플래그 정리: 한국에 있으면서 후쿠오카행이 아니면 플래그 해제
        if(!_isJapanCity(S.city) && S.dest!=='후쿠오카') S.onFerryToJapan = false;
        // 충주에 있는데 아무 목적지도 없으면 정상 (toggleRide 시 자동 설정됨)
        logs=d.log||[];document.getElementById('ride-btn').textContent='▶ 출발!';
        if(d.lpt)applyOfflineReward(d.lpt, !!(d.S && d.S.riding));
        showSt('📂 불러오기 완료!');addLog('good','📂 불러오기 완료');update();
        saveReady=true; // 로드 성공 → 자동저장 활성화
        return true;
      }catch(e){showSt('불러오기 실패');return false;}
}

// 2번: 일본 페리 구매 함수
function buyFerryFromModal(wr){
  const price = 200000;
  if(S.money < price){addLog('bad','자금 부족!');return;}
  S.money -= price;
  // 3번 fix: 페리 탈 때마다 일본 도시 visited 리셋 — 매번 5개 코스 새로 진행
  const japanCities = CITIES.filter(c=>c.region==='일본').map(c=>c.n);
  S.visited = (S.visited||[]).filter(c => !japanCities.includes(c));
  addLog('good','⛴️ 페리 티켓 구매! 후쿠오카로 출항! 일본 코스 5개 도시 시작!');
  playSfx('arrive');
  // 후쿠오카로 자동 출항
  S.onFerryToJapan = true;   // 정식 페리 탑승 — enforceJapanRule 예외 허용
  S.dest = '후쿠오카';
  S.sgKm = 0;
  S.sgTot = getCityDist('부산', '후쿠오카');
  // 모달 닫고 자동 라이딩 시작
  document.getElementById('modal-area').innerHTML='';
  if(wr || !S.riding){
    S.riding = true;
    document.getElementById('ride-btn').textContent = '■ 정지';
    if(!tickIv){tickIv=setInterval(tick,1000);startNpcTimer();}
  }
  update();
}

// 7번: 나로호 모달에서 직접 구매/발사
function buyRocketFromModal(wr){
  if(vehOwned('rocket')){addLog('bad','임복동1호 이미 보유 중!');return;}
  if(S.money<80000){addLog('bad','자금 부족!');return;}
  S.money-=80000;setVehOwned('rocket',true);
  if(curTab==='veh' && S.seenTabs){
    S.seenTabs.veh = (S.vehs||[]).filter(v=>v.owned).length;
  }
  addLog('good','🚀 임복동1호 구매 완료! 발사 준비!');
  // showConfirmModal이 자체로 wr 처리하므로 modal-area만 비움
  document.getElementById('modal-area').innerHTML='';
  showConfirmModal({
    title:'🚀 발사 준비 완료!',
    message:'임복동1호 구매 완료!\n바로 달로 발사하시겠어요?',
    okText:'발사!', cancelText:'나중에',
    color:'#E53935',
    onOk:()=>{ launchRocket(); },
    onCancel:()=>{
      // 발사 안 하면 자동 목적지 설정
      autoPickNextDestination();
      update();
    }
  });
}
function closeModalAndLaunch(wr){
  closeModal(wr);
  setTimeout(launchRocket,100);
}
// 새 게임 초기 상태(공통). resetGame·doPrestige가 공유한다.
function freshState(){
  return {city:'충주',dest:null,sgKm:0,sgTot:100,totKm:0,xp:0,xpMax:100,lv:1,money:800,hp:100,mhp:100,end:5,speed:6,sp:3,vId:'v1',ap:3,jc:2,dopT:0,dopSp:5,autoApple:false,riding:false,restT:0,ecool:0,prevBaseMhp:100,mhpSpBonus:0,moonKm:0,paints:['gray'],activePaint:'gray',gachaCount:0,foodStreak:0,seenTabs:{npc:0,veh:0,ach:0,gear:0},inventory:[],equipped:{head:null,eyes:null,hands:null,feet:null,body:null},npcs:NPCS.map(n=>({...n})),visited:[],foodDone:[],foodToday:[],postcards:[],achievements:[],boostCount:0,offlineCount:0,prestige:0,vehs:VEHS.map(v=>({id:v.id,owned:v.owned}))};
}
// 초기화 후 공통 뒷정리(뱃지·애니메이션·루프)
function afterReset(){
  S.seenTabs.veh = (S.vehs||[]).filter(v=>v.owned).length;
  S.seenTabs.gear = (S.inventory||[]).length;
  S.seenTabs.npc = S.npcs.filter(n=>n.met&&!n.locked).length;
  S.seenTabs.ach = (S.achievements||[]).length;
  if(tickIv){clearInterval(tickIv);tickIv=null;}isResting=false;boosterBubble=0;evAnim=null;evAnimNpc=null;diceAnim=0;diceTarget=null;tyTalkTimer=1800;tyBubbleTimer=0;tyBubbleText='';oxResult=null;
  document.getElementById('ride-btn').textContent='▶ 출발!';
}
function resetGame(){
  if(modalOpen()){showSt('진행 중인 선택을 먼저 마쳐주세요');return;}
  if(!confirm('초기화?'))return;localStorage.removeItem('bkdng_v45');saveReady=true; // 초기화 확정 → 새 상태로 자동저장 재개
  S=freshState(); logs=[];
  afterReset();
  showSt('초기화 완료');update();
}

// ── #6 여행 엽서 앨범 ──────────────────────────────────
// 도시 첫 도착마다 엽서 1장 수집(데이터는 {도시,날짜}만, 그림은 즉석 렌더 → 저장 용량 절약)
function collectPostcard(city){
  if(!Array.isArray(S.postcards)) S.postcards=[];
  if(S.postcards.some(p=>p.city===city)) return;
  const d=new Date();
  const date=d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
  S.postcards.push({city, date});
}
function renderPostcards(){
  const el=document.getElementById('postcard-panel'); if(!el) return;
  const list=S.postcards||[];
  if(list.length===0){
    el.innerHTML=`<div class="px-panel" style="text-align:center;"><div style="font-size:calc(12px * var(--u));color:#5C3D1E;line-height:1.9;">아직 모은 엽서가 없어요.<br>도시에 도착하면 여행 엽서가<br>한 장씩 수집됩니다 📮</div></div>`;
    return;
  }
  const cards=list.map((p,i)=>`<div style="cursor:pointer;" onclick="showPostcardBig(${i})"><canvas class="pc-thumb" data-i="${i}" width="200" height="130" style="width:100%;height:auto;border-radius:6px;display:block;image-rendering:pixelated;box-shadow:0 3px 8px rgba(0,0,0,.4);"></canvas></div>`).join('');
  el.innerHTML=`
    <div class="px-panel" style="margin-bottom:5px;">
      <div style="font-size:calc(12px * var(--u));color:#3D2510;text-align:center;margin-bottom:3px;">📮 여행 엽서 (${list.length})</div>
      <div style="font-size:calc(10px * var(--u));color:#8B6340;text-align:center;">도시 도착마다 한 장 · 눌러서 크게 보고 저장</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:calc(7px * var(--u));padding-bottom:calc(10px * var(--u));">${cards}</div>`;
  el.querySelectorAll('canvas.pc-thumb').forEach(cv=>{
    const p=list[+cv.dataset.i];
    renderPostcardTo(cv.getContext('2d'), cv.width, cv.height, p.city, p.date);
  });
}
function showPostcardBig(i){
  const el=document.getElementById('postcard-panel'); const p=(S.postcards||[])[i];
  if(!el||!p) return;
  el.innerHTML=`
    <div class="px-panel" style="margin-bottom:5px;">
      <canvas id="pc-big" width="360" height="234" style="width:100%;height:auto;border-radius:8px;image-rendering:pixelated;display:block;margin-bottom:9px;"></canvas>
      <button class="px-btn px-btn-blue" style="width:100%;font-size:calc(12px * var(--u));margin-bottom:6px;" onclick="savePostcardImage(${i})">🖼 이미지 저장</button>
      <button class="px-btn" style="width:100%;font-size:calc(12px * var(--u));" onclick="renderPostcards()">◀ 앨범으로</button>
    </div>`;
  const cv=document.getElementById('pc-big');
  renderPostcardTo(cv.getContext('2d'), cv.width, cv.height, p.city, p.date);
}
function savePostcardImage(i){
  const p=(S.postcards||[])[i]; if(!p) return;
  const cv=document.createElement('canvas'); cv.width=600; cv.height=390;
  renderPostcardTo(cv.getContext('2d'), cv.width, cv.height, p.city, p.date);
  try{
    cv.toBlob(function(blob){
      if(!blob){ showSt('저장 실패'); return; }
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='임복동_엽서_'+p.city+'.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      showSt('🖼 엽서 저장 완료!');
    },'image/png');
  }catch(e){ showSt('저장 실패'); }
}

// ── 프레스티지(2회차 세계일주) — 콘텐츠 소진 해결. 진행 리셋 + 영구 배수 ──
function prestigeMult(){ return 1 + 0.25*(S.prestige||0); } // 속도·수입 +25%/회차
function canPrestige(){
  if(vehOwned('v30')) return true; // 전설의 서퍼티지(₩2억) 보유 = 사실상 완주
  return CITIES.filter(c=>c.region!=='우주').every(c=>S.visited.includes(c.n)); // 또는 전 도시 방문
}
function doPrestige(){
  if(modalOpen()){showSt('진행 중인 선택을 먼저 마쳐주세요');return;}
  if(!canPrestige()){showSt('아직 조건 미달 — v30 보유 또는 전 도시 방문 시 가능');return;}
  const nextMult = 1 + 0.25*((S.prestige||0)+1);
  showConfirmModal({
    title:'🌏 '+((S.prestige||0)+1)+'회차 세계일주?',
    message:`지금까지의 진행(레벨·돈·자전거·장비·방문)이 초기화됩니다.\n대신 영구 보너스 "여행 노하우"를 얻어요:\n\n🚀 속도·수입 +${Math.round((nextMult-1)*100)}% (영구)\n🏆 업적·프레스티지 횟수는 유지\n👥 NPC를 다시 만나 보상을 또 받습니다`,
    okText:'2회차 출발! 🌏', cancelText:'아직...', color:'#8B5CF6',
    onOk:()=>{
      const keep={ prestige:(S.prestige||0)+1, achievements:S.achievements||[], paints:S.paints||['gray'], activePaint:S.activePaint||'gray', autoApple:!!S.autoApple };
      S=freshState();
      S.prestige=keep.prestige; S.achievements=keep.achievements; S.paints=keep.paints; S.activePaint=keep.activePaint; S.autoApple=keep.autoApple;
      afterReset();
      addLog('good','🌏✨ '+S.prestige+'회차 세계일주 시작! 여행 노하우: 속도·수입 +'+Math.round((prestigeMult()-1)*100)+'% (영구)');
      showSt('🌏 '+S.prestige+'회차 시작!');
      playSfx('levelup');
      update();
    }
  });
}
function showSt(msg){const el=document.getElementById('sv-st');if(el){el.textContent=msg;setTimeout(()=>el.textContent='',3000);}}
function addLog(t,m){
  logs.unshift({type:t,msg:m});
  if(logs.length>35)logs.pop();
  if(curTab==='log')renderLog();
  // 6번: 로그 타입별 효과음
  if(t==='good') playSfx('good');
  else if(t==='bad') playSfx('bad');
}

// 6번: 사운드 시스템 (Web Audio API)
var _audioCtx = null;
var soundEnabled = (localStorage.getItem('bkdng_sound') !== 'off');
function _ensureAudio(){
  if(_audioCtx) return _audioCtx;
  try{
    _audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  }catch(e){ return null; }
  return _audioCtx;
}
function playTone(freq, dur, type, vol){
  if(!soundEnabled) return;
  const ctx = _ensureAudio();
  if(!ctx) return;
  if(ctx.state==='suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol||0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}
function playSfx(name){
  if(!soundEnabled) return;
  switch(name){
    case 'click':    playTone(880, 0.06, 'square', 0.06); break;
    case 'good':     playTone(660, 0.10, 'square', 0.08); setTimeout(()=>playTone(880, 0.10, 'square', 0.08), 60); break;
    case 'bad':      playTone(220, 0.18, 'sawtooth', 0.07); break;
    case 'arrive':   playTone(523, 0.10, 'square', 0.09); setTimeout(()=>playTone(659, 0.10, 'square', 0.09),100); setTimeout(()=>playTone(784, 0.18, 'square', 0.09),200); break;
    case 'levelup':  playTone(523, 0.08, 'square', 0.09); setTimeout(()=>playTone(659, 0.08, 'square', 0.09),80); setTimeout(()=>playTone(784, 0.08, 'square', 0.09),160); setTimeout(()=>playTone(1047, 0.20, 'square', 0.09),240); break;
    case 'rocket':   playTone(80, 0.4, 'sawtooth', 0.10); break;
    case 'explosion':playTone(60, 0.3, 'sawtooth', 0.12); setTimeout(()=>playTone(40, 0.3, 'sawtooth', 0.10),120); break;
    case 'apple':    playTone(880, 0.08, 'sine', 0.06); setTimeout(()=>playTone(1100, 0.10, 'sine', 0.06), 60); break;
    case 'boost':    playTone(440, 0.05, 'sawtooth', 0.07); setTimeout(()=>playTone(660, 0.05, 'sawtooth', 0.07),40); setTimeout(()=>playTone(880, 0.10, 'sawtooth', 0.07),80); break;
    case 'sin':      playTone(110, 0.3, 'sawtooth', 0.10); setTimeout(()=>playTone(82, 0.4, 'sawtooth', 0.10),200); break;
    case 'gear':     playTone(800, 0.08, 'triangle', 0.07); setTimeout(()=>playTone(1200, 0.12, 'triangle', 0.07), 80); break;
    case 'mythic':   playTone(523, 0.05, 'square', 0.08); setTimeout(()=>playTone(784, 0.05, 'square', 0.08),60); setTimeout(()=>playTone(1047, 0.05, 'square', 0.08),120); setTimeout(()=>playTone(1568, 0.30, 'square', 0.10),180); break;
  }
}
// #2 자동 사과 토글 — 체력 30% 이하면 자동으로 사과 섭취(방치 지원)
function toggleAutoApple(){
  S.autoApple = !S.autoApple;
  addLog(S.autoApple?'good':'neutral', S.autoApple?'🍎 자동 사과 ON — 체력 30% 이하면 자동 섭취':'🍎 자동 사과 OFF');
  update();
}
function toggleSound(){
  soundEnabled = !soundEnabled;
  localStorage.setItem('bkdng_sound', soundEnabled?'on':'off');
  if(soundEnabled){
    addLog('good','🔊 사운드 ON');
    playSfx('good');
  } else {
    addLog('neutral','🔇 사운드 OFF');
  }
  update();
}



// ── 탭 ─────────────────────────────────────────────────
function ST(tab){
  ['main','mission','npc','veh','gear','item','codex','stat','ach','gacha','postcard','log'].forEach(t=>{const el=document.getElementById('tab-'+t);if(el)el.style.display=t===tab?'block':'none';});
  document.querySelectorAll('.px-tab').forEach((el,i)=>el.classList.toggle('on',['main','mission','npc','veh','gear','item','codex','stat','ach','gacha','postcard','log'][i]===tab));
  curTab=tab;
  if(!S.seenTabs) S.seenTabs={npc:0,veh:0,ach:0,gear:0};
  if(tab==='npc') S.seenTabs.npc = S.npcs.filter(n=>n.met&&!n.locked).length;
  if(tab==='veh'){
    S.seenTabs.veh = (S.vehs||[]).filter(v=>v.owned).length;
    // 3번 fix: 현재 구매가능한 탈것 개수를 봤다고 기록 → 파란점 해제
    let bc = 0;
    (S.vehs||[]).forEach(sv=>{
      if(sv.owned) return;
      const v = VEHS.find(x=>x.id===sv.id);
      if(!v || v.cat==='rocket') return;
      if((S.totKm||0) >= (v.km||0) && (S.money||0) >= (v.cost||0)) bc++;
    });
    S.seenVehBuyable = bc;
  }
  if(tab==='ach') S.seenTabs.ach = (S.achievements||[]).length;
  if(tab==='gear') S.seenTabs.gear = (S.inventory||[]).length;
  refreshTabBadges();
  if(tab==='mission')renderMission();
  if(tab==='codex')renderCodex();
  if(tab==='gacha')renderGachaShop();
  if(tab==='npc')renderNpcs();if(tab==='veh')renderVehs();if(tab==='gear')renderGear();if(tab==='item')renderItems();if(tab==='stat')renderStat();if(tab==='ach')renderAch();if(tab==='postcard')renderPostcards();if(tab==='log')renderLog();
}

function renderLog(){const el=document.getElementById('ev-log');if(!logs.length){el.innerHTML='<div class="px-panel" style="font-size:calc(9px * var(--u));text-align:center;color:#8B6340;">아직 이벤트 없음</div>';return;}el.innerHTML=logs.map(e=>`<div class="ev-item ev-${e.type}">${e.msg}</div>`).join('');}

// 2번: 가챠 탭 — 페인트 + 장비 가챠
function renderGachaShop(){
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  const gachaCnt = S.gachaCount || 0;
  const pityLeft = 50 - gachaCnt;

  // 결과 알림
  const resultHtml = gachaResult ? renderGachaResultBox() : '';

  document.getElementById('gacha-panel').innerHTML = `
    <div class="px-panel" style="margin-bottom:5px;background:linear-gradient(135deg,#FFF8E1,#FFE082);border-color:#FF6D00;">
      <div style="${fs(8)};color:#E65100;text-align:center;margin-bottom:calc(6px * ${u});">🎰 가챠 상점</div>
      <div style="${fs(5)};color:#5C3D1E;text-align:center;line-height:1.8;">충동적으로 게임머니를 써보자!</div>
    </div>

    ${resultHtml}

    <div class="px-panel" style="margin-bottom:5px;border-color:#7B1FA2;background:linear-gradient(135deg,#F3E5F5,#FFFFFF);">
      <div style="${fs(7)};color:#4A148C;margin-bottom:calc(6px * ${u});text-align:center;">⚔️ 장비 가챠</div>
      <div style="${fs(5)};color:#5C3D1E;background:rgba(255,255,255,.7);border-radius:calc(4px * ${u});padding:calc(5px * ${u});margin-bottom:calc(6px * ${u});line-height:1.9;text-align:center;">
        일반 60% · 레어 25% · 유니크 12% · 전설 3%<br>
        <b style="color:#7B1FA2;">🎯 천장 시스템: 50회 시 전설 확정!</b>
      </div>
      <div style="${fs(5)};color:#5C3D1E;background:#FFF;border:1px dashed #7B1FA2;border-radius:calc(4px * ${u});padding:calc(4px * ${u});margin-bottom:calc(6px * ${u});text-align:center;">
        🎯 천장까지: <b>${pityLeft}회</b> 남음
      </div>
      <button class="px-btn" style="width:100%;${fs(7)};background:#7B1FA2;border-color:#4A148C;box-shadow:calc(3px * ${u}) calc(3px * ${u}) 0 #2A0040;" onclick="rollGearGacha()">⚔️ 장비 뽑기 ₩100,000</button>
    </div>
  `;
}
function renderGachaResultBox(){
  if(!gachaResult) return '';
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  const r = gachaResult;
  // 장비 가챠 결과만 (페인트 제거)
  const item = r.item;
  const rarity = GEAR_RARITY.find(x=>x.key===item.rarity);
  return `<div class="px-panel" style="margin-bottom:5px;border-color:${rarity.color};background:${rarity.bg};box-shadow:0 0 calc(8px * ${u}) ${rarity.color};">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:calc(6px * ${u});">
      <div style="${fs(7)};color:${rarity.color};font-weight:bold;">⚔️ 장비 획득!</div>
      <button class="px-btn px-btn-sm px-btn-gray" onclick="dismissGachaResult()" style="${fs(5)};">✕</button>
    </div>
    <div style="${fs(7)};color:#3D2510;text-align:center;">[${rarity.label}] ${getSlotIcon(item.slot)} ${item.name}</div>
  </div>`;
}
function renderNpcs(){
  const metCount=S.npcs.filter(n=>n.met&&!n.locked).length;
  const totalVisible=S.npcs.filter(n=>!n.locked).length;
  const gradeOrder=['normal','rare','unique','legend','disaster','epic','god'];
  const gradeLabel={normal:'일반',rare:'🔵 레어',unique:'🟢 유니크',legend:'🟡 전설',disaster:'☠️ 재앙',epic:'🟣 에픽',god:'✨ 신'};
  let html=`<div class="px-panel" style="font-size:calc(9px * var(--u));color:#8B6340;margin-bottom:5px;">${metCount}/${totalVisible}명 만남</div>`;
  gradeOrder.forEach(grade=>{
    const grpNpcs=S.npcs.filter(n=>n.grade===grade);
    if(!grpNpcs.length)return;
    const gc=GRADE_COLOR[grade]||'#5C3D1E';
    html+=`<div style="font-size:calc(9px * var(--u));color:${gc};margin:8px 6px 4px;padding-bottom:3px;border-bottom:2px solid ${gc};">${gradeLabel[grade]}</div>`;
    grpNpcs.forEach(n=>{
      const em=NPC_EMOJI[n.id]||'👤';
      const gb=GRADE_BG[n.grade]||'#F5E6C8';
      if(n.locked){
        html+=`<div class="px-panel" style="margin-bottom:5px;opacity:.45;display:flex;align-items:center;gap:8px;"><div style="font-size:calc(18px * var(--u));">❓</div><div><div style="font-size:calc(9px * var(--u));color:#8B6340;">??? (${GRADE_LABEL[n.grade]})</div><div style="font-size:calc(9px * var(--u));color:#8B6340;margin-top:2px;">미개방 NPC</div></div></div>`;
      }else{
        html+=`<div class="px-panel" style="margin-bottom:5px;background:${n.met?gb:'#F5E6C8'};border-color:${n.met?gc:'#8B6340'};display:flex;align-items:center;gap:8px;">
          <div style="font-size:calc(18px * var(--u));">${em}</div>
          <div>
            <div style="font-size:calc(9px * var(--u));color:#3D2510;">${n.n}${n.met?' ✓':''}</div>
            <div style="font-size:calc(9px * var(--u));color:${gc};margin-top:1px;">[${GRADE_LABEL[n.grade]}]</div>
            <div style="font-size:calc(9px * var(--u));color:#8B6340;margin-top:1px;">${n.met?n.lines[0]:'???'}</div>
          </div>
        </div>`;
      }
    });
  });
  document.getElementById('npc-list').innerHTML=html;
}

// 탈것 탭 — 카테고리별 + 미니 픽셀 이미지
function renderVehs(){
  const cats=[
    {key:'bike', label:'🚲 자전거 (30단계 업그레이드)'},
    {key:'rocket',label:'🚀 1회용 로켓'},
  ];
  let html='';
  cats.forEach(cat=>{
    let catVehs=VEHS.filter(v=>v.cat===cat.key);
    // 2번: 로켓은 보유 중일 때만 탈것 탭에 표시 (희소성)
    if(cat.key==='rocket') catVehs = catVehs.filter(v=>vehOwned(v.id));
    if(!catVehs.length)return;
    html+=`<div style="font-size:calc(9px * var(--u));color:#8B6340;margin:8px 6px 4px;padding-bottom:3px;border-bottom:2px solid #D4B483;">${cat.label}</div>`;
    catVehs.forEach(v=>{
      const cur=v.id===S.vId;
      const owned=vehOwned(v.id);
      const locked=!owned&&S.totKm<v.km;
      const canBuy=!owned&&!locked&&S.money>=v.cost;
      let btn='';
      // 로켓: 보유 중일 때만 여기 도달 → 발사 버튼만 표시
      if(v.cat==='rocket'){
        btn=`<button class="px-btn px-btn-sm px-btn-red" onclick="launchRocket()" style="font-size:calc(9px * var(--u));">🚀발사!</button>`;
      } else {
        if(cur)btn=`<span style="color:#4CAF50;font-size:calc(9px * var(--u));white-space:nowrap;">[현재]</span>`;
        else if(owned)btn=`<button class="px-btn px-btn-sm px-btn-green" onclick="switchVeh('${v.id}')">변경</button>`;
        else if(canBuy)btn=`<button class="px-btn px-btn-sm px-btn-green" onclick="buyVeh('${v.id}')">₩${v.cost.toLocaleString()}</button>`;
        else if(!owned&&!locked)btn=`<div style="font-size:calc(9px * var(--u));color:#8B6340;">₩${v.cost.toLocaleString()}<br>(돈부족)</div>`;
        else btn=`<div style="font-size:calc(9px * var(--u));color:#8B6340;">🔒<br>${v.km.toLocaleString()}km</div>`;
      }
      const canvasId='vc-'+v.id;
      const rocketNote=v.cat==='rocket'?`<div style="font-size:calc(7px * var(--u));color:#E53935;margin-top:2px;">1회용 · 5% 폭발확률</div><div style="font-size:calc(7px * var(--u));color:#8B6340;margin-top:1px;">🔒 나로호발사센터에서만 구매 가능</div>`:'';
      html+=`<div class="px-panel" style="margin-bottom:5px;${cur?'border-color:#4CAF50;':''}${v.cat==='rocket'&&owned?'border-color:#FF6D00;background:#FFF3E0;':''}${locked?'opacity:.5':''}">
        <div style="display:flex;align-items:center;gap:10px;">
          <canvas id="${canvasId}" width="80" height="50" class="veh-canvas"></canvas>
          <div style="flex:1;">
            <div style="font-size:calc(9px * var(--u));color:#3D2510;">${v.n}${owned&&!cur&&v.cat!=='rocket'?' <span style="font-size:calc(9px * var(--u));color:#1976D2;">[보유]</span>':''}</div>
            <div style="font-size:calc(9px * var(--u));color:#8B6340;margin-top:2px;">🏎️ ${v.sp}km/h &nbsp; ❤️+${v.hb} &nbsp; <span style="color:#B71C1C;">💔${(0.30 * (v.sp/6)).toFixed(2)}/s</span></div>
            ${rocketNote}
            ${locked?`<div style="font-size:calc(9px * var(--u));color:#8B6340;">🔒 ${v.km.toLocaleString()}km 필요</div>`:''}
          </div>
          ${btn}
        </div>
      </div>`;
    });
  });
  document.getElementById('veh-list').innerHTML=html;
  VEHS.forEach(v=>{
    const el=document.getElementById('vc-'+v.id);
    if(!el)return;
    const c=el.getContext('2d');c.imageSmoothingEnabled=false;
    c.clearRect(0,0,80,50);c.fillStyle='#E8D0A0';c.fillRect(0,0,80,50);
    drawVehPixel(c,v.id,40,36,.7,false);
  });
}
function buyVeh(id){
  const v=VEHS.find(x=>x.id===id);if(!v)return;
  // 3번: 로켓 외 탈것은 이미 보유 시 재구매 차단
  if(v.cat!=='rocket' && vehOwned(id)){addLog('bad','이미 보유 중!');return;}
  // 3번: 로켓은 이미 보유 시 차단 (1회용이라 1개만)
  if(v.cat==='rocket' && vehOwned(id)){addLog('bad','임복동1호 이미 보유 중! 발사 후 다시 구매하세요.');return;}
  if(S.money<v.cost||S.totKm<v.km){addLog('bad','조건 부족!');return;}
  S.money-=v.cost;setVehOwned(id,true);
  // 2번 fix: 탈것 탭에서 구매 시 즉시 seenTabs.veh 갱신 (빨간점 잔존 방지)
  if(curTab==='veh' && S.seenTabs){
    S.seenTabs.veh = (S.vehs||[]).filter(v=>v.owned).length;
  }
  if(v.cat==='rocket'){addLog('good','🚀 임복동1호 구매! 발사 준비 완료 (5% 폭발주의)');renderVehs();update();return;}
  S.vId=id;
  // 1번 fix: SP 투자분(mhpSpBonus) + 헬멧 보너스를 명시적으로 합산
  const baseMhp = 100 + v.hb;
  const helmetBonus = getHelmetBonus();
  S.prevBaseMhp = baseMhp;
  S.mhp = baseMhp + (S.mhpSpBonus || 0) + helmetBonus;
  S.hp  = Math.min(S.hp, S.mhp);
  addLog('good',v.n+' 구매! 최대체력: '+S.mhp);
  checkAchievements();renderVehs();update();
}
function switchVeh(id){
  const v=VEHS.find(x=>x.id===id);if(!v||!vehOwned(id))return;
  S.vId=id;
  const baseMhp = 100 + v.hb;
  const helmetBonus = getHelmetBonus();
  S.prevBaseMhp = baseMhp;
  S.mhp = baseMhp + (S.mhpSpBonus || 0) + helmetBonus;
  S.hp  = Math.min(S.hp, S.mhp);
  addLog('good',v.n+'으로 변경! 최대체력: '+S.mhp);
  renderVehs();update();
}
// 1번 fix: 현재 장착된 헬멧의 mhpBonus 반환
function getHelmetBonus(){
  if(!S.equipped || !S.equipped.head) return 0;
  const item = (S.inventory||[]).find(x=>x.id===S.equipped.head);
  if(!item) return 0;
  const ef = GEAR_EFFECT.head(item.mult, item);
  return ef.mhpBonus || 0;
}
// 1번 fix: 헬멧 변경/강화 시 mhp 일관 갱신
function refreshMhpFromHelmet(){
  S.mhp = (S.prevBaseMhp||100) + (S.mhpSpBonus||0) + getHelmetBonus();
  S.hp = Math.min(S.hp, S.mhp);
}

function renderItems(){
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  document.getElementById('item-panel').innerHTML = `
  <div class="px-panel" style="margin-bottom:5px;">
    <div style="${fs(7)};color:#8B6340;margin-bottom:calc(8px * ${u});">과수원집 아들의 특산품</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:calc(8px * ${u});">
      <div>
        <div style="${fs(7)};color:#3D2510;">🍎 사과</div>
        <div style="${fs(6)};color:#8B6340;">체력+30</div>
      </div>
      <div style="display:flex;gap:calc(4px * ${u});align-items:center;">
        <span style="${fs(7)};color:${S.ap>=99?'#B71C1C':'#3D2510'};">${S.ap}/99</span>
        <button class="px-btn px-btn-sm px-btn-green" onclick="useApple()">먹기</button>
        <button class="px-btn px-btn-sm" onclick="buyAp()" ${S.ap>=99?'disabled style="opacity:.5;"':''}>₩3,000</button>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="${fs(7)};color:#3D2510;">🧃 사과즙 (부스터)</div>
        <div style="${fs(6)};color:#8B6340;">40초 속도+${S.dopSp||5} ⚡${S.solarBoost?' ☀️':''}</div>
      </div>
      <div style="display:flex;gap:calc(4px * ${u});align-items:center;">
        <span style="${fs(7)};color:${S.jc>=99?'#B71C1C':'#3D2510'};">${S.jc}/99</span>
        <button class="px-btn px-btn-sm px-btn-orange" onclick="useJuice()">부스터!</button>
        <button class="px-btn px-btn-sm" onclick="buyJc()" ${S.jc>=99?'disabled style="opacity:.5;"':''}>₩8,000</button>
      </div>
    </div>
  </div>

  <div class="px-panel" style="margin-bottom:5px;border-color:#388E3C;background:linear-gradient(135deg,#E8F5E9,#FFF8DC);">
    <div style="${fs(7)};color:#1B5E20;margin-bottom:calc(6px * ${u});text-align:center;">📦 사과박스 (랜덤)</div>
    <div style="${fs(5)};color:#5C3D1E;background:rgba(255,255,255,.6);border-radius:calc(4px * ${u});padding:calc(5px * ${u});margin-bottom:calc(6px * ${u});line-height:1.9;text-align:center;font-style:italic;">
      과수원집 아들이 잘 알지... <br>박스를 열어봐야 안다.
    </div>
    <button class="px-btn" style="width:100%;${fs(7)};background:#388E3C;border-color:#1B5E20;box-shadow:calc(3px * ${u}) calc(3px * ${u}) 0 #0D3F12, inset 1px 1px 0 #66BB6A;" onclick="buyJuiceBox()">📦 박스 구매 ₩15,000</button>
  </div>

  ${juiceBoxResult ? `
  <div class="px-panel" style="margin-bottom:5px;border-color:${juiceBoxResult.color};background:${juiceBoxResult.bg};box-shadow:0 0 calc(8px * ${u}) ${juiceBoxResult.color};animation:pulse 1.5s infinite;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:calc(6px * ${u});">
      <div style="${fs(8)};color:${juiceBoxResult.color};font-weight:bold;">${juiceBoxResult.title}</div>
      <button class="px-btn px-btn-sm px-btn-gray" style="${fs(5)};padding:calc(3px * ${u}) calc(7px * ${u});" onclick="dismissJuiceBoxResult()">✕</button>
    </div>
    <div style="${fs(7)};color:#3D2510;background:rgba(255,255,255,.85);border:2px solid ${juiceBoxResult.color};border-radius:calc(6px * ${u});padding:calc(8px * ${u});line-height:2;text-align:center;">
      ${juiceBoxResult.msg}
    </div>
  </div>` : ''}

  ${S.dopT>0?`<div class="px-panel" style="margin-bottom:5px;border-color:#FF6D00;background:#FFF3E0;${fs(7)};color:#E65100;text-align:center;">⚡ 부스터 ON! 남은 ${S.dopT}초${S.solarBoost?' ☀️':''}</div>`:''}

  ${S.poisonUntil && Date.now()<S.poisonUntil ? `<div class="px-panel" style="margin-bottom:5px;border-color:#5D0303;background:#3D0000;${fs(7)};color:#FFCDD2;text-align:center;">☠️ 독 효과 진행 중... 체력이 계속 감소!</div>`:''}

  ${S.disasterFred ? `<div class="px-panel" style="margin-bottom:5px;border-color:#5D0303;background:#FFE0E0;${fs(6)};color:#5D0303;text-align:center;line-height:1.8;">💸 탐욕의 프레드 저주!<br>${Math.floor(S.totKm-S.disasterFred.kmStart)}/1000km 진행<br><span style="${fs(5)};">100km마다 소지금 0.5% 약탈</span></div>`:''}

  <div class="px-panel">
    <div style="${fs(6)};color:#8B6340;line-height:2.1;">임복동은 과수원집 아들.<br>어느 날 충동이 생겼고, 그냥 떠났다.</div>
  </div>`;
}

function renderStat(){
  const v=cv2(),metNpc=S.npcs.filter(n=>n.met&&!n.locked).length;
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px<11?px+2:px}px * ${u})`;
  // 5번: 펫 정보
  const pet = getPetStage();
  // 1번 fix: nextThresholds를 getPetStage와 동일한 기준으로 통일 (2K/10K/30K)
  const nextThresholds = [2000, 10000, 30000];
  const nextKm = nextThresholds.find(t => t > (S.totKm||0));
  const petNextText = nextKm
    ? `다음 진화까지 ${(nextKm - Math.floor(S.totKm||0)).toLocaleString()}km`
    : '최대 진화 도달! ✨';

  // 프레스티지(2회차) 패널 — 현재 회차·보너스 + 진입 버튼
  const pv=S.prestige||0;
  const canP=canPrestige();
  const prestigeHtml=`
  <div class="px-panel" style="margin-bottom:5px;background:linear-gradient(135deg,#2b1b45,#3b2566);border-color:#8B5CF6;">
    <div style="${fs(8)};color:#C4B5FD;text-align:center;font-weight:bold;margin-bottom:4px;">🌏 세계일주 ${pv+1}회차</div>
    ${pv>0?`<div style="${fs(6)};color:#DDD6FE;text-align:center;margin-bottom:6px;">여행 노하우: 속도·수입 <b>+${Math.round((prestigeMult()-1)*100)}%</b> (영구)</div>`:''}
    ${canP
      ? `<button class="px-btn" style="width:100%;${fs(7)};background:linear-gradient(180deg,#a78bfa,#7c3aed);border-color:#6d28d9;color:#fff;" onclick="doPrestige()">🌏 ${pv+1}회차 출발! (속도·수입 +25% 획득)</button>`
      : `<div style="${fs(5)};color:#C4B5FD;text-align:center;">v30(전설의 서퍼티지) 보유 또는 전 도시 방문 시 2회차 가능</div>`}
  </div>
  <div class="px-panel" style="margin-bottom:5px;background:linear-gradient(135deg,#FFF8E1,#FFFDE7);border-color:${pet.textColor};">
    <div style="${fs(7)};color:${pet.textColor};margin-bottom:6px;text-align:center;font-weight:bold;text-shadow:1px 1px 0 #FFF;">${pet.name} (${pet.stage}/4 단계)</div>
    <div style="${fs(5)};color:#5C3D1E;text-align:center;font-weight:bold;">${petNextText}</div>
  </div>`;
  document.getElementById('stat-panel').innerHTML=prestigeHtml+`
  <div class="px-panel" style="margin-bottom:5px;">
    <div style="${fs(7)};color:#5C3D1E;margin-bottom:8px;border-bottom:2px solid #D4B483;padding-bottom:5px;">▶ 현재 스테이터스</div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">레벨</div><div style="${fs(6)};color:#3D2510;">Lv. ${S.lv}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">경험치</div><div style="${fs(6)};color:#3D2510;">${Math.round(S.xp)} / ${S.xpMax}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">현재 위치</div><div style="${fs(6)};color:#3D2510;">${S.city}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">총 거리</div><div style="${fs(6)};color:#3D2510;">${Math.round(S.totKm).toLocaleString()} km</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">보유 금액</div><div style="${fs(6)};color:#3D2510;">₩ ${S.money.toLocaleString()}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">탈것</div><div style="${fs(6)};color:#3D2510;">${v.n}</div></div>
  </div>

  <div class="px-panel" style="margin-bottom:5px;">
    <div style="${fs(7)};color:#5C3D1E;margin-bottom:8px;border-bottom:2px solid #D4B483;padding-bottom:5px;">▶ 능력치</div>

    <div class="stat-row">
      <div>
        <div style="${fs(6)};color:#8B6340;">❤️ 체력</div>
        <div style="${fs(5)};color:#AAAAAA;margin-top:2px;">0되면 이동 불가 · 휴식/사과로 회복</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <div class="px-bar-bg" style="width:calc(70px * ${u});height:calc(10px * ${u});"><div class="px-bar-fill" style="width:${Math.round(S.hp/S.mhp*100)}%;background:#E53935;"></div></div>
        <div style="${fs(6)};color:#3D2510;">${Math.round(S.hp)}/${S.mhp}</div>
      </div>
    </div>

    <div class="stat-row">
      <div>
        <div style="${fs(6)};color:#8B6340;">🏎️ 속도</div>
        <div style="${fs(5)};color:#AAAAAA;margin-top:2px;">탈것 기본값 · 이동 거리에 직접 영향</div>
      </div>
      <div style="${fs(6)};color:#3D2510;">${v.sp} km/h</div>
    </div>

    <div class="stat-row">
      <div>
        <div style="${fs(6)};color:#8B6340;">🏔️ 지구력</div>
        <div style="${fs(5)};color:#AAAAAA;margin-top:2px;">휴식 회복+${S.end} · 부스터 시간 +${(S.end*0.5).toFixed(1)}초</div>
      </div>
      <div style="${fs(6)};color:#3D2510;">${S.end}</div>
    </div>

    <div class="stat-row">
      <div>
        <div style="${fs(6)};color:${S.dopT>0?'#E65100':'#8B6340'};">⚡ 부스터</div>
        <div style="${fs(5)};color:#AAAAAA;margin-top:2px;">속도+${S.dopSp} · 사과즙 사용 시 ${Math.round(40+S.end*0.5)}초 발동</div>
      </div>
      <div style="${fs(6)};color:${S.dopT>0?'#E65100':'#3D2510'};">
        ${S.dopT>0?`<span style="background:#FF6D00;color:#FFF;padding:1px 5px;border-radius:3px;">ON ${S.dopT}초</span>`:'OFF'}
      </div>
    </div>

    <div class="stat-row">
      <div>
        <div style="${fs(6)};color:#8B6340;">🍎 사과</div>
        <div style="${fs(5)};color:#AAAAAA;margin-top:2px;">즉시 체력+30 · 과수원집 아들의 특산품</div>
      </div>
      <div style="${fs(6)};color:#3D2510;">${S.ap}개</div>
    </div>

    <div class="stat-row">
      <div>
        <div style="${fs(6)};color:#8B6340;">🧃 사과즙</div>
        <div style="${fs(5)};color:#AAAAAA;margin-top:2px;">부스터 40초 발동 · 속도+5 추가</div>
      </div>
      <div style="${fs(6)};color:#3D2510;">${S.jc}개</div>
    </div>
  </div>

  <div class="px-panel" style="margin-bottom:5px;${S.sp>0?'border-color:#FF6D00;':''}">
    <div style="${fs(7)};color:#5C3D1E;margin-bottom:6px;border-bottom:2px solid #D4B483;padding-bottom:5px;">
      ▶ 스탯 포인트 <span style="color:${S.sp>0?'#E65100':'#8B6340'};">[${S.sp}]</span>
    </div>
    <div style="${fs(5)};color:#8B6340;margin-bottom:8px;">레벨업 시 1포인트 획득</div>
    ${S.sp>0?`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
      <button class="px-btn px-btn-sm" onclick="upgStat('end')" style="${fs(6)};text-align:left;padding:7px 8px;line-height:1.7;">
        🏔️ 지구력 +1<br><span style="color:#C49A6C;">현재: ${S.end} → ${S.end+1}</span><br><span style="${fs(5)};color:#AAAAAA;">휴식 +1 · 부스터 시간 +0.5초</span>
      </button>
      <button class="px-btn px-btn-sm" onclick="upgStat('mhp')" style="${fs(6)};text-align:left;padding:7px 8px;line-height:1.7;">
        ❤️ 최대체력 +10<br><span style="color:#C49A6C;">현재: ${S.mhp} → ${S.mhp+10}</span><br><span style="${fs(5)};color:#AAAAAA;">생존력 향상</span>
      </button>
    </div>`:`<div style="${fs(6)};color:#8B6340;text-align:center;padding:5px;">레벨업하면 포인트 획득!</div>`}
  </div>

  <div class="px-panel">
    <div style="${fs(7)};color:#5C3D1E;margin-bottom:8px;border-bottom:2px solid #D4B483;padding-bottom:5px;">▶ 여행 기록</div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">방문 도시</div><div style="${fs(6)};color:#3D2510;">${S.visited.length} / ${CITIES.length}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">맛집 방문</div><div style="${fs(6)};color:#3D2510;">${S.foodDone.length} / ${FOODS.length}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">NPC 만남</div><div style="${fs(6)};color:#3D2510;">${metNpc} / ${S.npcs.filter(n=>!n.locked).length}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">업적 달성</div><div style="${fs(6)};color:#3D2510;">${S.achievements.length} / ${ACHIEVEMENTS.length}</div></div>
    <div class="stat-row"><div style="${fs(6)};color:#8B6340;">부스터 사용</div><div style="${fs(6)};color:#3D2510;">${S.boostCount||0}회</div></div>
    ${S.visited.length>0?`<div style="margin-top:7px;">
      <div style="${fs(6)};color:#8B6340;margin-bottom:4px;">방문 도시:</div>
      <div style="display:flex;flex-wrap:wrap;gap:3px;">
        ${S.visited.map(c=>`<span style="background:#E8D0A0;border:1px solid #8B6340;border-radius:3px;padding:2px 5px;${fs(5)};color:#3D2510;">${c}</span>`).join('')}
      </div>
    </div>`:''}
  </div>`;
}
// 업적 탭 — 그룹별 정렬
function renderAch(){
  const done=S.achievements.length;
  const groups=[...new Set(ACHIEVEMENTS.map(a=>a.grp))];
  let html=`<div class="px-panel" style="margin-bottom:5px;font-size:calc(9px * var(--u));color:#8B6340;">달성: ${done}/${ACHIEVEMENTS.length}</div>`;
  groups.forEach(grp=>{
    html+=`<div style="font-size:calc(9px * var(--u));color:#8B6340;margin:8px 6px 4px;padding-bottom:3px;border-bottom:2px solid #D4B483;">${grp}</div>`;
    ACHIEVEMENTS.filter(a=>a.grp===grp).forEach(ach=>{
      const isDone=S.achievements.includes(ach.id);
      const rw=Object.entries(ach.rw).map(([k,v2])=>{if(k==='money')return'₩'+v2.toLocaleString();if(k==='xp')return'XP+'+v2;if(k==='sp')return'SP+'+v2;if(k==='jc')return'🧃+'+v2;return k+':'+v2;}).join(', ');
      html+=`<div class="ach-item ${isDone?'ach-done':''}">
        <div style="font-size:calc(9px * var(--u));flex-shrink:0;">${ach.emoji}</div>
        <div><div style="font-size:calc(9px * var(--u));color:${isDone?'#1B5E20':'#3D2510'};">${ach.name}${isDone?' ✓':''}</div>
        <div style="font-size:calc(9px * var(--u));color:#8B6340;margin-top:2px;">${ach.desc}</div>
        <div style="font-size:calc(9px * var(--u));color:${isDone?'#4CAF50':'#8B6340'};margin-top:1px;">보상: ${rw}</div></div>
      </div>`;
    });
  });
  document.getElementById('ach-panel').innerHTML=html;
}

function buyAp(){
  if(S.ap>=99){addLog('bad','🍎 사과 보유 한도 초과! (최대 99개)');return;}
  if(S.money<3000){addLog('bad','돈 부족!');return;}
  S.money-=3000;S.ap++;addLog('good','🍎 사과 +1');renderItems();update();
}
// #1·#8: 사과박스 — 크로스바이크(v9) 보유 시 메인 사과 버튼이 이걸로 전환됨(대량 구매).
function ownsVeh(id){ return (S.vehs||[]).some(v=>v.id===id && v.owned); }
function buyAppleBox(){
  const N=20, price=45000;                 // 20개 ₩45,000 (개당 2,250 · 단품 대비 25%↓)
  const room=99-(S.ap||0);
  if(room<=0){ addLog('bad','🍎 사과 보유 한도! (최대 99개)'); return; }
  const add=Math.min(N, room);
  const cost=Math.round(price/N*add);      // 한도 근처면 들어가는 만큼만 비례 결제
  if(S.money<cost){ addLog('bad','돈 부족! (₩'+cost.toLocaleString()+' 필요)'); return; }
  S.money-=cost; S.ap+=add;
  addLog('good','📦 사과박스! 🍎 +'+add+' (₩'+cost.toLocaleString()+')');
  playSfx('apple');
  update(); if(curTab==='item') renderItems();
}
// 메인 사과 버튼: v9 이후엔 사과박스 구매, 그 전엔 사과 먹기
function appleBtnAction(){ if(ownsVeh('v9')) buyAppleBox(); else useApple(); }
function buyJc(){
  if(S.jc>=99){addLog('bad','🧃 사과즙 보유 한도 초과! (최대 99개)');return;}
  if(S.money<8000){addLog('bad','돈 부족!');return;}
  S.money-=8000;S.jc++;addLog('good','🧃 사과즙 +1');renderItems();update();
}
function upgStat(k){
  if(S.sp<=0)return;
  S.sp--;
  if(k==='mhp'){
    // 1번 fix: SP 투자분을 별도 변수로 추적 (탈것 변경/헬멧 장착에서 보존)
    S.mhpSpBonus = (S.mhpSpBonus || 0) + 10;
    S.mhp += 10;
    S.hp = Math.min(S.hp + 10, S.mhp);
    addLog('good','최대체력 +10 → '+S.mhp);
  }else if(k==='end'){
    S.end++;
    addLog('good','지구력 +1 → '+S.end+' (다음 부스터 +0.5초)');
  }else{
    S[k]++;
  }
  renderStat();update();
}

function update(){
  const v=cv2();
  document.getElementById('veh-lbl').textContent=v.n;document.getElementById('loc-lbl').textContent=S.city+(S.dest?'→'+S.dest:'');
  document.getElementById('lv').textContent=S.lv;document.getElementById('mon').textContent=Math.round(S.money).toLocaleString();
  document.getElementById('apN').textContent=S.ap;document.getElementById('jcN').textContent=S.jc;
  // #8: 크로스바이크(v9) 보유 후 메인 사과 버튼을 사과박스 구매로 전환
  const _apBtn=document.getElementById('apple-btn');
  if(_apBtn){ const _box=ownsVeh('v9'); const _html=_box?'📦<br>사과박스':'🍎<br>사과'; if(_apBtn.innerHTML!==_html)_apBtn.innerHTML=_html; }
  document.getElementById('hp-v').textContent=Math.round(S.hp)+'/'+S.mhp;document.getElementById('hp-b').style.width=Math.round(S.hp/S.mhp*100)+'%';
  document.getElementById('xp-v').textContent=Math.round(S.xp)+'/'+S.xpMax;document.getElementById('xp-b').style.width=Math.round(S.xp/S.xpMax*100)+'%';
  document.getElementById('dop-v').textContent=S.dopT>0?S.dopT+'s':'OFF';document.getElementById('dop-b').style.width=Math.round(S.dopT/40*100)+'%';
  if(S.dest){const pct=Math.min(100,Math.round(S.sgKm/S.sgTot*100));document.getElementById('seg-lbl').textContent=S.city+'→'+S.dest;document.getElementById('seg-info').textContent=Math.round(S.sgKm)+'/'+S.sgTot+'km · '+v.sp+'km/h';document.getElementById('seg-pct').textContent=pct+'%';document.getElementById('seg-b').style.width=pct+'%';}
  else if(S.city==='달'){const pct=Math.min(100,Math.round((S.moonKm||0)/200*100));document.getElementById('seg-lbl').textContent='🌕 달 라이딩 (귀환까지)';document.getElementById('seg-info').textContent=Math.round(S.moonKm||0)+'/200km · 우주 컨셉 이벤트';document.getElementById('seg-pct').textContent=pct+'%';document.getElementById('seg-b').style.width=pct+'%';}
  else{document.getElementById('seg-lbl').textContent='목적지 없음';document.getElementById('seg-info').textContent='충동적으로 어딜 갈까...';document.getElementById('seg-pct').textContent='';document.getElementById('seg-b').style.width='0%';}
  // 2번: 누적 거리
  const tk=document.getElementById('total-km');
  if(tk) tk.textContent = Math.round(S.totKm).toLocaleString() + ' km';
  const w = getWeather(); const td = getTimeOfDay();
  const wi = document.getElementById('weather-info');
  const ti = document.getElementById('time-info');
  if(wi) wi.textContent = w.emoji + ' ' + w.name + (w.mod.speedMult ? ` (속도×${w.mod.speedMult.toFixed(2)})` : '');
  if(ti) ti.textContent = td.emoji + ' ' + td.name;
  // 사운드 버튼 텍스트
  const sndBtn = document.getElementById('sound-btn');
  if(sndBtn) sndBtn.innerHTML = soundEnabled ? '🔊 음향' : '🔇 음향';
  // #2 자동 사과 버튼 상태
  const aaBtn = document.getElementById('autoapple-btn');
  if(aaBtn){
    aaBtn.innerHTML = S.autoApple ? '🍎 자동 ON' : '🍎 자동 OFF';
    aaBtn.classList.toggle('px-btn-green', !!S.autoApple);
    aaBtn.classList.toggle('px-btn-gray', !S.autoApple);
  }
  // 3번: 탈출 주사위 버튼 (함정 도시 + 50km 누적 시)
  const trapBtn = document.getElementById('trapDiceBtn');
  if(trapBtn){
    if(S.trapZone){
      trapBtn.style.display = 'block';
      const need = escapeNeed(S.trapZone.tries);
      const ch = S.trapZone.diceCharges||0;
      trapBtn.innerHTML = ch>0
        ? '🎲 탈출 주사위 x'+ch+' ('+need+'↑면 탈출!)'
        : '⏳ 다음 주사위 기회 준비 중...';
    } else {
      trapBtn.style.display = 'none';
    }
  }
  // 4번: 탭 빨간점 (신규 해금 알림)
  refreshTabBadges();
  if(curTab==='item')renderItems();if(curTab==='veh')renderVehs();if(curTab==='npc')renderNpcs();if(curTab==='stat')renderStat();if(curTab==='ach')renderAch();
}

// ── 4번: 탭 빨간점 (신규 해금 표시) ─────────────────────
// S.seenTabs[tab] = 해당 탭에서 마지막으로 확인한 갯수/상태
function refreshTabBadges(){
  if(!S.seenTabs) S.seenTabs = {npc:0, veh:0, ach:0, gear:0};
  const npcMet = S.npcs.filter(n=>n.met&&!n.locked).length;
  const achGot = (S.achievements||[]).length;
  const gearOwn = (S.inventory||[]).length;
  // 3번 fix: 탈것 — 구매 가능(거리+돈 충족, 미보유)한 게 새로 생기면 알림
  // 로켓은 제외(나로호센터 전용), 보유한 건 제외
  let buyable = 0;
  (S.vehs||[]).forEach(sv=>{
    if(sv.owned) return;
    const v = VEHS.find(x=>x.id===sv.id);
    if(!v || v.cat==='rocket') return;
    const distOk = (S.totKm||0) >= (v.km||0);
    const moneyOk = (S.money||0) >= (v.cost||0);
    if(distOk && moneyOk) buyable++;
  });
  // seenVehBuyable: 마지막으로 탈것 탭 본 시점의 구매가능 개수
  const seenBuyable = S.seenVehBuyable || 0;
  setTabBadge('npc',  npcMet > (S.seenTabs.npc||0));
  setTabBadge('veh',  buyable > seenBuyable);   // 새로 살 수 있는 게 생기면 파란점
  setTabBadge('ach',  achGot > (S.seenTabs.ach||0));
  setTabBadge('gear', gearOwn > (S.seenTabs.gear||0));
  setTabBadge('stat', (S.sp||0) > 0);           // #6: 미사용 스탯포인트 있으면 알림(다 쓰면 자동 해제)
}
function setTabBadge(tab, on){
  const btn = document.querySelector(`button[onclick*="ST('${tab}')"]`);
  if(!btn) return;
  let dot = btn.querySelector('.tab-dot');
  if(on){
    if(!dot){
      dot = document.createElement('span');
      dot.className = 'tab-dot';
      dot.style.cssText = 'display:inline-block;width:calc(7px*var(--u));height:calc(7px*var(--u));background:#2196F3;border-radius:50%;margin-left:calc(3px*var(--u));vertical-align:top;box-shadow:0 0 calc(4px*var(--u)) #2196F3;';
      btn.appendChild(dot);
    }
  } else if(dot) dot.remove();
}

