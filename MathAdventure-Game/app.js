const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const questionModeBtn = document.getElementById('questionModeBtn');
const questionText = document.getElementById('questionText');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const timerValue = document.getElementById('timerValue');
const progressBar = document.getElementById('progressBar');

const levelValue = document.getElementById('levelValue');
const scoreValue = document.getElementById('scoreValue');
const correctValue = document.getElementById('correctValue');
const streakValue = document.getElementById('streakValue');
const questionModeValue = document.getElementById('questionModeValue');
const companionLabel = document.getElementById('companionLabel');
const companionRunner = document.getElementById('companionRunner');
const heroImage = document.getElementById('heroImage');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const openLoginBtn = document.getElementById('openLoginBtn');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');
const userStatus = document.getElementById('userStatus');
const openCollectionBtn = document.getElementById('openCollectionBtn');
const closeCollectionBtn = document.getElementById('closeCollectionBtn');
const collectionModal = document.getElementById('collectionModal');
const collectionCount = document.getElementById('collectionCount');
const collectionGrid = document.getElementById('collectionGrid');
const clearCollectionBtn = document.getElementById('clearCollectionBtn');
const adminPanel = document.getElementById('adminPanel');
const adminTimeLimit = document.getElementById('adminTimeLimit');
const adminLevelGoal = document.getElementById('adminLevelGoal');
const adminUnlockBtn = document.getElementById('adminUnlockBtn');
const adminSaveSettingsBtn = document.getElementById('adminSaveSettingsBtn');
const adminQuestionOverride = document.getElementById('adminQuestionOverride');
const adminAnswerOverride = document.getElementById('adminAnswerOverride');
const adminApplyQuestionBtn = document.getElementById('adminApplyQuestionBtn');
const logoutBtn = document.getElementById('logoutBtn');
const logoutBtnGame = document.getElementById('logoutBtnGame');
const companionPopup = document.getElementById('companionPopup');
const popupImage = document.getElementById('popupImage');
const popupMessage = document.getElementById('popupMessage');
let popupTimeoutId = null;

// Minion image list and recent history to avoid immediate repeats
let minionImageList = window.minionImageList || [];
const RECENT_MINION_LIMIT = 10;
let recentMinions = [];
let lastChosenMinion = '';
let lastRunnerMinion = '';
let questionMode = localStorage.getItem('mathadventure-question-mode') || 'game';

function getUserCollection() {
  if (!currentUser) return [];
  return Array.isArray(currentUser.collection) ? currentUser.collection : [];
}

function saveUserCollection() {
  if (!currentUser) return;
  if (!Array.isArray(currentUser.collection)) {
    currentUser.collection = [];
  }
  saveUsers();
}

function addCollectedMinion(imageUrl) {
  if (!currentUser || !imageUrl) return;
  currentUser.collection = currentUser.collection || [];
  if (!currentUser.collection.includes(imageUrl)) {
    currentUser.collection.unshift(imageUrl);
    saveUserCollection();
  }
}

function clearCollectedMinions() {
  if (!currentUser) return;
  currentUser.collection = [];
  saveUserCollection();
}

function renderCollectionGallery() {
  const images = getUserCollection();
  collectionCount.textContent = images.length;
  if (!collectionGrid) return;
  if (!images.length) {
    collectionGrid.innerHTML = '<p class="empty-collection">Chưa có minion nào. Giải đúng câu hỏi để thu thập nhé!</p>';
    return;
  }
  collectionGrid.innerHTML = images.map((url) => `
      <div class="collection-item">
        <img src="${url}" alt="Minion đã thu thập" />
      </div>
    `).join('');
}

function showCollectionModal() {
  if (!currentUser) {
    showLoginMessage('Đăng nhập để mở bộ sưu tập', true);
    showLoginModal();
    return;
  }
  renderCollectionGallery();
  collectionModal.classList.remove('hidden');
}

function hideCollectionModal() {
  if (!collectionModal) return;
  collectionModal.classList.add('hidden');
}

function updateHeroImage() {
  if (!heroImage) return;
  const chosenImage = pickRandomMinionImage() || heroImage.src;
  heroImage.src = chosenImage;
  heroImage.alt = 'Nhân vật mascot MathAdventure';
}

function pickRandomMinionImage() {
  if (!Array.isArray(minionImageList) || minionImageList.length === 0) {
    return '';
  }

  // If list is smaller than or equal to RECENT_MINION_LIMIT, just shuffle and pick a random
  const available = minionImageList.filter((p) => !recentMinions.includes(p));
  let pick = '';
  if (available.length === 0) {
    // reset recent history preserving last one
    recentMinions = recentMinions.slice(-1);
    pick = minionImageList[Math.floor(Math.random() * minionImageList.length)];
  } else {
    pick = available[Math.floor(Math.random() * available.length)];
  }

  recentMinions.push(pick);
  if (recentMinions.length > RECENT_MINION_LIMIT) recentMinions.shift();
  lastChosenMinion = pick;
  return pick;
}

let users = loadUsers();
let currentUser = getCurrentUserProfile();

function loadUsers() {
  const rawUsers = localStorage.getItem('mathadventure-users');
  const stored = rawUsers ? JSON.parse(rawUsers) : {};
  if (!stored.admin) {
    stored.admin = {
      password: 'admin',
      unlockedLevel: 6,
      startLevel: 1,
      bestScore: 0,
      isAdmin: true,
      timeLimit: 15,
      levelGoal: 3
    };
  }
  return stored;
}

function saveUsers() {
  localStorage.setItem('mathadventure-users', JSON.stringify(users));
}

function getQuestionModeLabel() {
  // return questionMode === 'source' ? 'Tài liệu' : 'Game';
  return 'Document';
}

function updateQuestionModeUI() {
  const label = getQuestionModeLabel();
  if (questionModeBtn) {
    questionModeBtn.textContent = `Nguồn: ${label}`;
  }
  if (questionModeValue) {
    questionModeValue.textContent = label;
  }
}

function setQuestionMode(mode) {
  questionMode = mode === 'source' ? 'source' : 'game';
  localStorage.setItem('mathadventure-question-mode', questionMode);
  updateQuestionModeUI();
}

function toggleQuestionMode() {
  setQuestionMode(questionMode === 'source' ? 'game' : 'source');
  resetGame();
}

function getCurrentUsername() {
  return localStorage.getItem('mathadventure-current-user');
}

function getCurrentUserProfile() {
  const username = getCurrentUsername();
  return username && users[username] ? users[username] : null;
}

function setCurrentUser(username) {
  localStorage.setItem('mathadventure-current-user', username);
  currentUser = users[username];
}

function createUser(username, password) {
  users[username] = {
    password,
    unlockedLevel: 1,
    startLevel: 1,
    bestScore: 0,
    isAdmin: false,
    timeLimit: 15,
    levelGoal: 3
  };
  saveUsers();
  return users[username];
}

function showLoginMessage(text, isError = false) {
  loginMessage.textContent = text;
  loginMessage.style.color = isError ? '#b91c1c' : '#15803d';
}

function updateStateForUser() {
  if (!currentUser) {
    return;
  }

  state.level = getStartLevel();
  state.timeLimit = currentUser.timeLimit || 15;
  state.levelGoal = currentUser.levelGoal || 3;
  state.score = 0;
  state.correct = 0;
  state.total = 0;
  state.streak = 0;
  state.levelProgress = 0;
  state.bestScore = Number(currentUser.bestScore || 0);
  state.timeLeft = state.timeLimit;
  renderStats();
}

function showLoginModal() {
  loginModal.classList.remove('hidden');
  usernameInput.focus();
}

function hideLoginModal() {
  loginModal.classList.add('hidden');
}

function handleLogin() {
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showLoginMessage('Nhập tên đăng nhập và mật khẩu', true);
    return;
  }

  if (users[username]) {
    if (users[username].password !== password) {
      showLoginMessage('Sai mật khẩu, thử lại', true);
      return;
    }

    setCurrentUser(username);
    updateStateForUser();
    initAuthentication();
    showLoginMessage(`Đăng nhập thành công: ${username}`, false);
    hideLoginModal();
    return;
  }

  createUser(username, password);
  setCurrentUser(username);
  updateStateForUser();
  initAuthentication();
  showLoginMessage(`Tạo tài khoản mới: ${username}`, false);
  hideLoginModal();
}

function updateUserStatus() {
  if (!currentUser) {
    userStatus.textContent = 'Vui lòng đăng nhập hoặc tạo tài khoản';
    return;
  }

  const label = currentUser.isAdmin ? 'Admin' : 'Người dùng';
  userStatus.textContent = `${label}: ${getCurrentUsername()} · Level mở khóa ${getSavedUnlockedLevel()}`;
}

function enableStartButton() {
  startBtn.disabled = false;
}

function disableStartButton() {
  startBtn.disabled = true;
}

function initAuthentication() {
  if (currentUser) {
    updateUserStatus();
    enableStartButton();
    // show logout, hide login
    logoutBtn.classList.remove('hidden');
    logoutBtnGame.classList.remove('hidden');
    openLoginBtn.classList.add('hidden');
    showAdminPanel();
  } else {
    disableStartButton();
    // hide logout, show login
    logoutBtn.classList.add('hidden');
    logoutBtnGame.classList.add('hidden');
    openLoginBtn.classList.remove('hidden');
    adminPanel.classList.add('hidden');
  }
}


function logoutUser() {
  clearTimer();
  saveUserProgress();
  localStorage.removeItem('mathadventure-current-user');
  currentUser = null;
  updateUserStatus();
  initAuthentication();
  hideLoginModal();
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  state.level = 1;
  state.score = 0;
  state.correct = 0;
  state.total = 0;
  state.streak = 0;
  state.levelProgress = 0;
  state.timeLeft = state.timeLimit;
  renderStats();
  showLoginMessage('Bạn đã đăng xuất', false);
}

function exitToStart() {
  // Return to the start screen but keep the user logged in
  clearTimer();
  saveUserProgress();
  hideLoginModal();
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  // preserve currentUser and its settings
  state.timeLeft = state.timeLimit;
  state.level = getStartLevel();
  state.score = state.score || 0;
  state.correct = state.correct || 0;
  state.total = state.total || 0;
  state.streak = state.streak || 0;
  state.levelProgress = state.levelProgress || 0;
  renderStats();
  showLoginMessage('Trở về màn hình chính', false);
}

function getSavedUnlockedLevel() {
  if (!currentUser) {
    return 1;
  }
  return currentUser.isAdmin ? 6 : Math.max(1, currentUser.unlockedLevel || 1);
}

function getStartLevel() {
  if (!currentUser) {
    return 1;
  }
  const savedStartLevel = Number(currentUser.startLevel || 1);
  return Math.max(1, Math.min(savedStartLevel, getSavedUnlockedLevel()));
}

function setSavedUnlockedLevel(level) {
  if (!currentUser || currentUser.isAdmin) {
    return;
  }

  currentUser.unlockedLevel = Math.max(currentUser.unlockedLevel || 1, level);
  saveUsers();
  updateUserStatus();
}

function setUserStartLevel(level) {
  if (!currentUser) {
    return;
  }

  currentUser.startLevel = level;
  saveUsers();
}

function saveUserProgress() {
  if (!currentUser) {
    return;
  }

  currentUser.bestScore = Math.max(currentUser.bestScore || 0, state.score);
  saveUsers();
}

function showAdminPanel() {
  if (!currentUser || !currentUser.isAdmin) {
    adminPanel.classList.add('hidden');
    return;
  }

  adminPanel.classList.remove('hidden');
  adminTimeLimit.value = currentUser.timeLimit || state.timeLimit;
  adminLevelGoal.value = currentUser.levelGoal || state.levelGoal;
}

function applyAdminSettings() {
  if (!currentUser || !currentUser.isAdmin) {
    return;
  }

  const timeLimit = Number(adminTimeLimit.value);
  const levelGoal = Number(adminLevelGoal.value);

  if (Number.isInteger(timeLimit) && timeLimit >= 5) {
    currentUser.timeLimit = timeLimit;
  }

  if (Number.isInteger(levelGoal) && levelGoal >= 1) {
    currentUser.levelGoal = levelGoal;
  }

  saveUsers();
  showLoginMessage('Cài đặt admin đã lưu', false);
}

function unlockAllLevels() {
  if (!currentUser || !currentUser.isAdmin) {
    return;
  }

  currentUser.unlockedLevel = 6;
  saveUsers();
  updateUserStatus();
  showLoginMessage('Đã mở khóa tất cả các level cho admin', false);
}

function applyAdminQuestion() {
  if (!currentUser || !currentUser.isAdmin || !state.currentQuestion) {
    return;
  }

  const prompt = adminQuestionOverride.value.trim();
  const answerValue = adminAnswerOverride.value.trim();
  const answer = Number(answerValue);

  if (!prompt || Number.isNaN(answer)) {
    showLoginMessage('Vui lòng nhập câu hỏi và đáp án số hợp lệ', true);
    return;
  }

  state.currentQuestion.prompt = prompt;
  state.currentQuestion.answer = answer;
  state.currentQuestion.options = buildOptions(answer);
  renderQuestion();
  showLoginMessage('Câu hỏi admin đã cập nhật', false);
}

const state = {
  level: getStartLevel(),
  score: 0,
  correct: 0,
  total: 0,
  streak: 0,
  levelProgress: 0,
  levelGoal: currentUser ? currentUser.levelGoal || 3 : 3,
  currentQuestion: null,
  answered: false,
  timeLimit: currentUser ? currentUser.timeLimit || 15 : 15,
  timeLeft: 15,
  timerId: null,
  bestScore: Number(localStorage.getItem('mathadventure-best') || 0)
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOptions(answer) {
  const set = new Set([answer]);
  while (set.size < 4) {
    const candidate = answer + randomInt(-6, 6);
    if (candidate >= 0) {
      set.add(candidate);
    }
  }
  return shuffle([...set]);
}

function getLevelBank(level) {
  // if (questionMode === 'source') {
  //   return getSourceLevelBank(level);
  // }

  const banks = {
    1: window.level1Questions || [],
    2: window.level2Questions || [],
    3: window.level3Questions || [],
    4: window.level4Questions || [],
    5: window.level5Questions || [],
    6: window.level6Questions || []
  };
  return banks[level] || [];
}

function getSourceLevelBank(level) {
  const sourceQuestions = window.sourceSimplePreviewQuestions || [];
  const exact = sourceQuestions.filter((question) => Number(question.level) === Number(level));
  if (exact.length) {
    return exact;
  }

  const levels = [...new Set(sourceQuestions.map((question) => Number(question.level)).filter(Boolean))].sort((a, b) => a - b);
  const fallbackLevel = levels.filter((candidate) => candidate <= Number(level)).pop() || levels[0];
  return sourceQuestions.filter((question) => Number(question.level) === fallbackLevel);
}

function generateQuestion(level) {
  const bank = getLevelBank(level);
  if (!bank.length) {
    return {
      prompt: 'Câu hỏi sắp ra mắt',
      answer: 0,
      options: buildOptions(0),
      topic: 'Đang cập nhật'
    };
  }

  const index = randomInt(0, bank.length - 1);
  const chosen = bank[index];
  return {
    prompt: chosen.prompt,
    answer: Number(chosen.answer),
    options: buildOptions(Number(chosen.answer)),
    topic: chosen.topic || 'Ôn tập'
  };
}

const companions = [
  { level: 1, name: 'Minion xanh', image: 'assets/downloaded/minions/8313fb6ee9f958b4f8be746d1ae38abe.jpg' },
  { level: 2, name: 'Minion vàng', image: 'assets/downloaded/minions/c8f43018e02a0a810f1f280825918735.jpg' },
  { level: 3, name: 'Minion vui', image: 'assets/downloaded/minions/701e1941192f536f983b8c7c043432de.jpg' }
];

const audioContext = window.AudioContext || window.webkitAudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;

function createOscillator(type, frequency) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  return oscillator;
}

function playSound({ frequencies = [], duration = 0.15, type = 'sine', volume = 0.08, attack = 0.01, release = 0.1 }) {
  if (!audioContext) return;
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration + release);
  gainNode.connect(audioContext.destination);

  frequencies.forEach((frequency) => {
    const oscillator = createOscillator(type, frequency);
    oscillator.connect(gainNode);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration + release);
  });
}

function playStartSound() {
  playSound({ frequencies: [660, 880], duration: 0.16, type: 'triangle', volume: 0.08, attack: 0.01, release: 0.12 });
  setTimeout(() => playSound({ frequencies: [1040], duration: 0.14, type: 'sine', volume: 0.06, attack: 0.01, release: 0.1 }), 90);
}

function playCorrectSound() {
  playSound({ frequencies: [523, 660], duration: 0.14, type: 'triangle', volume: 0.09, attack: 0.005, release: 0.08 });
  setTimeout(() => playSound({ frequencies: [784], duration: 0.12, type: 'square', volume: 0.07, attack: 0.005, release: 0.08 }), 80);
}

function playWrongSound() {
  playSound({ frequencies: [220, 110], duration: 0.22, type: 'sawtooth', volume: 0.09, attack: 0.01, release: 0.18 });
}

function playTimeoutSound() {
  playSound({ frequencies: [180, 120], duration: 0.24, type: 'triangle', volume: 0.08, attack: 0.01, release: 0.16 });
}

function playButtonSound() {
  playSound({ frequencies: [880], duration: 0.08, type: 'square', volume: 0.05, attack: 0.005, release: 0.04 });
}

function getCompanion(level) {
  return companions.find((item) => item.level === level) || companions[0];
}

function renderStats() {
  levelValue.textContent = state.level;
  scoreValue.textContent = state.score;
  correctValue.textContent = `${state.correct}/${state.total}`;
  streakValue.textContent = `${state.streak} • ${state.levelProgress}/${state.levelGoal}`;
  updateQuestionModeUI();
  const companion = getCompanion(state.level);
  companionLabel.textContent = `Đồng hành: ${companion.name}`;
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerUI() {
  const percent = (state.timeLeft / state.timeLimit) * 100;
  timerValue.textContent = `${state.timeLeft}s`;
  progressBar.style.width = `${Math.max(0, percent)}%`;
}

function startTimer() {
  clearTimer();
  state.timeLeft = state.timeLimit;
  updateTimerUI();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearTimer();
      handleAnswer(null, true);
    }
  }, 1000);
}

function renderQuestion() {
  playStartSound();
  feedbackEl.textContent = 'Chọn đáp án phù hợp.';
  feedbackEl.style.color = '#374151';
  optionsEl.innerHTML = '';
  nextBtn.disabled = true;

  const companion = getCompanion(state.level);
  companionRunner.innerHTML = '';
  const image = document.createElement('img');
  // choose a random minion image from the downloaded set (avoid recent repeats)
  const chosenImage = pickRandomMinionImage() || companion.image;
  lastRunnerMinion = chosenImage;
  image.src = chosenImage;
  image.alt = companion.name || 'Đồng hành';
  image.className = 'companion-image';
  image.style.background = 'transparent';
  companionRunner.appendChild(image);
  // reset and start runner animation timed to the question time limit
  companionRunner.style.animation = 'none';
  companionRunner.style.left = '-56px';
  void companionRunner.offsetWidth;
  companionRunner.style.animation = `runAcross ${state.timeLimit}s linear forwards`;
  updateHeroImage();

  questionText.textContent = state.currentQuestion.prompt;
  state.currentQuestion.options.forEach((value) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = value;
    button.addEventListener('click', () => handleAnswer(value));
    optionsEl.appendChild(button);
  });

  state.answered = false;
  startTimer();
}

function nextQuestion() {
  state.currentQuestion = generateQuestion(state.level);
  renderQuestion();
}

function handleAnswer(selectedValue, isTimeout = false) {
  if (state.answered) return;

  clearTimer();
  state.answered = true;
  state.total += 1;
  const correct = state.currentQuestion.answer;
  const buttons = Array.from(optionsEl.querySelectorAll('button'));

  buttons.forEach((button) => {
    const value = Number(button.textContent);
    if (value === correct) {
      button.classList.add('correct');
    } else if (!Number.isNaN(Number(selectedValue)) && Number(button.textContent) === Number(selectedValue)) {
      button.classList.add('wrong');
    }
  });

  if (isTimeout) {
    playTimeoutSound();
    state.streak = 0;
    state.levelProgress = 0;
    feedbackEl.textContent = `⏰ Hết giờ! Đáp án đúng là ${correct}.`;
    feedbackEl.style.color = '#b91c1c';
    showCompanionPopup('timeout', `⏰ Hết giờ! Đáp án đúng là ${correct}.`);
  } else if (Number(selectedValue) === correct) {
    playCorrectSound();
    state.correct += 1;
    state.score += 10 + state.level * 5;
    state.streak += 1;
    state.levelProgress += 1;

    if (state.levelProgress >= state.levelGoal) {
      const previousLevel = state.level;
      state.levelProgress = 0;

      if (state.level < 6) {
        state.level += 1;
        setSavedUnlockedLevel(state.level);
        feedbackEl.textContent = `🎉 Chính xác! Bạn đã qua Level ${previousLevel} → Level ${state.level}.`;
      } else {
        feedbackEl.textContent = '🎉 Chính xác! Bạn đã hoàn thành tất cả các level.';
      }
    } else {
      feedbackEl.textContent = '🎉 Chính xác!';
    }
    feedbackEl.style.color = '#15803d';
    addCollectedMinion(lastRunnerMinion);
    showCompanionPopup('correct', feedbackEl.textContent);
  } else {
    playWrongSound();
    state.streak = 0;
    state.levelProgress = 0;
    feedbackEl.textContent = `😅 Sai rồi. Đáp án đúng là ${correct}.`;
    feedbackEl.style.color = '#b91c1c';
    showCompanionPopup('wrong', feedbackEl.textContent);
  }

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    saveUserProgress();
  }

  renderStats();
  nextBtn.disabled = false;
}

function showCompanionPopup(type, message) {
  if (!companionPopup) return;
  const companion = getCompanion(state.level);
  popupImage.src = lastRunnerMinion || companion.image || '';
  popupImage.alt = companion.name || 'Đồng hành';
  popupMessage.textContent = message || '';
  companionPopup.classList.remove('hidden');
  // clear any previous timeout
  if (popupTimeoutId) {
    clearTimeout(popupTimeoutId);
    popupTimeoutId = null;
  }
  // auto-hide after 1.4s
  popupTimeoutId = setTimeout(() => {
    hideCompanionPopup();
  }, 1400);
}

function hideCompanionPopup() {
  if (!companionPopup) return;
  companionPopup.classList.add('hidden');
  if (popupTimeoutId) {
    clearTimeout(popupTimeoutId);
    popupTimeoutId = null;
  }
}

function startGame() {
  if (!currentUser) {
    showLoginModal();
    return;
  }

  playStartSound();
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  requestAnimationFrame(() => {
    gameScreen.classList.add('show');
  });
  resetGame();
}

function resetGame() {
  clearTimer();
  state.level = getStartLevel();
  state.timeLimit = currentUser ? currentUser.timeLimit || 15 : 15;
  state.levelGoal = currentUser ? currentUser.levelGoal || 3 : 3;
  state.score = 0;
  state.correct = 0;
  state.total = 0;
  state.streak = 0;
  state.levelProgress = 0;
  state.timeLeft = state.timeLimit;
  renderStats();
  nextQuestion();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => { playButtonSound(); resetGame(); });
questionModeBtn.addEventListener('click', () => { playButtonSound(); toggleQuestionMode(); });
nextBtn.addEventListener('click', () => { playButtonSound(); hideCompanionPopup(); nextQuestion(); });
openLoginBtn.addEventListener('click', () => { playButtonSound(); showLoginModal(); });
openCollectionBtn.addEventListener('click', () => { playButtonSound(); showCollectionModal(); });
logoutBtn.addEventListener('click', () => { playButtonSound(); logoutUser(); });
// Topbar button now exits to the start screen instead of logging out
logoutBtnGame.addEventListener('click', () => { playButtonSound(); exitToStart(); });
closeLoginBtn.addEventListener('click', () => { playButtonSound(); hideLoginModal(); });
closeCollectionBtn.addEventListener('click', () => { playButtonSound(); hideCollectionModal(); });
clearCollectionBtn.addEventListener('click', () => {
  playButtonSound();
  clearCollectedMinions();
  renderCollectionGallery();
});
loginModal.addEventListener('click', (event) => {
  if (event.target === loginModal) {
    hideLoginModal();
  }
});
collectionModal.addEventListener('click', (event) => {
  if (event.target === collectionModal) {
    hideCollectionModal();
  }
});
loginBtn.addEventListener('click', () => { playButtonSound(); handleLogin(); });
adminSaveSettingsBtn.addEventListener('click', () => { playButtonSound(); applyAdminSettings(); });
adminUnlockBtn.addEventListener('click', () => { playButtonSound(); unlockAllLevels(); });
adminApplyQuestionBtn.addEventListener('click', () => { playButtonSound(); applyAdminQuestion(); });

initAuthentication();
updateQuestionModeUI();
renderStats();
