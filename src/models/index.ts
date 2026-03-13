import Section from './Section';
import Category from './Category';
import Tag from './Tag';
import Bundle, { BundleItem } from './Bundle';
import User from './User';

// Associations
Bundle.hasMany(BundleItem, { foreignKey: 'bundleId', as: 'items' });
BundleItem.belongsTo(Bundle, { foreignKey: 'bundleId' });

BundleItem.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Section.hasMany(BundleItem, { foreignKey: 'sectionId' });

export {
    Section,
    Category,
    Tag,
    Bundle,
    BundleItem,
    User
};
