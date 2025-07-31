// --- 게임 변수 설정 ---
let playerPokemon = {}, opponentPokemon = {}, currentQuestionIndex = 0, learnedSkills = [], isBattling = false;
let masterShuffledQuizzes = [], shuffledQuizzes = [], currentStage = 0, gameStages = [], battleSkills = [];
let isAnswerCorrect = false;
let playerInventory = { potion: 0 };
const QUESTIONS_PER_STAGE = 2;
let correctAnswersThisStage = 0;

// --- DOM 요소 ---
const screens = { start: document.getElementById('start-screen'), selection: document.getElementById('selection-screen'), quiz: document.getElementById('quiz-screen'), battle: document.getElementById('battle-screen') };
const modals = { result: document.getElementById('result-modal'), skillSelection: document.getElementById('skill-selection-modal'), stageClear: document.getElementById('stage-clear-modal'), forgetSkill: document.getElementById('forget-skill-modal'), explanation: document.getElementById('explanation-modal'), typeChart: document.getElementById('type-chart-modal'), record: document.getElementById('record-modal'), hallOfFame: document.getElementById('hall-of-fame-modal') };

// --- 화면 전환 함수 ---
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showModal(modalName) {
    Object.values(modals).forEach(modal => modal.classList.remove('active'));
    modals[modalName].classList.add('active');
}

function hideModals() {
    Object.values(modals).forEach(modal => modal.classList.remove('active'));
}

// --- 유틸리티 함수 ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 게임 준비 함수 ---
function calculateMatchupScore(playerTypes, opponentTypes) {
    let opponentEffectiveness = 1;
    opponentTypes.forEach(oType => {
        playerTypes.forEach(pType => {
            const multiplier = TYPE_CHART[oType]?.[pType];
            if (multiplier !== undefined) opponentEffectiveness *= multiplier;
        });
    });
    return opponentEffectiveness;
}

function generateStages(player) {
    let stages = [];
    const legendary_ids = ['articuno', 'zapdos', 'moltres'];
    const easy_ids = ['rattata', 'pidgey', 'clefairy'];

    const easyPool = OPPONENT_POOL.filter(p => easy_ids.includes(p.id));
    const legendaryPool = OPPONENT_POOL.filter(p => legendary_ids.includes(p.id));
    let normalPool = OPPONENT_POOL.filter(p => !legendary_ids.includes(p.id) && !easy_ids.includes(p.id));

    const opponentsWithScores = normalPool.map(opp => ({
        ...opp,
        score: calculateMatchupScore(player.types, opp.types) // 점수가 낮을수록 플레이어에게 유리
    }));

    const stageDifficultyFilters = [
        null, // Stage 1: Easy Pool
        null, // Stage 2: Easy Pool
        opp => opp.score <= 1, // Stage 3
        opp => opp.score <= 1, // Stage 4
        opp => opp.score > 1 && opp.score < 4, // Stage 5
        opp => opp.score > 1 && opp.score < 4, // Stage 6
    ];
    
    const stageNames = ["초보 트레이너", "두번째 트레이너", "체육관 관장", "엘리트 트레이너", "사천왕", "라이벌", "챔피언"];
    let usedOpponentIds = new Set();

    for (let i = 0; i < 6; i++) {
        let pool;
        if (i < 2) {
            pool = easyPool.filter(opp => !usedOpponentIds.has(opp.id));
            if (pool.length === 0) pool = easyPool; // 중복 허용
        } else {
            pool = opponentsWithScores.filter(opp => !usedOpponentIds.has(opp.id));
            let filteredPool = pool.filter(stageDifficultyFilters[i]);
            if (filteredPool.length === 0) { 
                pool = pool.length > 0 ? pool : opponentsWithScores;
            } else {
                pool = filteredPool;
            }
        }
        
        const selectedOpponent = pool[Math.floor(Math.random() * pool.length)];
        usedOpponentIds.add(selectedOpponent.id);

        stages.push({
            name: `Stage ${i + 1}: ${stageNames[i]}`,
            opponent: selectedOpponent
        });
    }

    const finalBoss = legendaryPool[Math.floor(Math.random() * legendaryPool.length)];
    stages.push({
        name: `Stage 7: ${stageNames[6]}`,
        opponent: finalBoss
    });

    return stages;
}


function initSelectionScreen() {
    const container = document.getElementById('pokemon-options');
    container.innerHTML = '';
    const pokemonKeys = Object.keys(POKEMONS);
    
    // 9개의 포켓몬 카드 생성
    for (let i = 0; i < 9; i++) {
        const key = pokemonKeys[i];
        if (!key) continue;
        const pokemon = POKEMONS[key];
        const card = document.createElement('div');
        card.className = 'pokemon-card cursor-pointer bg-gray-100 p-2 rounded-lg text-center flex flex-col justify-center items-center aspect-square';
        card.innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}" class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1"><p class="font-bold text-sm sm:text-base">${pokemon.name}</p>`;
        card.addEventListener('click', () => {
            selectPokemon(key);
        });
        container.appendChild(card);
    }

    // 랜덤 '?' 카드 생성
    const randomCard = document.createElement('div');
    randomCard.className = 'pokemon-card cursor-pointer bg-gray-200 p-2 rounded-lg text-center flex flex-col justify-center items-center aspect-square';
    randomCard.innerHTML = `<div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 flex items-center justify-center text-5xl font-bold text-gray-500">?</div><p class="font-bold text-sm sm:text-base">랜덤</p>`;
    randomCard.addEventListener('click', () => {
        selectPokemon('random');
    });
    container.appendChild(randomCard);
}

function selectPokemon(key) {
    let selectedKey = key;
    if (key === 'random') {
        const keys = Object.keys(POKEMONS);
        selectedKey = keys[Math.floor(Math.random() * keys.length)];
    }

    playerPokemon = { ...POKEMONS[selectedKey], id: selectedKey, maxHp: POKEMONS[selectedKey].hp, statusEffects: {}, statModifiers: { attack: 0 } };
    learnedSkills = [];
    playerInventory = { potion: 1 }; // 시작 시 상처약 1개 지급
    currentStage = 0;
    gameStages = generateStages(playerPokemon);
    
    // 게임 전체에서 사용할 퀴즈 목록을 한 번만 섞음
    masterShuffledQuizzes = shuffleArray([...ALL_QUIZZES]);

    startStage();
}

// --- 게임 진행 함수 ---
function startStage() {
    hideModals();
    correctAnswersThisStage = 0;
    playerPokemon.hp = playerPokemon.maxHp;
    playerPokemon.statusEffects = {}; // 스테이지 시작 시 상태이상 초기화
    playerPokemon.statModifiers = { attack: 0 }; // 스테이지 시작 시 능력치 변화 초기화
    document.getElementById('quiz-pokemon-img').src = playerPokemon.img;
    document.getElementById('quiz-pokemon-name').textContent = playerPokemon.name;
    
    const bgmBattle = document.getElementById('bgm-battle');
    const bgmQuiz = document.getElementById('bgm-quiz');
    bgmBattle.pause();
    bgmQuiz.play().catch(e => console.log("Quiz BGM failed to play:", e));

    // 현재 스테이지에 맞는 퀴즈를 master 목록에서 가져옴
    const startIndex = currentStage * QUESTIONS_PER_STAGE;
    shuffledQuizzes = masterShuffledQuizzes.slice(startIndex, startIndex + QUESTIONS_PER_STAGE);
    
    currentQuestionIndex = 0;
    document.getElementById('stage-title-quiz').textContent = gameStages[currentStage].name;
    showScreen('quiz');
    updateSkillProgress();
    loadQuestion();
}

function updateSkillProgress() {
    const container = document.getElementById('skill-progress');
    container.innerHTML = '';
    for (let i = 0; i < QUESTIONS_PER_STAGE; i++) {
        const icon = document.createElement('div');
        icon.className = `w-6 h-6 rounded-full border-2 ${i < currentQuestionIndex ? 'bg-yellow-400 border-yellow-500' : 'bg-gray-200 border-gray-400'}`;
        container.appendChild(icon);
    }
}

function loadQuestion() {
    updateSkillProgress();
    const quiz = shuffledQuizzes[currentQuestionIndex];
    document.getElementById('question-number').textContent = `퀴즈 ${currentQuestionIndex + 1} / ${QUESTIONS_PER_STAGE}`;
    document.getElementById('question-text').textContent = quiz.question;
    const container = document.getElementById('answer-options');
    container.innerHTML = '';
    const shuffledOptions = shuffleArray([...quiz.options]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'bg-white hover:bg-blue-100 text-blue-800 font-semibold py-3 px-4 border border-blue-400 rounded-lg shadow transition text-sm sm:text-base';
        button.textContent = option;
        button.onclick = () => {
            checkAnswer(option);
        };
        container.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    document.querySelectorAll('#answer-options button').forEach(btn => btn.disabled = true);
    const quiz = shuffledQuizzes[currentQuestionIndex];
    const title = document.getElementById('explanation-title');
    isAnswerCorrect = selectedOption === quiz.answer;
    if (isAnswerCorrect) {
        correctAnswersThisStage++;
    }

    if (isAnswerCorrect) {
        title.textContent = '✅ 정답입니다!';
        title.className = 'text-3xl font-bold mb-4 text-green-600';
    } else {
        title.textContent = '❌ 틀렸습니다!';
        title.className = 'text-3xl font-bold mb-4 text-red-600';
    }
    document.getElementById('explanation-text').innerHTML = `<strong>해설:</strong> ${quiz.explanation}`;
    showModal('explanation');
}

function proceedToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= QUESTIONS_PER_STAGE) {
        if (correctAnswersThisStage > 0) {
            showSkillSelection();
        } else {
            document.getElementById('feedback-message').textContent = "기술을 배우지 못했습니다. 배틀을 시작합니다!";
            setTimeout(startBattle, 1500);
        }
    } else {
        loadQuestion();
    }
}

function proceedAfterExplanation() {
    hideModals();
    proceedToNextQuestion();
}

function showSkillSelection() {
    const choicesContainer = document.getElementById('skill-choices');
    choicesContainer.innerHTML = '';
    
    const learnset = POKEMON_LEARNSETS[playerPokemon.id] || [];
    let potentialSkillNames = [...learnset];
    
    // 범용 노말 기술 추가
    const normalSkills = SKILLS['노말']
        .filter(s => s.power && s.power < 40) // 초반에 너무 강한 기술 제외
        .map(s => s.name);
    potentialSkillNames.push(...normalSkills);

    // 중복 제거
    potentialSkillNames = [...new Set(potentialSkillNames)];

    let availableSkills = potentialSkillNames
        .map(name => Object.values(SKILLS).flat().find(s => s.name === name))
        .filter(skill => skill && !learnedSkills.some(ls => ls.name === skill.name));

    if (availableSkills.length === 0) {
        document.getElementById('feedback-message').textContent = "더 배울 수 있는 기술이 없습니다. 배틀을 시작합니다!";
        setTimeout(startBattle, 1500);
        return;
    }

    let selectedForChoice = shuffleArray([...availableSkills]).slice(0, 2);

    selectedForChoice.forEach(skill => {
        const button = document.createElement('button');
        const skillDesc = skill.power ? `위력: ${skill.power}` : skill.description;
        button.className = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow transition';
        button.textContent = `${skill.name} (${skill.type}, ${skillDesc})`;
        button.onclick = () => {
            learnSkill(skill);
        };
        choicesContainer.appendChild(button);
    });
    showModal('skillSelection');
}

function learnSkill(newSkill) {
    hideModals();
    if (learnedSkills.length >= 4) {
        showForgetSkillModal(newSkill);
    } else {
        learnedSkills.push(newSkill);
        startBattle();
    }
}

function showForgetSkillModal(newSkill) {
    document.getElementById('new-skill-info').textContent = `새로 배울 기술: ${newSkill.name} (${newSkill.type})`;
    const choicesContainer = document.getElementById('forget-skill-choices');
    choicesContainer.innerHTML = '';
    learnedSkills.forEach((skill, index) => {
        const button = document.createElement('button');
        button.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transition';
        button.textContent = `잊기: ${skill.name}`;
        button.onclick = () => {
            replaceSkill(index, newSkill);
        };
        choicesContainer.appendChild(button);
    });
    showModal('forgetSkill');
}

function replaceSkill(index, newSkill) {
    learnedSkills[index] = newSkill;
    hideModals();
    startBattle();
}

// --- 배틀 관련 함수 ---
// ... (The rest of the game logic remains the same)

// --- 이벤트 리스너 ---
document.getElementById('start-game-button').addEventListener('click', () => {
    showScreen('selection');
});
// ... (The rest of the event listeners remain the same)

window.onload = () => {
    initSelectionScreen();
    showScreen('start');
};
