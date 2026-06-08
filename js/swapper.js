// Swap Input Handler (Mouse + Touch)

const Swapper = {
  selectedCandy: null,
  isDragging: false,
  isLocked: false,
  onSwapCallback: null,

  /**
   * Initialize swapper
   */
  init(onSwapCallback) {
    this.onSwapCallback = onSwapCallback;
    this.setupEventListeners();
  },

  /**
   * Setup event listeners for both mouse and touch
   */
  setupEventListeners() {
    const board = document.getElementById('board');
    
    // Mouse events
    board.addEventListener('mousedown', (e) => this.handleStart(e));
    board.addEventListener('mousemove', (e) => this.handleMove(e));
    board.addEventListener('mouseup', (e) => this.handleEnd(e));
    board.addEventListener('mouseleave', (e) => this.handleEnd(e));
    
    // Touch events
    board.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    board.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
    board.addEventListener('touchend', (e) => this.handleEnd(e));
    board.addEventListener('touchcancel', (e) => this.handleEnd(e));
  },

  /**
   * Handle start of interaction
   */
  handleStart(e) {
    if (this.isLocked) return;
    
    e.preventDefault();
    const candy = this.getCandyFromEvent(e);
    
    if (candy) {
      this.selectCandy(candy);
      this.isDragging = true;
    }
  },

  /**
   * Handle move during interaction
   */
  handleMove(e) {
    if (!this.isDragging || !this.selectedCandy || this.isLocked) return;
    
    e.preventDefault();
    const candy = this.getCandyFromEvent(e);
    
    if (candy && candy !== this.selectedCandy) {
      const cell1 = this.selectedCandy.parentElement;
      const cell2 = candy.parentElement;
      
      const pos1 = {
        row: parseInt(cell1.dataset.row),
        col: parseInt(cell1.dataset.col)
      };
      const pos2 = {
        row: parseInt(cell2.dataset.row),
        col: parseInt(cell2.dataset.col)
      };
      
      // Check if adjacent
      if (Utils.areAdjacent(pos1, pos2)) {
        this.deselectCandy();
        this.isDragging = false;
        
        // Trigger swap callback
        if (this.onSwapCallback) {
          this.onSwapCallback(pos1, pos2);
        }
      }
    }
  },

  /**
   * Handle end of interaction
   */
  handleEnd(e) {
    if (!this.isLocked) {
      this.deselectCandy();
      this.isDragging = false;
    }
  },

  /**
   * Get candy element from mouse/touch event
   */
  getCandyFromEvent(e) {
    let clientX, clientY;
    
    if (e.type.startsWith('touch')) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const element = document.elementFromPoint(clientX, clientY);
    
    if (element && element.classList.contains('candy')) {
      return element;
    }
    
    if (element && element.classList.contains('cell')) {
      return element.querySelector('.candy');
    }
    
    return null;
  },

  /**
   * Select a candy
   */
  selectCandy(candy) {
    this.deselectCandy();
    this.selectedCandy = candy;
    candy.classList.add('selected');
  },

  /**
   * Deselect current candy
   */
  deselectCandy() {
    if (this.selectedCandy) {
      this.selectedCandy.classList.remove('selected');
      this.selectedCandy = null;
    }
  },

  /**
   * Lock swapper (prevent input during animations)
   */
  lock() {
    this.isLocked = true;
    this.deselectCandy();
    this.isDragging = false;
  },

  /**
   * Unlock swapper
   */
  unlock() {
    this.isLocked = false;
  },

  /**
   * Cleanup
   */
  destroy() {
    this.deselectCandy();
    this.isDragging = false;
    this.isLocked = false;
    this.onSwapCallback = null;
  }
};
