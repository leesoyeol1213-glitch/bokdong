// ═══ render.js — 캔버스·스프라이트·배경·애니메이션(그리기 전부)
// game.js(v9.19, 4758줄)에서 분할. 로드 순서: data → render → logic → boot (index.html)
// 전역 공유(모듈 아님) — 분할 전과 의미 동일.

// ── 캔버스 ─────────────────────────────────────────────
const cv=document.getElementById('cv');
const ctx=cv.getContext('2d');
// 논리 캔버스 크기(모든 그리기 좌표의 기준). 백킹은 이 크기의 SS배로 슈퍼샘플링.
const CV_W=420, CV_H=210;
// 슈퍼샘플링 배율 — 백킹 해상도를 논리 크기의 SS배로 키워 화면 확대 시 글씨 깨짐 방지.
// (스프라이트는 imageSmoothingEnabled=false로 선명 유지, 텍스트는 고해상도로 매끄럽게)
const SS=Math.max(2, Math.min(4, Math.ceil(window.devicePixelRatio||1)+1));
cv.width=Math.round(CV_W*SS); cv.height=Math.round(CV_H*SS);
ctx.imageSmoothingEnabled=false;
function p(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}

const PALETTES={
  mountain:{sky:'#87CEEB',sky2:'#A8E4F0',hor:'#7DB87D',gnd:'#5A8A3C',rd:'#8B7355'},
  coast:   {sky:'#6BB8E8',sky2:'#89CCEE',hor:'#4A9FD4',gnd:'#E8D5A0',rd:'#B0A070'},
  city:    {sky:'#B0C4DE',sky2:'#C4D4E8',hor:'#888888',gnd:'#707070',rd:'#555555'},
  industrial:{sky:'#C0C5C5',sky2:'#D5DADA',hor:'#808080',gnd:'#686868',rd:'#505050'},
  space:   {sky:'#0A0A2E',sky2:'#0D0D3A',hor:'#C8C8C8',gnd:'#B0B0B0',rd:'#888888'},
  snow:    {sky:'#D6E5F2',sky2:'#E8F0F8',hor:'#FFFFFF',gnd:'#F0F4F8',rd:'#9FA8B0'},
};

// ── 씬 ─────────────────────────────────────────────────
function drawScene(){
  // 슈퍼샘플링: 매 프레임 논리좌표(420×) → SS배 백킹으로. 이후 모든 좌표는 논리 픽셀 그대로 사용.
  ctx.setTransform(SS,0,0,SS,0,0);
  ctx.imageSmoothingEnabled=false; // 스프라이트 선명 유지(텍스트는 항상 매끄럽게 렌더)
  // 옵션 B v2: 캔버스 420x236 (16:9)
  ctx.clearRect(0,0,420,236);
  // 텍스트 정렬 상태 초기화 — 이전 프레임/함수의 textAlign·baseline 누수로 대사가 쏠리는 것 방지
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  ctx.save();
  ctx.translate(0, 26);

  const city=CITIES.find(c=>c.n===S.city)||CITIES[0];
  const pal=PALETTES[city.bg]||PALETTES.mountain;
  const asp=animSpeedMult();

  // 배경 키 선택 함수 — 특정 도시 배경 우선, 없으면 범용 배경
  function pickBgKey(){
    // 1순위: 특정 도시 전용 배경
    const specificMap = {
      '서울':'bg_seoul', '충주':'bg_chungju', '제주':'bg_jeju',
      '달':'bg_moon', '신한':'bg_shinhan', '지리산청학동':'bg_cheonghak'
    };
    // trapZone 활성 시 함정 배경
    if(S.trapZone){
      const trapKey = S.trapZone.special==='trap_shinhan' ? 'bg_shinhan' : 'bg_cheonghak';
      if(hasAsset(trapKey)) return trapKey;
    }
    const specific = specificMap[S.city];
    if(specific && hasAsset(specific)) return specific;

    // 2순위: 도시 bg 속성 기반 범용 배경
    const genericMap = {
      'mountain': 'bg_nature',
      'snow':     'bg_nature',
      'coast':    'bg_coast_gen',
      'city':     'bg_city_gen',
      'industrial':'bg_city_gen',
      'space':    'bg_moon',
    };
    const generic = genericMap[city.bg];
    if(generic && hasAsset(generic)) return generic;

    return null;
  }

  const bgKey = pickBgKey();
  const hasCityBg = !!bgKey;

  if(hasCityBg){
    // 배경은 고정 (캐릭터가 화면을 가로질러 달림)
    ctx.drawImage(ASSETS_IMG[bgKey], 0, -26, 420, 236);
  } else {
    // 폴백: 기존 픽셀 그리기
    p(0,-26,420,90+26,pal.sky);p(0,90,420,25,pal.sky2);
    drawClouds(asp);drawBgEl(city.bg,pal,asp);
    p(0,115,420,10,pal.hor);p(0,125,420,85,pal.gnd);p(0,148,420,45,pal.rd);
    p(0,148,420,3,'rgba(180,160,100,.7)');p(0,190,420,3,'rgba(180,160,100,.7)');
  }

  // 도로 점선 — 배경 이미지 있으면 점선도 생략 (배경에 도로 이미 있음)
  if(!hasCityBg){
    const lspd=(S.dopT>0?4:1)*asp;
    const roadOffset = S.riding ? ((Math.floor(-frame*lspd*.5)%36)+36)%36 : 0;
    for(let x=roadOffset;x<420;x+=36){
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(x-36, 167, 18, 4);
    }
  }

  // 4번: 오르막/내리막 지형 오버레이 (배경 위, 캐릭터 아래)
  if(evAnim==='uphill')   drawUphill();
  if(evAnim==='downhill') drawDownhill();

  if(isResting)drawRestScene();
  else         drawBokdong(bikeX,145,asp);

  // 3번: 모든 이벤트 애니메이션
  if(evAnim==='dog')              drawDogAnim();
  else if(evAnim==='youtuber')    drawYoutuberAnim();
  else if(evAnim==='food')        drawFoodAnim();
  else if(evAnim==='flat')        drawFlatAnim();
  else if(evAnim==='rain')        drawRainAnim();
  else if(evAnim==='npc'&&evAnimNpc) drawNpcAnim();
  // 5번: 맛집/NPC 결과 애니
  if(evAnim==='food_ok')          drawFoodOkAnim();
  else if(evAnim==='food_fail')   drawFoodFailAnim();
  else if(evAnim==='npc_reward'&&evAnimNpc) drawNpcRewardAnim();

  // 속도선 — 일반 라이딩만 (부스트 시는 캐릭터 스프라이트가 효과 처리)
  if(S.riding&&!isResting&&S.dopT<=0){
    const lc=Math.min(5,Math.ceil(asp*2));
    const ll=22*Math.min(2,asp);
    ctx.strokeStyle='rgba(255,255,255,.65)';
    ctx.lineWidth=Math.min(3,1+asp*.5);
    for(let i=0;i<lc;i++){const y=132+i*8;ctx.beginPath();ctx.moveTo(bikeX-48,y);ctx.lineTo(bikeX-48-ll,y);ctx.stroke();}
  }
  // 부스터 불꽃 제거 — 캐릭터 PNG에 화염 자세가 이미 있음
  // HUD (배경을 더 진하게 → 밝은 배경에서도 글씨 인식 잘 되게)
  p(4,4,124,18,'rgba(0,0,0,.75)');ctx.fillStyle='#FFD700';ctx.font='bold 10px Galmuri11, monospace';ctx.fillText('📍 '+city.n,8,18);
  if(S.restT>0){p(4,25,150,16,'rgba(0,0,0,.75)');ctx.fillStyle='#FFD700';ctx.font='8px Galmuri11, monospace';ctx.fillText('💤 휴식 '+S.restT+'s',8,37);}
  if(S.dopT>0){p(4,25,162,16,'rgba(200,80,0,.82)');ctx.fillStyle='#FFE082';ctx.font='bold 8px Galmuri11, monospace';ctx.fillText('⚡ BOOST '+S.dopT+'s',8,37);}
  if(boosterBubble>0){drawBoosterBubble(bikeX+10,85);boosterBubble--;}

  // TY 수호천사 (항상 표시)
  drawTY();
  tyTalkTimer--;
  if(tyTalkTimer<=0){tyTalk();tyTalkTimer=1800+Math.floor(Math.random()*2400);}

  // 주사위 애니메이션
  if(diceAnim>0){drawDiceAnim();diceAnim--;}

  // 3번: OX 퀴즈 결과 애니메이션
  if(oxResult){drawOXResult();}

  // 장비 드롭 애니메이션
  drawGearDropAnim();

  // 6번: 천재지변 — 번개/회오리
  drawDisasterEffect();

  // 🚀 로켓 발사 애니메이션
  drawRocketLaunchAnim();

  // 날씨 오버레이
  drawWeatherOverlay();

  // 시간대 색감 오버레이
  drawTimeOverlay();

  ctx.restore();  // 옵션 B translate 복원

  // 이벤트 타이머 감소
  if(evTimer>0){evTimer--;if(evTimer===0){evAnim=null;evAnimNpc=null;}}
  frame++;
}

// 🚀 로켓 발사 애니메이션 (1번)
function drawRocketLaunchAnim(){
  if(!rocketLaunchAnim) return;
  const a = rocketLaunchAnim;
  a.timer++;

  // 어두운 우주 배경 오버레이
  ctx.fillStyle = `rgba(5,5,30,${Math.min(0.9, a.timer/40)})`;
  ctx.fillRect(0, 0, 420, 210);

  // 별
  for(let i=0;i<60;i++){
    const sx=(i*73)%420, sy=(i*47)%210;
    const blink=Math.sin(frame*.1+i)*0.5+0.5;
    ctx.fillStyle=`rgba(255,255,255,${0.4+blink*0.6})`;
    ctx.fillRect(sx, sy, 1, 1);
  }

  if(a.phase === 'countdown'){
    // 카운트다운: 5 → 4 → 3 → 2 → 1 → 발사!
    // 60프레임마다 카운트 감소 (1초)
    const elapsed = a.timer;
    const newCount = Math.max(0, 5 - Math.floor(elapsed / 60));
    if(newCount !== a.countdownLeft){
      a.countdownLeft = newCount;
      if(newCount > 0){ addLog('neutral', '🚀 ' + newCount + '...'); playSfx('click'); }
      else { addLog('good', '🚀 발사!'); playSfx('rocket'); }
    }
    // 로켓 그리기 (지상)
    drawRocketSprite(210, 145, 0);
    // 카운트다운 숫자
    if(a.countdownLeft > 0){
      ctx.fillStyle = '#FFEB3B';
      ctx.font = 'bold 60px Galmuri11, monospace';
      ctx.textAlign = 'center';
      const scale = 1.0 + Math.sin(elapsed * 0.2) * 0.1;
      ctx.save();
      ctx.translate(210, 80);
      ctx.scale(scale, scale);
      ctx.fillText(a.countdownLeft + '', 0, 0);
      ctx.restore();
      ctx.textAlign = 'left';
    } else {
      // T-0: liftoff 단계로 전환
      a.phase = 'liftoff';
      a.timer = 0;
    }
  } else if(a.phase === 'liftoff'){
    // 발사 → 6초 동안 위로 상승, 점점 작아지면서 사라짐
    const t = a.timer;
    const liftDur = 240; // 4초
    const rocketY = 145 - (t / liftDur) * 200;
    const scale = Math.max(0.3, 1.0 - (t / liftDur) * 0.7);

    // 화염 (로켓 아래)
    ctx.save();
    ctx.translate(210, rocketY + 20*scale);
    ctx.scale(scale, scale);
    for(let i=0;i<10;i++){
      const fy = i * 4 + Math.random()*3;
      const fw = 14 - i*1.2;
      ctx.fillStyle = i<3 ? '#FFEB3B' : i<6 ? '#FF9800' : '#F44336';
      ctx.fillRect(-fw/2, fy, fw, 5);
    }
    ctx.restore();

    // 로켓
    drawRocketSprite(210, rocketY, 0, scale);

    // 연기/구름
    for(let i=0;i<8;i++){
      const px = 210 + (Math.sin(t*.15+i)*30) - (i*3);
      const py = 165 + Math.sin(t*.1+i*0.7)*5;
      const alpha = Math.max(0, 1 - t/liftDur);
      ctx.fillStyle = `rgba(220,220,220,${alpha*0.7})`;
      ctx.beginPath();
      ctx.arc(px + (i%2===0?-15:15), py, 8+i*2, 0, Math.PI*2);
      ctx.fill();
    }

    if(t >= liftDur){
      // 결과 결정 (95% 성공)
      const success = Math.random() >= 0.05;
      a.result = success ? 'success' : 'fail';
      a.phase = 'result';
      a.timer = 0;
      // 결과 처리
      if(success){
        // 달 도착 처리
        setVehOwned('rocket', false);
        const pv = VEHS.find(v=>v.id===a.prevVehId) || VEHS[0];
        S.vId = a.prevVehId; S.speed = pv.sp;
        S.city = '달'; S.dest = null; S.sgKm = 0;
        S.moonKm = 0;  // 달 라이딩 카운터 리셋
        if(!S.visited.includes('달')) S.visited.push('달');
        S.money += 500000;
        addLog('good','🌕 달 도착!! ₩500,000 보상! 200km 달 라이딩 시작!');
        if(typeof trackMission==='function') trackMission('moon');
        // 자동으로 라이딩 시작
        S.riding = true;
        document.getElementById('ride-btn').textContent = '■ 정지';
        if(!tickIv){tickIv=setInterval(tick,1000);startNpcTimer();}
      } else {
        // 폭발
        setVehOwned('rocket', false);
        addLog('bad','💥 임복동1호 폭발! (5% 확률...) 다음엔 성공할 거야!');
        playSfx('explosion');
      }
    }
  } else if(a.phase === 'result'){
    // 결과 화면 (3초)
    const t = a.timer;
    if(a.result === 'success'){
      // 달 표면 + 환영 메시지
      ctx.fillStyle = '#1A1A3A';
      ctx.fillRect(0, 0, 420, 210);
      // 큰 달
      ctx.fillStyle = '#FFFDE7';
      ctx.beginPath(); ctx.arc(210, 110, 70, 0, Math.PI*2); ctx.fill();
      // 크레이터
      ctx.fillStyle = '#E0E0E0';
      [[190,90,8],[230,100,6],[200,130,10],[235,125,5],[180,115,7]].forEach(([x,y,r])=>{
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      // 메시지
      ctx.fillStyle = '#FFEB3B';
      ctx.font = 'bold 14px Galmuri11, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🌕 달 도착! 🌕', 210, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Galmuri11, monospace';
      ctx.fillText('₩500,000 보상', 210, 195);
    } else {
      // 폭발 화면
      ctx.fillStyle = `rgba(${100+Math.random()*100},${50+Math.random()*30},0,0.8)`;
      ctx.fillRect(0, 0, 420, 210);
      // 폭발 파편
      for(let i=0;i<30;i++){
        const a2 = (i/30)*Math.PI*2;
        const d = t * 3 + i*5;
        ctx.fillStyle = ['#FFEB3B','#FF9800','#F44336','#FFFFFF'][i%4];
        ctx.fillRect(210 + Math.cos(a2)*d, 105 + Math.sin(a2)*d, 4, 4);
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Galmuri11, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('💥 폭발!', 210, 110);
    }
    if(t >= 180){  // 3초 후 종료
      rocketLaunchAnim = null;
      update();
    }
  }
  ctx.textAlign = 'left';
}
// 작은 로켓 스프라이트
function drawRocketSprite(cx, cy, rot, scale){
  scale = scale || 1;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  // 본체
  ctx.fillStyle = '#ECEFF1';
  ctx.fillRect(-6, -25, 12, 35);
  // 머리(원뿔)
  ctx.fillStyle = '#F44336';
  ctx.beginPath();
  ctx.moveTo(-6, -25); ctx.lineTo(0, -38); ctx.lineTo(6, -25);
  ctx.closePath();
  ctx.fill();
  // 창
  ctx.fillStyle = '#42A5F5';
  ctx.beginPath();
  ctx.arc(0, -15, 3, 0, Math.PI*2);
  ctx.fill();
  // 핀 (지느러미)
  ctx.fillStyle = '#1976D2';
  ctx.beginPath();
  ctx.moveTo(-6, 5); ctx.lineTo(-12, 12); ctx.lineTo(-6, 12);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, 5); ctx.lineTo(12, 12); ctx.lineTo(6, 12);
  ctx.closePath(); ctx.fill();
  // KRSL (한국)
  ctx.fillStyle = '#3D2510';
  ctx.font = 'bold 4px Galmuri11, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KOR', 0, -2);
  ctx.restore();
}

// 6번: 번개 / 회오리 캔버스 효과
function drawDisasterEffect(){
  // 번개 (정지 + 감전 이펙트)
  if(S.disasterUntil && Date.now() < S.disasterUntil){
    const remaining = Math.ceil((S.disasterUntil-Date.now())/1000);
    // 번개 플래시 (30프레임마다)
    if(frame%24 < 6){
      ctx.fillStyle='rgba(255,255,150,0.55)';
      ctx.fillRect(0,0,420,210);
      // 번개 줄기
      ctx.strokeStyle='#FFEB3B';
      ctx.lineWidth=3;
      ctx.beginPath();
      ctx.moveTo(180+Math.random()*60, 0);
      let x=200+Math.random()*40, y=0;
      while(y<150){
        const nx = x + (Math.random()-0.5)*30;
        const ny = y + 15+Math.random()*20;
        ctx.lineTo(nx, ny);
        x=nx; y=ny;
      }
      ctx.stroke();
    }
    // 감전 효과 (복동 주변 스파크)
    for(let i=0;i<5;i++){
      const sx = bikeX + (Math.random()-0.5)*40;
      const sy = 145 + (Math.random()-0.5)*40;
      ctx.fillStyle = ['#FFEB3B','#FFFFFF','#03A9F4'][i%3];
      ctx.fillRect(sx, sy, 2, 2);
    }
    // 카운트다운
    ctx.fillStyle='rgba(0,0,0,0.7)';
    ctx.fillRect(160, 10, 100, 22);
    ctx.fillStyle='#FFEB3B';
    ctx.font='bold 12px Galmuri11, monospace';
    ctx.textAlign='center';
    ctx.fillText('⚡ '+remaining+'초', 210, 26);
    ctx.textAlign='left';
  }
  // 회오리바람 (펫·천사 효과 상실)
  if(S.tornadoUntil && Date.now() < S.tornadoUntil){
    const remaining = Math.ceil((S.tornadoUntil-Date.now())/1000);
    // 회오리 그리기 (복동 위에 회전)
    ctx.save();
    ctx.translate(bikeX, 110);
    for(let i=0;i<3;i++){
      const r = 30 - i*8;
      const w = 60 - i*15;
      ctx.strokeStyle = `rgba(180,180,200,${0.6-i*0.15})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(Math.sin(frame*.2+i)*5, i*20, w/2, r/2, 0, 0, Math.PI*2);
      ctx.stroke();
    }
    // 흩날리는 잎/먼지
    for(let i=0;i<8;i++){
      const a = (i/8)*Math.PI*2 + frame*.15;
      const dist = 25+Math.sin(frame*.1+i)*10;
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(Math.cos(a)*dist, Math.sin(a)*dist, 2, 2);
    }
    ctx.restore();
    ctx.fillStyle='rgba(0,0,0,0.7)';
    ctx.fillRect(160, 10, 100, 22);
    ctx.fillStyle='#B0BEC5';
    ctx.font='bold 12px Galmuri11, monospace';
    ctx.textAlign='center';
    ctx.fillText('🌪️ '+remaining+'초', 210, 26);
    ctx.textAlign='left';
  } else if(S.tornadoUntil && Date.now() >= S.tornadoUntil){
    S.tornadoUntil = 0;
    addLog('good','🌪️ 회오리 종료. 펫·수호천사 복귀!');
  }
}

// 시간대 색감 (노을/밤) — 하늘 영역에만 살짝, 그라데이션
function drawTimeOverlay(){
  const td = getTimeOfDay();
  if(!td.skyTint) return;
  if(td.topOnly){
    // 하늘 영역(상단 100px)에 위→아래 그라데이션 (위가 진하고 아래로 갈수록 옅어짐)
    const grad = ctx.createLinearGradient(0, 0, 0, 100);
    grad.addColorStop(0, td.skyTint);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 420, 100);
  } else {
    ctx.fillStyle = td.skyTint;
    ctx.fillRect(0, 0, 420, 210);
  }
}

// 날씨 오버레이 (비/눈/안개)
function drawWeatherOverlay(){
  const w = getWeather();
  if(w.key==='clear' || w.key==='cloud') return;
  if(w.key==='rain'){
    ctx.strokeStyle='rgba(120,180,255,0.55)';
    ctx.lineWidth=1;
    for(let i=0;i<35;i++){
      const x=(i*23 + frame*7)%440 - 10;
      const y=(i*13 + frame*15)%220;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y+9);ctx.stroke();
    }
  } else if(w.key==='snow'){
    ctx.fillStyle='rgba(255,255,255,0.85)';
    for(let i=0;i<40;i++){
      const x=(i*19 + Math.sin(frame*.04+i)*8) % 440 - 10;
      const y=(i*11 + frame*1.5)%220;
      ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill();
    }
  } else if(w.key==='fog'){
    // 안개 — 농도 절반으로 낮춤 (뿌염 방지)
    ctx.fillStyle='rgba(220,220,225,0.18)';
    ctx.fillRect(0, 70, 420, 130);
    // 흐릿한 띠 (살짝)
    for(let i=0;i<3;i++){
      const y=80+i*30+Math.sin(frame*.02+i)*4;
      ctx.fillStyle=`rgba(255,255,255,${0.10-i*0.025})`;
      ctx.fillRect(0,y,420,20);
    }
  }
}

// ── 3번: OX 퀴즈 결과 애니메이션 ─────────────────────
// oxResult = {type:'correct'|'wrong', timer:90, msg:''}
function drawOXResult(){
  if(!oxResult||oxResult.timer<=0){oxResult=null;return;}
  const t=oxResult.timer;
  const alpha=Math.min(1, t<20 ? t/20 : 1); // 마지막 20프레임 페이드아웃
  const scale=t>70 ? 1+(90-t)*0.03 : 1;     // 처음 튀어오르는 느낌
  const cx=210, cy=105;
  const isOk=oxResult.type==='correct';

  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // 배경 원
  ctx.fillStyle=isOk?'rgba(76,175,80,0.92)':'rgba(229,57,53,0.92)';
  ctx.beginPath();ctx.arc(0,0,52,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#FFF';ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(0,0,52,0,Math.PI*2);ctx.stroke();

  // O 또는 X
  ctx.fillStyle='#FFF';
  ctx.font='bold 52px Galmuri11, monospace';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(isOk?'O':'X', 0, 2);

  // 결과 텍스트
  ctx.font='bold 10px Galmuri11, monospace';
  ctx.textBaseline='alphabetic';
  ctx.fillText(oxResult.msg, 0, 72);

  // 파티클 (정답일 때 별 터짐)
  if(isOk){
    const pts=5;
    for(let i=0;i<pts;i++){
      const angle=(i/pts)*Math.PI*2 - Math.PI/2;
      const dist=65+Math.sin(frame*.2+i)*5;
      const px2=Math.cos(angle)*dist;
      const py2=Math.sin(angle)*dist;
      ctx.fillStyle=['#FFD700','#FFF176','#FFEE58'][i%3];
      ctx.beginPath();ctx.arc(px2,py2,5,0,Math.PI*2);ctx.fill();
    }
  }

  ctx.restore();
  oxResult.timer--;
}

// ── 5번: 맛집 성공 애니메이션 ─────────────────────────
function drawFoodOkAnim(){
  if(!evTimer){evAnim=null;return;}
  const t=evTimer;
  const alpha=Math.min(1, t<20?t/20:1);
  const scale=t>80?1+(100-t)*0.02:1;
  const cx=210,cy=105;
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(cx,cy);ctx.scale(scale,scale);
  // 배경 원
  ctx.fillStyle='rgba(76,175,80,.9)';
  ctx.beginPath();ctx.arc(0,0,56,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#FFF';ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(0,0,56,0,Math.PI*2);ctx.stroke();
  // 음식 이모지
  const food=FOODS.find(f=>f.c===S.city);
  ctx.font='28px Galmuri11, monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(food?food.e:'🍴',0,-8);
  // 텍스트
  ctx.font='bold 8px Galmuri11, monospace';ctx.fillStyle='#FFF';
  ctx.fillText('맛있다! 성공~',0,22);
  // 별 파티클
  for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2;const d=62+Math.sin(frame*.15+i)*4;
    ctx.fillStyle=['#FFD700','#FFF176','#FF8A65'][i%3];
    ctx.beginPath();ctx.arc(Math.cos(a)*d,Math.sin(a)*d,5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

// ── 5번: 맛집 실패 애니메이션 ─────────────────────────
function drawFoodFailAnim(){
  if(!evTimer){evAnim=null;return;}
  const t=evTimer;
  const alpha=Math.min(1,t<20?t/20:1);
  const shake=t>60?Math.sin(frame*.8)*6:0;
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(210+shake,105);
  ctx.fillStyle='rgba(229,57,53,.88)';
  ctx.beginPath();ctx.arc(0,0,52,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#FFF';ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(0,0,52,0,Math.PI*2);ctx.stroke();
  ctx.font='26px Galmuri11, monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('😅',0,-8);
  ctx.font='bold 7px Galmuri11, monospace';ctx.fillStyle='#FFF';
  ctx.fillText('아쉽다... ₩2,000',0,22);
  ctx.restore();
}

// ── 5번: NPC 보상 수령 애니메이션 ─────────────────────
function drawNpcRewardAnim(){
  const npc=evAnimNpc;
  if(!npc||!evTimer){evAnim=null;evAnimNpc=null;return;}
  const t=evTimer;
  const alpha=Math.min(1,t<20?t/20:1);
  const scale=t>80?1+(100-t)*0.02:1;
  const em=NPC_EMOJI[npc.id]||'👤';
  const gc=GRADE_COLOR[npc.grade]||'#5C3D1E';
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(210,90);ctx.scale(scale,scale);
  // 배경
  ctx.fillStyle=GRADE_BG[npc.grade]||'#FFF9C4';
  ctx.strokeStyle=gc;ctx.lineWidth=4;
  ctx.beginPath();ctx.roundRect(-90,-40,180,80,16);ctx.fill();ctx.stroke();
  // 이모지 + 이름
  ctx.font='22px Galmuri11, monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(em,-52,0);
  // 이름·보상은 왼쪽 정렬(이모지에 쓴 center가 남아 왼쪽으로 쏠리던 버그 수정)
  ctx.font='bold 8px Galmuri11, monospace';ctx.fillStyle=gc;ctx.textBaseline='alphabetic';ctx.textAlign='left';
  ctx.fillText(npc.n,-24,-8);
  ctx.font='bold 6px Galmuri11, monospace';ctx.fillStyle='#5C3D1E';
  ctx.fillText(npc.reward,-24,12);
  // 등급 배지
  ctx.fillStyle=gc;ctx.beginPath();ctx.roundRect(-90,30,80,18,6);ctx.fill();
  ctx.fillStyle='#FFF';ctx.font='bold 6px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('['+GRADE_LABEL[npc.grade]+'] GET!',  -50,42);
  // 파티클 (등급별 색)
  for(let i=0;i<5;i++){
    const a=(i/5)*Math.PI*2+frame*.04;
    ctx.fillStyle=gc;ctx.globalAlpha=alpha*.7;
    ctx.beginPath();ctx.arc(Math.cos(a)*70,Math.sin(a)*52,4,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();ctx.globalAlpha=1;
}
function drawBoosterBubble(x,y){
  const alpha=Math.min(1,boosterBubble/25);
  ctx.globalAlpha=alpha;
  ctx.fillStyle='#FFF9C4';ctx.strokeStyle='#E65100';ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(x-52,y-30,104,34,8);ctx.fill();ctx.stroke();
  ctx.fillStyle='#FFF9C4';
  ctx.beginPath();ctx.moveTo(x-8,y+4);ctx.lineTo(x,y+18);ctx.lineTo(x+8,y+4);ctx.fill();
  ctx.strokeStyle='#E65100';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(x-8,y+5);ctx.lineTo(x,y+19);ctx.lineTo(x+8,y+5);ctx.stroke();
  ctx.fillStyle='#FFF9C4';ctx.fillRect(x-7,y+1,14,6);
  ctx.fillStyle='#E65100';ctx.font='bold 9px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('부스터 ON!',x,y-8);ctx.textAlign='left';
  ['★','✦','✦'].forEach((s,i)=>{ctx.fillStyle='#FFB300';ctx.font='bold 10px Galmuri11, monospace';ctx.fillText(s,x+(i===0?-64:i===1?54:50),y+(i===0?-10:i===1?-22:2));});
  ctx.globalAlpha=1;
}

// ── TY 수호천사 (v4.4 그록 추가) ─────────────────────
const TY_TALKS=[
  '임복동! 오늘도 멋지게 달리고 있네~',
  '천천히 가도 괜찮아. 네 속도가 제일 예뻐',
  '조금만 더 가면 좋은 일이 기다리고 있을 거야',
  '나는 항상 네 뒤에서 응원하고 있어',
  '세상은 넓고, 너는 충분히 잘하고 있어',
  '힘들 때 나를 떠올려. 내가 여기 있으니까',
  '오늘 날씨 좋다. 잘 달리고 있어!',
  '사과 챙겼지? 체력 관리도 중요해!',
];
let tyBubbleText='';
let tyBubbleTimer=0;

function drawTY(){
  if(S.tornadoUntil && Date.now() < S.tornadoUntil) return;
  const pet = getPetStage();
  // TY는 복동이 뒤(왼쪽 위)를 둥실둥실 따라옴. 라이딩 중엔 살짝 더 뒤로 처짐
  const followBack = S.riding ? 62 : 52;   // 캐릭터 뒤로 떨어진 거리
  const tx = bikeX - followBack + Math.sin(frame*.06)*6;
  const ty = 70 + Math.cos(frame*.10)*6;
  const clampedTx = Math.max(20, Math.min(400, tx));

  // 5번: 펫 단계별 후광 색
  if(pet.stage>=2){
    // 외부 큰 후광
    ctx.fillStyle = pet.auraTint || 'rgba(255,235,59,.22)';
    ctx.beginPath();ctx.arc(clampedTx,ty-18,28+Math.sin(frame*.07)*4,0,Math.PI*2);ctx.fill();
  }
  // 후광 (황금빛 glow)
  ctx.fillStyle = pet.stage>=2 ? 'rgba(255,235,59,.4)' : 'rgba(255,235,59,.22)';
  ctx.beginPath();ctx.arc(clampedTx,ty-18,18+Math.sin(frame*.07)*2,0,Math.PI*2);ctx.fill();

  // 5번: 별 TY 이상 — 주변에 작은 별 파티클
  if(pet.stage>=3){
    for(let i=0;i<5;i++){
      const a = (i/5)*Math.PI*2 + frame*.04;
      const dist = 22 + Math.sin(frame*.08+i)*3;
      const px = clampedTx + Math.cos(a)*dist;
      const py = ty - 18 + Math.sin(a)*dist*0.6;
      ctx.fillStyle = pet.glow;
      ctx.fillRect(px-1, py-1, 2, 2);
    }
  }
  // 5번: 우주 TY — 무지개 오로라
  if(pet.stage>=4){
    const auraColors = ['#E040FB','#7C4DFF','#448AFF','#00BCD4','#00E676','#FFEB3B','#FF9100'];
    auraColors.forEach((col,i)=>{
      const a = (i/auraColors.length)*Math.PI*2 + frame*.03;
      const dist = 16 + Math.sin(frame*.06+i)*2;
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(clampedTx + Math.cos(a)*dist, ty - 18 + Math.sin(a)*dist*0.6, 1.5, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // TY 천사 본체 — 픽셀 이미지 10프레임 애니메이션 (제자리 비행)
  const tyFrame = (Math.floor(frame / 6) % 10) + 1;
  let tyImg = BOKDONG_IMG['ty_' + tyFrame];
  if(!tyImg || !tyImg.complete || tyImg.naturalWidth === 0){
    tyImg = BOKDONG_IMG['ty_1'];
  }
  if(tyImg && tyImg.complete && tyImg.naturalWidth > 0){
    const tsz = 52;  // TY 크기 (복동이보다 작게)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tyImg, Math.round(clampedTx - tsz/2), Math.round(ty - tsz/2 - 6), tsz, tsz);
  } else {
    // 폴백: 이미지 로드 전엔 간단한 점
    ctx.fillStyle = '#FFECB3';
    ctx.beginPath();ctx.arc(clampedTx, ty-10, 8, 0, Math.PI*2);ctx.fill();
  }

  // TY 말풍선 — TY 바로 옆에 (오른쪽 우선, 화면 끝이면 왼쪽)
  if(tyBubbleTimer>0){
    const alpha=Math.min(1,tyBubbleTimer/20);
    ctx.globalAlpha=alpha;
    const bw=Math.min(160,tyBubbleText.length*5+20);
    // 말풍선 방향: 오른쪽 공간이 충분하면 오른쪽, 아니면 왼쪽
    const goRight = clampedTx + bw + 26 < 420;
    const bx = goRight ? clampedTx+18 : clampedTx-bw-18;
    const by = ty-40;
    // 풍선 본체 (배경 아트가 비치도록 반투명, 글자는 아래에서 불투명하게)
    ctx.fillStyle='rgba(255,249,196,0.72)';ctx.strokeStyle='#F48FB1';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(bx,by,bw,22,6);ctx.fill();ctx.stroke();
    // 꼬리 (TY 쪽을 향해)
    ctx.fillStyle='rgba(255,249,196,0.72)';
    if(goRight){
      ctx.beginPath();ctx.moveTo(bx,by+12);ctx.lineTo(bx-8,by+18);ctx.lineTo(bx,by+18);ctx.fill();
      ctx.strokeStyle='#F48FB1';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(bx-1,by+12);ctx.lineTo(bx-8,by+18);ctx.stroke();
    }else{
      ctx.beginPath();ctx.moveTo(bx+bw,by+12);ctx.lineTo(bx+bw+8,by+18);ctx.lineTo(bx+bw,by+18);ctx.fill();
      ctx.strokeStyle='#F48FB1';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(bx+bw+1,by+12);ctx.lineTo(bx+bw+8,by+18);ctx.stroke();
    }
    // 텍스트
    ctx.fillStyle='#5C3D1E';ctx.font='bold 5px Galmuri11, monospace';ctx.textAlign='left';
    const lineLen=22;
    const lines=[tyBubbleText.slice(0,lineLen),tyBubbleText.slice(lineLen,lineLen*2)].filter(Boolean);
    lines.forEach((ln,i)=>ctx.fillText(ln,bx+4,by+9+i*9));
    ctx.textAlign='left';
    ctx.globalAlpha=1;
    tyBubbleTimer--;
  }
}

function tyTalk(){
  tyBubbleText=TY_TALKS[Math.floor(Math.random()*TY_TALKS.length)];
  tyBubbleTimer=180;
  addLog('neutral','👼 TY: '+tyBubbleText);
}

// 5번: 펫(TY) 진화 시스템 — 누적 km 기준
// 0: 일반(흰), 10000: 황금(체력회복+1/시간당), 50000: 별(XP +20%), 100000: 우주(통합)
function getPetStage(){
  const km = S.totKm || 0;
  // 1번 fix: 진화 조건 완화 (10K/50K/100K → 2K/10K/30K)
  if(km >=  30000) return {stage:4, name:'🌌 우주 TY',  color:'#7B1FA2', textColor:'#7B1FA2', glow:'#E040FB', auraTint:'rgba(186,104,200,0.4)'};
  if(km >=  10000) return {stage:3, name:'⭐ 별 TY',     color:'#FBC02D', textColor:'#F57F17', glow:'#FFD740', auraTint:'rgba(255,215,64,0.45)'};
  if(km >=   2000) return {stage:2, name:'🥇 황금 TY',  color:'#FFA000', textColor:'#E65100', glow:'#FFC107', auraTint:'rgba(255,193,7,0.4)'};
  return {stage:1, name:'👼 일반 TY', color:'#FFFFFF', textColor:'#1976D2', glow:'#E1F5FE', auraTint:null};
}
function tyBuff(){
  if(Math.random()>1/3600)return;
  S.hp=S.mhp;S.dopT=60;S.money+=30000;boosterBubble=130;
  tyBubbleText='✨ 특별 버프야! 힘내!';tyBubbleTimer=200;
  // 5번: 펫 단계별 추가 보상
  const pet = getPetStage();
  let extra = '';
  if(pet.stage>=2){ S.hp = S.mhp; }
  if(pet.stage>=3){ S.xp += 100; extra += ' XP+100'; }
  if(pet.stage>=4){ S.money += 50000; extra += ' ₩+50K'; }
  addLog('good','👼 TY 특별 버프! 체력 풀 + 부스터 60초 + ₩30,000'+(extra?' [펫'+pet.stage+'단계]'+extra:''));
}
const DICE_DOTS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
function drawDiceAnim(){
  const pr=diceAnim/60;
  const cx=210,cy=105,sz=38;
  const shake=pr>0.3?Math.sin(frame*1.2)*9*pr:Math.sin(frame*.3)*2;
  const rot=pr>0.3?frame*.18:0;
  ctx.save();ctx.translate(cx+shake,cy);ctx.rotate(rot);
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.roundRect(-sz+5,-sz+5,sz*2,sz*2,10);ctx.fill();
  ctx.fillStyle='#FFF9C4';ctx.strokeStyle='#8B6340';ctx.lineWidth=4;
  ctx.beginPath();ctx.roundRect(-sz,-sz,sz*2,sz*2,10);ctx.fill();ctx.stroke();
  const sv=pr>0.25?Math.floor(frame/4)%6+1:diceVal;
  ctx.fillStyle='#3D2510';
  (DICE_DOTS[sv]||DICE_DOTS[1]).forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(dx*13,dy*13,5.5,0,Math.PI*2);ctx.fill();});
  ctx.restore();
  if(diceAnim<25&&diceTarget){
    p(cx-90,cy+50,180,28,'rgba(0,0,0,.75)');
    ctx.fillStyle='#FFD700';ctx.font='bold 9px Galmuri11, monospace';ctx.textAlign='center';ctx.fillText('→ '+diceTarget,cx,cy+68);ctx.textAlign='left';
  }
}

// ── 이벤트 애니메이션 전체 (3번 완전 교체) ─────────────
// 1번: 강아지 — bikeX 뒤(왼쪽)에서 쫓아옴
function drawDogAnim(){
  const off=40+Math.abs(Math.sin(frame*.05))*20;
  const dx=bikeX-off,dy=157;
  const lg=Math.sin(frame*.6)*4;
  ctx.save();ctx.translate(dx,dy);ctx.rotate(-0.1);
  p(-12,0,26,14,'#A0522D');
  p(12,-10,18,13,'#A0522D');p(24,-14,6,8,'#8B4513');p(26,-7,3,3,'#111');p(30,-3,4,3,'#333');
  p(-8,14,5,7+lg,'#8B4513');p(2,14,5,7-lg,'#8B4513');p(10,14,5,7+lg,'#8B4513');p(18,14,5,7-lg,'#8B4513');
  const ty=Math.sin(frame*.8)*5;p(-18,ty-2,7,4,'#A0522D');p(-23,ty-6,5,4,'#A0522D');
  ctx.restore();
  if(frame%16<8){
    ctx.fillStyle='#FFF';ctx.strokeStyle='#555';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.roundRect(dx-10,dy-42,44,20,5);ctx.fill();ctx.stroke();
    ctx.fillStyle='#222';ctx.font='bold 8px Galmuri11, monospace';ctx.textAlign='center';
    ctx.fillText('왈왈!',dx+12,dy-27);ctx.textAlign='left';
    ctx.fillStyle='#FFF';ctx.beginPath();ctx.moveTo(dx+5,dy-22);ctx.lineTo(dx+10,dy-16);ctx.lineTo(dx+15,dy-22);ctx.fill();
  }
  // 중앙 배너
  p(40,88,340,26,'rgba(200,60,50,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('🐕 강아지 추격! 체력 -8',210,106);ctx.textAlign='left';
}

// 유튜버 — 중앙 쪽으로 배치
function drawYoutuberAnim(){
  if(frame%8<4){ctx.fillStyle='rgba(255,255,200,.3)';ctx.fillRect(0,0,420,210);}
  const camX=bikeX+70;
  p(camX,128,14,30,'#3949AB');p(camX+2,118,10,12,'#D4956A');p(camX,116,10,5,'#2C1810');
  p(camX-10,132,10,5,'#D4956A');p(camX-24,128,16,13,'#222');p(camX-28,130,5,9,'#333');p(camX-9,126,6,4,'#FF0000');
  if(frame%8<4){ctx.fillStyle='rgba(255,255,200,.5)';ctx.beginPath();ctx.ellipse(bikeX,130,52,34,0,0,Math.PI*2);ctx.fill();}
  p(40,88,340,26,'rgba(30,60,200,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('🔴 유튜버 촬영! ₩15,000 획득',210,106);ctx.textAlign='left';
}

// 3번: 주민 음식 제공 (신규)
function drawFoodAnim(){
  const villX=bikeX+70,villY=148;
  // 주민 픽셀 (간단한 실루엣)
  p(villX-6,villY-32,14,24,'#558B2F'); // 초록 옷 (마을 주민 느낌)
  p(villX-4,villY-46,10,16,'#E0A87A'); // 얼굴
  p(villX-5,villY-50,12,6,'#5D3A1A');  // 머리카락
  // 음식 트레이 내밀기 (애니메이션)
  const ext=Math.min(16,(120-evTimer)/3);
  p(villX-6-ext,villY-22,ext+8,4,'#D4956A'); // 팔
  // 트레이 + 음식 이모지
  ctx.font='16px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('🍱',villX-6-ext-6,villY-18);ctx.textAlign='left';
  // 중앙 배너
  p(40,88,340,26,'rgba(30,140,80,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('🙏 주민이 음식을! 체력 +20',210,106);ctx.textAlign='left';
}

// 3번: 타이어 펑크 (신규 개선)
function drawFlatAnim(){
  // 연기 파티클
  for(let i=0;i<5;i++){
    const age=((frame+i*8)%40)/40;
    const sx=bikeX-8+i*5,sy=155-age*28;
    ctx.globalAlpha=Math.max(0,0.7-age*.8);
    ctx.fillStyle='#888';
    ctx.beginPath();ctx.arc(sx,sy,4+age*6,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
  // 펑크 텍스트 깜빡
  if(frame%10<5){
    ctx.fillStyle='#E24B4A';ctx.font='bold 18px Galmuri11, monospace';ctx.textAlign='center';
    ctx.fillText('펑!!',bikeX,148);ctx.textAlign='left';
  }
  // 중앙 배너
  p(40,88,340,26,'rgba(200,50,50,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('💥 타이어 펑크! 구간 -12km',210,106);ctx.textAlign='left';
}

// 3번: 소나기 (신규 개선)
function drawRainAnim(){
  ctx.fillStyle='rgba(80,120,200,.12)';ctx.fillRect(0,0,420,210);
  ctx.strokeStyle='rgba(150,200,255,.65)';ctx.lineWidth=1.5;
  for(let i=0;i<32;i++){const x=(i*23+frame*13)%460,y=(i*18+frame*10)%210;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y+20);ctx.stroke();}
  p(40,88,340,26,'rgba(30,60,150,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('🌧️ 소나기! 체력 -15',210,106);ctx.textAlign='left';
}

// 4번: 오르막 — 경사 오버레이 + 화살표 + 배너
function drawUphill(){
  ctx.fillStyle='rgba(139,115,85,.3)';
  ctx.beginPath();ctx.moveTo(0,190);ctx.lineTo(420,148);ctx.lineTo(420,190);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,180,0,.75)';ctx.lineWidth=2;
  for(let i=0;i<5;i++){
    const ax=50+i*76,ay=174-(Math.floor(frame*.5)+i*6)%24;
    ctx.beginPath();ctx.moveTo(ax,ay+10);ctx.lineTo(ax,ay);ctx.lineTo(ax-5,ay+6);ctx.moveTo(ax,ay);ctx.lineTo(ax+5,ay+6);ctx.stroke();
  }
  p(40,88,340,26,'rgba(160,90,10,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('⬆️ 오르막! 체력 -10',210,106);ctx.textAlign='left';
}

// 4번: 내리막 — 경사 오버레이 + 화살표 + 배너
function drawDownhill(){
  ctx.fillStyle='rgba(74,159,75,.22)';
  ctx.beginPath();ctx.moveTo(0,148);ctx.lineTo(420,190);ctx.lineTo(0,190);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,220,100,.8)';ctx.lineWidth=2;
  for(let i=0;i<5;i++){
    const ax=50+i*76,ay=164+(Math.floor(frame*.5)+i*6)%20;
    ctx.beginPath();ctx.moveTo(ax,ay-10);ctx.lineTo(ax,ay);ctx.lineTo(ax-5,ay-6);ctx.moveTo(ax,ay);ctx.lineTo(ax+5,ay-6);ctx.stroke();
  }
  p(40,88,340,26,'rgba(30,110,30,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('⬇️ 내리막! +6km 보너스',210,106);ctx.textAlign='left';
}

// NPC 등장 애니메이션 (등급 색상 반영)
function drawNpcAnim(){
  const npc=evAnimNpc;
  // NPC는 자전거 오른쪽에 등장하되, 화면 밖으로 쏠려 잘리지 않게 x를 화면 안으로 제한
  const nx=Math.max(90,Math.min(330,bikeX+80))+Math.sin(frame*.15)*6,ny=148;
  const em=NPC_EMOJI[npc.id]||'👤';
  const gc=GRADE_COLOR[npc.grade]||'#5C3D1E';
  const gb=GRADE_BG[npc.grade]||'#F5E6C8';
  // 등급별 광채 (rare 이상)
  if(npc.grade!=='normal'){
    const alpha=0.15+Math.sin(frame*.08)*.08;
    ctx.fillStyle=npc.grade==='god'?`rgba(255,215,0,${alpha})`:npc.grade==='epic'?`rgba(106,27,154,${alpha})`:npc.grade==='legend'?`rgba(249,168,37,${alpha})`:npc.grade==='unique'?`rgba(46,125,50,${alpha})`:`rgba(21,101,192,${alpha})`;
    ctx.beginPath();ctx.ellipse(nx+7,ny-22,50+Math.sin(frame*.1)*5,62+Math.sin(frame*.1)*5,0,0,Math.PI*2);ctx.fill();
  }
  p(nx-2,ny-32,17,24,'#5B8DD9');p(nx,ny-8,6,14,'#5B8DD9');p(nx+7,ny-8,6,14,'#5B8DD9');
  p(nx+1,ny-46,12,16,'#D4956A');p(nx+1,ny-48,12,6,'#5D3A1A');
  const wy=ny-28+Math.sin(frame*.4)*8;p(nx-9,wy,7,4,'#D4956A');
  ctx.font='14px Galmuri11, monospace';ctx.textAlign='center';ctx.fillText(em,nx+7,ny-28);ctx.textAlign='left';
  // 이름 말풍선 — 캐릭터를 따라가되, 화면 밖으로 쏠려 잘리지 않게 라벨 중심(lx)을 화면 안으로 클램프
  const bw=Math.min(170,npc.n.length*9+46);
  const half=Math.max(bw/2, 34); // 말풍선/배지 중 넓은 쪽 절반
  const lx=Math.max(half+4, Math.min(420-half-4, nx+7));
  // 배경(말풍선·꼬리·배지)은 반투명 — 도시/해안 아트가 비치게. 글자는 아래에서 불투명하게.
  const tx=Math.max(lx-bw/2+6, Math.min(lx+bw/2-14, nx+3));
  ctx.save();ctx.globalAlpha*=0.72;
  ctx.fillStyle=gb;ctx.strokeStyle=gc;ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(lx-bw/2,ny-80,bw,22,6);ctx.fill();ctx.stroke();
  ctx.fillStyle=gb;ctx.beginPath();ctx.moveTo(tx,ny-58);ctx.lineTo(tx+5,ny-50);ctx.lineTo(tx+10,ny-58);ctx.fill();ctx.fillRect(tx-1,ny-60,14,5);
  p(lx-30,ny-44,60,14,gc); // 등급 배지 배경
  ctx.restore();
  // 글자(이름·등급)는 또렷하게
  ctx.fillStyle=gc;ctx.font='bold 7px Galmuri11, monospace';ctx.textAlign='center';ctx.fillText(npc.n,lx,ny-65);ctx.textAlign='left';
  ctx.fillStyle='#FFF';ctx.font='bold 5px Galmuri11, monospace';ctx.textAlign='center';
  ctx.fillText('['+GRADE_LABEL[npc.grade]+']',lx,ny-33);ctx.textAlign='left';
}

// ── 배경 (속도 연동) ───────────────────────────────────
function drawClouds(asp){
  // 우주에선 구름 대신 별 (천천히 오른쪽→왼쪽 흐름)
  if(S.city==='달'){
    const starOffset = S.riding ? frame*.05 : 0;
    for(let i=0;i<40;i++){
      const sx=(((i*137 - Math.floor(starOffset*i*.1))%420)+420)%420;
      const sy=(i*79)%100;
      const blink=Math.sin(frame*.05+i)*0.5+0.5;
      ctx.fillStyle=`rgba(255,255,255,${(0.3+blink*.7).toFixed(2)})`;
      ctx.fillRect(sx,sy,i%3===0?2:1,i%3===0?2:1);
    }
    return;
  }
  // 일반 구름 — 자전거가 달릴 때만, 왼쪽으로 흐름
  const sp=Math.min(1.5,asp);
  const cloudFrame = S.riding ? frame : 0;
  const c1x = (((-Math.floor(cloudFrame*.28*sp))%500)+500)%500;
  const c2x = (((-Math.floor(cloudFrame*.16*sp)+240)%520)+520)%520;
  [[c1x,18,52,20],[c2x,35,36,14]].forEach(([x,y,w,h])=>{
    ctx.fillStyle='rgba(255,255,255,.88)';ctx.fillRect(x,y,w,h);ctx.fillRect(x+8,y-8,w-16,10);ctx.fillRect(x+4,y+h,w-8,8);
  });
}
function drawBgEl(type,pal,asp){
  const sp=Math.min(2,asp);
  if(type==='space'){
    // 4번: 우주 배경 — 달 표면 크레이터 + 지구 + 토끼
    // 크레이터
    [[80,108,18],[200,112,12],[340,106,22],[60,95,8],[280,100,15]].forEach(([cx,cy,cr])=>{
      ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(cx,cy,cr,cr*.4,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,180,180,.3)';ctx.beginPath();ctx.ellipse(cx-2,cy-2,cr*.8,cr*.3,0,0,Math.PI*2);ctx.fill();
    });
    // 지구 (우상단)
    const earthX=360,earthY=38;
    ctx.fillStyle='#1565C0';ctx.beginPath();ctx.arc(earthX,earthY,22,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2E7D32';ctx.beginPath();ctx.ellipse(earthX-6,earthY-4,8,6,.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2E7D32';ctx.beginPath();ctx.ellipse(earthX+5,earthY+5,6,5,-.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.ellipse(earthX,earthY,22,22,0,0,Math.PI*2);ctx.stroke&&ctx.stroke();
    // 흰 구름띠
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(earthX,earthY-8,18,4,.1,0,Math.PI*2);ctx.fill();
    // 토끼 절구질 (달 표면 위)
    drawMoonRabbit();
    return;
  }
  if(type==='mountain'){
    [[55,115,55],[175,100,45],[325,110,58],[400,115,48]].forEach(([mx,my,mw])=>{
      ctx.fillStyle='#4A7A2A';ctx.beginPath();ctx.moveTo(mx-mw,my);ctx.lineTo(mx,my-48);ctx.lineTo(mx+mw,my);ctx.fill();
      ctx.fillStyle='#5D9A35';ctx.beginPath();ctx.moveTo(mx-mw+6,my);ctx.lineTo(mx,my-48);ctx.lineTo(mx-6,my);ctx.fill();
      ctx.fillStyle='#DFF0FF';ctx.beginPath();ctx.moveTo(mx-9,my-36);ctx.lineTo(mx,my-48);ctx.lineTo(mx+9,my-36);ctx.fill();
    });
    [[95,118],[225,120],[285,114]].forEach(([tx,ty])=>drawTree(tx,ty));
  }else if(type==='coast'){
    p(0,95,420,25,pal.hor);
    ctx.fillStyle='rgba(255,255,255,.28)';
    // 파도 — 자전거 진행 반대(왼쪽)로 흐름
    const waveOffset = S.riding ? ((Math.floor(-frame*.55*sp)%72)+72)%72 : 0;
    for(let i=0;i<6;i++){const wx=(i*72+waveOffset)%460;ctx.fillRect(wx,99,28,5);ctx.fillRect(wx+7,104,18,3);}
    ctx.fillStyle='#4A8A3C';ctx.beginPath();ctx.ellipse(345,113,38,16,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5DAA4C';ctx.beginPath();ctx.ellipse(345,108,27,12,0,0,Math.PI*2);ctx.fill();
    drawTree(345,104);
  }else if(type==='city'){
    [[18,55,24],[58,32,28],[168,44,20],[278,38,26],[338,58,18],[392,46,22]].forEach(([bx,bh,bw])=>{
      p(bx,115-bh,bw,bh,'#5A6070');p(bx+2,115-bh,bw-4,4,'#6A7080');
      ctx.fillStyle='rgba(255,255,150,.55)';
      for(let r=0;r<4;r++)for(let c=0;c<2;c++)ctx.fillRect(bx+4+c*9,115-bh+7+r*12,5,7);
    });
  }else if(type==='industrial'){
    [[68,82,10],[182,72,12],[308,78,10]].forEach(([cx,ch,cw])=>{
      p(cx,115-ch,cw,ch,'#484848');p(cx+2,115-ch,4,ch,'#606060');
      ctx.fillStyle='rgba(200,200,200,.32)';ctx.beginPath();ctx.ellipse(cx+cw/2,115-ch-(Math.floor(frame*.35*sp))%28,10,5,0,0,Math.PI*2);ctx.fill();
    });
  }
}

// 4번: 달 위 토끼 절구질 애니메이션
function drawMoonRabbit(){
  const rx=340, ry=130;
  // 절굿공이 위아래 (절구질)
  const pestleY = Math.abs(Math.sin(frame*.18))*18;
  // 절구
  p(rx-12,ry-2,24,16,'#D0D0D0');
  p(rx-10,ry,20,12,'#A8A8A8');
  // 절굿공이
  p(rx-2,ry-22-pestleY,4,22+pestleY,'#E0E0E0');
  p(rx-4,ry-26-pestleY,8,6,'#D0D0D0');
  // 토끼 몸통
  ctx.fillStyle='#F0F0F0';
  ctx.beginPath();ctx.ellipse(rx,ry-18,10,12,0,0,Math.PI*2);ctx.fill();
  // 귀 (두 개)
  p(rx-7,ry-42,5,16,'#F0F0F0');
  p(rx+2,ry-42,5,16,'#F0F0F0');
  p(rx-6,ry-40,3,12,'#FFB6C1');
  p(rx+3,ry-40,3,12,'#FFB6C1');
  // 머리
  ctx.fillStyle='#F0F0F0';
  ctx.beginPath();ctx.arc(rx,ry-30,9,0,Math.PI*2);ctx.fill();
  // 눈
  p(rx-4,ry-32,3,3,'#FF6B81');
  p(rx+1,ry-32,3,3,'#FF6B81');
  // 팔 (절굿공이 잡기)
  ctx.strokeStyle='#D0D0D0';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(rx-9,ry-18);ctx.lineTo(rx-3,ry-22-pestleY/2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(rx+9,ry-18);ctx.lineTo(rx+3,ry-22-pestleY/2);ctx.stroke();
  // 말풍선 (가끔 등장)
  if(Math.floor(frame/60)%4===0){
    ctx.fillStyle='#FFF9C4';ctx.strokeStyle='#FFB6C1';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.roundRect(rx-32,ry-68,64,18,5);ctx.fill();ctx.stroke();
    ctx.fillStyle='#5C3D1E';ctx.font='bold 5px Galmuri11, monospace';ctx.textAlign='center';
    ctx.fillText('어서 와요~🌕',rx,ry-55);ctx.textAlign='left';
  }
}

function drawTree(x,y){
  p(x-2,y,4,14,'#6B4226');
  ctx.fillStyle='#2E7D32';ctx.fillRect(x-11,y-22,22,14);ctx.fillRect(x-8,y-30,16,10);ctx.fillRect(x-5,y-37,10,9);
  ctx.fillStyle='#388E3C';ctx.fillRect(x-8,y-19,7,9);ctx.fillRect(x+2,y-26,6,7);
}

// ─────────────────────────────────────────────────────────
// 🎨 확장 자산 시스템 (v7.9+)
// 사용자가 PNG를 받아오면 ASSETS_SOURCES에 base64 추가만 하면 자동 로드/적용
// ─────────────────────────────────────────────────────────
var ASSETS_SOURCES = {
  // 배경 (도시별) — 1024x576 권장
  bg_seoul: "./assets/bg_seoul.png",  // 서울 노을
  bg_busan:     null,  // 부산 항구
  bg_chungju: "./assets/bg_chungju.png",  // 충주 시골 (시작 도시)
  bg_tokyo:     null,
  bg_jeju: "./assets/bg_jeju.png",
  bg_default:   null,  // 기본 배경 (도시별 없을 때 폴백)
  // 범용 배경 — region/bg 기반 자동 적용
  bg_nature: "./assets/bg_nature.png",  // 자연 (mountain/snow)
  bg_coast_gen: "./assets/bg_coast_gen.png",  // 해안가 범용
  bg_city_gen: "./assets/bg_city_gen.png",  // 도시 범용 (city/industrial)
  bg_moon: "./assets/bg_moon.png",  // 달 우주
  bg_shinhan: "./assets/bg_shinhan.png",  // 신한 함정 (염전)
  bg_cheonghak: "./assets/bg_cheonghak.png",  // 청학동 함정 (훈장)

  // NPC 픽셀 초상화 (배경 투명) — 모달 + 카드용
  // 신 1
  npc_mb:       "./assets/npc_mb.png",       // MR.블랙
  // 전설 9
  npc_rk:       "./assets/npc_rk.png",       // 락둥이(헤비메탈)
  npc_mc:       "./assets/npc_mc.png",       // 마충구(삼성맨)
  npc_ky:       "./assets/npc_ky.png",       // 경키
  npc_gu:       "./assets/npc_gu.png",       // 기우기
  npc_hm:       "./assets/npc_hm.png",       // 할망
  npc_md:       "./assets/npc_md.png",       // 모도
  npc_sx:       "./assets/npc_sx.png",       // 섹사
  npc_tk:       "./assets/npc_tk.png",       // 거북긔
  npc_br:       "./assets/npc_br.png",       // 브라질리언
  // 에픽 4
  npc_cv:       "./assets/npc_cv.png",       // 편의점 그녀
  npc_at:       "./assets/npc_at.png",       // 아트
  npc_rj:       "./assets/npc_rj.png",       // 리주노
  npc_ly:       "./assets/npc_ly.png",       // 임연수
  // 재앙 7대죄
  npc_fred:     "./assets/npc_fred.png",     // 탐욕의 프레드
  npc_wrath:    "./assets/npc_wrath.png",    // 분노의 상수
  npc_sloth:    "./assets/npc_sloth.png",    // 나태의 노무
  npc_envy:     "./assets/npc_envy.png",     // 시기의 짐승
  npc_gluttony: "./assets/npc_gluttony.png", // 식탐의 찐기욱
  npc_pride:    "./assets/npc_pride.png",    // 교만의 가오지훈
  npc_lust:     "./assets/npc_lust.png",     // 색욕의 쾌락체
  // 특별
  npc_kimri:    "./assets/npc_kimri.png",    // 검도왕 김리

  // UI 프레임/아이콘
  ui_npc_frame: null,  // NPC 모달 갈색 액자
  ui_btn_o:     null,
  ui_btn_x:     null,

  // 하단 메뉴 아이콘 (각 64x64)
  icon_home:    null,
  icon_map:     null,
  icon_bag:     null,
  icon_book:    null,
  icon_gear:    null,
  icon_npc:     null,
  icon_quest:   null,

  // 탈것 (자전거 외)
  veh_scooter:  null,
  veh_motor:    null,
  veh_car:      null,
};

// Image 객체 캐시
var ASSETS_IMG = {};
// 자산이 로드됐는지 체크
function hasAsset(key){
  const img = ASSETS_IMG[key];
  return !!(img && img.complete && img.naturalWidth > 0);
}
// 자산 그리기 (없으면 false 반환 → 폴백 그리기 사용)
function drawAsset(ctx, key, x, y, w, h){
  if(!hasAsset(key)) return false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(ASSETS_IMG[key], x, y, w, h);
  return true;
}
// 도시 배경 그리기 (도시 이름 → bg_도시 매핑, 없으면 bg_default)
function drawCityBackground(ctx, cityName, x, y, w, h){
  const map = {
    '서울':'bg_seoul', '부산':'bg_busan', '충주':'bg_chungju',
    '도쿄':'bg_tokyo', '제주':'bg_jeju'
  };
  const key = map[cityName];
  if(key && drawAsset(ctx, key, x, y, w, h)) return true;
  return drawAsset(ctx, 'bg_default', x, y, w, h);
}
// #6 여행 엽서 — 도시별 배경 키(drawScene의 pickBgKey와 동일 규칙, S 비의존 재사용)
function bgKeyForCity(cityName){
  const c = CITIES.find(x=>x.n===cityName);
  const specificMap = {'서울':'bg_seoul','충주':'bg_chungju','제주':'bg_jeju','달':'bg_moon','신한':'bg_shinhan','지리산청학동':'bg_cheonghak'};
  if(specificMap[cityName] && hasAsset(specificMap[cityName])) return specificMap[cityName];
  const genericMap = {'mountain':'bg_nature','snow':'bg_nature','coast':'bg_coast_gen','city':'bg_city_gen','industrial':'bg_city_gen','space':'bg_moon'};
  const g = c && genericMap[c.bg];
  if(g && hasAsset(g)) return g;
  if(hasAsset('bg_nature')) return 'bg_nature';
  return null;
}
// 엽서 1장을 임의 크기 캔버스 컨텍스트에 그린다(배경+복동이+도시명+날짜+테두리).
function renderPostcardTo(ctx, w, h, cityName, dateStr){
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  // 크림 프레임
  ctx.fillStyle = '#f4ead3'; ctx.fillRect(0,0,w,h);
  const pad = Math.max(3, Math.round(w*0.045));
  const iw = w - pad*2, ih = h - pad*2, ix = pad, iy = pad;
  ctx.save();
  ctx.beginPath(); ctx.rect(ix,iy,iw,ih); ctx.clip();
  // 배경
  const bgKey = bgKeyForCity(cityName);
  const img = bgKey && ASSETS_IMG[bgKey];
  if(img && img.complete && img.naturalWidth){
    ctx.drawImage(img, ix, iy - Math.round(ih*0.10), iw, Math.round(ih*1.18)); // 살짝 위로 크롭
  } else {
    ctx.fillStyle = '#7EC8E3'; ctx.fillRect(ix,iy,iw,ih);
  }
  // 복동이 (하단 중앙)
  try { drawBokdongSprite(ctx, ix + iw*0.5, iy + ih*0.66, (ih/150), false); } catch(e){}
  // 하단 배너(도시명·날짜)
  const bh = Math.max(18, Math.round(ih*0.26));
  ctx.fillStyle = 'rgba(15,20,35,.62)'; ctx.fillRect(ix, iy+ih-bh, iw, bh);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold ' + Math.round(bh*0.42) + 'px Galmuri11, monospace';
  ctx.fillText('📍 ' + cityName, ix+6, iy+ih-bh + Math.round(bh*0.36));
  ctx.fillStyle = '#FFE082'; ctx.font = Math.round(bh*0.3) + 'px Galmuri11, monospace';
  ctx.fillText(dateStr, ix+6, iy+ih - Math.round(bh*0.28));
  ctx.restore();
  // 테두리
  ctx.strokeStyle = '#c9b487'; ctx.lineWidth = 2; ctx.strokeRect(1,1,w-2,h-2);
  ctx.restore();
}

// 자동 로더 — 페이지 로드 시 ASSETS_SOURCES의 모든 base64를 Image로 변환
function _loadAssets(){
  Object.keys(ASSETS_SOURCES).forEach(key=>{
    const src = ASSETS_SOURCES[key];
    if(!src) return;  // 아직 base64 등록 안 된 자산은 스킵
    const img = new Image();
    img.src = src;
    ASSETS_IMG[key] = img;
  });
}
// DOM 준비 후 실행
if(typeof window !== 'undefined'){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', _loadAssets);
  } else {
    _loadAssets();
  }
}

// 이미지 등록 헬퍼 (사용자 접근용 — 콘솔에서 테스트 가능)
function registerAsset(key, base64DataUrl){
  ASSETS_SOURCES[key] = base64DataUrl;
  const img = new Image();
  img.src = base64DataUrl;
  ASSETS_IMG[key] = img;
  console.log('Asset 등록: ' + key);
}

// ── 탈것별 픽셀 그리기 헬퍼 ────────────────────────────
// ═══════════════ 임복동 픽셀 스프라이트 (사용자 제공 PNG, 64x64) ═══════════════
// 임복동 픽셀 스프라이트 (base64 임베드)
var BOKDONG_SPRITES = {
  cyc_1: "./assets/cyc_1.png",
  cyc_2: "./assets/cyc_2.png",
  cyc_3: "./assets/cyc_3.png",
  cyc_4: "./assets/cyc_4.png",
  cyc_5: "./assets/cyc_5.png",
  ty_1: "./assets/ty_1.png",
  ty_2: "./assets/ty_2.png",
  ty_3: "./assets/ty_3.png",
  ty_4: "./assets/ty_4.png",
  ty_5: "./assets/ty_5.png",
  ty_6: "./assets/ty_6.png",
  ty_7: "./assets/ty_7.png",
  ty_8: "./assets/ty_8.png",
  ty_9: "./assets/ty_9.png",
  ty_10: "./assets/ty_10.png",
};
// 부스트 스프라이트: 5단계 × 5프레임 (v9.22 재작업 시트 — 마젠타 배경, 캐릭터 앵커 정렬)
for (let _t = 1; _t <= 5; _t++) for (let _f = 1; _f <= 5; _f++)
  BOKDONG_SPRITES['b' + _t + '_' + _f] = './assets/b' + _t + '_' + _f + '.png';
// 이미지 객체로 미리 로드
var BOKDONG_IMG = {};
var BOKDONG_LOADED = false;
(function loadBokdongSprites(){
  let loadedCount = 0;
  const total = Object.keys(BOKDONG_SPRITES).length;
  Object.keys(BOKDONG_SPRITES).forEach(key=>{
    const img = new Image();
    img.onload = ()=>{
      loadedCount++;
      if(loadedCount === total) BOKDONG_LOADED = true;
    };
    img.src = BOKDONG_SPRITES[key];
    BOKDONG_IMG[key] = img;
  });
})();

// 자전거 카테고리에서 임복동 스프라이트 그리기
// 페달 디버그용 — 콘솔에서 window.bokdongDebug=true 입력하면 자세 로그 출력
window.bokdongDebug = false;
var _lastPhaseLog = '';
// 부스트 단계 판정: 현재 자전거(v1~v30)가 5구간 중 몇 단계인지 (1~5)
function getBoostTier(){
  const bikes = VEHS.filter(v=>v.cat==='bike');
  const idx = bikes.findIndex(v=>v.id===S.vId);
  if(idx < 0) return 1;
  // 30개를 6개씩 5구간으로: 0~5→1, 6~11→2, 12~17→3, 18~23→4, 24~29→5
  return Math.min(5, Math.floor(idx / 6) + 1);
}
function drawBokdongSprite(ctx2, cx, cy, scale, isRiding){
  const isBoost = (S.dopT||0) > 0;
  // 일반 5프레임 / 부스트 10프레임 사이클 (v9.19 재작업 시트)
  let frameNum;
  if(!isRiding){
    frameNum = 1;
  } else {
    const speed = isBoost ? 4 : 7;   // 부스터는 더 빠른 페달링
    const cycleLen = 5;              // 일반·부스터 모두 5프레임 루프
    frameNum = (Math.floor(frame / speed) % cycleLen) + 1;
  }
  // 부스터 시: 자전거 단계에 맞는 부스트 오라 (b{tier}_{frame}), 일반: cyc_{frame}
  let key;
  if(isBoost){
    const tier = getBoostTier();
    key = 'b' + tier + '_' + frameNum;
  } else {
    key = 'cyc_' + frameNum;
  }
  if(window.bokdongDebug && key !== _lastPhaseLog){
    console.log('[bokdong] frame='+frame+' key='+key+' boost='+isBoost+' tier='+(isBoost?getBoostTier():'-'));
    _lastPhaseLog = key;
  }
  let img = BOKDONG_IMG[key];
  if(!img || !img.complete || img.naturalWidth === 0){
    // 폴백: 부스트면 해당 단계 1프레임 → b1_1 → cyc_1 순
    if(isBoost){
      const tier = getBoostTier();
      img = BOKDONG_IMG['b'+tier+'_1'] || BOKDONG_IMG['b1_1'];
    }
    if(!img || !img.complete || img.naturalWidth === 0){
      img = BOKDONG_IMG['cyc_1'];
      if(!img || !img.complete || img.naturalWidth === 0) return false;
    }
  }
  // 128px 고해상도 → 100px. 일반·부스트 동일 크기/정렬 (부스트도 목 안잘림)
  // 부스트 스프라이트는 머리위·발아래 여백을 넉넉히 둬서 같은 크기로 그려도 오라까지 다 보임
  const sz = 112 * scale; // 복동이 표시 크기(+약간 크게). 조정 지점.
  ctx2.imageSmoothingEnabled = true;
  ctx2.imageSmoothingQuality = 'high';
  // 발끝(바퀴 바닥) 기준 정렬 — 바퀴가 화면 아래로 안 잘리게
  const footY = cy + 34;  // 바퀴 바닥선
  ctx2.drawImage(img, Math.round(cx - sz/2), Math.round(footY - sz), sz, sz);
  return true;
}
// 마지막 drawVehPixel 호출이 임복동 스프라이트를 그렸는지 추적
var _spriteRendered = false;

function drawVehPixel(ctx2, vId, cx, cy, scale, isAnim){
  // scale=1 기준, cx/cy는 중심점
  const v=VEHS.find(x=>x.id===vId)||VEHS[0];
  const s=scale||1;
  function pp(x,y,w,h,c){ctx2.fillStyle=c;ctx2.fillRect(Math.round(cx+x*s),Math.round(cy+y*s),Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*s)));}
  // 2번 fix: 모든 탈것은 항상 임복동 자전거로 그림 (탈것 성능은 그대로 유지, 외형만 통일)
  // → isBikeKind를 무조건 true로 처리
  let bikeColor = '#2E5C18';

  // 자전거 스프라이트 (모든 탈것에 동일 적용)
  _spriteRendered = false;
  if(s >= 0.9 && drawBokdongSprite(ctx2, cx, cy, s, isAnim)){
    _spriteRendered = true;
    return;
  }
  // 폴백: 픽셀 자전거 그리기
  ctx2.strokeStyle=bikeColor;ctx2.lineWidth=2*s;
  ctx2.beginPath();ctx2.arc(cx-15*s,cy,13*s,0,Math.PI*2);ctx2.stroke();
  ctx2.beginPath();ctx2.arc(cx+15*s,cy,13*s,0,Math.PI*2);ctx2.stroke();
  ctx2.beginPath();ctx2.moveTo(cx-15*s,cy);ctx2.lineTo(cx-2*s,cy-14*s);ctx2.lineTo(cx+15*s,cy);ctx2.stroke();
  ctx2.beginPath();ctx2.moveTo(cx-2*s,cy-14*s);ctx2.lineTo(cx+7*s,cy-20*s);ctx2.stroke();
  ctx2.beginPath();ctx2.moveTo(cx+7*s,cy-20*s);ctx2.lineTo(cx+14*s,cy-21*s);ctx2.stroke();
}

// (구버전 분기 — 사용 안 함, 도감 등 다른 곳에서 호출하지 않음)
function _drawVehPixel_unused_OLD(ctx2, vId, cx, cy, scale, isAnim){
  const v=VEHS.find(x=>x.id===vId)||VEHS[0];
  const s=scale||1;
  function pp(x,y,w,h,c){ctx2.fillStyle=c;ctx2.fillRect(Math.round(cx+x*s),Math.round(cy+y*s),Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*s)));}
  const isBikeKind = (v.cat==='bike'||vId==='t'||vId==='a2'||vId==='a1'||vId==='rd');
  let bikeColor = '#2E5C18';
  if(isBikeKind){return;}
  // 이하 옛 코드 (오토바이/자동차/슈퍼카) — 호출되지 않음
  if(v.cat==='kick'){
    pp(-2,-30,5,32,'#444');pp(-14,-30,28,5,'#444');
    ctx2.strokeStyle='#333';ctx2.lineWidth=2*s;ctx2.beginPath();ctx2.arc(cx-13*s,cy,11*s,0,Math.PI*2);ctx2.stroke();ctx2.beginPath();ctx2.arc(cx+13*s,cy,11*s,0,Math.PI*2);ctx2.stroke();
    pp(-4,-34,8,6,'#2196F3');
  }else if(v.cat==='moto'){
    ctx2.strokeStyle='#222';ctx2.lineWidth=3*s;ctx2.beginPath();ctx2.arc(cx-18*s,cy,15*s,0,Math.PI*2);ctx2.stroke();ctx2.beginPath();ctx2.arc(cx+18*s,cy,15*s,0,Math.PI*2);ctx2.stroke();
    ctx2.strokeStyle='#555';ctx2.lineWidth=2*s;ctx2.beginPath();ctx2.moveTo(cx-18*s,cy);ctx2.lineTo(cx,cy-20*s);ctx2.lineTo(cx+18*s,cy);ctx2.stroke();
    ctx2.beginPath();ctx2.moveTo(cx,cy-20*s);ctx2.lineTo(cx+10*s,cy-25*s);ctx2.stroke();
    pp(-10,-34,22,12,'#C62828');pp(-6,-36,14,6,'rgba(150,220,255,.8)');
  }else if(v.cat==='sport'){
    const col=vId==='ninja'?'#00E676':'#FF6D00';
    ctx2.strokeStyle='#111';ctx2.lineWidth=3*s;ctx2.beginPath();ctx2.arc(cx-20*s,cy,16*s,0,Math.PI*2);ctx2.stroke();ctx2.beginPath();ctx2.arc(cx+20*s,cy,16*s,0,Math.PI*2);ctx2.stroke();
    pp(-22,-30,44,16,col);pp(-18,-40,36,12,col);
    pp(-10,-42,20,8,'rgba(150,230,255,.8)');
    pp(18,-28,6,4,'#FFD700');
    pp(-28,-18,8,4,'#FF3D00');
    if(vId==='haya'){pp(-24,-36,48,8,'#333');pp(-20,-44,40,10,'#FF6D00');}
  }else if(v.cat==='car'){
    const carCols={tico:'#E53935',good:'#43A047',avant:'#1565C0',sona:'#546E7A',sport:'#4E342E',soren:'#37474F'};
    const col=carCols[vId]||'#555';
    pp(-36,-24,74,24,col);pp(-28,-40,58,18,col);
    pp(-24,-38,22,14,'rgba(150,220,255,.85)');pp(4,-38,20,14,'rgba(150,220,255,.85)');
    ctx2.fillStyle='#111';ctx2.beginPath();ctx2.arc(cx-22*s,cy+3*s,9*s,0,Math.PI*2);ctx2.fill();ctx2.beginPath();ctx2.arc(cx+22*s,cy+3*s,9*s,0,Math.PI*2);ctx2.fill();
    ctx2.fillStyle='#444';ctx2.beginPath();ctx2.arc(cx-22*s,cy+3*s,5*s,0,Math.PI*2);ctx2.fill();ctx2.beginPath();ctx2.arc(cx+22*s,cy+3*s,5*s,0,Math.PI*2);ctx2.fill();
    pp(34,-20,5,10,'#FFD700');pp(-40,-20,5,8,'#F44336');
  }else if(v.cat==='super'){
    const superCols={porsche:'#B71C1C',ferrari:'#D32F2F',lambo:'#FFD600'};
    const col=superCols[vId]||'#F44336';
    pp(-40,-16,82,18,col);
    pp(-32,-34,66,20,col);
    pp(-26,-32,24,14,'rgba(150,230,255,.9)');pp(4,-32,22,14,'rgba(150,230,255,.9)');
    if(vId==='lambo'){pp(-38,-26,8,12,'#333');pp(-44,-28,14,4,'#FFD600');}
    if(vId==='ferrari'){pp(-36,-24,6,10,'#333');pp(-40,-26,12,4,'#111');}
    ctx2.fillStyle='#111';ctx2.beginPath();ctx2.arc(cx-24*s,cy+4*s,10*s,0,Math.PI*2);ctx2.fill();ctx2.beginPath();ctx2.arc(cx+24*s,cy+4*s,10*s,0,Math.PI*2);ctx2.fill();
    ctx2.fillStyle='#555';ctx2.beginPath();ctx2.arc(cx-24*s,cy+4*s,5*s,0,Math.PI*2);ctx2.fill();ctx2.beginPath();ctx2.arc(cx+24*s,cy+4*s,5*s,0,Math.PI*2);ctx2.fill();
    pp(38,-14,6,10,'#FFD700');pp(-45,-14,6,8,'#FF1744');
  }else if(v.cat==='legend'){
    // 서퍼티지 — 황금빛 전설
    ctx2.fillStyle='rgba(255,215,0,.3)';ctx2.beginPath();ctx2.ellipse(cx,cy-20*s,50*s,30*s,0,0,Math.PI*2);ctx2.fill();
    pp(-42,-18,86,20,'#FFD700');pp(-34,-38,70,22,'#FFC107');
    pp(-28,-36,26,16,'rgba(200,240,255,.9)');pp(4,-36,24,16,'rgba(200,240,255,.9)');
    ctx2.fillStyle='#FF6D00';ctx2.beginPath();ctx2.arc(cx-26*s,cy+4*s,11*s,0,Math.PI*2);ctx2.fill();ctx2.beginPath();ctx2.arc(cx+26*s,cy+4*s,11*s,0,Math.PI*2);ctx2.fill();
    ctx2.fillStyle='#FFD700';ctx2.beginPath();ctx2.arc(cx-26*s,cy+4*s,6*s,0,Math.PI*2);ctx2.fill();ctx2.beginPath();ctx2.arc(cx+26*s,cy+4*s,6*s,0,Math.PI*2);ctx2.fill();
    pp(40,-16,7,12,'#FF6D00');pp(-48,-16,7,10,'#FF3D00');
    for(let i=0;i<4;i++){
      const sx=cx+(-40+i*28)*s,sy=cy+(-32+Math.sin(i+frame*.08)*6)*s;
      ctx2.fillStyle='rgba(255,215,0,.7)';ctx2.fillRect(sx,sy,3*s,3*s);
    }
  }else if(v.cat==='rocket'){
    // 임복동1호 로켓 — 세로형 로켓
    pp(-6,-42,12,36,'#E53935');     // 몸통 (빨강)
    pp(-4,-48,8,8,'#FF8F00');       // 노즈콘 (주황)
    // 노즈콘 뾰족한 삼각형
    ctx2.fillStyle='#FF8F00';ctx2.beginPath();ctx2.moveTo(cx,cy-56*s);ctx2.lineTo(cx-4*s,cy-48*s);ctx2.lineTo(cx+4*s,cy-48*s);ctx2.fill();
    pp(-5,-36,4,16,'rgba(150,220,255,.9)'); // 창문
    pp(-2,-16,4,10,'#888');         // 하단 엔진부
    // 날개 (좌우 삼각)
    ctx2.fillStyle='#1565C0';
    ctx2.beginPath();ctx2.moveTo(cx-6*s,cy-12*s);ctx2.lineTo(cx-18*s,cy+6*s);ctx2.lineTo(cx-6*s,cy+6*s);ctx2.fill();
    ctx2.beginPath();ctx2.moveTo(cx+6*s,cy-12*s);ctx2.lineTo(cx+18*s,cy+6*s);ctx2.lineTo(cx+6*s,cy+6*s);ctx2.fill();
    // 불꽃
    ctx2.fillStyle='#FF6D00';ctx2.beginPath();ctx2.moveTo(cx-4*s,cy+6*s);ctx2.lineTo(cx,cy+22*s);ctx2.lineTo(cx+4*s,cy+6*s);ctx2.fill();
    ctx2.fillStyle='#FFD600';ctx2.beginPath();ctx2.moveTo(cx-2*s,cy+6*s);ctx2.lineTo(cx,cy+14*s);ctx2.lineTo(cx+2*s,cy+6*s);ctx2.fill();
    // 태극문양 (귀여운 원)
    ctx2.fillStyle='#FFF';ctx2.beginPath();ctx2.arc(cx,cy-26*s,5*s,0,Math.PI*2);ctx2.fill();
    ctx2.fillStyle='#E53935';ctx2.beginPath();ctx2.arc(cx,cy-26*s,3*s,Math.PI,Math.PI*2);ctx2.fill();
    ctx2.fillStyle='#1565C0';ctx2.beginPath();ctx2.arc(cx,cy-26*s,3*s,0,Math.PI);ctx2.fill();
    // "1호" 텍스트
    ctx2.fillStyle='#FFF';ctx2.font=`bold ${Math.round(5*s)}px monospace`;ctx2.textAlign='center';
    ctx2.fillText('1호',cx,cy-8*s);ctx2.textAlign='left';
  }
}

// ── 임복동 메인 씬 드로우 (속도 연동) ─────────────────
function drawBokdong(x,y,asp){
  const boost=S.dopT>0;
  // 1번: 위아래 흔들림(bob) 완전 제거 — 자연스럽게 앞으로 가는 느낌
  const ry=y;

  // 2번 fix: 모든 탈것을 항상 자전거로 그림 (탈것별 분기 완전 제거)
  // 탈것 그리기 — drawVehPixel 안에서 자전거 스프라이트만 시도
  drawVehPixel(ctx,S.vId,x,ry,1,S.riding);

  // 스프라이트로 그려졌으면 추가 그리기 없음
  if(_spriteRendered) return;

  // 폴백 (스프라이트 로드 실패 시) — 무조건 자전거 라이더 픽셀
  const la=frame*(boost?.45:.24)*Math.min(2,asp);
  ctx.fillStyle='#1A237E';
  if(S.riding){const ll=[x-4+Math.cos(la)*5,ry-8+Math.sin(la)*4],rl=[x+2+Math.cos(la+Math.PI)*5,ry-8+Math.sin(la+Math.PI)*4];ctx.fillRect(ll[0]-2,ll[1]-2,5,8);ctx.fillRect(rl[0]-2,rl[1]-2,5,8);ctx.fillStyle='#D4956A';ctx.fillRect(ll[0]-3,ll[1]+5,6,3);ctx.fillRect(rl[0]-3,rl[1]+5,6,3);}
  else{p(x-6,ry-16,7,10,'#1A237E');p(x+1,ry-14,7,10,'#1A237E');}
  p(x-7,ry-32,15,14,boost?'#FFF0D0':'#FFF');p(x-8,ry-31,3,10,'#DDD');p(x+5,ry-30,3,8,'#DDD');p(x-2,ry-32,5,3,'#CCC');
  p(x-10,ry-28,5,8,'#D4956A');p(x+6,ry-26,5,7,'#D4956A');p(x+10,ry-23,4,4,'#C4855A');
  const hx=x-2,hy=ry-48;
  p(hx-1,hy+14,4,4,'#D4956A');p(hx-5,hy,12,14,'#E0A87A');p(hx-6,hy+2,2,10,'#D4956A');p(hx+6,hy+2,2,10,'#D4956A');p(hx-4,hy+12,10,3,'#D4956A');
  p(hx-6,hy-4,14,6,'#5D3A1A');p(hx-7,hy,3,8,'#5D3A1A');p(hx+5,hy,4,6,'#5D3A1A');p(hx+5,hy-6,5,4,'#6B4226');p(hx+8,hy-8,4,5,'#7B5236');p(hx-5,hy-6,4,4,'#6B4226');
  p(hx-4,hy+3,5,2,'#2C1810');p(hx+2,hy+3,5,2,'#2C1810');
  p(hx-3,hy+6,3,3,'#1A0A00');p(hx+2,hy+6,3,3,'#1A0A00');p(hx-3,hy+6,2,2,'#FFF');p(hx+3,hy+6,2,2,'#FFF');p(hx-2,hy+7,1,2,'#080808');p(hx+3,hy+7,1,2,'#080808');
  p(hx,hy+9,2,2,'#C48060');p(hx-2,hy+12,7,2,'#8B4513');p(hx-2,hy+12,2,1,'#5C2A0A');
}

// ── 휴식 씬 ────────────────────────────────────────────
function drawRestScene(){
  const tx=305,ty=148;
  p(tx-5,ty-35,10,35,'#6B4226');
  ctx.fillStyle='#2E7D32';ctx.fillRect(tx-20,ty-62,40,22);ctx.fillRect(tx-15,ty-72,30,13);ctx.fillRect(tx-9,ty-80,18,11);
  ctx.fillStyle='#388E3C';ctx.fillRect(tx-15,ty-58,9,14);ctx.fillRect(tx+6,ty-65,8,8);
  ctx.save();ctx.translate(265,150);ctx.rotate(-0.18);
  ctx.strokeStyle='#2E5C18';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(-13,0,12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(13,0,12,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(0,-13);ctx.lineTo(13,0);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(-4,-17);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(6,-20);ctx.stroke();ctx.restore();
  const rpx=tx+20,rpy=148,br=Math.sin(frame*.07)*.7;
  p(rpx-18,rpy-6,16,7,'#1A237E');p(rpx-2,rpy-4,20,6,'#1A237E');p(rpx-22,rpy-3,6,4,'#D4956A');p(rpx+18,rpy-2,6,4,'#D4956A');
  ctx.save();ctx.translate(rpx,rpy-18+br);ctx.rotate(0.22);p(-7,-10,15,16,'#FFF');p(-8,-9,3,12,'#DDD');ctx.restore();
  ctx.save();ctx.translate(rpx+4,rpy-34+br);ctx.rotate(0.22);
  p(-6,-6,13,13,'#E0A87A');p(-7,-10,14,6,'#5D3A1A');p(-8,-7,3,6,'#5D3A1A');p(5,-7,4,5,'#5D3A1A');p(5,-12,5,5,'#6B4226');
  ctx.strokeStyle='#2C1810';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-3,-1);ctx.lineTo(0,-1);ctx.stroke();ctx.beginPath();ctx.moveTo(2,-1);ctx.lineTo(5,-1);ctx.stroke();ctx.beginPath();ctx.arc(1,2,3,.15,Math.PI-.15);ctx.stroke();ctx.restore();
  ['z','z','Z'].forEach((z,i)=>{const a=.2+Math.abs(Math.sin(frame*.05+i*.85))*.7;ctx.globalAlpha=a;ctx.fillStyle='#8B6340';ctx.font=`bold ${8+i*3}px monospace`;ctx.fillText(z,rpx+20+i*9,rpy-38-i*11+Math.sin(frame*.04+i)*4);});
  ctx.globalAlpha=1;
  ctx.fillStyle='#E53935';ctx.beginPath();ctx.arc(rpx-28,rpy-2,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#33691E';ctx.fillRect(rpx-29,rpy-8,2,5);
}

// ── 애니메이션 루프 (속도 연동) ────────────────────────
function animLoop(){
  drawScene();
  if(S.riding&&!isResting){
    const asp = animSpeedMult();
    // 캐릭터 가로 이동 속도 — 자전거 단계별 목표:
    //   일반: v1≈15초, v30≈3초 / 부스트: v1≈8초, v30≈1.5초 (화면 횡단 기준)
    const move = S.dopT>0 ? (0.362*asp + 0.902) : (0.178*asp + 0.489);
    bikeX += move;
    if(bikeX > 470){ bikeX = -50; }
  }
  // 정지 시엔 bikeX 그대로 유지 (멈춘 위치)
  requestAnimationFrame(animLoop);
}
// (rAF 킥오프는 boot.js로 이동 — 모든 파일 로드 후 시작 보장)

// ── 반응형 스케일 (안드로이드/iOS/PC 통합) ──────────
(function(){
  const root = document.documentElement;

  function applyScale(){
    const winW = window.innerWidth || document.documentElement.clientWidth;
    const winH = window.innerHeight || document.documentElement.clientHeight;

    // 게임 기본 사이즈: 420×900 (가로×세로)
    // 가로/세로 둘 다 맞도록 스케일 계산 (작은 쪽 기준)
    const scaleByW = winW / 420;
    const scaleByH = winH / 900;
    let u = Math.min(scaleByW, scaleByH);

    // 너무 작거나 너무 크지 않게 클램프 (0.6 ~ 2.0 사이)
    u = Math.max(0.6, Math.min(2.0, u));

    root.style.setProperty('--u', u.toFixed(4));

    // 캔버스 CSS 크기 (내부 해상도 420×210은 항상 고정)
    const cvEl = document.getElementById('cv');
    if(cvEl){
      const cvW = Math.min(winW, 420 * u);
      cvEl.style.width  = cvW + 'px';
      cvEl.style.height = Math.round(cvW * 0.562) + 'px';
    }

    // 메인 컨테이너 가운데 정렬 (큰 화면에서)
    document.body.style.maxWidth = (420 * u) + 'px';
    document.body.style.margin = '0 auto';
  }

  // 즉시 실행
  applyScale();
  // DOM 완전히 그려진 후 재실행 (타이밍 이슈 방지)
  window.addEventListener('load', applyScale);
  requestAnimationFrame(applyScale);
  setTimeout(applyScale, 200); // 안드로이드 지연 렌더링 대비

  window.addEventListener('resize', applyScale, {passive:true});
  window.addEventListener('orientationchange', ()=>setTimeout(applyScale, 300), {passive:true});
  try{ screen.orientation.addEventListener('change', ()=>setTimeout(applyScale,300)); }catch(e){}

  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      sessionStorage.setItem('hiddenAt', Date.now());
    } else {
      setTimeout(applyScale, 100);
      const hiddenAt = parseInt(sessionStorage.getItem('hiddenAt')||'0');
      if(hiddenAt && Date.now()-hiddenAt > 5000){
        const sec = Math.floor((Date.now()-hiddenAt)/1000);
        // 1번: 오프라인 1분당 체력+1 (체력이 0이거나 만피여도 적용)
        const minutes = Math.floor(sec/60);
        if(minutes > 0 && typeof S !== 'undefined'){
          const before = S.hp;
          S.hp = Math.min(S.mhp, S.hp + minutes);
          const recovered = Math.round(S.hp - before);
          if(recovered > 0){
            addLog('good','📱 '+minutes+'분 자리비움 → 체력+'+recovered+' 회복!');
          }else{
            addLog('neutral','📱 '+minutes+'분 자리비움');
          }
          if(typeof update === 'function') update();
        }
      }
    }
  });
})();
