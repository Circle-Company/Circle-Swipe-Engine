const { Model, DataTypes} = require('sequelize')

class Moment extends Model {
    static init(sequelize) {
        super.init({
            description: DataTypes.STRING(300),
            visible: DataTypes.BOOLEAN(),
            deleted: DataTypes.BOOLEAN(),
            blocked: DataTypes.BOOLEAN(),
        }, {
            sequelize,
            tableName: 'moments'
        })
    }

    static associate(models){
        this.hasOne(models.MomentInteraction, { foreignKey: 'moment_id', as: 'moment_interactions' })
        this.hasOne(models.MomentMidia, { foreignKey: 'moment_id', as: 'moment_midias' })
        this.hasOne(models.MomentMetadata, { foreignKey: 'moment_id', as: 'moment_metadatas' })
        this.hasOne(models.MomentStatistic, { foreignKey: 'moment_id', as: 'moment_statistics' })
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.hasMany(models.MomentComment, { foreignKey: 'moment_id', as: 'moment_comments' })
        this.belongsToMany(models.Tag, { through: 'MomentTag', foreignKey: 'moment_id', as: 'tags' });
        this.belongsToMany(models.Memory, { through: 'MemoryMoment', foreignKey: 'moment_id', as: 'memories' });
        this.hasMany(models.Like, { foreignKey: 'liked_moment_id', as: 'likes' });
    }
}
module.exports = Moment