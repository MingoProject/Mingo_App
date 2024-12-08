export interface CreateNotificationDTO {
  senderId: string | null;
  receiverId: string | null;
  type: string;
  postId?: string;
  commentId?: string;
  messageId?: string;
  mediaId?: string;
}
