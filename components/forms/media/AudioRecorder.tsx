import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { generateRandomNumberString } from "@/lib/utils";
import {
  CircleFillIcon,
  PauseAuidoIcon,
  PlayAudioIcon,
} from "@/components/icons/Icons";
import { useTheme } from "@/context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AudioRecorder = ({
  setSelectedMedia,
}: {
  setSelectedMedia: (uri: string, type: string, name: string) => void;
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const progress = useSharedValue(0);

  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }

      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);

      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setTimerInterval(interval);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      console.error("No recording instance found to stop.");
      return;
    }

    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          console.log("Recording URI:", uri);
          setSelectedMedia(
            uri,
            "audio",
            generateRandomNumberString(10) + ".mp3"
          );

          // Create sound from recording
          const { sound } = await recording.createNewLoadedSoundAsync();
          setSound(sound);

          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
          }

          console.log("Recording stopped successfully.");
        }
      }
    } catch (err) {
      console.error("Failed to stop recording:", err);
    } finally {
      setRecording(null);
      setIsRecording(false);
      clearInterval(timerInterval!);
    }
  };

  const playSound = async () => {
    setIsPlaying(true);
    if (sound) {
      try {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            progress.value = status.positionMillis / status.durationMillis!;
          }
        });

        await sound.playAsync();
      } catch (err) {
        console.error("Failed to play sound", err);
      }
    }
  };

  const pauseSound = async () => {
    setIsPlaying(false);
    if (sound) {
      try {
        await sound.pauseAsync();
      } catch (err) {
        console.error("Failed to pause sound", err);
      }
    }
  };

  const seekPosition = async (newPosition: number) => {
    setIsPlaying(true);
    if (sound) {
      try {
        const seekTime = (newPosition / SCREEN_WIDTH) * duration;
        await sound.setPositionAsync(seekTime);
        setPosition(seekTime);
        progress.value = seekTime / duration;
      } catch (err) {
        console.error("Failed to seek sound", err);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(progress.value * SCREEN_WIDTH, { duration: 100 }),
  }));

  return (
    <View
      className="w-full h-[300px] bg-light-510 dark:bg-dark-20 flex items-center justify-center"
      style={{ rowGap: 10 }}
    >
      <Text className={` font-helvetica-light text-18`}>
        {isRecording ? "Press again to stop record" : "Press to record"}
      </Text>
      {isRecording && (
        <View className=" w-full flex items-center">
          <Text className="text-white text-lg">
            {Math.floor(recordingTime / 60)}:
            {(recordingTime % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        className="p-4 bg-cardinal rounded-full"
      >
        {/* <Icon size={50} iconURL={IconURL.onthemic} /> */}
        <CircleFillIcon color={iconColor} />
      </TouchableOpacity>

      {sound && (
        <>
          <TouchableOpacity
            style={styles.progressContainer}
            activeOpacity={1}
            onPress={(e) => {
              const touchX = e.nativeEvent.locationX;
              seekPosition(touchX);
            }}
          >
            <Animated.View style={[styles.progressBar, animatedStyle]} />
          </TouchableOpacity>
          <View className="w-full flex-row justify-between px-4 mt-2">
            <Text className="text-white">{Math.floor(position / 1000)}s</Text>
            <Text className="text-white">{Math.floor(duration / 1000)}s</Text>
          </View>

          {isPlaying ? (
            <TouchableOpacity onPress={pauseSound}>
              <PlayAudioIcon color={iconColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={playSound}>
              <PauseAuidoIcon color={iconColor} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: "90%",
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#F57602",
  },
});

export default AudioRecorder;
