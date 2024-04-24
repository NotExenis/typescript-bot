import * as dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if(!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing token or client ID in configuration");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
}