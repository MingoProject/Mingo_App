import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSocket } from "@/context/CallContext";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useRingtone } from "@/hooks/useRingtone";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { OngoingCall } from "@/dtos/SocketDTO";
export default function IncomingCallScreen() {
  const { ongoingCall, handleJoinCall, handleHangUp } = useSocket();
  const router = useRouter();
  const { playRingtone, stopRingtone } = useRingtone();

  console.log(ongoingCall, "ongoingCall");

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

    router.push({
      pathname: "/(modals)/[roomId]",
      params: { roomId },
    });

    handleJoinCall(ongoingCall);
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
    <View style={styles.container}>
      <Text style={styles.title}>📲 Cuộc gọi đến</Text>
      <Text style={styles.caller}>👤 Từ: {caller?.userId}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => accept(ongoingCall)}
        >
          <Text style={styles.buttonText}>✅ Chấp nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => reject(ongoingCall)}
        >
          <Text style={styles.buttonText}>❌ Từ chối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 16,
  },
  caller: {
    color: "#ccc",
    fontSize: 18,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  acceptButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  rejectButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
