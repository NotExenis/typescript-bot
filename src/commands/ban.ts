import {
  GuildMember,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} from "discord.js";

import { banModel } from "../schemas/banSchema";

export const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a user from the server")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to ban").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for banning the user")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;
  const target = interaction.options.getMember("user") as GuildMember;
  const errorEmbed = new EmbedBuilder().setColor("Red");
  const reason = interaction.options.getString("reason") || "No reason given";

  if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      embeds: [errorEmbed.setDescription("You do not have perms")],
      ephemeral: true,
    });
  }

  if (!target) {
    interaction.reply({
      embeds: [errorEmbed.setDescription("Provided a valid user ID")],
      ephemeral: true,
    });
  }

  try {
    await target.ban({ reason });
    interaction.reply({
      embeds: [
        new EmbedBuilder().setColor("Orange").setDescription(
          `**${target.user.username}** was **Banned** from ${interaction.guild?.name} by ${interaction.member},
          **Reason** ${reason}`
        ),
      ],
    });

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(
              `You were **banned** from ${interaction.guild?.name} by ${interaction.member},
          **Reason** ${reason}`
            )
            .setThumbnail(target.displayAvatarURL({ size: 64 })),
        ],
      });
    } catch (sendError) {
      console.error("Failed to send ban notice:", sendError);
    }
  } catch (error) {
    console.log(error);
  }

  try {

    const guildId = interaction.guild?.id;
    const targetId = target.id;
    let BanDocument = await banModel.findOne({ guildId, targetId });

    if (BanDocument) {
      BanDocument.reason += `, ${reason || "No reason given"}`;
      await BanDocument.save();
    } else {
      BanDocument = new banModel({
        guildId: guildId,
        targetId: targetId,
        reason: reason || "No reason given",
        moderator: member.id
      });

      await BanDocument.save();
    }
  } catch (error) {
    console.log(error);
  }
}

