import { Schema } from "mongoose";

export interface RelationResponseDTO {
  stUser: Schema.Types.ObjectId;
  ndUser: Schema.Types.ObjectId;
  relation: string;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  status: boolean;
}
