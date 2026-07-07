
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
  {n:'삿포로',  region:'일본',bg:'snow',     hist:'🇯🇵 삿포로! 눈으로 덮인 도시. 양꼬치와 라멘이 손짓한다.'},
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
  sushi:'🍣', samurai:'⚔️', mangaka:'✏️', yakuza:'🐉', idol:'🌸',
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
  {id:'idol', grade:'legend', n:'아이돌 미사키', role:'도쿄 톱 아이돌', met:false,
    reward:'₩600,000, XP+400, 부스터+40초',
    lines:['꺄아악!! 한국 자전거 오빠 너무 멋있어요!!','사인해드릴게요! 사진도! SNS에 올려도 돼요?'],
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
  {c:'제천',n:'의림지 닭갈비',e:'🍗',type:'tap'},
  {c:'강릉',n:'초당순두부',e:'🥣',type:'tap'},
  {c:'속초',n:'닭강정',e:'🍱',type:'timing'},
  {c:'고성',n:'대게찜',e:'🥩',type:'timing'},
  {c:'포항',n:'과메기',e:'🐟',type:'tap'},
  {c:'부산',n:'돼지국밥',e:'🍲',type:'timing'},
  {c:'여수',n:'갓김치 삼겹살',e:'🥓',type:'tap'},
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
  {c:'삿포로', n:'양꼬치',     e:'🥩',type:'tap'},
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
  {id:'idol_meet',grp:'일본',emoji:'🌸',name:'아이돌과 셀카',  desc:'아이돌 미사키 만나기',     check:s=>s.npcs.find(n=>n.id==='idol')?.met, rw:{money:200000,xp:300}},
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
  visited:[],foodDone:[],
  achievements:[],boostCount:0,offlineCount:0,
  vehs:VEHS.map(v=>({id:v.id,owned:v.owned})),
};
let tickIv=null,npcIv=null,logs=[],curTab='main',isResting=false;
let frame=0,bikeX=150,bgScrollX=0;
let boosterBubble=0;
let evAnim=null,evTimer=0,evAnimNpc=null;
let oxResult=null; // 'correct' | 'wrong' — OX 퀴즈 결과 애니
// 주사위 애니메이션
let diceAnim=0,diceVal=1,diceTarget=null;
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

// ── 캔버스 ─────────────────────────────────────────────
const cv=document.getElementById('cv');
const ctx=cv.getContext('2d');
cv.width=420;cv.height=210;
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
  // 옵션 B v2: 캔버스 420x236 (16:9)
  ctx.clearRect(0,0,420,236);
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
  // HUD
  p(4,4,120,18,'rgba(0,0,0,.55)');ctx.fillStyle='#FFD700';ctx.font='bold 10px monospace';ctx.fillText('📍 '+city.n,8,18);
  if(S.restT>0){p(4,25,150,16,'rgba(0,0,0,.5)');ctx.fillStyle='#FFD700';ctx.font='8px monospace';ctx.fillText('💤 휴식 '+S.restT+'s',8,37);}
  if(S.dopT>0){p(4,25,162,16,'rgba(200,80,0,.82)');ctx.fillStyle='#FFE082';ctx.font='bold 8px monospace';ctx.fillText('⚡ BOOST '+S.dopT+'s',8,37);}
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
      ctx.font = 'bold 60px monospace';
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
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🌕 달 도착! 🌕', 210, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px monospace';
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
      ctx.font = 'bold 16px monospace';
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
  ctx.font = 'bold 4px monospace';
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
    ctx.font='bold 12px monospace';
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
    ctx.font='bold 12px monospace';
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
  ctx.font='bold 52px monospace';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(isOk?'O':'X', 0, 2);

  // 결과 텍스트
  ctx.font='bold 10px monospace';
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
  ctx.font='28px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(food?food.e:'🍴',0,-8);
  // 텍스트
  ctx.font='bold 8px monospace';ctx.fillStyle='#FFF';
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
  ctx.font='26px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('😅',0,-8);
  ctx.font='bold 7px monospace';ctx.fillStyle='#FFF';
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
  ctx.font='22px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(em,-52,0);
  ctx.font='bold 8px monospace';ctx.fillStyle=gc;ctx.textBaseline='alphabetic';
  ctx.fillText(npc.n,20,-8);
  ctx.font='bold 6px monospace';ctx.fillStyle='#5C3D1E';
  ctx.fillText(npc.reward,20,12);
  // 등급 배지
  ctx.fillStyle=gc;ctx.beginPath();ctx.roundRect(-90,30,80,18,6);ctx.fill();
  ctx.fillStyle='#FFF';ctx.font='bold 6px monospace';ctx.textAlign='center';
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
  ctx.fillStyle='#E65100';ctx.font='bold 9px monospace';ctx.textAlign='center';
  ctx.fillText('부스터 ON!',x,y-8);ctx.textAlign='left';
  ['★','✦','✦'].forEach((s,i)=>{ctx.fillStyle='#FFB300';ctx.font='bold 10px monospace';ctx.fillText(s,x+(i===0?-64:i===1?54:50),y+(i===0?-10:i===1?-22:2));});
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
    // 풍선 본체
    ctx.fillStyle='#FFF9C4';ctx.strokeStyle='#F48FB1';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(bx,by,bw,22,6);ctx.fill();ctx.stroke();
    // 꼬리 (TY 쪽을 향해)
    ctx.fillStyle='#FFF9C4';
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
    ctx.fillStyle='#5C3D1E';ctx.font='bold 5px monospace';ctx.textAlign='left';
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
    ctx.fillStyle='#FFD700';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText('→ '+diceTarget,cx,cy+68);ctx.textAlign='left';
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
    ctx.fillStyle='#222';ctx.font='bold 8px monospace';ctx.textAlign='center';
    ctx.fillText('왈왈!',dx+12,dy-27);ctx.textAlign='left';
    ctx.fillStyle='#FFF';ctx.beginPath();ctx.moveTo(dx+5,dy-22);ctx.lineTo(dx+10,dy-16);ctx.lineTo(dx+15,dy-22);ctx.fill();
  }
  // 중앙 배너
  p(40,88,340,26,'rgba(200,60,50,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
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
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
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
  ctx.font='16px monospace';ctx.textAlign='center';
  ctx.fillText('🍱',villX-6-ext-6,villY-18);ctx.textAlign='left';
  // 중앙 배너
  p(40,88,340,26,'rgba(30,140,80,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
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
    ctx.fillStyle='#E24B4A';ctx.font='bold 18px monospace';ctx.textAlign='center';
    ctx.fillText('펑!!',bikeX,148);ctx.textAlign='left';
  }
  // 중앙 배너
  p(40,88,340,26,'rgba(200,50,50,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
  ctx.fillText('💥 타이어 펑크! 구간 -12km',210,106);ctx.textAlign='left';
}

// 3번: 소나기 (신규 개선)
function drawRainAnim(){
  ctx.fillStyle='rgba(80,120,200,.12)';ctx.fillRect(0,0,420,210);
  ctx.strokeStyle='rgba(150,200,255,.65)';ctx.lineWidth=1.5;
  for(let i=0;i<32;i++){const x=(i*23+frame*13)%460,y=(i*18+frame*10)%210;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y+20);ctx.stroke();}
  p(40,88,340,26,'rgba(30,60,150,.9)');
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
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
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
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
  ctx.fillStyle='#FFF';ctx.font='bold 7px monospace';ctx.textAlign='center';
  ctx.fillText('⬇️ 내리막! +6km 보너스',210,106);ctx.textAlign='left';
}

// NPC 등장 애니메이션 (등급 색상 반영)
function drawNpcAnim(){
  const npc=evAnimNpc;
  const nx=bikeX+80+Math.sin(frame*.15)*6,ny=148;
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
  ctx.font='14px monospace';ctx.textAlign='center';ctx.fillText(em,nx+7,ny-28);ctx.textAlign='left';
  // 이름 말풍선
  const bw=Math.min(170,npc.n.length*9+46);
  ctx.fillStyle=gb;ctx.strokeStyle=gc;ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(nx+7-bw/2,ny-80,bw,22,6);ctx.fill();ctx.stroke();
  ctx.fillStyle=gb;ctx.beginPath();ctx.moveTo(nx+3,ny-58);ctx.lineTo(nx+8,ny-50);ctx.lineTo(nx+13,ny-58);ctx.fill();ctx.fillRect(nx+2,ny-60,14,5);
  ctx.fillStyle=gc;ctx.font='bold 7px monospace';ctx.textAlign='center';ctx.fillText(npc.n,nx+7,ny-65);ctx.textAlign='left';
  // 등급 배지
  p(nx+7-30,ny-44,60,14,gc);
  ctx.fillStyle='#FFF';ctx.font='bold 5px monospace';ctx.textAlign='center';
  ctx.fillText('['+GRADE_LABEL[npc.grade]+']',nx+7,ny-33);ctx.textAlign='left';
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
    ctx.fillStyle='#5C3D1E';ctx.font='bold 5px monospace';ctx.textAlign='center';
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

  // NPC 픽셀 초상화 — 48x48 권장 (모달 + 카드용)
  npc_rk:       null,  // 락둥이
  npc_mc:       null,  // 마충구
  npc_wrath:    null,  // 분노의 상수
  npc_sloth:    null,  // 나태의 노무
  npc_envy:     null,
  npc_gluttony: null,
  npc_pride:    null,
  npc_lust:     null,
  npc_fred:     null,

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
  b1_1: "./assets/b1_1.png",
  b1_2: "./assets/b1_2.png",
  b1_3: "./assets/b1_3.png",
  b1_4: "./assets/b1_4.png",
  b1_5: "./assets/b1_5.png",
  b2_1: "./assets/b2_1.png",
  b2_2: "./assets/b2_2.png",
  b2_3: "./assets/b2_3.png",
  b2_4: "./assets/b2_4.png",
  b2_5: "./assets/b2_5.png",
  b3_1: "./assets/b3_1.png",
  b3_2: "./assets/b3_2.png",
  b3_3: "./assets/b3_3.png",
  b3_4: "./assets/b3_4.png",
  b3_5: "./assets/b3_5.png",
  b4_1: "./assets/b4_1.png",
  b4_2: "./assets/b4_2.png",
  b4_3: "./assets/b4_3.png",
  b4_4: "./assets/b4_4.png",
  b4_5: "./assets/b4_5.png",
  b5_1: "./assets/b5_1.png",
  b5_2: "./assets/b5_2.png",
  b5_3: "./assets/b5_3.png",
  b5_4: "./assets/b5_4.png",
  b5_5: "./assets/b5_5.png",
};
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
  // 5프레임 사이클 (일반/부스터 각각). 머리·몸통 고정, 다리만 회전
  let frameNum;
  if(!isRiding){
    frameNum = 1;
  } else {
    const speed = isBoost ? 4 : 7;   // 부스터는 더 빠른 페달링
    frameNum = (Math.floor(frame / speed) % 5) + 1;
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
  const sz = 100 * scale;
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
// 즉시 호출 대신 다음 프레임에 시작 — 모든 정의가 끝난 후 실행되도록
requestAnimationFrame(animLoop);

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
    const fs = px => `font-size:calc(${px}px * ${u})`;
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
  // 5번: 비자금 환수 — 1~50km 후 경찰
  if(S.blackMoneyTrigger && S.totKm >= S.blackMoneyTrigger){
    S.money -= 1000000;
    S.blackMoneyTrigger = 0;
    S.blackMoneyUntil = 0;
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

  const baseSp = (v.sp + (S.dopT>0?S.dopSp:0) + (eqBonus.speedBonus||0)) * sinSpeedMult;
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
    let arriveMoney = Math.floor(20000 * moneyMult);
    // 7대죄 #6 교만: 다음 도시 보상 -90%
    if(S.prideNextCity){
      arriveMoney = Math.floor(arriveMoney * 0.1);
      S.prideNextCity = false;
      addLog('bad','🦚 교만의 가오지훈의 저주! 도착 보상 -90%');
    }
    S.city=S.dest;S.dest=null;S.sgKm=0;S.money+=arriveMoney;
    const ci=CITIES.find(c=>c.n===S.city)||CITIES[0];
    // 일본 도착 완료 → 페리 플래그 해제 (이후 일본 내 이동은 currentInJapan 로직이 담당)
    if(ci.region==='일본') S.onFerryToJapan = false;
    if(!S.visited.includes(S.city))S.visited.push(S.city);
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
  // 3번: 함정 도시 (신한/청학동) — 200km 무의미 라이딩
  if(S.trapZone){
    S.trapZone.kmIn += km;
    // 50km 단위로 탈출 주사위 버튼 활성화
    const reachedDice = Math.floor(S.trapZone.kmIn / 50);
    if(reachedDice > S.trapZone.lastDiceAt){
      S.trapZone.lastDiceAt = reachedDice;
      addLog('neutral','🎲 50km 도달! 탈출 주사위 사용 가능 (메인 화면)');
    }
    // 200km 달성 시 자동 탈출
    if(S.trapZone.kmIn >= 200){
      addLog('good','😅 200km 완주... 겨우 탈출!');
      S.trapZone = null;
      S.money += 50000;
      showEscapeDestModal();
    }
  }
  S.ecool--;if(S.ecool<=0&&Math.random()<.06){fireRandEvent();S.ecool=18;}
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
function applyOfflineReward(lastTime){
  const now=Date.now();let sec=Math.floor((now-lastTime)/1000);sec=Math.min(sec,8*3600);
  if(sec<60)return;
  // 1번 fix: 체력 회복 (1분당 +1, 최대 mhp까지)
  const minutes = Math.floor(sec/60);
  const hpRecovered = Math.min(S.mhp - S.hp, minutes);
  S.hp = Math.min(S.mhp, S.hp + hpRecovered);
  // 라이딩 중이었을 때만 km/money/xp 보상
  const km=Math.floor(sec*.5),money=Math.floor(km*10),xp=Math.floor(km*2);
  S.totKm+=km;S.money+=money;S.xp+=xp;S.offlineCount=(S.offlineCount||0)+1;
  addLog('good','💤 오프라인 보상! +'+km+'km, ₩'+money.toLocaleString()+', XP+'+xp+(hpRecovered>0?', ❤️+'+hpRecovered:''));
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
      <div style="font-size:calc(9px * var(--u));color:#01579B;text-align:center;margin-bottom:6px;">⛴️ 부산 도착!</div>
      <div style="font-size:calc(6px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #0277BD;border-radius:5px;padding:6px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(7px * var(--u));color:#01579B;background:linear-gradient(135deg,#E1F5FE,#B3E5FC);border:3px dashed #0277BD;border-radius:8px;padding:10px;margin-bottom:8px;text-align:center;line-height:2;">
        🇯🇵 <b>일본행 페리 출항 가능!</b><br>
        <span style="font-size:calc(8px * var(--u));color:#B71C1C;">₩${ferryPrice.toLocaleString()}</span><br>
        <span style="font-size:calc(5px * var(--u));color:#8B6340;line-height:1.6;">⛴️ 부산 ↔ 후쿠오카 페리<br>🍣 5개 일본 도시 탐험 가능<br>🛒 부산에서만 구매 가능!</span>
      </div>
      ${canAfford
        ? `<button class="px-btn" style="width:100%;font-size:calc(8px * var(--u));padding:calc(10px * var(--u));background:#0277BD;border-color:#01579B;margin-bottom:6px;box-shadow:calc(3px * var(--u)) calc(3px * var(--u)) 0 #002F5F;color:#FFF;" onclick="buyFerryFromModal(${wr})">⛴️ 구매하시겠습니까? (₩${ferryPrice.toLocaleString()})</button>`
        : `<div style="font-size:calc(7px * var(--u));color:#B71C1C;background:#FFE0E0;border:2px solid #E53935;border-radius:6px;padding:8px;text-align:center;margin-bottom:6px;line-height:1.8;">자금 부족!<br>보유: ₩${S.money.toLocaleString()} / 필요: ₩${ferryPrice.toLocaleString()}</div>`}
      <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(7px * var(--u));" onclick="closeModal(${wr})">다음 기회에... ▶</button>
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
      <div style="font-size:calc(9px * var(--u));color:#E65100;text-align:center;margin-bottom:6px;">🚀 나로호발사센터 도착!</div>
      <div style="font-size:calc(6px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #FF6D00;border-radius:5px;padding:6px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(7px * var(--u));color:#E65100;background:linear-gradient(135deg,#FFF8E1,#FFE082);border:3px dashed #FFCC02;border-radius:8px;padding:10px;margin-bottom:8px;text-align:center;line-height:2;">
        ${hasRocket
          ? '🚀 <b>임복동1호 보유 중!</b><br>발사하시겠어요?'
          : `✨ <b>임복동1호 구매 기회!</b><br><span style="font-size:calc(8px * var(--u));color:#B71C1C;">₩80,000</span><br><span style="font-size:calc(5px * var(--u));color:#8B6340;line-height:1.6;">⚠️ 1회용 · 5% 폭발 확률<br>🌕 발사 성공 시 달 도착<br>🛒 이곳에서만 구매 가능!</span>`}
      </div>
      ${hasRocket
        ? `<button class="px-btn" style="width:100%;font-size:calc(8px * var(--u));padding:calc(10px * var(--u));background:#E53935;border-color:#B71C1C;margin-bottom:6px;box-shadow:calc(3px * var(--u)) calc(3px * var(--u)) 0 #6D0000;" onclick="closeModalAndLaunch(${wr})">🚀 지금 발사!</button>`
        : (canAfford
          ? `<button class="px-btn px-btn-green" style="width:100%;font-size:calc(8px * var(--u));padding:calc(10px * var(--u));margin-bottom:6px;" onclick="buyRocketFromModal(${wr})">💰 구매하시겠습니까? (₩80,000)</button>`
          : `<div style="font-size:calc(7px * var(--u));color:#B71C1C;background:#FFE0E0;border:2px solid #E53935;border-radius:6px;padding:8px;text-align:center;margin-bottom:6px;line-height:1.8;">자금 부족!<br>보유: ₩${S.money.toLocaleString()} / 필요: ₩80,000</div>`)
      }
      <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(7px * var(--u));" onclick="closeModal(${wr})">${hasRocket?'나중에 발사':'다음 기회에...'} ▶</button>
    </div>`;
    return;
  }

  // 4번: 달 특별 도착 화면
  if(ci.special==='moon'){
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:#FFD700;background:linear-gradient(135deg,#0A0A2E,#1A1A4E);margin-bottom:5px;">
      <div style="font-size:calc(9px * var(--u));color:#FFD700;text-align:center;margin-bottom:8px;">🌕 달 도착!!</div>
      <div style="font-size:calc(6px * var(--u));color:#E0E0FF;background:rgba(255,255,255,.08);border:2px solid #FFD700;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2.2;text-align:center;">
        히든스페이스 발견!<br>🐰 토끼가 반겨준다<br>
        <span style="font-size:calc(5px * var(--u));color:#AAAAFF;">달에서 200km를 달리면<br>충주로 귀환합니다</span>
      </div>
      <div style="font-size:calc(6px * var(--u));color:#FFD700;background:rgba(255,215,0,.12);border:2px solid #FFD700;border-radius:6px;padding:6px;text-align:center;margin-bottom:8px;">
        🎉 달 도착 보상: ₩500,000
      </div>
      <button class="px-btn" style="width:100%;font-size:calc(7px * var(--u));background:#FFD700;border-color:#B8860B;color:#1A0A00;" onclick="closeModal(${wr})">달 라이딩 시작! 🌕</button>
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
      <div style="font-size:calc(8px * var(--u));color:${titleColor};text-align:center;margin-bottom:6px;">⚠️ ${ci.n} 도착!! ⚠️</div>
      <div style="font-size:calc(6px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid ${titleColor};border-radius:6px;padding:7px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(6px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2;text-align:center;">${subText}</div>
      <div style="font-size:calc(6px * var(--u));color:#B71C1C;background:#FFE0E0;border:2px solid #B71C1C;border-radius:6px;padding:6px;margin-bottom:8px;text-align:center;line-height:1.8;">
        🚷 무의미한 라이딩 200km 진행<br>50km마다 주사위 6 나오면 탈출 가능
      </div>
      <button class="px-btn px-btn-red" style="width:100%;font-size:calc(7px * var(--u));" onclick="enterTrapZone('${ci.special}',${wr})">탈출 시도 시작...</button>
    </div>`;
    return;
  }

  // 2번: 대구 서커스(불의 고리) 삭제됨 — 일반 도시로 처리

  // 8번: 진천 — 닥터 오 등장 + 태양열 부스터 업그레이드 퀴즈
  if(ci.special==='jinchon'){
    document.getElementById('modal-area').innerHTML=`
    <div class="px-panel" style="border-color:#FF8F00;background:linear-gradient(135deg,#FFF8E1,#FFECB3);margin-bottom:5px;">
      <div style="font-size:calc(8px * var(--u));color:#E65100;text-align:center;margin-bottom:6px;">☀️ 진천 도착!</div>
      <div style="font-size:calc(6px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #FF8F00;border-radius:5px;padding:6px;margin-bottom:8px;line-height:2;">📜 ${ci.hist}</div>
      <div style="font-size:calc(6px * var(--u));color:#3D2510;background:#FFF;border:2px solid #FFD54F;border-radius:6px;padding:8px;margin-bottom:8px;line-height:2;text-align:center;">
        👩‍🔬 <b>닥터 오</b>: "어서 오세요!<br>퀴즈 3문제를 맞추면 사과즙을<br><b style="color:#E65100;">태양열 부스터</b>로 업그레이드해드릴게요!"
        ${S.solarBoost?'<br><br><span style="color:#1B5E20;">✅ 이미 업그레이드 완료!</span>':''}
      </div>
      ${S.solarBoost
        ? `<button class="px-btn" style="width:100%;font-size:calc(7px * var(--u));" onclick="closeModal(${wr})">계속 달리자 ▶</button>`
        : `<button class="px-btn px-btn-orange" style="width:100%;font-size:calc(7px * var(--u));margin-bottom:5px;" onclick="startDrOQuiz(${wr})">퀴즈 도전!</button>
           <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(7px * var(--u));" onclick="closeModal(${wr})">나중에</button>`}
    </div>`;
    return;
  }

  // 3번: 도시별 OX 퀴즈 풀에서 랜덤 선택
  const cityQs=OX_BY_CITY[ci.n]||OX_QS;
  const q=cityQs[Math.floor(Math.random()*cityQs.length)];
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:#C0A060;background:#FFF8DC;margin-bottom:5px;">
    <div style="font-size:calc(7px * var(--u));color:#5C3D1E;text-align:center;margin-bottom:5px;">🎉 ${ci.n} 도착!</div>
    <div style="font-size:calc(7px * var(--u));color:#8B6340;background:#F5E6C8;border:2px solid #C0A060;border-radius:5px;padding:6px;margin-bottom:8px;line-height:1.9;">📜 ${ci.hist}</div>
    <div style="font-size:calc(7px * var(--u));color:#5C3D1E;margin-bottom:6px;">역사 OX 퀴즈!</div>
    <div style="font-size:calc(7px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:7px;margin-bottom:10px;line-height:1.9;">${q.q}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">
      <button class="px-btn px-btn-gray" style="font-size:calc(7px * var(--u));padding:12px;" onclick="ansOX(true,${q.a},\`${q.ex}\`,${wr})">O</button>
      <button class="px-btn px-btn-red" style="font-size:calc(7px * var(--u));padding:12px;" onclick="ansOX(false,${q.a},\`${q.ex}\`,${wr})">X</button>
    </div>
    <div style="font-size:calc(7px * var(--u));color:#8B6340;text-align:center;">정답시 ₩5,000 + XP+20</div>
  </div>`;
}

// ── 3번: 함정 도시 — 200km 무의미 라이딩 + 50km마다 주사위 ─────
function enterTrapZone(special, wr){
  S.trapZone = {special, totalKm: 200, kmIn: 0, lastDiceAt: 0};
  S.dest = null; S.sgKm = 0;
  // closeModal이 wr이면 자동으로 riding 재개. 중복 setInterval 방지.
  closeModal(wr);
  if(!wr && !S.riding){
    S.riding=true;
    document.getElementById('ride-btn').textContent='■ 정지';
    if(!tickIv){tickIv=setInterval(tick,1000);startNpcTimer();}
  }
  addLog('bad', special==='trap_shinhan' ? '🏖️ 신한 탈출 시작! 50km마다 주사위 6이 나오면 탈출!' : '⛰️ 청학동 탈출 시작! 50km마다 주사위 6이 나오면 탈출!');
}
function rollEscapeDice(){
  const tz = S.trapZone;
  if(!tz) return;
  diceAnim = 60;
  diceVal = Math.ceil(Math.random()*6);
  setTimeout(()=>{
    if(diceVal===6){
      addLog('good','🎲 주사위 6! 탈출 성공!');
      S.trapZone = null;
      S.money += 100000;
      // 3번: 탈출 팝업 — 다른 목적지 선택
      showEscapeDestModal();
    } else {
      addLog('bad','🎲 주사위 '+diceVal+'... 탈출 실패. 계속 달려야 한다.');
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
  // 랜덤 4개 추첨
  const picked = [];
  const pool = [...candidates];
  while(picked.length < 4 && pool.length > 0){
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  const u = 'var(--u)';
  const fs = px => `font-size:calc(${px}px * ${u})`;
  const btnsHtml = picked.map(c =>
    `<button class="px-btn" style="${fs(7)};padding:calc(8px * ${u});background:#43A047;border-color:#1B5E20;color:#FFF;width:100%;margin-bottom:calc(4px * ${u});" onclick="selectEscapeDest('${c.n}',${wr})">📍 ${c.n} <span style="${fs(5)};opacity:.85;">(${c.region})</span></button>`
  ).join('');
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
    <div style="font-size:calc(7px * var(--u));color:#E65100;text-align:center;margin-bottom:5px;">👩‍🔬 닥터 오 퀴즈 (${S.drOQuiz.step+1}/3)</div>
    <div style="font-size:calc(6px * var(--u));color:#8B6340;text-align:center;margin-bottom:6px;">맞춘 개수: ${S.drOQuiz.correct}</div>
    <div style="font-size:calc(7px * var(--u));color:#3D2510;background:#FFF;border:2px solid #FFD54F;border-radius:6px;padding:8px;margin-bottom:9px;line-height:1.9;">${q.q}</div>
    ${q.opts.map((o,i)=>`<button class="px-btn px-btn-sm" style="width:100%;margin-bottom:4px;text-align:left;font-size:calc(6px * var(--u));" onclick="answerDrO(${i})">${i+1}. ${o}</button>`).join('')}
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
        <div style="font-size:calc(9px * var(--u));color:#E65100;text-align:center;margin-bottom:8px;">☀️ 태양열 부스터 획득!</div>
        <div style="font-size:calc(6px * var(--u));color:#3D2510;text-align:center;margin-bottom:8px;line-height:2;">
          닥터 오: "축하해요!<br>이제 부스터가 태양에너지로 강화됐어요."<br>
          <span style="color:#E65100;font-weight:bold;">부스터 속도 +5 영구!</span>
        </div>
        <button class="px-btn" style="width:100%;font-size:calc(7px * var(--u));" onclick="closeModal(${wr})">감사합니다!</button>
      </div>`;
    } else {
      addLog('bad','퀴즈 통과 실패... ('+S.drOQuiz.correct+'/3) 다음에 다시 도전!');
      document.getElementById('modal-area').innerHTML = `
      <div class="px-panel" style="border-color:#B71C1C;margin-bottom:5px;">
        <div style="font-size:calc(8px * var(--u));color:#B71C1C;text-align:center;margin-bottom:8px;">😔 퀴즈 실패</div>
        <div style="font-size:calc(6px * var(--u));color:#3D2510;text-align:center;margin-bottom:8px;line-height:2;">
          닥터 오: "아쉽네요... ${S.drOQuiz.correct}/3<br>다음에 다시 와주세요!"
        </div>
        <button class="px-btn" style="width:100%;font-size:calc(7px * var(--u));" onclick="closeModal(${wr})">아쉽다...</button>
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
    <div style="font-size:calc(8px * var(--u));color:#FFE082;text-align:center;margin-bottom:6px;">☠️ 재앙 NPC 출현 ☠️</div>
    <div style="text-align:center;font-size:calc(28px * var(--u));margin-bottom:8px;">${em}</div>
    <div style="font-size:calc(8px * var(--u));color:#FFCDD2;text-align:center;margin-bottom:4px;">${npc.n}</div>
    <div style="font-size:calc(6px * var(--u));color:#FFAB91;text-align:center;margin-bottom:8px;">${npc.role}</div>
    <div style="font-size:calc(6px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #5D0303;border-radius:5px;padding:7px;margin-bottom:8px;line-height:2;">"${line}"</div>
    <div style="font-size:calc(6px * var(--u));color:#FFE082;background:rgba(255,255,255,.1);border:2px solid #FFE082;border-radius:6px;padding:6px;margin-bottom:8px;text-align:center;">⚠️ ${npc.reward}</div>
    <button class="px-btn px-btn-red" style="width:100%;font-size:calc(7px * var(--u));" onclick="acceptNpc('${npc.id}',${wr})">…피할 수 없다</button>
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
    S.blackMoneyKm = S.totKm;
    S.blackMoneyTrigger = S.totKm + (1 + Math.floor(Math.random()*50));
    title = '💰 비자금 사과박스!';
    color = '#E65100'; bg = 'linear-gradient(135deg,#FFF3E0,#FFD54F)';
    msg = `<span style="color:#3D2510;">박스 안에 빳빳한 만원권이 가득!</span><br><b style="color:#E65100;">₩1,000,000 즉시 입금!</b><br><span style="font-size:calc(5px * var(--u));color:#B71C1C;">⚠️ ${Math.round(S.blackMoneyTrigger - S.totKm)}km 후 경찰 환수 예정...</span>`;
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
        <div style="font-size:calc(7px * var(--u));color:#3D2510;margin-bottom:3px;">${npc.n}</div>
        <div style="font-size:calc(7px * var(--u));color:#8B6340;margin-bottom:4px;">${npc.role}</div>
        <span style="background:${gc};color:#FFF;font-size:calc(7px * var(--u));padding:2px 5px;border-radius:3px;">[${gl}]</span>
      </div>
    </div>
    ${isCV?`<div style="font-size:calc(7px * var(--u));color:#1565C0;background:#E3F2FD;border-radius:6px;padding:5px 8px;margin-bottom:8px;font-style:italic;">${npc.special||''}</div>`:''}
    <div style="font-size:calc(7px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #D4B483;border-left:4px solid ${gc};border-radius:0 6px 6px 0;padding:7px 9px;margin-bottom:8px;line-height:2;">"${line}"</div>
    <div style="font-size:calc(7px * var(--u));color:#8B6340;margin-bottom:10px;">보상: <span style="color:#3D2510;">${npc.reward}</span></div>
    <button class="px-btn" style="width:100%;font-size:calc(7px * var(--u));" onclick="acceptNpc('${npc.id}',${wr})">${isCV?'...잘 가. (음료를 받는다)':'고마워! 계속 달리자! ▶'}</button>
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
    if(['legend','epic','god'].includes(n.grade)){
      const mythicItem = tryDropMythic(n.grade);
      if(mythicItem){
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
    }
  }
  closeModal(wr);
}
function openFood(){
  const food=FOODS.find(f=>f.c===S.city);if(!food){addLog('neutral','등록된 맛집 없음');return;}if(S.foodDone.includes(S.city)){addLog('neutral','이미 방문!');return;}
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
    <div style="text-align:center;font-size:calc(8px * var(--u));margin-bottom:5px;">${food.e}</div>
    <div style="font-size:calc(7px * var(--u));color:#3D2510;text-align:center;margin-bottom:3px;">${food.n}</div>
    <div style="font-size:calc(6px * var(--u));color:#8B6340;text-align:center;margin-bottom:6px;">${npcName} — ${intro}</div>
    <div id="rps-score" style="font-size:calc(7px * var(--u));color:#5C3D1E;text-align:center;margin-bottom:8px;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:5px;">나 0 : 0 ${isMoon?'토끼':'두목'} (3판 2선승)</div>
    <div id="rps-result" style="font-size:calc(7px * var(--u));color:#5C3D1E;text-align:center;margin-bottom:8px;min-height:calc(30px * var(--u));">선택해 주세요!</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:calc(5px * var(--u));">
      <button class="px-btn" style="font-size:calc(8px * var(--u));padding:calc(10px * var(--u));" onclick="doRps('rock')">✊<br>바위</button>
      <button class="px-btn" style="font-size:calc(8px * var(--u));padding:calc(10px * var(--u));" onclick="doRps('paper')">🖐️<br>보</button>
      <button class="px-btn" style="font-size:calc(8px * var(--u));padding:calc(10px * var(--u));" onclick="doRps('scissor')">✌️<br>가위</button>
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
    `<div style="font-size:calc(7px * var(--u));color:${outcome==='win'?'#1B5E20':outcome==='lose'?'#B71C1C':'#5C3D1E'};">`+
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
  document.getElementById('modal-area').innerHTML=`<div class="px-panel" style="margin-bottom:5px;"><div style="text-align:center;font-size:calc(7px * var(--u));margin-bottom:4px;">${food.e}</div><div style="font-size:calc(7px * var(--u));color:#3D2510;text-align:center;margin-bottom:2px;">${food.n}</div><div style="font-size:calc(7px * var(--u));color:#8B6340;text-align:center;margin-bottom:9px;">초록 구간에서 클릭!</div><div style="position:relative;background:#5C3D1E;border:3px solid #3D2510;border-radius:3px;height:20px;margin-bottom:11px;overflow:hidden;"><div style="position:absolute;top:3px;bottom:3px;left:38%;width:24%;background:#4CAF50;border-radius:2px;"></div><div id="t-ind" style="position:absolute;top:2px;bottom:2px;width:14px;background:#E53935;border-radius:2px;left:0%;transition:none;"></div></div><button class="px-btn px-btn-blue" style="width:100%;font-size:calc(7px * var(--u));padding:12px;" onclick="doTiming()">지금!</button></div>`;
  window.doTiming=()=>{running=false;clearInterval(iv);if(pos>=37&&pos<=63)foodOk(food,wr,800);else foodFail(food,wr);};
  iv=setInterval(()=>{if(!running)return;pos+=dir*spd;if(pos>=95){pos=95;dir=-1;}else if(pos<=0){pos=0;dir=1;}const el=document.getElementById('t-ind');if(el)el.style.left=pos+'%';},40);
}
function showTapGame(food,wr){
  let cnt=0,alive=true;
  document.getElementById('modal-area').innerHTML=`<div class="px-panel" style="margin-bottom:5px;"><div style="text-align:center;font-size:calc(7px * var(--u));margin-bottom:4px;">${food.e}</div><div style="font-size:calc(7px * var(--u));color:#3D2510;text-align:center;margin-bottom:2px;">${food.n}</div><div style="font-size:calc(7px * var(--u));color:#8B6340;text-align:center;margin-bottom:8px;">5초 안에 12번!</div><div style="font-size:calc(7px * var(--u));color:#3D2510;text-align:center;margin:6px 0;" id="tap-cnt">0 / 12</div><div style="font-size:calc(7px * var(--u));color:#8B6340;text-align:center;margin-bottom:9px;" id="tap-t">5초</div><button class="px-btn px-btn-green" style="width:100%;font-size:calc(7px * var(--u));padding:13px;" onclick="doTap()">먹어! 🍴</button></div>`;
  let t=5;const iv=setInterval(()=>{t--;const el=document.getElementById('tap-t');if(el)el.textContent=t+'초';if(t<=0){clearInterval(iv);alive=false;if(cnt<12)foodFail(food,wr);}},1000);
  window.doTap=()=>{if(!alive)return;cnt++;const el=document.getElementById('tap-cnt');if(el)el.textContent=cnt+' / 12';if(cnt>=12){clearInterval(iv);alive=false;foodOk(food,wr,800);}};
}
function showFoodQuiz(food,wr){
  const qd=FOOD_QUIZ[food.c]||{q:'퀴즈!',opts:['A','B','C','D'],ans:0};
  document.getElementById('modal-area').innerHTML=`<div class="px-panel" style="margin-bottom:5px;"><div style="text-align:center;font-size:calc(7px * var(--u));margin-bottom:4px;">${food.e}</div><div style="font-size:calc(7px * var(--u));color:#3D2510;text-align:center;margin-bottom:8px;">${food.n} 퀴즈!</div><div style="font-size:calc(7px * var(--u));color:#3D2510;background:#FFF8DC;border:2px solid #D4B483;border-radius:5px;padding:7px;margin-bottom:9px;line-height:1.9;">${qd.q}</div>${qd.opts.map((o,i)=>`<button class="px-btn px-btn-sm" style="width:100%;margin-bottom:4px;text-align:left;font-size:calc(7px * var(--u));" onclick="checkFoodQ(${i},${qd.ans},'${food.c}',${wr})">${i+1}. ${o}</button>`).join('')}</div>`;
}
function checkFoodQ(sel,ans,city,wr){const food=FOODS.find(f=>f.c===city);if(sel===ans)foodOk(food,wr,800);else foodFail(food,wr);}
function foodOk(food,wr,bonus){
  S.foodDone.push(food.c);
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
function closeModal(wr){
  document.getElementById('modal-area').innerHTML='';
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
  if(currentInJapan && pick.n==='부산'){
    addLog('good','⛴️ 일본 코스 완주! 부산으로 귀국! ('+S.sgTot+'km)');
  } else if(currentInJapan){
    addLog('neutral','🚴 일본 코스 진행 중... '+S.city+'→'+pick.n+' ('+S.sgTot+'km)');
  } else {
    addLog('neutral','🎲 충동! '+S.city+'→'+pick.n+' ('+S.sgTot+'km)');
  }
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
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
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
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🎁 ['+r.label+'] 획득!', 0, -16);
  // 아이콘 + 이름
  ctx.font = '18px monospace';
  ctx.fillText(getSlotIcon(item.slot), -70, 12);
  ctx.fillStyle = '#3D2510';
  ctx.font = 'bold 8px monospace';
  ctx.fillText(item.name, 8, 6);
  ctx.font = '6px monospace';
  ctx.fillStyle = r.color;
  ctx.fillText(effectText(item.slot, item.mult, item), 8, 20);
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
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
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
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
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
  const dust = RARITY_DUST[item.rarity] * (1 + (item.plus||0));
  S.gearDust = (S.gearDust||0) + dust;
  addLog('neutral','🔨 '+item.name+' 분해 → 강화석 +'+dust);
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
    item.mult = item.mult * 1.15; // 강화 +1당 효과 15% 증가
    addLog('good','✨ '+item.name+' +'+item.plus+' 강화 성공!');
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
    <div style="font-size:calc(8px * var(--u));color:${color};text-align:center;margin-bottom:8px;">${opts.title}</div>
    <div style="font-size:calc(7px * var(--u));color:#5C3D1E;background:#FFF8DC;border:2px solid #D4B483;border-radius:6px;padding:calc(8px * var(--u));margin-bottom:calc(10px * var(--u));line-height:2;text-align:center;">
      ${opts.message.replace(/\n/g,'<br>')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:calc(6px * var(--u));">
      <button class="px-btn px-btn-gray" style="font-size:calc(7px * var(--u));padding:calc(10px * var(--u));" onclick="_confirmCancel()">${opts.cancelText||'취소'}</button>
      <button class="px-btn px-btn-green" style="font-size:calc(7px * var(--u));padding:calc(10px * var(--u));" onclick="_confirmOk()">${opts.okText||'확인'}</button>
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
  const wr=S.riding;
  if(S.riding){S.riding=false;isResting=false;clearInterval(tickIv);tickIv=null;}
  doSave(false); // 최신 상태를 코드에 반영
  let code='';
  try{const raw=localStorage.getItem('bkdng_v45');if(raw)code=_encodeSave(raw);}catch(e){}
  document.getElementById('modal-area').innerHTML=`
  <div class="px-panel" style="border-color:#1976D2;margin-bottom:5px;">
    <div style="font-size:calc(8px * var(--u));color:#1976D2;text-align:center;margin-bottom:6px;">🔑 저장코드 백업/복원</div>
    <div style="font-size:calc(6px * var(--u));color:#5C3D1E;margin-bottom:4px;">📤 내 저장코드 — 복사해서 메모장·카톡(나에게) 등에 보관:</div>
    <textarea id="bk-out" readonly style="width:100%;height:calc(40px * var(--u));font-size:calc(5px * var(--u));border:2px solid #D4B483;border-radius:5px;padding:4px;box-sizing:border-box;resize:none;word-break:break-all;">${code}</textarea>
    <button class="px-btn px-btn-blue" style="width:100%;font-size:calc(7px * var(--u));margin:4px 0 10px;" onclick="copyBackupCode()">📋 코드 복사</button>
    <div style="font-size:calc(6px * var(--u));color:#5C3D1E;margin-bottom:4px;">📥 코드를 붙여넣어 복원 — <b style="color:#B71C1C;">현재 진행은 사라져요!</b></div>
    <textarea id="bk-in" placeholder="BKDNG1. 로 시작하는 코드 붙여넣기" style="width:100%;height:calc(30px * var(--u));font-size:calc(5px * var(--u));border:2px solid #D4B483;border-radius:5px;padding:4px;box-sizing:border-box;resize:none;word-break:break-all;"></textarea>
    <button class="px-btn px-btn-green" style="width:100%;font-size:calc(7px * var(--u));margin-top:4px;" onclick="importBackupCode()">📥 복원하기</button>
    <button class="px-btn px-btn-gray" style="width:100%;font-size:calc(7px * var(--u));margin-top:6px;" onclick="closeModal(${wr})">닫기 ▶</button>
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
        if(!S.achievements)S.achievements=[];if(!S.boostCount)S.boostCount=0;if(!S.offlineCount)S.offlineCount=0;
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
        if(d.lpt)applyOfflineReward(d.lpt);
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
function resetGame(){
  if(!confirm('초기화?'))return;localStorage.removeItem('bkdng_v45');saveReady=true; // 초기화 확정 → 새 상태로 자동저장 재개
  S={city:'충주',dest:null,sgKm:0,sgTot:100,totKm:0,xp:0,xpMax:100,lv:1,money:800,hp:100,mhp:100,end:5,speed:6,sp:3,vId:'v1',ap:3,jc:2,dopT:0,dopSp:5,riding:false,restT:0,ecool:0,prevBaseMhp:100,mhpSpBonus:0,moonKm:0,paints:['gray'],activePaint:'gray',gachaCount:0,foodStreak:0,seenTabs:{npc:0,veh:0,ach:0,gear:0},inventory:[],equipped:{head:null,eyes:null,hands:null,feet:null,body:null},npcs:NPCS.map(n=>({...n})),visited:[],foodDone:[],achievements:[],boostCount:0,offlineCount:0,vehs:VEHS.map(v=>({id:v.id,owned:v.owned}))};
  // 2번 fix: 시작 시 보유 탈것/장비 갯수로 seenTabs 초기화 (시작부터 빨간점 안 뜨게)
  S.seenTabs.veh = (S.vehs||[]).filter(v=>v.owned).length;
  S.seenTabs.gear = (S.inventory||[]).length;
  S.seenTabs.npc = S.npcs.filter(n=>n.met&&!n.locked).length;
  S.seenTabs.ach = (S.achievements||[]).length;
  if(tickIv){clearInterval(tickIv);tickIv=null;}isResting=false;boosterBubble=0;evAnim=null;evAnimNpc=null;diceAnim=0;diceTarget=null;tyTalkTimer=1800;tyBubbleTimer=0;tyBubbleText='';oxResult=null;logs=[];
  document.getElementById('ride-btn').textContent='▶ 출발!';
  showSt('초기화 완료');update();
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
  ['main','mission','npc','veh','gear','item','codex','stat','ach','gacha','log'].forEach(t=>{const el=document.getElementById('tab-'+t);if(el)el.style.display=t===tab?'block':'none';});
  document.querySelectorAll('.px-tab').forEach((el,i)=>el.classList.toggle('on',['main','mission','npc','veh','gear','item','codex','stat','ach','gacha','log'][i]===tab));
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
  if(tab==='npc')renderNpcs();if(tab==='veh')renderVehs();if(tab==='gear')renderGear();if(tab==='item')renderItems();if(tab==='stat')renderStat();if(tab==='ach')renderAch();if(tab==='log')renderLog();
}

function renderLog(){const el=document.getElementById('ev-log');if(!logs.length){el.innerHTML='<div class="px-panel" style="font-size:calc(7px * var(--u));text-align:center;color:#8B6340;">아직 이벤트 없음</div>';return;}el.innerHTML=logs.map(e=>`<div class="ev-item ev-${e.type}">${e.msg}</div>`).join('');}

// 2번: 가챠 탭 — 페인트 + 장비 가챠
function renderGachaShop(){
  const u='var(--u)';
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
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
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
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
  let html=`<div class="px-panel" style="font-size:calc(7px * var(--u));color:#8B6340;margin-bottom:5px;">${metCount}/${totalVisible}명 만남</div>`;
  gradeOrder.forEach(grade=>{
    const grpNpcs=S.npcs.filter(n=>n.grade===grade);
    if(!grpNpcs.length)return;
    const gc=GRADE_COLOR[grade]||'#5C3D1E';
    html+=`<div style="font-size:calc(7px * var(--u));color:${gc};margin:8px 6px 4px;padding-bottom:3px;border-bottom:2px solid ${gc};">${gradeLabel[grade]}</div>`;
    grpNpcs.forEach(n=>{
      const em=NPC_EMOJI[n.id]||'👤';
      const gb=GRADE_BG[n.grade]||'#F5E6C8';
      if(n.locked){
        html+=`<div class="px-panel" style="margin-bottom:5px;opacity:.45;display:flex;align-items:center;gap:8px;"><div style="font-size:calc(18px * var(--u));">❓</div><div><div style="font-size:calc(7px * var(--u));color:#8B6340;">??? (${GRADE_LABEL[n.grade]})</div><div style="font-size:calc(7px * var(--u));color:#8B6340;margin-top:2px;">미개방 NPC</div></div></div>`;
      }else{
        html+=`<div class="px-panel" style="margin-bottom:5px;background:${n.met?gb:'#F5E6C8'};border-color:${n.met?gc:'#8B6340'};display:flex;align-items:center;gap:8px;">
          <div style="font-size:calc(18px * var(--u));">${em}</div>
          <div>
            <div style="font-size:calc(7px * var(--u));color:#3D2510;">${n.n}${n.met?' ✓':''}</div>
            <div style="font-size:calc(7px * var(--u));color:${gc};margin-top:1px;">[${GRADE_LABEL[n.grade]}]</div>
            <div style="font-size:calc(7px * var(--u));color:#8B6340;margin-top:1px;">${n.met?n.lines[0]:'???'}</div>
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
    html+=`<div style="font-size:calc(7px * var(--u));color:#8B6340;margin:8px 6px 4px;padding-bottom:3px;border-bottom:2px solid #D4B483;">${cat.label}</div>`;
    catVehs.forEach(v=>{
      const cur=v.id===S.vId;
      const owned=vehOwned(v.id);
      const locked=!owned&&S.totKm<v.km;
      const canBuy=!owned&&!locked&&S.money>=v.cost;
      let btn='';
      // 로켓: 보유 중일 때만 여기 도달 → 발사 버튼만 표시
      if(v.cat==='rocket'){
        btn=`<button class="px-btn px-btn-sm px-btn-red" onclick="launchRocket()" style="font-size:calc(7px * var(--u));">🚀발사!</button>`;
      } else {
        if(cur)btn=`<span style="color:#4CAF50;font-size:calc(7px * var(--u));white-space:nowrap;">[현재]</span>`;
        else if(owned)btn=`<button class="px-btn px-btn-sm px-btn-green" onclick="switchVeh('${v.id}')">변경</button>`;
        else if(canBuy)btn=`<button class="px-btn px-btn-sm px-btn-green" onclick="buyVeh('${v.id}')">₩${v.cost.toLocaleString()}</button>`;
        else if(!owned&&!locked)btn=`<div style="font-size:calc(7px * var(--u));color:#8B6340;">₩${v.cost.toLocaleString()}<br>(돈부족)</div>`;
        else btn=`<div style="font-size:calc(7px * var(--u));color:#8B6340;">🔒<br>${v.km.toLocaleString()}km</div>`;
      }
      const canvasId='vc-'+v.id;
      const rocketNote=v.cat==='rocket'?`<div style="font-size:calc(5px * var(--u));color:#E53935;margin-top:2px;">1회용 · 5% 폭발확률</div><div style="font-size:calc(5px * var(--u));color:#8B6340;margin-top:1px;">🔒 나로호발사센터에서만 구매 가능</div>`:'';
      html+=`<div class="px-panel" style="margin-bottom:5px;${cur?'border-color:#4CAF50;':''}${v.cat==='rocket'&&owned?'border-color:#FF6D00;background:#FFF3E0;':''}${locked?'opacity:.5':''}">
        <div style="display:flex;align-items:center;gap:10px;">
          <canvas id="${canvasId}" width="80" height="50" class="veh-canvas"></canvas>
          <div style="flex:1;">
            <div style="font-size:calc(7px * var(--u));color:#3D2510;">${v.n}${owned&&!cur&&v.cat!=='rocket'?' <span style="font-size:calc(7px * var(--u));color:#1976D2;">[보유]</span>':''}</div>
            <div style="font-size:calc(7px * var(--u));color:#8B6340;margin-top:2px;">🏎️ ${v.sp}km/h &nbsp; ❤️+${v.hb} &nbsp; <span style="color:#B71C1C;">💔${(0.30 * (v.sp/6)).toFixed(2)}/s</span></div>
            ${rocketNote}
            ${locked?`<div style="font-size:calc(7px * var(--u));color:#8B6340;">🔒 ${v.km.toLocaleString()}km 필요</div>`:''}
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
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
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
  const fs=(px)=>`font-size:calc(${px}px * ${u})`;
  // 5번: 펫 정보
  const pet = getPetStage();
  // 1번 fix: nextThresholds를 getPetStage와 동일한 기준으로 통일 (2K/10K/30K)
  const nextThresholds = [2000, 10000, 30000];
  const nextKm = nextThresholds.find(t => t > (S.totKm||0));
  const petNextText = nextKm
    ? `다음 진화까지 ${(nextKm - Math.floor(S.totKm||0)).toLocaleString()}km`
    : '최대 진화 도달! ✨';

  document.getElementById('stat-panel').innerHTML=`
  <div class="px-panel" style="margin-bottom:5px;background:linear-gradient(135deg,#FFF8E1,#FFFDE7);border-color:${pet.textColor};">
    <div style="${fs(7)};color:${pet.textColor};margin-bottom:6px;text-align:center;font-weight:bold;text-shadow:1px 1px 0 #FFF;">${pet.name} (${pet.stage}/4 단계)</div>
    <div style="${fs(5)};color:#5C3D1E;text-align:center;font-weight:bold;">${petNextText}</div>
  </div>
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
  let html=`<div class="px-panel" style="margin-bottom:5px;font-size:calc(7px * var(--u));color:#8B6340;">달성: ${done}/${ACHIEVEMENTS.length}</div>`;
  groups.forEach(grp=>{
    html+=`<div style="font-size:calc(7px * var(--u));color:#8B6340;margin:8px 6px 4px;padding-bottom:3px;border-bottom:2px solid #D4B483;">${grp}</div>`;
    ACHIEVEMENTS.filter(a=>a.grp===grp).forEach(ach=>{
      const isDone=S.achievements.includes(ach.id);
      const rw=Object.entries(ach.rw).map(([k,v2])=>{if(k==='money')return'₩'+v2.toLocaleString();if(k==='xp')return'XP+'+v2;if(k==='sp')return'SP+'+v2;if(k==='jc')return'🧃+'+v2;return k+':'+v2;}).join(', ');
      html+=`<div class="ach-item ${isDone?'ach-done':''}">
        <div style="font-size:calc(7px * var(--u));flex-shrink:0;">${ach.emoji}</div>
        <div><div style="font-size:calc(7px * var(--u));color:${isDone?'#1B5E20':'#3D2510'};">${ach.name}${isDone?' ✓':''}</div>
        <div style="font-size:calc(7px * var(--u));color:#8B6340;margin-top:2px;">${ach.desc}</div>
        <div style="font-size:calc(7px * var(--u));color:${isDone?'#4CAF50':'#8B6340'};margin-top:1px;">보상: ${rw}</div></div>
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
  // 3번: 탈출 주사위 버튼 (함정 도시 + 50km 누적 시)
  const trapBtn = document.getElementById('trapDiceBtn');
  if(trapBtn){
    if(S.trapZone && S.trapZone.lastDiceAt > 0){
      trapBtn.style.display = 'block';
      const remaining = 200 - Math.floor(S.trapZone.kmIn);
      trapBtn.innerHTML = '🎲 탈출 주사위! ('+remaining+'km 남음)';
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
