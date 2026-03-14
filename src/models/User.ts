import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

export interface UserAttributes {
    id?: string;
    email: string;
    password?: string;
    display_name?: string | null;
    role: string;
    isSuperAdmin: boolean;
    updatedBy?: { name: string, role: string } | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: string;
    public email!: string;
    public password!: string;
    public display_name!: string | null;
    public role!: string;
    public isSuperAdmin!: boolean;
    public updatedBy!: { name: string, role: string } | null;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    updatedBy: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
});

export default User;
