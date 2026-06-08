// Utility Functions

const Utils = {
  /**
   * Get a random integer between min and max (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Get a random element from an array
   */
  randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * Delay execution for specified milliseconds
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Format a number with commas (e.g., 1000 -> 1,000)
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Clamp a value between min and max
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Linear interpolation between two values
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * Check if two positions are adjacent (horizontally or vertically)
   */
  areAdjacent(pos1, pos2) {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  },

  /**
   * Get cell element from row and column
   */
  getCellElement(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  },

  /**
   * Get candy element from row and column
   */
  getCandyElement(row, col) {
    const cell = this.getCellElement(row, col);
    return cell ? cell.querySelector('.candy') : null;
  },

  /**
   * Remove all children from an element
   */
  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Add a CSS class temporarily with auto-removal
   */
  addTemporaryClass(element, className, duration) {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  },

  /**
   * Check if arrays are equal
   */
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
  },

  /**
   * Deep clone an object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Vibrate device if supported (for mobile)
   */
  vibrate(duration = 50) {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }
};
