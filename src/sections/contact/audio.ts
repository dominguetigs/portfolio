interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const playThankYouSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      ((window as WindowWithAudioContext)
        .webkitAudioContext as typeof AudioContext);

    if (!AudioContextClass) {
      console.warn('Web Audio API does not support this browser');
      return;
    }

    const audioCtx = new AudioContextClass();

    const masterVolume = 0.12;

    const notes = [
      { freq: 392.0, duration: 0.15, when: 0.0 }, // G4
      { freq: 523.25, duration: 0.25, when: 0.15 }, // C5
      { freq: 659.25, duration: 0.3, when: 0.3 }, // E5
      { freq: 783.99, duration: 0.5, when: 0.45 }, // G5
    ];

    notes.forEach(note => {
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = note.freq;

      const attackGain = audioCtx.createGain();
      const mainGain = audioCtx.createGain();

      oscillator.connect(attackGain);
      attackGain.connect(mainGain);
      mainGain.connect(audioCtx.destination);

      const startTime = audioCtx.currentTime + note.when;
      const releaseTime = startTime + note.duration;

      mainGain.gain.value = 0;

      mainGain.gain.setValueAtTime(0, startTime);
      mainGain.gain.linearRampToValueAtTime(masterVolume, startTime + 0.04);

      mainGain.gain.linearRampToValueAtTime(
        masterVolume * 0.8,
        startTime + 0.12,
      );

      mainGain.gain.setValueAtTime(masterVolume * 0.8, releaseTime - 0.1);
      mainGain.gain.linearRampToValueAtTime(0, releaseTime);

      const vibrato = audioCtx.createOscillator();
      vibrato.frequency.value = 5 + Math.random() * 2; // 5-7 Hz vibrato

      const vibratoGain = audioCtx.createGain();
      vibratoGain.gain.value = 3;

      vibrato.connect(vibratoGain);
      vibratoGain.connect(oscillator.frequency);

      oscillator.start(startTime);
      oscillator.stop(releaseTime + 0.1);

      vibrato.start(startTime);
      vibrato.stop(releaseTime + 0.1);

      if (note.when >= 0.3) {
        const harmonic = audioCtx.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.value = note.freq * 1.5;

        const harmonicGain = audioCtx.createGain();
        harmonicGain.gain.value = 0;

        harmonic.connect(harmonicGain);
        harmonicGain.connect(audioCtx.destination);

        harmonicGain.gain.setValueAtTime(0, startTime);
        harmonicGain.gain.linearRampToValueAtTime(
          masterVolume * 0.3,
          startTime + 0.05,
        );
        harmonicGain.gain.linearRampToValueAtTime(0, releaseTime);

        harmonic.start(startTime);
        harmonic.stop(releaseTime + 0.1);
      }
    });

    setTimeout(() => {
      const shimmer = audioCtx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 1046.5; // C6

      const shimmerGain = audioCtx.createGain();
      shimmerGain.gain.value = 0;

      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioCtx.destination);

      const shimmerStart = audioCtx.currentTime;
      shimmerGain.gain.setValueAtTime(0, shimmerStart);
      shimmerGain.gain.linearRampToValueAtTime(
        masterVolume * 0.2,
        shimmerStart + 0.1,
      );
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, shimmerStart + 1.2);

      shimmer.start(shimmerStart);
      shimmer.stop(shimmerStart + 1.3);
    }, 700);
  } catch (error) {
    console.warn('Unable to play sound:', error);
  }
};
