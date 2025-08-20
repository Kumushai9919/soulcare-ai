export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: number;
  title: string;
  preview: string;
}