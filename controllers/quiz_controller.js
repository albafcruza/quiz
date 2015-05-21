var models = require('../models/models.js');


// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
	var objQuizOwner = req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if (isAdmin || objQuizOwner === logUser) {// PUEDE MODIFICAR EDITAR/DESTRUIR QUIZES SI ERES ADMIN O PROP DEL QUIZ
		next();
	} else {
    		res.redirect('/');
	}
};




// Autoload :id
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: { 
		   id: Number(quizId) //Indica buscar el quiz identificado por quizId
		},
		include: [{
			model: models.Comment //Ademas con este, solicita cargar en la propiendad quiz.Comments los comentarios asoaciados al quiz a traves de la relacion 1-N entre Quiz y Comment
		}]
	}).then(function(quiz){
		  
		if (quiz) {
			req.quiz = quiz;
			next();
		} else{
			next(new Error('No existe quizId=' + quizId))}
		}
	).catch(function(error){next(error)});
};




//AAHORA ATIENDE A 2 PRIMITIVAS YDECIDE SI BUSCAR MIS PREGUNTAS O TODAS LAS PREGUNTAS, BUSCA MIS PREGUNTAS CUANDO EXISTA LA VARIABLE REQ.USER CUANDO LA RUTA LLEVA EL PARAM :USERID

// GET /quizes
exports.index = function(req, res) {
 	 var options = {};
  	 if(req.user){
   	 options.where = {UserId: req.user.id}
  	}	

	models.Quiz.findAll(options).then(	
	function(quizes) {
	res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	}
   ).catch(function(error){next(error)});
};


// GET /quizes/:id
exports.show = function(req, res) {
res.render('quizes/show', { quiz: req.quiz, errors: []});
}; // req.quiz: instancia de quiz cargada con autoload


// GET /quizes/:id/answer
exports.answer = function(req, res) {
var resultado = 'Incorrecto';
if (req.query.respuesta === req.quiz.respuesta) {
resultado = 'Correcto';
}
res.render(
'quizes/answer',
{ quiz: req.quiz,
respuesta: resultado,
errors: []
}
);
};


// GET /quizes/new
exports.new = function(req, res) {
var quiz = models.Quiz.build( // crea objeto quiz
{pregunta: "Pregunta", respuesta: "Respuesta"}
);
res.render('quizes/new', {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function(req, res) {
	req.body.quiz.UserId = req.session.user.id;// SE AÑADE EL CAMPO USER ID GUARDADO EN LA SESIONA L OBJETO REQ.BODY.QUIZ DEL FORMULARIO DE CREACION DE QUIZ3S
	if(req.files.image){
		req.body.quiz.image = req.files.image.name; //	Si el quiz inclye imagen su referencia se añade al objeto quiz que se guarda en la DB

	}	
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz
	.validate()
	.then(
		function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			quiz // save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["pregunta", "respuesta", "UserId", "image"]})//DEBE GUARDARSE EL CAMPO USER ID DE CADA QUIZ
			.then( function(){ res.redirect('/quizes')})
		} // res.redirect: Redirección HTTP a lista de preguntas
	}
    );
};



// GET /quizes/:id/edit
exports.edit = function(req, res) {
var quiz = req.quiz; // req.quiz: autoload de instancia de quiz
res.render('quizes/edit', {quiz: quiz, errors: []});
};


// PUT /quizes/:id
exports.update = function(req, res) {

	if(req.files.image){
		req.quiz.image = req.files.image.name;	
	}	
	
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz
		.validate()
		.then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz // save: guarda campos pregunta y respuesta en DB
				.save( {fields: ["pregunta", "respuesta", "image"]})
				.then( function(){ res.redirect('/quizes');});
			} // Redirección HTTP a lista de preguntas (URL relativo)
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
	res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

// GET /creditos/author
exports.author = function(req, res) {
	res.render('creditos/author', {titulo:  'Almudena Garbayo y Alba Fernández ', errors: []});
};
