// src/dtos/CallDTO.ts
export interface CallCreateDTO {
  callerId: string;
  receiverId: string;
  callType: "video" | "audio";
  startTime: Date | string;
  endTime: Date | string;
  status: "missed" | "rejected" | "completed";
  createBy: string;
}

export interface CallResponseDTO {
  id: string;
  callerId: string;
  receiverId: string;
  duration?: number;
  // Thêm các trường khác theo API response
}
