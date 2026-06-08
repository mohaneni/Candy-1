// Level Management and Win/Lose Logic

const Levels = {
  currentLevel: null,
  currentLevelIndex: 0,
  score: 0,
  movesRemaining: 0,
  comboMultiplier: 1,
  objectives: [],

  /**
   * Load a level
   */
  loadLevel(levelId) {
    const level = CONFIG.LEVELS.find(l => l.id === levelId);
    if (!level) {
      console.error('Level not found:', levelId);
      return false;
    }
    
    this.currentLevel = Utils.deepClone(level);
    this.currentLevelIndex = levelId - 1;
    this.score = 0;
    this.movesRemaining = level.moves;
    this.comboMultiplier = 1;
    
    // Initialize objectives
    this.objectives = level.objectives.map(obj => ({
      ...obj,
      current: 0
    }));
    
    // Update UI
    UI.updateLevel(levelId);
    UI.updateScore(0);
    UI.updateMoves(this.movesRemaining);
    UI.updateObjectives(this.objectives);
    UI.updateProgress(0, level.starThresholds);
    
    return true;
  },

  /**
   * Use a move
   */
  useMove() {
    this.movesRemaining--;
    UI.updateMoves(this.movesRemaining);
    
    // Check for game over
    if (this.movesRemaining <= 0) {
      return this.checkGameOver();
    }
    
    return false; // Not game over yet
  },

  /**
   * Add score
   */
  addScore(points, row, col) {
    const finalScore = Math.floor(points * this.comboMultiplier);
    this.score += finalScore;
    
    // Update objective if score-based
    this.objectives.forEach(obj => {
      if (obj.type === 'score') {
        obj.current = this.score;
      }
    });
    
    UI.updateScore(this.score);
    UI.updateObjectives(this.objectives);
    UI.updateProgress(this.score, this.currentLevel.starThresholds);
    
    // Show floating score
    if (row !== undefined && col !== undefined) {
      Effects.floatingScore(finalScore, row, col);
    }
  },

  /**
   * Update collect objective
   */
  collectCandy(type) {
    this.objectives.forEach(obj => {
      if (obj.type === 'collect' && obj.candy === type) {
        obj.current++;
      }
    });
    
    UI.updateObjectives(this.objectives);
  },

  /**
   * Update special candy objective
   */
  createSpecialCandy(specialType) {
    // Extract base type (striped-h/striped-v -> striped)
    const baseType = specialType.split('-')[0];
    
    this.objectives.forEach(obj => {
      if (obj.type === 'special' && obj.specialType === baseType) {
        obj.current++;
      }
    });
    
    UI.updateObjectives(this.objectives);
  },

  /**
   * Increment combo multiplier
   */
  incrementCombo() {
    this.comboMultiplier = Math.min(
      this.comboMultiplier + CONFIG.COMBO_MULTIPLIER_INCREMENT,
      CONFIG.MAX_COMBO_MULTIPLIER
    );
    
    if (this.comboMultiplier > 1) {
      Effects.showCombo(this.comboMultiplier);
    }
  },

  /**
   * Reset combo multiplier
   */
  resetCombo() {
    this.comboMultiplier = 1;
  },

  /**
   * Check if all objectives are complete
   */
  areObjectivesComplete() {
    return this.objectives.every(obj => UI.isObjectiveComplete(obj));
  },

  /**
   * Check for win condition
   */
  checkWin() {
    if (this.areObjectivesComplete()) {
      this.handleWin();
      return true;
    }
    return false;
  },

  /**
   * Check for game over condition
   */
  checkGameOver() {
    if (this.movesRemaining <= 0 && !this.areObjectivesComplete()) {
      this.handleGameOver();
      return true;
    }
    return false;
  },

  /**
   * Handle win
   */
  handleWin() {
    // Calculate stars
    const stars = UI.calculateStars(this.score, this.currentLevel.starThresholds);
    
    // Save progress
    Storage.saveLevelStars(this.currentLevel.id, stars);
    const isNewHighScore = Storage.saveHighScore(this.score);
    
    // Unlock next level
    if (this.currentLevelIndex < CONFIG.LEVELS.length - 1) {
      Storage.saveCurrentLevel(this.currentLevel.id + 1);
    }
    
    // Show win screen
    Screens.showWin(this.score, stars, isNewHighScore);
    
    // Play sound
    AudioManager.play('win');
  },

  /**
   * Handle game over
   */
  handleGameOver() {
    Screens.showGameOver(this.score);
  },

  /**
   * Get next level ID
   */
  getNextLevelId() {
    if (this.currentLevelIndex < CONFIG.LEVELS.length - 1) {
      return this.currentLevel.id + 1;
    }
    return null; // No more levels
  },

  /**
   * Reset level data
   */
  reset() {
    this.currentLevel = null;
    this.score = 0;
    this.movesRemaining = 0;
    this.comboMultiplier = 1;
    this.objectives = [];
  }
};
