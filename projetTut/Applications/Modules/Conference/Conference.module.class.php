<?php

	//	file : Login.class.php
	//	brief :  exemple de formulaire
	//	author : Matthieu JABBOUR
	//	version : 0.1
	//	date : 2014/10/13



	include_once('Conference.view.class.php');
	include_once('Conference.model.class.php');



	//====================================================================================================
	//	name : TestForm
	//	brief :  exemple de formulaire
	//====================================================================================================
	class Conference extends Module
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
			$model = new ConferenceModel();
			$view = new ConferenceView($model);
			parent::__construct($model, $view, array(
				new Script(array('type' => 'text/javascript', 'src' => $this->getPath().'socket.io.js'))
			));
		}




		//	name : __destruct
		//	brief : destructeur de la classe
		//	return : void
		public function __destruct()	{
			parent::__destruct();
		}



		public function execute($options = array())	{
		}
	}

?>