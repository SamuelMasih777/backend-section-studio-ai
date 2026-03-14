import Section from './Section';
import Category from './Category';
import Tag from './Tag';
import Bundle, { BundleItem } from './Bundle';
import User from './User';
import Purchase from './Purchase';

// Associations
Bundle.hasMany(BundleItem, { foreignKey: 'bundleId', as: 'items' });
BundleItem.belongsTo(Bundle, { foreignKey: 'bundleId' });

BundleItem.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Section.hasMany(BundleItem, { foreignKey: 'sectionId' });

User.hasMany(Purchase, { foreignKey: 'userId', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'userId' });

Section.hasMany(Purchase, { foreignKey: 'sectionId', as: 'purchases' });
Purchase.belongsTo(Section, { foreignKey: 'sectionId' });

Bundle.hasMany(Purchase, { foreignKey: 'bundleId', as: 'purchases' });
Purchase.belongsTo(Bundle, { foreignKey: 'bundleId' });

export {
    Section,
    Category,
    Tag,
    Bundle,
    BundleItem,
    User,
    Purchase
};
