import { DataTypes, Model } from 'sequelize';
import sequelize from './db';
import User from './User';
import Section from './Section';
import Bundle from './Bundle';

export interface PurchaseAttributes {
    id?: string;
    userId: string;
    sectionId?: string | null;
    bundleId?: string | null;
    chargeId: string; // From Shopify Billing API
    amount: number;
    currency: string;
    status: string; // e.g., 'active', 'declined', 'expired'
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export class Purchase extends Model<PurchaseAttributes> implements PurchaseAttributes {
    public id!: string;
    public userId!: string;
    public sectionId!: string | null;
    public bundleId!: string | null;
    public chargeId!: string;
    public amount!: number;
    public currency!: string;
    public status!: string;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

Purchase.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    sectionId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    bundleId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    chargeId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
}, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'Purchases',
    timestamps: true
});

export default Purchase;
