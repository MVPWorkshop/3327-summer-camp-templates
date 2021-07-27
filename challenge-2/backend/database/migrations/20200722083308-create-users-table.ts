import { QueryInterface } from 'sequelize';
import { SequelizeMigration } from '../../src/types/util.types';

const usersTableMigration: SequelizeMigration = () => {
  const tableName = 'users';

  const up = (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.createTable(tableName, {
      wallet_address: {
        type: Sequelize.STRING(42),
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
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
  ...usersTableMigration()
};
