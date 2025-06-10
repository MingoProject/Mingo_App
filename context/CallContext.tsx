// context/CallContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import { io, Socket } from "socket.io-client";
import { SocketUser, OngoingCall, Participants } from "@/dtos/SocketDTO";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useAuth } from "./AuthContext";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

interface CallContextProps {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCallEnded: boolean;
  isRemoteVideoEnabled: boolean;
  handleCall: (user: SocketUser, isVideoCall: boolean) => void;
  handleJoinCall: (call: OngoingCall) => void;
  handleHangUp: (data: {
    ongoingCall?: OngoingCall;
    isEmitHangUp?: boolean;
  }) => void;
}

const CallContext = createContext<CallContextProps | null>(null);

const getBaseURL = () => {
  const isAVD = Constants.deviceName?.toLowerCase().includes("sdk");
  const host = isAVD ? "10.0.2.2" : "192.168.1.36";
  return `http://${host}:3000`;
};

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const user = profile;
  const router = useRouter();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(true);

  // Refs để tránh stale closure
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef(new MediaStream());
  // console.log(onlineUsers, "this is online user");

  const currentUser = onlineUsers?.find((u) => u.userId === user?._id);

  const requestPermissions = async () => {
    try {
      const camera = await request(PERMISSIONS.ANDROID.CAMERA);
      const mic = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

      console.log("📸 CAMERA permission:", camera);
      console.log("🎤 MIC permission:", mic);

      if (camera !== RESULTS.GRANTED || mic !== RESULTS.GRANTED) {
        console.warn("⚠️ Không đủ quyền để truy cập camera/micro");
        return false;
      }

      return true;
    } catch (err) {
      console.error("❌ Lỗi khi yêu cầu quyền:", err);
      return false;
    }
  };

  const getStream = useCallback(async () => {
    const granted = await requestPermissions();

    if (!granted) return null;

    try {
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

      const videoTracks = stream.getVideoTracks();
      console.log("✅ Lấy được local stream");
      console.log(
        "🎥 Video tracks:",
        videoTracks.map((t) => ({
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
        }))
      );

      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      console.error("❌ Lỗi khi lấy mediaDevices:", err);
      setLocalStream(null);
      localStreamRef.current = null;
      return null;
    }
  }, []);

  const createPeerConnection = useCallback(
    (stream: MediaStream, participantUser: SocketUser, isCaller: boolean) => {
      console.log(`🔧 Tạo peer connection - isCaller: ${isCaller}`);
      if (peerConnection.current) {
        console.log("⚠️ Peer connection đã tồn tại, không tạo mới");
        peerConnection.current.close();
      }
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          {
            urls: "turn:your.turn.server:3478",
            username: "user",
            credential: "pass",
          },
        ],
      }) as any;

      // Add local stream tracks
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        console.log(`➕ Added ${track.kind} track to peer connection`);
      });
      //Cach cua mta
      // const remote = new MediaStream();
      // pc.ontrack = (event: any) => {
      //   console.log("Received remote track:", event.track.kind);
      //   console.log("🚨 ontrack video received:", event.track);
      //   event.streams[0].getVideoTracks().forEach((track: any) => {
      //     console.log("🚨 ontrack video received:", {
      //       id: track.id,
      //       enabled: track.enabled,
      //       muted: track.muted,
      //       readyState: track.readyState,
      //     });

      //     track.onmute = () => {
      //       console.log("❌ Track muted:", track.id);
      //     };

      //     track.onunmute = () => {
      //       console.log("✅ Track unmuted:", track.id);
      //     };
      //   });
      //   // Thêm track vào remote stream
      //   remote.addTrack(event.track);

      //   // Kiểm tra nếu là video track
      //   if (event.track.kind === "video") {
      //     // Lắng nghe sự kiện khi track bị vô hiệu hóa
      //     event.track.onmute = () => {
      //       console.log("Remote video track muted", event.track.onmute);
      //       setIsRemoteVideoEnabled(false);
      //     };

      //     // Lắng nghe sự kiện khi track được bật lại
      //     event.track.onunmute = () => {
      //       console.log("Remote video track unmuted");
      //       setIsRemoteVideoEnabled(true);
      //     };

      //     // Kiểm tra trạng thái ban đầu của track
      //     setIsRemoteVideoEnabled(!event.track.muted);
      //     console.log(
      //       "Kiểm tra trạng thái ban đầu của track",
      //       !event.track.muted
      //     );
      //   }
      //   console.log("remote setRemoteStream", remote);
      //   setRemoteStream(remote);
      // };

      // Cach debug
      pc.ontrack = (event: any) => {
        console.log("Received remote track:", event.track.kind);
        console.log("🚨 ontrack received:", event.track);

        // Sử dụng stream từ event thay vì tạo mới
        const remoteStream = event.streams[0];

        if (event.track.kind === "video") {
          console.log("🎥 Video track received:", {
            id: event.track.id,
            enabled: event.track.enabled,
            muted: event.track.muted,
            readyState: event.track.readyState,
          });

          // Xử lý video track events
          event.track.onmute = () => {
            console.log("❌ Remote video track muted");
            setIsRemoteVideoEnabled(false);
          };

          event.track.onunmute = () => {
            console.log("✅ Remote video track unmuted");
            setIsRemoteVideoEnabled(true);
          };

          // Set trạng thái ban đầu
          setIsRemoteVideoEnabled(
            !event.track.muted && event.track.readyState === "live"
          );
          console.log(
            "Video track initial state:",
            !event.track.muted && event.track.readyState === "live"
          );
        }

        // Set remote stream từ event
        console.log("Setting remote stream from event:", remoteStream);
        setRemoteStream(remoteStream);
      };
      // Handle ICE candidates
      pc.onicecandidate = (event: any) => {
        if (event.candidate && socket && ongoingCall) {
          console.log("🧊 Gửi ICE candidate", event.candidate.toJSON());
          socket.emit("webrtcSignal", {
            sdp: event.candidate,
            ongoingCall,
            isCaller: true,
          });
        }
      };

      // Connection state monitoring
      pc.oniceconnectionstatechange = () => {
        console.log(`🔄 ICE Connection State: ${pc.iceConnectionState}`);
        if (
          pc.iceConnectionState === "disconnected" ||
          pc.iceConnectionState === "failed"
        ) {
          console.warn("⚠️ ICE connection failed");
          handleHangUp({});
        }
        if (pc.iceConnectionState === "connected") {
          console.log("✅ Kết nối ICE thành công");
          const receivers = pc.getReceivers();
          console.log(
            "Active receivers:",
            receivers.map((r: any) => ({
              track: r.track
                ? {
                    kind: r.track.kind,
                    enabled: r.track.enabled,
                    muted: r.track.muted,
                    readyState: r.track.readyState,
                  }
                : null,
            }))
          );
        }
      };

      // Save to refs and state
      peerConnection.current = pc;

      return pc;
    },
    [socket, ongoingCall]
  );

  const handleWebrtcSignal = useCallback(
    async (data: {
      sdp?: RTCSessionDescriptionInit;
      candidate?: RTCIceCandidateInit;
      ongoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      console.log("📡 Received WebRTC signal:", {
        hasSdp: !!data.sdp,
        hasCandidate: !!data.candidate,
        sdpType: data.sdp?.type,
        isCaller: data.isCaller,
        signalingState: peerConnection.current?.signalingState,
        existingPC: !!peerConnection.current,
      });

      // Nếu chưa có peer connection, tạo mới (chỉ khi nhận offer hoặc candidate)
      // if (!peerConnection.current && data.sdp?.type !== "answer") {
      //   console.log("🔧 Tạo peer connection từ WebRTC signal");

      //   if (!localStreamRef.current) {
      //     console.warn("⚠️ Không có local stream, lấy stream mới");
      //     const stream = await getStream();
      //     if (!stream) {
      //       console.error("❌ Không thể lấy local stream");
      //       return;
      //     }
      //   }

      //   const remoteUser = data.isCaller
      //     ? data.ongoingCall.participants.receiver
      //     : data.ongoingCall.participants.caller;

      //   createPeerConnection(
      //     localStreamRef.current!,
      //     remoteUser,
      //     !data.isCaller
      //   );
      // }

      // Kiểm tra và tạo peer connection nếu cần
      if (!peerConnection.current) {
        if (data.sdp?.type === "offer") {
          console.log("🔧 Tạo peer connection từ WebRTC signal (offer)");
          if (!localStreamRef.current) {
            console.warn("⚠️ Không có local stream, lấy stream mới");
            const stream = await getStream();
            if (!stream) {
              console.error("❌ Không thể lấy local stream");
              return;
            }
            localStreamRef.current = stream;
          }

          const remoteUser = data.isCaller
            ? data.ongoingCall.participants.receiver
            : data.ongoingCall.participants.caller;

          createPeerConnection(
            localStreamRef.current,
            remoteUser,
            !data.isCaller
          );
        } else {
          console.warn(
            "⚠️ Nhận signal nhưng không có peer connection và không phải offer"
          );
          return;
        }
      }

      const pc = peerConnection.current;
      if (!pc) {
        console.error("❌ Peer connection vẫn null sau khi tạo");
        return;
      }

      try {
        // Xử lý SDP
        if (data.sdp && data.sdp.sdp) {
          if (data.sdp.type === "offer") {
            console.log("📥 Xử lý offer");

            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            console.log("📤 Gửi answer");
            socket?.emit("webrtcSignal", {
              sdp: answer,
              ongoingCall: data.ongoingCall,
              isCaller: false,
            });
          } else if (data.sdp.type === "answer") {
            if (pc.signalingState === "have-local-offer") {
              console.log("📥 Xử lý answer");
              await pc.setRemoteDescription(
                new RTCSessionDescription(data.sdp)
              );
            }
          }
        }

        // Xử lý ICE candidate
        if (data.candidate) {
          console.log("🧊 Thêm ICE candidate", data.candidate);
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (err) {
            console.error("Lỗi khi thêm ICE candidate:", err);
          }
        }
      } catch (err) {
        console.error("❌ Lỗi xử lý WebRTC signal:", err);
      }
    },
    [socket, getStream, createPeerConnection]
  );

  const handleCall = useCallback(
    async (receiver: SocketUser, isVideoCall: boolean) => {
      console.log("📞 Bắt đầu cuộc gọi");
      setIsCallEnded(false);

      if (!currentUser || !socket) {
        console.log("❌ Thiếu currentUser hoặc socket");
        return;
      }

      const stream = await getStream();
      if (!stream) {
        console.log("❌ Không lấy được stream");
        return;
      }

      const participants = { caller: currentUser, receiver };
      const newCall = {
        participants,
        isRinging: false,
        isVideoCall: isVideoCall,
      };

      setOngoingCall(newCall);

      // Tạo peer connection cho caller
      const pc = createPeerConnection(stream, receiver, true);

      try {
        // Tạo offer
        const offer = await pc.createOffer({});
        await pc.setLocalDescription(offer);

        console.log("📤 Gửi offer");

        // Emit call event
        socket.emit("call", participants, isVideoCall);

        // Gửi offer qua WebRTC signal
        socket.emit("webrtcSignal", {
          sdp: offer,
          ongoingCall: newCall,
          isCaller: true,
        });
      } catch (err) {
        console.error("❌ Lỗi tạo offer:", err);
      }
    },
    [socket, currentUser, getStream, createPeerConnection]
  );

  const onIncomingCall = useCallback(
    (participants: Participants, isVideoCall: boolean) => {
      console.log("📞 Cuộc gọi đến:", participants);
      setOngoingCall({
        participants,
        isRinging: true,
        isVideoCall: isVideoCall,
      });
      router.push(`/(modals)/incoming-call`);
    },
    [router]
  );

  const handleJoinCall = useCallback(
    async (call: OngoingCall) => {
      console.log("🚀 Tham gia cuộc gọi");
      if (ongoingCall && !ongoingCall.isRinging) {
        console.log("⚠️ Already in call, skipping join");
        return;
      }

      if (!call) {
        console.error("⚠️ OngoingCall is undefined!");
        return;
      }
      setIsCallEnded(false);

      setOngoingCall({ ...call, isRinging: false });

      const stream = await getStream();
      if (!stream) {
        console.log("❌ Không lấy được stream trong handleJoinCall");
        return;
      }
      console.log("✅ Sẵn sàng nhận WebRTC signals");
      // router.push("");
    },
    [socket, currentUser]
  );

  const handleHangUp = useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmitHangUp?: boolean }) => {
      console.log("📴 Kết thúc cuộc gọi");

      if (socket && user && data?.ongoingCall && data?.isEmitHangUp) {
        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangingupId: user._id,
        });
      }

      // Cleanup peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      // Cleanup streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }

      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
      }

      peerConnection.current = null;

      setOngoingCall(null);
      setIsCallEnded(true);
      router.back();
    },
    [socket, user, remoteStream, router]
  );

  useEffect(() => {
    const newSocket = io("http://192.168.1.36:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisConnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisConnect);
    };
  }, [socket]);

  // Socket connection setup
  // useEffect(() => {
  //   if (!user) return;

  //   const newSocket = io(getBaseURL());
  //   setSocket(newSocket);

  //   newSocket.on("connect", () => {
  //     console.log("🔌 Socket connected");
  //     setIsSocketConnected(true);
  //   });

  //   newSocket.on("disconnect", () => {
  //     console.log("🔌 Socket disconnected");
  //     setIsSocketConnected(false);
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, [user]);

  // Setup online users
  //set online users

  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    // Gửi cho tất cả client
    //socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
    console.log(user, "user for add user");
    socket.emit("addNewUser", user);

    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getUser", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isSocketConnected, user]);

  //set online users
  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    // Gửi cho tất cả client
    //socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
    console.log("📤 Emit addNewUser:", user);
    socket.emit("addNewUser", user);

    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getUser", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isSocketConnected, user]);

  // Setup call events
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    console.log("🎧 Đăng ký event listeners");

    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", handleWebrtcSignal);
    socket.on("hangup", handleHangUp);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", handleWebrtcSignal);
      socket.off("hangup", handleHangUp);
    };
  }, [socket, isSocketConnected, user, onIncomingCall, handleWebrtcSignal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  // Trong component render, thêm debug
  useEffect(() => {
    if (remoteStream) {
      console.log("Remote stream updated:", {
        id: remoteStream.id,
        active: remoteStream.active,
        videoTracks: remoteStream.getVideoTracks().map((track) => ({
          id: track.id,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
        })),
        audioTracks: remoteStream.getAudioTracks().length,
      });
    }
  }, [remoteStream]);

  // Reset call ended state
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isCallEnded) {
      timeout = setTimeout(() => {
        setIsCallEnded(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isCallEnded]);

  return (
    <CallContext.Provider
      value={{
        onlineUsers,
        ongoingCall,
        localStream,
        remoteStream,
        isCallEnded,
        isRemoteVideoEnabled,
        handleCall,
        handleJoinCall,
        handleHangUp,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(CallContext);

  if (context === null) {
    throw new Error("useSocket must be within a CallContextProvider");
  }
  return context;
};
