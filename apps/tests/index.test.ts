import { describe, expect, it } from "bun:test";
import axios, { AxiosError } from "axios";
import { BACKEND } from "./config";
import { password } from "bun";

describe("auth endpoints", () => {
  const username = `manas ${Math.random()}`;
  it("Signup doesn't work if u don't provide username", async () => {
    try {
      const response = await axios.post(`${BACKEND}/api/v1/signup`, {
        password: "123234",
      });

      expect(1).toBe(2);
    } catch (e) {
      if (e instanceof AxiosError) {
        expect(e.response?.status).toBe(411);
      } else {
        expect(1).toBe(2);
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
});
