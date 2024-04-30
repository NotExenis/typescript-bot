import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import fs from 'node:fs';
import path from 'path';
import { client } from "./index.ts";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
    try {
        console.log(`Started refreshing ${commandsData.length} application (/) commands...`);

        const cmds = fs.readdirSync(path.join(__dirname, "commands"));

        const tsFiles = cmds.filter(file => file.endsWith('.ts'));

        for (let i = 0; i < tsFiles.length; i++) {
            const filePath = path.join(__dirname, "commands", tsFiles[i]);
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
                const cmd = require(filePath);
                client.commands.set(tsFiles[i].replace('.ts', ''), cmd);
            }
        }

        await rest.put(
            Routes.applicationCommands(config.DISCORD_CLIENT_ID),
            {
                body: commandsData,
            }
        );
        console.log(`successfully reloaded ${commandsData.length} application (/) commands`);
        } catch (error) {
            console.log(error);
        }
    } 

