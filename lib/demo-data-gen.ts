// This is the code I used to generate demo data—probably dont use it for anything, but it is here if you are intersted

import DEMO_DATA from "./demoData";
import fs from "fs";

async function calculateHash(data: string) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

fs.writeFileSync(
  "./data.json",
  JSON.stringify(
    await Promise.all(
      DEMO_DATA.users.map(async (user) => {
        return {
          ...user,
          name: "User",
          username: await calculateHash(user.username),
          image_url: undefined,
          followers: await Promise.all(
            user.followers.map(async (follower) => {
              return {
                ...follower,
                name: "User",
                username: await calculateHash(follower.username),
                image_url: undefined,
              };
            }),
          ),
          following: await Promise.all(
            user.followers.map(async (follow) => {
              return {
                ...follow,
                name: "User",
                username: await calculateHash(follow.username),
                image_url: undefined,
              };
            }),
          ),
        };
      }),
    ),
  ),
);
