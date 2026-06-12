import type { ToEngine } from "commons";
import { createClient } from "redis";

const client = createClient();
client.connect();

const publisher = createClient();
publisher.connect();

type OpenOrder = {
  userId: string;
  orignalOrderId: string;
  qty: string;
  filledQty: string;
};
type Bid = {
  availableQty: number;
  OpenOrders: OpenOrder[];
};
type Ask = {
  availableQty: number;
  OpenOrders: OpenOrder[];
};
interface Orderbook {
  bids: Map<string, Bid>;
  asks: Map<string, Ask>;
  marketId: string;
  lastTradedPrice: number;
}
const orderBooks: Orderbook[] = [];
const balances: Map<string, string> = new Map();

while (1) {
  const response = await client.xReadGroup(
    "engine",
    "engine",
    [
      {
        key: "engine",
        id: ">",
      },
    ],
    {
      BLOCK: 0,
      COUNT: 1,
    },
  );
  if (!response) {
    console.log("nothing found!");
    continue;
  }
  console.log(response);

  const message: {
    loopBackId: string;
  } & ToEngine = response[0].messages[0].message;

  if (message.messageType === "create_market") {
    orderBooks.push({
      bids: new Map(),
      asks: new Map(),
      lastTradedPrice: -1,
      marketId: message.marketId,
    });

    console.log(orderBooks);

    await publisher.xAdd("to-backend", "*", {
      loopbackId: message.loopBackId,
    });
  }

  if (message.messageType === "onramp") {
    balances[message.userId].available += message.amount;

    await publisher.xAdd("to-backend", "*", {
      loopbackId: message.loopBackId,
    });
  }

  if (message.messageType === "create_order") {
    balances[message.userId].available += message.amount;

    await publisher.xAdd("to-backend", "*", {
      loopbackId: message.loopBackId,
    });
  }

  if (message.messageType === "cancel_order") {
    balances[message.userId].available += message.amount;

    await publisher.xAdd("to-backend", "*", {
      loopbackId: message.loopBackId,
    });
  }
}
