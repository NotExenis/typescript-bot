import { Schema, model } from "mongoose"

const banSchema = new Schema({
    guildId: String,
    userId: String,
    reason: String,
})

export const banModel = model('banSchema', banSchema)
