import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import fs from 'fs';
import path from 'path';

const client = new Client({
    intents:[
        32769
    ],
});

client.once("ready", async () => {
    console.log("Bot is ready!");
    const guilds = client.guilds.cache;
    for(const guild of guilds.values()) {
        await deployCommands({guildId: guild.id})
    }
});

client.on ("guildCreate", async (guild) => {
    await deployCommands({guildId: guild.id})
});

client.on ("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if(commands[commandName as keyof typeof commands]){
        commands[commandName as keyof typeof commands].execute(interaction);
    }
})


client.login(config.DISCORD_TOKEN)