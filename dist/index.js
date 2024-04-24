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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const commands_1 = require("./commands");
const deploy_commands_1 = require("./deploy-commands");
const client = new discord_js_1.Client({
    intents: [
        32769
    ],
});
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Bot is ready!");
    const guilds = client.guilds.cache;
    for (const guild of guilds.values()) {
        yield (0, deploy_commands_1.deployCommands)({ guildId: guild.id });
    }
}));
client.on("guildCreate", (guild) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, deploy_commands_1.deployCommands)({ guildId: guild.id });
}));
client.on("ïnteractionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands_1.commands[commandName]) {
        commands_1.commands[commandName].execute(interaction);
    }
}));
client.login(config_1.config.DISCORD_TOKEN);
