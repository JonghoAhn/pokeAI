// --- Data Settings ---
// This file contains all the necessary data for the game, including Pokemon stats, skills, type charts, and quiz questions.

const TYPE_CHART = {
    '노말': { strong: [], weak: ['바위', '강철'], immune: ['고스트'] },
    '불꽃': { strong: ['풀', '얼음', '벌레', '강철'], weak: ['불꽃', '물', '바위', '드래곤'], immune: [] },
    '물': { strong: ['불꽃', '땅', '바위'], weak: ['물', '풀', '드래곤'], immune: [] },
    '풀': { strong: ['물', '땅', '바위'], weak: ['불꽃', '풀', '독', '비행', '벌레', '드래곤', '강철'], immune: [] },
    '전기': { strong: ['물', '비행'], weak: ['풀', '전기', '드래곤'], immune: ['땅'] },
    '얼음': { strong: ['풀', '땅', '비행', '드래곤'], weak: ['불꽃', '물', '얼음', '강철'], immune: [] },
    '격투': { strong: ['노말', '얼음', '바위', '악', '강철'], weak: ['독', '비행', '에스퍼', '벌레', '페어리'], immune: ['고스트'] },
    '독': { strong: ['풀', '페어리'], weak: ['독', '땅', '바위', '고스트'], immune: ['강철'] },
    '땅': { strong: ['불꽃', '전기', '독', '바위', '강철'], weak: ['풀', '벌레'], immune: ['비행'] },
    '비행': { strong: ['풀', '격투', '벌레'], weak: ['전기', '바위', '강철'], immune: [] },
    '에스퍼': { strong: ['격투', '독'], weak: ['에스퍼', '강철'], immune: ['악'] },
    '벌레': { strong: ['풀', '에스퍼', '악'], weak: ['불꽃', '격투', '독', '비행', '고스트', '강철', '페어리'], immune: [] },
    '바위': { strong: ['불꽃', '얼음', '비행', '벌레'], weak: ['격투', '땅', '강철'], immune: [] },
    '고스트': { strong: ['에스퍼', '고스트'], weak: ['악'], immune: ['노말'] },
    '드래곤': { strong: ['드래곤'], weak: ['강철'], immune: ['페어리'] },
    '악': { strong: ['에스퍼', '고스트'], weak: ['격투', '악', '페어리'], immune: [] },
    '강철': { strong: ['얼음', '바위', '페어리'], weak: ['불꽃', '물', '전기', '강철'], immune: [] },
    '페어리': { strong: ['격투', '드래곤', '악'], weak: ['불꽃', '독', '강철'], immune: [] }
};

const POKEMONS = {
    'pikachu': { name: '피카츄', hp: 100, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', types: ['전기'] },
    'bulbasaur': { name: '이상해씨', hp: 110, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', types: ['풀', '독'] },
    'charmander': { name: '파이리', hp: 95, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', types: ['불'] },
    'squirtle': { name: '꼬부기', hp: 105, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', types: ['물'] },
    'machamp': { name: '괴력몬', hp: 120, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png', types: ['격투'] },
    'alakazam': { name: '후딘', hp: 90, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png', types: ['에스퍼'] },
    'gengar': { name: '팬텀', hp: 98, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', types: ['고스트', '독'] },
    'snorlax': { name: '잠만보', hp: 150, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', types: ['노말'] },
};

const SKILLS = {
    '몸통박치기': { name: '몸통박치기', damage: 40, accuracy: 1, type: '노말', effect: null, description: '단단한 몸으로 부딪혀 공격한다.' },
    '화염방사': { name: '화염방사', damage: 90, accuracy: 1, type: '불꽃', effect: null, description: '맹렬한 불꽃을 상대에게 발사하여 공격한다.' },
    '물대포': { name: '물대포', damage: 40, accuracy: 1, type: '물', effect: null, description: '입에서 물을 세차게 발사하여 공격한다.' },
    '하이드로펌프': { name: '하이드로펌프', damage: 110, accuracy: 0.8, type: '물', effect: null, description: '엄청난 기세로 물을 발사하여 공격한다. 명중률이 조금 낮다.' },
    '덩굴채찍': { name: '덩굴채찍', damage: 45, accuracy: 1, type: '풀', effect: null, description: '가늘고 긴 덩굴로 상대를 때려 공격한다.' },
    '솔라빔': { name: '솔라빔', damage: 120, accuracy: 1, type: '풀', effect: null, description: '빛 에너지를 모아 강력한 광선을 발사한다.' },
    '10만볼트': { name: '10만볼트', damage: 90, accuracy: 1, type: '전기', effect: null, description: '강력한 전격으로 상대를 공격한다.' },
    '태권당수': { name: '태권당수', damage: 75, accuracy: 1, type: '격투', effect: null, description: '날카로운 손날로 상대를 베듯이 공격한다.' },
    '인파이트': { name: '인파이트', damage: 120, accuracy: 1, type: '격투', effect: (attacker) => { attacker.hp -= 20; }, description: '상대에게 뛰어들어 마구잡이로 공격한다. 자신의 HP가 조금 감소한다.' },
    '오물폭탄': { name: '오물폭탄', damage: 90, accuracy: 1, type: '독', effect: null, description: '더러운 오물 덩어리를 던져 공격한다.' },
    '지진': { name: '지진', damage: 100, accuracy: 1, type: '땅', effect: null, description: '땅을 흔들어 주변의 모든 것을 공격한다.' },
    '사이코키네시스': { name: '사이코키네시스', damage: 90, accuracy: 1, type: '에스퍼', effect: null, description: '강력한 염동력으로 상대를 공격한다.' },
    '섀도볼': { name: '섀도볼', damage: 80, accuracy: 1, type: '고스트', effect: null, description: '검은 그림자 덩어리를 던져 공격한다.' },
    '깨물어부수기': { name: '깨물어부수기', damage: 80, accuracy: 1, type: '악', effect: null, description: '날카로운 이빨로 상대를 깨물어 공격한다.' },
    '아이언헤드': { name: '아이언헤드', damage: 80, accuracy: 1, type: '강철', effect: null, description: '강철처럼 단단한 머리로 상대를 공격한다.' }
};

const QUIZZES = [
    { question: 'AI가 생성한 그림의 저작권은 누구에게 있을까요?', options: ['AI 개발자', 'AI를 이용한 사람', 'AI 자체', '법적으로 불분명함'], answer: '법적으로 불분명함', explanation: 'AI 생성물의 저작권은 아직 전 세계적으로 명확한 법적 기준이 마련되지 않았습니다. 국가별로, 상황별로 해석이 달라질 수 있어 현재로서는 "법적으로 불분명하다"가 가장 정확한 답변입니다.' },
    { question: '자율주행 자동차가 사고를 냈을 때, 가장 큰 책임은 누구에게 있을까요?', options: ['자동차 소유주', '제조사', '탑승자', '복합적 책임'], answer: '복합적 책임', explanation: '자율주행차 사고의 책임 소재는 매우 복잡한 문제입니다. 제조사의 설계 결함, 소유주의 관리 소홀, 관련 법규 등 여러 요소가 얽혀 있어 어느 한쪽의 책임으로 단정하기 어렵고, 복합적인 책임 소재를 따지는 것이 일반적입니다.' },
    { question: '인공지능의 학습 데이터가 특정 인종이나 성별에 편향되어 있다면, 어떤 문제가 발생할 수 있을까요?', options: ['결과의 정확성 향상', '특정 집단에 대한 차별', '처리 속도 저하', '알고리즘 단순화'], answer: '특정 집단에 대한 차별', explanation: '편향된 데이터로 학습한 AI는 그 편견을 그대로 학습하여 특정 집단에게 불공정한 결과를 내놓을 수 있습니다. 이는 사회적 차별을 심화시키는 심각한 윤리적 문제입니다.' },
    { question: 'AI 기술을 사용하여 가짜 뉴스나 허위 정보를 만드는 행위는 AI 윤리 원칙 중 무엇을 가장 크게 위배하는 것일까요?', options: ['인간 존엄성 원칙', '투명성 원칙', '사생활 보호 원칙', '기술 안정성 원칙'], answer: '인간 존엄성 원칙', explanation: '가짜 뉴스는 사회에 혼란을 주고, 개인의 명예를 훼손하며, 인간의 존엄성을 해칠 수 있습니다. AI를 악의적으로 사용하여 진실을 왜곡하는 것은 인간 중심의 기술 발전을 저해하는 행위입니다.' },
    { question: 'AI 챗봇이 사용자의 개인정보를 수집할 때, 반드시 지켜야 할 가장 중요한 절차는 무엇일까요?', options: ['빠른 서비스 제공', '사용자에게 고지 및 동의', '데이터 암호화', '수집 정보 최소화'], answer: '사용자에게 고지 및 동의', explanation: '정보 주체의 권리를 보장하기 위해, 개인정보를 수집하고 활용하기 전에는 반드시 사용자에게 그 사실을 명확히 알리고 명시적인 동의를 받는 것이 가장 중요합니다.' },
    { question: 'AI 면접관이 특정 학교 출신 지원자에게 더 높은 점수를 주도록 프로그래밍 되었다면, 어떤 윤리 원칙에 위배될까요?', options: ['공정성', '효율성', '안전성', '혁신성'], answer: '공정성', explanation: '인공지능은 출신, 성별, 인종 등과 같은 편견 없이 모든 사람을 공정하게 대해야 합니다. 특정 집단에 유불리를 주는 것은 공정성 원칙에 어긋납니다.' },
    { question: 'AI 스피커가 사용자의 대화를 항상 녹음하고 있다면, 어떤 권리가 침해될 수 있을까요?', options: ['사생활 보호권', '재산권', '건강권', '교육권'], answer: '사생활 보호권', explanation: '개인의 대화 내용은 민감한 사생활 정보에 해당합니다. 사용자의 명시적인 동의 없이 대화를 수집하고 저장하는 것은 사생활 보호권을 심각하게 침해하는 행위입니다.' },
    { question: '인공지능 개발자가 AI의 잠재적 위험성을 충분히 검토하지 않고 출시했을 때, 어떤 원칙을 소홀히 한 것일까요?', options: ['안전성', '데이터 관리', '투명성', '공공성'], answer: '안전성', explanation: '인공지능 기술은 사람과 사회에 해를 끼치지 않도록 안전하게 설계되고 검증되어야 합니다. 잠재적인 위험을 무시하는 것은 안전성 원칙을 위반하는 것입니다.' }
];

const DEFAULT_SKILL = { name: '몸통박치기', damage: 40, accuracy: 1, type: '노말', effect: null, description: '단단한 몸으로 부딪혀 공격한다.' };