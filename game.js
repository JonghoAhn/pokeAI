document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {
        start: document.getElementById('start-screen'),
        selection: document.getElementById('selection-screen'),
        quiz: document.getElementById('quiz-screen'),
        battle: document.getElementById('battle-screen'),
    };

    const modals = {
        stageClear: document.getElementById('stage-clear-modal'),
        result: document.getElementById('result-modal'),
        record: document.getElementById('record-modal'),
        hallOfFame: document.getElementById('hall-of-fame-modal'),
        skillSelection: document.getElementById('skill-selection-modal'),
        forgetSkill: document.getElementById('forget-skill-modal'),
        explanation: document.getElementById('explanation-modal'),
        typeChart: document.getElementById('type-chart-modal'),
    };

    const buttons = {
        start: document.getElementById('start-game-button'),
        nextStage: document.getElementById('next-stage-button'),
        playAgain: document.getElementById('play-again-button'),
        submitRecord: document.getElementById('submit-record-button'),
        closeHof: document.getElementById('close-hof-button'),
        hallOfFame: document.getElementById('hall-of-fame-button'),
        typeChart: document.getElementById('type-chart-icon'),
        closeTypeChart: document.getElementById('close-type-chart-button'),
        nextQuestion: document.getElementById('next-question-button'),
        cancelForget: document.getElementById('cancel-forget-button'),
    };

    const audio = {
        bgmBattle: document.getElementById('bgm-battle'),
        bgmQuiz: document.getElementById('bgm-quiz'),
        sfxCorrect: document.getElementById('sfx-correct'),
        sfxIncorrect: document.getElementById('sfx-incorrect'),
        sfxWin: document.getElementById('sfx-win'),
        sfxLose: document.getElementById('sfx-lose'),
        sfxAttack: document.getElementById('sfx-attack'),
    };
    
    const volumeControl = {
        icon: document.getElementById('volume-control'),
        slider: document.getElementById('volume-slider'),
        soundOn: document.getElementById('sound-on-icon'),
        soundOff: document.getElementById('sound-off-icon'),
    };

    // --- Game State ---
    let player, opponent;
    let currentStage = 0;
    let learnedSkills = [];
    let availableQuizzes = [];
    let hallOfFame = [];
    let currentQuiz = null;
    let isSoundMuted = false;
    const MAX_SKILLS = 4;
    const TOTAL_STAGES = 7;

    // --- Utility Functions ---
    const showScreen = (screenName) => {
        Object.values(screens).forEach(s => s.classList.remove('flex'));
        screens[screenName].classList.add('flex');
    };

    const showModal = (modalName, show = true) => {
        if (show) {
            modals[modalName].classList.add('flex');
            modals[modalName].classList.remove('hidden');
        } else {
            modals[modalName].classList.remove('flex');
            modals[modalName].classList.add('hidden');
        }
<<<<<<< HEAD
    };
    
    const playSound = (sound, isBgm = false) => {
        if (isSoundMuted) return;
        if (isBgm) {
            Object.values(audio).forEach(a => a.pause());
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed", e));
        } else {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed", e));
=======
    } else {
        loadQuestion();
    }
}

// --- Skill Learning ---
function showSkillSelection(numberOfCorrectAnswers) {
    const choicesContainer = document.getElementById('skill-choices');
    choicesContainer.innerHTML = '';
    const learnset = POKEMON_LEARNSETS[playerPokemon.id] || [];
    let potentialSkillNames = [...new Set([...learnset, ...SKILLS['노말'].filter(s => s.power && s.power < 40).map(s => s.name)])];
    let availableSkills = potentialSkillNames.map(name => Object.values(SKILLS).flat().find(s => s.name === name)).filter(skill => skill && !learnedSkills.some(ls => ls.name === skill.name));
    if (availableSkills.length === 0) { startBattle(); return; }

    const numberOfChoices = numberOfCorrectAnswers === 2 ? 2 : 1;
    let selectedForChoice = shuffleArray(availableSkills).slice(0, numberOfChoices);

    if (numberOfChoices === 1 && selectedForChoice.length > 0) {
        // Automatically learn the single skill
        const skillToLearn = selectedForChoice[0];
        const feedback = document.getElementById('feedback-message');
        feedback.textContent = `${skillToLearn.name}을(를) 배웠다!`;
        setTimeout(() => { feedback.textContent = ""; learnSkill(skillToLearn); }, 2000);
    } else {
        // Show modal for choice
        document.getElementById('skill-selection-modal').querySelector('p').textContent = `퀴즈 ${numberOfCorrectAnswers}개 정답! 배울 기술을 하나 선택하세요.`;
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
}

function learnSkill(newSkill) {
    hideModals();
    if (learnedSkills.length >= 4) showForgetSkillModal(newSkill);
    else { learnedSkills.push(newSkill); startBattle(); }
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

// --- Battle Logic ---
function startBattle() {
    hideModals();
    isBattling = true;
    bgm.quiz.pause();
    bgm.battle.currentTime = 0;
    bgm.battle.play().catch(e => {});

    // Initialize skills with PP for the current battle
    battleSkills = learnedSkills.map(skill => ({ ...skill, pp: 3 }));

    const stageInfo = gameStages[currentStage];
    opponentPokemon = JSON.parse(JSON.stringify(stageInfo.opponent));
    opponentPokemon.statModifiers = { attack: 0, defense: 0 };
    opponentPokemon.statusEffects = {};
    document.getElementById('stage-title-battle').textContent = stageInfo.name;
    updateBattleUI();
    showScreen('battle');
    battleLogUpdate(`${opponentPokemon.name}이(가) 나타났다!`, 2000);
}

function updateBattleUI() {
    // Player & Opponent HP Bars
    const playerHpBar = document.getElementById('player-hp');
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    playerHpBar.style.width = `${playerHpPercent}%`;
    playerHpBar.textContent = `${Math.ceil(playerPokemon.hp)} / ${playerPokemon.maxHp}`;
    playerHpBar.className = `h-full rounded-full text-xs text-white text-center font-bold transition-all duration-500 ${playerHpPercent > 50 ? 'bg-green-500' : playerHpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`;
    document.getElementById('player-name').textContent = playerPokemon.name;
    document.getElementById('player-img').src = playerPokemon.img;
    
    const opponentHpBar = document.getElementById('opponent-hp');
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;
    opponentHpBar.style.width = `${opponentHpPercent}%`;
    opponentHpBar.textContent = `HP`;
    opponentHpBar.className = `h-full rounded-full text-xs text-white text-center font-bold transition-all duration-500 ${opponentHpPercent > 50 ? 'bg-green-500' : opponentHpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`;
    document.getElementById('opponent-name').textContent = opponentPokemon.name;
    document.getElementById('opponent-img').src = opponentPokemon.img;

    // Skill & Item Buttons
    const skillButtonsContainer = document.getElementById('skill-buttons');
    skillButtonsContainer.innerHTML = '';
    const canUseAnySkill = battleSkills.some(skill => skill.pp > 0);

    if (canUseAnySkill) {
        battleSkills.forEach((skill, index) => {
            const button = document.createElement('button');
            button.className = `bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg shadow-sm transition text-xs sm:text-sm`;
            button.innerHTML = `${skill.name}<br>(위력:${skill.power} / PP:${skill.pp})`;
            button.disabled = skill.pp <= 0;
            if (button.disabled) button.classList.add('opacity-50', 'cursor-not-allowed');
            button.onclick = () => playerAttack(index);
            skillButtonsContainer.appendChild(button);
        });
    } else {
        // Show Struggle button if no PP left
        const struggleButton = document.createElement('button');
        struggleButton.className = `bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded-lg shadow-sm transition text-xs sm:text-sm col-span-2`;
        struggleButton.innerHTML = `${STRUGGLE_SKILL.name}<br>(위력:${STRUGGLE_SKILL.power})`;
        struggleButton.onclick = () => playerAttack(-1); // Use -1 to signify Struggle
        skillButtonsContainer.appendChild(struggleButton);
    }
    
    const itemButtonsContainer = document.getElementById('item-buttons');
    itemButtonsContainer.innerHTML = '';
    const potionButton = document.createElement('button');
    potionButton.className = 'bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-2 rounded-lg shadow-sm transition text-xs sm:text-sm';
    potionButton.textContent = `상처약 (${playerInventory.potion})`;
    potionButton.disabled = playerInventory.potion <= 0 || playerPokemon.hp === playerPokemon.maxHp;
    if(potionButton.disabled) potionButton.classList.add('opacity-50');
    potionButton.onclick = usePotion;
    itemButtonsContainer.appendChild(potionButton);
}

function battleLogUpdate(message, duration = 1500) {
    const log = document.getElementById('battle-log');
    log.textContent = message;
    clearTimeout(battleLogTimeout);
    battleLogTimeout = setTimeout(() => { log.textContent = '무엇을 할까?'; }, duration);
}

function calculateDamage(attacker, defender, skill) {
    if (!skill.power) return { damage: 0, effectivenessMessage: '' };
    let effectiveness = 1;
    defender.types.forEach(defType => { effectiveness *= TYPE_CHART[skill.type]?.[defType] ?? 1; });
    const damage = Math.floor(skill.power * (Math.random() * 0.25 + 0.85) * effectiveness);
    let effectivenessMessage = effectiveness > 1 ? "효과가 굉장했다!" : (effectiveness < 1 && effectiveness > 0 ? "효과가 별로인 듯하다..." : (effectiveness === 0 ? "효과가 없는 것 같다..." : ''));
    return { damage, effectivenessMessage };
}

function performAttack(attacker, defender, skill, onComplete) {
    const attackerImg = attacker === playerPokemon ? document.getElementById('player-img') : document.getElementById('opponent-img');
    const defenderImg = defender === playerPokemon ? document.getElementById('player-img') : document.getElementById('opponent-img');

    if (attacker.statusEffects.paralysis && Math.random() < 0.25) {
        battleLogUpdate(`${attacker.name}은(는) 마비되어 움직일 수 없다!`);
        setTimeout(onComplete, 1500);
        return;
    }

    attackerImg.classList.add('attack-animation');
    setTimeout(() => {
        attackerImg.classList.remove('attack-animation');
        battleLogUpdate(`${attacker.name}의 ${skill.name} 공격!`);
        const { damage, effectivenessMessage } = calculateDamage(attacker, defender, skill);
        defender.hp = Math.max(0, defender.hp - damage);

        if (skill.isStruggle) {
            const recoilDamage = Math.floor(damage / 4);
            attacker.hp = Math.max(0, attacker.hp - recoilDamage);
            battleLogUpdate(`${attacker.name}은(는) 반동 데미지를 입었다!`, 2000);
>>>>>>> parent of 031b21e (이펙트 추가)
        }
    };

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    const updateVolume = () => {
        const volume = isSoundMuted ? 0 : volumeControl.slider.value;
        Object.values(audio).forEach(a => a.volume = volume);
        volumeControl.soundOn.classList.toggle('hidden', isSoundMuted || volume == 0);
        volumeControl.soundOff.classList.toggle('hidden', !isSoundMuted && volume > 0);
    };

    // --- Game Initialization ---
    function init() {
        loadHallOfFame();
        buttons.start.addEventListener('click', startGame);
        buttons.playAgain.addEventListener('click', resetGame);
        buttons.hallOfFame.addEventListener('click', () => showModal('hallOfFame'));
        buttons.closeHof.addEventListener('click', () => showModal('hallOfFame', false));
        buttons.typeChart.addEventListener('click', () => showModal('typeChart'));
        buttons.closeTypeChart.addEventListener('click', () => showModal('typeChart', false));
        buttons.submitRecord.addEventListener('click', saveRecord);
        buttons.nextStage.addEventListener('click', startStage);
        buttons.nextQuestion.addEventListener('click', handlePostQuiz);
        buttons.cancelForget.addEventListener('click', () => {
            showModal('forgetSkill', false);
            handlePostQuiz();
        });
        
        volumeControl.icon.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            updateVolume();
        });
        volumeControl.slider.addEventListener('input', updateVolume);
=======
=======
>>>>>>> parent of 031b21e (이펙트 추가)
=======
>>>>>>> parent of 031b21e (이펙트 추가)
        if (skill.effect) applyEffect(skill.effect, attacker, defender);
        defenderImg.classList.add('shake');
        updateBattleUI();
        setTimeout(() => {
            defenderImg.classList.remove('shake');
            if (effectivenessMessage) battleLogUpdate(effectivenessMessage);
            setTimeout(onComplete, 1000);
        }, 500);
    }, 500);
}
>>>>>>> parent of 031b21e (이펙트 추가)

        showScreen('start');
        updateVolume();
    }

    function startGame() {
        showScreen('selection');
        const pokemonOptions = document.getElementById('pokemon-options');
        pokemonOptions.innerHTML = '';
        Object.keys(POKEMONS).forEach(key => {
            const p = POKEMONS[key];
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.name}" class="w-20 h-20 mx-auto mb-2">
                <h3 class="font-bold">${p.name}</h3>
                <p class="text-sm text-gray-600">${p.types.join(', ')}</p>
            `;
            card.addEventListener('click', () => selectPokemon(key));
            pokemonOptions.appendChild(card);
        });
    }
    
    function resetGame() {
        showModal('result', false);
        startGame();
    }

    function selectPokemon(key) {
        player = JSON.parse(JSON.stringify(POKEMONS[key])); // Deep copy
        player.id = key;
        player.maxHp = player.hp;
        
        // 초기 기술 설정
        learnedSkills = POKEMON_LEARNSETS[key]
            .map(skillName => Object.values(SKILLS).flat().find(s => s.name === skillName))
            .filter(Boolean) // 찾지 못한 스킬은 제외
            .slice(0, MAX_SKILLS);

        currentStage = 0;
        availableQuizzes = [...ALL_QUIZZES]; // 퀴즈 목록 복사
        startStage();
    }

    // --- Stage & Quiz Logic ---
    function startStage() {
        showModal('stageClear', false);
        if (currentStage >= TOTAL_STAGES) {
            gameEnd(true);
            return;
        }
        currentStage++;
        
        // 상대 포켓몬 설정
        opponent = JSON.parse(JSON.stringify(OPPONENT_POOL[currentStage - 1]));

<<<<<<< HEAD
        // 퀴즈 설정
        const quizIndex = Math.floor(Math.random() * availableQuizzes.length);
        currentQuiz = availableQuizzes.splice(quizIndex, 1)[0];
        if (availableQuizzes.length === 0) {
            availableQuizzes = [...ALL_QUIZZES]; // 퀴즈 다 풀면 다시 채우기
=======
    performAttack(playerPokemon, opponentPokemon, skill, () => {
        if (opponentPokemon.hp <= 0) winBattle();
        else if (playerPokemon.hp <= 0) loseBattle();
        else opponentAttack();
    });
}

function opponentAttack() {
    const skill = opponentPokemon.skills[Math.floor(Math.random() * opponentPokemon.skills.length)];
    performAttack(opponentPokemon, playerPokemon, skill, () => {
        if (playerPokemon.hp <= 0) loseBattle();
        else {
            isBattling = true;
            updateBattleUI(); // Update UI to re-enable buttons
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 031b21e (이펙트 추가)
=======
>>>>>>> parent of 031b21e (이펙트 추가)
=======
>>>>>>> parent of 031b21e (이펙트 추가)
        }
        
        setupQuizScreen();
        showScreen('quiz');
        playSound(audio.bgmQuiz, true);
    }

    function setupQuizScreen() {
        document.getElementById('stage-title-quiz').textContent = `스테이지 ${currentStage} - AI 윤리 퀴즈`;
        document.getElementById('quiz-pokemon-img').src = player.img;
        document.getElementById('quiz-pokemon-name').textContent = player.name;
        document.getElementById('question-number').textContent = `퀴즈 ${TOTAL_STAGES - availableQuizzes.length}/${TOTAL_STAGES}`;
        document.getElementById('question-text').textContent = currentQuiz.question;

        const answerOptions = document.getElementById('answer-options');
        answerOptions.innerHTML = '';
        currentQuiz.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.onclick = () => checkAnswer(index, button);
            answerOptions.appendChild(button);
        });
        document.getElementById('feedback-message').textContent = '';
    }

    function checkAnswer(selectedIndex, button) {
        document.querySelectorAll('.quiz-option').forEach(btn => btn.classList.add('disabled'));

        const isCorrect = currentQuiz.options[selectedIndex] === currentQuiz.answer;
        
        if (isCorrect) {
            playSound(audio.sfxCorrect);
            button.classList.add('correct');
            document.getElementById('feedback-message').textContent = '정답입니다!';
            document.getElementById('explanation-title').textContent = '정답! 👍';
            document.getElementById('explanation-title').className = 'text-3xl font-bold mb-4 text-center text-green-500';
        } else {
            playSound(audio.sfxIncorrect);
            button.classList.add('incorrect');
            const correctIndex = currentQuiz.options.findIndex(opt => opt === currentQuiz.answer);
            document.querySelectorAll('.quiz-option')[correctIndex].classList.add('correct');
            document.getElementById('feedback-message').textContent = '오답입니다...';
            document.getElementById('explanation-title').textContent = '오답... 😥';
            document.getElementById('explanation-title').className = 'text-3xl font-bold mb-4 text-center text-red-500';
        }
        
        document.getElementById('explanation-text').textContent = currentQuiz.explanation;

        setTimeout(() => {
            showModal('explanation');
        }, 1500);
    }
    
    function handlePostQuiz() {
        showModal('explanation', false);
        const isCorrect = document.querySelector('.quiz-option.correct.disabled') !== null;

        if (isCorrect) {
            learnNewSkill();
        } else {
            startBattle();
        }
    }

    function learnNewSkill() {
        const potentialSkills = Object.values(SKILLS).flat().filter(skill => 
            player.types.includes(skill.type) && !learnedSkills.some(ls => ls.name === skill.name) && skill.power > 0
        );
        
        if (potentialSkills.length === 0) {
            startBattle(); // 배울 스킬이 없으면 바로 배틀 시작
            return;
        }

        const newSkill = potentialSkills[Math.floor(Math.random() * potentialSkills.length)];

        if (learnedSkills.length < MAX_SKILLS) {
            learnedSkills.push(newSkill);
            startBattle();
        } else {
            // 기술이 꽉 찼을 때 교체 로직
            showModal('forgetSkill');
            document.getElementById('new-skill-info').textContent = `새로운 기술: ${newSkill.name}`;
            const forgetChoices = document.getElementById('forget-skill-choices');
            forgetChoices.innerHTML = '';
            learnedSkills.forEach((skill, index) => {
                const btn = document.createElement('button');
                btn.className = `skill-button text-white font-bold py-2 px-4 rounded-lg w-full type-${getSkillTypeClass(skill.type)}`;
                btn.textContent = `${skill.name} (위력: ${skill.power || '-'})`;
                btn.onclick = () => {
                    learnedSkills[index] = newSkill;
                    showModal('forgetSkill', false);
                    startBattle();
                };
                forgetChoices.appendChild(btn);
            });
        }
    }

    // --- Battle Logic ---
    function startBattle() {
        setupBattleScreen();
        showScreen('battle');
        playSound(audio.bgmBattle, true);
        updateBattleLog(`${opponent.name}(이)가 나타났다!`);
    }

    function setupBattleScreen() {
        document.getElementById('stage-title-battle').textContent = `스테이지 ${currentStage} 배틀`;
        
        // Player
        document.getElementById('player-name').textContent = player.name;
        document.getElementById('player-img').src = player.img;
        
        // Opponent
        document.getElementById('opponent-name').textContent = opponent.name;
        document.getElementById('opponent-img').src = opponent.img;
        
        updateHpBars();
        updateSkillButtons();
    }

    function updateHpBars() {
        const updateBar = (pokemon, elementId) => {
            const hpBar = document.getElementById(elementId);
            const percentage = (pokemon.hp / pokemon.maxHp) * 100;
            hpBar.style.width = `${percentage}%`;
            hpBar.textContent = `${Math.ceil(pokemon.hp)}/${pokemon.maxHp}`;
            
            hpBar.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500');
            if (percentage > 50) {
                hpBar.classList.add('bg-green-500');
            } else if (percentage > 20) {
                hpBar.classList.add('bg-yellow-500');
            } else {
                hpBar.classList.add('bg-red-500');
            }
        };
        updateBar(player, 'player-hp');
        updateBar(opponent, 'opponent-hp');
    }
    
    function getSkillTypeClass(type) {
        const typeMap = { '불': 'fire', '물': 'water', '풀': 'grass', '전기': 'electric', '얼음': 'ice', '격투': 'fighting', '독': 'poison', '땅': 'ground', '비행': 'flying', '에스퍼': 'psychic', '벌레': 'bug', '바위': 'rock', '고스트': 'ghost', '드래곤': 'dragon', '강철': 'steel', '페어리': 'fairy', '노말': 'normal', '악': 'dark' };
        return typeMap[type] || 'normal';
    }

    function updateSkillButtons() {
        const container = document.getElementById('skill-buttons');
        container.innerHTML = '';
        learnedSkills.forEach(skill => {
            const button = document.createElement('button');
            const typeClass = getSkillTypeClass(skill.type);
            button.className = `skill-button text-white font-bold py-3 px-2 rounded-lg text-sm sm:text-base type-${typeClass}`;
            button.textContent = skill.name;
            button.onclick = () => playerTurn(skill);
            container.appendChild(button);
        });
    }

    function updateBattleLog(message) {
        document.getElementById('battle-log').textContent = message;
    }

    function playerTurn(skill) {
        document.getElementById('skill-buttons').classList.add('pointer-events-none', 'opacity-50');
        
        const damage = calculateDamage(skill, player, opponent);
        opponent.hp = Math.max(0, opponent.hp - damage);
        
        animateAttack(true, skill.type);
        updateBattleLog(`${player.name}의 ${skill.name} 공격!`);
        
        setTimeout(() => {
            playSound(audio.sfxAttack);
            document.getElementById('opponent-img').classList.add('pokemon-hit');
            updateHpBars();
            updateBattleLog(`${opponent.name}에게 ${damage}의 데미지!`);
            setTimeout(() => {
                document.getElementById('opponent-img').classList.remove('pokemon-hit');
                if (opponent.hp <= 0) {
                    battleEnd(true);
                } else {
                    opponentTurn();
                }
            }, 1000);
        }, 500);
    }

    function opponentTurn() {
        const skill = opponent.skills[Math.floor(Math.random() * opponent.skills.length)];
        const damage = calculateDamage(skill, opponent, player);
        player.hp = Math.max(0, player.hp - damage);

        updateBattleLog(`${opponent.name}의 ${skill.name} 공격!`);
        animateAttack(false, skill.type);

        setTimeout(() => {
            playSound(audio.sfxAttack);
            document.getElementById('player-img').classList.add('pokemon-hit');
            updateHpBars();
            updateBattleLog(`${player.name}에게 ${damage}의 데미지!`);
            setTimeout(() => {
                document.getElementById('player-img').classList.remove('pokemon-hit');
                if (player.hp <= 0) {
                    battleEnd(false);
                } else {
                    document.getElementById('skill-buttons').classList.remove('pointer-events-none', 'opacity-50');
                    updateBattleLog('어떻게 할까?');
                }
            }, 1000);
        }, 1500);
    }

    function calculateDamage(skill, attacker, defender) {
        if (!skill.power) return 0;
        let effectiveness = 1;
        defender.types.forEach(type => {
            effectiveness *= TYPE_CHART[skill.type]?.[type] ?? 1;
        });
        return Math.floor(skill.power * effectiveness * (0.8 + Math.random() * 0.4));
    }
    
    function animateAttack(isPlayerAttack, type) {
        const overlay = document.getElementById('attack-animation-overlay');
        const effect = document.createElement('div');
        const typeClass = getSkillTypeClass(type);
        effect.className = `attack-effect type-${type}`;
        
        const colorMap = { 'fire': 'rgba(255, 69, 0, 0.7)', 'water': 'rgba(30, 144, 255, 0.7)', 'grass': 'rgba(50, 205, 50, 0.7)', 'electric': 'rgba(255, 215, 0, 0.7)', 'ghost': 'rgba(75, 0, 130, 0.7)', 'psychic': 'rgba(255, 20, 147, 0.7)' };
        effect.style.backgroundColor = colorMap[typeClass] || 'rgba(128, 128, 128, 0.7)';

        if (isPlayerAttack) {
            effect.style.top = '25%';
            effect.style.right = '15%';
        } else {
            effect.style.top = '55%';
            effect.style.left = '15%';
        }
        overlay.appendChild(effect);
        setTimeout(() => effect.remove(), 400);
    }

    function battleEnd(isWin) {
        if (isWin) {
            playSound(audio.sfxWin);
            updateBattleLog(`${opponent.name}를 쓰러뜨렸다!`);
            setTimeout(() => {
                document.getElementById('stage-clear-message').textContent = `스테이지 ${currentStage} 클리어! 다음 스테이지로 이동합니다.`;
                showModal('stageClear');
            }, 1500);
        } else {
            gameEnd(false);
        }
    }
    
    // --- Game End & Hall of Fame ---
    function gameEnd(isWin) {
        showScreen('battle'); // Keep battle screen visible behind modal
        if (isWin) {
            playSound(audio.sfxWin);
            showModal('record');
        } else {
            playSound(audio.sfxLose);
            document.getElementById('result-title').textContent = '패배...';
            document.getElementById('result-message').textContent = 'AI 윤리의 길은 멀고도 험하구나...';
            showModal('result');
        }
    }

    function saveRecord() {
        const nickname = document.getElementById('nickname-input').value.trim();
        if (!nickname) {
            alert('닉네임을 입력해주세요!');
            return;
        }
        const record = {
            date: new Date().toLocaleDateString(),
            nickname: nickname,
            stage: `스테이지 ${currentStage} 클리어`,
        };
        hallOfFame.push(record);
        hallOfFame.sort((a, b) => b.stage.localeCompare(a.stage) || new Date(b.date) - new Date(a.date));
        localStorage.setItem('ai-ethics-pokemon-hof', JSON.stringify(hallOfFame));
        
        updateHallOfFameDisplay();
        showModal('record', false);
        showModal('hallOfFame');
    }

    function loadHallOfFame() {
        hallOfFame = JSON.parse(localStorage.getItem('ai-ethics-pokemon-hof')) || [];
        updateHallOfFameDisplay();
    }

    function updateHallOfFameDisplay() {
        const tbody = document.getElementById('hall-of-fame-body');
        tbody.innerHTML = '';
        if (hallOfFame.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4">아직 명예의 전당에 등록된 기록이 없습니다.</td></tr>';
            return;
        }
        hallOfFame.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="p-2">${r.date}</td><td class="p-2 font-bold">${r.nickname}</td><td class="p-2">${r.stage}</td>`;
            tbody.appendChild(tr);
        });
    }

    // --- Start the game ---
    init();
});
