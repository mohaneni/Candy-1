// Board Management

const Board = {
  grid: [],
  cols: CONFIG.COLS,
  rows: CONFIG.ROWS,
  candyTypes: CONFIG.CANDY_TYPES,
  element: null,

  /**
   * Initialize the board
   */
  init(cols, rows, candyTypes) {
    console.log(`Board.init called with cols=${cols}, rows=${rows}, types=`, candyTypes);
    
    this.cols = cols;
    this.rows = rows;
    this.candyTypes = candyTypes;
    this.element = document.getElementById('board');
    
    if (!this.element) {
      console.error('Board element not found!');
      return;
    }
    
    console.log('Board element found:', this.element);
    
    // Set CSS grid variables
    this.element.style.setProperty('--cols', cols);
    this.element.style.setProperty('--rows', rows);
    
    // Generate initial board
    this.generate();
    console.log('Board grid generated:', this.grid);
    
    this.render();
    console.log('Board rendered successfully');
  },

  /**
   * Generate a new board grid
   */
  generate() {
    this.grid = [];
    
    // Generate until we have a valid board
    let attempts = 0;
    do {
      this.grid = this.createRandomGrid();
      attempts++;
    } while (this.hasMatches() && attempts < 100);
    
    // If still has matches after 100 attempts, clear them
    if (this.hasMatches()) {
      this.removeInitialMatches();
    }
  },

  /**
   * Create a random grid
   */
  createRandomGrid() {
    const grid = [];
    for (let row = 0; row < this.rows; row++) {
      grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const type = Candy.randomType(this.candyTypes);
        grid[row][col] = Candy.create(type, row, col);
      }
    }
    return grid;
  },

  /**
   * Remove initial matches by replacing candies
   */
  removeInitialMatches() {
    let hasMatches = true;
    let attempts = 0;
    
    while (hasMatches && attempts < 50) {
      hasMatches = false;
      
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const candy = this.grid[row][col];
          const matches = Matcher.findMatchesAt(this.grid, row, col);
          
          if (matches.length >= 3) {
            // Replace with different type
            let newType;
            do {
              newType = Candy.randomType(this.candyTypes);
            } while (newType === candy.type);
            
            this.grid[row][col] = Candy.create(newType, row, col);
            hasMatches = true;
          }
        }
      }
      
      attempts++;
    }
  },

  /**
   * Check if board has any matches
   */
  hasMatches() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const matches = Matcher.findMatchesAt(this.grid, row, col);
        if (matches.length >= 3) {
          return true;
        }
      }
    }
    return false;
  },

  /**
   * Render the entire board to DOM
   */
  render() {
    Utils.clearElement(this.element);
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        // Create cell
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Create candy
        const candyData = this.grid[row][col];
        const candy = Candy.createElement(candyData);
        
        cell.appendChild(candy);
        this.element.appendChild(cell);
      }
    }
  },

  /**
   * Get candy at position
   */
  getCandyAt(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return null;
    }
    return this.grid[row][col];
  },

  /**
   * Set candy at position
   */
  setCandyAt(row, col, candy) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return;
    }
    candy.row = row;
    candy.col = col;
    this.grid[row][col] = candy;
  },

  /**
   * Swap two candies in the grid
   */
  swap(pos1, pos2) {
    const candy1 = this.getCandyAt(pos1.row, pos1.col);
    const candy2 = this.getCandyAt(pos2.row, pos2.col);
    
    if (!candy1 || !candy2) return;
    
    this.setCandyAt(pos1.row, pos1.col, candy2);
    this.setCandyAt(pos2.row, pos2.col, candy1);
  },

  /**
   * Remove candies from board
   */
  removeCandies(positions) {
    positions.forEach(pos => {
      this.grid[pos.row][pos.col] = null;
    });
  },

  /**
   * Apply gravity and fill empty spaces
   */
  applyGravity() {
    const moves = [];
    
    // For each column, move candies down
    for (let col = 0; col < this.cols; col++) {
      let emptyRow = this.rows - 1;
      
      // Move existing candies down
      for (let row = this.rows - 1; row >= 0; row--) {
        if (this.grid[row][col] !== null) {
          if (row !== emptyRow) {
            moves.push({
              from: { row, col },
              to: { row: emptyRow, col },
              candy: this.grid[row][col]
            });
            this.grid[emptyRow][col] = this.grid[row][col];
            this.grid[emptyRow][col].row = emptyRow;
            this.grid[row][col] = null;
          }
          emptyRow--;
        }
      }
      
      // Fill empty spaces with new candies
      for (let row = emptyRow; row >= 0; row--) {
        const type = Candy.randomType(this.candyTypes);
        const newCandy = Candy.create(type, row, col);
        this.grid[row][col] = newCandy;
        moves.push({
          from: { row: -1, col },
          to: { row, col },
          candy: newCandy,
          isNew: true
        });
      }
    }
    
    return moves;
  },

  /**
   * Check if board is in a stable state (no matches, no empty cells)
   */
  isStable() {
    // Check for empty cells
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  },

  /**
   * Clear the board
   */
  clear() {
    this.grid = [];
    Utils.clearElement(this.element);
  }
};
