import { QueryInterface } from 'sequelize';
import { SequelizeMigration } from '../../src/types/util.types';

const subscriptionsTableMigration: SequelizeMigration = () => {
  const tableName = 'subscriptions';

  const up = (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false
      },
      wallet_address: {
        type: Sequelize.STRING(42),
        allowNull: true,
        unique: true,
        references: {
          model: 'users',
          key: 'wallet_address'
        }
      },
      mail_subscribed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  };

  const down = (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.dropTable(tableName, {cascade: true});
  };

  return {
    up,
    down
  }
};

module.exports = {
  ...subscriptionsTableMigration()
};
