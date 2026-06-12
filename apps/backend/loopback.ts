import type { ToEngine } from "commons";
import { createClient } from "redis";

const client = createClient();
client.connect();

const subscriber = createClient();
subscriber.connect();

const BANK_CONSUMER_GROUP = "backend-" + Math.random();

client.xGroupCreate("to-backend", BANK_CONSUMER_GROUP, "$", {
  MKSTREAM: true,
});

const loopbackResolves = new Map<string, () => {}>();

export function loopback(message: ToEngine) {
  return new Promise(async (resolve, reject) => {
    const loopBackId = Math.random().toString();
    console.log("before publish");
    await client.xAdd("engine", "*", { loopBackId, ...message });
    console.log("after publish");
    loopbackResolves.set(loopBackId, resolve);
    setTimeout(() => {
      if (loopbackResolves.get(message.loopBackId)) {
        reject();
        loopbackResolves.delete(message.loopBackId);
      }
    }, 10000);
  });
}

async function main() {
  while (1) {
    const response = await subscriber.xReadGroup(
      BANK_CONSUMER_GROUP,
      BANK_CONSUMER_GROUP + Math.random(),
      [
        {
          key: "to-backend",
          id: ">",
        },
      ],
      {
        BLOCK: 0,
        COUNT: 1,
      },
    );

    const message = response[0].messages[0].message as {
      loopBackId: string;
    } & ToEngine;

    loopbackResolves.get(message.loopBackId)?.();
    loopbackResolves.delete(message.loopBackId);
  }
}

main();
