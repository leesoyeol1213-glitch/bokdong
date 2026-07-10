// ═══ data.js — 게임 데이터(도시/탈것/퀴즈/업적)·상태 S·헬퍼
// game.js(v9.19, 4758줄)에서 분할. 로드 순서: data → render → logic → boot (index.html)
// 전역 공유(모듈 아님) — 분할 전과 의미 동일.


// ── 데이터 ─────────────────────────────────────────────
const CITIES=[
  {n:'충주',   region:'충청',bg:'mountain',  hist:'탄금대 — 우륵이 가야금을 연주한 신라 유적지'},
  {n:'제천',   region:'충청',bg:'mountain',  hist:'의림지 — 삼한시대 축조된 국내 최고(最古) 저수지'},
  {n:'강릉',   region:'강원',bg:'coast',     hist:'오죽헌 — 신사임당·율곡 이이의 생가'},
  {n:'속초',   region:'강원',bg:'coast',     hist:'신흥사 — 설악산 천년 고찰, 통일신라 창건'},
  {n:'고성',   region:'강원',bg:'coast',     hist:'건봉사 — 임진왜란 사명대사 주둔 사찰'},
  {n:'포항',   region:'경상',bg:'industrial',hist:'흥해읍성 — 고려시대 축조 읍성 유적'},
  {n:'부산',   region:'경상',bg:'city',      hist:'임시수도기념관 — 한국전쟁 피란수도. 부산항에서 일본행 페리도 출항한다.', special:'ferry'},
  {n:'여수',   region:'전라',bg:'coast',     hist:'진남관 — 이순신 장군 전라좌수영 본영'},
  {n:'목포',   region:'전라',bg:'coast',     hist:'유달산 — 임진왜란 이순신 주둔지'},
  {n:'군산',   region:'전라',bg:'city',      hist:'근대역사박물관 — 일제강점기 수탈 역사'},
  {n:'태안',   region:'충청',bg:'coast',     hist:'백화산성 — 백제시대 산성 유적'},
  {n:'인천',   region:'경기',bg:'city',      hist:'자유공원 — 인천상륙작전, 맥아더 동상'},
  {n:'서울',   region:'경기',bg:'city',      hist:'경복궁 — 조선왕조 정궁, 500년 역사'},
  {n:'나로호발사센터',region:'전라',bg:'coast',hist:'나로우주센터 — 대한민국 최초 우주발사체 나로호 발사 기지. 임복동1호의 꿈이 시작되는 곳!', special:'rocket'},
  {n:'달',region:'우주',bg:'space',hist:'🌕 히든스페이스! 달에 도착했다!! 절구질하는 토끼가 반긴다. 200km를 달리면 충주로 귀환한다.', special:'moon'},
  // 3번: 함정 지역 (랜덤 시 나오면 다이스 사용 불가, 도착 시 200km 무의미 라이딩)
  {n:'신한',region:'함정',bg:'coast',hist:'🏖️ 햇빛 쨍쨍한 바닷가… 그런데 어딘가 수상하다. 염전 노예가 노려본다.', special:'trap_shinhan'},
  {n:'지리산청학동',region:'함정',bg:'mountain',hist:'⛰️ 청학동! 갓을 쓴 훈장님이 교통법규 교육을 시작한다. 기나긴 200km…', special:'trap_cheonghak'},
  // 8번: 진천 — 닥터 오의 퀴즈로 태양열부스터 업그레이드
  {n:'진천',region:'충청',bg:'industrial',hist:'☀️ 진천 태양광단지! 닥터 오 박사가 사과즙을 태양열로 강화해 준다고 한다.', special:'jinchon'},
  {n:'대구',region:'경상',bg:'city',     hist:'🍎 대구! 사과와 섬유의 도시. 팔공산이 도시를 감싸고 있다.'},
  // 2번: 일본 신규 지역 (부산에서 페리로만 진입 가능, region:'일본'으로 구분)
  {n:'후쿠오카',region:'일본',bg:'coast',    hist:'🇯🇵 후쿠오카! 페리 항구에 도착했다. 돈코츠 라멘 향이 진동한다.'},
  {n:'오사카',  region:'일본',bg:'industrial',hist:'🇯🇵 오사카! 도톤보리 글리코 간판이 눈에 들어온다. 타코야키 굽는 냄새가 난다.'},
  {n:'교토',    region:'일본',bg:'mountain', hist:'🇯🇵 교토! 후시미이나리의 천 개의 도리이가 산을 덮고 있다. 시간이 멈춘 듯하다.'},
  {n:'도쿄',    region:'일본',bg:'industrial',hist:'🇯🇵 도쿄! 시부야 스크램블 교차로! 인파 속에서도 자전거 한 대가 우뚝 서 있다.'},
  {n:'삿포로',  region:'일본',bg:'snow',     hist:'🇯🇵 삿포로! 눈으로 덮인 도시. 징기스칸(양고기구이)과 미소라멘이 손짓한다.'},
];

// ── 탈것 (v4.1 확장: 자전거→킥보드→오토바이→닌자→하야부사→차량 라인) ──
const VEHS=[
  // 자전거 30단계 업그레이드 트리 (전부 cat:'bike')
  {id:'v1',  n:'세발자전거',           cat:'bike', sp:6,   hb:0,  km:0,      cost:0,         owned:true},
  {id:'v2',  n:'보조바퀴 2개',         cat:'bike', sp:9,   hb:2,  km:50,     cost:20000,     owned:false},
  {id:'v3',  n:'보조바퀴 1개',         cat:'bike', sp:13,  hb:4,  km:150,    cost:40000,     owned:false},
  {id:'v4',  n:'아동용 두발자전거',     cat:'bike', sp:17,  hb:6,  km:300,    cost:70000,     owned:false},
  {id:'v5',  n:'16인치 어린이 BMX',     cat:'bike', sp:21,  hb:8,  km:500,    cost:110000,    owned:false},
  {id:'v6',  n:'20인치 MTB',           cat:'bike', sp:25,  hb:10, km:800,    cost:160000,    owned:false},
  {id:'v7',  n:'24인치 하이브리드',     cat:'bike', sp:30,  hb:12, km:1200,   cost:230000,    owned:false},
  {id:'v8',  n:'알루미늄 로드바이크',   cat:'bike', sp:35,  hb:14, km:1700,   cost:320000,    owned:false},
  {id:'v9',  n:'크로스바이크',         cat:'bike', sp:40,  hb:16, km:2400,   cost:440000,    owned:false},
  {id:'v10', n:'그래블 바이크',         cat:'bike', sp:46,  hb:18, km:3300,   cost:600000,    owned:false},
  {id:'v11', n:'입문용 카본 로드',      cat:'bike', sp:52,  hb:20, km:4500,   cost:820000,    owned:false},
  {id:'v12', n:'엔듀로 MTB',           cat:'bike', sp:58,  hb:22, km:6000,   cost:1100000,   owned:false},
  {id:'v13', n:'올라운드 로드',         cat:'bike', sp:65,  hb:24, km:8000,   cost:1500000,   owned:false},
  {id:'v14', n:'에어로 로드바이크',     cat:'bike', sp:72,  hb:26, km:10500,  cost:2000000,   owned:false},
  {id:'v15', n:'경량 클라이밍 로드',    cat:'bike', sp:80,  hb:28, km:13500,  cost:2700000,   owned:false},
  {id:'v16', n:'고성능 풀서스 MTB',     cat:'bike', sp:88,  hb:30, km:17000,  cost:3600000,   owned:false},
  {id:'v17', n:'타임트라이얼 바이크',   cat:'bike', sp:97,  hb:32, km:21000,  cost:4800000,   owned:false},
  {id:'v18', n:'슈퍼라이트 로드',       cat:'bike', sp:106, hb:34, km:26000,  cost:6300000,   owned:false},
  {id:'v19', n:'카본 픽시 (고정기어)',  cat:'bike', sp:116, hb:36, km:32000,  cost:8200000,   owned:false},
  {id:'v20', n:'장거리 투어링 바이크',  cat:'bike', sp:126, hb:38, km:39000,  cost:10500000,  owned:false},
  {id:'v21', n:'고급 그래블',           cat:'bike', sp:137, hb:40, km:47000,  cost:13500000,  owned:false},
  {id:'v22', n:'프로급 에어로 로드',    cat:'bike', sp:149, hb:42, km:56000,  cost:17500000,  owned:false},
  {id:'v23', n:'울트라라이트 클라이밍', cat:'bike', sp:162, hb:44, km:67000,  cost:23000000,  owned:false},
  {id:'v24', n:'커스텀 핸드메이드',     cat:'bike', sp:176, hb:46, km:80000,  cost:30000000,  owned:false},
  {id:'v25', n:'프리미엄 E-어시스트',   cat:'bike', sp:191, hb:48, km:95000,  cost:40000000,  owned:false},
  {id:'v26', n:'하이엔드 카본 레이스',  cat:'bike', sp:207, hb:50, km:113000, cost:53000000,  owned:false},
  {id:'v27', n:'슈퍼라이트 풀커스텀',   cat:'bike', sp:224, hb:52, km:134000, cost:70000000,  owned:false},
  {id:'v28', n:'에어로 익스트림',       cat:'bike', sp:242, hb:54, km:160000, cost:92000000,  owned:false},
  {id:'v29', n:'임복동의 황금로드',     cat:'bike', sp:280, hb:58, km:200000, cost:130000000, owned:false},
  {id:'v30', n:'임복동 전설의 서퍼티지',cat:'bike', sp:350, hb:64, km:280000, cost:200000000, owned:false},
  // 1회용 특수 (나로호발사센터 전용)
  {id:'rocket', n:'임복동1호 🚀', cat:'rocket',sp:500, hb:0,  km:0,     cost:80000,    owned:false, oneshot:true},
];

// NPC 등급 시스템: normal(일반) / rare(레어) / unique(유니크) / legend(전설) / epic(에픽) / god(신) / disaster(재앙)
const GRADE_LABEL={normal:'일반',rare:'레어',unique:'유니크',legend:'전설',epic:'에픽',god:'신',disaster:'☠️재앙'};
const GRADE_COLOR={normal:'#6B4A2A',rare:'#1565C0',unique:'#2E7D32',legend:'#F9A825',epic:'#6A1B9A',god:'#B8860B',disaster:'#5D0303'};
const GRADE_BG   ={normal:'#F5E6C8',rare:'#E3F2FD',unique:'#E8F5E9',legend:'#FFFDE7',epic:'#F3E5F5',god:'#FFF8E1',disaster:'#3D0000'};
// #4 NPC 재회 — 이미 만난 NPC가 다시 등장할 때 주는 축소 보상(첫 만남의 약 1/10). 재앙 제외.
const REUNION_MONEY={normal:600,rare:1500,unique:3000,legend:8000,epic:15000,god:30000};
const REUNION_LINES=['또 만났네! 반가워 복동아!','어? 그때 그 라이더 아니야?','세상 참 좁다~ 여기서 또 보네!','오랜만이야! 여행은 잘 하고 있어?','복동이다! 잘 지냈어?','길에서 또 마주치다니 인연이네~'];

const NPC_EMOJI={
  // 일반 10
  reporter:'📰',chef:'🍳',curator:'🏛️',cyclist:'🚴',grandpa:'👴',
  student:'📚',fisherman:'🎣',monk:'🙏',mechanic:'🔧',busker:'🎺',
  // 레어 10
  influencer:'📹',dropout:'🌱',ferryman:'⛵',inventor:'⚙️',
  ghostwriter:'✍️',veteran:'🎖️',shaman:'🪬',traveler:'🌍',
  photographer:'📷',coach:'🏋️',
  // 유니크 10
  km2:'⚔️',trucker:'🚛',folksinger:'🪗',hermit:'🏔️',
  gambler:'🃏',chemist:'🧪',ranger:'🌲',pilot:'✈️',
  diver:'🤿',biker:'🏍️',
  // 전설 9 (락둥이·마충구·경키·기우기·할망·모도·섹사·거북긔·브라질리언)
  rk:'🎸',mc:'💼',ky:'🎮',gu:'☔',hm:'🌾',md:'🗺️',sx:'🎒',tk:'🐢',br:'🎵',
  // 에픽 4 (편의점그녀·아트·리주노·임연수)
  cv:'🏪',at:'💧',rj:'😤',ly:'📖',
  // 신 1
  mb:'🖤',
  // 재앙 (7대죄)
  fred:'💸', wrath:'😡', sloth:'😴', envy:'😒', gluttony:'🍴', pride:'🦚', lust:'💋',
  // 일본
  sushi:'🍣', samurai:'⚔️', mangaka:'✏️', yakuza:'🐉', kimri:'🤺',
  // 진천 박사
  drO:'👩‍🔬',
};

const NPCS=[
  // ═══════════════ 일반 10명 (점수: 3K~30K) ═══════════════
  {id:'reporter',grade:'normal',n:'정기자',role:'지역 신문 기자',met:false,
    reward:'XP+50, ₩10,000',
    lines:['혹시 인터뷰 한 마디만 해도 될까요?','세발자전거 세계일주... 이거 기사 되겠는데요!'],
    eff:s=>{s.xp+=50;s.money+=10000;}},
  {id:'chef',grade:'normal',n:'박사장',role:'도로변 맛집 사장',met:false,
    reward:'체력+30, ₩8,000',
    lines:['어이 총각! 우리 집 음식 한 번 먹어봐요~','손님 없는 날인데 공짜로 드릴게. 힘내!'],
    eff:s=>{s.hp=Math.min(s.mhp,s.hp+30);s.money+=8000;}},
  {id:'curator',grade:'normal',n:'최학예사',role:'문화재 관리인',met:false,
    reward:'XP+80, ₩5,000',
    lines:['이 유적지를 지나가시는군요. 잠깐 설명해 드릴까요?','역사를 알고 달리면 더 깊이 보입니다.'],
    eff:s=>{s.xp+=80;s.money+=5000;}},
  {id:'cyclist',grade:'normal',n:'김라이더',role:'동네 사이클러',met:false,
    reward:'XP+50, 부스터+10초, ₩5,000',
    lines:['어이! 세발자전거? 나랑 같이 달려볼래?','자전거는 속도보다 꾸준함이야. 화이팅!'],
    eff:s=>{s.xp+=50;s.money+=5000;s.dopT=Math.max(s.dopT,10);}},
  {id:'grandpa',grade:'normal',n:'이어르신',role:'마을 어르신',met:false,
    reward:'₩15,000',
    lines:['어허~ 저 밑에 샛길로 가면 빠른겨.','젊은이! 이 근처에 숨겨진 맛집 알려줄까?'],
    eff:s=>{s.money+=15000;}},
  {id:'student',grade:'normal',n:'오수생',role:'고시 준비 중인 청년',met:false,
    reward:'XP+60, ₩3,000',
    lines:['...나도 가끔 이렇게 도망치고 싶어.','여행이 부럽다. 나중에 나도 꼭.'],
    eff:s=>{s.xp+=60;s.money+=3000;}},
  {id:'fisherman',grade:'normal',n:'한어부',role:'해안 어부',met:false,
    reward:'체력+25, ₩10,000',
    lines:['어이 지나가는 양반! 고등어 한 마리 줄까?','이 바다, 참 좋지 않소? 나는 평생 여기야.'],
    eff:s=>{s.hp=Math.min(s.mhp,s.hp+25);s.money+=10000;}},
  {id:'monk',grade:'normal',n:'도반스님',role:'산사의 스님',met:false,
    reward:'체력+30, XP+50',
    lines:['비우면 더 빠르게 갈 수 있소.','이 길, 어디로 가는지보다 어떻게 가는지가 중요하오.'],
    eff:s=>{s.hp=Math.min(s.mhp,s.hp+30);s.xp+=50;}},
  {id:'mechanic',grade:'normal',n:'정비사',role:'도로변 정비소 아저씨',met:false,
    reward:'체력+20, ₩7,000',
    lines:['어 세발자전거! 타이어 상태 봐드릴까요?','공기압 좀 넣어드릴게요. 공짜!'],
    eff:s=>{s.hp=Math.min(s.mhp,s.hp+20);s.money+=7000;}},
  {id:'busker',grade:'normal',n:'노상버스커',role:'거리 음악가',met:false,
    reward:'체력+20, XP+40, ₩4,000',
    lines:['잠깐! 여행자를 위해 한 곡 쳐드릴게요.','음악은 어디서든 사람을 살게 해요.'],
    eff:s=>{s.hp=Math.min(s.mhp,s.hp+20);s.xp+=40;s.money+=4000;}},

  // ═══════════════ 레어 10명 (점수: 50K~150K) ═══════════════
  {id:'influencer',grade:'rare',n:'강인플루',role:'백만 구독 여행 유튜버',met:false,
    reward:'₩100,000, XP+150',
    lines:['오 이건 대박 콘텐츠다! 같이 콜라보해요!','구독자들이 세발자전거 보고 난리났어요 ㅋㅋ'],
    eff:s=>{s.money+=100000;s.xp+=150;}},
  {id:'dropout',grade:'rare',n:'전직CEO',role:'귀농한 전직 대표',met:false,
    reward:'₩80,000, XP+100',
    lines:['저도 한때는 스타트업 대표였죠. 지금은 이게 더 좋아요.','돈보다 시간이 귀하다는 걸 늦게 깨달았어요.'],
    eff:s=>{s.money+=80000;s.xp+=100;}},
  {id:'ferryman',grade:'rare',n:'뱃사공',role:'나룻배 사공',met:false,
    reward:'₩50,000, 구간 +30km',
    lines:['어서 오시오. 저 강 건너갈 거요?','내가 지름길 하나 알려드릴게요.'],
    eff:s=>{s.money+=50000;s.sgKm=Math.min(s.sgTot,s.sgKm+30);}},
  {id:'inventor',grade:'rare',n:'발명가 강씨',role:'기묘한 발명가',met:false,
    reward:'₩70,000, 부스터 60초',
    lines:['세발자전거에 로켓 달아드릴까요? (진심)','이 고체연료만 있으면 속도 두 배도 가능해요.'],
    eff:s=>{s.money+=70000;s.dopT=Math.max(s.dopT,60);}},
  {id:'ghostwriter',grade:'rare',n:'무명작가',role:'길 위의 작가',met:false,
    reward:'₩60,000, XP+200',
    lines:['당신 이야기, 소설로 써도 될까요?','여행자와 작가는 본질적으로 같아요.'],
    eff:s=>{s.money+=60000;s.xp+=200;}},
  {id:'veteran',grade:'rare',n:'참전용사',role:'한국전쟁 생존자',met:false,
    reward:'체력 완전회복, ₩80,000, XP+120',
    lines:['젊은 양반, 이 나라 돌아다니는 거 잘하는 거요.','우리 때는 이 땅을 지키려고 달렸지.'],
    eff:s=>{s.hp=s.mhp;s.money+=80000;s.xp+=120;}},
  {id:'shaman',grade:'rare',n:'무당 할머니',role:'신기한 점쟁이',met:false,
    reward:'랜덤 ₩50,000~₩200,000',
    lines:['어이구 이 아이... 큰 여정이 보이네.','(쑥불을 피우며) 조심할 구간이 하나 있어.'],
    eff:s=>{const w=50000+Math.floor(Math.random()*150000);s.money+=w;s.xp+=100;addLog('good','무당: ₩'+w.toLocaleString()+' + XP+100');}},
  {id:'traveler',grade:'rare',n:'세계여행자',role:'80개국 백팩커',met:false,
    reward:'₩90,000, XP+150',
    lines:['오! 세발자전거 일주? 내가 본 것 중 제일 특이한 여행이야!','나도 처음엔 무전여행이었거든. 계속 해.'],
    eff:s=>{s.money+=90000;s.xp+=150;}},
  {id:'photographer',grade:'rare',n:'다큐 감독',role:'여행 다큐 감독',met:false,
    reward:'₩100,000, XP+120',
    lines:['당신 여정이 영화가 될 것 같은 예감이에요.','잠깐, 저 석양을 배경으로 한 컷만요!'],
    eff:s=>{s.money+=100000;s.xp+=120;}},
  {id:'coach',grade:'rare',n:'헬스 코치',role:'이동식 체력 트레이너',met:false,
    reward:'최대체력+15, 지구력+1, ₩30,000',
    lines:['자세가 좋은데요? 코어를 더 조여봐요!','매일 달리면 몸이 달라져요. 화이팅!'],
    eff:s=>{s.mhp+=15;s.hp=Math.min(s.hp+15,s.mhp);s.end++;s.money+=30000;}},

  // ═══════════════ 유니크 10명 (점수: 200K~400K) ═══════════════
  {id:'km2',grade:'unique',n:'방랑 검객',role:'길 위의 검사',met:false,
    reward:'₩200,000, 체력+50, 속도+2',
    lines:['...길이 너를 단련시키는 거다.','흔들리지 마라. 목적지는 반드시 있다.'],
    eff:s=>{s.money+=200000;s.hp=Math.min(s.mhp,s.hp+50);s.speed+=2;}},
  {id:'trucker',grade:'unique',n:'장거리 기사',role:'전국을 달리는 트럭 기사',met:false,
    reward:'₩280,000, 구간 +30km',
    lines:['이봐요, 저기까지 견인해드릴까요?','전국 도로는 내가 제일 잘 알죠.'],
    eff:s=>{s.money+=280000;s.sgKm=Math.min(s.sgTot,s.sgKm+30);}},
  {id:'folksinger',grade:'unique',n:'민요 할머니',role:'전통 민요를 잇는 분',met:false,
    reward:'₩200,000, 체력+40, XP+200',
    lines:['아이고, 이 노래 들어봤어요?','(아리랑을 흥얼거리며) 힘내요, 젊은이.'],
    eff:s=>{s.money+=200000;s.hp=Math.min(s.mhp,s.hp+40);s.xp+=200;}},
  {id:'hermit',grade:'unique',n:'산신령 할배',role:'산속에 사는 기인',met:false,
    reward:'₩300,000, XP+300',
    lines:['허허, 인연이 있어야 보이는 길이 있지.','저 산 너머에 지름길이 있다네.'],
    eff:s=>{s.money+=300000;s.xp+=300;s.sgKm=Math.min(s.sgTot,s.sgKm+15);}},
  {id:'gambler',grade:'unique',n:'도박사',role:'운을 믿는 사람',met:false,
    reward:'₩100,000~₩500,000',
    lines:['인생은 도박이야. 베팅해볼래?','(주사위를 굴리며) 결과는 신만 알지.'],
    eff:s=>{const w=100000+Math.floor(Math.random()*5)*100000;s.money+=w;addLog(w>=300000?'good':'neutral','도박사: ₩'+w.toLocaleString()+(w>=300000?' 대박!':''));}},
  {id:'chemist',grade:'unique',n:'약초 약사',role:'산야초로 약을 만드는 분',met:false,
    reward:'체력 완전회복, 🍎+3, ₩200,000',
    lines:['이 약초를 달여 드세요. 효과 보장이에요.','자연에 없는 약은 없답니다.'],
    eff:s=>{s.hp=s.mhp;s.ap+=3;s.money+=200000;}},
  {id:'ranger',grade:'unique',n:'숲 레인저',role:'국립공원 자연 해설사',met:false,
    reward:'₩220,000, XP+250, 체력+30',
    lines:['이 길 안전하게 안내해드릴게요.','자연을 느끼며 달려야 진짜 여행이에요.'],
    eff:s=>{s.money+=220000;s.xp+=250;s.hp=Math.min(s.mhp,s.hp+30);}},
  {id:'pilot',grade:'unique',n:'전직 파일럿',role:'은퇴한 항공기 조종사',met:false,
    reward:'₩400,000, SP+1',
    lines:['속도보다 방향이 중요해요.','하늘에서 봐도 한국은 참 아름다워요.'],
    eff:s=>{s.money+=400000;s.sp++;}},
  {id:'diver',grade:'unique',n:'해녀 할머니',role:'40년 경력 해녀',met:false,
    reward:'체력+50, ₩280,000',
    lines:['바다는 버텨야 보상을 줘요.','숨 참는 것처럼, 힘든 걸 참아야 해.'],
    eff:s=>{s.hp=Math.min(s.mhp,s.hp+50);s.money+=280000;}},
  {id:'biker',grade:'unique',n:'할리 라이더',role:'전국 투어링 바이커',met:false,
    reward:'₩250,000, XP+150, 부스터+30초',
    lines:['그 세발자전거, 엔진 달아드릴까요?','도로는 달리는 자의 것이에요!'],
    eff:s=>{s.money+=250000;s.xp+=150;s.dopT=Math.max(s.dopT,30);}},

  // ═══════════════ 전설 9명 (점수: 500K~800K) ═══════════════
  {id:'rk',grade:'legend',n:'락둥이',role:'음악 하는 친구',met:false,
    reward:'₩500,000, XP+300, 체력+50',
    lines:['야 복동아! 각자의 리듬대로 가는 거야.','느려도 괜찮아. 네 박자가 맞아.'],
    eff:s=>{s.money+=500000;s.xp+=300;s.hp=Math.min(s.mhp,s.hp+50);}},
  {id:'mc',grade:'legend',n:'마충구',role:'바쁘게 사는 친구',met:false,
    reward:'₩700,000',
    lines:['너 그러다 일 안 해도 돼?','처리할 게 산더미인데... 부럽다 진짜.'],
    eff:s=>{s.money+=700000;}},
  {id:'ky',grade:'legend',n:'경키',role:'장난기 많은 친구',met:false,
    reward:'₩550,000, XP+400',
    lines:['야야야 카메라 있다 손 흔들어!','세발자전거 일주? 멋있긴 하다 진짜 ㅋㅋ'],
    eff:s=>{s.money+=550000;s.xp+=400;}},
  {id:'gu',grade:'legend',n:'기우기',role:'신중한 친구',met:false,
    reward:'₩600,000, 체력-20',
    lines:['나 근처 오면 날씨가... 미안.','그래도 조심히 가. 규정상 부탁이야.'],
    eff:s=>{s.money+=600000;s.hp=Math.max(10,s.hp-20);}},
  {id:'hm',grade:'legend',n:'할망',role:'넉넉한 어르신',met:false,
    reward:'풀회복, 🍎+5, ₩500,000',
    lines:['밥은 먹었어? 이거 가져가.','느리게 가도 돼. 급하면 더 힘들어.'],
    eff:s=>{s.hp=s.mhp;s.ap+=5;s.money+=500000;}},
  {id:'md',grade:'legend',n:'모도',role:'대머리 독수리 — 美 정착 친구',met:false,
    reward:'₩650,000',
    lines:['(영어 섞어가며) 야 복동, 한국 진짜 좁다 ㅋㅋ','미국 가정·집·학벌은 다 얻었는데... 뭔가 잃은 기분이야.','(잠시 침묵) 너 같이 자유롭게 달리는 게 부럽다, 진짜.'],
    eff:s=>{s.money+=650000;}},
  {id:'sx',grade:'legend',n:'섹사',role:'활동적인 친구',met:false,
    reward:'협찬 ₩750,000',
    lines:['이 장면 너무 좋다. 사진 한 장!','세발자전거 일주, 이야기 되겠는데?'],
    eff:s=>{s.money+=750000;}},
  {id:'tk',grade:'legend',n:'거북긔',role:'묵묵한 친구',met:false,
    reward:'₩500,000, XP+500',
    lines:['나보다는 빠르네...','우린 우리 속도로 가는 거야.'],
    eff:s=>{s.money+=500000;s.xp+=500;}},
  {id:'br',grade:'legend',n:'브라질리언',role:'자유로운 친구',met:false,
    reward:'₩550,000, XP+300, 부스터+30초',
    lines:['같이 달리자, 이 길 진짜 좋다!','음악이 있는 곳이면 어디든~'],
    eff:s=>{s.money+=550000;s.xp+=300;s.dopT=Math.max(s.dopT,30);}},

  // ═══════════════ 에픽 4명 (점수: 1M~1.5M) ═══════════════
  {id:'cv',grade:'epic',n:'편의점 그녀',role:'오래 전 알던 사람',met:false,
    reward:'풀회복, 🍎+5, ₩1,000,000',
    special:'편의점 불빛 아래, 그 사람이 서 있었다.',
    lines:['...안녕. 잘 지냈어?','(잠시 눈이 마주친다) 어... 그래. 잘 지냈어.','여기서 만날 줄은 몰랐는데.','(음료를 건네며) 조심해서 가.'],
    eff:s=>{s.hp=s.mhp;s.ap+=5;s.money+=1000000;}},
  {id:'at',grade:'epic',n:'아트',role:'집중력 있는 친구',met:false,
    reward:'₩1,200,000, 지구력+2, 체력+50',
    lines:['봐봐... (물 회오리) 집중되지?','반복하다 보면 통하는 게 있어.'],
    eff:s=>{s.money+=1200000;s.end+=2;s.hp=Math.min(s.mhp,s.hp+50);}},
  {id:'rj',grade:'epic',n:'리주노',role:'감수성 풍부한 친구',met:false,
    reward:'기분따라 ₩500,000~₩2,000,000',
    lines:['...그냥 지나가려고 했는데.','(침묵) ...무사히 가. 그거면 돼.','(등을 보이며) ...잘 가.'],
    eff:s=>{if(Math.random()<.5){s.money+=2000000;s.xp+=500;addLog('good','리주노 기분 최고! ₩2,000,000+XP');}else{s.money+=500000;s.hp=Math.max(5,s.hp-30);addLog('bad','리주노 침묵... ₩500,000 받지만 체력-30');}}},
  {id:'ly',grade:'epic',n:'임연수',role:'생각 많은 친구',met:false,
    reward:'₩1,500,000, XP+400, SP+1',
    lines:['임씨끼리 만나네. 세상 좁아.','여행 끝나면 어떤 사람이 될 것 같아?','...나도 언젠간 이렇게 떠나볼게.'],
    eff:s=>{s.money+=1500000;s.xp+=400;s.sp++;}},

  // ═══════════════ 재앙 NPC (전설 확률, 7대죄 컨셉) ═══════════════
  {id:'fred', grade:'disaster', n:'탐욕의 프레드', role:'7대죄 #1 — 욕망의 화신', met:false,
    reward:'⚠️ 재앙: 소지금 1% + 100km마다 0.5% × 1000km',
    lines:['...어어, 이 거지같은 자전거 진짜 멋지네.','(미소 지으며) 잠깐 좀 빌려줄래? 잠깐만...','(돌려주며) 어차피 너도 지나갈 거잖아.'],
    eff:s=>{
      const loss = Math.floor(s.money * 0.01);
      s.money = Math.max(0, s.money - loss);
      s.disasterFred = {kmStart: s.totKm, lossPct: 0.005, lastTickKm: s.totKm};
      addLog('bad','💸 탐욕의 프레드: 즉시 ₩'+loss.toLocaleString()+' 약탈! 향후 1000km 동안 100km마다 추가 약탈!');
    }},
  {id:'wrath', grade:'disaster', n:'분노의 상수', role:'7대죄 #2 — 격노의 화신', met:false,
    reward:'⚠️ 3분간 속도 +50% / 체력 소모 ↑',
    lines:['화가난다!!','(주먹을 쥐며) 다 부숴버리고 싶어!!','이 분노로 미친듯이 달려라!!'],
    eff:s=>{
      s.wrathUntil = Date.now() + 180000;
      addLog('bad','😡 분노의 상수: "화가난다!!" 3분간 속도 +50% but 체력 소모 ↑');
    }},
  {id:'sloth', grade:'disaster', n:'나태의 노무', role:'7대죄 #3 — 게으름의 화신', met:false,
    reward:'⚠️ 5분간 부스터 사용 불가',
    lines:['그냥 자…','(하품) 부스터? 귀찮아…','(이불을 덮으며) 5분만…'],
    eff:s=>{
      s.slothUntil = Date.now() + 300000;
      s.dopT = 0;
      addLog('bad','😴 나태의 노무: "그냥 자…" 5분간 부스터 사용 불가!');
    }},
  {id:'envy', grade:'disaster', n:'시기의 짐승', role:'7대죄 #4 — 질투의 화신', met:false,
    reward:'⚠️ 3분간 체력 회복 아이템 사용 불가',
    lines:['초딩이 왜 키가 커…','(이를 갈며) 너만 잘 나가나봐?','(노려보며) 사과? 사과즙? 너만 먹게 둘 줄 알아?'],
    eff:s=>{
      s.envyUntil = Date.now() + 180000;
      addLog('bad','😒 시기의 짐승: "초딩이 왜 키가 커…" 3분간 체력 회복 아이템 사용 불가!');
    }},
  {id:'gluttony', grade:'disaster', n:'식탐의 찐기욱', role:'7대죄 #5 — 폭식의 화신', met:false,
    reward:'⚠️ 보유 사과/사과즙 즉시 증발',
    lines:['데스토…','(먹방 카메라를 들이대며) 이거 다 내 거다.','(쩝쩝) 너 거 아냐, 내 거.'],
    eff:s=>{
      const apLost = s.ap; const jcLost = s.jc;
      s.ap = 0; s.jc = 0;
      addLog('bad','🍴 식탐의 찐기욱: "데스토…" 사과 '+apLost+'개, 사과즙 '+jcLost+'개 증발!');
    }},
  {id:'pride', grade:'disaster', n:'교만의 가오지훈', role:'7대죄 #6 — 자만의 화신', met:false,
    reward:'⚠️ 다음 도시 도착 보상 -90%',
    lines:['어디 자전거가 감히…','(코웃음) 세발자전거? 그게 탈것이야?','(머리를 넘기며) 너 같은 거랑 같은 길 쓰기도 싫어.'],
    eff:s=>{
      s.prideNextCity = true;
      addLog('bad','🦚 교만의 가오지훈: "어디 자전거가 감히…" 다음 도시 보상 -90%');
    }},
  {id:'lust', grade:'disaster', n:'색욕의 쾌락체', role:'7대죄 #7 — 욕정의 화신', met:false,
    reward:'⚠️ 3분간 의욕 상실 — 속도 -50%',
    lines:['널 가지겠어..ㅋ','(추파를 던지며) 자전거 말고 내 차 타볼래?','(다리를 꼬며) 그렇게 빨리 가지 마…'],
    eff:s=>{
      s.lustUntil = Date.now() + 180000;
      addLog('bad','💋 색욕의 쾌락체: "널 가지겠어..ㅋ" 3분간 속도 -50%');
    }},

  // ═══════════════ 신 1명 (점수: 3M+) ═══════════════
  {id:'mb',grade:'god',n:'MR.블랙',role:'정체불명의 인물',met:false,
    reward:'풀회복, ₩3,000,000, SP+5, XP+1000',
    lines:['...잘 가고 있군.','버그는 없지?','이 길... 꼭 끝까지 가봐.','(사라지기 전에) ...잘 만들었지?'],
    eff:s=>{s.money+=3000000;s.hp=s.mhp;s.sp+=5;s.xp+=1000;}},

  // ═══════════════ 8번: 진천 닥터 오 (특수 — 직접 모달 호출) ═══════════════
  {id:'drO', grade:'unique', n:'닥터 오', role:'진천 태양광단지 박사 (퀴즈 출제자)', met:false, locked:true,
    reward:'태양열 부스터 업그레이드',
    lines:['반가워요. 사과즙을 태양열로 강화해드릴게요.','단, 퀴즈를 맞춰야 해요.'],
    eff:s=>{}},

  // ═══════════════ 일본 NPC 5명 ═══════════════
  {id:'sushi', grade:'rare', n:'스시 장인', role:'도쿄 60년 경력 스시 마스터', met:false,
    reward:'₩90,000, 체력+30',
    lines:['(생선을 자르며) 60년... 같은 동작만 반복했지.','한 번에 한 점, 그게 인생이야.'],
    eff:s=>{s.money+=90000;s.hp=Math.min(s.mhp,s.hp+30);}},
  {id:'samurai', grade:'unique', n:'사무라이 노인', role:'교토의 마지막 검객', met:false,
    reward:'₩250,000, XP+200',
    lines:['(검을 닦으며) 길은 마음에 있다.','네 자전거에서... 무사의 결의가 보이는군.'],
    eff:s=>{s.money+=250000;s.xp+=200;}},
  {id:'mangaka', grade:'rare', n:'만화가 다나카', role:'주간 연재 작가', met:false,
    reward:'₩70,000, XP+150, 부스터+20초',
    lines:['오! 너 캐릭터 좋다! 다음 화에 출연해줄래?','(연필을 휘갈기며) 마감... 마감이야...'],
    eff:s=>{s.money+=70000;s.xp+=150;s.dopT=Math.max(s.dopT,20);}},
  {id:'yakuza', grade:'unique', n:'야쿠자 두목', role:'오사카 도톤보리 보스', met:false,
    reward:'₩400,000, 체력+40',
    lines:['(문신을 보이며) 형씨, 조선에서 왔다고?','우리 영역 지나가는 거 봐줄게. 이거 받아.'],
    eff:s=>{s.money+=400000;s.hp=Math.min(s.mhp,s.hp+40);}},
  {id:'kimri', grade:'legend', n:'검도왕 김리', role:'한국 검도 국가대표', met:false,
    reward:'₩600,000, XP+400, 부스터+40초',
    lines:['죽도를 잡던 손으로 핸들을 잡아봤네. 제법인걸?','기(氣)·검(劍)·체(體)! 자네 페달링에 검도의 호흡이 실렸군!'],
    eff:s=>{s.money+=600000;s.xp+=400;s.dopT=Math.max(s.dopT,40);}},
];

// ── 3번: 지역별 OX 퀴즈 (각 지역 3문제) ────────────────
const OX_BY_CITY={
  '충주':[
    {q:'충주 탄금대는 우륵이 가야금을 연주한 곳이다.',a:true,ex:'신라시대 우륵의 가야금 유적'},
    {q:'충주는 고구려·백제·신라 삼국이 모두 차지한 적이 있다.',a:true,ex:'삼국 모두 전략적 요충지로 활용'},
    {q:'충주의 사과는 일제강점기에 처음 재배되었다.',a:true,ex:'1900년대 초 도입'},
  ],
  '제천':[
    {q:'의림지는 삼한시대에 축조된 저수지다.',a:true,ex:'국내에서 가장 오래된 저수지 중 하나'},
    {q:'제천은 청풍문화재단지로 유명하다.',a:true,ex:'충주댐 수몰 후 문화재 이전 보존'},
    {q:'의림지는 조선 세종이 만들었다.',a:false,ex:'삼한시대(약 2000년 전) 축조'},
  ],
  '강릉':[
    {q:'오죽헌은 신사임당과 율곡 이이의 생가다.',a:true,ex:'어머니와 아들이 모두 태어난 곳'},
    {q:'강릉 단오제는 유네스코 인류무형문화유산이다.',a:true,ex:'2005년 등재'},
    {q:'경포대는 신라시대에 처음 지어졌다.',a:false,ex:'고려시대 1326년 창건'},
  ],
  '속초':[
    {q:'설악산 신흥사는 통일신라시대에 창건되었다.',a:true,ex:'652년 자장율사 창건'},
    {q:'속초는 한국전쟁 후 실향민들이 정착한 도시다.',a:true,ex:'아바이마을이 그 흔적'},
    {q:'설악산은 한라산보다 높다.',a:false,ex:'설악산 1708m, 한라산 1947m'},
  ],
  '고성':[
    {q:'건봉사는 임진왜란 때 사명대사가 주둔한 사찰이다.',a:true,ex:'호국 사찰의 대표'},
    {q:'고성은 남북한이 같은 이름으로 분단된 군이다.',a:true,ex:'강원도 고성군 / 북한 고성군'},
    {q:'통일전망대에서는 금강산이 보인다.',a:true,ex:'맑은 날 금강산 1만 2천봉이 보임'},
  ],
  '포항':[
    {q:'포항제철소는 박정희 정부 때 건설되었다.',a:true,ex:'1968년 착공, 1973년 가동'},
    {q:'포항 호미곶은 한반도에서 해가 가장 빨리 뜨는 곳이다.',a:true,ex:'독도 다음으로 빠름'},
    {q:'흥해읍성은 조선시대에 처음 축조되었다.',a:false,ex:'고려시대부터 존재'},
  ],
  '부산':[
    {q:'부산은 한국전쟁 당시 임시수도였다.',a:true,ex:'1950~53년 피란수도'},
    {q:'자갈치시장은 1950년대부터 형성되었다.',a:true,ex:'전쟁 피란민들이 시작'},
    {q:'해운대는 신라시대 최치원이 이름을 붙였다.',a:true,ex:'고운(孤雲)이 머문 곳'},
  ],
  '대구':[
    {q:'대구는 조선시대 경상감영이 있던 행정 중심지였다.',a:true,ex:'경상도를 다스리던 감영 소재지'},
    {q:'대구 사과는 기후변화로 재배 북상 전 대표 산지였다.',a:true,ex:'"대구 능금"으로 유명했음'},
    {q:'2·28 민주운동은 대구에서 시작된 학생 시위다.',a:true,ex:'1960년 4·19의 도화선'},
  ],
  '여수':[
    {q:'진남관은 이순신 장군의 전라좌수영 본영이다.',a:true,ex:'국보 304호'},
    {q:'여수는 2012년 세계박람회를 개최했다.',a:true,ex:'EXPO 2012 여수'},
    {q:'여수 거북선은 이순신이 처음 만들었다.',a:false,ex:'고려시대부터 존재, 이순신이 개량'},
  ],
  '목포':[
    {q:'목포는 일제강점기 호남 곡식 수탈의 중심지였다.',a:true,ex:'쌀 수탈 항구'},
    {q:'유달산에서 이순신이 임진왜란 때 주둔했다.',a:true,ex:'노적봉에 의병 위장'},
    {q:'목포 갓바위는 인공으로 만든 조형물이다.',a:false,ex:'8천만년 전 자연 형성된 천연기념물'},
  ],
  '군산':[
    {q:'군산은 일제강점기 미곡 반출항으로 번성했다.',a:true,ex:'근대문화유산 도시'},
    {q:'군산 경암동 철길마을은 폐선된 철길이다.',a:true,ex:'2008년 운행 중단'},
    {q:'군산은 조선시대부터 큰 항구였다.',a:false,ex:'개항(1899)으로 본격 발전'},
  ],
  '태안':[
    {q:'백화산성은 백제시대 산성 유적이다.',a:true,ex:'당나라 침략 대비 축조'},
    {q:'태안 안면도는 원래 섬이 아니었다.',a:true,ex:'1638년 운하로 분리'},
    {q:'2007년 태안 기름유출 사고 때 자원봉사자만 100만 명이 모였다.',a:true,ex:'국민적 복구 활동'},
  ],
  '인천':[
    {q:'인천상륙작전은 1950년 9월 15일에 단행됐다.',a:true,ex:'맥아더 장군 지휘'},
    {q:'인천은 1883년 강제 개항된 항구다.',a:true,ex:'조일통상장정 체결'},
    {q:'차이나타운은 일제강점기에 형성됐다.',a:false,ex:'개항 직후 1884년부터 형성'},
  ],
  '서울':[
    {q:'경복궁은 조선 태조 이성계가 건립했다.',a:true,ex:'1395년 한양 천도와 함께'},
    {q:'한글은 세종대왕이 직접 창제했다.',a:true,ex:'1443년 훈민정음'},
    {q:'남산 N서울타워는 1969년에 완공됐다.',a:true,ex:'송신탑이 후 관광지로'},
  ],
  '나로호발사센터':[
    {q:'나로호는 한국 최초의 우주발사체다.',a:true,ex:'2013년 1월 30일 발사 성공'},
    {q:'나로우주센터는 전라남도 고흥에 있다.',a:true,ex:'외나로도 위치'},
    {q:'한국은 누리호 발사로 세계 7번째 우주강국이 됐다.',a:true,ex:'2022년 발사 성공'},
  ],
  '달':[
    {q:'달의 표면 중력은 지구의 약 1/6이다.',a:true,ex:'몸무게 60kg → 달에서 10kg'},
    {q:'달은 지구로부터 약 38만 km 떨어져 있다.',a:true,ex:'평균 384,400 km'},
    {q:'한국에는 달에 토끼가 산다는 설화가 있다.',a:true,ex:'옥토끼가 떡을 찧는다'},
  ],
  // 일본 도시 OX
  '후쿠오카':[
    {q:'돈코츠 라멘의 발상지는 후쿠오카다.',a:true,ex:'하카타 지방 향토 음식'},
    {q:'후쿠오카는 한국 부산과 페리로 연결된다.',a:true,ex:'약 3시간 30분 소요'},
    {q:'후쿠오카는 일본 수도다.',a:false,ex:'수도는 도쿄'},
  ],
  '오사카':[
    {q:'도톤보리의 글리코 간판은 오사카의 상징이다.',a:true,ex:'1935년부터 운영'},
    {q:'타코야키는 오사카에서 처음 만들어졌다.',a:true,ex:'1935년 아이즈야'},
    {q:'오사카성은 도쿠가와 이에야스가 지었다.',a:false,ex:'도요토미 히데요시가 건립'},
  ],
  '교토':[
    {q:'후시미이나리 신사는 천 개 이상의 도리이가 있다.',a:true,ex:'약 1만 개의 도리이'},
    {q:'교토는 1000년 이상 일본의 수도였다.',a:true,ex:'794년~1869년'},
    {q:'교토에 원자폭탄이 투하됐다.',a:false,ex:'히로시마, 나가사키'},
  ],
  '도쿄':[
    {q:'시부야 스크램블 교차로는 세계에서 가장 분주한 횡단보도 중 하나다.',a:true,ex:'한 번에 3,000명'},
    {q:'도쿄는 원래 에도(江戸)라 불렸다.',a:true,ex:'1868년 도쿄로 개칭'},
    {q:'도쿄 타워는 에펠탑보다 높다.',a:true,ex:'333m vs 330m'},
  ],
  '삿포로':[
    {q:'삿포로는 1972년 동계올림픽을 개최했다.',a:true,ex:'아시아 첫 동계올림픽'},
    {q:'삿포로 눈축제는 매년 2월에 열린다.',a:true,ex:'오도리 공원'},
    {q:'삿포로는 일본 최북단 섬 홋카이도에 있다.',a:true,ex:'홋카이도 도청 소재지'},
  ],
};
// 호환용 fallback
const OX_QS=[
  {q:'경복궁은 조선 태조 이성계가 건립했다.',a:true,ex:'1395년 태조 건립'},
];
const FOODS=[
  {c:'충주',n:'사과 막걸리',e:'🍎',type:'timing'},
  {c:'제천',n:'약초 산채정식',e:'🍲',type:'tap'},
  {c:'강릉',n:'초당순두부',e:'🥣',type:'tap'},
  {c:'속초',n:'닭강정',e:'🍱',type:'timing'},
  {c:'고성',n:'가리비찜',e:'🐚',type:'timing'},
  {c:'포항',n:'과메기',e:'🐟',type:'tap'},
  {c:'부산',n:'돼지국밥',e:'🍲',type:'timing'},
  {c:'대구',n:'막창구이',e:'🔥',type:'timing'},
  {c:'진천',n:'생거진천 쌀밥정식',e:'🍚',type:'tap'},
  {c:'여수',n:'돌게장 백반',e:'🦀',type:'tap'},
  {c:'목포',n:'홍어삼합',e:'🐙',type:'tap'},
  {c:'군산',n:'짬뽕',e:'🍜',type:'timing'},
  {c:'태안',n:'꽃게탕',e:'🦀',type:'tap'},
  {c:'인천',n:'짜장면',e:'🍝',type:'tap'},
  {c:'서울',n:'광장시장 빈대떡',e:'🥞',type:'timing'},
  // 8번: 신규 맛집 — 가위바위보 미니게임
  {c:'나로호발사센터',n:'로켓단 소굴',e:'🚀',type:'rps'},
  {c:'달',n:'원조 달토끼 떡집',e:'🌕',type:'rps'},
  // 일본 맛집 5종
  {c:'후쿠오카',n:'돈코츠 라멘',e:'🍜',type:'timing'},
  {c:'오사카', n:'타코야키',   e:'🐙',type:'tap'},
  {c:'교토',   n:'가이세키',   e:'🍱',type:'timing'},
  {c:'도쿄',   n:'에도마에 스시',e:'🍣',type:'tap'},
  {c:'삿포로', n:'징기스칸(양고기)',e:'🐑',type:'tap'},
];
const FOOD_QUIZ={
  '제천':{q:'의림지는 어느 시대 저수지?',opts:['삼한시대','고려시대','조선시대','일제시대'],ans:0},
  '고성':{q:'건봉사와 관련된 임란 인물은?',opts:['이순신','사명대사','곽재우','권율'],ans:1},
  '여수':{q:'진남관은 어떤 장군의 본영?',opts:['권율','신립','이순신','김시민'],ans:2},
  '태안':{q:'백화산성은 어느 시대 유적?',opts:['백제','신라','고려','조선'],ans:0},
  '인천':{q:'인천상륙작전 지휘관은?',opts:['아이젠하워','맥아더','패튼','리지웨이'],ans:1},
};

// ── 업적 (지역별 포함) ─────────────────────────────────
const ACHIEVEMENTS=[
  // 거리
  {id:'km100',  grp:'거리',emoji:'🚀',name:'첫 백 km',     desc:'100km 주행',        check:s=>s.totKm>=100,   rw:{money:10000,xp:50}},
  {id:'km500',  grp:'거리',emoji:'⭐',name:'오백 km',      desc:'500km 주행',        check:s=>s.totKm>=500,   rw:{money:30000,xp:100}},
  {id:'km1000', grp:'거리',emoji:'🏆',name:'천 km 돌파',   desc:'1,000km 주행',      check:s=>s.totKm>=1000,  rw:{money:50000,xp:200}},
  {id:'km5000', grp:'거리',emoji:'👑',name:'5천 km 전설',  desc:'5,000km 주행',      check:s=>s.totKm>=5000,  rw:{money:200000,xp:500}},
  {id:'km50000',grp:'거리',emoji:'💫',name:'5만 km 신화',  desc:'50,000km 주행',     check:s=>s.totKm>=50000, rw:{money:1000000,sp:5}},
  // NPC
  {id:'npc5',   grp:'NPC',emoji:'🤝',name:'사교왕 입문',   desc:'NPC 5명 만나기',    check:s=>s.npcs.filter(n=>n.met&&!n.locked).length>=5,  rw:{sp:1}},
  {id:'allnpc', grp:'NPC',emoji:'🌟',name:'인맥왕',        desc:'공개 NPC 전원 만나기',check:s=>s.npcs.filter(n=>!n.locked).every(n=>n.met),    rw:{sp:3,money:100000}},
  {id:'mrblack',grp:'NPC',emoji:'🖤',name:'신과의 조우',    desc:'MR.블랙 만나기',    check:s=>s.npcs.find(n=>n.id==='mb')?.met,  rw:{money:100000,sp:2}},
  {id:'meetcv', grp:'NPC',emoji:'🏪',name:'그 사람을 만났다',desc:'편의점 그녀 만나기',check:s=>s.npcs.find(n=>n.id==='cv')?.met,  rw:{money:30000,xp:100}},
  // 맛집
  {id:'food5',   grp:'맛집',emoji:'🍴',name:'미식가',       desc:'맛집 5곳 방문',     check:s=>s.foodDone.length>=5,              rw:{money:20000}},
  {id:'food10',  grp:'맛집',emoji:'🍱',name:'전국 시식왕',  desc:'맛집 10곳 방문',    check:s=>s.foodDone.length>=10,             rw:{money:80000,xp:200}},
  {id:'allfood', grp:'맛집',emoji:'🍽️',name:'전국 미식회', desc:'모든 맛집 방문',    check:s=>s.foodDone.length>=FOODS.length,   rw:{money:300000,sp:3}},
  {id:'rocketcafe',grp:'맛집',emoji:'🚀',name:'우주 식객',  desc:'로켓단 소굴 방문',  check:s=>s.foodDone.includes('나로호발사센터'),rw:{money:100000,xp:150}},
  {id:'mooncafe',grp:'맛집',emoji:'🌕',name:'달토끼와 한끼',desc:'원조 달토끼 떡집 방문',check:s=>s.foodDone.includes('달'),       rw:{money:500000,sp:1}},
  {id:'foodstreak',grp:'맛집',emoji:'🔥',name:'미식 행진',  desc:'한 도시에서 도착 직후 맛집 클리어 누적 7회',check:s=>(s.foodStreak||0)>=7,rw:{money:150000,xp:250}},
  // 레벨
  {id:'lv10',   grp:'성장',emoji:'⭐',name:'레벨 10',      desc:'레벨 10 달성',      check:s=>s.lv>=10,                          rw:{money:30000,sp:2}},
  {id:'lv30',   grp:'성장',emoji:'💎',name:'레벨 30',      desc:'레벨 30 달성',      check:s=>s.lv>=30,                          rw:{money:100000,sp:5}},
  // 부스터
  {id:'boost10',grp:'아이템',emoji:'⚡',name:'부스터 중독',desc:'부스터 10회 사용',  check:s=>(s.boostCount||0)>=10,             rw:{jc:3}},
  {id:'boost50',grp:'아이템',emoji:'🔥',name:'부스터 마니아',desc:'부스터 50회 사용',check:s=>(s.boostCount||0)>=50,             rw:{jc:10,money:50000}},
  // 탈것 (자전거 단계별 업적)
  {id:'bike_carbon', grp:'탈것',emoji:'🚴',name:'카본 입문',     desc:'입문용 카본 로드 구매', check:s=>vehOwned('v11'),  rw:{money:100000,xp:300}},
  {id:'bike_aero',   grp:'탈것',emoji:'💨',name:'에어로 라이더', desc:'에어로 로드바이크 구매',check:s=>vehOwned('v14'),  rw:{money:200000,xp:500}},
  {id:'bike_pro',    grp:'탈것',emoji:'🏆',name:'프로 레이서',   desc:'프로급 에어로 로드 구매',check:s=>vehOwned('v22'), rw:{money:500000,sp:3}},
  {id:'bike_legend', grp:'탈것',emoji:'🌌',name:'전설의 라이더', desc:'임복동 전설의 서퍼티지 구매',check:s=>vehOwned('v30'), rw:{money:1000000,sp:10}},
  // 지역별 (1번 추가 요청)
  {id:'reg_chung',grp:'지역',emoji:'🍎',name:'충청도 정복', desc:'충주·제천·태안 모두 방문',  check:s=>['충주','제천','태안'].every(c=>s.visited.includes(c)),         rw:{money:30000,xp:100}},
  {id:'reg_gang', grp:'지역',emoji:'🏔️',name:'강원도 정복', desc:'강릉·속초·고성 모두 방문',  check:s=>['강릉','속초','고성'].every(c=>s.visited.includes(c)),         rw:{money:40000,xp:120}},
  {id:'reg_gyeong',grp:'지역',emoji:'🌊',name:'경상도 정복',desc:'포항·부산 모두 방문',       check:s=>['포항','부산'].every(c=>s.visited.includes(c)),                rw:{money:35000,xp:100}},
  {id:'reg_jeon', grp:'지역',emoji:'🌾',name:'전라도 정복', desc:'여수·목포·군산 모두 방문',  check:s=>['여수','목포','군산'].every(c=>s.visited.includes(c)),         rw:{money:40000,xp:120}},
  {id:'reg_gyeong2',grp:'지역',emoji:'🏙️',name:'경기도 정복',desc:'인천·서울 모두 방문',     check:s=>['인천','서울'].every(c=>s.visited.includes(c)),                rw:{money:50000,xp:150}},
  {id:'reg_all',  grp:'지역',emoji:'🇰🇷',name:'한국 완전 정복',desc:'모든 한국 도시 방문',  check:s=>CITIES.filter(c=>c.region!=='우주'&&c.region!=='일본').every(c=>s.visited.includes(c.n)), rw:{money:500000,sp:5,xp:1000}},
  // 일본
  {id:'jp_first', grp:'일본',emoji:'⛴️',name:'페리 출항',     desc:'후쿠오카 도착',           check:s=>s.visited.includes('후쿠오카'),  rw:{money:100000,xp:200}},
  {id:'jp_all',   grp:'일본',emoji:'🇯🇵',name:'일본 완전 정복', desc:'일본 도시 5곳 모두 방문',  check:s=>['후쿠오카','오사카','교토','도쿄','삿포로'].every(c=>s.visited.includes(c)), rw:{money:1500000,sp:8,xp:2000}},
  {id:'jp_food',  grp:'일본',emoji:'🍣',name:'일본 미식회',    desc:'일본 맛집 5곳 클리어',     check:s=>['후쿠오카','오사카','교토','도쿄','삿포로'].every(c=>s.foodDone.includes(c)), rw:{money:800000,sp:3}},
  {id:'kimri_meet',grp:'특별',emoji:'🤺',name:'검도왕과 대련',  desc:'검도왕 김리 만나기',     check:s=>s.npcs.find(n=>n.id==='kimri')?.met, rw:{money:200000,xp:300}},
  // 7대죄
  {id:'sin_greed', grp:'7대죄',emoji:'💸',name:'탐욕을 견디다',  desc:'탐욕의 프레드 만나기',  check:s=>s.npcs.find(n=>n.id==='fred')?.met,    rw:{money:200000,xp:300}},
  {id:'sin_wrath', grp:'7대죄',emoji:'😡',name:'분노에 휘말렸다',desc:'분노의 상수 만나기',    check:s=>s.npcs.find(n=>n.id==='wrath')?.met,   rw:{money:200000,xp:300}},
  {id:'sin_sloth', grp:'7대죄',emoji:'😴',name:'나태를 이기다',  desc:'나태의 노무 만나기',    check:s=>s.npcs.find(n=>n.id==='sloth')?.met,   rw:{money:200000,xp:300}},
  {id:'sin_envy',  grp:'7대죄',emoji:'😒',name:'시기를 마주하다',desc:'시기의 짐승 만나기',    check:s=>s.npcs.find(n=>n.id==='envy')?.met,    rw:{money:200000,xp:300}},
  {id:'sin_glut',  grp:'7대죄',emoji:'🍴',name:'식탐의 희생자',  desc:'식탐의 찐기욱 만나기',  check:s=>s.npcs.find(n=>n.id==='gluttony')?.met,rw:{money:200000,xp:300}},
  {id:'sin_pride', grp:'7대죄',emoji:'🦚',name:'교만을 비웃다',  desc:'교만의 가오지훈 만나기',check:s=>s.npcs.find(n=>n.id==='pride')?.met,   rw:{money:200000,xp:300}},
  {id:'sin_lust',  grp:'7대죄',emoji:'💋',name:'색욕을 거부하다',desc:'색욕의 쾌락체 만나기',  check:s=>s.npcs.find(n=>n.id==='lust')?.met,    rw:{money:200000,xp:300}},
  {id:'sin_all',   grp:'7대죄',emoji:'☠️',name:'7대죄 정복',    desc:'7대죄 NPC 모두 만나기', check:s=>['fred','wrath','sloth','envy','gluttony','pride','lust'].every(id=>s.npcs.find(n=>n.id===id)?.met), rw:{money:5000000,sp:10,xp:2000}},
  // 장비
  {id:'gear_first', grp:'장비',emoji:'🎁',name:'첫 장비',         desc:'장비 1개 획득',     check:s=>(s.inventory||[]).length>=1, rw:{money:10000}},
  {id:'gear_full',  grp:'장비',emoji:'🦺',name:'풀무장',          desc:'5부위 모두 장착',   check:s=>s.equipped&&['head','eyes','hands','feet','body'].every(k=>s.equipped[k]), rw:{money:50000,xp:200}},
  {id:'gear_legend',grp:'장비',emoji:'⭐',name:'전설의 발견',     desc:'전설 등급 장비 1개', check:s=>(s.inventory||[]).some(it=>it.rarity==='legend'), rw:{money:200000,sp:1}},
  {id:'gear_mythic',grp:'장비',emoji:'✨',name:'신화 등장',       desc:'신화 등급 장비 1개', check:s=>(s.inventory||[]).some(it=>it.rarity==='mythic'), rw:{money:1000000,sp:5}},
  {id:'gear_plus10',grp:'장비',emoji:'💎',name:'+10 강화 마스터', desc:'장비 +10 강화 성공', check:s=>(s.inventory||[]).some(it=>(it.plus||0)>=10), rw:{money:500000,sp:3}},
  // 함정 / 특수
  {id:'trap_shinhan',grp:'특수',emoji:'🏖️',name:'신한 탈출',     desc:'신한에서 탈출',       check:s=>s.visited.includes('신한'), rw:{money:100000,xp:200}},
  {id:'trap_cheong', grp:'특수',emoji:'⛰️',name:'청학동 탈출',    desc:'지리산청학동에서 탈출', check:s=>s.visited.includes('지리산청학동'), rw:{money:100000,xp:200}},
  {id:'jinchon_pass',grp:'특수',emoji:'☀️',name:'태양열 부스터',  desc:'닥터 오 퀴즈 통과',    check:s=>!!s.solarBoost, rw:{money:200000,sp:2}},
  {id:'rocket_buy',  grp:'특수',emoji:'🚀',name:'임복동1호 발사', desc:'로켓 구매 후 발사',    check:s=>s.visited.includes('달'), rw:{money:300000,xp:500}},
  // 미션
  {id:'mission_d10', grp:'미션',emoji:'📅',name:'일일 미션 10회', desc:'일일 미션 누적 10회 완료', check:s=>(s.missions?.totalDailyClaimed||0)>=10, rw:{money:50000,jc:3}},
  {id:'mission_w5',  grp:'미션',emoji:'🗓️',name:'주간 미션 5회', desc:'주간 미션 누적 5회 완료',  check:s=>(s.missions?.totalWeeklyClaimed||0)>=5, rw:{money:200000,sp:1}},
  // 부 (소지금)
  {id:'rich1m',  grp:'부',emoji:'💰',name:'백만장자',     desc:'소지금 1,000,000 도달', check:s=>s.money>=1000000, rw:{money:50000,xp:100}},
  {id:'rich10m', grp:'부',emoji:'💎',name:'천만장자',     desc:'소지금 10,000,000 도달',check:s=>s.money>=10000000, rw:{money:500000,sp:3}},
  // 특별
  {id:'nokm',   grp:'특별',emoji:'😴',name:'방치의 달인',   desc:'오프라인 보상 5회 이상', check:s=>(s.offlineCount||0)>=5,          rw:{money:50000}},
  {id:'allach', grp:'특별',emoji:'🏅',name:'업적 수집가',   desc:'업적 30개 달성',         check:s=>s.achievements.length>=30,       rw:{money:1000000,sp:10}},
];

// ── 상태 ───────────────────────────────────────────────
let S={
  city:'충주',dest:null,sgKm:0,sgTot:100,totKm:0,
  xp:0,xpMax:100,lv:1,money:800,hp:100,mhp:100,
  end:5,speed:6,sp:3,vId:'v1',
  ap:3,jc:2,dopT:0,dopSp:5,
  autoApple:false,
  riding:false,restT:0,ecool:0,
  prevBaseMhp:100,
  mhpSpBonus:0,
  moonKm:0,
  paints:['gray'], activePaint:'gray', gachaCount:0,
  foodStreak:0,
  seenTabs:{npc:0,veh:0,ach:0,gear:0},
  inventory:[],
  equipped:{head:null,eyes:null,hands:null,feet:null,body:null},
  npcs:NPCS.map(n=>({...n})),
  visited:[],foodDone:[],postcards:[],
  achievements:[],boostCount:0,offlineCount:0,prestige:0,
  vehs:VEHS.map(v=>({id:v.id,owned:v.owned})),
};
let tickIv=null,npcIv=null,logs=[],curTab='main',isResting=false;
let frame=0,bikeX=150,bgScrollX=0;
let boosterBubble=0;
let evAnim=null,evTimer=0,evAnimNpc=null;
let oxResult=null; // 'correct' | 'wrong' — OX 퀴즈 결과 애니
// 주사위 애니메이션
let diceAnim=0,diceVal=1,diceTarget=null;
// ✨ 성취 순간 연출(오버레이) — evAnim과 별개로 겹쳐 표시
let levelUpFx=0, levelUpLv=0;      // 레벨업 번쩍+팝업
let arriveFx=0, arriveCity='';     // 도시 도착 컨페티
let prestigeFx=0, prestigeRound=0; // 프레스티지 회차 출발 축하
// TY 수호천사 (v4.4 그록 추가)
let tyTalkTimer=1800+Math.floor(Math.random()*1200);

// 4번: 도시 간 실거리 (km) — 충주 기준 실측값 반영
const CITY_DIST={
  '충주-제천':35,'충주-강릉':155,'충주-속초':190,
  '충주-고성':220,'충주-포항':230,'충주-부산':260,
  '충주-여수':290,'충주-목포':310,'충주-군산':170,
  '충주-태안':140,'충주-인천':105,'충주-서울':85,
  '제천-강릉':125,'제천-속초':165,'제천-고성':195,
  '제천-포항':210,'제천-부산':255,'제천-여수':295,
  '제천-목포':310,'제천-군산':185,'제천-태안':155,
  '제천-인천':130,'제천-서울':120,
  '강릉-속초':45,'강릉-고성':75,'강릉-포항':185,
  '강릉-부산':280,'강릉-여수':380,'강릉-목포':400,
  '강릉-군산':305,'강릉-태안':295,'강릉-인천':240,
  '강릉-서울':230,'속초-고성':30,'속초-포항':230,
  '속초-부산':325,'속초-여수':425,'속초-목포':445,
  '속초-군산':350,'속초-태안':340,'속초-인천':280,
  '속초-서울':270,'고성-포항':255,'고성-부산':350,
  '고성-여수':450,'고성-목포':465,'고성-군산':375,
  '고성-태안':365,'고성-인천':310,'고성-서울':300,
  '포항-부산':90,'포항-여수':215,'포항-목포':285,
  '포항-군산':270,'포항-태안':310,'포항-인천':310,
  '포항-서울':310,'부산-여수':150,'부산-목포':220,
  '부산-군산':245,'부산-태안':330,'부산-인천':390,
  '부산-서울':390,'여수-목포':110,'여수-군산':155,
  '여수-태안':270,'여수-인천':320,'여수-서울':320,
  '목포-군산':100,'목포-태안':200,'목포-인천':265,
  '목포-서울':265,'군산-태안':115,'군산-인천':165,
  '군산-서울':185,'태안-인천':95,'태안-서울':130,
  '충주-나로호발사센터':350,'제천-나로호발사센터':340,
  '강릉-나로호발사센터':430,'속초-나로호발사센터':465,
  '고성-나로호발사센터':490,'포항-나로호발사센터':240,
  '부산-나로호발사센터':190,'여수-나로호발사센터':85,
  '목포-나로호발사센터':145,'군산-나로호발사센터':195,
  '태안-나로호발사센터':330,'인천-나로호발사센터':380,
  '서울-나로호발사센터':365,
  // 신한, 청학동, 진천 거리 (대략)
  '충주-진천':30, '제천-진천':70, '서울-진천':100, '인천-진천':115, '강릉-진천':145,
  '부산-진천':280, '여수-진천':260, '목포-진천':225, '군산-진천':130, '태안-진천':140,
  '포항-진천':255, '속초-진천':200, '고성-진천':245,
  '충주-신한':350, '제천-신한':340, '서울-신한':480, '인천-신한':460, '강릉-신한':530,
  '부산-신한':150, '여수-신한':80,  '목포-신한':140, '군산-신한':210, '태안-신한':320,
  '포항-신한':220, '속초-신한':560, '고성-신한':580,
  '충주-지리산청학동':180, '제천-지리산청학동':210, '서울-지리산청학동':310, '인천-지리산청학동':320,
  '강릉-지리산청학동':320, '부산-지리산청학동':130, '여수-지리산청학동':110, '목포-지리산청학동':150,
  '군산-지리산청학동':140, '태안-지리산청학동':260, '포항-지리산청학동':165, '속초-지리산청학동':350, '고성-지리산청학동':370,
  '인천-서울':30,
  // 대구 (경상도 중심)
  '충주-대구':190,'제천-대구':215,'서울-대구':280,'인천-대구':310,'강릉-대구':280,
  '부산-대구':95, '여수-대구':210,'목포-대구':260,'군산-대구':190,'태안-대구':305,
  '포항-대구':100,'속초-대구':340,'고성-대구':360,'진천-대구':165,
  // 일본 — 부산에서 페리로만 도착 가능
  '부산-후쿠오카':210,
  // 일본 내부 거리
  '후쿠오카-오사카':480, '후쿠오카-교토':520, '후쿠오카-도쿄':1100, '후쿠오카-삿포로':2050,
  '오사카-교토':50,      '오사카-도쿄':500,    '오사카-삿포로':1500,
  '교토-도쿄':460,        '교토-삿포로':1450,
  '도쿄-삿포로':1100,
};
function getCityDist(a,b){
  return CITY_DIST[a+'-'+b]||CITY_DIST[b+'-'+a]||Math.floor(80+Math.random()*180);
}

// 3번: 로켓 발사 함수
function launchRocket(){
  const rocket=VEHS.find(v=>v.id==='rocket');
  if(!rocket||!vehOwned('rocket')){addLog('bad','임복동1호 없음!');return;}
  // 발사 애니메이션 시작 (12초 카운트다운 + 발사)
  rocketLaunchAnim = {
    phase: 'countdown',  // countdown → liftoff → result
    timer: 0,
    countdownLeft: 5,
    result: null,
    prevVehId: S.vId,
  };
  // 라이딩 정지 (애니 동안)
  if(S.riding){
    S.riding=false;
    if(tickIv){clearInterval(tickIv);tickIv=null;}
    document.getElementById('ride-btn').textContent='▶ 출발!';
  }
  addLog('good','🚀 임복동1호 발사 카운트다운 시작! 5...');
  update();
}
// 발사 애니메이션 상태
var rocketLaunchAnim = null;
function vehOwned(id){return S.vehs.find(v=>v.id===id)?.owned||false;}
function setVehOwned(id,val){const v=S.vehs.find(v=>v.id===id);if(v)v.owned=val;}
// 탈것 속도에 비례한 애니메이션 배수 (3번 속도 연동)
function animSpeedMult(){return Math.max(0.5,cv2().sp/26);}

