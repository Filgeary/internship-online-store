import { ChatItemType } from "../../types/chat";

export type ChatStateType = {
  waiting: boolean;
  list: ChatItemType[];
  lastMessage: string;
  lastOldRequest: string;
  lastLoading: boolean;
}
