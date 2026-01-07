import { useCallback, useEffect, useState } from "react";

export function useNotificationSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem("notification-sound-enabled");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("notification-sound-enabled", String(soundEnabled));
  }, [soundEnabled]);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant chime sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Pleasant notification frequency
      oscillator.frequency.setValueAtTime(830, audioContext.currentTime); // G#5
      oscillator.type = "sine";
      
      // Gentle fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);

      // Second tone for a pleasant chime effect
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.setValueAtTime(1046, audioContext.currentTime + 0.1); // C6
      oscillator2.type = "sine";
      
      gainNode2.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
      gainNode2.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.15);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator2.start(audioContext.currentTime + 0.1);
      oscillator2.stop(audioContext.currentTime + 0.5);

      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 600);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playNotificationSound,
  };
}
