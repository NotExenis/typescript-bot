import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  GuildMember,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMemberRoleManager,
} from "discord.js";

import GuildSchema from "../schemas/moderationSchema";

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a user from the server")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to kick").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for kicking the user")
      .setRequired(false)
      .setMinLength(1)
      .setMaxLength(255)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const { PermissionBitsFields } = require("discord.js");
  const target = interaction.options.getMember("user") as GuildMember;
  const reason = interaction.options.getString("reason") || "No reason given";

  const errorEmbed = new EmbedBuilder().setColor("Red");

  if (!target)
    return interaction.reply({
      embeds: [errorEmbed.setDescription("You must provide a user")],
      ephemeral: true,
    });

  if (target.id == interaction.user.id)
    return interaction.reply({
      embeds: [errorEmbed.setDescription("You can not kick yourself!")],
      ephemeral: true,
    });

  if (
    target.roles.highest.position >=
    (interaction.member?.roles as GuildMemberRoleManager).highest.position
  )
    return interaction.reply({
      embeds: [
        errorEmbed.setDescription(
          "You can not kick a member with a higher role than you!"
        ),
      ],
      ephemeral: true,
    });

  if (!target.kickable)
    return interaction.reply({
      embeds: [errorEmbed.setDescription("This member can not be kicked!")],
      ephemeral: true,
    });

  if (reason.length > 255)
    return interaction.reply({
      embeds: [
        errorEmbed.setDescription(
          "your kick reason can not be longer than 255 characters!"
        ),
      ],
      ephemeral: true,
    });

  try {
    await target.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Orange")
          .setDescription(
            `You were **kicked** from ${interaction.guild?.name} by ${interaction.member},
        **Reason** ${reason}`
          )
          .setThumbnail(target.displayAvatarURL({ size: 64 })),
      ],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await target.kick(reason);
  } catch {
    return interaction.reply({
      embeds: [
        errorEmbed.setDescription(
          `An error occured while trying to kick this member, try again soon!`
        ),
      ],
      ephemeral: true,
    });
  }

  interaction.reply({
    embeds: [
      new EmbedBuilder().setColor("Orange").setDescription(
        `**${target.user.username}** was **kicked** from ${interaction.guild?.name} by ${interaction.member},
        **Reason** ${reason}`
      ),
    ],
    ephemeral: true,
  });

  interaction.channel?.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Orange")
        .setDescription(
          `**${target.user.username}** was **kicked** from ${interaction.guild?.name} by ${interaction.member},
        **Reason** ${reason}`
        )
        .setThumbnail(target.displayAvatarURL({ size: 64 })),
    ],
  });

  const userId = target.id;
  const guildId = interaction.guild?.id;
  const kickReason = reason;

  try {
    const kickDocument = new GuildSchema({
      guildId: guildId,
      logs: {
        moderation: {
          enabled: true,
          channelId: interaction.channel?.id,
          userid: userId,
          reason: reason,
        },
      },
    });

    await kickDocument.save();
  } catch (error) {
    console.log(error);
  }
}
