// Visual Effects: Particles, Screen Shake, Floating Text

const Effects = {
  settings: {
    shake: true,
    particles: true
  },
  fxLayer: null,

  /**
   * Initialize effects system
   */
  init() {
    this.fxLayer = document.getElementById('fx-layer');
    
    // Load settings
    const savedSettings = Storage.getSettings();
    this.settings.shake = savedSettings.shake;
    this.settings.particles = savedSettings.particles;
  },

  /**
   * Create floating score text
   */
  floatingScore(score, row, col) {
    const cell = Utils.getCellElement(row, col);
    if (!cell) return;
    
    const rect = cell.getBoundingClientRect();
    const boardRect = this.fxLayer.parentElement.getBoundingClientRect();
    
    const scoreEl = document.createElement('div');
    scoreEl.className = 'floating-score';
    scoreEl.textContent = `+${Utils.formatNumber(score)}`;
    scoreEl.style.left = `${rect.left - boardRect.left + rect.width / 2}px`;
    scoreEl.style.top = `${rect.top - boardRect.top + rect.height / 2}px`;
    scoreEl.style.transform = 'translate(-50%, -50%)';
    
    this.fxLayer.appendChild(scoreEl);
    
    // Remove after animation
    setTimeout(() => {
      if (scoreEl.parentElement) {
        scoreEl.parentElement.removeChild(scoreEl);
      }
    }, 1000);
  },

  /**
   * Create particle burst effect
   */
  createParticles(row, col, count = 6) {
    if (!this.settings.particles) return;
    
    const cell = Utils.getCellElement(row, col);
    if (!cell) return;
    
    const rect = cell.getBoundingClientRect();
    const boardRect = this.fxLayer.parentElement.getBoundingClientRect();
    
    const centerX = rect.left - boardRect.left + rect.width / 2;
    const centerY = rect.top - boardRect.top + rect.height / 2;
    
    const candy = Board.getCandyAt(row, col);
    const color = this.getCandyColor(candy?.type);
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = 40 + Math.random() * 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.backgroundColor = color;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      this.fxLayer.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        if (particle.parentElement) {
          particle.parentElement.removeChild(particle);
        }
      }, 600);
    }
  },

  /**
   * Get color for candy type
   */
  getCandyColor(type) {
    const colors = {
      red: '#ff5252',
      blue: '#42a5f5',
      green: '#66bb6a',
      yellow: '#ffee58',
      purple: '#ab47bc',
      orange: '#ffa726'
    };
    return colors[type] || '#ffffff';
  },

  /**
   * Screen shake effect
   */
  screenShake() {
    if (!this.settings.shake) return;
    
    const container = document.getElementById('board-container');
    container.classList.add('shake');
    
    setTimeout(() => {
      container.classList.remove('shake');
    }, 300);
  },

  /**
   * Show combo indicator
   */
  showCombo(comboMultiplier) {
    const comboEl = document.getElementById('combo-indicator');
    const comboText = document.getElementById('combo-text');
    
    comboText.textContent = `COMBO x${comboMultiplier.toFixed(1)}`;
    comboEl.classList.remove('hidden');
    comboEl.classList.add('show');
    
    setTimeout(() => {
      comboEl.classList.add('hidden');
      comboEl.classList.remove('show');
    }, CONFIG.ANIMATION_COMBO_DISPLAY_DURATION);
  },

  /**
   * Animate candy match
   */
  animateMatch(row, col) {
    const candy = Utils.getCandyElement(row, col);
    if (candy) {
      candy.classList.add('matched');
      this.createParticles(row, col);
    }
  },

  /**
   * Animate candy falling
   */
  animateFall(fromRow, toRow, col, isNew = false) {
    const cell = Utils.getCellElement(toRow, col);
    if (!cell) return;
    
    const candy = cell.querySelector('.candy');
    if (!candy) return;
    
    const distance = Math.abs(toRow - fromRow);
    const duration = CONFIG.ANIMATION_FALL_DURATION_BASE * distance;
    
    candy.style.setProperty('--fall-duration', `${duration}ms`);
    
    if (isNew) {
      candy.classList.add('spawning');
      setTimeout(() => {
        candy.classList.remove('spawning');
      }, CONFIG.ANIMATION_SPAWN_DURATION);
    } else {
      candy.classList.add('falling');
      setTimeout(() => {
        candy.classList.remove('falling');
      }, duration);
    }
  },

  /**
   * Show hint for possible move
   */
  showHint(pos1, pos2) {
    const cell1 = Utils.getCellElement(pos1.row, pos1.col);
    const cell2 = Utils.getCellElement(pos2.row, pos2.col);
    
    if (cell1) cell1.classList.add('hint-pulse');
    if (cell2) cell2.classList.add('hint-pulse');
    
    setTimeout(() => {
      if (cell1) cell1.classList.remove('hint-pulse');
      if (cell2) cell2.classList.remove('hint-pulse');
    }, 2000);
  },

  /**
   * Clear all effects
   */
  clear() {
    Utils.clearElement(this.fxLayer);
  },

  /**
   * Toggle screen shake
   */
  toggleShake(enabled) {
    this.settings.shake = enabled;
  },

  /**
   * Toggle particles
   */
  toggleParticles(enabled) {
    this.settings.particles = enabled;
  }
};
