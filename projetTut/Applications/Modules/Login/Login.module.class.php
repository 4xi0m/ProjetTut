<?php

	//	file : Login.class.php
	//	brief :  exemple de formulaire
	//	author : Matthieu JABBOUR
	//	version : 0.1
	//	date : 2014/10/13



	include_once('Login.view.class.php');
	include_once('Login.model.class.php');



	//====================================================================================================
	//	name : TestForm
	//	brief :  exemple de formulaire
	//====================================================================================================
	class Login extends Module
	{
		//	name : invariants
		//	brief : vérification des invariants de la classe
		//	return : void
		protected function invariants()	{
		}





		//	name : __construct
		//	brief : constructeur de la classe
		//	param[in] options : options d'exécution pour les contrôleurs
		//	return : void
		public function __construct($options = NULL)	{
			$model = new LoginModel();
			$view = new LoginView($model);
			parent::__construct($model, $view, array());
		}




		//	name : __destruct
		//	brief : destructeur de la classe
		//	return : void
		public function __destruct()	{
			parent::__destruct();
		}



		public function execute($options = array())	{

			$post = Security::secure($_POST);
			$session = Security::secure($_SESSION);
			$errors = array();
			$password = 'bonjour';
			$id = 'admin';



			if(isset($session['id']) && isset($session['password']))	{
				if($session['password'] == $password && $session['id'] == $id)	{
					header("Location: http://127.0.0.1:81/projects/projetTut/admin");
				}
				else	{
				}
			}
			if(isset($post['id']) && isset($post['password']))	{
				if($post['password'] == $password && $post['id'] == $id)	{
					$_SESSION['id'] = $id;
					$_SESSION['password'] = $password;
					header("Location: http://127.0.0.1:81/projects/projetTut/admin");
				}
				else	{
					$errors['status'] = -1;
				}
			}
			$this->m_controlOutputs = ($errors);
		}
	}

?>