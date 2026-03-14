import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

export interface SectionAttributes {
    id: string;
    handle: string;
    title: string;
    description: string;
    price: number;
    category: string;
    tags: string[];
    thumbnailUrl: string | null;
    previewImages: string[];
    previewVideoUrl: string | null;
    demoUrl: string | null;
    isFeatured: boolean;
    isPublished: boolean;
    sortOrder: number;
    compareAtPrice: number | null;
    presetsCount: number;
    updatedBy?: { name: string, role: string } | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export class Section extends Model<SectionAttributes> implements SectionAttributes {
    public id!: string;
    public handle!: string;
    public title!: string;
    public description!: string;
    public price!: number;
    public category!: string;
    public tags!: string[];
    public thumbnailUrl!: string | null;
    public previewImages!: string[];
    public previewVideoUrl!: string | null;
    public demoUrl!: string | null;
    public isFeatured!: boolean;
    public isPublished!: boolean;
    public sortOrder!: number;
    public compareAtPrice!: number | null;
    public presetsCount!: number;
    public updatedBy!: { name: string, role: string } | null;

    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

Section.init({
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
    category: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    thumbnailUrl: {
        type: DataTypes.STRING
    },
    previewImages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    previewVideoUrl: {
        type: DataTypes.STRING
    },
    demoUrl: {
        type: DataTypes.STRING
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    compareAtPrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    presetsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    updatedBy: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Section',
    tableName: 'Section',
    timestamps: true
});

export default Section;
