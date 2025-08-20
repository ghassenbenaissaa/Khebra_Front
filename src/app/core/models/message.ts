export interface Message {
  messageId?: number;
  text: string;
  timestamp?: Date;
  senderId: number;
  receiverId: number;
  conversationId:number;
}
