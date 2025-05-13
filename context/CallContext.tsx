// context/CallContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  mediaDevices,
  RTCPeerConnection,
  MediaStream,
  MediaStreamTrack,
} from "react-native-webrtc";
import { io } from "socket.io-client";

const socket = io("http://your-server-ip:3000"); // thay bằng IP máy backend thật

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const CallContext = createContext<any>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  const startLocalStream = async () => {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);
    return stream;
  };

  const createPeerConnection = async (isCaller: boolean, targetId: string) => {
    const peer = new RTCPeerConnection(servers);
    setPc(peer);

    const local = await startLocalStream();
    local.getTracks().forEach((track) => peer.addTrack(track, local));

    const remoteMediaStream = new MediaStream();
    (peer as any).onaddstream = (event: any) => {
      setRemoteStream(event.stream);
    };

    if (isCaller) {
      const offer = await peer.createOffer({});
      await peer.setLocalDescription(offer);
      socket.emit("webrtc-offer", { offer, to: targetId });
    }

    return peer;
  };

  const callUser = async (targetId: string) => {
    await createPeerConnection(true, targetId);
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    const peer = await createPeerConnection(false, incomingCall.from);
    await peer.setRemoteDescription(incomingCall.offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    socket.emit("webrtc-answer", { answer, to: incomingCall.from });

    setIncomingCall(null);
  };

  const rejectCall = () => {
    setIncomingCall(null);
  };

  const hangUp = () => {
    pc?.close();
    setPc(null);
    setRemoteStream(null);
    setLocalStream(null);
    socket.emit("hangup");
  };

  useEffect(() => {
    socket.on("incoming-offer", (data) => {
      setIncomingCall(data);
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      if (pc) await pc.setRemoteDescription(answer);
    });

    socket.on("hangup", hangUp);

    return () => {
      socket.off("incoming-offer");
      socket.off("webrtc-answer");
      socket.off("hangup");
    };
  }, [pc]);

  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        callUser,
        acceptCall,
        rejectCall,
        hangUp,
        incomingCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
