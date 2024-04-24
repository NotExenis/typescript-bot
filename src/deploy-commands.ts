import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type deployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: deployCommandsProps){
    try {
        console.log("Started refreshing application (/) commands...");

        await rest.put(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
            {
                body: commandsData,
            }
        )
        console.log("successfully reloaded application (/) commands");
    } catch (error) {
        console.log(error);
    }
}