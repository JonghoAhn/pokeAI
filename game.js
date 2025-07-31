// --- 게임 변수 설정 ---
let playerPokemon = {}, opponentPokemon = {}, currentQuestionIndex = 0, learnedSkills = [], isBattling = false;
let masterShuffledQuizzes = [], shuffledQuizzes = [], currentStage = 0, gameStages = [], battleSkills = [];
let isAnswerCorrect = false;
let playerInventory = { potion: 0 };
const QUESTIONS_PER_STAGE = 2;

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

    playerPokemon = { ...POKEMONS[selectedKey], maxHp: POKEMONS[selectedKey].hp, statusEffects: {}, statModifiers: { attack: 0 } };
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
    if (currentQuestionIndex >= QUESTIONS_PER_STAGE) {
        document.getElementById('feedback-message').textContent = "기술 습득 완료! 배틀을 시작합니다!";
        setTimeout(startBattle, 1500);
        return;
    }
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
        title.textContent = '✅ 정답입니다!';
        title.className = 'text-3xl font-bold mb-4 text-green-600';
    } else {
        title.textContent = '❌ 틀렸습니다!';
        title.className = 'text-3xl font-bold mb-4 text-red-600';
    }
    document.getElementById('explanation-text').innerHTML = `<strong>해설:</strong> ${quiz.explanation}`;
    showModal('explanation');
}

function proceedAfterExplanation() {
    hideModals();
    if (isAnswerCorrect) {
        showSkillSelection();
    } else {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function showSkillSelection() {
    const choicesContainer = document.getElementById('skill-choices');
    choicesContainer.innerHTML = '';
    
    let potentialSkills = playerPokemon.types.flatMap(type => SKILLS[type] || []);
    
    let normalSkills = SKILLS['노말'] || [];
    if (currentStage < 2) {
        // 초반에는 위력 40 이상 기술 제외 (파괴광선 등)
        normalSkills = normalSkills.filter(skill => !skill.power || skill.power < 40);
    }
    potentialSkills.push(...normalSkills);

    // 중복 제거 (이름 기준)
    potentialSkills = potentialSkills.filter((skill, index, self) =>
        index === self.findIndex((s) => s.name === skill.name)
    );

    let availableSkills = potentialSkills.filter(skill => !learnedSkills.some(learned => learned.name === skill.name));

    if (availableSkills.length === 0) {
        hideModals();
        proceedToNextQuestion();
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

function proceedToNextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function learnSkill(newSkill) {
    hideModals();
    if (learnedSkills.length >= 4) {
        showForgetSkillModal(newSkill);
    } else {
        learnedSkills.push(newSkill);
        proceedToNextQuestion();
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
    proceedToNextQuestion();
}

// --- 배틀 관련 함수 ---
function startBattle() {
    const bgmBattle = document.getElementById('bgm-battle');
    const bgmQuiz = document.getElementById('bgm-quiz');
    bgmQuiz.pause();
    bgmBattle.play().catch(e => console.log("Battle BGM failed to play:", e));

    isBattling = true;
    opponentPokemon = { ...gameStages[currentStage].opponent, statusEffects: {}, statModifiers: { attack: 0 } };
    
    // PP 초기화
    if (learnedSkills.length === 0) {
        battleSkills = [{ ...DEFAULT_SKILL, pp: 3, maxPp: 3 }];
    } else {
        battleSkills = learnedSkills.map(skill => ({ ...skill, pp: 3, maxPp: 3 }));
    }

    document.getElementById('stage-title-battle').textContent = gameStages[currentStage].name;
    document.getElementById('battle-log').innerHTML = ''; // 배틀 로그 초기화
    showScreen('battle');
    
    document.getElementById('player-img').src = playerPokemon.img;
    document.getElementById('player-name').textContent = `${playerPokemon.name} (${playerPokemon.types.join('/')})`;
    updateHpBar('player', playerPokemon.hp, playerPokemon.maxHp);

    document.getElementById('opponent-img').src = opponentPokemon.img;
    document.getElementById('opponent-name').textContent = `${opponentPokemon.name} (${opponentPokemon.types.join('/')})`;
    updateHpBar('opponent', opponentPokemon.hp, opponentPokemon.maxHp);
    
    updateActionButtons();
    logMessage(`${opponentPokemon.name}이(가) 나타났다!`);
}

function updateActionButtons() {
    const skillButtonsContainer = document.getElementById('skill-buttons');
    skillButtonsContainer.innerHTML = '';
    
    const canUseAnySkill = battleSkills.some(skill => skill.pp > 0);

    if (canUseAnySkill) {
        battleSkills.forEach(skill => {
            const button = document.createElement('button');
            const skillDesc = skill.power ? `(위력:${skill.power})` : `(변화)`;
            button.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg shadow transition text-sm';
            button.textContent = `${skill.name} ${skillDesc} (${skill.pp}/${skill.maxPp})`;
            if (skill.pp <= 0) {
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            }
            button.onclick = () => {
                playerTurn(skill);
            };
            skillButtonsContainer.appendChild(button);
        });
    } else {
        // 발버둥치기 버튼
        const button = document.createElement('button');
        button.className = 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg shadow transition text-sm col-span-2';
        button.textContent = '발버둥치기';
        button.onclick = () => {
            playerTurn(STRUGGLE_SKILL);
        };
        skillButtonsContainer.appendChild(button);
    }


    const itemButtonsContainer = document.getElementById('item-buttons');
    itemButtonsContainer.innerHTML = '';
    if (playerInventory.potion > 0) {
        const button = document.createElement('button');
        button.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg shadow transition text-sm col-span-2';
        button.textContent = `상처약 (${playerInventory.potion}개)`;
        button.onclick = () => {
            useItem('potion');
        };
        itemButtonsContainer.appendChild(button);
    } else {
         itemButtonsContainer.innerHTML = '<p class="text-gray-500 text-center col-span-2">가방이 비었다</p>';
    }
}

function updateHpBar(target, currentHp, maxHp) {
    const hpBar = document.getElementById(`${target}-hp`);
    const percentage = Math.max(0, (currentHp / maxHp) * 100);
    hpBar.style.width = `${percentage}%`;
    hpBar.textContent = `HP ${Math.max(0, Math.round(currentHp))}/${maxHp}`;
}

function logMessage(message) {
    const log = document.getElementById('battle-log');
    log.innerHTML += `<p>${message}</p>`;
    log.scrollTop = log.scrollHeight;
}

function calculateDamage(skill, attacker, defender) {
    let baseDamage = skill.power || 0;
    if (baseDamage === 0) return 0;

    // 능력치 변화 계산 추가
    const attackStat = attacker.statModifiers.attack;
    const attackMultiplier = Math.max(0.25, 1 + (attackStat * 0.25)); // 최소 배율 제한
    baseDamage *= attackMultiplier;

    let totalMultiplier = 1;

    defender.types.forEach(defendingType => {
        const multiplier = TYPE_CHART[skill.type]?.[defendingType];
        if (multiplier !== undefined) { totalMultiplier *= multiplier; }
    });
    setTimeout(() => {
        if (totalMultiplier >= 2) logMessage("효과가 굉장했다!");
        else if (totalMultiplier > 0 && totalMultiplier < 1) logMessage("효과가 별로인 듯하다...");
        else if (totalMultiplier === 0) logMessage(`${defender.name}에게는 효과가 없는 것 같다...`);
    }, 200);
    
    const finalDamage = baseDamage * totalMultiplier;
    return finalDamage > 0 ? Math.round(finalDamage) : 0;
}

function playAttackAnimation(skill, attackerId, defenderId) {
    const overlay = document.getElementById('attack-animation-overlay');
    const attackerElem = document.getElementById(attackerId);
    const defenderElem = document.getElementById(defenderId);
    if (!attackerElem || !defenderElem) return;

    const attackerRect = attackerElem.getBoundingClientRect();
    const defenderRect = defenderElem.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    const startX = attackerRect.left - overlayRect.left + attackerRect.width / 2;
    const startY = attackerRect.top - overlayRect.top + attackerRect.height / 2;
    const endX = defenderRect.left - overlayRect.left + defenderRect.width / 2;
    const endY = defenderRect.top - overlayRect.top + defenderRect.height / 2;

    const effect = document.createElement('div');
    effect.className = 'attack-effect';
    
    let animationClass = '';
    switch(skill.type) {
        case '전기': animationClass = 'electric-effect'; break;
        case '물': animationClass = 'water-effect'; break;
        case '불': animationClass = 'fire-effect'; break;
        case '풀': animationClass = 'grass-effect'; break;
        case '노말': animationClass = 'normal-effect'; break;
        case '격투': animationClass = 'fighting-effect'; break;
        // 다른 타입들도 추가 가능
    }

    if (animationClass) {
        effect.classList.add(animationClass);
        effect.style.setProperty('--start-x', `${startX}px`);
        effect.style.setProperty('--start-y', `${startY}px`);
        effect.style.setProperty('--end-x', `${endX}px`);
        effect.style.setProperty('--end-y', `${endY}px`);
        
        if (['electric-effect', 'fire-effect', 'normal-effect', 'fighting-effect'].includes(animationClass)) {
            effect.style.left = `${endX - effect.offsetWidth / 2}px`;
            effect.style.top = `${endY - effect.offsetHeight / 2}px`;
        } else {
            effect.style.left = `0px`;
            effect.style.top = `0px`;
        }
        
        overlay.appendChild(effect);
        setTimeout(() => {
            overlay.removeChild(effect);
        }, 800);
    }
}

function attack(attacker, defender, skill, onComplete) {
    const attackerElem = document.getElementById(`${attacker.id}-img`);
    attackerElem.classList.add('attack');
    setTimeout(() => attackerElem.classList.remove('attack'), 300);
    
    playAttackAnimation(skill, `${attacker.id}-img`, `${defender.id}-img`);

    logMessage(`${attacker.pokemon.name}의 ${skill.name} 공격!`);
    
    setTimeout(() => {
        const damage = calculateDamage(skill, attacker.pokemon, defender.pokemon);
        defender.pokemon.hp -= damage;
        updateHpBar(defender.id, defender.pokemon.hp, defender.pokemon.maxHp);
        const defenderElem = document.getElementById(`${defender.id}-img`);
        defenderElem.classList.add('damaged');
        setTimeout(() => defenderElem.classList.remove('damaged'), 500);
        onComplete();
    }, 400); // 애니메이션 시간 고려
}

function disableAllActions() {
    document.querySelectorAll('#skill-buttons button, #item-buttons button').forEach(b => b.disabled = true);
}

function enableAllActions() {
    document.querySelectorAll('#skill-buttons button, #item-buttons button').forEach(b => b.disabled = false);
    updateActionButtons(); // 아이템 수량 및 PP에 따라 버튼 다시 그림
}

function useItem(itemName) {
    if (!isBattling || playerInventory[itemName] <= 0) return;
    isBattling = false;
    disableAllActions();

    if (itemName === 'potion') {
        playerInventory.potion--;
        const healAmount = 50; // 회복량 50으로 수정
        playerPokemon.hp = Math.min(playerPokemon.maxHp, playerPokemon.hp + healAmount);
        logMessage(`${playerPokemon.name}은(는) 상처약을 사용했다! HP를 ${healAmount} 회복했다!`);
        updateHpBar('player', playerPokemon.hp, playerPokemon.maxHp);
    }
    
    setTimeout(opponentTurn, 1500);
}

function playerTurn(skill) {
    if (!isBattling) return;
    isBattling = false;
    disableAllActions();

    // PP 감소 로직
    if (!skill.isStruggle) {
        const skillInBattle = battleSkills.find(s => s.name === skill.name);
        if (skillInBattle && skillInBattle.pp > 0) {
            skillInBattle.pp--;
        }
    }

    if (skill.power > 0) {
         attack( { id: 'player', pokemon: playerPokemon }, { id: 'opponent', pokemon: opponentPokemon }, skill, () => {
            if (opponentPokemon.hp <= 0) {
                logMessage(`${opponentPokemon.name}을(를) 쓰러트렸다!`);
                endBattle(true);
            } else {
                setTimeout(opponentTurn, 1500);
            }
        });
    } else {
        // 변화 기술 로직
        logMessage(`${playerPokemon.name}의 ${skill.name}!`);
        const effect = skill.effect;
        setTimeout(() => {
            if (effect && effect.type === 'stat') {
                const targetPokemon = effect.target === 'player' ? playerPokemon : opponentPokemon;
                targetPokemon.statModifiers[effect.stat] += effect.change;
                targetPokemon.statModifiers[effect.stat] = Math.max(-6, Math.min(6, targetPokemon.statModifiers[effect.stat]));
                
                let targetName = effect.target === 'player' ? playerPokemon.name : opponentPokemon.name;
                let statName = '공격력';
                let changeText = effect.change > 0 ? '올랐다!' : '떨어졌다!';
                if (Math.abs(effect.change) >= 2) changeText = '크게 ' + changeText;

                logMessage(`${targetName}의 ${statName}이(가) ${changeText}`);
            }
            setTimeout(opponentTurn, 1500);
        }, 500);
    }
}

function opponentTurn() {
    let skill;

    // 스테이지 1, 2 AI 수정
    if (currentStage < 2) { 
        const nonDamagingMoves = opponentPokemon.skills.filter(s => !s.power);
        const damagingMoves = opponentPokemon.skills.filter(s => s.power);

        // 40% 확률로 변화 기술 사용
        if (nonDamagingMoves.length > 0 && Math.random() < 0.4) { 
            skill = nonDamagingMoves[Math.floor(Math.random() * nonDamagingMoves.length)];
        } else if (damagingMoves.length > 0) {
            skill = damagingMoves[Math.floor(Math.random() * damagingMoves.length)];
        } else {
            // 한 종류의 기술만 있다면 그 중에서 랜덤 선택
            skill = opponentPokemon.skills[Math.floor(Math.random() * opponentPokemon.skills.length)];
        }
    } else { // 그 이후 스테이지 AI
        skill = opponentPokemon.skills[Math.floor(Math.random() * opponentPokemon.skills.length)];
    }


    if (skill.power > 0) { // 공격 기술
        attack({ id: 'opponent', pokemon: opponentPokemon }, { id: 'player', pokemon: playerPokemon }, skill, () => {
            if (playerPokemon.hp <= 0) {
                logMessage(`${playerPokemon.name}이(가) 쓰러졌다...`);
                endBattle(false);
            } else {
                isBattling = true;
                enableAllActions();
            }
        });
    } else { // 변화 기술
        logMessage(`${opponentPokemon.name}의 ${skill.name}!`);
        const effect = skill.effect;
        setTimeout(() => {
            if (effect && effect.type === 'stat') {
                // BUG FIX: Correctly target player when opponent uses a move with target 'opponent'
                const targetPokemon = effect.target === 'opponent' ? playerPokemon : opponentPokemon;
                const targetName = effect.target === 'opponent' ? playerPokemon.name : opponentPokemon.name;

                targetPokemon.statModifiers[effect.stat] += effect.change;
                targetPokemon.statModifiers[effect.stat] = Math.max(-6, Math.min(6, targetPokemon.statModifiers[effect.stat]));
                
                let statName = '공격력';
                let changeText = effect.change > 0 ? '올랐다!' : '떨어졌다!';
                if (Math.abs(effect.change) >= 2) changeText = '크게 ' + changeText;

                logMessage(`${targetName}의 ${statName}이(가) ${changeText}`);
            }
            isBattling = true;
            enableAllActions();
        }, 1000);
    }
}

function endBattle(isVictory) {
    const bgmBattle = document.getElementById('bgm-battle');
    bgmBattle.pause();
    bgmBattle.currentTime = 0;
    isBattling = false;
    setTimeout(() => {
        if (isVictory) {
            if (currentStage < gameStages.length - 1) {
                playerInventory.potion++; // 스테이지 클리어 보상
                const hpGrowth = 10;
                const powerGrowth = 5;
                playerPokemon.maxHp += hpGrowth;
                learnedSkills.forEach(skill => {
                    if (skill.power) {
                        skill.power += powerGrowth;
                    }
                });
                document.getElementById('stage-clear-message').innerHTML = `
                    포켓몬의 체력이 모두 회복되었습니다.<br>
                    보상으로 <span class="text-green-500">상처약</span>을 획득했습니다!<br>
                    <span class="font-bold text-blue-600">포켓몬이 더 강해졌습니다! (최대 HP +${hpGrowth}, 공격 기술 위력 +${powerGrowth})</span>
                `;
                showModal('stageClear');
            } else {
                showModal('record');
            }
        } else {
            document.getElementById('result-title').textContent = '패배...';
            document.getElementById('result-message').textContent = '아쉽지만 괜찮아요. 다시 도전해서 꼭 이겨보세요!';
            showModal('result');
        }
    }, 1000);
}

function resetGame() {
    const bgmBattle = document.getElementById('bgm-battle');
    const bgmQuiz = document.getElementById('bgm-quiz');
    bgmBattle.pause();
    bgmBattle.currentTime = 0;
    bgmQuiz.pause();
    bgmQuiz.currentTime = 0;
    hideModals();
    showScreen('start');
}

// --- BGM 제어 ---
const bgmBattle = document.getElementById('bgm-battle');
const bgmQuiz = document.getElementById('bgm-quiz');
const volumeControl = document.getElementById('volume-control');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');
const volumeSlider = document.getElementById('volume-slider');
let isMuted = false;

bgmBattle.volume = volumeSlider.value;
bgmQuiz.volume = volumeSlider.value;

function toggleMute() {
    isMuted = !isMuted;
    bgmBattle.muted = isMuted;
    bgmQuiz.muted = isMuted;
    soundOnIcon.classList.toggle('hidden', isMuted);
    soundOffIcon.classList.toggle('hidden', !isMuted);
    if (isMuted) {
        volumeSlider.value = 0;
    } else {
        volumeSlider.value = bgmBattle.volume;
    }
}

volumeControl.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    bgmBattle.volume = volume;
    bgmQuiz.volume = volume;

    if (volume > 0 && isMuted) {
        isMuted = false;
        bgmBattle.muted = false;
        bgmQuiz.muted = false;
        soundOnIcon.classList.remove('hidden');
        soundOffIcon.classList.add('hidden');
    } else if (volume == 0 && !isMuted) {
        isMuted = true;
        bgmBattle.muted = true;
        bgmQuiz.muted = true;
        soundOnIcon.classList.add('hidden');
        soundOffIcon.classList.remove('hidden');
    }
});

// --- 명예의 전당 ---
async function loadRecords() {
    try {
        // GitHub Pages 등에서 record.json 파일을 불러옵니다.
        const response = await fetch('record.json');
        if (!response.ok) return []; // 파일이 없으면 빈 배열 반환
        return await response.json();
    } catch (error) {
        console.warn("record.json을 불러올 수 없습니다. localStorage를 사용합니다.");
        const records = localStorage.getItem('hallOfFame');
        return records ? JSON.parse(records) : [];
    }
}

async function saveRecord(nickname) {
    const records = await loadRecords();
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    records.push({ date: dateString, nickname: nickname, score: currentStage + 1 });
    records.sort((a, b) => b.score - a.score); // 점수 내림차순 정렬
    
    // localStorage에 저장 (GitHub에 직접 쓸 수 없으므로)
    // 실제 웹서버에서는 이 부분에 서버로 데이터를 보내는 로직을 구현해야 합니다.
    localStorage.setItem('hallOfFame', JSON.stringify(records.slice(0, 10))); // 상위 10개만 저장
    
    alert('기록이 저장되었습니다!');
    resetGame();
}

async function displayHallOfFame() {
    const records = await loadRecords();
    const tbody = document.getElementById('hall-of-fame-body');
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4">아직 기록이 없습니다.</td></tr>';
    } else {
        records.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="p-2">${record.date}</td><td class="p-2">${record.nickname}</td><td class="p-2">${record.score}</td>`;
            tbody.appendChild(tr);
        });
    }
    showModal('hallOfFame');
}

// --- 이벤트 리스너 ---
document.getElementById('start-game-button').addEventListener('click', () => {
    showScreen('selection');
});
document.getElementById('play-again-button').addEventListener('click', () => {
    resetGame();
});
document.getElementById('next-stage-button').addEventListener('click', () => {
    currentStage++;
    startStage();
});
document.getElementById('cancel-forget-button').addEventListener('click', () => {
    hideModals();
    proceedToNextQuestion();
});
document.getElementById('next-question-button').addEventListener('click', () => {
    proceedAfterExplanation();
});
document.getElementById('type-chart-icon').addEventListener('click', () => {
    showModal('typeChart');
});
document.getElementById('close-type-chart-button').addEventListener('click', () => {
     hideModals();
});
document.getElementById('hall-of-fame-button').addEventListener('click', () => {
    displayHallOfFame();
});
document.getElementById('close-hof-button').addEventListener('click', () => {
    hideModals();
});
document.getElementById('submit-record-button').addEventListener('click', () => {
    const nicknameInput = document.getElementById('nickname-input');
    if (nicknameInput.value.trim() === '') {
        alert('닉네임을 입력해주세요!');
        return;
    }
    saveRecord(nicknameInput.value.trim());
});


window.onload = () => {
    initSelectionScreen();
    showScreen('start');
};
