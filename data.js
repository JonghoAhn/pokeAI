// --- 데이터 설정 ---
const POKEMONS = {
    'pikachu': { name: '피카츄', hp: 100, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', types: ['전기'] },
    'bulbasaur': { name: '이상해씨', hp: 110, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', types: ['풀', '독'] },
    'charmander': { name: '파이리', hp: 95, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', types: ['불'] },
    'squirtle': { name: '꼬부기', hp: 105, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', types: ['물'] },
    'machamp': { name: '괴력몬', hp: 120, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png', types: ['격투'] },
    'alakazam': { name: '후딘', hp: 90, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png', types: ['에스퍼'] },
    'gengar': { name: '팬텀', hp: 100, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', types: ['고스트', '독'] },
    'gyarados': { name: '갸라도스', hp: 130, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png', types: ['물', '비행'] },
    'snorlax': { name: '잠만보', hp: 150, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', types: ['노말'] },
    'dragonite': { name: '망나뇽', hp: 140, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png', types: ['드래곤', '비행'] },
    'metagross': { name: '메타그로스', hp: 135, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png', types: ['강철', '에스퍼'] },
    'lucario': { name: '루카리오', hp: 110, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png', types: ['격투', '강철'] }
};

const SKILLS = {
    '전기': [{ name: '10만볼트', power: 30, type: '전기' }, { name: '번개', power: 45, type: '전기' }, { name: '전기자석파', type: '전기', effect: { type: 'status', status: 'paralysis', chance: 0.9 }, description: "상대를 마비시켜 가끔 행동불능으로 만듭니다." }],
    '풀': [{ name: '잎날가르기', power: 30, type: '풀' }, { name: '솔라빔', power: 40, type: '풀' }],
    '독': [{ name: '오물폭탄', power: 30, type: '독' }, { name: '독엄니', power: 25, type: '독' }],
    '불': [{ name: '화염방사', power: 30, type: '불' }, { name: '불대문자', power: 45, type: '불' }],
    '물': [{ name: '파도타기', power: 30, type: '물' }, { name: '하이드로펌프', power: 40, type: '물' }],
    '격투': [{ name: '인파이트', power: 40, type: '격투' }, { name: '엄청난힘', power: 35, type: '격투' }],
    '에스퍼': [{ name: '사이코키네시스', power: 35, type: '에스퍼' }, { name: '미래예지', power: 40, type: '에스퍼' }],
    '고스트': [{ name: '섀도볼', power: 35, type: '고스트' }, { name: '병상첨병', power: 30, type: '고스트' }],
    '비행': [{ name: '공중날기', power: 30, type: '비행' }, { name: '폭풍', power: 40, type: '비행' }],
    '노말': [{ name: '몸통박치기', power: 20, type: '노말' }, { name: '전광석화', power: 25, type: '노말' }, { name: '이판사판태클', power: 35, type: '노말' }, { name: '파괴광선', power: 50, type: '노말' }, { name: '울음소리', type: '노말', effect: { type: 'stat', target: 'opponent', stat: 'attack', change: -1 }, description: "상대의 공격력을 낮춥니다." }, { name: '칼춤', type: '노말', effect: { type: 'stat', target: 'player', stat: 'attack', change: 2 }, description: "자신의 공격력을 크게 높입니다." }],
    '드래곤': [{ name: '드래곤크루', power: 35, type: '드래곤' }, { name: '용성군', power: 45, type: '드래곤' }],
    '강철': [{ name: '아이언헤드', power: 30, type: '강철' }, { name: '코멧펀치', power: 40, type: '강철' }],
    '바위': [{ name: '스톤샤워', power: 25, type: '바위' }, { name: '스톤에지', power: 40, type: '바위' }],
    '땅': [{ name: '지진', power: 30, type: '땅' }],
    '얼음': [{ name: '냉동빔', power: 35, type: '얼음' }, { name: '눈보라', power: 45, type: '얼음' }],
    '악': [{ name: '깨물어부수기', power: 35, type: '악' }]
};

const TYPE_CHART = {
    '노말': { '바위': 0.5, '고스트': 0, '강철': 0.5 },
    '불': { '불': 0.5, '물': 0.5, '풀': 2, '얼음': 2, '벌레': 2, '바위': 0.5, '드래곤': 0.5, '강철': 2 },
    '물': { '불': 2, '물': 0.5, '풀': 0.5, '땅': 2, '바위': 2, '드래곤': 0.5 },
    '전기': { '물': 2, '전기': 0.5, '풀': 0.5, '땅': 0, '비행': 2, '드래곤': 0.5 },
    '풀': { '불': 0.5, '물': 2, '풀': 0.5, '독': 0.5, '땅': 2, '비행': 0.5, '벌레': 0.5, '바위': 2, '드래곤': 0.5, '강철': 0.5 },
    '얼음': { '불': 0.5, '물': 0.5, '풀': 2, '얼음': 0.5, '땅': 2, '비행': 2, '드래곤': 2, '강철': 0.5 },
    '격투': { '노말': 2, '얼음': 2, '독': 0.5, '비행': 0.5, '에스퍼': 0.5, '벌레': 0.5, '바위': 2, '고스트': 0, '강철': 2, '페어리': 0.5 },
    '독': { '풀': 2, '독': 0.5, '땅': 0.5, '바위': 0.5, '고스트': 0.5, '강철': 0, '페어리': 2 },
    '땅': { '불': 2, '전기': 2, '풀': 0.5, '독': 2, '비행': 0, '벌레': 0.5, '바위': 2, '강철': 2 },
    '비행': { '전기': 0.5, '풀': 2, '격투': 2, '벌레': 2, '바위': 0.5, '강철': 0.5 },
    '에스퍼': { '격투': 2, '독': 2, '에스퍼': 0.5, '강철': 0.5, '악': 0 },
    '벌레': { '불': 0.5, '풀': 2, '격투': 0.5, '독': 0.5, '비행': 0.5, '에스퍼': 2, '고스트': 0.5, '강철': 0.5, '페어리': 0.5, '악': 2 },
    '바위': { '불': 2, '얼음': 2, '격투': 0.5, '땅': 0.5, '비행': 2, '벌레': 2, '강철': 0.5 },
    '고스트': { '노말': 0, '에스퍼': 2, '고스트': 2, '악': 0.5 },
    '드래곤': { '드래곤': 2, '강철': 0.5, '페어리': 0 },
    '강철': { '불': 0.5, '물': 0.5, '전기': 0.5, '얼음': 2, '바위': 2, '강철': 0.5, '페어리': 2 },
    '페어리': { '불': 0.5, '격투': 2, '독': 0.5, '드래곤': 2, '강철': 0.5, '악': 2 },
    '악': { '격투': 0.5, '에스퍼': 2, '고스트': 2, '페어리': 0.5, '악': 0.5 }
};

const growlSkill = SKILLS['노말'].find(s => s.name === '울음소리');

const OPPONENT_POOL = [
    // 쉬운 포켓몬 추가
    { id: 'rattata', name: '꼬렛', hp: 80, maxHp: 80, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png', types: ['노말'], skills: [{ name: '몸통박치기', power: 20, type: '노말' }] },
    { id: 'pidgey', name: '구구', hp: 85, maxHp: 85, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png', types: ['노말', '비행'], skills: [{ name: '공중날기', power: 20, type: '비행' }] },
    { id: 'clefairy', name: '삐삐', hp: 90, maxHp: 90, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png', types: ['페어리'], skills: [{ name: '몸통박치기', power: 20, type: '노말' }] },
    // 기존 포켓몬
    { id: 'pidgeot', name: '피죤투', hp: 100, maxHp: 100, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', types: ['노말', '비행'], skills: [{ name: '공중날기', power: 25, type: '비행' }, growlSkill] },
    { id: 'nidoking', name: '니드킹', hp: 120, maxHp: 120, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png', types: ['독', '땅'], skills: [{ name: '지진', power: 30, type: '땅' }, growlSkill] },
    { id: 'arcanine', name: '윈디', hp: 150, maxHp: 150, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png', types: ['불'], skills: [{ name: '화염방사', power: 30, type: '불' }] },
    { id: 'rhydon', name: '코뿌리', hp: 130, maxHp: 130, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png', types: ['땅', '바위'], skills: [{ name: '스톤샤워', power: 25, type: '바위' }] },
    { id: 'lapras', name: '라프라스', hp: 160, maxHp: 160, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png', types: ['물', '얼음'], skills: [{ name: '냉동빔', power: 35, type: '얼음' }] },
    { id: 'jolteon', name: '쥬피썬더', hp: 140, maxHp: 140, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png', types: ['전기'], skills: [{ name: '번개', power: 40, type: '전기' }] },
    { id: 'exeggutor', name: '나시', hp: 140, maxHp: 140, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png', types: ['풀', '에스퍼'], skills: [{ name: '솔라빔', power: 40, type: '풀' }] },
    { id: 'tyranitar', name: '마기라스', hp: 200, maxHp: 200, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png', types: ['바위', '악'], skills: [{ name: '스톤에지', power: 40, type: '바위' }] },
    { id: 'articuno', name: '프리져', hp: 180, maxHp: 180, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png', types: ['얼음', '비행'], skills: [{ name: '눈보라', power: 45, type: '얼음' }] },
    { id: 'zapdos', name: '썬더', hp: 180, maxHp: 180, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png', types: ['전기', '비행'], skills: [{ name: '번개', power: 45, type: '전기' }] },
    { id: 'moltres', name: '파이어', hp: 180, maxHp: 180, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png', types: ['불', '비행'], skills: [{ name: '불대문자', power: 45, type: '불' }] }
];

const ALL_QUIZZES = [
    // ... (50 quizzes are here, omitted for brevity)
    { question: '인공지능 기술을 모든 사람이 공평하게 누려야 한다는 원칙은 무엇일까요?', options: ['공공성', '책임성', '안전성', '투명성'], answer: '공공성', explanation: "인공지능 기술의 혜택이 특정 사람이나 집단에게만 돌아가지 않고, 사회 전체의 이익을 위해 사용되어야 한다는 원칙을 '공공성'이라고 해요. 사회적 약자를 돕는 기술 등이 좋은 예시입니다." },
    { question: '인공지능이 내린 판단의 이유와 과정을 사람이 이해할 수 있어야 한다는 원칙은 무엇일까요?', options: ['투명성', '인권 보장', '다양성 존중', '데이터 관리'], answer: '투명성', explanation: "인공지능이 왜 그런 결정을 내렸는지 알 수 있어야 우리는 그 결과를 신뢰하고, 문제가 생겼을 때 원인을 찾아 고칠 수 있어요. 이를 '투명성' 또는 '설명가능성'이라고 합니다." },
    { question: '인공지능을 학습시킬 때, 다양한 성별, 인종, 나이의 데이터를 골고루 사용해야 하는 이유는 무엇일까요?', options: ['편향과 차별을 막기 위해', '학습 속도를 높이기 위해', '데이터 양을 늘리기 위해', '인공지능을 헷갈리게 하기 위해'], answer: '편향과 차별을 막기 위해', explanation: "인공지능은 데이터에 담긴 편견까지 학습해요. 다양한 데이터를 사용하지 않으면 특정 집단에게 불리한 결정을 내리는 차별적인 인공지능이 될 수 있기 때문에 '다양성 존중'이 중요해요." },
    { question: '자율주행 자동차가 사고를 냈을 때, 그 책임은 누구에게 있을까요?', options: ['개발자, 제조사, 사용자 모두에게 책임이 있을 수 있다', '무조건 운전자에게만 책임이 있다', '무조건 자동차 제조사에게만 책임이 있다', '인공지능에게만 책임이 있다'], answer: '개발자, 제조사, 사용자 모두에게 책임이 있을 수 있다', explanation: "인공지능으로 인한 사고의 책임 소재는 매우 복잡한 문제예요. 안전한 기술을 만들 책임, 안전하게 관리할 책임, 올바르게 사용할 책임 등 여러 주체에게 책임이 있을 수 있어 사회적 합의가 필요합니다." },
    { question: '친구의 허락 없이 얼굴 사진을 인공지능 앱으로 합성해서 다른 사람에게 보내는 행동은 왜 잘못되었을까요?', options: ['초상권과 프라이버시를 침해하기 때문에', '합성 앱 사용법을 몰라서', '사진이 예쁘게 나오지 않아서', '다른 친구들이 재미없어해서'], answer: '초상권과 프라이버시를 침해하기 때문에', explanation: "모든 사람은 자신의 얼굴 사진이 함부로 사용되지 않을 권리(초상권)와 사생활을 보호받을 권리(프라이버시)가 있어요. 아무리 친한 친구라도 꼭 동의를 구해야 합니다." },
    { question: '인공지능 챗봇에게 나쁜 말을 계속 사용하면 어떤 문제가 생길 수 있을까요?', options: ['챗봇이 나쁜 말을 배워 다른 사람에게 사용할 수 있다', '챗봇의 수명이 짧아진다', '인터넷 속도가 느려진다', '우리 집 전기 요금이 많이 나온다'], answer: '챗봇이 나쁜 말을 배워 다른 사람에게 사용할 수 있다', explanation: "인공지능 챗봇은 사람들과의 대화를 통해 학습해요. 우리가 나쁜 말을 사용하면 챗봇도 그것을 배워 다른 사람에게 상처를 주는 말을 할 수 있어요. 인공지능에게도 존중하는 태도를 보여야 해요." },
    { question: '인공지능이 만든 그림이나 음악의 주인(저작권)은 누구일까요?', options: ['아직 규칙을 정하는 중인 복잡한 문제이다', '무조건 인공지능이다', '무조건 인공지능을 사용한 사람이다', '주인이 없어 누구나 마음대로 써도 된다'], answer: '아직 규칙을 정하는 중인 복잡한 문제이다', explanation: "인공지능 창작물의 저작권을 누구에게 줄 것인지는 아직 전 세계적으로 논의 중인 어려운 문제예요. 기술을 만든 사람, 사용한 사람, 인공지능 자체 중 누구의 기여가 더 큰지 판단하기 어렵기 때문이죠." },
    { question: '인공지능 기술의 발전을 위해 개인정보를 마음대로 수집해도 될까요?', options: ['안된다, 개인정보는 꼭 필요한 만큼만, 동의를 받고 수집해야 한다', '된다, 기술 발전이 더 중요하기 때문이다', '된다, 어차피 다른 사람들은 내 정보에 관심 없다', '안된다, 개인정보는 기술 발전에 도움이 안 된다'], answer: '안된다, 개인정보는 꼭 필요한 만큼만, 동의를 받고 수집해야 한다', explanation: "개인정보는 매우 소중하며, 법으로 보호받고 있어요. 인공지능을 개발할 때에도 반드시 정보 주체의 동의를 받고, 꼭 필요한 최소한의 정보만을 안전하게 수집하고 관리해야 합니다." },
    { question: '인공지능이 추천해주는 영상이나 뉴스만 계속 보면 어떤 문제가 생길 수 있을까요?', options: ['생각이 한쪽으로 치우칠 수 있다', '더 똑똑해질 수 있다', '시력이 좋아진다', '새로운 친구를 사귈 수 있다'], answer: '생각이 한쪽으로 치우칠 수 있다', explanation: "인공지능은 내가 좋아할 만한 콘텐츠만 계속 보여줘요. 이런 정보만 계속 접하다 보면 다양한 생각을 접할 기회를 잃고, 마치 나만의 생각의 거품(필터 버블)에 갇히게 될 수 있어요." },
    { question: '인공지능 기술을 올바르게 활용한 예시는 무엇일까요?', options: ['장애인을 위한 보조 도구를 만든다', '가짜뉴스를 만들어 퍼뜨린다', '시험 문제를 대신 풀게 한다', '다른 사람의 비밀번호를 알아낸다'], answer: '장애인을 위한 보조 도구를 만든다', explanation: "인공지능 기술은 모든 사람이 동등한 기회를 누리고, 더 나은 삶을 살 수 있도록 돕는 '공공성'을 위해 사용될 때 가장 가치가 있어요. 사회적 약자를 돕는 기술이 좋은 예입니다." },
    { question: '인간의 지능적인 행동을 컴퓨터가 모방하도록 하는 기술을 무엇이라고 할까요?', options: ['인공지능', '가상현실', '사물인터넷', '블록체인'], answer: '인공지능', explanation: "인공지능(AI)은 인간의 학습, 추론, 지각 능력 등을 컴퓨터 프로그램을 통해 실현하는 기술을 말합니다. 우리 생활 곳곳에서 이미 많이 사용되고 있어요." },
    { question: '컴퓨터가 데이터를 통해 스스로 학습하여 성능을 향상시키는 기술은 무엇일까요?', options: ['머신러닝', '딥러닝', '컴퓨터 비전', '자연어 처리'], answer: '머신러닝', explanation: "머신러닝은 인공지능의 한 분야로, 컴퓨터에 명시적으로 규칙을 프로그래밍하지 않아도 데이터로부터 학습하여 특정 작업을 수행할 수 있게 하는 기술입니다." },
    { question: '인간의 뇌 신경망을 모방하여 복잡한 패턴을 학습하는 인공지능 기술은 무엇일까요?', options: ['딥러닝', '머신러닝', '알고리즘', '데이터베이스'], answer: '딥러닝', explanation: "딥러닝은 머신러닝의 한 종류로, 인공신경망을 여러 겹으로 깊게 쌓아올려 더 복잡하고 추상적인 데이터를 학습할 수 있게 만든 기술입니다. 이미지나 음성 인식에서 뛰어난 성능을 보여줍니다." },
    { question: '인공지능이 인간의 생명과 안전에 해를 끼치지 않아야 한다는 원칙은 무엇일까요?', options: ['인간 존엄성 원칙', '공공선 원칙', '합목적성 원칙', '투명성 원칙'], answer: '인간 존엄성 원칙', explanation: "인간 존엄성 원칙은 인공지능이 인간의 고유한 가치와 존엄성을 최우선으로 존중해야 하며, 어떠한 경우에도 인간에게 해를 끼쳐서는 안 된다는 가장 기본적인 원칙입니다." },
    { question: '인공지능 기술이 사회 전체의 이익을 위해 사용되어야 한다는 원칙은 무엇일까요?', options: ['사회의 공공선 원칙', '인간 존엄성 원칙', '기술의 합목적성 원칙', '책임성 원칙'], answer: '사회의 공공선 원칙', explanation: "사회의 공공선 원칙은 인공지능 기술이 모든 사람, 특히 사회적 약자를 포함한 공동체 전체의 복지와 이익을 증진하는 방향으로 개발되고 활용되어야 한다는 것을 의미합니다." },
    { question: '인공지능 기술은 인류의 삶에 도움이 되는 도구로써 올바른 목적을 가져야 한다는 원칙은 무엇일까요?', options: ['기술의 합목적성 원칙', '프라이버시 보호 원칙', '다양성 존중 원칙', '안전성 원칙'], answer: '기술의 합목적성 원칙', explanation: "기술의 합목적성 원칙은 인공지능이 인류의 번영과 행복이라는 목적에 부합하게, 그리고 그 개발 과정 또한 윤리적으로 이루어져야 한다는 것을 강조하는 원칙입니다." },
    { question: '인공지능 면접관이 특정 성별의 지원자에게만 계속 낮은 점수를 준다면, 어떤 윤리 원칙에 어긋나는 것일까요?', options: ['다양성 존중', '안전성', '연대성', '공공성'], answer: '다양성 존중', explanation: "다양성 존중 원칙은 인공지능이 성별, 인종, 나이, 장애 등 개인의 특성에 따라 차별적인 결과를 내놓아서는 안 되며, 모든 사람에게 공정해야 한다는 것을 의미합니다." },
    { question: '인공지능 스피커가 나의 대화를 몰래 녹음해서 다른 회사에 팔았다면, 어떤 권리를 침해한 것일까요?', options: ['프라이버시', '저작권', '상표권', '행복추구권'], answer: '프라이버시', explanation: "프라이버시 보호는 인공지능이 개인의 사적인 정보(대화, 위치, 습관 등)를 동의 없이 수집하거나 함부로 사용해서는 안 된다는 중요한 윤리 원칙입니다." },
    { question: '스스로 운전하는 자율주행차가 갑자기 오작동하여 사고가 났을 때, 그 피해에 대한 책임을 명확히 해야 한다는 원칙은 무엇일까요?', options: ['책임성', '안전성', '투명성', '데이터 관리'], answer: '책임성', explanation: "책임성 원칙은 인공지능으로 인해 문제가 발생했을 때, 그 책임이 누구에게 있는지(개발자, 사용자, 제조사 등) 명확히 하여 피해를 구제받을 수 있도록 해야 한다는 것을 의미합니다." },
    { question: '인공지능이 악의적인 해커에게 공격당해 오작동하지 않도록 튼튼하게 만들어야 한다는 원칙은 무엇일까요?', options: ['안전성', '공공성', '연대성', '침해금지'], answer: '안전성', explanation: "안전성 원칙은 인공지능 시스템이 개발부터 활용까지 모든 과정에서 잠재적인 위험을 방지하고, 외부 공격이나 내부 오류로부터 안전하게 작동해야 한다는 것을 강조합니다." },
    { question: '인공지능을 개발할 때, 수집한 개인정보를 원래 목적 외에 다른 용도로 사용하면 안 된다는 원칙은 무엇과 관련 깊을까요?', options: ['데이터 관리', '책임성', '투명성', '안전성'], answer: '데이터 관리', explanation: "올바른 데이터 관리는 개인정보를 포함한 모든 데이터를 목적에 맞게 합법적으로 수집하고, 편향되지 않게 관리하며, 안전하게 보호해야 한다는 원칙입니다." },
    { question: '인공지능 기술을 사람에게 해를 끼치는 무기 개발 등에 사용해서는 안 된다는 원칙은 무엇일까요?', options: ['침해금지', '연대성', '공공성', '다양성 존중'], answer: '침해금지', explanation: "침해금지 원칙은 인공지능을 인간에게 직접적 또는 간접적으로 해를 입히는 목적으로 개발하거나 활용해서는 안 된다는 강력한 윤리적 요구사항입니다." },
    { question: '인공지능 기술의 혜택을 모든 나라와 사람들이 함께 누릴 수 있도록 국제 사회가 협력해야 한다는 원칙은 무엇일까요?', options: ['연대성', '책임성', '안전성', '투명성'], answer: '연대성', explanation: "연대성 원칙은 인공지능 기술 발전의 혜택을 특정 국가나 집단만이 아닌, 미래 세대를 포함한 모든 인류가 함께 누릴 수 있도록 서로 협력하고 노력해야 한다는 것을 의미합니다." },
    { question: '컴퓨터가 이미지나 영상을 보고 그 안에 무엇이 있는지 이해하는 인공지능 분야는 무엇일까요?', options: ['컴퓨터 비전', '자연어 처리', '음성 인식', '생성형 AI'], answer: '컴퓨터 비전', explanation: "컴퓨터 비전은 컴퓨터에 시각적 능력을 부여하는 기술로, 자율주행차가 주변 환경을 인식하거나, 사진 속 얼굴을 찾아내는 데 사용됩니다." },
    { question: '컴퓨터가 사람의 말을 알아듣고 글자로 바꾸거나, 글자를 읽어 사람의 목소리로 들려주는 기술 분야는 무엇일까요?', options: ['음성 인식 및 합성', '컴퓨터 비전', '추천 시스템', '딥페이크'], answer: '음성 인식 및 합성', explanation: "인공지능 스피커나 스마트폰 비서가 우리의 말을 알아듣고 대답하는 것이 바로 음성 인식 및 합성 기술 덕분입니다." },
    { question: '컴퓨터가 인간이 사용하는 언어(자연어)의 의미를 이해하고, 문장을 생성하거나 번역하는 기술 분야는 무엇일까요?', options: ['자연어 처리', '컴퓨터 비전', '머신러닝', '데이터 분석'], answer: '자연어 처리', explanation: "챗봇이 우리의 질문에 대답하거나, 번역기가 외국어를 한국어로 바꿔주는 것은 자연어 처리 기술을 기반으로 합니다." },
    { question: '글이나 그림, 음악 등 새로운 창작물을 만들어내는 인공지능을 무엇이라고 할까요?', options: ['생성형 AI', '분석형 AI', '약인공지능', '강인공지능'], answer: '생성형 AI', explanation: "생성형 AI는 기존 데이터를 학습하여 완전히 새로운 텍스트, 이미지, 코드 등을 만들어내는 인공지능으로, ChatGPT나 DALL-E 등이 대표적입니다." },
    { question: '인공지능이 특정 인물의 얼굴이나 목소리를 진짜처럼 합성하여 가짜 영상이나 음성을 만드는 기술은 무엇일까요?', options: ['딥페이크', '필터 버블', '가짜뉴스', '알고리즘'], answer: '딥페이크', explanation: "딥페이크 기술은 재미있게 사용될 수도 있지만, 다른 사람을 속이거나 가짜뉴스를 만드는 등 나쁜 목적으로 악용될 수 있어 매우 조심해야 합니다." },
    { question: '인공지능이 나의 검색 기록이나 시청 습관을 분석하여 좋아할 만한 상품이나 영상을 계속 보여주는 것을 무엇이라고 할까요?', options: ['추천 시스템', '소셜 미디어', '검색 엔진', '데이터베이스'], answer: '추천 시스템', explanation: "추천 시스템은 편리하지만, 내가 보고 싶은 정보만 보게 만들어 생각의 폭을 좁히는 '필터 버블' 현상을 일으킬 수도 있습니다." },
    { question: '인공지능 채용 시스템이 여성 지원자에게 남성 지원자보다 낮은 점수를 준다면, 그 원인으로 가장 가능성이 높은 것은 무엇일까요?', options: ['학습 데이터의 편향성', '알고리즘의 계산 오류', '컴퓨터 바이러스 감염', '지원자의 컴퓨터 사양 문제'], answer: '학습 데이터의 편향성', explanation: "인공지능은 학습한 데이터에 따라 판단합니다. 과거 남성 위주로 채용했던 데이터로 학습했다면, 인공지능도 그 편견을 그대로 따라할 수 있습니다." },
    { question: '인공지능 시대에 필요한 윤리적 태도가 아닌 것은 무엇일까요?', options: ['인공지능의 결과를 무조건 믿는다', '인공지능의 판단을 비판적으로 생각한다', '개인정보 보호의 중요성을 안다', '인공지능을 좋은 목적으로 사용한다'], answer: '인공지능의 결과를 무조건 믿는다', explanation: "인공지능은 완벽하지 않으며 실수하거나 편향된 결과를 낼 수 있습니다. 따라서 우리는 항상 그 결과를 비판적으로 검토하고 올바르게 활용해야 합니다." },
    { question: '다음 중 인공지능 기술이 사회에 긍정적인 영향을 미치는 사례는 무엇일까요?', options: ['질병을 조기에 진단하여 치료를 돕는다', '가짜뉴스를 만들어 사회 혼란을 일으킨다', '사람들의 일자리를 모두 빼앗는다', '개인정보를 몰래 수집하여 판매한다'], answer: '질병을 조기에 진단하여 치료를 돕는다', explanation: "인공지능은 의료 영상을 분석하여 의사가 발견하기 어려운 질병의 징후를 찾아내는 등 인류의 건강과 복지를 위해 매우 유용하게 사용될 수 있습니다." },
    { question: '인공지능 시대에 사라질 가능성이 높은 직업의 특징은 무엇일까요?', options: ['단순하고 반복적인 업무', '창의적이고 복잡한 문제 해결', '다른 사람과 소통하고 공감하는 일', '새로운 것을 기획하고 만드는 일'], answer: '단순하고 반복적인 업무', explanation: "인공지능은 정해진 규칙에 따라 반복되는 작업을 사람보다 훨씬 빠르고 정확하게 처리할 수 있습니다. 반면, 창의성, 공감 능력, 비판적 사고 등은 인간 고유의 강점으로 남을 것입니다." },
    { question: '인공지능 시대에 더욱 중요해지는 능력은 무엇일까요?', options: ['비판적 사고력과 문제 해결 능력', '단순 암기 능력', '빠른 계산 능력', '정해진 규칙을 따르는 능력'], answer: '비판적 사고력과 문제 해결 능력', explanation: "인공지능이 많은 지식과 정보를 제공해주기 때문에, 우리는 그 정보를 바탕으로 올바른 질문을 하고, 비판적으로 분석하며, 복잡한 문제를 해결하는 능력을 키우는 것이 더 중요해집니다." },
    { question: '인공지능을 윤리적으로 사용하기 위한 우리의 자세로 올바른 것은 무엇일까요?', options: ['인공지능으로 과제를 대신하게 하고 내가 한 것처럼 제출하지 않는다', '친구의 동의 없이 딥페이크 영상을 만든다', '인공지능 챗봇에게 나쁜 말을 가르친다', '인공지능이 추천하는 정보만 본다'], answer: '인공지능으로 과제를 대신하게 하고 내가 한 것처럼 제출하지 않는다', explanation: "인공지능은 편리한 도구이지만, 그것을 활용하여 스스로 배우고 성장해야 합니다. 정직하게 사용하는 것이 인공지능 시대의 중요한 윤리입니다." },
    { question: '인공지능이 우리 사회에 미치는 영향에 대한 설명으로 틀린 것은 무엇일까요?', options: ['인공지능은 항상 100% 정확하고 공정하다', '새로운 직업이 생겨나고 사라지는 직업도 있다', '생활을 편리하게 만들어준다', '잘못 사용하면 위험할 수 있다'], answer: '인공지능은 항상 100% 정확하고 공정하다', explanation: "인공지능은 학습한 데이터나 알고리즘 설계에 따라 오류를 범하거나 편향된 결과를 낼 수 있습니다. 완벽한 기술이 아니라는 점을 항상 기억해야 합니다." },
    { question: '인공지능 윤리 교육이 필요한 가장 큰 이유는 무엇일까요?', options: ['인공지능을 인간을 위해 올바르게 사용하기 위해', '인공지능을 더 빨리 개발하기 위해', '모든 사람이 프로그래머가 되기 위해', '인공지능과 대결에서 이기기 위해'], answer: '인공지능을 인간을 위해 올바르게 사용하기 위해', explanation: "인공지능은 매우 강력한 기술이기 때문에, 우리가 윤리적 가치와 책임감을 가지고 올바르게 사용하지 않으면 오히려 인간에게 해가 될 수 있습니다." },
    { question: '인공지능이 그린 그림을 미술대회에 출품할 때, 어떤 점이 윤리적 문제가 될 수 있을까요?', options: ['자신이 직접 그린 것처럼 속이는 것', '그림의 주제가 너무 어려운 것', '사용한 인공지능 프로그램이 너무 비싼 것', '그림의 크기가 너무 큰 것'], answer: '자신이 직접 그린 것처럼 속이는 것', explanation: "인공지능의 도움을 받았다면 그 사실을 정직하게 밝혀야 합니다. 기술을 활용하는 것과 창작의 주체를 속이는 것은 다른 문제입니다." },
    { question: '인공지능 스피커를 개발할 때, 사회적 약자(어린이, 노인)의 목소리를 잘 알아듣도록 만드는 것은 어떤 윤리 원칙과 관련이 깊을까요?', options: ['다양성 존중 및 접근성 보장', '책임성', '투명성', '안전성'], answer: '다양성 존중 및 접근성 보장', explanation: "인공지능 기술은 모든 사람이 차별 없이 쉽게 사용하고 혜택을 누릴 수 있도록 개발되어야 합니다. 이는 다양성과 접근성을 보장하는 중요한 윤리적 고려사항입니다." },
    { question: '병원에서 인공지능이 환자의 병을 진단할 때, 의사가 그 진단 결과를 다시 한번 확인하는 이유는 무엇일까요?', options: ['인공지능의 실수를 방지하고 최종 책임을 지기 위해', '인공지능을 믿지 못해서', '시간을 더 오래 끌기 위해', '환자에게 비용을 더 받기 위해'], answer: '인공지능의 실수를 방지하고 최종 책임을 지기 위해', explanation: "중요한 결정, 특히 사람의 생명과 관련된 결정은 인공지능에게만 맡길 수 없습니다. 인간 전문가가 최종적으로 검토하고 책임지는 '인간 중심' 원칙이 필요합니다." },
    { question: '인공지능이 특정 인종에 대한 나쁜 편견을 학습하지 않도록 데이터를 관리하는 것은 누구의 책임일까요?', options: ['개발자', '사용자', '정부', '모두의 책임'], answer: '개발자', explanation: "물론 모두의 책임이지만, 1차적으로는 인공지능을 설계하고 학습시키는 개발자가 편향되지 않은 데이터를 사용하고 공정한 알고리즘을 만들 책임이 있습니다." },
    { question: '인공지능이 내린 결정에 대해 "왜 그렇게 판단했는지" 이유를 설명할 수 있는 것을 무엇이라고 할까요?', options: ['설명가능성 (XAI)', '정확성', '효율성', '보안성'], answer: '설명가능성 (XAI)', explanation: "설명가능한 인공지능(Explainable AI)은 인공지능의 판단 과정을 사람이 이해할 수 있도록 하여 기술의 신뢰도를 높이고 문제 발생 시 원인을 파악하는 데 도움을 줍니다." },
    { question: '인공지능 기술의 발전을 위해 가장 기본적으로 필요한 것은 무엇일까요?', options: ['많은 양의 데이터', '가장 빠른 컴퓨터', '유명한 과학자', '많은 돈'], answer: '많은 양의 데이터', explanation: "대부분의 인공지능, 특히 머신러닝과 딥러닝은 대규모의 데이터를 학습함으로써 성능이 향상됩니다. 데이터는 인공지능의 '음식'과도 같습니다." },
    { question: '인공지능이 내 친구의 목소리를 흉내내서 부모님께 돈을 요구하는 전화를 걸었다면, 이는 어떤 기술을 악용한 사례일까요?', options: ['음성 합성 (딥보이스)', '이미지 인식', '추천 시스템', '자율주행'], answer: '음성 합성 (딥보이스)', explanation: "음성 합성 기술을 악용하면 보이스피싱과 같은 범죄에 사용될 수 있습니다. 모르는 사람의 부탁이나 의심스러운 연락은 항상 확인하는 습관이 중요합니다." },
    { question: '인공지능 기술을 활용하여 환경오염 문제를 해결하려는 노력은 어떤 윤리 원칙에 해당할까요?', options: ['사회의 공공선 원칙', '인간 존엄성 원칙', '프라이버시 보호 원칙', '투명성 원칙'], answer: '사회의 공공선 원칙', explanation: "인공지능을 활용하여 기후 변화를 예측하거나, 쓰레기 분리수거 효율을 높이는 등 지구 환경을 보호하고 인류 공동의 이익에 기여하는 것은 공공선 원칙의 좋은 예입니다." },
    { question: '인공지능 챗봇과 대화할 때, 나의 개인정보(이름, 주소, 전화번호)를 알려주면 안 되는 이유는 무엇일까요?', options: ['개인정보가 유출되어 악용될 수 있기 때문에', '챗봇이 혼란스러워하기 때문에', '대화가 재미없어지기 때문에', '법으로 금지되어 있기 때문에'], answer: '개인정보가 유출되어 악용될 수 있기 때문에', explanation: "인공지능 서비스가 어떻게 정보를 관리하는지 100% 알 수 없으므로, 민감한 개인정보는 함부로 공유하지 않는 것이 안전합니다. 이는 프라이버시를 스스로 지키는 중요한 행동입니다." },
    { question: "다음 중 '약인공지능(Weak AI)'에 해당하는 것은 무엇일까요?", options: ['스마트폰의 음성 비서', '사람처럼 생각하고 감정을 느끼는 로봇', '스스로 의식을 가진 컴퓨터', '모든 것을 아는 슈퍼컴퓨터'], answer: '스마트폰의 음성 비서', explanation: "약인공지능은 특정 작업(음성 인식, 번역 등)만 잘 수행하도록 설계된 인공지능입니다. 현재 우리가 사용하는 대부분의 AI는 약인공지능에 해당합니다." },
    { question: '사람처럼 자유로운 사고와 감정을 가지는 인공지능을 무엇이라고 할까요?', options: ['강인공지능 (Strong AI)', '약인공지능 (Weak AI)', '머신러닝', '알고리즘'], answer: '강인공지능 (Strong AI)', explanation: "강인공지능은 인간과 같은 지적 능력을 가진 인공지능을 의미하며, 아직은 영화 속에서나 등장하는 개념으로 실제 개발되지는 않았습니다." },
    { question: '인공지능이 만든 창작물(그림, 소설)을 사용할 때 가장 먼저 고려해야 할 윤리적 문제는 무엇일까요?', options: ['저작권 문제', '색감이 아름다운지', '내용이 재미있는지', '글자 수가 너무 많은지'], answer: '저작권 문제', explanation: "인공지능이 학습한 데이터에 다른 사람의 저작물이 포함될 수 있고, 생성된 창작물의 저작권을 누가 가지는지에 대한 규칙이 아직 명확하지 않으므로, 상업적으로 사용할 때는 특히 주의해야 합니다." },
    { question: '인공지능 기술이 발전하면서, 우리 사회가 함께 고민하고 규칙을 만들어가야 하는 이유는 무엇일까요?', options: ['기술이 인간과 사회에 미치는 영향이 매우 크기 때문에', '인공지능이 너무 비싸기 때문에', '과학자들이 심심해하기 때문에', '모두가 인공지능 전문가가 되어야 해서'], answer: '기술이 인간과 사회에 미치는 영향이 매우 크기 때문에', explanation: "인공지능은 단순히 편리한 도구를 넘어, 우리의 일, 관계, 사회 구조까지 바꿀 수 있는 강력한 기술입니다. 따라서 모든 사회 구성원이 함께 논의하여 올바른 방향으로 발전하도록 이끌어야 합니다." }
];
        
const DEFAULT_SKILL = { name: '몸통박치기', power: 20, type: '노말' };
const STRUGGLE_SKILL = { name: '발버둥치기', power: 20, type: '노말', isStruggle: true };
