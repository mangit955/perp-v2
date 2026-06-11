import { beforeAll, describe, expect, it } from "bun:test";
import axios, { AxiosError } from "axios";
import { BACKEND } from "./config";

describe("auth endpoints", () => {
  const username = `manas ${Math.random()}`;
  it("Signup doesn't work if u don't provide username", async () => {
    try {
      const response = await axios.post(`${BACKEND}/api/v1/signup`, {
        password: "123234",
      });

      expect().fail();
    } catch (e) {
      if (e instanceof AxiosError) {
        expect(e.response?.status).toBe(411);
      } else {
        expect().fail();
      }
    }
  });

  it("Signup does work if u don't provide username", async () => {
    const response = await axios.post(`${BACKEND}/api/v1/signup`, {
      username,
      password: "123234",
    });
    expect(response.data.id).not.toBe(undefined);
  });

  //bad input
  it("Signin doesn't work if u don't provide username", async () => {
    try {
      const response = await axios.post(`${BACKEND}/api/v1/signin`, {
        password: "123234",
      });

      expect().fail();
    } catch (e) {
      if (e instanceof AxiosError) {
        expect(e.response?.status).toBe(411);
      } else {
        expect().fail();
      }
    }
  });

  //incorrect credentials
  it("Signin doesn't work if wrong credentials are sent", async () => {
    try {
      const response = await axios.post(`${BACKEND}/api/v1/signin`, {
        username,
        password: "wrong-password",
      });

      expect().fail();
    } catch (e) {
      if (e instanceof AxiosError) {
        expect(e.response?.status).toBe(403);
      } else {
        expect().fail();
      }
    }
  });

  //correct once
  it("Signin does work if right credentials are sent", async () => {
    const response = await axios.post(`${BACKEND}/api/v1/signin`, {
      username,
      password: "123234",
    });
    expect(response.status).toBe(200);
    expect(response.data.token).not.toBe(undefined);
  });
});

describe("Order endpoints", () => {
  const USER_1 = `manas-${Math.random()}`;
  const USER_2 = `manas-${Math.random()}`;
  const PASSWORD = "random123";
  let MARKET_ID: string = "";
  let user1Token: string = "";
  let user2Token: string = "";

  beforeAll(async () => {
    await axios.post(
      `${BACKEND}/admin/market`,
      {
        symbol: "SOL",
        imageUrl: "sol.png",
      },
      {
        headers: {
          token: "Manas123",
        },
      },
    );
    await axios.post(`${BACKEND}/api/v1/signup`, {
      username: USER_1,
      password: PASSWORD,
    });
    await axios.post(`${BACKEND}/api/v1/signup`, {
      username: USER_2,
      password: PASSWORD,
    });

    const response1 = await axios.post(`${BACKEND}/api/v1/signin`, {
      username: USER_1,
      password: PASSWORD,
    });

    const response2 = await axios.post(`${BACKEND}/api/v1/signin`, {
      username: USER_2,
      password: PASSWORD,
    });

    user1Token = response1.data.token;
    user2Token = response2.data.token;

    await axios.post(
      `${BACKEND}/api/v1/onramp`,
      {
        amount: 100000,
      },
      {
        headers: {
          token: user1Token,
        },
      },
    );

    await axios.post(
      `${BACKEND}/api/v1/onramp`,
      {
        amount: 100000,
      },
      {
        headers: {
          token: user2Token,
        },
      },
    );
  });

  it("First order should sit on the book with 0 qty", async () => {
    const response = await axios.post(
      `${BACKEND}/api/v1/order`,
      {
        price: 100,
        qty: 10,
        side: "long",
        marketId: MARKET_ID,
        type: "limit",
        equity: 1000,
      },
      {
        headers: {
          token: user1Token,
        },
      },
    );
    expect(response.status).toBe(200);
    expect(response.data.filledQty).toBe(0);
    expect(response.data.orderId).toBeDefined();
  });

  it("Second order shpold sit on the book if not matched", async () => {
    const response = await axios.post(
      `${BACKEND}/api/v1/order`,
      {
        price: 102,
        qty: 10,
        side: "short",
        marketId: MARKET_ID,
        type: "limit",
        equity: 1000,
      },
      {
        headers: {
          token: user1Token,
        },
      },
    );
    expect(response.status).toBe(200);
    expect(response.data.filledQty).toBe(0);
    expect(response.data.orderId).toBeDefined();
  });

  it("Third order should match", async () => {
    const response = await axios.post(
      `${BACKEND}/api/v1/order`,
      {
        price: 100,
        qty: 20,
        side: "short",
        marketId: MARKET_ID,
        type: "limit",
        equity: 1000,
      },
      {
        headers: {
          token: user1Token,
        },
      },
    );
    expect(response.status).toBe(200);
    expect(response.data.filledQty).toBe(10);
    expect(response.data.orderId).toBeDefined();
  });
});
