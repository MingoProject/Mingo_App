// CallModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCall } from "@/context/CallContext";

const CallModal = () => {
  const { ongoingCall, isIncoming, handleJoinCall, hangUp } = useCall();

  if (!isIncoming || !ongoingCall) return null;

  const callerName = ongoingCall?.participants?.caller?.name || "Someone";

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>{callerName} is calling...</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleJoinCall}
            style={[styles.button, { backgroundColor: "green" }]}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={hangUp}
            style={[styles.button, { backgroundColor: "red" }]}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CallModal;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
