import { Schema, model } from 'mongoose';

const kickSchema = new Schema({
    guildId: String,
    userId: String,
    reason: String,
});

export const KickModel = model('Kick', kickSchema);