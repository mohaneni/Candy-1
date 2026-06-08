// Board Solver - Ensures boards have possible moves

const Solver = {
  /**
   * Check if board has any possible moves
   */
  hasPossibleMoves(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Check all possible swaps
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Try swapping with right neighbor
        if (col < cols - 1) {
          if (Matcher.wouldCreateMatch(grid, 
            { row, col }, 
            { row, col: col + 1 }
          )) {
            return true;
          }
        }
        
        // Try swapping with bottom neighbor
        if (row < rows - 1) {
          if (Matcher.wouldCreateMatch(grid, 
            { row, col }, 
            { row: row + 1, col }
          )) {
            return true;
          }
        }
      }
    }
    
    return false;
  },

  /**
   * Find a possible move hint
   */
  findPossibleMove(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Try swapping with right neighbor
        if (col < cols - 1) {
          const pos1 = { row, col };
          const pos2 = { row, col: col + 1 };
          if (Matcher.wouldCreateMatch(grid, pos1, pos2)) {
            return { pos1, pos2 };
          }
        }
        
        // Try swapping with bottom neighbor
        if (row < rows - 1) {
          const pos1 = { row, col };
          const pos2 = { row: row + 1, col };
          if (Matcher.wouldCreateMatch(grid, pos1, pos2)) {
            return { pos1, pos2 };
          }
        }
      }
    }
    
    return null;
  },

  /**
   * Shuffle board to create new possibilities
   */
  shuffleBoard(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Collect all candies
    const candies = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col]) {
          candies.push(grid[row][col].type);
        }
      }
    }
    
    // Shuffle candies
    const shuffled = Utils.shuffle(candies);
    
    // Redistribute
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col]) {
          grid[row][col].type = shuffled[index];
          index++;
        }
      }
    }
    
    return grid;
  },

  /**
   * Ensure board is solvable
   */
  ensureSolvable(grid) {
    let attempts = 0;
    
    while (!this.hasPossibleMoves(grid) && attempts < 10) {
      this.shuffleBoard(grid);
      attempts++;
    }
    
    return grid;
  }
};
