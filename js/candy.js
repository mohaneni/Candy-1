// Candy Management

const Candy = {
  /**
   * Create a new candy data object
   */
  create(type, row, col, special = null) {
    return {
      type,
      row,
      col,
      special, // null, 'striped-h', 'striped-v', 'wrapped', 'bomb'
      id: `candy-${row}-${col}-${Date.now()}`
    };
  },

  /**
   * Create a candy DOM element
   */
  createElement(candyData) {
    const candy = document.createElement('div');
    candy.className = `candy candy-${candyData.type}`;
    candy.dataset.type = candyData.type;
    candy.dataset.id = candyData.id;
    
    // Add special candy classes
    if (candyData.special) {
      candy.classList.add(`candy-${candyData.special}`);
      candy.dataset.special = candyData.special;
    }
    
    // Set emoji content
    const emoji = CONFIG.CANDY_EMOJIS[candyData.type];
    
    // Special bomb candy
    if (candyData.special === 'bomb') {
      candy.textContent = '💣';
    } else {
      candy.textContent = emoji;
    }
    
    return candy;
  },

  /**
   * Generate a random candy type from available types
   */
  randomType(availableTypes) {
    return Utils.randomElement(availableTypes);
  },

  /**
   * Check if candy is special
   */
  isSpecial(candy) {
    return candy.special !== null && candy.special !== undefined;
  },

  /**
   * Determine special candy type based on match pattern
   */
  determineSpecialType(matchedCells, swapPosition = null) {
    const matchLength = matchedCells.length;
    
    // Match 5 or more = Bomb
    if (matchLength >= CONFIG.SPECIAL_BOMB_MATCH) {
      return 'bomb';
    }
    
    // Match 4 = Striped (direction based on match orientation)
    if (matchLength === CONFIG.SPECIAL_STRIPED_MATCH) {
      const isHorizontal = this.isHorizontalMatch(matchedCells);
      return isHorizontal ? 'striped-h' : 'striped-v';
    }
    
    // L or T shape = Wrapped
    if (this.isLOrTShape(matchedCells)) {
      return 'wrapped';
    }
    
    return null;
  },

  /**
   * Check if match is horizontal
   */
  isHorizontalMatch(cells) {
    if (cells.length < 2) return false;
    const firstRow = cells[0].row;
    return cells.every(cell => cell.row === firstRow);
  },

  /**
   * Check if match is vertical
   */
  isVerticalMatch(cells) {
    if (cells.length < 2) return false;
    const firstCol = cells[0].col;
    return cells.every(cell => cell.col === firstCol);
  },

  /**
   * Check if match forms L or T shape
   */
  isLOrTShape(cells) {
    if (cells.length < 5) return false;
    
    // Get unique rows and columns
    const rows = [...new Set(cells.map(c => c.row))];
    const cols = [...new Set(cells.map(c => c.col))];
    
    // L or T shape has cells in both directions
    const hasHorizontalLine = rows.some(row => 
      cells.filter(c => c.row === row).length >= 3
    );
    const hasVerticalLine = cols.some(col => 
      cells.filter(c => c.col === col).length >= 3
    );
    
    return hasHorizontalLine && hasVerticalLine;
  },

  /**
   * Get the position where special candy should be created
   */
  getSpecialCandyPosition(matchedCells, swapPosition = null) {
    // If swapped position is in match, create special there
    if (swapPosition) {
      const inMatch = matchedCells.find(c => 
        c.row === swapPosition.row && c.col === swapPosition.col
      );
      if (inMatch) return swapPosition;
    }
    
    // Otherwise, use center of match
    const centerIndex = Math.floor(matchedCells.length / 2);
    return matchedCells[centerIndex];
  }
};
