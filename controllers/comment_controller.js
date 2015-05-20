//IGUAL QUE EL CONTROLLER DEL QUIZ; PERO SOLO PARA LOS COMMENTS TIENE SU PROPOPIO CONTROLADOR

var models= require('../models/models.js');

//GET /quizes/:quizId/comments/new

exports.new = function(req,res){
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments

exports.create = function(req,res){
  var comment= models.Comment.build(
	{texto: req.body.comment.texto,
	 QuizId: req.params.quizId 	// La relacion belongsTo de Comment añade un parametro :quizId adicional a cada elemento de la tabla COmments que indica el quiz asociado, se utilizada el nombre :quizId definido en la ruta routes(indez.js, salvo que se indique otro nombre
  });
  
  comment
  .validate()
  .then(
	function(err){
		if (err) {
		res.render('comments/new.ejs', {comment: comment, errors: err.errors});
		} else {
		  comment //Save, guarda en DB campo text de comment
		  .save()
		  .then( function(){ res.redirect('/quizes/'+req.params.quizId)})
		} //res.redirect redireccion HTTP a lista de preguntas
	}
    
  ).catch(function(error){next(error)});

};
