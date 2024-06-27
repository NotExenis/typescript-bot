import { Schema, model } from "mongoose";

export const logSchema = new Schema({
    guildId: String,
    channelId: String,
})

export const logModel = model('logSchema', logSchema);