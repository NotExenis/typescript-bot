import { Schema, model } from 'mongoose';

const kickSchema = new Schema({
    guildId: String,
    targetId: String,
    reason: String,
    moderator: String,
});

export const KickModel = model('Kick', kickSchema);