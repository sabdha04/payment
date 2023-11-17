'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pembayaran.init({
    user_id: DataTypes.INTEGER,
    proyek_id: DataTypes.INTEGER,
    jumlah_pembayaran: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Pembayaran',
  });
  return Pembayaran;
};