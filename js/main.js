// Main Game Controller

const Game = {
  state: 'idle', // idle, playing, animating, paused
  isProcessing: false,
  hintTimeout: null,

  /**
   * Initialize the game
   */
  init() {
    console.log('🍬 Candy Blast - Initializing...');
    
    // Initialize all systems
    AudioManager.init();
    UI.init();
    Effects.init();
    Screens.init();
    
    // Always show menu screen first
    Screens.show('screen-menu');
    
    console.log('✅ Game initialized! Menu should be visible.');
  },

  /**
   * Start a level
   */
  async startLevel(levelId) {
    console.log(`🎮 Starting Level ${levelId}`);
    
    // Load level data
    if (!Levels.loadLevel(levelId)) {
      console.error('Failed to load level');
      return;
    }
    
    // Initialize board
    const level = Levels.currentLevel;
    Board.init(level.cols, level.rows, level.candyTypes);
    
    // Initialize swapper
    Swapper.init((pos1, pos2) => this.handleSwap(pos1, pos2));
    
    // Set state
    this.state = 'playing';
    this.isProcessing = false;
    
    // Start hint timer
    this.startHintTimer();
    
    // Play BGM
    AudioManager.playBGM();
  },

  /**
   * Handle candy swap
   */
  async handleSwap(pos1, pos2) {
    if (this.state !== 'playing' || this.isProcessing) {
      return;
    }
    
    // Reset hint timer
    this.resetHintTimer();
    
    // Lock input
    this.isProcessing = true;
    Swapper.lock();
    
    // Check if swap creates matches
    if (!Matcher.wouldCreateMatch(Board.grid, pos1, pos2)) {
      // Invalid swap - animate back
      await this.animateInvalidSwap(pos1, pos2);
      this.isProcessing = false;
      Swapper.unlock();
      return;
    }
    
    // Valid swap
    AudioManager.play('swap');
    
    // Perform swap
    await this.performSwap(pos1, pos2);
    
    // Use a move
    const gameOver = Levels.useMove();
    if (gameOver) {
      this.isProcessing = false;
      return;
    }
    
    // Process matches cascade
    await this.processCascade();
    
    // Check win condition
    if (Levels.checkWin()) {
      this.isProcessing = false;
      return;
    }
    
    // Check if board is still playable
    if (!Solver.hasPossibleMoves(Board.grid)) {
      console.log('No possible moves - shuffling board');
      await this.shuffleBoard();
    }
    
    // Unlock input
    this.isProcessing = false;
    Swapper.unlock();
    
    // Restart hint timer
    this.startHintTimer();
  },

  /**
   * Perform swap animation
   */
  async performSwap(pos1, pos2) {
    // Swap in grid
    Board.swap(pos1, pos2);
    
    // Swap DOM elements
    const cell1 = Utils.getCellElement(pos1.row, pos1.col);
    const cell2 = Utils.getCellElement(pos2.row, pos2.col);
    const candy1 = cell1.querySelector('.candy');
    const candy2 = cell2.querySelector('.candy');
    
    // Swap DOM
    cell1.appendChild(candy2);
    cell2.appendChild(candy1);
    
    await Utils.delay(200);
  },

  /**
   * Animate invalid swap
   */
  async animateInvalidSwap(pos1, pos2) {
    // Quick swap and swap back animation
    await this.performSwap(pos1, pos2);
    await Utils.delay(100);
    await this.performSwap(pos2, pos1);
  },

  /**
   * Process cascade of matches
   */
  async processCascade() {
    let cascadeCount = 0;
    let hasMatches = true;
    
    Levels.resetCombo();
    
    while (hasMatches) {
      // Find all matches
      const allMatches = Matcher.findAllMatches(Board.grid);
      
      if (allMatches.length === 0) {
        hasMatches = false;
        break;
      }
      
      // Process each match group
      for (const matches of allMatches) {
        await this.processMatch(matches);
      }
      
      // Increment combo
      cascadeCount++;
      if (cascadeCount > 1) {
        Levels.incrementCombo();
      }
      
      // Apply gravity
      await this.applyGravity();
      
      // Small delay before checking for new matches
      await Utils.delay(100);
    }
  },

  /**
   * Process a single match
   */
  async processMatch(matches) {
    // Calculate score
    const baseScore = Matcher.calculateScore(matches);
    const matchCenter = matches[Math.floor(matches.length / 2)];
    
    // Add score
    Levels.addScore(baseScore, matchCenter.row, matchCenter.col);
    
    // Update collect objectives
    matches.forEach(match => {
      const candy = Board.getCandyAt(match.row, match.col);
      if (candy) {
        Levels.collectCandy(candy.type);
      }
    });
    
    // Check for special candy creation
    const specialType = Candy.determineSpecialType(matches);
    if (specialType) {
      const specialPos = Candy.getSpecialCandyPosition(matches);
      const candyType = Board.getCandyAt(matches[0].row, matches[0].col).type;
      
      // Create special candy
      const specialCandy = Candy.create(candyType, specialPos.row, specialPos.col, specialType);
      Board.setCandyAt(specialPos.row, specialPos.col, specialCandy);
      
      // Update objective
      Levels.createSpecialCandy(specialType);
      
      // Remove special position from matches to clear
      const matchesToClear = matches.filter(m => 
        m.row !== specialPos.row || m.col !== specialPos.col
      );
      
      // Animate matches
      for (const match of matchesToClear) {
        Effects.animateMatch(match.row, match.col);
      }
      
      // Wait for animation
      await Utils.delay(CONFIG.ANIMATION_MATCH_DURATION);
      
      // Remove matched candies (except special)
      Board.removeCandies(matchesToClear);
      
      // Update DOM for special candy
      const cell = Utils.getCellElement(specialPos.row, specialPos.col);
      if (cell) {
        Utils.clearElement(cell);
        const newCandyEl = Candy.createElement(specialCandy);
        cell.appendChild(newCandyEl);
      }
    } else {
      // Regular match - animate all
      matches.forEach(match => {
        Effects.animateMatch(match.row, match.col);
      });
      
      // Wait for animation
      await Utils.delay(CONFIG.ANIMATION_MATCH_DURATION);
      
      // Remove matched candies
      Board.removeCandies(matches);
    }
    
    // Play sound
    AudioManager.play('match');
    
    // Screen shake for larger matches
    if (matches.length >= 5) {
      Effects.screenShake();
      AudioManager.play('explosion');
    }
  },

  /**
   * Apply gravity and spawn new candies
   */
  async applyGravity() {
    const moves = Board.applyGravity();
    
    if (moves.length === 0) return;
    
    // Update DOM for all moves
    moves.forEach(move => {
      const cell = Utils.getCellElement(move.to.row, move.to.col);
      if (!cell) return;
      
      // Clear cell
      Utils.clearElement(cell);
      
      // Create new candy element
      const candyEl = Candy.createElement(move.candy);
      cell.appendChild(candyEl);
      
      // Animate
      if (move.isNew) {
        Effects.animateFall(move.from.row, move.to.row, move.to.col, true);
      } else {
        Effects.animateFall(move.from.row, move.to.row, move.to.col, false);
      }
    });
    
    // Wait for animations to complete
    const maxDistance = Math.max(...moves.map(m => Math.abs(m.to.row - m.from.row)));
    const animationTime = CONFIG.ANIMATION_FALL_DURATION_BASE * maxDistance;
    await Utils.delay(animationTime + 100);
  },

  /**
   * Shuffle board
   */
  async shuffleBoard() {
    Solver.shuffleBoard(Board.grid);
    Board.render();
    await Utils.delay(500);
  },

  /**
   * Start hint timer
   */
  startHintTimer() {
    this.clearHintTimer();
    
    this.hintTimeout = setTimeout(() => {
      if (this.state === 'playing' && !this.isProcessing) {
        const hint = Solver.findPossibleMove(Board.grid);
        if (hint) {
          Effects.showHint(hint.pos1, hint.pos2);
        }
      }
    }, CONFIG.ANIMATION_HINT_DELAY);
  },

  /**
   * Reset hint timer
   */
  resetHintTimer() {
    this.clearHintTimer();
    this.startHintTimer();
  },

  /**
   * Clear hint timer
   */
  clearHintTimer() {
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
      this.hintTimeout = null;
    }
  },

  /**
   * Pause game
   */
  pause() {
    this.state = 'paused';
    this.clearHintTimer();
    Swapper.lock();
  },

  /**
   * Resume game
   */
  resume() {
    this.state = 'playing';
    this.startHintTimer();
    Swapper.unlock();
  },

  /**
   * Restart current level
   */
  restart() {
    const levelId = Levels.currentLevel.id;
    this.cleanup();
    this.startLevel(levelId);
  },

  /**
   * Cleanup game
   */
  cleanup() {
    this.clearHintTimer();
    Swapper.destroy();
    Board.clear();
    Effects.clear();
    Levels.reset();
    UI.reset();
    this.state = 'idle';
    this.isProcessing = false;
  }
};

// Expose Game globally
window.Game = Game;

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Game.init();
  });
} else {
  Game.init();
}
