//PARA EL CONTROL DE USUARIOS, LA GESTION ES SIMPLE, SE BASA EN TENER 2 USUARIOS REGISTRADOS PREDEFINIDOS EN LA VARIABLE USERS, CONTROLADOR AUTENTICAR COMPRUEBA SI EL USUARIO ESTA INCLUIDO EN EL OBJETO DE LA VARIABLE USERS Y SI EL PASSWORD ES CORRECTO

var models = require('../models/models.js');

// Comprueba si el usuario esta registrado en users
//AUTENTICAR BUSCA AL USUARIO EN LA BASE DE DAOOS Y VERIFICA LA PALABRA DE PASO CON EL METODO VERIFYPASSWORD DEFNINIDO USER.JS
// Si autenticación falla o hay errores se ejecuta callback(error).

exports.autenticar = function(login, password, callback) {
	models.User.find({
		where: {
		username: login
		}
	}).then(function(user) {
		if (user) {
			if(user.verifyPassword(password)){
				callback(null, user);
		}
		else { callback(new Error('Password erróneo.')); }
	} else { callback(new Error('No existe user=' + login))}
    }).catch(function(error){callback(error)});
};
