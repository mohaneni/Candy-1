// Match Detection Algorithm

const Matcher = {
  /**
   * Find all matches on the board
   */
  findAllMatches(grid) {
    const matches = [];
    const processed = new Set();
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const key = `${row},${col}`;
        if (processed.has(key)) continue;
        
        const cellMatches = this.findMatchesAt(grid, row, col);
        if (cellMatches.length >= 3) {
          matches.push(cellMatches);
          cellMatches.forEach(m => processed.add(`${m.row},${m.col}`));
        }
      }
    }
    
    return matches;
  },

  /**
   * Find matches starting at a specific position
   */
  findMatchesAt(grid, row, col) {
    const candy = grid[row][col];
    if (!candy) return [];
    
    const horizontalMatches = this.findHorizontalMatches(grid, row, col);
    const verticalMatches = this.findVerticalMatches(grid, row, col);
    
    // Combine matches (remove duplicates)
    const allMatches = [...horizontalMatches];
    verticalMatches.forEach(vm => {
      if (!allMatches.find(m => m.row === vm.row && m.col === vm.col)) {
        allMatches.push(vm);
      }
    });
    
    return allMatches.length >= 3 ? allMatches : [];
  },

  /**
   * Find horizontal matches
   */
  findHorizontalMatches(grid, row, col) {
    const candy = grid[row][col];
    if (!candy) return [];
    
    const matches = [{ row, col, type: candy.type }];
    const type = candy.type;
    
    // Check left
    for (let c = col - 1; c >= 0; c--) {
      const current = grid[row][c];
      if (current && current.type === type) {
        matches.push({ row, col: c, type });
      } else {
        break;
      }
    }
    
    // Check right
    for (let c = col + 1; c < grid[0].length; c++) {
      const current = grid[row][c];
      if (current && current.type === type) {
        matches.push({ row, col: c, type });
      } else {
        break;
      }
    }
    
    return matches.length >= 3 ? matches : [];
  },

  /**
   * Find vertical matches
   */
  findVerticalMatches(grid, row, col) {
    const candy = grid[row][col];
    if (!candy) return [];
    
    const matches = [{ row, col, type: candy.type }];
    const type = candy.type;
    
    // Check up
    for (let r = row - 1; r >= 0; r--) {
      const current = grid[r][col];
      if (current && current.type === type) {
        matches.push({ row: r, col, type });
      } else {
        break;
      }
    }
    
    // Check down
    for (let r = row + 1; r < grid.length; r++) {
      const current = grid[r][col];
      if (current && current.type === type) {
        matches.push({ row: r, col, type });
      } else {
        break;
      }
    }
    
    return matches.length >= 3 ? matches : [];
  },

  /**
   * Check if a swap would create matches
   */
  wouldCreateMatch(grid, pos1, pos2) {
    // Create temporary grid with swapped candies
    const tempGrid = grid.map(row => [...row]);
    const candy1 = tempGrid[pos1.row][pos1.col];
    const candy2 = tempGrid[pos2.row][pos2.col];
    
    if (!candy1 || !candy2) return false;
    
    // Swap
    tempGrid[pos1.row][pos1.col] = candy2;
    tempGrid[pos2.row][pos2.col] = candy1;
    
    // Check for matches at both positions
    const matches1 = this.findMatchesAt(tempGrid, pos1.row, pos1.col);
    const matches2 = this.findMatchesAt(tempGrid, pos2.row, pos2.col);
    
    return matches1.length >= 3 || matches2.length >= 3;
  },

  /**
   * Get all cells affected by special candy activation
   */
  getSpecialCandyEffect(grid, row, col, specialType) {
    const affectedCells = [];
    
    switch (specialType) {
      case 'striped-h':
        // Clear entire row
        for (let c = 0; c < grid[0].length; c++) {
          affectedCells.push({ row, col: c });
        }
        break;
        
      case 'striped-v':
        // Clear entire column
        for (let r = 0; r < grid.length; r++) {
          affectedCells.push({ row: r, col });
        }
        break;
        
      case 'wrapped':
        // Clear 3x3 area
        const radius = CONFIG.WRAPPED_EXPLOSION_RADIUS;
        for (let r = row - radius; r <= row + radius; r++) {
          for (let c = col - radius; c <= col + radius; c++) {
            if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
              affectedCells.push({ row: r, col: c });
            }
          }
        }
        break;
        
      case 'bomb':
        // Clear all candies of the same color
        const candy = grid[row][col];
        if (candy && CONFIG.BOMB_CLEARS_COLOR) {
          for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
              const current = grid[r][c];
              if (current && current.type === candy.type) {
                affectedCells.push({ row: r, col: c });
              }
            }
          }
        }
        break;
    }
    
    return affectedCells;
  },

  /**
   * Calculate score for matches
   */
  calculateScore(matches) {
    const matchLength = matches.length;
    
    if (matchLength >= CONFIG.SPECIAL_BOMB_MATCH) {
      return CONFIG.MATCH5_SCORE;
    } else if (matchLength === CONFIG.SPECIAL_STRIPED_MATCH) {
      return CONFIG.MATCH4_SCORE;
    } else {
      return CONFIG.MATCH3_SCORE;
    }
  }
};
