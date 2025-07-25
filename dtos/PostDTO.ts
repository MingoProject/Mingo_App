import { Schema } from "mongoose";
import { UserBasicInfo } from "./UserDTO";

export interface PostCreateDTO {
  content: string;
  media?: string[];
  url?: string;
  location?: string;
  tags?: string[];
  privacy?: {
    type: string;
    allowedUsers?: Schema.Types.ObjectId[];
  };
}

export interface MediaInfo {
  _id: string;
  url: string;
  type: string;
  caption: string;
}

export interface PostResponseDTO {
  _id: string;
  content: string;
  media?: MediaInfo[];
  createdAt: Date;
  author: UserBasicInfo;
  shares: string[];
  likes: string[];
  savedByUsers: string[];
  comments: string[];
  location?: string;
  tags?: UserBasicInfo[];
  privacy: {
    type: string;
    allowedUsers?: string[];
  };
  likedIds: string[];
  flag: boolean;
}

export interface PostYouLikeDTO {
  _id: string;
  user_id: string;
  post_id: string;
  created_at: Date;
  posts: Array<{
    _id: string;
    content: string;
    posterName: string;
    posterAva: string;
    like_at: Date;
  }>;
}
