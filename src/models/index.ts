import Section from './Section';
import Category from './Category';
import Tag from './Tag';
import Bundle, { BundleItem } from './Bundle';
import User from './User';
import Purchase from './Purchase';
import SectionFile from './SectionFile';

// Associations
Bundle.hasMany(BundleItem, { foreignKey: 'bundleId', as: 'items' });
BundleItem.belongsTo(Bundle, { foreignKey: 'bundleId' });

BundleItem.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Section.hasMany(BundleItem, { foreignKey: 'sectionId' });

Section.hasMany(SectionFile, { foreignKey: 'sectionId', as: 'files' });
SectionFile.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

User.hasMany(Purchase, { foreignKey: 'userId', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'userId' });

Section.hasMany(Purchase, { foreignKey: 'sectionId', as: 'purchases', constraints: false });
Purchase.belongsTo(Section, { foreignKey: 'sectionId', constraints: false });

Bundle.hasMany(Purchase, { foreignKey: 'bundleId', as: 'purchases', constraints: false });
Purchase.belongsTo(Bundle, { foreignKey: 'bundleId', constraints: false });

export {
    Section,
    Category,
    Tag,
    Bundle,
    BundleItem,
    User,
    Purchase,
    SectionFile
};
