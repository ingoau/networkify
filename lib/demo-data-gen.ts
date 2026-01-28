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

const anonFollow = async (user: {
  username: string;
  name: string;
  image_url?: string;
}) => {
  if (user.username.startsWith("spotify:user:")) {
    return {
      ...user,
      name: "User",
      username:
        "spotify:user:" +
        (await calculateHash(user.username.replace("spotify:user:", ""))),
      image_url: undefined,
    };
  } else if (user.username.startsWith("spotify:artist:")) {
    return {
      ...user,
      name: "Artist",
      username:
        "spotify:artist:" +
        (await calculateHash(user.username.replace("spotify:artist:", ""))),
      image_url: undefined,
    };
  }
  console.log("Somethings fucked");
};

fs.writeFileSync(
  "./data.json",
  JSON.stringify({
    users: await Promise.all(
      DEMO_DATA.users.map(async (user) => {
        return {
          ...user,
          name: "User",
          username: await calculateHash(user.username),
          image_url: undefined,
          followers: await Promise.all(
            user.followers.map(async (follower) => {
              return await anonFollow(follower);
            }),
          ),
          following: await Promise.all(
            user.followers.map(async (follow) => {
              return await anonFollow(follow);
            }),
          ),
        };
      }),
    ),
  }),
);
