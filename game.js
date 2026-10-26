let gameState = {
    coins: 50,
    hints: 3,
    parentRole: 'Perempuan',
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
    catPosX: 140,
    catDirection: 1,
    catWalkInterval: null,
    currentQuestion: null,
    timerInterval: null,
    timeLeft: 30,
    landingCatChoice: 'white',
    gameStarted: false,
    stageMistakes: 0,
    streakCount: 0,
    totalStarsEarned: 0,
    randomChatInterval: null,
    catPokeCount: 0,
    feedCount: 0,
    isEating: false,
    
    achievementsMaster: [
        { id: 'ach_10_correct', title: '🎯 Ahli Angka', desc: 'Capai 10 jawaban benar.', unlocked: false },
        { id: 'ach_streak_5', title: '🔥 Streak Master', desc: 'Raih 5 jawaban beruntun tanpa salah.', unlocked: false },
        { id: 'ach_stage_5', title: '🌟 Penakluk Bonus Stage', desc: 'Selesaikan Stage 5 dengan mulus.', unlocked: false },
        { id: 'ach_poke_5', title: '😸 Sahabat Kucing', desc: 'Colok/interaksi kucing 5 kali di layar TV.', unlocked: false, secret: true },
        { id: 'ach_feed_3', title: '🐟 Koki Ikan', desc: 'Beri makan kucing sebanyak 3 kali.', unlocked: false, secret: true }
    ]
};

// --- REALTIME ENVIRONMENT (TANPA MATAHARI ANEH) ---
function initRealtimeEnvironment() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // Set Jam iPhone di Landing Page
    let lockClock = document.getElementById('iphone-lock-clock');
    if(lockClock) lockClock.innerText = timeFormatted;

    let statusText = "";
    let skyGradient = "";

    if (hours >= 5 && hours < 11) {
        statusText = `🌅 Pagi Hari (${timeFormatted}) - Suasana Pegunungan Cerah`;
        skyGradient = "linear-gradient(135deg, #74b9ff 0%, #81ecec 100%)";
    } else if (hours >= 11 && hours < 15) {
        statusText = `☀️ Siang Hari (${timeFormatted}) - Matahari Terik & Hutan Hijau`;
        skyGradient = "linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)";
    } else if (hours >= 15 && hours < 18) {
        statusText = `🌇 Sore Hari (${timeFormatted}) - Senja & Awan Jingga`;
        skyGradient = "linear-gradient(135deg, #ff7675 0%, #fab1a0 100%)";
    } else {
        statusText = `🌙 Malam Hari (${timeFormatted}) - Nuansa Malam Hutan Tenang`;
        skyGradient = "linear-gradient(135deg, #2d3436 0%, #0f2027 100%)";
    }

    let statusEl = document.getElementById('realtime-status');
    if(statusEl) statusEl.innerText = statusText;

    let skyEl = document.getElementById('nature-sky');
    if(skyEl) skyEl.style.background = skyGradient;

    let landingSky = document.getElementById('landing-sky-bg');
    if(landingSky) landingSky.style.background = skyGradient;
    
    updateLandingBubblePreview();
}

function updateLandingBubblePreview() {
    let name = document.getElementById('player-cat-name-input').value.trim() || 'Mochi';
    let bubble = document.getElementById('landing-bubble-chat');
    if(bubble) bubble.innerText = `Hai babu, aku ${name}! Siap nemenin kamu? 🐾`;
}

function startCatWalking() {
    clearInterval(gameState.catWalkInterval);
    gameState.catWalkInterval = setInterval(() => {
        if (!gameState.gameStarted || gameState.isPaused || gameState.isEating) return;
        
        gameState.catPosX += (1.2 * gameState.catDirection);
        if (gameState.catPosX > 240) gameState.catDirection = -1;
        else if (gameState.catPosX < 40) gameState.catDirection = 1;

        let containerEl = document.getElementById('pixel-cat-container');
        let bubbleEl = document.getElementById('in-game-bubble');
        
        if (containerEl) {
            containerEl.style.left = gameState.catPosX + 'px';
            if (gameState.catDirection === -1) {
                containerEl.style.transform = 'scaleX(-1)';
                if(bubbleEl) bubbleEl.style.transform = 'scaleX(-1)';
            } else {
                containerEl.style.transform = 'scaleX(1)';
                if(bubbleEl) bubbleEl.style.transform = 'scaleX(1)';
            }
        }
    }, 80);

    clearInterval(gameState.randomChatInterval);
    gameState.randomChatInterval = setInterval(() => {
        if (!gameState.gameStarted || gameState.isPaused || gameState.isEating) return;
        triggerRandomCatChat();
    }, 12000);
}

function triggerRandomCatChat() {
    let catName = gameState.cats[gameState.currentCat].name.split(' ')[0];
    let genzChats = [
        `Anjay mabar, ${catName} & babu emang paling gaskeun! No cap 🧢`,
        `Sumpah ya babu, soalnya agak skibidi rizz gini tapi kita santuy aja 💀`,
        `Gile lu ndro, hoki banget ketemu babu sekeren lo. Real talk! ✨`,
        `Spill dong tips jago matematika, biar gak malu-maluin wkwk 😭`,
        `Aura magelang banget nih hoki lu babu, yapping mulu dari tadi 😂`,
        `Anjay wangi bener ni game, vibes-nya aesthetic abis brotha! 💅`
    ];
    let randomMsg = genzChats[Math.floor(Math.random() * genzChats.length)];
    showInGameBubble(randomMsg, 4000);
}

function showInGameBubble(text, duration = 3000) {
    let bubble = document.getElementById('in-game-bubble');
    if (!bubble) return;
    bubble.innerText = text;
    bubble.style.opacity = '1';

    setTimeout(() => {
        if(bubble) {
            bubble.style.opacity = '0';
        }
    }, duration);
}

function feedCat() {
    if (!gameState.gameStarted || gameState.isPaused || gameState.isEating) return;
    playSound('click');
    gameState.isEating = true;

    let fishTargetX = Math.floor(Math.random() * 200) + 50;

    let fishEl = document.getElementById('falling-fish');
    if (fishEl) {
        fishEl.style.left = fishTargetX + 'px';
        fishEl.style.display = 'block';
        fishEl.style.animation = 'none';
        fishEl.offsetHeight;
        fishEl.style.animation = 'fallFishAni 0.8s ease-in forwards';
    }

    if (fishTargetX < gameState.catPosX) {
        gameState.catDirection = -1;
    } else {
        gameState.catDirection = 1;
    }

    let containerEl = document.getElementById('pixel-cat-container');
    let bubbleEl = document.getElementById('in-game-bubble');
    if (containerEl) {
        containerEl.style.transform = gameState.catDirection === -1 ? 'scaleX(-1)' : 'scaleX(1)';
        if(bubbleEl) bubbleEl.style.transform = gameState.catDirection === -1 ? 'scaleX(-1)' : 'scaleX(1)';
    }

    let walkStep = setInterval(() => {
        if (Math.abs(gameState.catPosX - (fishTargetX - 10)) > 3) {
            gameState.catPosX += (gameState.catDirection * 2);
            if(containerEl) containerEl.style.left = gameState.catPosX + 'px';
        } else {
            clearInterval(walkStep);
        }
    }, 50);

    setTimeout(() => {
        clearInterval(walkStep);
        if(fishEl) fishEl.style.display = 'none';
        playSound('correct');
        showInGameBubble("Makasih yah babu! Nyam nyam enak bgt 🐟✨", 3000);
        showFloatingText("+15 EXP", 200, 250, '#00b894');
        
        let cat = gameState.cats[gameState.currentCat];
        cat.exp += 15;
        gameState.coins += 5;
        gameState.feedCount++;

        if (cat.exp >= cat.maxExp) {
            cat.level++;
            cat.exp = 0;
            cat.maxExp = Math.floor(cat.maxExp * 1.25);
            triggerPopup("🎉 LEVEL UP!", `${cat.name.split(' ')[0]} Naik ke Level ${cat.level}!`, "🐱");
        }

        if (gameState.feedCount === 3) {
            unlockAchievement('ach_feed_3');
        }
        updateUI();
        
        setTimeout(() => {
            gameState.isEating = false;
        }, 1500);
    }, 850);
}

function handleCatInteraction() {
    if(!gameState.gameStarted || gameState.isPaused) return;
    gameState.catPokeCount++;
    playSound('click');

    let pokes = [
        `Dih, babu suka banget nyolek-nyolek! Skibidi lo! 😾`,
        `Gubrak! Jangan dikelitikin, lagi fokus ngitung nih brotha! 🐾`,
        `Meow! Nyolek mulu, mana ikan gua?! 🐟`,
        `Dih, lu bener-bener rizzeless ya suka colok mulu wkwk ~`
    ];
    let msg = pokes[Math.floor(Math.random() * pokes.length)];
    showInGameBubble(msg, 3000);

    if(gameState.catPokeCount === 5) {
        unlockAchievement('ach_poke_5');
    }
}

function unlockAchievement(achId) {
    let ach = gameState.achievementsMaster.find(a => a.id === achId);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        let icon = ach.secret ? "🔮" : "🏆";
        let titlePrefix = ach.secret ? "SECRET ACHIEVEMENT!" : "ACHIEVEMENT UNLOCKED!";
        triggerPopup(titlePrefix, `${ach.title}: ${ach.desc}`, icon);
        renderAchievementList();
    }
}

function triggerPopup(title, text, icon = "🏆") {
    let popup = document.getElementById('achievement-popup');
    document.getElementById('ach-title-popup').innerText = title;
    document.getElementById('ach-icon-popup').innerText = icon;
    document.getElementById('ach-text').innerText = text;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3800);
}

function renderAchievementList() {
    let container = document.getElementById('achievement-list-container');
    if (!container) return;
    let html = '';
    gameState.achievementsMaster.forEach(ach => {
        let statusClass = ach.unlocked ? 'unlocked' : '';
        let statusIcon = ach.unlocked ? '✅' : '🔒';
        let secretTag = ach.secret ? ' <span style="color:#d63031; font-size:7px;">[SECRET]</span>' : '';
        html += `<div class="achievement-row ${statusClass}">
            <div class="ach-icon-box">${ach.unlocked ? '🏆' : '🔒'}</div>
            <div style="flex:1;">
                <div style="font-weight:900;">${ach.title} ${secretTag}</div>
                <div style="font-size:8px; opacity:0.8;">${ach.desc}</div>
            </div>
            <div>${statusIcon}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function returnToLandingPage() {
    playSound('click');
    closeSettingsModal();
    gameState.gameStarted = false;
    clearInterval(gameState.timerInterval);
    clearInterval(gameState.catWalkInterval);
    clearInterval(gameState.randomChatInterval);
    
    let landing = document.getElementById('landing-page');
    if(landing) landing.style.display = 'flex';
}

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
    if(landingCatFace) landingCatFace.className = "pixel-cat-avatar waving " + catKey;
    updateLandingBubblePreview();
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
    gameState.catPokeCount = 0;
    gameState.feedCount = 0;
    
    let landing = document.getElementById('landing-page');
    if(landing) landing.style.display = 'none';

    updateUI();
    renderAchievementList();
    startCatWalking();
    generateQuestion();
    
    setTimeout(() => {
        showInGameBubble(`Hai babu! Yuk gaskeun bantu aku jawab soal matematika ya! ✨`, 3500);
    }, 1000);
}

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
    if(tabName === 'stats') {
        renderStats();
        renderAchievementList();
    }
}

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
    
    let isBonus = (cat.stage % 5 === 0);
    let baseTime = isBonus ? 15 : 30;
    
    let auraKey = cat.equippedAcc.aura;
    if (auraKey === 'aura_star') baseTime += 5;

    gameState.timeLeft = baseTime;
    startTimer();
    renderQuizUI();
}

function renderQuizUI() {
    let cat = gameState.cats[gameState.currentCat];
    let isBonus = (cat.stage % 5 === 0);
    
    let stageTitle = isBonus ? `⭐ BONUS STAGE ${cat.stage} (Fast 15s!)` : `Stage ${cat.stage}`;
    document.getElementById('stage-info').innerText = `${stageTitle} (Soal ${cat.qIndex}/3)`;
    document.getElementById('math-question').innerText = gameState.currentQuestion.q;

    let optHTML = '';
    gameState.currentQuestion.options.forEach(opt => {
        optHTML += `<button class="math-opt-btn" onclick="checkAnswer(${opt}, this)">${opt}</button>`;
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
            showInGameBubble(`Waktu habis! Hati-hati babu.`, 3000);
            playSound('wrong');
            triggerVibration(250);
            
            advanceQuizProgression();
        }
    }, 1000);
}

function useHint() {
    if (gameState.hints > 0) {
        gameState.hints--;
        playSound('click');
        let correctAns = gameState.currentQuestion.ans;
        showInGameBubble(`Hint: Jawabannya sekitar ${correctAns}!`, 3000);
        updateUI();
    } else {
        if (gameState.coins >= 10) {
            gameState.coins -= 10;
            gameState.hints++;
            playSound('coin');
            showInGameBubble('Berhasil beli 1 Hint!', 2500);
            useHint();
        } else {
            showInGameBubble('Hint habis & koin kurang (Butuh 10 koin)!', 3000);
        }
    }
}

// --- JAWABAN SALAH JADI WARNA MERAH ---
function checkAnswer(selected, btnElement) {
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

        showInGameBubble(`YEY babu jawabnya benar! ✨`, 3000);

        if(cat.correct >= 10) unlockAchievement('ach_10_correct');
        if(gameState.streakCount >= 5) unlockAchievement('ach_streak_5');

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
                triggerPopup("🎉 LEVEL UP!", `${cat.name.split(' ')[0]} Naik ke Level ${cat.level}!`, "🐱");
            }
        }
        
        let coinReward = isBonus ? 20 : 10;
        let auraKey = cat.equippedAcc.aura;
        if (auraKey === 'aura_sakura') coinReward = Math.floor(coinReward * 1.25);
        if (auraKey === 'aura_star') coinReward = Math.floor(coinReward * 1.5);

        gameState.coins += coinReward;
        showFloatingText(`+${coinReward}🪙`, 200, 250, '#55efc4');
        
        setTimeout(() => advanceQuizProgression(), 600);
    } else {
        playSound('wrong');
        triggerVibration(300);
        cat.incorrect++;
        gameState.stageMistakes++;
        gameState.streakCount = 0;
        
        // Kasih efek merah dan getar ke tombol yang ditekan
        if(btnElement) btnElement.classList.add('wrong-flash');

        if (gameState.stageMistakes >= 3) {
            setCatExpression('sad');
            showInGameBubble(`babu belajar lagi dah, next jawab yang bener! 😭`, 3500);
        } else {
            setCatExpression('angry');
            showInGameBubble(`cailah salah, gapapa baru sekali ~ 😉`, 3500);
        }

        setTimeout(() => {
            advanceQuizProgression();
        }, 800);
    }
}

function advanceQuizProgression() {
    let cat = gameState.cats[gameState.currentCat];
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

        if (cat.stage === 5) {
            unlockAchievement('ach_stage_5');
        }

        cat.stage++;
        cat.qIndex = 1;
        gameState.stageMistakes = 0;
    }

    updateUI();
    generateQuestion();
}

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
        showInGameBubble('Stage ini masih terkunci!', 2500);
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
        showInGameBubble('Koin kurang untuk skip soal (Butuh 15 koin).', 2500);
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
        showInGameBubble('Koin kurang untuk skip stage (Butuh 30 koin).', 2500);
    }
}

function updateUI() {
    document.getElementById('coin-count').innerText = gameState.coins;
    let cat = gameState.cats[gameState.currentCat];
    
    let bodyEl = document.getElementById('pixel-cat');
    if(bodyEl) bodyEl.className = 'pixel-cat-avatar ' + cat.class;

    let nameBanner = document.getElementById('main-cat-name');
    if(nameBanner) nameBanner.innerText = `${cat.name.split(' ')[0]} (Lv.${cat.level}) • Babu`;

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
            <button class="buy-btn">${actionText}</button>
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
        showInGameBubble('Koinmu belum cukup, Dew!', 2500);
    }
}

initRealtimeEnvironment();