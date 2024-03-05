import { ChatItemType } from "../../types/chat";

export type ChatStateType = {
  waiting: boolean;
  list: ChatItemType[];
  lastOldRequest: string;
  lastLoading: boolean;
}
