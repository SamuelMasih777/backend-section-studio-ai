import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

export interface SectionFileAttributes {
    id: string;
    sectionId: string;
    filename: string;
    fileType: string;
    fileUrl: string;
    fileSize: number | null;
    sortOrder: number;
}

export class SectionFile extends Model<SectionFileAttributes> implements SectionFileAttributes {
    public id!: string;
    public sectionId!: string;
    public filename!: string;
    public fileType!: string;
    public fileUrl!: string;
    public fileSize!: number | null;
    public sortOrder!: number;
}

SectionFile.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sectionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'SectionFile',
        tableName: 'SectionFile',
        timestamps: false, // The Supabase schema does not have created_at/updated_at for this table currently
    }
);

export default SectionFile;
