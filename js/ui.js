// UI Manager: HUD, Score, Objectives, Progress

const UI = {
  elements: {},

  /**
   * Initialize UI elements
   */
  init() {
    this.elements = {
      hudLevel: document.getElementById('hud-level-num'),
      hudScore: document.getElementById('hud-score'),
      movesCount: document.getElementById('moves-count'),
      objectivesList: document.getElementById('objectives-list'),
      progressFill: document.getElementById('progress-bar-fill'),
      starMarkers: document.querySelectorAll('.star-marker')
    };
  },

  /**
   * Update level display
   */
  updateLevel(levelNum) {
    this.elements.hudLevel.textContent = levelNum;
  },

  /**
   * Update score display
   */
  updateScore(score) {
    this.elements.hudScore.textContent = Utils.formatNumber(score);
    
    // Bump animation
    this.elements.hudScore.classList.add('score-bump');
    setTimeout(() => {
      this.elements.hudScore.classList.remove('score-bump');
    }, 250);
  },

  /**
   * Update moves remaining
   */
  updateMoves(moves) {
    this.elements.movesCount.textContent = moves;
    
    // Add low-moves warning
    if (moves <= 5) {
      this.elements.movesCount.classList.add('low-moves');
    } else {
      this.elements.movesCount.classList.remove('low-moves');
    }
  },

  /**
   * Update objectives display
   */
  updateObjectives(objectives) {
    Utils.clearElement(this.elements.objectivesList);
    
    objectives.forEach(obj => {
      const item = document.createElement('div');
      item.className = 'objective-item';
      
      if (obj.type === 'score') {
        item.textContent = `🎯 ${obj.label}`;
      } else if (obj.type === 'collect') {
        const emoji = CONFIG.CANDY_EMOJIS[obj.candy];
        item.textContent = `${emoji} ${obj.current}/${obj.target}`;
      } else if (obj.type === 'special') {
        const icons = {
          striped: '⚡',
          wrapped: '🎁',
          bomb: '💣'
        };
        const icon = icons[obj.specialType] || '⭐';
        item.textContent = `${icon} ${obj.current}/${obj.target}`;
      }
      
      // Mark as completed
      if (this.isObjectiveComplete(obj)) {
        item.classList.add('completed');
      }
      
      this.elements.objectivesList.appendChild(item);
    });
  },

  /**
   * Check if objective is complete
   */
  isObjectiveComplete(obj) {
    if (obj.type === 'score') {
      return obj.current >= obj.target;
    } else if (obj.type === 'collect' || obj.type === 'special') {
      return obj.current >= obj.target;
    }
    return false;
  },

  /**
   * Update progress bar
   */
  updateProgress(score, starThresholds) {
    const maxScore = starThresholds[starThresholds.length - 1];
    const percentage = Math.min((score / maxScore) * 100, 100);
    
    this.elements.progressFill.style.width = `${percentage}%`;
    
    // Update star markers
    this.elements.starMarkers.forEach((marker, index) => {
      if (score >= starThresholds[index]) {
        marker.classList.add('earned');
      } else {
        marker.classList.remove('earned');
      }
    });
  },

  /**
   * Calculate stars earned
   */
  calculateStars(score, starThresholds) {
    let stars = 0;
    for (let i = 0; i < starThresholds.length; i++) {
      if (score >= starThresholds[i]) {
        stars = i + 1;
      }
    }
    return stars;
  },

  /**
   * Show high score on menu
   */
  showHighScore(highScore) {
    const menuHighScore = document.getElementById('menu-highscore');
    if (highScore > 0) {
      menuHighScore.textContent = `High Score: ${Utils.formatNumber(highScore)}`;
    } else {
      menuHighScore.textContent = '';
    }
  },

  /**
   * Reset UI for new level
   */
  reset() {
    this.updateScore(0);
    this.elements.movesCount.classList.remove('low-moves');
    this.elements.progressFill.style.width = '0%';
    this.elements.starMarkers.forEach(marker => {
      marker.classList.remove('earned');
    });
  }
};
