# 🍬 Candy Blast

A fully playable, production-quality Match-3 puzzle game built with pure HTML, CSS, and Vanilla JavaScript.

## ✨ Features

- **Complete Match-3 Gameplay** - Match candies, create combos, and clear objectives
- **10 Progressive Levels** - Increasing difficulty with varied objectives
- **Special Candies** - Striped, Wrapped, and Bomb candies with unique effects
- **Combo System** - Chain matches for multiplier bonuses
- **Star Rating** - Earn up to 3 stars per level based on score
- **Objectives System** - Score targets, candy collection, and special candy goals
- **Persistent Progress** - LocalStorage saves high scores and level progress
- **Responsive Design** - Works on desktop and mobile devices
- **Touch & Mouse Support** - Drag-to-swap on all devices
- **Smooth Animations** - CSS-based animations with particle effects
- **Settings Panel** - Toggle sound, music, screen shake, and particles
- **Game Feel** - Screen shake, floating scores, and visual feedback

## 🎮 How to Play

1. **Match 3 or more** candies of the same color by swapping adjacent candies
2. **Complete objectives** before running out of moves
3. **Create special candies** by matching 4 or more candies:
   - **Match 4** in a line → Striped Candy (clears entire row/column)
   - **Match 5** in a line → Bomb Candy (clears all candies of that color)
   - **Match L/T shape** → Wrapped Candy (clears 3x3 area)
4. **Chain combos** - Let matches cascade for multiplier bonuses
5. **Earn stars** by reaching score thresholds

## 🚀 Quick Start

### Option 1: Direct Play
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Click **PLAY** to start!

### Option 2: Local Server (Recommended)
```bash
# Using Python
cd candy-blast
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000
```

## 📁 Project Structure

```
candy-blast/
├── index.html              # Entry point
├── css/
│   ├── reset.css          # CSS reset
│   ├── main.css           # Global styles
│   ├── board.css          # Game board styles
│   ├── ui.css             # HUD and UI components
│   ├── animations.css     # All keyframe animations
│   └── screens.css        # Menu and screen styles
├── js/
│   ├── main.js            # Game controller
│   ├── config.js          # Game configuration
│   ├── board.js           # Board management
│   ├── candy.js           # Candy logic
│   ├── matcher.js         # Match detection
│   ├── solver.js          # Board solver
│   ├── swapper.js         # Input handling
│   ├── effects.js         # Visual effects
│   ├── audio.js           # Audio manager
│   ├── ui.js              # UI updates
│   ├── levels.js          # Level management
│   ├── screens.js         # Screen navigation
│   ├── storage.js         # LocalStorage
│   └── utils.js           # Helper functions
└── assets/
    ├── sounds/            # Optional audio files
    └── fonts/             # Font references
```

## 🎯 Game Mechanics

### Match Types
- **Match 3** - Base score (60 points)
- **Match 4** - Double score + Striped Candy
- **Match 5+** - Triple score + Bomb Candy
- **L/T Shape** - Creates Wrapped Candy

### Special Candies
- **Striped (Horizontal)** 🍬⚡ - Clears entire row
- **Striped (Vertical)** 🍬⚡ - Clears entire column
- **Wrapped** 🎁 - Explodes in 3x3 area
- **Bomb** 💣 - Clears all candies of matching color

### Objectives
- **Score Goals** - Reach target score
- **Collection** - Collect specific candy types
- **Special Candies** - Create striped/wrapped/bomb candies

### Combo System
- Consecutive matches increase multiplier
- Max combo: 5x multiplier
- Resets when no matches occur

## 🎨 Customization

### Modify Game Configuration
Edit `js/config.js` to change:
- Board size (rows/columns)
- Candy types and emojis
- Scoring values
- Animation timings
- Special candy rules

### Add New Levels
Add level objects to `CONFIG.LEVELS` array:
```javascript
{
  id: 11,
  name: 'Your Level Name',
  cols: 8,
  rows: 8,
  moves: 25,
  objectives: [
    { type: 'score', target: 15000, label: '15,000 pts', current: 0 }
  ],
  starThresholds: [5000, 10000, 15000],
  candyTypes: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
}
```

### Style Customization
- Colors and gradients: `css/board.css`
- UI styling: `css/ui.css` and `css/main.css`
- Animations: `css/animations.css`

### Add Sound Effects
Place .mp3 files in `assets/sounds/`:
- `bgm.mp3` - Background music
- `swap.mp3` - Swap sound
- `match.mp3` - Match sound
- `combo.mp3` - Combo sound
- `explosion.mp3` - Explosion sound
- `win.mp3` - Win sound

## 🛠️ Technical Details

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage enabled (for saving progress)

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- DOM-based rendering (CSS Grid + transforms)
- GPU-accelerated animations
- No external dependencies
- ~50KB total size (excluding sounds)

## 🐛 Known Limitations

- Sound files are placeholders (add your own .mp3 files)
- No backend/multiplayer features
- Limited to 10 levels (easily expandable)
- LocalStorage limited to ~5-10MB

## 📝 License

This project is provided as-is for educational and entertainment purposes.

### Attribution
- Emoji candies from Unicode standard
- Google Fonts (Nunito, Fredoka One) - Open Font License

### Sound Effects
If you add sound effects, ensure they are:
- Royalty-free, or
- Properly licensed, or
- Created by you

### Suggested Sources
- [FreeSound.org](https://freesound.org/)
- [OpenGameArt.org](https://opengameart.org/)
- [Zapsplat](https://www.zapsplat.com/)

## 🎯 Future Enhancements

Potential additions:
- More levels (50+)
- Obstacles (ice, chocolate, blockers)
- Boosters and power-ups
- Leaderboards
- Achievement system
- Daily challenges
- Animation juice improvements
- Sound effect variety
- Tutorial level

## 🤝 Contributing

This is a complete standalone project. Feel free to:
- Fork and customize
- Add new features
- Create new levels
- Improve animations
- Optimize performance

## 💡 Tips for Players

1. **Plan ahead** - Look for potential special candy matches
2. **Cascades are key** - Vertical matches often create better cascades
3. **Save specials** - Don't activate special candies immediately
4. **Bottom-up** - Match candies at the bottom for better cascades
5. **Watch objectives** - Focus on level goals, not just score

## 🏆 Credits

**Game Design & Development**: AI-Generated (Production-Quality Code)  
**Game Type**: Match-3 Puzzle  
**Inspiration**: Candy Crush Saga, Bejeweled  
**Built With**: HTML5, CSS3, Vanilla JavaScript ES6+

---

**Enjoy the game! 🍬✨**

*Match. Blast. Repeat.*
