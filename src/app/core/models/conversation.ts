import {Message} from "./message";

export interface Conversation {

  id: number;
  participant1Id: number;
  participant2Id: number;
  participant1FullName: string;
  participant2FullName: string;
  messages: Message[];
  participant1ImageUrl: string;
  participant2ImageUrl: string;
}
