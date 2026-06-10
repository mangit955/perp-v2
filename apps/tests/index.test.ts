import { describe, expect, it } from "bun:test";
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
        password: "123234",
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
    const response = await axios.post(`${BACKEND}/api/v1/signup`, {
      username,
      password: "123234",
    });
    expect(response.status).toBe(200);
    expect(response.data.token).not.toBe(undefined);
  });
});
