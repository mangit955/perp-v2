import type { ToEngine } from "commons";
import { createClient } from "redis";

const client = createClient();
client.connect();

export function loopback(message: ToEngine) {
  return new Promise((resolve, reject) => {
    const loopBackId = Math.random().toString();
    client.xAdd("engine", "*", { loopBackId, ...message });
  });
}
