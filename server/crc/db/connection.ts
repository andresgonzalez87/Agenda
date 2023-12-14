import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'diary',
  username: 'root',
  password: 'fidel', 
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
