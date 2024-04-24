"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const moderationSchema_1 = __importDefault(require("../schemas/moderationSchema"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((option) => option.setName("user").setDescription("The user to kick").setRequired(true))
    .addStringOption((option) => option
    .setName("reason")
    .setDescription("The reason for kicking the user")
    .setRequired(false)
    .setMinLength(1)
    .setMaxLength(255));
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const { PermissionBitsFields } = require("discord.js");
        const target = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason given";
        const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
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
        if (target.roles.highest.position >=
            ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest.position)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription("You can not kick a member with a higher role than you!"),
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
                    errorEmbed.setDescription("your kick reason can not be longer than 255 characters!"),
                ],
                ephemeral: true,
            });
        try {
            yield target.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Orange")
                        .setDescription(`You were **kicked** from ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name} by ${interaction.member},
        **Reason** ${reason}`)
                        .setThumbnail(target.displayAvatarURL({ size: 64 })),
                ],
            });
        }
        catch (error) {
            console.log(error);
        }
        try {
            yield target.kick(reason);
        }
        catch (_h) {
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(`An error occured while trying to kick this member, try again soon!`),
                ],
                ephemeral: true,
            });
        }
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("Orange").setDescription(`**${target.user.username}** was **kicked** from ${(_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.name} by ${interaction.member},
        **Reason** ${reason}`),
            ],
            ephemeral: true,
        });
        (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.send({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`**${target.user.username}** was **kicked** from ${(_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.name} by ${interaction.member},
        **Reason** ${reason}`)
                    .setThumbnail(target.displayAvatarURL({ size: 64 })),
            ],
        });
        const userId = target.id;
        const guildId = (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.id;
        const kickReason = reason;
        try {
            const kickDocument = new moderationSchema_1.default({
                guildId: guildId,
                logs: {
                    moderation: {
                        enabled: true,
                        channelId: (_g = interaction.channel) === null || _g === void 0 ? void 0 : _g.id,
                        userid: userId,
                        reason: reason,
                    },
                },
            });
            yield kickDocument.save();
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.execute = execute;
