import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('logs')
    .setDescription('configure the logs for you server')
    .addUserOption(options =>
        options.setName('user')
           .setDescription('The user to kick')
           .setRequired(true)
    )
export async function execute(interaction: CommandInteraction){

}