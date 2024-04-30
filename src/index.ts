import { ChatInputCommandInteraction } from "discord.js";
import { Client, Collection, ClientOptions } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import mongoose from "mongoose";

class CustomClient extends Client {
  commands: Collection<string, any>;

  constructor(options?: ClientOptions) {
    super(
      options || {
        intents: 32769,
      }
    );
    this.commands = new Collection();
  }
}

export const client = new CustomClient({
  intents: [32769],
});

client.once("ready", async () => {
  console.log("Bot is ready!");
  // Deploy commands globally
  await deployCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    if (interaction instanceof ChatInputCommandInteraction) {
      commands[commandName as keyof typeof commands].execute(interaction);
    }
  }
});

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017", {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

client.login(config.DISCORD_TOKEN);
