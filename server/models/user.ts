import {model, Schema} from "mongoose";
import {UserDocument} from "../types/user.interface";
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const userSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: [
            true,
            'Kullanıcı adı alanı boş bırakılamaz!'
        ]
    },
    email: {
        type: String,
        required: [
            true,
            'E-Posta alanı boş bırakılamaz!'
        ],
        validate: [validator.isEmail, 'Geçersiz bir e-posta adresi girdiniz!'],
        createIndexes: {
            unique: true
        }
    },
    password: {
        type: String,
        required: [
            true,
            'Parola alanı boş bırakılamaz!'
        ],
        select: false
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err as Error);
    }
})

userSchema.methods.validatePassword = function (password: string) {
    return bcryptjs.compare(password, this.password);
}

export default model<UserDocument>('User', userSchema);
