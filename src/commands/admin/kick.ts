import { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a user from the server')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to kick')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason for kicking the user')
      .setRequired(false)
      .setMinLength(1)
      .setMaxLength(255)
  )


export async function execute(interaction: CommandInteraction ) {
  const { PermissionBitsFields } = require("discord.js");
  const user = interaction.options.getUser("user"); 

  if(member.permissions.has)

}