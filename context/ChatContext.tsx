"use client";
import { FileContent, ResponseMessageDTO } from "@/dtos/MessageDTO";
import { createContext, useContext, useState } from "react";

export interface LatestMessage {
  senderName: string;
  content: string;
  createAt: string;
  boxId: string;
}

// Tạo kiểu cho context
interface ChatContextType {
  messages: ResponseMessageDTO[];
  setMessages: React.Dispatch<React.SetStateAction<ResponseMessageDTO[]>>;
}

// Tạo context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<ResponseMessageDTO[]>([]); // Mảng tin nhắn

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook để sử dụng context
export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
