import { Sequelize } from 'sequelize';
import config from './config';

const sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    logging: false,
    define: {
        freezeTableName: true, // Prevent Sequelize from pluralizing table names
        timestamps: true      // Enable timestamps by default
    }
});

export default sequelize;
