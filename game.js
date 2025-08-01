// --- Game Variables ---
let playerPokemon = {}, opponentPokemon = {}, currentQuestionIndex = 0, learnedSkills = [], isBattling = false;
let masterShuffledQuizzes = [], shuffledQuizzes = [], currentStage = 0, gameStages = [], battleSkills = [];
let playerInventory = { potion: 0 };
const QUESTIONS_PER_STAGE = 2;
let correctAnswersThisStage = 0;
let battleLogTimeout;
let OPPONENT_POOL = []; // Will be populated by PokeAPI

// --- DOM Elements ---
const screens = { start: document.getElementById('start-screen'), selection: document.getElementById('selection-screen'), quiz: document.getElementById('quiz-screen'), battle: document.getElementById('battle-screen') };
const modals = { result: document.getElementById('result-modal'), skillSelection: document.getElementById('skill-selection-modal'), stageClear: document.getElementById('stage-clear-modal'), forgetSkill: document.getElementById('forget-skill-modal'), explanation: document.getElementById('explanation-modal'), typeChart: document.getElementById('type-chart-modal'), record: document.getElementById('record-modal'), hallOfFame: document.getElementById('hall-of-fame-modal'), levelUp: document.getElementById('level-up-modal'), ending: document.getElementById('ending-modal') };
const bgm = { battle: document.getElementById('bgm-battle'), quiz: document.getElementById('bgm-quiz') };

// --- Screen & Modal Management ---
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function showModal(modalName, state = {}) {
    hideModals(); // Hide any other modals first
    modals[modalName].classList.remove('hidden');
    modals[modalName].dataset.state = JSON.stringify(state);
}

function hideModals() {
    Object.values(modals).forEach(modal => modal.classList.add('hidden'));
}

// --- Sound Management ---
function playBgm(track) {
    bgm.battle.pause();
    bgm.quiz.pause();
    if (track) {
        bgm[track].currentTime = 0;
        bgm[track].play().catch(e => console.log("Audio playback failed:", e));
    }
}

// --- Game Initialization ---
function initializeGame() {
    // Reset variables
    playerPokemon = {};
    opponentPokemon = {};
    currentQuestionIndex = 0;
    learnedSkills = [];
    isBattling = false;
    masterShuffledQuizzes = [];
    shuffledQuizzes = [];
    currentStage = 0;
    gameStages = [];
    battleSkills = [];
    playerInventory = { potion: 0 };
    correctAnswersThisStage = 0;

    OPPONENT_POOL = [];
    fetchOpponentPool();

    hideModals();
    showScreen('start');
    playBgm(null);
}

async function fetchOpponentPool() {
    // Fetch a list of diverse Pokemon
    const opponentIds = [18, 28, 31, 34, 45, 55, 57, 59, 62, 65, 76, 80, 89, 94, 95, 103, 105, 106, 107, 110, 112, 121, 123, 124, 125, 126, 127, 128, 130, 131, 134, 135, 136, 141, 149];
    try {
        const responses = await Promise.all(opponentIds.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)));
        const data = await Promise.all(responses.map(res => res.json()));

        const koreanNames = await fetch('https://raw.githubusercontent.com/Kim-do-hyeong/poketmon-game/main/poketmonNames.json');
        const namesData = await koreanNames.json();
        
        const nameMap = {};
        namesData.forEach(p => {
            nameMap[p.en] = p.ko;
        });

        OPPONENT_POOL = data.map(p => ({
            name: nameMap[p.name] || p.name,
            hp: 80 + p.stats.find(s => s.stat.name === 'hp').base_stat,
            img: p.sprites.other['official-artwork'].front_default,
            types: p.types.map(t => {
                const typeMap = { 'fire': '불꽃', 'water': '물', 'grass': '풀', 'electric': '전기', 'normal': '노말', 'fighting': '격투', 'flying': '비행', 'poison': '독', 'ground': '땅', 'rock': '바위', 'bug': '벌레', 'ghost': '고스트', 'steel': '강철', 'psychic': '에스퍼', 'ice': '얼음', 'dragon': '드래곤', 'dark': '악', 'fairy': '페어리' };
                return typeMap[t.type.name];
            }),
            skills: [] // Skills will be assigned per stage
        }));
    } catch (error) {
        console.error("Error fetching opponent data:", error);
        alert("몬스터 데이터를 불러오는 데 실패했습니다. 인터넷 연결을 확인하고 잠시 후 다시 시도해주세요.");
    }
}


function setupGameStages() {
    let availableOpponents = [...OPPONENT_POOL].filter(opp => opp.name !== playerPokemon.name);
    // Shuffle opponents
    for (let i = availableOpponents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableOpponents[i], availableOpponents[j]] = [availableOpponents[j], availableOpponents[i]];
    }

    // Shuffle quizzes
    masterShuffledQuizzes = [...QUIZZES];
    for (let i = masterShuffledQuizzes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [masterShuffledQuizzes[i], masterShuffledQuizzes[j]] = [masterShuffledQuizzes[j], masterShuffledQuizzes[i]];
    }
    
    const numStages = 10; // Or availableOpponents.length
    gameStages = [];
    for (let i = 0; i < numStages && i < availableOpponents.length; i++) {
        const stageQuizzes = masterShuffledQuizzes.slice(i * QUESTIONS_PER_STAGE, (i + 1) * QUESTIONS_PER_STAGE);
        gameStages.push({
            opponent: availableOpponents[i],
            quizzes: stageQuizzes
        });
    }
}

// --- Pokemon & Skill Selection ---
function populatePokemonSelection() {
    const selectionDiv = document.getElementById('pokemon-selection');
    selectionDiv.innerHTML = '';
    for (const key in POKEMONS) {
        const pokemon = POKEMONS[key];
        const card = document.createElement('div');
        card.className = 'p-4 bg-gray-100 rounded-lg text-center cursor-pointer hover:bg-blue-200 hover:shadow-lg transition-all transform hover:scale-105';
        card.innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}" class="w-24 h-24 mx-auto mb-2 object-contain">
                          <p class="font-bold text-lg">${pokemon.name}</p>`;
        card.onclick = () => selectPokemon(key);
        selectionDiv.appendChild(card);
    }
}

function selectPokemon(pokemonKey) {
    playerPokemon = { ...POKEMONS[pokemonKey] }; // Create a copy
    playerPokemon.maxHp = playerPokemon.hp;
    learnedSkills = [DEFAULT_SKILL];
    setupGameStages();
    startNextStage();
}

// --- ★★★ CRITICAL FIX: Assign skills to opponent ★★★ ---
function assignSkillsToOpponent(pokemon) {
    const assignedSkills = [DEFAULT_SKILL];
    const availableTypedSkills = Object.values(SKILLS).filter(skill => 
        pokemon.types.includes(skill.type) && skill.name !== DEFAULT_SKILL.name
    );

    // Add up to 2 random typed skills
    for (let i = 0; i < 2 && availableTypedSkills.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableTypedSkills.length);
        const skill = availableTypedSkills.splice(randomIndex, 1)[0]; // Remove to avoid duplicates
        if (skill) {
            assignedSkills.push(skill);
        }
    }
    pokemon.skills = assignedSkills;
}


// --- Stage & Game Flow ---
function startNextStage() {
    hideModals();
    if (currentStage >= gameStages.length) {
        showEnding();
        return;
    }
    
    opponentPokemon = { ...gameStages[currentStage].opponent };
    opponentPokemon.maxHp = opponentPokemon.hp;
    
    // ★★★ FIX: Assign skills to the new opponent ★★★
    assignSkillsToOpponent(opponentPokemon);
    
    correctAnswersThisStage = 0;
    startQuizStage();
}

function startQuizStage() {
    showScreen('quiz');
    playBgm('quiz');
    currentQuestionIndex = 0;
    shuffledQuizzes = gameStages[currentStage].quizzes;
    displayQuestion();
}

function startBattle() {
    isBattling = true;
    showScreen('battle');
    playBgm('battle');
    updateBattleUI();
}

// --- Quiz Logic ---
function displayQuestion() {
    const progressBar = document.getElementById('quiz-progress-bar').querySelector('div');
    progressBar.style.width = `${((currentQuestionIndex) / QUESTIONS_PER_STAGE) * 100}%`;

    const question = shuffledQuizzes[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'bg-blue-100 text-blue-800 font-semibold p-4 rounded-lg hover:bg-blue-300 transition-colors';
        button.onclick = () => selectAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedOption) {
    const question = shuffledQuizzes[currentQuestionIndex];
    const isCorrect = selectedOption === question.answer;
    
    if (isCorrect) {
        correctAnswersThisStage++;
    }

    const title = isCorrect ? '정답입니다!' : '오답입니다!';
    showExplanation(title, question.explanation);
}

function showExplanation(title, text) {
    document.getElementById('explanation-title').textContent = title;
    document.getElementById('explanation-text').innerHTML = text;
    showModal('explanation');
}

function closeExplanationAndContinue() {
    hideModals();
    currentQuestionIndex++;
    if (currentQuestionIndex >= QUESTIONS_PER_STAGE) {
        // Quiz part of the stage is over
        showLevelUpModal();
    } else {
        displayQuestion();
    }
}

function showLevelUpModal() {
    const bonusMessage = document.getElementById('level-up-modal').querySelector('p');
    bonusMessage.textContent = `퀴즈를 ${correctAnswersThisStage}개 맞춰 능력이 향상되었습니다. 보너스를 선택하세요!`;
    if (correctAnswersThisStage === 0) { // If no answers were correct
       startBattle();
    } else {
       showModal('levelUp');
    }
}

function chooseHpBonus() {
    const hpBonus = correctAnswersThisStage * 10;
    playerPokemon.maxHp += hpBonus;
    playerPokemon.hp += hpBonus;
    hideModals();
    startBattle();
}

function choosePotionBonus() {
    playerInventory.potion += correctAnswersThisStage;
    hideModals();
    startBattle();
}


// --- Battle Logic ---
function updateBattleUI() {
    // Player
    document.getElementById('player-pokemon-img').src = playerPokemon.img;
    document.getElementById('player-name').textContent = playerPokemon.name;
    updateHP('player', playerPokemon.hp, playerPokemon.maxHp);

    // Opponent
    document.getElementById('opponent-pokemon-img').src = opponentPokemon.img;
    document.getElementById('opponent-name').textContent = opponentPokemon.name;
    updateHP('opponent', opponentPokemon.hp, opponentPokemon.maxHp);
    
    // Skills
    const skillsDiv = document.getElementById('battle-skills');
    skillsDiv.innerHTML = '';
    learnedSkills.forEach(skill => {
        const button = document.createElement('button');
        button.className = 'bg-gray-200 text-black p-2 rounded-lg font-bold hover:bg-yellow-200';
        button.innerHTML = `${skill.name}<br><span class="text-xs font-normal">${skill.type} / ${skill.damage}</span>`;
        button.onclick = () => playerAttack(skill);
        skillsDiv.appendChild(button);
    });
    
    // Potion Button
    const potionButton = document.getElementById('use-potion-button');
    potionButton.textContent = `포션 (${playerInventory.potion})`;
    potionButton.disabled = playerInventory.potion <= 0 || playerPokemon.hp === playerPokemon.maxHp;
}

function playerAttack(skill) {
    if (!isBattling) return;
    performAttack(playerPokemon, opponentPokemon, skill, 'player');
    
    if (opponentPokemon.hp > 0) {
        isBattling = false; // Disable player controls during opponent's turn
        setTimeout(() => {
            opponentAttack();
            isBattling = true; // Re-enable controls
        }, 1500);
    }
}

function opponentAttack() {
    if (!isBattling) return;
    const skill = opponentPokemon.skills[Math.floor(Math.random() * opponentPokemon.skills.length)];
    performAttack(opponentPokemon, playerPokemon, skill, 'opponent');
}

function performAttack(attacker, defender, skill, attackerSide) {
    createAttackAnimation(attackerSide, skill.type);
    
    let message = `${attacker.name}의 ${skill.name}!`;
    
    if (Math.random() < skill.accuracy) {
        const { damage, multiplier } = calculateDamage(skill, attacker, defender);
        defender.hp = Math.max(0, defender.hp - damage);
        
        if (multiplier > 1) message += ' 효과가 굉장했다!';
        if (multiplier < 1 && multiplier > 0) message += ' 효과가 별로인 듯하다...';
        if (multiplier === 0) message += ' 효과가 없는 것 같다...';

    } else {
        message += ' 하지만 빗나갔다!';
    }
    
    showBattleLog(message);
    
    if (skill.effect) {
        skill.effect(attacker);
    }

    updateHP(attackerSide, attacker.hp, attacker.maxHp);
    const defenderSide = (attackerSide === 'player') ? 'opponent' : 'player';
    updateHP(defenderSide, defender.hp, defender.maxHp);
    
    if (defender.hp <= 0) {
        endBattle(defenderSide === 'player');
    }
}

function calculateDamage(skill, attacker, defender) {
    let multiplier = 1;
    const typeData = TYPE_CHART[skill.type];
    if (typeData) {
        defender.types.forEach(defType => {
            if (typeData.strong.includes(defType)) multiplier *= 2;
            if (typeData.weak.includes(defType)) multiplier *= 0.5;
            if (typeData.immune.includes(defType)) multiplier *= 0;
        });
    }
    const damage = Math.floor(skill.damage * multiplier);
    return { damage, multiplier };
}

function usePotion() {
    if (playerInventory.potion > 0 && playerPokemon.hp < playerPokemon.maxHp) {
        playerInventory.potion--;
        const healAmount = Math.floor(playerPokemon.maxHp * 0.5);
        playerPokemon.hp = Math.min(playerPokemon.maxHp, playerPokemon.hp + healAmount);
        updateBattleUI();
        showBattleLog(`${playerPokemon.name}은(는) 포션을 사용해서 HP를 회복했다!`);
    }
}

function updateHP(side, current, max) {
    const hpText = document.getElementById(`${side}-hp`);
    const hpBar = document.getElementById(`${side}-hp-bar`);
    if(hpText) hpText.textContent = current;
    if(hpBar) {
        const percentage = (current / max) * 100;
        hpBar.style.width = `${percentage}%`;
        if (percentage < 20) hpBar.classList.add('bg-red-500');
        else if (percentage < 50) hpBar.classList.add('bg-yellow-500');
        else hpBar.classList.remove('bg-red-500', 'bg-yellow-500');
    }
}

function endBattle(playerLost) {
    isBattling = false;
    setTimeout(() => {
        if (playerLost) {
            showModal('record');
            document.getElementById('final-stage-record').textContent = currentStage + 1;
        } else {
            // Player won
            document.getElementById('stage-clear-text').textContent = `스테이지 ${currentStage + 1} 클리어! ${opponentPokemon.name}을(를) 이겼다!`;
            showModal('stageClear');
        }
    }, 1500);
}

function handleStageClear() {
    hideModals();
    // ★★★ FIX: Player now gets to CHOOSE a skill to learn ★★★
    const learnableSkills = opponentPokemon.skills.filter(s => s.name !== DEFAULT_SKILL.name);
    if (learnableSkills.length > 0) {
        const newSkill = learnableSkills[Math.floor(Math.random() * learnableSkills.length)];
        learnSkill(newSkill);
    } else {
        // If opponent has no other skills, just move on
        startNextStage();
    }
}


function learnSkill(newSkill) {
    if (learnedSkills.find(s => s.name === newSkill.name)) {
        // Already know this skill, move to next stage
        startNextStage();
        return;
    }

    if (learnedSkills.length >= 4) {
        showForgetSkillModal(newSkill);
    } else {
        learnedSkills.push(newSkill);
        showBattleLog(`${playerPokemon.name}은(는) ${newSkill.name}을(를) 배웠다!`);
        setTimeout(startNextStage, 1500);
    }
}

function showForgetSkillModal(newSkill) {
    document.getElementById('new-skill-info').textContent = `새로 배울 기술: ${newSkill.name} (${newSkill.type})`;
    const container = document.getElementById('skills-to-forget');
    container.innerHTML = '';
    learnedSkills.forEach((skill, index) => {
        const button = document.createElement('button');
        button.className = 'bg-gray-200 text-black p-2 rounded-lg font-bold hover:bg-red-300';
        button.innerHTML = `${skill.name}<br><span class="text-xs font-normal">${skill.type} / ${skill.damage}</span>`;
        button.onclick = () => forgetAndLearn(index, newSkill);
        container.appendChild(button);
    });
    showModal('forgetSkill', { newSkill: newSkill });
}

function forgetAndLearn(indexToForget, newSkill) {
    const forgottenSkill = learnedSkills[indexToForget];
    learnedSkills[indexToForget] = newSkill;
    hideModals();
    showBattleLog(`${playerPokemon.name}은(는) ${forgottenSkill.name}을(를) 잊고 ${newSkill.name}을(를) 배웠다!`);
    setTimeout(startNextStage, 1500);
}

function skipLearning() {
    hideModals();
    startNextStage();
}

function showBattleLog(message) {
    clearTimeout(battleLogTimeout);
    const log = document.getElementById('battle-log');
    log.textContent = message;
    log.classList.remove('hidden');
    battleLogTimeout = setTimeout(() => log.classList.add('hidden'), 2000);
}


// --- Animation ---
function createAttackAnimation(attackerSide, type) {
    const overlay = document.getElementById('attack-animation-overlay');
    const effect = document.createElement('div');
    effect.className = `effect-${type} absolute`;
    
    const startPos = (attackerSide === 'player') ? document.getElementById('player-pokemon-img') : document.getElementById('opponent-pokemon-img');
    const endPos = (attackerSide === 'player') ? document.getElementById('opponent-pokemon-img') : document.getElementById('player-pokemon-img');

    const startRect = startPos.getBoundingClientRect();
    const endRect = endPos.getBoundingClientRect();
    const containerRect = overlay.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2 - containerRect.left;
    const startY = startRect.top + startRect.height / 2 - containerRect.top;
    const endX = endRect.left + endRect.width / 2 - containerRect.left;
    const endY = endRect.top + endRect.height / 2 - containerRect.top;
    
    effect.style.setProperty('--start-x', `${startX}px`);
    effect.style.setProperty('--start-y', `${startY}px`);
    effect.style.setProperty('--end-x', `${endX}px`);
    effect.style.setProperty('--end-y', `${endY}px`);
    // For translate-based animations
    effect.style.setProperty('--end-translate-x', `${endX - startX}px`);
    effect.style.setProperty('--end-translate-y', `${endY - startY}px`);

    overlay.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}


// --- Records / Hall of Fame ---
function saveRecord() {
    const name = document.getElementById('player-name-input').value.trim();
    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }
    const records = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    records.push({ name: name, stage: currentStage + 1 });
    records.sort((a, b) => b.stage - a.stage); // Sort by stage descending
    localStorage.setItem('hallOfFame', JSON.stringify(records.slice(0, 10))); // Keep top 10
    
    displayHallOfFame();
    hideModals();
    showModal('hallOfFame');
}

function displayHallOfFame() {
    const records = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    const list = document.getElementById('hall-of-fame-list');
    list.innerHTML = '';
    if (records.length === 0) {
        list.innerHTML = '<li>아직 기록이 없습니다.</li>';
    } else {
        records.forEach((record, index) => {
            const li = document.createElement('li');
            li.className = 'p-2 rounded ' + (index % 2 === 0 ? 'bg-gray-100' : '');
            li.innerHTML = `<span class="font-bold text-lg">${index + 1}. ${record.name}</span> - <span class="text-blue-600">Stage ${record.stage}</span>`;
            list.appendChild(li);
        });
    }
}

function showEnding() {
    playBgm(null); // Stop music
    showModal('ending');
}

function resetGame() {
    hideModals();
    initializeGame();
}

// --- Event Listeners ---
window.onload = () => {
    document.getElementById('start-button').addEventListener('click', () => {
        populatePokemonSelection();
        showScreen('selection');
    });
    
    document.getElementById('close-explanation-button').addEventListener('click', closeExplanationAndContinue);
    document.getElementById('next-stage-button').addEventListener('click', handleStageClear);
    document.getElementById('dont-learn-skill-button').addEventListener('click', skipLearning);
    document.getElementById('restart-game-button').addEventListener('click', resetGame);
    document.getElementById('use-potion-button').addEventListener('click', usePotion);
    
    document.getElementById('submit-record-button').addEventListener('click', saveRecord);
    document.getElementById('hall-of-fame-button').addEventListener('click', () => {
        displayHallOfFame();
        showModal('hallOfFame');
    });
    document.getElementById('close-hof-button').addEventListener('click', resetGame); // Close HoF and restart
    document.getElementById('go-to-hof-button').addEventListener('click', () => {
        displayHallOfFame();
        showModal('hallOfFame');
    });
    document.getElementById('type-chart-icon').addEventListener('click', () => showModal('typeChart'));
    document.getElementById('close-type-chart-button').addEventListener('click', hideModals);
    document.getElementById('hp-bonus-button').addEventListener('click', chooseHpBonus);
    document.getElementById('potion-bonus-button').addEventListener('click', choosePotionBonus);

    // Volume controls
    const volumeSlider = document.getElementById('volume-slider');
    const volumeControl = document.getElementById('volume-control');
    const soundOnIcon = document.getElementById('sound-on-icon');
    const soundOffIcon = document.getElementById('sound-off-icon');

    function setVolume(volume) {
        bgm.battle.volume = volume;
        bgm.quiz.volume = volume;
        soundOnIcon.classList.toggle('hidden', volume <= 0);
        soundOffIcon.classList.toggle('hidden', volume > 0);
    }
    
    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

    volumeControl.addEventListener('mouseenter', () => volumeSlider.classList.remove('hidden'));
    volumeControl.addEventListener('mouseleave', () => volumeSlider.classList.add('hidden'));
    
    volumeControl.addEventListener('click', (e) => {
        if (e.target.id !== 'volume-slider') {
            const currentVolume = bgm.battle.volume;
            const newVolume = currentVolume > 0 ? 0 : 0.5;
            volumeSlider.value = newVolume;
            setVolume(newVolume);
        }
    });
    
    // Initial setup
    initializeGame();
};