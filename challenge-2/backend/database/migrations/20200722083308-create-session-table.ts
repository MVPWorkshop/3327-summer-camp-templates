import { QueryInterface } from 'sequelize';
import { SequelizeMigration } from '../../src/types/util.types';

const sessionTableMigration: SequelizeMigration = () => {
  const tableName = 'session';

  const up = (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.createTable(tableName, {
      sid: {
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      data: {
        type: Sequelize.TEXT,
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
  }

  const down = (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.dropTable(tableName, {cascade: true});
  }

  return {
    up,
    down
  }
}

module.exports = {
  ...sessionTableMigration()
}
