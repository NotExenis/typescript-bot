import {
  GuildMember,
  SlashCommandBuilder,
  CommandInteractionOption,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
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
  const target = interaction.options.getString("user-id");

  if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      embeds: [errorEmbed.setDescription("You do not have perms")],
      ephemeral: true,
    });
  }

  if (!target) {
    return interaction.reply({
      embeds: [errorEmbed.setDescription("Provided a valid user ID")],
      ephemeral: true,
    });
  }

  if(!interaction.guild?.members.unban(target)){
    interaction.reply({
      embeds: [errorEmbed.setDescription("This user is not banned")],
      ephemeral: true,
    })
  } else {
    interaction.guild?.members.unban(target)
    interaction.reply({
      embeds: [errorEmbed.setDescription(`${target} has been unbanned`)],
      ephemeral: true,
    })
  }
  
}
