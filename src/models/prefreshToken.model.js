import mongoose from 'mongoose';

const prefreshTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            unique: true,
        },
        prefreshToken: {
            type: String,
            require: true,
            unique: true,
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('prefreshToken', prefreshTokenSchema);
