// hooks/useRingtone.ts
import { useRef } from "react";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";

export const useRingtone = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const setupAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.error("⚠️ Audio mode setup failed", e);
    }
  };

  const playRingtone = async () => {
    try {
      await setupAudioMode();

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/ringtone.mp3"), // Đảm bảo file hợp lệ
        { shouldPlay: true, isLooping: true }
      );

      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error("❌ Error playing ringtone:", error);
    }
  };

  const stopRingtone = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();

        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }

        soundRef.current = null;
      }
    } catch (error) {
      console.error("❌ Error stopping ringtone:", error);
    }
  };

  return { playRingtone, stopRingtone };
};
