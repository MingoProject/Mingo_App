import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { millisToMMSS } from "@/lib/utils/DateFormatter";
import { PauseAuidoIcon, PlayAudioIcon } from "@/components/shared/icons/Icons";
import { useTheme } from "@/context/ThemeContext";

const MAX_PROGRESS_WIDTH = 100; // Chiều rộng tối đa của progress bar

const AudioPlayer = ({
  audioUri,
  isSender,
}: {
  audioUri: string;
  isSender: boolean;
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const progress = useSharedValue(0);

  useEffect(() => {
    const loadNewAudio = async () => {
      if (sound) {
        await sound.unloadAsync();
      }
      loadAudio();
    };

    loadNewAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  const loadAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUri,
      });
      setSound(newSound);

      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0); // Lưu tổng thời gian
        setPosition(0); // Đặt vị trí ban đầu
        setIsFinished(false);
      }

      // Cập nhật trạng thái âm thanh
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0); // Cập nhật vị trí hiện tại
          const currentProgress =
            (status.positionMillis || 0) / (status.durationMillis || 1);
          progress.value = withSpring(currentProgress, {
            damping: 20,
            stiffness: 50,
            mass: 10,
          });

          // Nếu phát xong
          if ("didJustFinish" in status && status.didJustFinish) {
            setIsPlaying(false);
            setIsFinished(true);
            progress.value = 1; // Dừng thanh tiến trình tại vị trí cuối
          }
        }
      });
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  const playSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();

        // Khi âm thanh kết thúc, nhấn replay để phát lại từ đầu
        if (isFinished || ("didJustFinish" in status && status.didJustFinish)) {
          await sound.setPositionAsync(0); // Đặt lại vị trí về 0
          setIsFinished(false);
          progress.value = 0; // Đặt lại thanh tiến trình về đầu
        }

        setIsPlaying(true);
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  const pauseSound = async () => {
    if (sound) {
      try {
        setIsPlaying(false);
        await sound.pauseAsync();
      } catch (error) {
        console.error("Error pausing sound:", error);
      }
    }
  };

  const seekPosition = async (newPosition: number) => {
    if (sound) {
      try {
        const seekTime = (newPosition / MAX_PROGRESS_WIDTH) * duration;
        await sound.setPositionAsync(seekTime);
        setPosition(seekTime);
        progress.value = withSpring(seekTime / duration, {
          damping: 20,
          stiffness: 70,
        });

        const status = await sound.getStatusAsync();
        if ("didJustFinish" in status && status.didJustFinish) {
          setIsPlaying(false);
          setIsFinished(false);
        } else {
          // Tiếp tục phát ngay sau khi tìm vị trí mới
          if (!isPlaying) {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error("Error seeking position:", error);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: progress.value * MAX_PROGRESS_WIDTH,
    backgroundColor: "#FFFFFF",
    transition: {
      easing: Easing.out(Easing.linear),
    },
  }));

  return (
    <View
      className={`w-full  ${
        isSender ? "bg-primary-100" : "bg-ios-light-340 dark:bg-ios-dark-330"
      }  rounded-3xl flex flex-row items-center`}
    >
      <View className="px-2">
        <TouchableOpacity
          onPress={isPlaying ? pauseSound : playSound}
          style={styles.playPauseButton}
        >
          <Text style={styles.playPauseIcon}>
            {isPlaying ? (
              <PlayAudioIcon color={iconColor} />
            ) : (
              <PauseAuidoIcon color={iconColor} />
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
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
      </View>
      <View className="px-2">
        <Text
          className={`text-[12px] w-10 font-helvetica-light  ${
            isSender ? "text-white" : "text-dark-320"
          }`}
        >
          {millisToMMSS(position)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: MAX_PROGRESS_WIDTH,
    height: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 5,
  },
  time: {
    width: MAX_PROGRESS_WIDTH,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "300",
    position: "absolute",
    bottom: -10,
    right: 5,
  },
  playPauseIcon: {
    color: "#fff",
    fontSize: 10,
    alignSelf: "center",
  },
  playPauseButton: {},
});

export default AudioPlayer;
