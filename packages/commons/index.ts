export type ToEngine =
  | {
      messageType: "onramp";
      userId: string;
      amount: string;
    }
  | {
      messageType: "create_order";
      price: string;
      qty: string;
      side: "long" | "short";
      marketId: string;
      type: "market" | "limit";
      equity: string;
      userId: string;
      orderId: string;
    }
  | {
      messageType: "cancel_order";
      orderId: string;
      userId: string;
    }
  | {
      messageType: "create_market";
      marketId: string;
    };
