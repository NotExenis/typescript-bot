"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("GuildSchema", new mongoose_1.Schema({
    guildId: String,
    logs: {
        moderation: {
            enabled: Boolean,
            channelId: String,
            kicks: [{
                    userId: String,
                    reason: String
                }]
        }
    }
}, {
    timestamps: true,
}));
