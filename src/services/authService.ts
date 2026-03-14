import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import CustomError from '../models/CustomError';
import constants from '../models/constants';
import config from '../models/config';

class AuthService {
    async signup(userData: any) {
        const { email, password, displayName } = userData;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new CustomError('User already exists', constants.httpStatus.badRequest);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({
            email,
            password: hashedPassword,
            display_name: displayName || email.split('@')[0],
            role: constants.roles.admin,
            isSuperAdmin: false
        });

        return user;
    }

    async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new CustomError('Invalid credentials', constants.httpStatus.unauthorized);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError('Invalid credentials', constants.httpStatus.unauthorized);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, isSuperAdmin: user.isSuperAdmin, display_name: user.display_name },
            config.jwtSecretKey,
            { expiresIn: '24h' }
        );

        return { 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role, 
                display_name: user.display_name,
                isSuperAdmin: user.isSuperAdmin
            } 
        };
    }
}

export default new AuthService();
