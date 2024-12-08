export interface FileContent {
  fileName: string;
  url: string;
  publicId: string;
  bytes: string;
  width: string;
  height: string;
  format: string;
  type: string;
}

export interface RequestSendMessageDTO {
  boxId: string;
  content: string | FileContent;
}

export interface UserInfoBox {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  phone: string;
}
export interface MessageBoxDTO {
  _id: string;
  senderId: string;
  receiverIds: UserInfoBox[];
  messageIds: string[];
  groupName: string;
  groupAva: string[];
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
  lastMessage: ResponseMessageDTO;
  readStatus: boolean;
}

export interface MessageBoxGroupDTO {
  _id: string;
  senderId: UserInfoBox[];
  receiverIds: UserInfoBox[];
  messageIds: string[];
  groupName: string;
  groupAva: string[];
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
  lastMessage: ResponseMessageDTO;
  readStatus: boolean;
}
export interface ResponseMessageBoxDTO {
  box: MessageBoxDTO[];
  adminId: string;
}

export interface ResponseMessageDTO {
  id: string;
  flag: boolean;
  readedId: string[];
  text: string[];
  contentId: FileContent[];
  boxId: string;
  createAt: string;
  createBy: string;
  isReact: boolean;
}

export interface DetailMessageBoxDTO {
  _id: string;
  senderId: UserInfoBox;
  receiverIds: UserInfoBox[];
  messageIds: string[];
  groupName: string;
  groupAva: string[];
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
  readStatus: boolean;
}

export interface PusherDeleteAndRevoke {
  id: string;
  flag: boolean;
  isReact: boolean;
  text: string;
  boxId: string;
  action: string;
}

export interface Text {
  id: string;
  text: string;
  timestamp: Date;
  createBy: string;
}

export interface ItemChat {
  id: string;
  userName: string;
  avatarUrl: string;
  status: string;
  lastMessage: Text;
  isRead: boolean;
}

export interface ItemHeader {
  id: string;
  userName: string;
  avatarUrl: string;
  status: string;
  receiverId: string; // Giả sử đây là ID của người nhận
  senderId: string; // Giả sử đây là ID của người gửi
}

export interface ChatResponse {
  success: boolean;
  messages: ResponseMessageDTO[];
}

export interface FindMessageResponse {
  success: boolean;
  messages: ResponseMessageDTO[];
}
