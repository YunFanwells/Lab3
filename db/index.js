const { Sequelize, DataTypes,Op } = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "db/db.sqlite", // 或 ':memory:'
  dialectOptions: {},
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    }
});

const Games = sequelize.define('Games', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull:false
    },
    price:{
        type: DataTypes.STRING,
        allowNull:false
    },
    cover:{
        type: DataTypes.STRING,
        allowNull:false
    },
    publisher:{
        type: DataTypes.STRING,
        allowNull:false
    },
    language:{
        type: DataTypes.STRING,
        allowNull:false
    },
    isbn:{
        type: DataTypes.STRING,
        allowNull:true
    },
    author:{
        type: DataTypes.STRING,
        allowNull:true
    },
    size:{
        type: DataTypes.STRING,
        allowNull:true
    },
    use:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:true
    }
});

const Code = sequelize.define('code',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: DataTypes.STRING,
    },
    code:{
        type: DataTypes.NUMBER,
    }
})

const Log=sequelize.define('log',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull:true
    },
    action:{
        type:DataTypes.STRING
    }
})
module.exports = {
    User,
    Games,
    Code,
    Log,
    sequelize
}
