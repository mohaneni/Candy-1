// Audio Manager

const AudioManager = {
  sounds: {},
  settings: {
    sfxEnabled: true,
    musicEnabled: true
  },

  /**
   * Initialize audio system
   */
  init() {
    // Load settings from storage
    const savedSettings = Storage.getSettings();
    this.settings.sfxEnabled = savedSettings.sfx;
    this.settings.musicEnabled = savedSettings.music;

    // Create audio elements (placeholder stubs)
    this.sounds = {
      bgm: this.createAudio('assets/sounds/bgm.mp3'),
      swap: this.createAudio('assets/sounds/swap.mp3'),
      match: this.createAudio('assets/sounds/match.mp3'),
      combo: this.createAudio('assets/sounds/combo.mp3'),
      explosion: this.createAudio('assets/sounds/explosion.mp3'),
      win: this.createAudio('assets/sounds/win.mp3')
    };
  },

  /**
   * Create an audio element
   */
  createAudio(src) {
    const audio = new Audio();
    audio.src = src;
    audio.preload = 'auto';
    
    // Handle errors silently (files might not exist)
    audio.addEventListener('error', () => {
      // Silently fail - placeholder audio
    });
    
    return audio;
  },

  /**
   * Play a sound effect
   */
  play(soundName) {
    if (!this.settings.sfxEnabled && soundName !== 'bgm') return;
    if (!this.settings.musicEnabled && soundName === 'bgm') return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Silently fail - auto-play might be blocked or file missing
      });
    }
  },

  /**
   * Stop a sound
   */
  stop(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  },

  /**
   * Toggle sound effects
   */
  toggleSFX(enabled) {
    this.settings.sfxEnabled = enabled;
  },

  /**
   * Toggle music
   */
  toggleMusic(enabled) {
    this.settings.musicEnabled = enabled;
    if (!enabled) {
      this.stop('bgm');
    }
  },

  /**
   * Play background music (looping)
   */
  playBGM() {
    if (this.settings.musicEnabled) {
      const bgm = this.sounds.bgm;
      if (bgm) {
        bgm.loop = true;
        bgm.volume = 0.3;
        bgm.play().catch(() => {
          // Silently fail
        });
      }
    }
  }
};
