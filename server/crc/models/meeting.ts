import { DataTypes } from "sequelize"
import  sequelize  from "../db/connection"

export const Meeting = sequelize.define('meeting',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING
    },
    detail: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME, 
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});