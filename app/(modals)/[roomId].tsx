import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { RTCView } from "react-native-webrtc";
import { useSocket } from "@/context/CallContext";

export default function VideoCallScreen() {
  const {
    localStream,
    remoteStream,
    handleHangUp,
    ongoingCall,
    isRemoteVideoEnabled,
    socket,
    setIsRemoteVideoEnabled,
  } = useSocket();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRemoteCameraOn, setIsRemoteCameraOn] =
    useState(isRemoteVideoEnabled);

  const { roomId } = useLocalSearchParams();

  console.log(isRemoteVideoEnabled, "isRemoteVideoEnabled");

  useEffect(() => {
    setIsRemoteCameraOn(isRemoteVideoEnabled); // Đồng bộ trạng thái từ context vào state
  }, [isRemoteVideoEnabled]);

  // // Kiểm tra và cập nhật trạng thái video của remote stream
  // Kiểm tra khi socket và remote stream thay đổi
  useEffect(() => {
    if (socket) {
      socket.on("cameraStatusChanged", (data) => {
        console.log("Nhận trạng thái camera từ đối phương:", data.isCameraOn);
        setIsRemoteVideoEnabled(data.isCameraOn); // Cập nhật trạng thái camera của đối phương
      });
    }

    // Cleanup khi component unmount
    return () => {
      if (socket) {
        socket.off("cameraStatusChanged");
      }
    };
  }, [socket, setIsRemoteVideoEnabled]);

  // Debug log để kiểm tra stream
  useEffect(() => {
    console.log("🔄 LocalStream changed:", {
      hasStream: !!localStream,
      streamId: localStream?.id,
      videoTracks: localStream?.getVideoTracks().map((track) => ({
        id: track.id,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState,
        kind: track.kind,
      })),
    });
  }, [localStream]);

  // Debug remoteStream
  useEffect(() => {
    if (remoteStream) {
      console.log("🌐 RemoteStream changed:", {
        streamId: remoteStream.id,
        videoTracks: remoteStream.getVideoTracks().map((track) => ({
          id: track.id,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          kind: track.kind,
        })),
      });
    }
  }, [remoteStream]);

  // Toggle mic state
  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const newState = !audioTracks[0].enabled;
        audioTracks[0].enabled = newState;
        setIsMicOn(newState);
        console.log("🎤 Mic toggled:", newState);
      }
    }
  }, [localStream]);

  // Toggle camera state
  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        console.log("Camera toggled:", videoTrack.enabled);
      }
    }
  };

  // Kết thúc cuộc gọi
  const onHangUp = () => {
    console.log("📞 Hanging up call");
    handleHangUp({
      ongoingCall: ongoingCall || undefined,
      isEmitHangUp: true,
    });
  };

  console.log(
    "remote:",
    remoteStream,
    "local:",
    localStream,
    "so sanh remote luc hien thi"
  );

  const remoteStreamURL = remoteStream?.toURL();
  const localStreamURL = localStream?.toURL();
  console.log("Remote stream URL:", remoteStreamURL);
  console.log("Local stream URL:", localStreamURL);

  const shouldShowRemoteVideo = remoteStream && isRemoteVideoEnabled;

  useEffect(() => {
    console.log("Remote Stream:", remoteStream);
    console.log("isRemoteVideoEnabled:", isRemoteVideoEnabled);
    console.log("shouldShowRemoteVideo:", shouldShowRemoteVideo);
  }, [remoteStream, isRemoteVideoEnabled]);

  // Render video chỉ khi có stream hợp lệ
  const renderRemoteVideo = () => {
    if (remoteStream) {
      return (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
          zOrder={0}
        />
      );
    } else {
      return (
        <View style={styles.blackRemoteVideo}>
          <Text style={styles.videoDisabledText}>Đối phương đã tắt camera</Text>
        </View>
      );
    }
  };

  const renderLocalVideo = () => {
    if (isCameraOn && localStream) {
      return (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
          mirror
          zOrder={1}
        />
      );
    } else {
      return (
        <View style={styles.blackLocalVideo}>
          <Text style={styles.localVideoDisabledText}>Đã tắt camera</Text>
        </View>
      );
    }
  };

  // if (!localStream) {
  //   return null; // Không render nếu không có local stream
  // }

  return (
    <View style={styles.container}>
      {/* Remote Video */}
      {renderRemoteVideo()}

      {/* Local Video */}
      <View style={styles.localVideoContainer}>{renderLocalVideo()}</View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={toggleMic} style={styles.controlButton}>
          <Text style={styles.controlText}>
            {isMicOn ? "🔇 Tắt Mic" : "🎤 Bật Mic"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCamera} style={styles.controlButton}>
          <Text style={styles.controlText}>
            {isCameraOn ? "📷 Tắt Cam" : "📸 Bật Cam"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onHangUp} style={styles.hangupButton}>
          <Text style={styles.hangupText}>❌ Kết thúc {roomId}</Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          📷 Cam đối phương: {isRemoteCameraOn ? "Bật" : "Tắt"}
        </Text>
        <Text style={styles.statusText}>
          🌐 Remote Stream: {remoteStream ? "Có" : "Không"}
        </Text>
        <Text style={styles.statusText}>
          📹 Video Tracks: {remoteStream?.getVideoTracks().length || 0}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  localVideoContainer: { flex: 1, justifyContent: "center" },
  remoteVideo: { width: "100%", height: "100%" },
  blackRemoteVideo: { flex: 1, justifyContent: "center", alignItems: "center" },
  blackLocalVideo: { flex: 1, justifyContent: "center", alignItems: "center" },
  localVideo: {
    width: 150,
    height: 200,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlButton: { padding: 10, backgroundColor: "#FFF", borderRadius: 10 },
  controlText: { fontSize: 14 },
  hangupButton: { padding: 10, backgroundColor: "#FF0000", borderRadius: 10 },
  hangupText: { fontSize: 14, color: "#FFF" },
  statusBar: { position: "absolute", top: 20, left: 10, color: "#FFF" },
  statusText: { fontSize: 12, color: "#FFF" },
  videoDisabledText: { color: "#FFF", fontSize: 16 },
  localVideoDisabledText: { color: "#FFF", fontSize: 16 },
});
