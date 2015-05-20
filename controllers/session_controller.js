
// MW de autorización de accesos HTTP restringidos, para solo dejar continuar al usuario si esta autenticado para ciertas operaciones borrar, editar...
exports.loginRequired = function(req, res, next){
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};


// Get /login FORMULARIO DE LOGIN

exports.new = function(req,res){
	
	var errors = req.session.errors || {} ;
	req.session.errors = {};

	res.render('sessions/new', { errors: errors});
};

//AL CREAR O DESTRUIR SESION  SE REDIRECCIONA A LA RUTA GUARDADA EN REQ.SESION.REDIR SE VUELVE A LA PAGINA DESDE LA QUE SE REALIZA EL LOGIN O LOGOUT


//POST /login CREAR LA SESION

exports.create = function(req,res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

		if (error) { // si hay error retornamos mensajes de error de sesión
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
		return;
		}
		
		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user


	req.session.user = {id:user.id, username:user.username};
	res.redirect(req.session.redir.toString());// redirección a path anterior a login
	
    });
};
// DELETE /logout DESTUIR SESION
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};




