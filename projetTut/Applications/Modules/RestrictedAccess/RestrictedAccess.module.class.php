<?php

	//	file : Login.class.php
	//	brief :  exemple de formulaire
	//	author : Matthieu JABBOUR
	//	version : 0.1
	//	date : 2014/10/13



	include_once('RestrictedAccess.model.class.php');



	//====================================================================================================
	//	name : TestForm
	//	brief :  exemple de formulaire
	//====================================================================================================
	class RestrictedAccess extends Module
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
			$model = new RestrictedAccessModel();
			$view = NULL;
			parent::__construct($model, $view, array());
		}




		//	name : __destruct
		//	brief : destructeur de la classe
		//	return : void
		public function __destruct()	{
			parent::__destruct();
		}



		public function execute($options = array())	{

			$session = Security::secure($_SESSION);

			if(isset($session['id']) && isset($session['password']))	{
				if(!($session['password'] == $this->m_model->get('password') && $session['id'] == $this->m_model->get('id')))	{
					header("Location: http://127.0.0.1:81/projects/projetTut/");
				}
				else	{
				}
			}
		}
	}

?>