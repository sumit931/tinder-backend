import mongoose from 'mongoose';
const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

cardSchema.index({ name: 1 }, { unique: true });
cardSchema.index({ url: 1 }, { unique: true });

const Card = mongoose.model('Card', cardSchema);

export default Card;
