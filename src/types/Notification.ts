export interface Notification {
  _id: string;
  recipientId: string;
  type: "PAYMENT_FAILED" | "PAYMENT_SUCCESSFUL" | "PLAYER_JOINED_GAME" | "FREE_GAME_EARNED";
  title: string;
  message: string;
  notificationType: string;
  category: "PAYMENT" | "GAME" | "SYSTEM";
  priority: string;
  referenceId: string;
  referenceType: string;
  metadata: {
    bookingId: string;
    transactionId?: string;
    amount?: number;
    newPlayerId?: string;
    newPlayerName?: string;
    newPlayerPosition?: string;
    newPlayerTeam?: string;
    timestamp: string;
  };
  isRead: boolean;
  isReadyByAdmin: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
