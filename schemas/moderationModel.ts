import { Schema, model } from 'mongoose';

interface GuildSchema {
    guildId: String,
    logs: {
        moderation: {
            enabled: boolean;
            channelId: String;
        }
    }
}

export default model<GuildSchema>("GuildSchema", new Schema<GuildSchema>({
    guildId: String,
    logs: {
        moderation: {
            enabled: Boolean,
            channelId: String
        }
    }
},{
    timestamps: true,
}))