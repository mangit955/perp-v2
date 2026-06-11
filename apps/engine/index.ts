import { createClient } from "redis";

const client = createClient();
client.connect();

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
      BLOCK: 100,
      COUNT: 1,
    },
  );
}
