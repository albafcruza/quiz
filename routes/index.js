
var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController= require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Quiz', errors: [] });
});


//Autoload de comandos con quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);
router.param('userId', userController.load);

//DEFINICION RUTAS DE SESION
router.get('/login', sessionController.new); //Formulario de login
router.post('/login', sessionController.create); //Crear sesion nueva
router.get('/logout', sessionController.destroy); //Destruir sesion

//DEFINICION RUTAS DE CUENTA
//OWNERSHIPREQUIERED, COMPRUEBA SI EL USUARIO QUE ACCEDE TIENE DERECHOS PARA REALIZAR LA OPERACION

router.get('/user', userController.new); 
router.post('/user', userController.create); //REGISTRAR USUARIO
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired,  userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes',  quizController.index);     // ver las preguntas de un usuario


//DEFINICION RUTAS DR /QUIZES

router.get('/quizes', 			quizController.index);
router.get('/quizes/:quizId(\\d+)',	 quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

//AÑADIMOS .SESSION... DELANTE DE CONTROLADORES DE ACCEDOS QUE NECESITEN AUTENTICACION, IMPIDE QUE LOS USUARIOS SIN SESION CREEN EDITEN O BORREN

router.get('/quizes/new', 		sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, multer({ dest: './public/media/'}), quizController.create);

router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.ownershipRequired,  quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired,  quizController.ownershipRequired, multer({ dest: './public/media/'}), quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);


//COMENTARIOS


router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new); //Accede al formulario de crear comentariom asociado a cada quizId
router.post('/quizes/:quizId(\\d+)/comments', commentController.create); //Crea una nueva entrada en la tabla comments asociada a quizId en Quiz
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.ownershipRequired,  commentController.publish); //Accede al formulario de crear comentariom asociado a cada quizId




router.get('/creditos/author', quizController.author);

module.exports = router;
