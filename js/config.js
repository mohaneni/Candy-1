// Game Configuration and Constants

const CONFIG = {
  // Board dimensions
  COLS: 8,
  ROWS: 8,

  // Candy types and emojis
  CANDY_TYPES: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
  CANDY_EMOJIS: {
    red: '🔴',
    blue: '🔵',
    green: '🟢',
    yellow: '🟡',
    purple: '🟣',
    orange: '🟠'
  },

  // Scoring
  MATCH3_SCORE: 60,
  MATCH4_SCORE: 120,
  MATCH5_SCORE: 200,
  COMBO_MULTIPLIER_INCREMENT: 0.5,
  MAX_COMBO_MULTIPLIER: 5,

  // Animation timings (milliseconds)
  ANIMATION_FALL_DURATION_BASE: 80,
  ANIMATION_FALL_DURATION_STAGGER: 50,
  ANIMATION_MATCH_DURATION: 350,
  ANIMATION_SPAWN_DURATION: 250,
  ANIMATION_COMBO_DISPLAY_DURATION: 800,
  ANIMATION_HINT_DELAY: 5000,

  // Special candies
  SPECIAL_STRIPED_MATCH: 4,
  SPECIAL_WRAPPED_MATCH: 'L',
  SPECIAL_BOMB_MATCH: 5,
  WRAPPED_EXPLOSION_RADIUS: 1,
  BOMB_CLEARS_COLOR: true,

  // Level definitions
  LEVELS: [
    {
      id: 1,
      name: 'Sweet Start',
      cols: 8,
      rows: 8,
      moves: 30,
      objectives: [
        { type: 'score', target: 3000, label: '3,000 pts', current: 0 }
      ],
      starThresholds: [1000, 2000, 3000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple']
    },
    {
      id: 2,
      name: 'Blueberry Fields',
      cols: 8,
      rows: 8,
      moves: 25,
      objectives: [
        { type: 'score', target: 5000, label: '5,000 pts', current: 0 },
        { type: 'collect', candy: 'blue', target: 15, label: '15 🔵', current: 0 }
      ],
      starThresholds: [2000, 3500, 5000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 3,
      name: 'Rainbow Rush',
      cols: 8,
      rows: 8,
      moves: 20,
      objectives: [
        { type: 'score', target: 8000, label: '8,000 pts', current: 0 },
        { type: 'collect', candy: 'red', target: 20, label: '20 🔴', current: 0 },
        { type: 'collect', candy: 'yellow', target: 20, label: '20 🟡', current: 0 }
      ],
      starThresholds: [3000, 6000, 8000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 4,
      name: 'Citrus Squeeze',
      cols: 8,
      rows: 8,
      moves: 18,
      objectives: [
        { type: 'score', target: 10000, label: '10,000 pts', current: 0 },
        { type: 'collect', candy: 'orange', target: 25, label: '25 🟠', current: 0 }
      ],
      starThresholds: [4000, 7000, 10000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 5,
      name: 'Striped Challenge',
      cols: 8,
      rows: 8,
      moves: 20,
      objectives: [
        { type: 'score', target: 12000, label: '12,000 pts', current: 0 },
        { type: 'special', specialType: 'striped', target: 5, label: '5 Striped', current: 0 }
      ],
      starThresholds: [5000, 8500, 12000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 6,
      name: 'Triple Threat',
      cols: 8,
      rows: 8,
      moves: 15,
      objectives: [
        { type: 'score', target: 15000, label: '15,000 pts', current: 0 },
        { type: 'collect', candy: 'green', target: 30, label: '30 🟢', current: 0 },
        { type: 'collect', candy: 'purple', target: 30, label: '30 🟣', current: 0 }
      ],
      starThresholds: [6000, 10000, 15000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 7,
      name: 'Mega Mix',
      cols: 8,
      rows: 8,
      moves: 22,
      objectives: [
        { type: 'score', target: 18000, label: '18,000 pts', current: 0 },
        { type: 'collect', candy: 'red', target: 35, label: '35 🔴', current: 0 }
      ],
      starThresholds: [7000, 12000, 18000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 8,
      name: 'Wrapped Wonder',
      cols: 8,
      rows: 8,
      moves: 18,
      objectives: [
        { type: 'score', target: 20000, label: '20,000 pts', current: 0 },
        { type: 'special', specialType: 'wrapped', target: 3, label: '3 Wrapped', current: 0 }
      ],
      starThresholds: [8000, 14000, 20000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 9,
      name: 'Bomb Squad',
      cols: 8,
      rows: 8,
      moves: 16,
      objectives: [
        { type: 'score', target: 25000, label: '25,000 pts', current: 0 },
        { type: 'special', specialType: 'bomb', target: 2, label: '2 Bombs', current: 0 }
      ],
      starThresholds: [10000, 17000, 25000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    },
    {
      id: 10,
      name: 'Sugar Rush Supreme',
      cols: 8,
      rows: 8,
      moves: 20,
      objectives: [
        { type: 'score', target: 35000, label: '35,000 pts', current: 0 },
        { type: 'collect', candy: 'red', target: 40, label: '40 🔴', current: 0 },
        { type: 'collect', candy: 'blue', target: 40, label: '40 🔵', current: 0 }
      ],
      starThresholds: [15000, 25000, 35000],
      candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    }
  ]
};
