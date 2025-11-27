import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Subject = sequelize.define("Subject", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

export default Subject;

