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
    // --- 기존 문제 ---
    { question: 'AI가 생성한 그림의 저작권은 누구에게 있을까요?', options: ['AI 개발자', 'AI를 이용한 사람', 'AI 자체', '법적으로 불분명함'], answer: '법적으로 불분명함', explanation: 'AI 생성물의 저작권은 아직 전 세계적으로 명확한 법적 기준이 마련되지 않았습니다. 국가별로, 상황별로 해석이 달라질 수 있어 현재로서는 "법적으로 불분명하다"가 가장 정확한 답변입니다.' },
    { question: '자율주행 자동차가 사고를 냈을 때, 가장 큰 책임은 누구에게 있을까요?', options: ['자동차 소유주', '제조사', '탑승자', '복합적 책임'], answer: '복합적 책임', explanation: '자율주행차 사고의 책임 소재는 매우 복잡한 문제입니다. 제조사의 설계 결함, 소유주의 관리 소홀, 관련 법규 등 여러 요소가 얽혀 있어 어느 한쪽의 책임으로 단정하기 어렵고, 복합적인 책임 소재를 따지는 것이 일반적입니다.' },
    { question: '인공지능의 학습 데이터가 특정 인종이나 성별에 편향되어 있다면, 어떤 문제가 발생할 수 있을까요?', options: ['결과의 정확성 향상', '특정 집단에 대한 차별', '처리 속도 저하', '알고리즘 단순화'], answer: '특정 집단에 대한 차별', explanation: '편향된 데이터로 학습한 AI는 그 편견을 그대로 학습하여 특정 집단에게 불공정한 결과를 내놓을 수 있습니다. 이는 사회적 차별을 심화시키는 심각한 윤리적 문제입니다.' },
    { question: 'AI 기술을 사용하여 가짜 뉴스나 허위 정보를 만드는 행위는 AI 윤리 원칙 중 무엇을 가장 크게 위배하는 것일까요?', options: ['인간 존엄성 원칙', '투명성 원칙', '사생활 보호 원칙', '기술 안정성 원칙'], answer: '인간 존엄성 원칙', explanation: '가짜 뉴스는 사회에 혼란을 주고, 개인의 명예를 훼손하며, 인간의 존엄성을 해칠 수 있습니다. AI를 악의적으로 사용하여 진실을 왜곡하는 것은 인간 중심의 기술 발전을 저해하는 행위입니다.' },
    { question: 'AI 챗봇이 사용자의 개인정보를 수집할 때, 반드시 지켜야 할 가장 중요한 절차는 무엇일까요?', options: ['빠른 서비스 제공', '사용자에게 고지 및 동의', '데이터 암호화', '수집 정보 최소화'], answer: '사용자에게 고지 및 동의', explanation: '정보 주체의 권리를 보장하기 위해, 개인정보를 수집하고 활용하기 전에는 반드시 사용자에게 그 사실을 명확히 알리고 명시적인 동의를 받는 것이 가장 중요합니다.' },
    { question: 'AI 면접관이 특정 학교 출신 지원자에게 더 높은 점수를 주도록 프로그래밍 되었다면, 어떤 윤리 원칙에 위배될까요?', options: ['공정성', '효율성', '안전성', '혁신성'], answer: '공정성', explanation: '인공지능은 출신, 성별, 인종 등과 같은 편견 없이 모든 사람을 공정하게 대해야 합니다. 특정 집단에 유불리를 주는 것은 공정성 원칙에 어긋납니다.' },
    { question: 'AI 스피커가 사용자의 대화를 항상 녹음하고 있다면, 어떤 권리가 침해될 수 있을까요?', options: ['사생활 보호권', '재산권', '건강권', '교육권'], answer: '사생활 보호권', explanation: '개인의 대화 내용은 민감한 사생활 정보에 해당합니다. 사용자의 명시적인 동의 없이 대화를 수집하고 저장하는 것은 사생활 보호권을 심각하게 침해하는 행위입니다.' },
    { question: '인공지능 개발자가 AI의 잠재적 위험성을 충분히 검토하지 않고 출시했을 때, 어떤 원칙을 소홀히 한 것일까요?', options: ['안전성', '데이터 관리', '투명성', '공공성'], answer: '안전성', explanation: '인공지능 기술은 사람과 사회에 해를 끼치지 않도록 안전하게 설계되고 검증되어야 합니다. 잠재적인 위험을 무시하는 것은 안전성 원칙을 위반하는 것입니다.' },

    // --- 신규 추가 문제 (22개) ---
    { question: '인공지능 윤리의 가장 중요한 목표는 무엇일까요?', options: ['기술 발전 속도 높이기', '인간의 가치와 권리 보호하기', '모든 것을 자동화하기', '컴퓨터 성능 향상시키기'], answer: '인간의 가치와 권리 보호하기', explanation: '인공지능 윤리는 기술이 인간의 존엄성과 권리를 침해하지 않고, 인간 중심의 가치를 지키도록 하는 것을 가장 중요한 목표로 삼습니다.' },
    { question: 'AI가 모든 사람에게 이익이 되고, 사회적 약자를 돕는 방향으로 사용되어야 한다는 원칙은 무엇일까요?', options: ['공공선 원칙', '기술 합목적성 원칙', '인간 존엄성 원칙', '프라이버시 보호 원칙'], answer: '공공선 원칙', explanation: '공공선 원칙은 인공지능이 사회 전체의 이익과 공공의 복지를 향상시키는 방향으로 개발되고 활용되어야 한다는 원칙입니다.' },
    { question: 'AI 면접관이 나를 떨어뜨렸을 때, 그 이유를 AI가 설명해 줄 수 있어야 한다는 원칙은 무엇일까요?', options: ['투명성 원칙', '안전성 원칙', '책임성 원칙', '연대성 원칙'], answer: '투명성 원칙', explanation: '투명성 원칙은 인공지능의 판단 과정과 결과를 사용자가 이해할 수 있도록 설명해야 한다는 원칙을 포함합니다. 이를 "설명 가능성"이라고도 합니다.' },
    { question: '다음 중 그림을 그려주거나, 글을 써주는 인공지능 기술은 무엇일까요?', options: ['생성형 AI', '컴퓨터 비전', '음성 인식', '추천 시스템'], answer: '생성형 AI', explanation: '생성형 AI(Generative AI)는 기존 데이터를 학습하여 새로운 텍스트, 이미지, 음악 등을 만들어내는 기술입니다. DALL-E, ChatGPT 등이 대표적입니다.' },
    { question: '다른 사람의 얼굴을 영상에 합성하여 가짜 영상을 만드는 \'딥페이크\' 기술을 나쁘게 사용하면 어떤 윤리적 문제가 가장 클까요?', options: ['사생활 침해 및 명예훼손', '컴퓨터 바이러스 감염', '인터넷 속도 저하', '전력 낭비'], answer: '사생활 침해 및 명예훼손', explanation: '딥페이크 기술을 악용하면 특정인의 명예를 훼손하거나 사생활을 침해하는 심각한 범죄로 이어질 수 있습니다. 이는 인간의 존엄성을 해치는 행위입니다.' },
    { question: '인공지능을 개발할 때, 성별·나이·인종 등에 따른 차별이 발생하지 않도록 노력해야 한다는 원칙은 무엇일까요?', options: ['다양성 존중', '책임성', '안전성', '공공성'], answer: '다양성 존중', explanation: '다양성 존중 원칙은 인공지능이 모든 사람에게 공정하게 적용되고, 개인의 특성에 따른 편향과 차별을 최소화해야 한다는 것을 의미합니다.' },
    { question: '인공지능 기술의 오작동으로 피해가 발생했을 때, 그 피해에 대한 책임 소재를 명확히 하는 것과 관련된 요건은 무엇일까요?', options: ['책임성', '투명성', '안전성', '연대성'], answer: '책임성', explanation: '책임성 요건은 인공지능 개발, 서비스, 사용 과정에서 문제가 발생했을 때, 각 주체(개발자, 제공자, 사용자)의 책임 소재를 명확히 해야 한다는 것을 강조합니다.' },
    { question: '인공지능이 인간에게 해를 입히는 목적으로 사용되지 않도록 해야 한다는 원칙은 무엇일까요?', options: ['침해금지', '인권보장', '공공성', '연대성'], answer: '침해금지', explanation: '침해금지 원칙은 인공지능을 인간에게 직간접적인 해를 입히는 목적으로 활용해서는 안 된다는 것을 명확히 하는 중요한 윤리 기준입니다.' },
    { question: '컴퓨터가 데이터를 스스로 학습하여 성능을 향상시키는 기술 방법을 무엇이라고 할까요?', options: ['머신러닝', '딥러닝', '인공지능', '컴퓨터 비전'], answer: '머신러닝', explanation: '머신러닝(Machine Learning)은 컴퓨터가 대량의 데이터를 스스로 학습하여 패턴을 인식하고, 이를 통해 새로운 데이터를 예측하는 인공지능의 핵심 기술입니다.' },
    { question: '병원에서 AI가 환자의 의료 영상을 분석하여 질병을 진단하는 것은 인공지능의 어떤 분야에 해당할까요?', options: ['컴퓨터 비전', '자연어 처리', '생성형 AI', '음성 인식'], answer: '컴퓨터 비전', explanation: '컴퓨터 비전(Computer Vision)은 이미지나 영상을 분석하여 의미있는 정보를 추출하는 분야로, 의료 영상 분석, 자율주행차 등에 활용됩니다.' },
    { question: '쇼핑몰에서 내가 좋아할 만한 상품을 추천해주는 것은 인공지능의 어떤 기술 덕분일까요?', options: ['추천 시스템', '자율주행', '이미지 생성', '음성 번역'], answer: '추천 시스템', explanation: '추천 시스템은 사용자의 과거 행동 데이터를 분석하여 좋아할 만한 콘텐츠나 상품을 예측하고 추천해주는 머신러닝 기술의 한 종류입니다.' },
    { question: '인공지능의 순기능을 극대화하고 역기능을 최소화하기 위해 여러 방면으로 교육을 시행해야 한다는 내용은 어떤 요건에 해당할까요?', options: ['공공성', '안전성', '책임성', '투명성'], answer: '공공성', explanation: '공공성 원칙에는 인공지능 기술의 긍정적, 부정적 영향을 모두 이해하고 올바르게 사용할 수 있도록 교육을 시행해야 한다는 내용이 포함되어 있습니다.' },
    { question: '인공지능 기술과 윤리에 대해 여러 나라가 함께 협력해야 한다는 원칙은 무엇일까요?', options: ['연대성', '공공성', '책임성', '안전성'], answer: '연대성', explanation: '연대성 원칙은 윤리적인 인공지능 개발 및 활용을 위해 미래세대를 배려하고, 다양한 이해관계자와 국제사회가 함께 협력해야 함을 강조합니다.' },
    { question: '개인의 정보를 수집할 때, 그 목적에 맞게만 사용하고 다른 용도로 사용하지 않아야 한다는 원칙은 무엇일까요?', options: ['데이터 관리', '프라이버시 보호', '책임성', '투명성'], answer: '데이터 관리', explanation: '데이터 관리 원칙은 데이터를 수집 목적에 맞게 활용하고, 데이터의 편향성을 최소화하며, 품질과 위험을 관리해야 한다는 내용을 담고 있습니다. 프라이버시 보호와도 밀접한 관련이 있습니다.' },
    { question: '인공지능이 인간의 삶에 필요한 도구라는 목적에 맞게 개발되고 활용되어야 한다는 원칙은 무엇일까요?', options: ['기술의 합목적성 원칙', '인간 존엄성 원칙', '사회의 공공선 원칙', '다양성 존중 원칙'], answer: '기술의 합목적성 원칙', explanation: '기술의 합목적성 원칙은 인공지능이 인류의 삶과 번영을 위한 도구라는 목적과 의도에 맞게, 그리고 그 과정도 윤리적으로 개발 및 활용되어야 한다는 것을 의미합니다.' },
    { question: '인공지능 기술을 활용한 발명품이 사회의 모든 사람에게 골고루 혜택을 주도록 노력하는 것은 어떤 윤리 기준과 관련이 깊을까요?', options: ['다양성 존중', '안전성', '책임성', '투명성'], answer: '다양성 존중', explanation: '다양성 존중 원칙에는 사회적 약자 및 취약 계층의 접근성을 보장하고, 인공지능이 주는 혜택이 모든 사람에게 골고루 분배되도록 노력해야 한다는 내용이 포함됩니다.' },
    { question: '기후 변화, 환경 오염 같은 지구촌의 문제를 해결하기 위해 인공지능을 활용하는 것은 어떤 윤리 원칙의 좋은 사례일까요?', options: ['공공성과 연대성', '투명성과 책임성', '안전성과 프라이버시 보호', '데이터 관리와 침해금지'], answer: '공공성과 연대성', explanation: '지구촌 공동의 문제를 해결하는 것은 사회 전체의 이익(공공성)을 위한 것이며, 국제적인 협력(연대성)을 통해 이루어질 수 있습니다.' },
    { question: '내가 숙제를 할 때 생성형 AI의 도움을 받았다면, 그 사실을 밝히고 AI가 만든 내용을 그대로 베끼지 않는 태도가 필요합니다. 이는 어떤 윤리와 관련될까요?', options: ['책임성과 정직', '프라이버시와 안전', '다양성과 공정성', '연대성과 협력'], answer: '책임성과 정직', explanation: '인공지능을 도구로 사용하되, 최종 결과물에 대한 책임은 사용자 자신에게 있습니다. AI의 결과물을 그대로 제출하는 것은 정직하지 못한 행동입니다.' },
    { question: '우리 반 티셔츠 사이즈를 정하기 위해 친구들의 키 데이터를 수집할 때, 이름 대신 번호로 기록하는 이유는 무엇일까요?', options: ['프라이버시 보호를 위해', '데이터 양을 늘리기 위해', '계산하기 편하게 하려고', '재미를 위해'], answer: '프라이버시 보호를 위해', explanation: '친구의 키와 같은 개인정보가 누구의 것인지 알아볼 수 없도록 익명으로 처리하는 것은 개인의 사생활(프라이버시)을 보호하는 중요한 윤리적 실천입니다.' },
    { question: '챗봇 AI가 자꾸 이상한 말을 하거나 틀린 정보를 알려줄 때, 개발자가 이를 수정하고 개선해야 할 의무는 어떤 원칙과 관련될까요?', options: ['안전성과 책임성', '공공성과 다양성', '투명성과 연대성', '인권보장과 침해금지'], answer: '안전성과 책임성', explanation: '개발자는 인공지능이 안전하게 작동하도록(안전성) 만들 책임이 있으며, 문제가 발생했을 때 이를 해결할 책임(책임성)도 있습니다.' },
    {
        question: '인간의 뇌 신경망을 모방하여 컴퓨터가 매우 복잡한 문제를 해결하도록 하는 기술은 무엇일까요?',
        options: ['딥러닝', '머신러닝', '블록체인', '클라우드 컴퓨팅'],
        answer: '딥러닝',
        explanation: '딥러닝(Deep Learning)은 인간의 뉴런과 비슷한 인공신경망을 여러 겹으로 쌓아, 컴퓨터가 매우 복잡한 패턴을 학습하고 문제를 해결하게 하는 기술입니다. 머신러닝의 한 분야입니다.'
    },
    {
        question: '인공지능 스피커에게 "오늘 날씨 어때?"라고 물었을 때, AI가 내 말을 알아듣고 대답해주는 것은 어떤 기술 덕분일까요?',
        options: ['자연어 처리 및 음성 인식', '컴퓨터 비전', '생성형 AI', '추천 시스템'],
        answer: '자연어 처리 및 음성 인식',
        explanation: '음성 인식 기술이 사람의 목소리를 텍스트로 바꾸고, 자연어 처리(NLP) 기술이 그 텍스트의 의미를 이해하여 적절한 답변을 찾아 다시 음성으로 들려주는 것입니다.'
    }
];
        
const DEFAULT_SKILL = { name: '몸통박치기', damage: 40, accuracy: 1, type: '노말', effect: null, description: '단단한 몸으로 부딪혀 공격한다.' };