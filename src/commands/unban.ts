import {
  GuildMember,
  SlashCommandBuilder,
  CommandInteractionOption,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  UserResolvable,
} from "discord.js";

import { banModel } from "../schemas/banSchema";

export const data = new SlashCommandBuilder()
  .setName("unban")
  .setDescription("Unban a user from the server")
  .addStringOption((option) =>
    option
      .setName("user-id")
      .setDescription("Provide the user ID of the person you want to unban")
  );

  export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const errorEmbed = new EmbedBuilder().setColor("Red");
    const targetId = interaction.options.getString("user-id") as UserResolvable;

  
    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("You do not have perms")],
        ephemeral: true,
      });
    }
  
    try {
      const bans = await interaction.guild?.bans.fetch();
      const isBanned = bans?.some(ban => ban.user.id === targetId);
  
      if (!isBanned) {
        return interaction.reply({
          embeds: [errorEmbed.setDescription("This user is not banned")],
          ephemeral: true,
        });
      }

        await interaction.guild?.bans.remove(targetId);
      interaction.reply({
        embeds: [errorEmbed.setDescription(`${targetId} has been unbanned`)]
      });
  
    } catch (error) {
      console.error(error);
      interaction.reply({
        embeds: [errorEmbed.setDescription("An error occurred while processing your request.")],
        ephemeral: true,
      });
    }
  }