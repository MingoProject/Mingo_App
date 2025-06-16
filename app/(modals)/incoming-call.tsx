import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useSocket } from "@/context/CallContext";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRingtone } from "@/hooks/useRingtone";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { OngoingCall } from "@/dtos/SocketDTO";

export default function IncomingCallScreen() {
  const { ongoingCall, setOngoingCall, handleHangUp } = useSocket();
  const router = useRouter();
  const { playRingtone, stopRingtone } = useRingtone();
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const setupAudio = async () => {
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
        console.error("Audio mode setup failed", e);
      }
    };
    setupAudio();
  }, []);

  useEffect(() => {
    let ringtoneStarted = false;

    const play = async () => {
      await playRingtone();
      ringtoneStarted = true;
    };

    play();

    return () => {
      if (ringtoneStarted) {
        stopRingtone();
      }
    };
  }, []);

  const accept = (ongoingCall: OngoingCall) => {
    if (!ongoingCall) return;
    stopRingtone();
    const roomId = ongoingCall.participants.caller.socketId;
    console.log(ongoingCall, "ongoingCalllll");

    setOngoingCall({ ...ongoingCall, isRinging: false });
    router.push({
      pathname: "/(modals)/[roomId]",
      params: {
        roomId,
        isVideoCall: ongoingCall.isVideoCall ? "true" : "false",
      }, // Sử dụng cùng roomId
    });
  };
  const reject = (ongoingCall: OngoingCall) => {
    if (!ongoingCall) return;
    stopRingtone();
    handleHangUp({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangUp: true,
    });
  };

  const caller = ongoingCall?.participants?.caller;

  if (!ongoingCall?.isRinging) return null;
  return (
    <ImageBackground
      source={{ uri: caller?.profile.avatar }} // Sử dụng avatar làm nền
      style={styles.container}
    >
      {/* Nội dung cuộc gọi */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Cuộc gọi đến</Text>
        <Text style={styles.caller}>
          {`${caller?.profile.firstName} ${caller?.profile.lastName}`}
        </Text>
      </View>

      {/* Nút chấp nhận và từ chối ở dưới, mỗi bên một nút */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => accept(ongoingCall)}
        >
          <Text style={styles.buttonText}>Chấp nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => reject(ongoingCall)}
        >
          <Text style={styles.buttonText}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Đảm bảo nội dung được phân bổ hợp lý
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000", // fallback color in case the background image fails
  },
  topContainer: {
    alignItems: "center",
    marginTop: 50, // Đưa tiêu đề và tên người gọi lên phía trên
  },
  title: {
    color: "#fff",
    fontSize: 28, // Tăng kích thước font cho tiêu đề
    marginBottom: 16,
    fontWeight: "bold", // Tăng độ đậm
  },
  caller: {
    color: "#fff", // Sử dụng màu sáng hơn để nổi bật
    fontSize: 22, // Tăng kích thước font cho tên người gọi
    marginBottom: 40,
    fontWeight: "400", // Làm chữ đậm
    textShadowColor: "#000", // Thêm bóng cho chữ
  },
  buttonContainer: {
    flexDirection: "row", // Sắp xếp các nút theo hàng ngang
    justifyContent: "space-between", // Mỗi nút sẽ chiếm một bên
    width: "100%", // Đảm bảo chiều rộng đầy đủ
    paddingHorizontal: 30, // Giãn cách cho các nút
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 30,
    flex: 1, // Đảm bảo nút chiếm đều không gian
  },
  acceptButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center", // Đảm bảo text nằm giữa nút
  },
});
