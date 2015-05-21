// Definición del modelo de quiz

module.exports = function(sequelize, DataTypes) {
return sequelize.define('Quiz',
	{ pregunta: {
			type:DataTypes.STRING,		
			validate:{notEmpty: {msg :"->Falta pregunta"}}
	},
	
	respuesta: {
			type:DataTypes.STRING,
			validate:{notEmpty: {msg :"->Falta respuesta"}}
		},

	image: {
		type: DataTypes.STRING //NUEVO CAMPO GUARDA EL NOMBRE DEL FICHERO EN EL DIRECTORIO PUBLIC/MEDIA
		}
	}
   );
}
