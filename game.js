// --- 게임 변수 설정 ---
let playerPokemon = {}, opponentPokemon = {}, currentQuestionIndex = 0, learnedSkills = [], isBattling = false;
let masterShuffledQuizzes = [], shuffledQuizzes = [], currentStage = 0, gameStages = [], battleSkills = [];
let isAnswerCorrect = false;
let playerInventory = { potion: 0 };
const QUESTIONS_PER_STAGE = 2;
let correctAnswersThisStage = 0;
let battleLogTimeout;

// --- DOM 요소 ---
const screens = { start: document.getElementById('start-screen'), selection: document.getElementById('selection-screen'), quiz: document.getElementById('quiz-screen'), battle: document.getElementById('battle-screen') };
const modals = { result: document.getElementById('result-modal'), skillSelection: document.getElementById('skill-selection-modal'), stageClear: document.getElementById('stage-clear-modal'), forgetSkill: document.getElementById('forget-skill-modal'), explanation: document.getElementById('explanation-modal'), typeChart: document.getElementById('type-chart-modal'), record: document.getElementById('record-modal'), hallOfFame: document.getElementById('hall-of-fame-modal') };
const bgm = { battle: document.getElementById('bgm-battle'), quiz: document.getElementById('bgm-quiz') };

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
            const multiplier = TYPE_CHART[oType]?.[pType] ?? 1;
            opponentEffectiveness *= multiplier;
        });
    });
    return opponentEffectiveness;
}

function generateStages(player) {
    let stages = [];
    const legendary_ids = ['articuno', 'zapdos', 'moltres', 'tyranitar'];
    const easy_ids = ['rattata', 'pidgey', 'clefairy'];

    const easyPool = OPPONENT_POOL.filter(p => easy_ids.includes(p.id));
    const legendaryPool = OPPONENT_POOL.filter(p => legendary_ids.includes(p.id));
    let normalPool = OPPONENT_POOL.filter(p => !legendary_ids.includes(p.id) && !easy_ids.includes(p.id));
    let usedOpponentIds = new Set();

    const opponentsWithScores = normalPool.map(opp => ({...opp, score: calculateMatchupScore(player.types, opp.types)}));
    const stageDifficultyFilters = [
        opp => opp.score <= 1, 
        opp => opp.score <= 1, 
        opp => opp.score > 1 && opp.score < 4, 
        opp => opp.score > 1 && opp.score < 4, 
    ];
    const stageNames = ["초보 트레이너", "두번째 트레이너", "체육관 관장", "엘리트 트레이너", "사천왕", "라이벌", "챔피언"];

    for (let i = 0; i < 2; i++) {
        let pool = easyPool.filter(opp => !usedOpponentIds.has(opp.id));
        if (pool.length === 0) pool = easyPool;
        const selectedOpponent = pool[Math.floor(Math.random() * pool.length)];
        usedOpponentIds.add(selectedOpponent.id);
        stages.push({ name: `Stage ${i + 1}: ${stageNames[i]}`, opponent: selectedOpponent });
    }

    for (let i = 0; i < 4; i++) {
        let pool = opponentsWithScores.filter(opp => !usedOpponentIds.has(opp.id));
        let filteredPool = pool.filter(stageDifficultyFilters[i]);
        if (filteredPool.length === 0) pool = pool.length > 0 ? pool : opponentsWithScores;
        else pool = filteredPool;
        
        const selectedOpponent = pool[Math.floor(Math.random() * pool.length)];
        usedOpponentIds.add(selectedOpponent.id);
        stages.push({ name: `Stage ${i + 3}: ${stageNames[i+2]}`, opponent: selectedOpponent });
    }
    
    const finalBoss = legendaryPool[Math.floor(Math.random() * legendaryPool.length)];
    stages.push({ name: `Stage 7: ${stageNames[6]}`, opponent: finalBoss });

    return stages;
}


function initSelectionScreen() {
    const container = document.getElementById('pokemon-options');
    container.innerHTML = '';
    const pokemonKeys = Object.keys(POKEMONS);
    
    for (let i = 0; i < 9 && i < pokemonKeys.length; i++) {
        const key = pokemonKeys[i];
        const pokemon = POKEMONS[key];
        const card = document.createElement('div');
        card.className = 'pokemon-card cursor-pointer bg-gray-100 p-2 rounded-lg text-center flex flex-col justify-center items-center aspect-square transition transform hover:scale-105';
        card.innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}" class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1"><p class="font-bold text-sm sm:text-base">${pokemon.name}</p>`;
        card.addEventListener('click', () => selectPokemon(key));
        container.appendChild(card);
    }

    const randomCard = document.createElement('div');
    randomCard.className = 'pokemon-card cursor-pointer bg-gray-200 p-2 rounded-lg text-center flex flex-col justify-center items-center aspect-square transition transform hover:scale-105';
    randomCard.innerHTML = `<div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 flex items-center justify-center text-5xl font-bold text-gray-500">?</div><p class="font-bold text-sm sm:text-base">랜덤</p>`;
    randomCard.addEventListener('click', () => selectPokemon('random'));
    container.appendChild(randomCard);
}

function selectPokemon(key) {
    let selectedKey = key;
    if (key === 'random') {
        const keys = Object.keys(POKEMONS);
        selectedKey = keys[Math.floor(Math.random() * keys.length)];
    }
    const basePokemon = POKEMONS[selectedKey];
    playerPokemon = { ...basePokemon, id: selectedKey, maxHp: basePokemon.hp, hp: basePokemon.hp, statusEffects: {}, statModifiers: { attack: 0, defense: 0 } };
    learnedSkills = [];
    playerInventory = { potion: 1 };
    currentStage = 0;
    gameStages = generateStages(playerPokemon);
    masterShuffledQuizzes = shuffleArray([...ALL_QUIZZES]);
    startStage();
}

// --- 게임 진행 함수 ---
function startStage() {
    hideModals();
    correctAnswersThisStage = 0;
    playerPokemon.hp = playerPokemon.maxHp;
    playerPokemon.statusEffects = {}; 
    playerPokemon.statModifiers = { attack: 0, defense: 0 };
    document.getElementById('quiz-pokemon-img').src = playerPokemon.img;
    document.getElementById('quiz-pokemon-name').textContent = playerPokemon.name;
    
    bgm.battle.pause();
    bgm.quiz.currentTime = 0;
    bgm.quiz.play().catch(e => console.error("BGM play failed:", e));

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
        icon.className = `w-6 h-6 rounded-full border-2 ${i < correctAnswersThisStage ? 'bg-yellow-400 border-yellow-500' : 'bg-gray-200 border-gray-400'}`;
        container.appendChild(icon);
    }
}

function loadQuestion() {
    const quiz = shuffledQuizzes[currentQuestionIndex];
    if (!quiz) {
        console.error("Quiz not found for index:", currentQuestionIndex);
        return;
    }
    document.getElementById('question-number').textContent = `퀴즈 ${currentQuestionIndex + 1} / ${QUESTIONS_PER_STAGE}`;
    document.getElementById('question-text').textContent = quiz.question;
    const container = document.getElementById('answer-options');
    container.innerHTML = '';
    const shuffledOptions = shuffleArray([...quiz.options]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'bg-white hover:bg-blue-100 text-blue-800 font-semibold py-3 px-4 border border-blue-400 rounded-lg shadow transition text-sm sm:text-base';
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
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
        title.textContent = '✅ 정답입니다!';
        title.className = 'text-3xl font-bold mb-4 text-green-600';
    } else {
        title.textContent = '❌ 틀렸습니다!';
        title.className = 'text-3xl font-bold mb-4 text-red-600';
    }
    updateSkillProgress();
    document.getElementById('explanation-text').innerHTML = `<strong>해설:</strong> ${quiz.explanation}`;
    showModal('explanation');
}

function proceedAfterExplanation() {
    hideModals();
    currentQuestionIndex++;
    if (currentQuestionIndex >= QUESTIONS_PER_STAGE) {
        if (correctAnswersThisStage > 0) {
            showSkillSelection();
        } else {
            const feedback = document.getElementById('feedback-message');
            feedback.textContent = "기술을 배우지 못했습니다. 배틀을 시작합니다!";
            setTimeout(() => {
                feedback.textContent = "";
                startBattle();
            }, 1500);
        }
    } else {
        loadQuestion();
    }
}

// --- 기술 습득 관련 함수 ---
function showSkillSelection() {
    const choicesContainer = document.getElementById('skill-choices');
    choicesContainer.innerHTML = '';
    const learnset = POKEMON_LEARNSETS[playerPokemon.id] || [];
    let potentialSkillNames = [...learnset];
    const normalSkills = SKILLS['노말'].filter(s => s.power && s.power < 40).map(s => s.name);
    potentialSkillNames.push(...normalSkills);
    potentialSkillNames = [...new Set(potentialSkillNames)];

    let availableSkills = potentialSkillNames
        .map(name => Object.values(SKILLS).flat().find(s => s.name === name))
        .filter(skill => skill && !learnedSkills.some(ls => ls.name === skill.name));

    if (availableSkills.length === 0) {
        startBattle();
        return;
    }

    let selectedForChoice = shuffleArray([...availableSkills]).slice(0, 2);
    selectedForChoice.forEach(skill => {
        const button = document.createElement('button');
        const skillDesc = skill.description || (skill.power ? `위력: ${skill.power}` : '효과');
        button.className = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow transition';
        button.innerHTML = `<strong>${skill.name}</strong> <br><span class="text-sm">${skill.type} / ${skillDesc}</span>`;
        button.onclick = () => learnSkill(skill);
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
        button.onclick = () => replaceSkill(index, newSkill);
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
function startBattle() {
    hideModals();
    isBattling = true;
    bgm.quiz.pause();
    bgm.battle.currentTime = 0;
    bgm.battle.play().catch(e => console.error("BGM play failed:", e));

    const stageInfo = gameStages[currentStage];
    opponentPokemon = JSON.parse(JSON.stringify(stageInfo.opponent)); // Deep copy
    opponentPokemon.statModifiers = { attack: 0, defense: 0 };
    opponentPokemon.statusEffects = {};

    battleSkills = learnedSkills.length > 0 ? learnedSkills : [DEFAULT_SKILL];

    document.getElementById('stage-title-battle').textContent = stageInfo.name;
    updateBattleUI();
    showScreen('battle');
    battleLogUpdate(`${opponentPokemon.name}이(가) 나타났다!`, 2000);
}

function updateBattleUI() {
    // Player
    document.getElementById('player-name').textContent = playerPokemon.name;
    document.getElementById('player-img').src = playerPokemon.img;
    const playerHpBar = document.getElementById('player-hp');
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    playerHpBar.style.width = `${playerHpPercent}%`;
    playerHpBar.textContent = `${Math.ceil(playerPokemon.hp)} / ${playerPokemon.maxHp}`;
    playerHpBar.className = `h-full rounded-full text-xs text-white text-center font-bold transition-all duration-500 ${playerHpPercent > 50 ? 'bg-green-500' : playerHpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`;
    
    // Opponent
    document.getElementById('opponent-name').textContent = opponentPokemon.name;
    document.getElementById('opponent-img').src = opponentPokemon.img;
    const opponentHpBar = document.getElementById('opponent-hp');
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;
    opponentHpBar.style.width = `${opponentHpPercent}%`;
    opponentHpBar.textContent = `HP`;
    opponentHpBar.className = `h-full rounded-full text-xs text-white text-center font-bold transition-all duration-500 ${opponentHpPercent > 50 ? 'bg-green-500' : opponentHpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`;

    // Skill buttons
    const skillButtonsContainer = document.getElementById('skill-buttons');
    skillButtonsContainer.innerHTML = '';
    const skillsToDisplay = battleSkills.length > 0 ? battleSkills : [STRUGGLE_SKILL];
    skillsToDisplay.forEach((skill, index) => {
        const button = document.createElement('button');
        button.className = `bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg shadow-sm transition text-xs sm:text-sm`;
        button.textContent = skill.name;
        button.onclick = () => playerAttack(index);
        skillButtonsContainer.appendChild(button);
    });

    // Item buttons
    const itemButtonsContainer = document.getElementById('item-buttons');
    itemButtonsContainer.innerHTML = '';
    const potionButton = document.createElement('button');
    potionButton.className = 'bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-2 rounded-lg shadow-sm transition text-xs sm:text-sm';
    potionButton.textContent = `상처약 (${playerInventory.potion})`;
    potionButton.disabled = playerInventory.potion <= 0 || playerPokemon.hp === playerPokemon.maxHp;
    potionButton.onclick = usePotion;
    itemButtonsContainer.appendChild(potionButton);
}

function battleLogUpdate(message, duration = 1500) {
    const log = document.getElementById('battle-log');
    log.textContent = message;
    clearTimeout(battleLogTimeout);
    battleLogTimeout = setTimeout(() => {
        log.textContent = '무엇을 할까?';
    }, duration);
}

function calculateDamage(attacker, defender, skill) {
    if (!skill.power) return { damage: 0, effectivenessMessage: '' };
    let effectiveness = 1;
    defender.types.forEach(defType => {
        effectiveness *= TYPE_CHART[skill.type]?.[defType] ?? 1;
    });
    
    const baseDamage = skill.power * (Math.random() * 0.25 + 0.85); // 85% ~ 110%
    const damage = Math.floor(baseDamage * effectiveness);
    
    let effectivenessMessage = '';
    if (effectiveness > 1) effectivenessMessage = "효과가 굉장했다!";
    if (effectiveness < 1 && effectiveness > 0) effectivenessMessage = "효과가 별로인 듯하다...";
    if (effectiveness === 0) effectivenessMessage = "효과가 없는 것 같다...";

    return { damage, effectivenessMessage };
}

function playerAttack(skillIndex) {
    if (!isBattling) return;
    const skill = battleSkills.length > 0 ? battleSkills[skillIndex] : STRUGGLE_SKILL;
    
    // 마비 체크
    if (playerPokemon.statusEffects.paralysis && Math.random() < 0.25) {
        battleLogUpdate(`${playerPokemon.name}은(는) 마비되어 움직일 수 없다!`);
        setTimeout(opponentAttack, 1500);
        return;
    }
    
    isBattling = false; // Prevent multiple attacks
    document.getElementById('player-img').classList.add('attack-animation');
    
    setTimeout(() => {
        document.getElementById('player-img').classList.remove('attack-animation');
        battleLogUpdate(`${playerPokemon.name}의 ${skill.name} 공격!`);
        
        // 데미지 계산 및 적용
        const { damage, effectivenessMessage } = calculateDamage(playerPokemon, opponentPokemon, skill);
        opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage);
        
        // 효과 적용
        if(skill.effect) applyEffect(skill.effect, playerPokemon, opponentPokemon);

        document.getElementById('opponent-img').classList.add('shake');
        updateBattleUI();
        
        setTimeout(() => {
            document.getElementById('opponent-img').classList.remove('shake');
            if (effectivenessMessage) battleLogUpdate(effectivenessMessage);

            setTimeout(() => {
                if (opponentPokemon.hp <= 0) {
                    winBattle();
                } else {
                    opponentAttack();
                }
            }, 1000);
        }, 500);
    }, 500);
}

function opponentAttack() {
    if (opponentPokemon.hp <= 0) return;
    const skill = opponentPokemon.skills[Math.floor(Math.random() * opponentPokemon.skills.length)];
    
    // 마비 체크
    if (opponentPokemon.statusEffects.paralysis && Math.random() < 0.25) {
        battleLogUpdate(`${opponentPokemon.name}은(는) 마비되어 움직일 수 없다!`);
        setTimeout(() => isBattling = true, 1500); // 플레이어 턴으로
        return;
    }

    document.getElementById('opponent-img').classList.add('attack-animation');

    setTimeout(() => {
        document.getElementById('opponent-img').classList.remove('attack-animation');
        battleLogUpdate(`${opponentPokemon.name}의 ${skill.name} 공격!`);
        
        const { damage, effectivenessMessage } = calculateDamage(opponentPokemon, playerPokemon, skill);
        playerPokemon.hp = Math.max(0, playerPokemon.hp - damage);

        if(skill.effect) applyEffect(skill.effect, opponentPokemon, playerPokemon);

        document.getElementById('player-img').classList.add('shake');
        updateBattleUI();

        setTimeout(() => {
            document.getElementById('player-img').classList.remove('shake');
            if (effectivenessMessage) battleLogUpdate(effectivenessMessage);

            setTimeout(() => {
                if (playerPokemon.hp <= 0) {
                    loseBattle();
                } else {
                    isBattling = true; // Re-enable player actions
                }
            }, 1000);
        }, 500);
    }, 500);
}

function usePotion() {
    if (playerInventory.potion > 0 && playerPokemon.hp < playerPokemon.maxHp) {
        isBattling = false;
        playerInventory.potion--;
        const healAmount = Math.floor(playerPokemon.maxHp * 0.3);
        playerPokemon.hp = Math.min(playerPokemon.maxHp, playerPokemon.hp + healAmount);
        battleLogUpdate(`${playerPokemon.name}은(는) 상처약을 사용했다!`);
        updateBattleUI();
        setTimeout(opponentAttack, 1500);
    }
}

function applyEffect(effect, attacker, defender) {
    if (effect.type === 'status') {
        if (Math.random() < (effect.chance || 1)) {
            defender.statusEffects[effect.status] = true;
            battleLogUpdate(`${defender.name}은(는) ${effect.status === 'paralysis' ? '마비' : '??'} 상태가 되었다!`, 2000);
        }
    } else if (effect.type === 'stat') {
        const target = effect.target === 'player' ? attacker : defender;
        target.statModifiers[effect.stat] += effect.change;
        const statName = effect.stat === 'attack' ? '공격' : '방어';
        const changeMsg = effect.change > 0 ? '올랐다' : '떨어졌다';
        battleLogUpdate(`${target.name}의 ${statName}이(가) ${changeMsg}!`, 2000);
    }
}


// --- 게임 결과 처리 ---
function winBattle() {
    isBattling = false;
    currentStage++;
    saveRecord(false); // 중간 저장

    if (currentStage >= gameStages.length) {
        winGame();
    } else {
        document.getElementById('stage-clear-message').textContent = `다음 상대는 ${gameStages[currentStage].name} 입니다.`;
        showModal('stageClear');
    }
}

function loseBattle() {
    isBattling = false;
    saveRecord(false); // 중간 저장
    document.getElementById('result-title').textContent = "패배...";
    document.getElementById('result-message').textContent = `아쉽게도 ${opponentPokemon.name}에게 패배했습니다.`;
    showModal('result');
}

function winGame() {
    document.getElementById('result-title').textContent = "🎉 최종 승리! 🎉";
    document.getElementById('result-message').textContent = `모든 상대를 이기고 챔피언이 되었습니다! 명예의 전당에 이름을 기록하세요.`;
    showModal('record');
}

function resetGame() {
    location.reload();
}

// --- 명예의 전당 ---
function saveRecord(isFinal = true) {
    const nickname = document.getElementById('nickname-input').value || '트레이너';
    const records = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    const newRecord = {
        date: new Date().toLocaleDateString(),
        nickname: nickname,
        clearedStages: `Stage ${currentStage}`,
        pokemon: playerPokemon.name
    };
    records.unshift(newRecord);
    localStorage.setItem('hallOfFame', JSON.stringify(records.slice(0, 20)));
    
    if(isFinal) {
        hideModals();
        showHallOfFame();
    }
}

function showHallOfFame() {
    const records = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    const tbody = document.getElementById('hall-of-fame-body');
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4">아직 기록이 없습니다.</td></tr>';
    } else {
        records.forEach(r => {
            const row = `<tr>
                <td class="p-2 border-t">${r.date}</td>
                <td class="p-2 border-t">${r.nickname} (${r.pokemon})</td>
                <td class="p-2 border-t">${r.clearedStages}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
    showModal('hallOfFame');
}

// --- 이벤트 리스너 ---
document.addEventListener('DOMContentLoaded', () => {
    // 게임 시작 버튼
    document.getElementById('start-game-button').addEventListener('click', () => {
        initSelectionScreen();
        showScreen('selection');
    });

    // 퀴즈 해설 후 '계속하기' 버튼
    document.getElementById('next-question-button').addEventListener('click', proceedAfterExplanation);
    
    // 스테이지 클리어 후 '다음' 버튼
    document.getElementById('next-stage-button').addEventListener('click', startStage);

    // 게임 종료 후 '다시하기' 버튼
    document.getElementById('play-again-button').addEventListener('click', resetGame);
    
    // 기술 잊기 취소 버튼
    document.getElementById('cancel-forget-button').addEventListener('click', startBattle);

    // 명예의 전당 관련
    document.getElementById('hall-of-fame-button').addEventListener('click', showHallOfFame);
    document.getElementById('submit-record-button').addEventListener('click', () => saveRecord(true));
    document.getElementById('close-hof-button').addEventListener('click', hideModals);

    // 타입 상성표 관련
    document.getElementById('type-chart-icon').addEventListener('click', () => showModal('typeChart'));
    document.getElementById('close-type-chart-button').addEventListener('click', hideModals);

    // 볼륨 조절
    const volumeSlider = document.getElementById('volume-slider');
    const soundOnIcon = document.getElementById('sound-on-icon');
    const soundOffIcon = document.getElementById('sound-off-icon');

    function setVolume(volume) {
        bgm.battle.volume = volume;
        bgm.quiz.volume = volume;
        if (volume > 0) {
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
        } else {
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
        }
    }

    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
    document.getElementById('volume-control').addEventListener('click', () => {
        const currentVolume = volumeSlider.value;
        if (currentVolume > 0) {
            volumeSlider.value = 0;
        } else {
            volumeSlider.value = 0.5;
        }
        setVolume(volumeSlider.value);
    });
    
    // 초기 볼륨 설정
    setVolume(volumeSlider.value);
});


window.onload = () => {
    showScreen('start');
};