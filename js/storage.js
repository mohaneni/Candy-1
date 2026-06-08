// LocalStorage Manager

const Storage = {
  KEYS: {
    HIGH_SCORE: 'candyBlast_highScore',
    CURRENT_LEVEL: 'candyBlast_currentLevel',
    SETTINGS: 'candyBlast_settings',
    LEVEL_STARS: 'candyBlast_levelStars'
  },

  /**
   * Get high score
   */
  getHighScore() {
    const score = localStorage.getItem(this.KEYS.HIGH_SCORE);
    return score ? parseInt(score, 10) : 0;
  },

  /**
   * Save high score
   */
  saveHighScore(score) {
    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      localStorage.setItem(this.KEYS.HIGH_SCORE, score.toString());
      return true; // New high score
    }
    return false;
  },

  /**
   * Get current level
   */
  getCurrentLevel() {
    const level = localStorage.getItem(this.KEYS.CURRENT_LEVEL);
    return level ? parseInt(level, 10) : 1;
  },

  /**
   * Save current level
   */
  saveCurrentLevel(level) {
    localStorage.setItem(this.KEYS.CURRENT_LEVEL, level.toString());
  },

  /**
   * Get settings
   */
  getSettings() {
    const settings = localStorage.getItem(this.KEYS.SETTINGS);
    if (settings) {
      return JSON.parse(settings);
    }
    // Default settings
    return {
      sfx: true,
      music: true,
      shake: true,
      particles: true
    };
  },

  /**
   * Save settings
   */
  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  },

  /**
   * Get stars earned for a level
   */
  getLevelStars(levelId) {
    const stars = localStorage.getItem(this.KEYS.LEVEL_STARS);
    if (stars) {
      const starsData = JSON.parse(stars);
      return starsData[levelId] || 0;
    }
    return 0;
  },

  /**
   * Save stars for a level
   */
  saveLevelStars(levelId, stars) {
    let starsData = {};
    const existing = localStorage.getItem(this.KEYS.LEVEL_STARS);
    if (existing) {
      starsData = JSON.parse(existing);
    }
    
    // Only save if better than previous
    if (stars > (starsData[levelId] || 0)) {
      starsData[levelId] = stars;
      localStorage.setItem(this.KEYS.LEVEL_STARS, JSON.stringify(starsData));
    }
  },

  /**
   * Clear all data (for testing)
   */
  clearAll() {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
