// components/CallScreen.tsx
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { RTCView } from "react-native-webrtc";
import { useCall } from "@/context/CallContext";

export default function CallScreen() {
  const { localStream, remoteStream, hangUp } = useCall();

  return (
    <View style={styles.container}>
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remote} />
      )}
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.local} />
      )}
      <Button title="Hang Up" onPress={hangUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  remote: { flex: 1, backgroundColor: "black" },
  local: {
    width: 120,
    height: 160,
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
});
