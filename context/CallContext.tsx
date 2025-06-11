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
import { useAuth } from "./AuthContext";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

interface CallContextProps {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCallEnded: boolean;
  isRemoteVideoEnabled: boolean;
  socket: Socket;
  handleCall: (user: SocketUser, isVideoCall: boolean) => void;
  handleJoinCall: (call: OngoingCall) => void;
  handleHangUp: (data: {
    ongoingCall?: OngoingCall;
    isEmitHangUp?: boolean;
  }) => void;
  setIsRemoteVideoEnabled: (value: boolean) => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // {
    //   urls: "relay1.expressturn.com:3480",
    //   username: "000000002064936313",
    //   credential: "+9MvLtAD3qe+O8iF2JrT7C4GB3Y=",
    // }, // Thêm TURN server
  ],
};

const CallContext = createContext<CallContextProps | null>(null);

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = onlineUsers?.find((u) => u.userId === user?._id);

  console.log(remoteStream, "check remotestream");

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
          enabled: true,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { min: 15, ideal: 24, max: 30 },
          facingMode: "user",
        },
      };

      const stream = await mediaDevices.getUserMedia(constraints);

      stream.getTracks().forEach((track) => {
        track.enabled = true;
        console.log(`${track.kind} track enabled:`, track.enabled);
      });

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
    (stream: MediaStream, isCaller: boolean) => {
      if (!stream) {
        console.error("❌ Không có local stream khi tạo peer connection");
        return;
      }
      const pc = new RTCPeerConnection(ICE_SERVERS) as any;

      // Add local stream tracks
      stream.getTracks().forEach((track) => {
        track.enabled = true;
        pc.addTrack(track, stream);
        console.log(`➕ Added ${track.kind} track to peer connection`, {
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
        });
      });

      //Cach cua mta
      let remoteStreamInstance: MediaStream | null = null;
      pc.ontrack = (event: any) => {
        console.log("Received remote track:", event.track.kind);
        const track = event.track;

        if (!remoteStreamInstance) {
          remoteStreamInstance = new MediaStream();
        }

        // Kiểm tra và thêm track vào remote stream
        remoteStreamInstance.addTrack(track);

        // Log chi tiết về track
        console.log(`📡 ${track.kind} track received:`, {
          id: track.id,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
        });

        // Kiểm tra nếu là video track
        if (track.kind === "video" && !track.enabled) {
          console.warn("⚠️ Remote video track bị disabled, đang enable...");
          track.enabled = true; // Thêm dòng này
          setIsRemoteVideoEnabled(true);
          // Note: Không thể force enable remote track, nhưng có thể log để debug
        }

        console.log("remote setRemoteStream", remoteStreamInstance);
        setRemoteStream(remoteStreamInstance);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event: any) => {
        if (event.candidate && ongoingCall) {
          console.log("🧊 Gửi ICE candidate", event.candidate.toJSON());
          socket?.emit("webrtcSignal", {
            candidate: {
              // ✅ Truyền cả object candidate
              candidate: event.candidate.candidate,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdpMid: event.candidate.sdpMid,
            },
            ongoingCall,
            isCaller: true,
          });
        }
      };

      // Connection state monitoring
      pc.oniceconnectionstatechange = () => {
        console.log(`🔄 ICE Connection State: ${pc.iceConnectionState}`);

        // Sử dụng switch case để kiểm tra trạng thái ICE connection state
        switch (pc.iceConnectionState) {
          case "connected":
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

            // Kiểm tra remote stream tracks
            if (remoteStreamInstance) {
              console.log(
                "Remote stream tracks:",
                remoteStreamInstance.getTracks().map((track) => ({
                  kind: track.kind,
                  enabled: track.enabled,
                  muted: track.muted,
                  readyState: track.readyState,
                }))
              );
            }
            break;

          case "disconnected":
          case "failed":
            console.warn("⚠️ ICE connection failed");
            handleHangUp({});
            break;

          case "checking":
            console.log("🔄 Đang kiểm tra kết nối ICE...");
            break;

          case "new":
            console.log("🔄 ICE connection mới bắt đầu");
            break;

          case "closed":
            console.log("🔄 ICE connection đã đóng");
            break;

          default:
            console.log(
              "🔄 Trạng thái ICE không xác định:",
              pc.iceConnectionState
            );
            break;
        }
      };

      // Save to refs and state
      peerConnection.current = pc;

      return pc;
    },
    [socket, ongoingCall, remoteStream]
  );

  // const handleWebrtcSignal = useCallback(
  //   async (data: {
  //     sdp?: RTCSessionDescriptionInit;
  //     candidate?: RTCIceCandidateInit;
  //     ongoingCall: OngoingCall;
  //     isCaller: boolean;
  //   }) => {
  //     console.log("📡 Received WebRTC signal:", {
  //       hasSdp: !!data.sdp,
  //       hasCandidate: !!data.candidate,
  //       sdpType: data.sdp?.type,
  //       isCaller: data.isCaller,
  //       signalingState: peerConnection.current?.signalingState,
  //       existingPC: !!peerConnection.current,
  //     });

  //     console.log("Received ICE Candidate:", data?.sdp?.candidate);
  //     console.log("data chỗ handle webrtc:", data);

  //     // Kiểm tra và tạo peer connection nếu cần
  //     if (!peerConnection.current) {
  //       if (data.sdp?.type === "offer") {
  //         console.log("🔧 Tạo peer connection từ WebRTC signal (offer)");
  //         if (!localStreamRef.current) {
  //           console.warn("⚠️ Không có local stream, lấy stream mới");
  //           const stream = await getStream();
  //           if (!stream) {
  //             console.error("❌ Không thể lấy local stream");
  //             return;
  //           }
  //           localStreamRef.current = stream;
  //         }

  //         createPeerConnection(
  //           localStreamRef.current,

  //           !data.isCaller
  //         );
  //       } else {
  //         console.warn(
  //           "⚠️ Nhận signal nhưng không có peer connection và không phải offer"
  //         );
  //         return;
  //       }
  //     }

  //     const pc = peerConnection.current;
  //     if (!pc) {
  //       console.error("❌ Peer connection vẫn null sau khi tạo");
  //       return;
  //     }

  //     try {
  //       // Xử lý SDP
  //       if (data.sdp && "type" in data.sdp) {
  //         if (data.sdp.type === "offer") {
  //           console.log("📥 Xử lý offer");

  //           await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

  //           const answer = await pc.createAnswer();
  //           await pc.setLocalDescription(answer);

  //           console.log("📤 Gửi answer");
  //           socket?.emit("webrtcSignal", {
  //             sdp: answer,
  //             ongoingCall: data.ongoingCall,
  //             isCaller: false,
  //           });
  //         } else if (data.sdp.type === "answer") {
  //           if (pc.signalingState === "have-local-offer") {
  //             console.log("📥 Xử lý answer");
  //             await pc.setRemoteDescription(
  //               new RTCSessionDescription(data.sdp)
  //             );
  //           }
  //         }
  //       } else if (data.candidate) {
  //         console.log("🧊 Thêm ICE candidate", data.candidate);
  //         try {
  //           await pc.addIceCandidate(
  //             new RTCIceCandidate({
  //               candidate: data.candidate.candidate,
  //               sdpMLineIndex: data.candidate.sdpMLineIndex,
  //               sdpMid: data.candidate.sdpMid,
  //             })
  //           );
  //         } catch (err) {
  //           console.error("Lỗi khi thêm ICE candidate:", err);
  //         }
  //       }

  //       // if (data.sdp.candidate) {
  //       //   console.log("🧊 Thêm ICE candidate", data.candidate);
  //       //   try {
  //       //     await pc.addIceCandidate(new RTCIceCandidate(data.sdp));
  //       //   } catch (err) {
  //       //     console.error("Lỗi khi thêm ICE candidate:", err);
  //       //   }
  //       // }
  //     } catch (err) {
  //       console.error("❌ Lỗi xử lý WebRTC signal:", err);
  //     }
  //   },
  //   [socket, getStream, createPeerConnection]
  // );

  // 2. Cập nhật createPeerConnection để track ICE gathering

  // 3. Cập nhật handleWebrtcSignal để track received candidates
  const handleWebrtcSignal = useCallback(
    async (data: {
      sdp?: RTCSessionDescriptionInit;
      candidate?: RTCIceCandidateInit;
      ongoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      try {
        console.log("📡 Received WebRTC signal:", {
          hasSdp: !!data.sdp,
          hasCandidate: !!data.candidate,
          sdpType: data.sdp?.type,
          isCaller: data.isCaller,
        });

        // Existing peer connection check code...
        if (!peerConnection.current && data.sdp?.type === "offer") {
          console.log("📥 Received offer, creating peer connection");

          let stream = localStreamRef.current;
          if (!stream) {
            stream = await getStream();
            if (!stream) return;
          }

          createPeerConnection(stream, true);
        }

        const pc = peerConnection.current;
        if (!pc) {
          console.log("❌ No peer connection available");
          return;
        }

        console.log("📡 Nhận WebRTC signal:", data);
        console.log("Received SDP type:", data.sdp?.type);
        console.log("Current peerConnection state:", pc.signalingState);
        // Xử lý SDP
        if (data.sdp) {
          const { sdp } = data;
          console.log("📡 Xử lý SDP:", sdp.type);

          if (sdp.type === "offer") {
            console.log("Setting remote description (offer)");
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

            console.log("Creating answer");
            const answer = await pc.createAnswer();

            console.log("Setting local description (answer)");
            await pc.setLocalDescription(answer);

            console.log("Sending answer");
            socket?.emit("webrtcSignal", {
              sdp: answer,
              ongoingCall: data.ongoingCall,
              isCaller: false,
            });
          }
          // Xử lý SDP answer
          else if (sdp.type === "answer") {
            console.log("Setting remote description (answer)");
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        }
        // Xử lý ICE candidate - ĐÂY LÀ PHẦN BỊ LỖI
        if (data.candidate) {
          try {
            console.log("🧊 Adding ICE candidate:", data.candidate);

            // Kiểm tra trạng thái remote description
            if (pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log("✅ ICE candidate added successfully");
            } else {
              console.log(
                "⏳ Chưa có remote description, lưu candidate để xử lý sau"
              );
              // Có thể lưu vào queue để xử lý sau khi có remote description
            }
          } catch (err) {
            console.error("❌ Error adding ICE candidate:", err);
          }
        }
      } catch (err) {
        console.error("❌ Lỗi xử lý WebRTC signal:", err);
      }
    },
    [socket, getStream, createPeerConnection, peerConnection]
  );

  // const handleCall = useCallback(
  //   async (receiver: SocketUser, isVideoCall: boolean) => {
  //     try {
  //       console.log("📞 Bắt đầu cuộc gọi");
  //       setIsCallEnded(false);

  //       // Kiểm tra xem peerConnection đã được tạo chưa, nếu chưa thì tạo mới
  //       const stream = await getStream();
  //       if (!stream) {
  //         console.log("❌ Không lấy được stream");
  //         return;
  //       }

  //       if (!currentUser || !socket) {
  //         console.log("❌ Thiếu currentUser hoặc socket");
  //         return;
  //       }

  //       const participants = { caller: currentUser, receiver };

  //       socket.emit("call", participants, isVideoCall);

  //       const newCall = {
  //         participants,
  //         isRinging: false,
  //         isVideoCall: isVideoCall,
  //       };

  //       setOngoingCall(newCall);

  //       const pc = createPeerConnection(stream, false);
  //       if (!pc) {
  //         console.error("❌ Cannot create peer connection");
  //         return;
  //       }

  //       // Tạo offer
  //       const offer = await peerConnection.current?.createOffer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //       });
  //       await pc.setLocalDescription(offer);

  //       console.log("📤 Gửi offer");

  //       // Gửi offer qua WebRTC signal
  //       socket.emit("webrtcSignal", {
  //         sdp: offer,
  //         ongoingCall: newCall,
  //         isCaller: true,
  //       });
  //     } catch (err) {
  //       console.error("❌ Lỗi tạo offer:", err);
  //     }
  //   },
  //   [
  //     socket,
  //     currentUser,
  //     getStream,
  //     ongoingCall,
  //     peerConnection,
  //     createPeerConnection,
  //   ]
  // );

  const handleCall = useCallback(
    async (receiver: SocketUser, isVideoCall: boolean) => {
      try {
        console.log("📞 Bắt đầu cuộc gọi");
        setIsCallEnded(false);

        const stream = await getStream();
        if (!stream || !currentUser || !socket) {
          console.error("❌ Missing requirements");
          return;
        }

        // 1. Gửi event "call" để thông báo cho receiver
        const participants = { caller: currentUser, receiver };
        socket.emit("call", participants, isVideoCall);

        // 2. Tạo peer connection
        const pc = createPeerConnection(stream, true); // isCaller = true
        if (!pc) {
          console.error("❌ PeerConnection creation failed");
          return;
        }

        // 3. Tạo offer
        let offer;
        try {
          offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: isVideoCall,
            iceRestart: false,
          });
          await pc.setLocalDescription(offer);
        } catch (err) {
          console.error("❌ Offer creation error:", err);
          handleHangUp({});
          return;
        }

        // // 4. Đợi ICE gathering hoàn tất (quan trọng!)
        // await new Promise<void>((resolve) => {
        //   if (pc.iceGatheringState === "complete") {
        //     resolve();
        //   } else {
        //     pc.onicegatheringstatechange = () => {
        //       if (pc.iceGatheringState === "complete") {
        //         resolve();
        //       }
        //     };
        //   }
        // });

        // 5. Gửi offer đi
        socket.emit("webrtcSignal", {
          sdp: pc.localDescription, // Gửi localDescription mới nhất
          ongoingCall: { participants, isVideoCall },
          isCaller: true,
        });

        console.log("📤 Offer sent successfully");
      } catch (err) {
        console.error("❌ Call setup failed:", err);
        handleHangUp({});
      }
    },
    [socket, currentUser, getStream]
  );

  const onIncomingCall = useCallback(
    (participants: Participants, isVideoCall: boolean) => {
      // console.log("📞 Cuộc gọi đến:", participants);
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
    [socket, currentUser, getStream]
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

  const debugStreams = useCallback(() => {
    console.log("=== DEBUG STREAMS ===");

    // Debug local stream
    if (localStreamRef.current) {
      console.log("Local Stream:", {
        id: localStreamRef.current.id,
        active: localStreamRef.current.active,
        tracks: localStreamRef.current.getTracks().map((track) => ({
          kind: track.kind,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          id: track.id,
        })),
      });
    } else {
      console.log("Local Stream: null");
    }

    // Debug remote stream
    if (remoteStream) {
      console.log("Remote Stream:", {
        id: remoteStream.id,
        active: remoteStream.active,
        tracks: remoteStream.getTracks().map((track) => ({
          kind: track.kind,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          id: track.id,
        })),
      });
    } else {
      console.log("Remote Stream: null");
    }

    // Debug peer connection
    if (peerConnection.current) {
      console.log(
        "Peer Connection State:",
        peerConnection.current.connectionState
      );
      console.log("Signaling State:", peerConnection.current.signalingState);
      console.log(
        "ICE Connection State:",
        peerConnection.current.iceConnectionState
      );
    }
  }, [remoteStream]);

  useEffect(() => {
    if (ongoingCall && !ongoingCall.isRinging) {
      setTimeout(() => {
        debugStreams();
      }, 2000); // Debug sau 2 giây
    }
  }, [ongoingCall, debugStreams]);

  useEffect(() => {
    const newSocket = io("http://192.168.1.40:3000");
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

  //set online users

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
        socket: socket!,
        handleCall,
        handleJoinCall,
        handleHangUp,
        setIsRemoteVideoEnabled,
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
