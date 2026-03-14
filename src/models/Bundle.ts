import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

export interface BundleAttributes {
    id: string;
    handle: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    thumbnailUrl: string | null;
    isActive: boolean;
    updatedBy?: { name: string, role: string } | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export class Bundle extends Model<BundleAttributes> implements BundleAttributes {
    public id!: string;
    public handle!: string;
    public title!: string;
    public description!: string;
    public price!: number;
    public discount!: number;
    public thumbnailUrl!: string | null;
    public isActive!: boolean;
    public updatedBy!: { name: string, role: string } | null;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

Bundle.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    handle: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    thumbnailUrl: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    updatedBy: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Bundle',
    tableName: 'Bundle',
    timestamps: true
});

export interface BundleItemAttributes {
    id?: number;
    bundleId: string;
    sectionId: string;
    updatedBy?: { name: string, role: string } | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export class BundleItem extends Model<BundleItemAttributes> implements BundleItemAttributes {
    public id!: number;
    public bundleId!: string;
    public sectionId!: string;
    public updatedBy!: { name: string, role: string } | null;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

BundleItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bundleId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    sectionId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'BundleItem',
    tableName: 'BundleItem',
    timestamps: true
});

export default Bundle;
