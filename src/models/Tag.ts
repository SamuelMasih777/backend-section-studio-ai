import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

export interface TagAttributes {
    handle: string;
    name: string;
    emoji: string | null;
    imageUrl: string | null;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
}

export class Tag extends Model<TagAttributes> implements TagAttributes {
    public handle!: string;
    public name!: string;
    public emoji!: string | null;
    public imageUrl!: string | null;
    public description!: string | null;
    public sortOrder!: number;
    public isActive!: boolean;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

Tag.init({
    handle: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emoji: {
        type: DataTypes.STRING
    },
    imageUrl: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Tag',
    tableName: 'Tag',
    timestamps: true
});

export default Tag;
