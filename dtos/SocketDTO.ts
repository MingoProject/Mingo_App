import { UserResponseDTO } from "./UserDTO";
import Peer from "simple-peer";

export type SocketUser = {
  userId: string;
  socketId: string;
  profile: any;
};

export type OngoingCall = {
  participants: Participants;
  isRinging: boolean;
  isVideoCall: boolean;
};

export type Participants = {
  caller: SocketUser;
  receiver: SocketUser;
};

export type PeerData = {
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
  participantUser: SocketUser;
};
