import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  UserResolvable,
  GuildMemberRoleManager,
  AuditLogEvent,
  Events,
  ChannelMention,
} from "discord.js";

import { logModel } from "../schemas/logSchema";

export const data = new SlashCommandBuilder()
  .setName("logchannel")
  .setDescription("Set the channel the logs")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to set")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {

  try {
    const channelId = await interaction.options.getChannel("channel");
    if (!channelId) {
      return interaction.reply({
        content: "Please provide a valid channel.",
        ephemeral: true,
      });
    }

    const guildId = interaction.guild?.id;

    console.log(
      `Setting log channel for guild ID: ${guildId}, channel ID: ${channelId}`
    );

    let logDocument = await logModel.findOne({ guildId, channelId });

    if (!logDocument) {
      logDocument = new logModel({
        guildId: guildId,
        channelId: channelId,
      });
      await logDocument.save();
      await interaction.reply({
        content: `The log channel has been set successfully`,
        ephemeral: false,
      });
    } else {
      logDocument.channelId = channelId.id;
      await logDocument.save();
      await interaction.reply({
        content: `The log channel has been updated successfully`,
        ephemeral: false,
      });
    }
  } catch (error) {
    console.error("Failed to set log channel:", error);
    await interaction.reply({
      content: "An unexpected error occurred while setting the log channel.",
      ephemeral: true,
    });
  }
}
