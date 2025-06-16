import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from "react-native-webrtc";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSocket } from "@/context/CallContext";
import { OngoingCall, Participants, SocketUser } from "@/dtos/SocketDTO";
import { useAuth } from "@/context/AuthContext";
import { sendMessage } from "@/lib/service/message.service";
import user from "pusher-js/types/src/core/user";
import RemoteAvatar from "@/components/forms/chat/RemoteAvatar";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

const VideoCallScreen = () => {
  const navigation = useNavigation();
  const user = useRef<any>(null);
  const { socket, onlineUsers, handleHangUp, ongoingCall } = useSocket();
  const { profile } = useAuth();
  const users = profile;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<
    "calling" | "connected" | "ended"
  >("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ongoingCallRef = useRef<{ participants: Participants } | null>(null);

  const receiverUser = onlineUsers?.find((u) => u.userId !== users._id);
  const isUser = onlineUsers?.find((u) => u.userId === users._id);
  const [callDuration, setCallDuration] = useState(0);
  const { roomId, isVideoCall, receiverAva } = useLocalSearchParams();
  const isNotCaller = users._id === ongoingCall?.participants.caller?.userId;
  console.log(isVideoCall, "isVideoCall");

  console.log(receiverAva, "receiverAva");

  // Tạo và khởi tạo kết nối peer
  const createPeer = (stream: MediaStream) => {
    console.log("Creating peer connection");
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Thêm tất cả các track từ local stream vào peer connection
    stream.getTracks().forEach((track) => {
      console.log("Adding track to peer connection:", track.kind);
      pc.addTrack(track, stream);
    });

    // Tạo remote stream mới
    const remote = new MediaStream();

    // Xử lý khi có track mới từ peer xa
    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      // Thêm track vào remote stream
      remote.addTrack(event.track);

      // Kiểm tra nếu là video track
      if (event.track.kind === "video") {
        // Lắng nghe sự kiện khi track bị vô hiệu hóa
        event.track.onmute = () => {
          console.log("Remote video track muted");
          setIsRemoteVideoEnabled(false);
        };

        // Lắng nghe sự kiện khi track được bật lại
        event.track.onunmute = () => {
          console.log("Remote video track unmuted");
          setIsRemoteVideoEnabled(true);
        };

        // Kiểm tra trạng thái ban đầu của track
        setIsRemoteVideoEnabled(!event.track.muted);
      }

      setRemoteStream(remote);
    };

    // Gửi ice candidate qua socket
    pc.onicecandidate = (event) => {
      if (event.candidate && ongoingCallRef.current) {
        console.log("Sending ICE candidate");
        socket?.emit("webrtcSignal", {
          sdp: event.candidate,
          ongoingCall: ongoingCallRef.current,
          isCaller: true,
        });
      }
    };

    // Kiểm tra trạng thái kết nối ICE
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (
        ["failed", "disconnected", "closed"].includes(pc.iceConnectionState)
      ) {
        console.log("ICE connection failed, ending call");
        endCall();
      }

      if (
        pc.iceConnectionState === "connected" ||
        pc.iceConnectionState === "completed"
      ) {
        console.log("ICE connected, call established");
        setCallStatus("connected");
      }
    };

    // Lưu peer connection vào ref
    peerConnection.current = pc;
    return remote;
  };

  // Khởi tạo media và peer connection khi component mount
  useEffect(() => {
    const setup = async () => {
      try {
        // // Lấy thông tin người dùng từ AsyncStorage
        // const data = await AsyncStorage.getItem("user");
        // if (!data) {
        //   Alert.alert("Lỗi", "Không có thông tin người dùng");
        //   navigation.goBack();
        //   return;
        // }
        user.current = users._id;

        // Lấy media stream từ camera và microphone
        console.log("Getting user media");
        const constraints = {
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            frameRate: { min: 15, ideal: 24, max: 30 },
            facingMode: "user",
          },
        };

        const stream = await mediaDevices.getUserMedia(constraints);
        console.log(
          "Got local stream with tracks:",
          stream
            .getTracks()
            .map((t) => t.kind)
            .join(", ")
        );

        setLocalStream(stream);

        // Tạo peer connection
        createPeer(stream);

        // Bắt đầu cuộc gọi
        await makeCall();
      } catch (err) {
        console.error("Setup error:", err);
        Alert.alert("Lỗi", "Không thể truy cập camera hoặc microphone");
        navigation.goBack();
      }
    };

    setup();

    // Thiết lập các listener cho socket events
    socket?.on("webrtcSignal", handleSignal);
    socket?.on("hangup", () => {
      Alert.alert("Cuộc gọi kết thúc");
      endCall();
    });

    // Thêm listener cho video state
    socket?.on("videoStateChange", (data) => {
      if (data.enabled !== undefined) {
        setIsRemoteVideoEnabled(data.enabled);
      }
    });

    // Cleanup khi component unmount
    return () => {
      cleanup();
      socket?.off("webrtcSignal", handleSignal);
      socket?.off("hangup");
      socket?.off("videoStateChange");
    };
  }, []);

  useEffect(() => {
    let timer: number; // Explicitly typing timer as number for React Native
    if (callStatus === "connected") {
      // Start timer when the call is connected
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1); // Increment time every second
      }, 1000);
    }

    return () => clearInterval(timer); // Clean up timer when component unmounts or call is disconnected
  }, [callStatus]);

  const handleSendTextMessage = async () => {
    // Tạo đối tượng SegmentMessageDTO
    const messageData = {
      boxId: ongoingCall?.boxId,
      content: `//Cuoc goi ket thuc; time: ${formatTime(callDuration)}`, // content is now a string
    };

    if (!messageData.boxId) {
      console.error("Missing required fields in message data");
      return;
    }

    const formData = new FormData();
    formData.append("boxId", messageData.boxId.toString());
    formData.append("content", JSON.stringify(messageData.content)); // Directly append the string

    // Gửi API
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) return;

      const response = await sendMessage(formData);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleSend = async () => {
    await handleSendTextMessage();
  };

  const handleEndCall = async () => {
    setCallStatus("ended");
    handleHangUp({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangUp: true,
    });
    handleSend();
    // Xử lý sự kiện reject (tắt cuộc gọi)
  };

  // Hàm thực hiện cuộc gọi
  const makeCall = async () => {
    try {
      if (!peerConnection.current) {
        console.error("No peer connection available");
        return;
      }

      const participants: Participants = {
        caller: isUser!,
        receiver: receiverUser!,
      };

      ongoingCallRef.current = { participants };

      // Tạo và gửi SDP offer
      console.log("Creating offer");
      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      console.log("Setting local description (offer)");
      await peerConnection.current.setLocalDescription(offer);

      // Gửi offer qua socket
      socket?.emit("webrtcSignal", {
        sdp: offer,
        ongoingCall: ongoingCallRef.current,
        isCaller: true,
      });

      // Đặt timeout nếu không có phản hồi
      // timeoutRef.current = setTimeout(() => {
      //   if (callStatus === 'calling') {
      //     Alert.alert('Không có phản hồi');
      //     endCall();
      //   }
      // }, 30000);
    } catch (err) {
      console.error("Make call error:", err);
      Alert.alert("Lỗi", "Không thể thực hiện cuộc gọi");
      endCall();
    }
  };

  // Xử lý tín hiệu WebRTC từ đối phương
  const handleSignal = async (data: any) => {
    try {
      console.log("Received webRTC signal:", data.sdp?.type || "ICE candidate");

      if (!peerConnection.current) {
        console.error("No peer connection available");
        return;
      }

      const { sdp, isCaller } = data;

      // Xử lý SDP offer
      if (sdp.type === "offer") {
        console.log("Setting remote description (offer)");
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );

        console.log("Creating answer");
        const answer = await peerConnection.current.createAnswer();

        console.log("Setting local description (answer)");
        await peerConnection.current.setLocalDescription(answer);

        socket?.emit("webrtcSignal", {
          sdp: answer,
          ongoingCall: data.ongoingCall,
          isCaller: false,
        });

        setCallStatus("connected");
      }
      // Xử lý SDP answer
      else if (sdp.type === "answer") {
        console.log("Setting remote description (answer)");
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
        setCallStatus("connected");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
      // Xử lý ICE candidate
      else if (sdp.candidate) {
        try {
          console.log("Adding ICE candidate");
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(sdp)
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    } catch (err) {
      console.error("Handle signal error:", err);
    }
  };

  // Bật/tắt microphone
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        console.log("Audio track enabled:", track.enabled);
      });
      setIsMuted(!isMuted);
    }
  };

  // Bật/tắt camera
  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        console.log("Video track enabled:", track.enabled);
      });

      // Cài đặt trạng thái video mới
      const newState = !isVideoEnabled;
      setIsVideoEnabled(newState);

      // Thông báo cho đối phương về trạng thái video
      if (ongoingCallRef.current && socket) {
        socket.emit("videoStateChange", {
          ongoingCall: ongoingCallRef.current,
          enabled: newState,
        });
      }
    }
  };

  // Bật/tắt loa ngoài
  const toggleSpeaker = () => {
    // Note: Implementation may require platform-specific code
    setIsSpeakerOn(!isSpeakerOn);
  };

  const switchCamera = async () => {
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      // Ép kiểu kết quả từ enumerateDevices
      const devices =
        (await mediaDevices.enumerateDevices()) as MediaDeviceInfo[];
      const videoDevices = devices.filter((d) => d.kind === "videoinput");

      const currentDeviceId = videoTrack.getSettings().deviceId;

      const newDevice = videoDevices.find(
        (d) => d.deviceId !== currentDeviceId
      );
      if (!newDevice) {
        console.warn("Không tìm thấy camera khác");
        return;
      }

      await videoTrack.applyConstraints({
        deviceId: newDevice.deviceId,
      });

      console.log("Đã chuyển camera sang:", newDevice.label);
    } catch (err) {
      console.error("Lỗi khi chuyển camera:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const endCall = async () => {
    try {
      const participants: Participants = {
        caller: isUser!,
        receiver: receiverUser!,
      };

      socket?.emit("hangup", {
        ongoingCall: {
          participants: participants,
          isRinging: false,
          isVideoCall: true,
        },
        userHangingupId: user.current._id,
      });

      cleanup();
      navigation.goBack();
    } catch (err) {
      console.error("End call error:", err);
      cleanup();
      navigation.goBack();
    }
  };

  // Dọn dẹp tài nguyên
  const cleanup = () => {
    console.log("Cleaning up resources");

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopping track:", track.kind);
      });
      setLocalStream(null);
    }

    setRemoteStream(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    socket?.off("webrtcSignal", handleSignal);
    socket?.off("hangup");
    socket?.off("videoStateChange");
  };

  return isVideoCall === "true" ? (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      {/* Remote Video Stream */}
      {remoteStream && callStatus === "connected" ? (
        isRemoteVideoEnabled ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
            zOrder={0}
          />
        ) : (
          <View style={styles.blackRemoteVideo}>
            <Text style={styles.videoDisabledText}>
              Đối phương đã tắt camera
            </Text>
          </View>
        )
      ) : (
        <View style={styles.remoteVideo}>
          <Text style={styles.callingText}>
            {callStatus === "calling" ? "Đang gọi..." : "Đang kết nối..."}
          </Text>
        </View>
      )}

      {/* Local Video Stream */}
      {localStream && (
        <View style={styles.localVideoContainer}>
          {isVideoEnabled ? (
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.localVideo}
              objectFit="cover"
              mirror
              zOrder={1}
            />
          ) : (
            <View style={styles.blackLocalVideo}>
              <Text style={styles.localVideoDisabledText}>Đã tắt camera</Text>
            </View>
          )}
        </View>
      )}

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMic} style={styles.controlButton}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEndCall()}
          style={[styles.controlButton, styles.endCall]}
        >
          <Ionicons name="call" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCam} style={styles.controlButton}>
          <Ionicons
            name={isVideoEnabled ? "videocam" : "videocam-off"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Additional buttons */}
      <TouchableOpacity onPress={switchCamera} style={styles.speakerButton}>
        <Ionicons name="camera-reverse" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      {/* Audio Call - No Video Stream */}
      <View style={styles.audioCallBackground}>
        {/* Displaying remote avatar if needed */}
        {/* <View style={styles.remoteAvatar}>
          <Image
            source={{ uri: ongoingCall?.participants.caller?.profile.avatar }}
            style={styles.avatarImage}
          />
        </View> */}

        <RemoteAvatar
          users={users}
          ongoingCall={ongoingCall}
          receiverAva={receiverAva}
        />

        {/* Display Call Duration */}
        <Text style={styles.callDuration}>
          {formatTime(callDuration)} {/* Display the formatted time */}
        </Text>
      </View>

      {/* End Call button */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => handleEndCall()}
          style={[styles.controlButton, styles.endCall]}
        >
          <Ionicons name="call" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMic} style={styles.controlButton}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEndCall()}
          style={[styles.controlButton, styles.endCall]}
        >
          <Ionicons name="call" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name={"videocam-off"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Speaker button */}
      <TouchableOpacity onPress={toggleSpeaker} style={styles.speakerButton}>
        <Ionicons
          name={isSpeakerOn ? "volume-high" : "volume-off"}
          size={22}
          color="#fff"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  blackRemoteVideo: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideoContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 120,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#fff",
    borderWidth: 1,
  },
  localVideo: {
    width: "100%",
    height: "100%",
  },
  blackLocalVideo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingVertical: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "space-around", // Sắp xếp các nút đều trên màn hình
    alignItems: "center", // Canh giữa các nút dọc theo trục Y
  },
  controlButton: {
    padding: 15, // Tăng padding để nút dễ nhấn trên màn hình nhỏ hoặc lớn
    minWidth: 50, // Đảm bảo nút không quá nhỏ
    minHeight: 50, // Đảm bảo nút không quá nhỏ
    justifyContent: "center", // Canh giữa các biểu tượng trong nút
    alignItems: "center", // Canh giữa các biểu tượng trong nút
  },
  endCall: {
    backgroundColor: "#ff4d4d",
    borderRadius: 50,
    padding: 15,
    minWidth: 50,
    minHeight: 50,
    justifyContent: "center", // Canh giữa biểu tượng trong nút
    alignItems: "center",
  },
  speakerButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  switchCameraButton: {
    position: "absolute",
    top: 30,
    left: 70,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  callingText: {
    color: "#fff",
    fontSize: 18,
  },
  videoDisabledText: {
    color: "#fff",
    fontSize: 18,
  },
  localVideoDisabledText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  connectedIndicator: {
    position: "absolute",
    top: 30,
    alignSelf: "center",
    backgroundColor: "rgba(0,200,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  connectedText: {
    color: "#fff",
    fontSize: 14,
  },
  audioCallBackground: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  remoteAvatar: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  callDuration: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "bold",
  },

  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default VideoCallScreen;
