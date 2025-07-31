document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 가져오기
    const startScreen = document.getElementById('start-screen');
    const selectionScreen = document.getElementById('selection-screen');
    const battleScreen = document.getElementById('battle-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const endScreen = document.getElementById('end-screen');

    const startButton = document.getElementById('start-button');
    const pokemonSelectionContainer = document.getElementById('pokemon-selection');
    const attackButton = document.getElementById('attack-button');
    const restartButton = document.getElementById('restart-button');

    // 오디오 요소
    const bgmBattle = document.getElementById('bgm-battle');
    const bgmQuiz = document.getElementById('bgm-quiz');

    // 게임 상태 변수
    let playerPokemon = null;
    let opponentPokemon = null;
    let currentOpponentIndex = 0;
    let quizAnswered = false;

    // --- 화면 전환 함수 ---
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('flex');
        });
        document.getElementById(screenId).classList.add('flex');
    }
    
    // --- BGM 제어 함수 ---
    function playBgm(type) {
        bgmBattle.pause();
        bgmQuiz.pause();
        bgmBattle.currentTime = 0;
        bgmQuiz.currentTime = 0;

        if (type === 'battle' && bgmBattle) {
            bgmBattle.volume = 0.3;
            bgmBattle.play().catch(e => console.error("전투 BGM 재생 실패:", e));
        } else if (type === 'quiz' && bgmQuiz) {
            bgmQuiz.volume = 0.3;
            bgmQuiz.play().catch(e => console.error("퀴즈 BGM 재생 실패:", e));
        }
    }

    // --- 게임 초기화 및 시작 ---
    function initGame() {
        showScreen('selection-screen');
        pokemonSelectionContainer.innerHTML = '';
        currentOpponentIndex = 0;
        
        POKEMONS.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.dataset.id = pokemon.id;
            card.innerHTML = `
                <img src="${pokemon.img}" alt="${pokemon.name}" class="w-20 h-20 mx-auto mb-2">
                <h3 class="font-bold">${pokemon.name}</h3>
                <p class="text-sm text-gray-600">${pokemon.type}</p>
            `;
            card.addEventListener('click', () => selectPokemon(pokemon.id));
            pokemonSelectionContainer.appendChild(card);
        });
    }

    function selectPokemon(id) {
        playerPokemon = { ...POKEMONS.find(p => p.id === id), hp: 100 };
        document.querySelectorAll('.pokemon-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`.pokemon-card[data-id='${id}']`).classList.add('selected');
        
        setTimeout(() => {
            startBattle();
        }, 500);
    }
    
    // --- 배틀 로직 ---
    function startBattle() {
        if (currentOpponentIndex >= OPPONENTS.length) {
            gameEnd(true); // 모든 상대를 이기면 게임 승리
            return;
        }
        opponentPokemon = { ...OPPONENTS[currentOpponentIndex], hp: 100 };
        quizAnswered = false;

        updateBattleUI();
        showScreen('battle-screen');
        playBgm('battle');
        setMessage(`${opponentPokemon.name}(이)가 나타났다!`);
    }

    function updateBattleUI() {
        // 플레이어 정보 업데이트
        document.getElementById('player-name').textContent = playerPokemon.name;
        document.getElementById('player-img').src = playerPokemon.img;
        const playerHpPercentage = (playerPokemon.hp / 100) * 100;
        document.getElementById('player-hp-bar').style.width = `${playerHpPercentage}%`;

        // 상대 정보 업데이트
        document.getElementById('opponent-name').textContent = opponentPokemon.name;
        document.getElementById('opponent-img').src = opponentPokemon.img;
        const opponentHpPercentage = (opponentPokemon.hp / 100) * 100;
        document.getElementById('opponent-hp-bar').style.width = `${opponentHpPercentage}%`;
    }
    
    function setMessage(msg) {
        const battleMessage = document.getElementById('battle-message');
        battleMessage.textContent = msg;
    }

    attackButton.addEventListener('click', () => {
        if (quizAnswered) {
             setMessage('퀴즈를 이미 풀었습니다. 다음 상대를 기다리세요.');
             return;
        }
        playerAttack();
    });

    function playerAttack() {
        attackButton.disabled = true;
        showAttackEffect(playerPokemon.type, true);

        const damage = 20 + Math.floor(Math.random() * 11); // 20-30
        opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage);
        setMessage(`${playerPokemon.name}의 공격! ${damage}의 데미지를 입혔다!`);
        updateBattleUI();

        setTimeout(() => {
            if (opponentPokemon.hp <= 0) {
                setMessage(`${opponentPokemon.name}를 쓰러뜨렸다!`);
                setTimeout(startQuiz, 1500);
            } else {
                opponentAttack();
            }
        }, 1500);
    }

    function opponentAttack() {
        showAttackEffect(opponentPokemon.type, false);
        const damage = 15 + Math.floor(Math.random() * 11); // 15-25
        playerPokemon.hp = Math.max(0, playerPokemon.hp - damage);
        setMessage(`${opponentPokemon.name}의 공격! ${damage}의 데미지를 입었다!`);
        updateBattleUI();

        setTimeout(() => {
            if (playerPokemon.hp <= 0) {
                gameEnd(false); // 패배
            } else {
                attackButton.disabled = false;
                setMessage('어떻게 할까?');
            }
        }, 1500);
    }
    
    // --- 공격 이펙트 함수 ---
    function showAttackEffect(type, isPlayerAttack) {
        // (수정) 이펙트를 게임 컨테이너 내에 생성
        const gameContainer = document.querySelector('.relative.overflow-hidden');
        if (!gameContainer) return;

        const effect = document.createElement('div');
        effect.className = `attack-effect ${type.toLowerCase()}`;
        
        // 플레이어 공격은 상대 위치, 상대 공격은 플레이어 위치에 이펙트 표시
        if (isPlayerAttack) {
            effect.style.top = '25%';
            effect.style.left = '65%';
        } else {
            effect.style.top = '55%';
            effect.style.left = '25%';
        }
        
        gameContainer.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 500); // 애니메이션 지속 시간과 동일하게
    }

    // --- 퀴즈 로직 ---
    function startQuiz() {
        showScreen('quiz-screen');
        playBgm('quiz');
        
        const quiz = QUIZZES[currentOpponentIndex];
        document.getElementById('quiz-question').textContent = quiz.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        quiz.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(index));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(selectedIndex) {
        if (quizAnswered) return;
        quizAnswered = true;

        const quiz = QUIZZES[currentOpponentIndex];
        const options = document.querySelectorAll('.quiz-option');

        if (selectedIndex === quiz.answer) {
            options[selectedIndex].classList.add('correct');
            playerPokemon.hp = Math.min(100, playerPokemon.hp + 30); // 정답 맞추면 체력 30 회복
             setMessage('정답! 윤리적 통찰력이 상승했다!');
        } else {
            options[selectedIndex].classList.add('incorrect');
            options[quiz.answer].classList.add('correct'); // 정답 표시
            setMessage('오답... 더 깊은 고민이 필요해 보인다.');
        }

        setTimeout(() => {
            currentOpponentIndex++;
            startBattle();
        }, 2500);
    }
    
    // --- 게임 종료/재시작 로직 ---
    function gameEnd(isWin) {
        showScreen('end-screen');
        playBgm('none'); // BGM 정지
        const title = document.getElementById('end-title');
        const message = document.getElementById('end-message');
        
        if (isWin) {
            title.textContent = '🎉 축하합니다! 🎉';
            message.textContent = 'AI 윤리 챔피언이 되셨습니다!';
        } else {
            title.textContent = ' GAME OVER ';
            message.textContent = 'AI 윤리 포켓몬의 길은 멀고도 험하군요...';
        }
    }

    // --- 이벤트 리스너 연결 ---
    startButton.addEventListener('click', initGame);
    restartButton.addEventListener('click', () => {
        // 상태 초기화 후 시작화면으로
        playerPokemon = null;
        opponentPokemon = null;
        currentOpponentIndex = 0;
        showScreen('start-screen');
    });

    // --- 초기 실행 ---
    showScreen('start-screen');
});