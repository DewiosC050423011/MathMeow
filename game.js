let gameState = {
    coins: 0, // Koin awal 0 sesuai request
    hints: 3, // Hint awal 3 gratis
    parentRole: 'Mom', // Mom atau Dad
    currentCat: 'white',
    selectedItemKey: null,
    darkMode: false,
    difficulty: 'medium',
    isPaused: false,
    cats: {
        white: { 
            name: 'Milo (Putih)', class: 'white', 
            story: 'Kisah: Kucing bangsawan cerdas dari menara awan.',
            stage: 1, qIndex: 1, correct: 0, incorrect: 0, achievements: 0,
            level: 1, exp: 0, maxExp: 100,
            equippedAcc: { head: null, eyes: null, body: null, aura: null }, ownedAcc: ['none'] 
        },
        black: { 
            name: 'Shadow (Hitam)', class: 'black', 
            story: 'Kisah: Penjelajah malam misterius penguasa angka.',
            stage: 1, qIndex: 1, correct: 0, incorrect: 0, achievements: 0,
            level: 1, exp: 0, maxExp: 100,
            equippedAcc: { head: null, eyes: null, body: null, aura: null }, ownedAcc: ['none'] 
        },
        calico: { 
            name: 'Moci (Calico)', class: 'calico', 
            story: 'Kisah: Petualang ceria pecinta kebun sakura.',
            stage: 1, qIndex: 1, correct: 0, incorrect: 0, achievements: 0,
            level: 1, exp: 0, maxExp: 100,
            equippedAcc: { head: null, eyes: null, body: null, aura: null }, ownedAcc: ['none'] 
        }
    },
    stageProgress: {},
    accessories: {
        none: { name: 'Polos', icon: '❌', slot: 'none', rarity: 'common', price: 0, desc: 'Tampilan standar.' },
        ribbon: { name: 'Pita', icon: '🎀', slot: 'head', rarity: 'common', price: 20, desc: 'Pita retro imut.' },
        hat: { name: 'Topi', icon: '👒', slot: 'head', rarity: 'common', price: 35, desc: 'Topi jerami santai.' },
        crown: { name: 'Mahkota', icon: '👑', slot: 'head', rarity: 'epic', price: 65, desc: 'Mahkota kerajaan emas.' },
        glasses: { name: 'Kacamata', icon: '🕶️', slot: 'eyes', rarity: 'rare', price: 45, desc: 'Kacamata hitam keren pas di mata.' },
        
        exp_charm: {
            name: 'Jimat EXP', icon: '📜', slot: 'body', rarity: 'rare', price: 50, level: 1, maxLevel: 10,
            desc: '📜 Booster EXP Kucing: Menambah perolehan EXP dasar saat menjawab benar.',
            getBonusExp() { return this.level * 5; }
        },
        exp_potion: {
            name: 'Ramuan Ilmu', icon: '🧪', slot: 'body', rarity: 'epic', price: 80, level: 1, maxLevel: 10,
            desc: '🧪 Ramuan Herbal EXP: Memberikan tambahan bonus EXP tinggi per jawaban.',
            getBonusExp() { return this.level * 10; }
        },

        aura_sakura: { 
            name: 'Aura Sakura', icon: '🌸', slot: 'aura', rarity: 'rare', price: 60, 
            color: 'rgba(255, 118, 117, 0.6)', particle: '🌸',
            desc: '🌸 Buff: +25% Extra Koin per jawaban benar!', effect: 'coins' 
        },
        aura_star: { 
            name: 'Aura Bintang', icon: '✨', slot: 'aura', rarity: 'epic', price: 80, 
            color: 'rgba(253, 203, 110, 0.7)', particle: '⭐',
            desc: '✨ Buff: +5 Detik Waktu Tambahan & +50% Koin!', effect: 'time' 
        },
        bonus_trophy: {
            name: 'Piala Stage', icon: '🏆', slot: 'body', rarity: 'legendary', price: 999,
            desc: '🏆 Trofi Eksklusif Stage Bonus! Bukti penakluk matematika.'
        }
    },
    catPosX: 120,
    catDirection: 1,
    catWalkInterval: null,
    currentQuestion: null,
    timerInterval: null,
    timeLeft: 30,
    landingCatChoice: 'white',
    gameStarted: false,
    stageMistakes: 0,
    streakCount: 0,
    totalStarsEarned: 0
};

// --- REALTIME ENVIRONMENT ---
function initRealtimeEnvironment() {
    let now = new Date();
    let hours = now.getHours();
    let statusText = "";
    let skyGradient = "";
    let sunMoonIcon = "☀️";

    if (hours >= 5 && hours < 11) {
        statusText = `🌅 Pagi Hari (${hours}:00) - Suasana Pegunungan Cerah`;
        skyGradient = "linear-gradient(135deg, #74b9ff 0%, #81ecec 100%)";
        sunMoonIcon = "☀️";
    } else if (hours >= 11 && hours < 15) {
        statusText = `☀️ Siang Hari (${hours}:00) - Matahari Terik & Hutan Hijau`;
        skyGradient = "linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)";
        sunMoonIcon = "🌞";
    } else if (hours >= 15 && hours < 18) {
        statusText = `🌇 Sore Hari (${hours}:00) - Senja & Awan Jingga`;
        skyGradient = "linear-gradient(135deg, #ff7675 0%, #fab1a0 100%)";
        sunMoonIcon = "🌇";
    } else {
        statusText = `🌙 Malam Hari (${hours}:00) - Nuansa Malam Hutan Tenang`;
        skyGradient = "linear-gradient(135deg, #2d3436 0%, #0f2027 100%)";
        sunMoonIcon = "🌙";
    }

    let statusEl = document.getElementById('realtime-status');
    if(statusEl) statusEl.innerText = statusText;

    let skyEl = document.getElementById('nature-sky');
    if(skyEl) skyEl.style.background = skyGradient;

    let landingSky = document.getElementById('landing-sky-bg');
    if(landingSky) landingSky.style.background = skyGradient;

    let smEl = document.getElementById('nature-sun-moon');
    if(smEl) smEl.innerText = sunMoonIcon;

    let landingSm = document.getElementById('landing-sun-moon');
    if(landingSm) landingSm.innerText = sunMoonIcon;
}

// --- KUCING JALAN PATROL ---
function startCatWalking() {
    clearInterval(gameState.catWalkInterval);
    gameState.catWalkInterval = setInterval(() => {
        if (!gameState.gameStarted || gameState.isPaused) return;
        gameState.catPosX += (1.5 * gameState.catDirection);
        if (gameState.catPosX > 260) gameState.catDirection = -1;
        else if (gameState.catPosX < 20) gameState.catDirection = 1;

        let containerEl = document.getElementById('pixel-cat-container');
        if (containerEl) {
            containerEl.style.left = gameState.catPosX + 'px';
            containerEl.style.transform = gameState.catDirection === -1 ? 'scaleX(-1)' : 'scaleX(1)';
        }
    }, 80);
}

// --- EKSPRESI KUCING DI DALAM TV SCREEN ---
function setCatExpression(exp) {
    let faceBox = document.getElementById('cat-face-expression');
    if (!faceBox) return;
    faceBox.className = "cat-face-8bit " + exp;
    
    if (exp === 'sad' || exp === 'angry') {
        setTimeout(() => {
            let fb = document.getElementById('cat-face-expression');
            if(fb) fb.className = "cat-face-8bit normal";
        }, 3000);
    }
}

// --- SETTINGS MODAL & PAUSE ---
function openSettingsModal() {
    playSound('click');
    document.getElementById('settings-modal').classList.add('active');
}
function closeSettingsModal() {
    playSound('click');
    document.getElementById('settings-modal').classList.remove('active');
}

function togglePauseGame() {
    gameState.isPaused = !gameState.isPaused;
    let pauseModal = document.getElementById('pause-modal');
    if (gameState.isPaused) {
        pauseModal.classList.add('active');
        clearInterval(gameState.timerInterval);
    } else {
        pauseModal.classList.remove('active');
        startTimer();
    }
}

function changeDifficultySetting(val) {
    gameState.difficulty = val;
    let sDiff = document.getElementById('settings-difficulty');
    if(sDiff) sDiff.value = val;
}

function toggleThemeMode() {
    playSound('click');
    gameState.darkMode = !gameState.darkMode;
    let body = document.getElementById('app-body');
    let btn = document.getElementById('theme-mode-btn');

    if (gameState.darkMode) {
        body.className = 'dark-mode';
        btn.innerText = '☀️ Light Mode';
        btn.style.background = '#ffa502';
    } else {
        body.className = 'light-mode';
        btn.innerText = '🌙 Dark Mode';
        btn.style.background = '#00b894';
    }
}

function selectLandingCat(catKey, el) {
    gameState.landingCatChoice = catKey;
    document.querySelectorAll('.cat-choice-box').forEach(b => b.classList.remove('active'));
    el.classList.add('active');

    let storyBox = document.getElementById('landing-story-box');
    storyBox.innerText = gameState.cats[catKey].story;

    let landingCatFace = document.getElementById('landing-cat-face');
    if(landingCatFace) landingCatFace.className = "pixel-cat-avatar " + catKey;
}

function startGameFromLanding() {
    let nameInput = document.getElementById('player-cat-name-input').value.trim();
    if (nameInput) {
        gameState.cats[gameState.landingCatChoice].name = nameInput;
    }
    gameState.currentCat = gameState.landingCatChoice;
    gameState.parentRole = document.getElementById('landing-parent-role').value;
    gameState.difficulty = document.getElementById('landing-difficulty').value;
    gameState.gameStarted = true;
    gameState.isPaused = false;
    
    let landing = document.getElementById('landing-page');
    if(landing) landing.style.display = 'none';

    updateUI();
    startCatWalking();
    generateQuestion();
}

// --- MUSIC PLAYER ---
function toggleMusicPlayer() {
    let dd = document.getElementById('music-dropdown');
    dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

function togglePlayMusic() {
    let audio = document.getElementById('bgm-audio');
    let btn = document.getElementById('music-play-btn');
    if (audio.paused) {
        audio.play().catch(e => console.log(e));
        btn.innerText = '❚❚ Pause';
        btn.style.background = '#d63031';
    } else {
        audio.pause();
        btn.innerText = '▶ Play';
        btn.style.background = '#00b894';
    }
}

function changeMusicCategory() {
    let cat = document.getElementById('music-category-select').value;
    let audio = document.getElementById('bgm-audio');
    let links = {
        cozy: 'https://www.bensound.com/bensound-music/bensound-cute.mp3',
        adventure: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
        chill: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
        arcade: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3',
        piano: 'https://www.bensound.com/bensound-music/bensound-tenderness.mp3'
    };
    audio.src = links[cat] || links.cozy;
    audio.play().catch(e => console.log(e));
    document.getElementById('music-play-btn').innerText = '❚❚ Pause';
    document.getElementById('music-play-btn').style.background = '#d63031';
}

// --- AUDIO & VIBRATION ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    let now = audioCtx.currentTime;

    if (type === 'correct') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.15);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    }
}

function triggerVibration(pattern) {
    let toggle = document.getElementById('vibrate-toggle');
    if (toggle && toggle.checked && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

function showFloatingText(text, x, y, color = '#ffeaa7') {
    let el = document.createElement('div');
    el.className = 'floating-text';
    el.innerText = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
}

// --- SWITCH TAB DENGAN AUTO-PAUSE ---
function switchTab(tabName) {
    playSound('click');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('screen-' + tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    if (tabName === 'quiz') {
        gameState.isPaused = false;
        startTimer();
    } else {
        gameState.isPaused = true;
        clearInterval(gameState.timerInterval);
    }

    if(tabName === 'stages') renderStageMap();
    if(tabName === 'wardrobe') renderWardrobe();
    if(tabName === 'shop') renderShop();
    if(tabName === 'stats') renderStats();
}

// --- GENERATOR SOAL ---
function generateQuestion() {
    if (!gameState.gameStarted || gameState.isPaused) return;
    let cat = gameState.cats[gameState.currentCat];
    let st = cat.stage;
    let diff = gameState.difficulty;

    let num1, num2, op, qText, ans;

    if (diff === 'easy') {
        num1 = Math.floor(Math.random() * (st * 5)) + 1;
        num2 = Math.floor(Math.random() * (st * 5)) + 1;
        op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && num1 < num2) [num1, num2] = [num2, num1];
        qText = `${num1} ${op} ${num2} = ?`;
        ans = op === '+' ? num1 + num2 : num1 - num2;
    } else if (diff === 'medium') {
        let opsPool = ['+', '-', '×', '÷'];
        op = opsPool[Math.floor(Math.random() * opsPool.length)];
        if (op === '×') {
            num1 = Math.floor(Math.random() * 10) + 2;
            num2 = Math.floor(Math.random() * 10) + 2;
            ans = num1 * num2;
        } else if (op === '÷') {
            num2 = Math.floor(Math.random() * 8) + 2;
            ans = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * ans;
        } else {
            num1 = Math.floor(Math.random() * (st * 10)) + 5;
            num2 = Math.floor(Math.random() * (st * 10)) + 5;
            if (op === '-' && num1 < num2) [num1, num2] = [num2, num1];
            ans = op === '+' ? num1 + num2 : num1 - num2;
        }
        qText = `${num1} ${op} ${num2} = ?`;
    } else {
        let mode = Math.floor(Math.random() * 3);
        if (mode === 0) {
            num1 = Math.floor(Math.random() * 12) + 3;
            qText = `${num1}² = ?`;
            ans = num1 * num1;
        } else if (mode === 1) {
            let base = Math.floor(Math.random() * 10) + 2;
            let square = base * base;
            qText = `√(${square}) = ?`;
            ans = base;
        } else {
            let x = Math.floor(Math.random() * 10) + 1;
            let a = Math.floor(Math.random() * 5) + 2;
            let b = Math.floor(Math.random() * 15) + 1;
            let c = (a * x) + b;
            qText = `${a}x + ${b} = ${c}, x = ?`;
            ans = x;
        }
    }

    let options = [ans];
    while(options.length < 4) {
        let fake = ans + Math.floor(Math.random() * 10) - 5;
        if (fake !== ans && !options.includes(fake) && fake >= 0) options.push(fake);
    }
    options.sort(() => Math.random() - 0.5);

    gameState.currentQuestion = { q: qText, ans: ans, options: options };
    
    let baseTime = (diff === 'hard') ? 20 : 30;
    let auraKey = cat.equippedAcc.aura;
    if (auraKey === 'aura_star') baseTime += 5;

    gameState.timeLeft = baseTime;
    startTimer();
    renderQuizUI();
}

function renderQuizUI() {
    let cat = gameState.cats[gameState.currentCat];
    let isBonus = (cat.stage % 5 === 0);
    
    let stageTitle = isBonus ? `⭐ BONUS STAGE ${cat.stage}` : `Stage ${cat.stage}`;
    document.getElementById('stage-info').innerText = `${stageTitle} (Soal ${cat.qIndex}/3)`;
    document.getElementById('math-question').innerText = gameState.currentQuestion.q;

    let optHTML = '';
    gameState.currentQuestion.options.forEach(opt => {
        optHTML += `<button class="math-opt-btn" onclick="checkAnswer(${opt})">${opt}</button>`;
    });
    document.getElementById('math-options').innerHTML = optHTML;
    document.getElementById('hint-count').innerText = gameState.hints;
}

function startTimer() {
    clearInterval(gameState.timerInterval);
    let timerEl = document.getElementById('timer-display');
    timerEl.className = "timer-box";
    
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameStarted || gameState.isPaused) return;
        gameState.timeLeft--;
        timerEl.innerText = `⏱️ ${gameState.timeLeft}s`;

        if (gameState.timeLeft <= 5 && gameState.timeLeft > 0) {
            timerEl.classList.add('warning');
            playSound('tick');
            triggerVibration(80);
        }

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            timerEl.classList.remove('warning');
            let cat = gameState.cats[gameState.currentCat];
            cat.incorrect++;
            gameState.stageMistakes++;
            gameState.streakCount = 0;
            setCatExpression('sad');
            playSound('wrong');
            triggerVibration(250);
            
            // Waktu habis = langsung lanjut ke soal berikutnya (tidak ulang soal)
            advanceQuizProgression();
        }
    }, 1000);
}

// --- FITUR HINT ---
function useHint() {
    if (gameState.hints > 0) {
        gameState.hints--;
        playSound('click');
        let correctAns = gameState.currentQuestion.ans;
        alert(`💡 Petunjuk: Salah satu pilihan yang SALAH telah disembunyikan atau ingat bahwa jawabannya berkisar di sekitar angka ${correctAns + (Math.random() > 0.5 ? 1 : -1)} / ${correctAns}!`);
        updateUI();
    } else {
        if (gameState.coins >= 10) {
            gameState.coins -= 10;
            gameState.hints++;
            playSound('coin');
            alert('Berhasil membeli 1 Hint seharga 10 Koin!');
            useHint();
        } else {
            alert('Hint habis dan koin kurang (Butuh 10 koin untuk beli hint)!');
        }
    }
}

function checkAnswer(selected) {
    if (gameState.isPaused) return;
    clearInterval(gameState.timerInterval);
    document.getElementById('timer-display').classList.remove('warning');
    let cat = gameState.cats[gameState.currentCat];
    let isBonus = (cat.stage % 5 === 0);

    if (selected === gameState.currentQuestion.ans) {
        playSound('correct');
        triggerVibration([50, 50, 50]);
        cat.correct++;
        gameState.streakCount++;
        setCatExpression('normal');

        if (cat.level < 30) {
            let baseExpGain = 25;
            ['exp_charm', 'exp_potion'].forEach(accKey => {
                if (cat.ownedAcc.includes(accKey)) {
                    baseExpGain += gameState.accessories[accKey].getBonusExp();
                }
            });

            cat.exp += baseExpGain;
            if (cat.exp >= cat.maxExp) {
                cat.level++;
                cat.exp = 0;
                cat.maxExp = Math.floor(cat.maxExp * 1.25);
                triggerAchievement(`HORE! ${cat.name.split(' ')[0]} Naik ke Level ${cat.level}! 🎉`);
            }
        }
        
        let coinReward = isBonus ? 20 : 10;
        let auraKey = cat.equippedAcc.aura;
        if (auraKey === 'aura_sakura') coinReward = Math.floor(coinReward * 1.25);
        if (auraKey === 'aura_star') coinReward = Math.floor(coinReward * 1.5);

        gameState.coins += coinReward;
        showFloatingText(`+${coinReward}🪙`, 200, 250, '#55efc4');
    } else {
        playSound('wrong');
        triggerVibration(300);
        cat.incorrect++;
        gameState.stageMistakes++;
        gameState.streakCount = 0;

        if (gameState.stageMistakes >= 3) {
            setCatExpression('sad');
        } else {
            setCatExpression('angry');
        }
    }

    advanceQuizProgression();
}

// --- GAMEPLAY LANJUT KE SOAL/LEVEL BERIKUTNYA MESKI SALAH ---
function advanceQuizProgression() {
    let cat = gameState.cats[gameState.currentCat];
    let isBonus = (cat.stage % 5 === 0);

    cat.qIndex++;
    if (cat.qIndex > 3) {
        let starsEarned = 3;
        if (gameState.stageMistakes === 1) starsEarned = 2;
        else if (gameState.stageMistakes >= 2) starsEarned = 1;

        gameState.stageProgress[cat.stage] = {
            score: 100 - (gameState.stageMistakes * 15),
            stars: starsEarned,
            completed: true
        };
        gameState.totalStarsEarned += starsEarned;

        cat.stage++;
        cat.qIndex = 1;
        gameState.stageMistakes = 0;
    }

    updateUI();
    generateQuestion();
}

// --- RENDER STAGE MAP ---
function renderStageMap() {
    let cat = gameState.cats[gameState.currentCat];
    let maxUnlocked = cat.stage;
    let gridHTML = '';

    for (let i = 1; i <= 15; i++) {
        let isUnlocked = i <= maxUnlocked;
        let prog = gameState.stageProgress[i];
        let starsStr = '';
        let scoreStr = 'Belum dikerjakan';

        if (prog && prog.completed) {
            starsStr = '⭐'.repeat(prog.stars) + '☆'.repeat(3 - prog.stars);
            scoreStr = `Nilai: ${prog.score}`;
        } else if (isUnlocked) {
            starsStr = '☆☆☆';
            scoreStr = 'Mulai Stage';
        } else {
            starsStr = '🔒';
            scoreStr = 'Terkunci';
        }

        let lockedClass = isUnlocked ? '' : 'locked';
        gridHTML += `<div class="level-card ${lockedClass}" onclick="selectStage(${i}, ${isUnlocked})">
            <div class="level-stars">${starsStr}</div>
            <h4>Stage ${i}</h4>
            <div class="level-score">${scoreStr}</div>
        </div>`;
    }
    let mapGrid = document.getElementById('level-map-grid');
    if(mapGrid) mapGrid.innerHTML = gridHTML;
}

function selectStage(stageNum, isUnlocked) {
    if (!isUnlocked) {
        alert('Stage ini masih terkunci! Selesaikan stage sebelumnya terlebih dahulu.');
        return;
    }
    playSound('click');
    let cat = gameState.cats[gameState.currentCat];
    cat.stage = stageNum;
    cat.qIndex = 1;
    gameState.stageMistakes = 0;
    switchTab('quiz');
    generateQuestion();
}

function skipQuestion() {
    if (gameState.coins >= 15) {
        gameState.coins -= 15;
        playSound('click');
        updateUI();
        advanceQuizProgression();
    } else {
        alert('Koin tidak cukup untuk skip soal (Butuh 15 koin).');
    }
}

function skipStage() {
    if (gameState.coins >= 30) {
        gameState.coins -= 30;
        let cat = gameState.cats[gameState.currentCat];
        gameState.stageProgress[cat.stage] = { score: 80, stars: 2, completed: true };
        cat.stage++;
        cat.qIndex = 1;
        gameState.stageMistakes = 0;
        playSound('click');
        updateUI();
        generateQuestion();
    } else {
        alert('Koin tidak cukup untuk skip stage (Butuh 30 koin).');
    }
}

function triggerAchievement(text) {
    let popup = document.getElementById('achievement-popup');
    document.getElementById('ach-text').innerText = text;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3500);
}

// --- UPDATE UI ---
function updateUI() {
    document.getElementById('coin-count').innerText = gameState.coins;
    let cat = gameState.cats[gameState.currentCat];
    
    let bodyEl = document.getElementById('pixel-cat');
    if(bodyEl) bodyEl.className = 'pixel-cat-avatar ' + cat.class;

    let nameBanner = document.getElementById('main-cat-name');
    if(nameBanner) nameBanner.innerText = `${cat.name.split(' ')[0]} (Lv.${cat.level}) • ${gameState.parentRole}`;

    let tvLv = document.getElementById('tv-cat-lv');
    let tvExpText = document.getElementById('tv-exp-text');
    let tvExpBar = document.getElementById('tv-exp-bar');
    if(tvLv) tvLv.innerText = `Lv. ${cat.level} (Max 30)`;
    if(tvExpText) tvExpText.innerText = `EXP: ${cat.exp}/${cat.maxExp}`;
    if(tvExpBar) tvExpBar.style.width = `${Math.min(100, (cat.exp / cat.maxExp) * 100)}%`;

    let dashStreak = document.getElementById('dash-streak');
    let dashStars = document.getElementById('dash-stars');
    if(dashStreak) dashStreak.innerText = gameState.streakCount;
    if(dashStars) dashStars.innerText = gameState.totalStarsEarned;
    
    ['head', 'eyes', 'body'].forEach(slot => {
        let slotEl = document.getElementById('acc-' + slot);
        if(slotEl) {
            let accKey = cat.equippedAcc[slot];
            let acc = gameState.accessories[accKey];
            slotEl.innerText = (acc && acc.icon !== '❌') ? acc.icon : '';
        }
    });

    let auraEffect = document.getElementById('cat-aura-effect');
    let buffBadge = document.getElementById('active-buff-badge');
    let p1 = document.getElementById('ap-1'), p2 = document.getElementById('ap-2'), p3 = document.getElementById('ap-3');

    let auraKey = cat.equippedAcc.aura;
    let auraAcc = gameState.accessories[auraKey];

    if (auraEffect && buffBadge && auraAcc && auraKey !== 'none') {
        auraEffect.style.setProperty('--aura-color', auraAcc.color);
        auraEffect.className = 'cat-aura-effect active';
        buffBadge.innerText = auraAcc.desc;
        buffBadge.style.display = 'block';
        if (p1 && p2 && p3) { p1.innerText = auraAcc.particle; p2.innerText = auraAcc.particle; p3.innerText = auraAcc.particle; }
    } else {
        if (auraEffect) auraEffect.className = 'cat-aura-effect';
        if (buffBadge) buffBadge.style.display = 'none';
    }
}

function renderStats() {
    let cat = gameState.cats[gameState.currentCat];
    document.getElementById('stats-cat-name').innerText = cat.name;
    document.getElementById('stat-level').innerText = `${cat.level} (Max 30)`;
    document.getElementById('stat-stage').innerText = cat.stage;
    document.getElementById('stat-correct').innerText = cat.correct;
    document.getElementById('stat-incorrect').innerText = cat.incorrect;
    document.getElementById('stat-coins').innerText = gameState.coins;
}

function renderWardrobe() {
    let cat = gameState.cats[gameState.currentCat];
    let catHTML = '';
    for(let key in gameState.cats) {
        let c = gameState.cats[key];
        let active = gameState.currentCat === key ? 'active' : '';
        catHTML += `<div class="card-choice ${active}" onclick="setCat('${key}')">
            <div style="font-size:20px;">🐱</div>
            <h4>${c.name.split(' ')[0]}</h4>
        </div>`;
    }
    document.getElementById('cat-selector').innerHTML = catHTML;

    let accHTML = '';
    cat.ownedAcc.forEach(accKey => {
        let acc = gameState.accessories[accKey];
        let isEquipped = Object.values(cat.equippedAcc).includes(accKey);
        let active = isEquipped ? 'active' : '';
        accHTML += `<div class="card-choice ${active}" onclick="toggleAcc('${accKey}')">
            <div style="font-size:22px;">${acc.icon}</div>
            <h4>${acc.name}</h4>
        </div>`;
    });
    document.getElementById('accessory-grid').innerHTML = accHTML;
}

function setCat(catKey) {
    playSound('click');
    gameState.currentCat = catKey;
    updateUI();
    renderWardrobe();
}

function toggleAcc(accKey) {
    playSound('click');
    let cat = gameState.cats[gameState.currentCat];
    let acc = gameState.accessories[accKey];
    if (acc.slot === 'none') {
        cat.equippedAcc = { head: null, eyes: null, body: null, aura: null };
    } else {
        if (cat.equippedAcc[acc.slot] === accKey) cat.equippedAcc[acc.slot] = null;
        else cat.equippedAcc[acc.slot] = accKey;
    }
    updateUI();
    renderWardrobe();
}

function renderShop() {
    let shopHTML = '';
    for(let key in gameState.accessories) {
        if(key === 'none' || key === 'bonus_trophy') continue;
        let acc = gameState.accessories[key];
        let cat = gameState.cats[gameState.currentCat];
        let isOwned = cat.ownedAcc.includes(key);
        let isBooster = (key === 'exp_charm' || key === 'exp_potion');
        
        let currentCost = isOwned && isBooster ? acc.price * acc.level : acc.price;
        let actionText = isOwned ? (isBooster ? 'Upgrade ⬆️' : 'Dimiliki') : 'Beli';

        shopHTML += `<div class="shop-item" onclick="openItemModal('${key}')">
            <div class="shop-info">
                <span style="font-size:24px;">${acc.icon}</span>
                <div>
                    <div style="font-weight:900; font-size:11px;">${acc.name} ${isBooster ? '(Lv.'+acc.level+')' : ''}</div>
                    <span class="rarity-tag rarity-${acc.rarity}">${acc.rarity.toUpperCase()}</span>
                </div>
            </div>
            <button class="buy-btn" style="pointer-events: none; font-size:9px; padding:4px 8px;">${actionText}</button>
        </div>`;
    }
    document.getElementById('shop-list').innerHTML = shopHTML;
}

function openItemModal(accKey) {
    playSound('click');
    gameState.selectedItemKey = accKey;
    let acc = gameState.accessories[accKey];
    let cat = gameState.cats[gameState.currentCat];
    let isOwned = cat.ownedAcc.includes(accKey);
    let isBooster = (accKey === 'exp_charm' || accKey === 'exp_potion');

    document.getElementById('modal-icon').innerText = acc.icon;
    document.getElementById('modal-title').innerText = acc.name + (isBooster ? ` (Level ${acc.level}/${acc.maxLevel})` : '');
    
    let rarityEl = document.getElementById('modal-rarity');
    rarityEl.innerText = acc.rarity.toUpperCase();
    rarityEl.className = `modal-rarity rarity-${acc.rarity}`;

    let currentCost = isOwned && isBooster ? acc.price * acc.level : acc.price;
    document.getElementById('modal-desc').innerText = acc.desc;
    document.getElementById('modal-price').innerText = `🪙 ${currentCost} Koin`;

    let buyBtn = document.getElementById('modal-buy-btn');
    if (isOwned && !isBooster) {
        buyBtn.innerText = 'Sudah Dimiliki'; buyBtn.style.background = '#b2bec3'; buyBtn.disabled = true;
    } else if (isOwned && isBooster && acc.level >= acc.maxLevel) {
        buyBtn.innerText = 'Level Maksimal'; buyBtn.style.background = '#636e72'; buyBtn.disabled = true;
    } else {
        buyBtn.innerText = isOwned ? 'Upgrade Item ⬆️' : 'Beli Item';
        buyBtn.style.background = '#00b894'; buyBtn.disabled = false;
    }
    document.getElementById('item-modal').classList.add('active');
}

function closeModal() {
    playSound('click');
    document.getElementById('item-modal').classList.remove('active');
}

function confirmPurchase() {
    let accKey = gameState.selectedItemKey;
    let acc = gameState.accessories[accKey];
    let cat = gameState.cats[gameState.currentCat];
    let isOwned = cat.ownedAcc.includes(accKey);
    let isBooster = (accKey === 'exp_charm' || accKey === 'exp_potion');

    let cost = isOwned && isBooster ? acc.price * acc.level : acc.price;

    if (gameState.coins >= cost) {
        playSound('coin');
        gameState.coins -= cost;

        if (!isOwned) {
            cat.ownedAcc.push(accKey);
            cat.equippedAcc[acc.slot] = accKey;
        } else if (isBooster) {
            acc.level++;
        }

        updateUI();
        closeModal();
        renderShop();
    } else {
        alert('Koinmu belum cukup, Dew!');
    }
}

initRealtimeEnvironment();