const { Model, DataTypes} = require('sequelize')

class Share extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER(),
            liked_moment_id: DataTypes.INTEGER(),
        },      {
            sequelize,
            modelName: 'Share',
            tableName: 'skips',
          })
    }

    static associate(models){
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'who_shared',
        });

        this.belongsTo(models.Moment, {
            foreignKey: 'shared_moment_id',
            as: 'shared_moment',
        });
    }
}
module.exports = Share