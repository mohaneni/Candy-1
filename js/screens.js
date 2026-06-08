// Screen Management: Menu, Pause, Win, GameOver

const Screens = {
  currentScreen: null,

  /**
   * Initialize screen management
   */
  init() {
    this.setupMenuScreen();
    this.setupSettingsScreen();
    this.setupPauseScreen();
    this.setupWinScreen();
    this.setupGameOverScreen();
  },

  /**
   * Show a screen
   */
  show(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      this.currentScreen = screenId;
    }
  },

  /**
   * Setup menu screen
   */
  setupMenuScreen() {
    const btnPlay = document.getElementById('btn-play');
    const btnSettings = document.getElementById('btn-settings');
    
    btnPlay.addEventListener('click', () => {
      this.startGame();
    });
    
    btnSettings.addEventListener('click', () => {
      this.show('screen-settings');
    });
    
    // Update high score display
    const highScore = Storage.getHighScore();
    UI.showHighScore(highScore);
  },

  /**
   * Setup settings screen
   */
  setupSettingsScreen() {
    const btnBack = document.getElementById('btn-settings-back');
    const toggleSFX = document.getElementById('toggle-sfx');
    const toggleMusic = document.getElementById('toggle-music');
    const toggleShake = document.getElementById('toggle-shake');
    const toggleParticles = document.getElementById('toggle-particles');
    
    // Load saved settings
    const settings = Storage.getSettings();
    toggleSFX.checked = settings.sfx;
    toggleMusic.checked = settings.music;
    toggleShake.checked = settings.shake;
    toggleParticles.checked = settings.particles;
    
    // Back button
    btnBack.addEventListener('click', () => {
      this.show('screen-menu');
    });
    
    // Settings toggles
    toggleSFX.addEventListener('change', (e) => {
      settings.sfx = e.target.checked;
      Storage.saveSettings(settings);
      AudioManager.toggleSFX(e.target.checked);
    });
    
    toggleMusic.addEventListener('change', (e) => {
      settings.music = e.target.checked;
      Storage.saveSettings(settings);
      AudioManager.toggleMusic(e.target.checked);
    });
    
    toggleShake.addEventListener('change', (e) => {
      settings.shake = e.target.checked;
      Storage.saveSettings(settings);
      Effects.toggleShake(e.target.checked);
    });
    
    toggleParticles.addEventListener('change', (e) => {
      settings.particles = e.target.checked;
      Storage.saveSettings(settings);
      Effects.toggleParticles(e.target.checked);
    });
  },

  /**
   * Setup pause screen
   */
  setupPauseScreen() {
    const btnResume = document.getElementById('btn-resume');
    const btnRestart = document.getElementById('btn-restart');
    const btnQuit = document.getElementById('btn-quit');
    const btnPause = document.getElementById('btn-pause');
    
    btnPause.addEventListener('click', () => {
      this.showPause();
    });
    
    btnResume.addEventListener('click', () => {
      this.resumeGame();
    });
    
    btnRestart.addEventListener('click', () => {
      this.restartLevel();
    });
    
    btnQuit.addEventListener('click', () => {
      this.quitToMenu();
    });
  },

  /**
   * Setup win screen
   */
  setupWinScreen() {
    const btnNextLevel = document.getElementById('btn-next-level');
    const btnWinMenu = document.getElementById('btn-win-menu');
    
    btnNextLevel.addEventListener('click', () => {
      this.nextLevel();
    });
    
    btnWinMenu.addEventListener('click', () => {
      this.quitToMenu();
    });
  },

  /**
   * Setup game over screen
   */
  setupGameOverScreen() {
    const btnRetry = document.getElementById('btn-retry');
    const btnGameOverMenu = document.getElementById('btn-gameover-menu');
    
    btnRetry.addEventListener('click', () => {
      this.restartLevel();
    });
    
    btnGameOverMenu.addEventListener('click', () => {
      this.quitToMenu();
    });
  },

  /**
   * Start game
   */
  startGame() {
    const currentLevel = Storage.getCurrentLevel();
    console.log('Starting game with level:', currentLevel);
    
    // Show game screen first
    this.show('screen-game');
    
    // Initialize game with current level
    if (window.Game) {
      console.log('Game object found, starting level');
      Game.startLevel(currentLevel);
    } else {
      console.error('Game object not found! Check script loading order');
      alert('Game failed to load. Please refresh the page.');
    }
  },

  /**
   * Show pause screen
   */
  showPause() {
    this.show('screen-pause');
    if (window.Game) {
      Game.pause();
    }
  },

  /**
   * Resume game
   */
  resumeGame() {
    this.show('screen-game');
    if (window.Game) {
      Game.resume();
    }
  },

  /**
   * Restart current level
   */
  restartLevel() {
    this.show('screen-game');
    if (window.Game) {
      Game.restart();
    }
  },

  /**
   * Quit to main menu
   */
  quitToMenu() {
    this.show('screen-menu');
    if (window.Game) {
      Game.cleanup();
    }
    
    // Update high score display
    const highScore = Storage.getHighScore();
    UI.showHighScore(highScore);
  },

  /**
   * Show win screen
   */
  showWin(score, stars, isNewHighScore) {
    // Update win screen content
    document.getElementById('win-score').textContent = Utils.formatNumber(score);
    
    // Show stars
    const starsContainer = document.getElementById('win-stars');
    Utils.clearElement(starsContainer);
    
    for (let i = 0; i < 3; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = '⭐';
      
      if (i < stars) {
        star.classList.add('earned');
        star.style.animationDelay = `${i * 0.2}s`;
      } else {
        star.classList.add('empty');
      }
      
      starsContainer.appendChild(star);
    }
    
    // Show/hide high score badge
    const badge = document.getElementById('win-highscore-badge');
    if (isNewHighScore) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
    
    // Check if there's a next level
    const nextLevelId = Levels.getNextLevelId();
    const btnNextLevel = document.getElementById('btn-next-level');
    if (nextLevelId) {
      btnNextLevel.classList.remove('hidden');
    } else {
      btnNextLevel.classList.add('hidden');
    }
    
    this.show('screen-win');
  },

  /**
   * Show game over screen
   */
  showGameOver(score) {
    document.getElementById('gameover-score').textContent = Utils.formatNumber(score);
    this.show('screen-gameover');
  },

  /**
   * Next level
   */
  nextLevel() {
    const nextLevelId = Levels.getNextLevelId();
    if (nextLevelId && window.Game) {
      this.show('screen-game');
      Game.startLevel(nextLevelId);
    }
  }
};
