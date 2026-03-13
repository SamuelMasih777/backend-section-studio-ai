import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

export interface ProfileAttributes {
    id: string;
    display_name: string | null;
    email: string | null;
    role: string;
}

export class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public id!: string;
    public display_name!: string | null;
    public email!: string | null;
    public role!: string;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

Profile.init({
    id: {
        type: DataTypes.UUID, // Link to auth.users id
        primaryKey: true
    },
    display_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
}, {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true
});

export default Profile;
