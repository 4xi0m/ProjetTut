<?php

	//	file : TestFormView.class.php
	//	brief :  Classe abstraite modélisant la gestion des modèles d'une application web
	//	author : Matthieu JABBOUR
	//	version : 0.2
	//	date : 2014/05/18



	//====================================================================================================
	//	name : TestFormView
	//	brief :  Classe abstraite modélisant la gestion des modèles d'une application web
	//====================================================================================================
	class  LoginView extends View
	{
		//	name : __construct
		//	brief : constructeur de la classe
		//	param[in] p_data : données à attribuer au modèle
		//	postcondition : m_data est bien initialisé à p_data
		//	return : void
		public function create($errors)	{

			$form = new Tag('form', array('id' => 'login', 'method' => 'POST', 'action' => ''));

				if(isset($errors['status']))	{
					$form->add(new Tag('p', array(), 'Bad password.'));
				}
				$form->add(new Tag('input', array('type' => 'text', 'name' => 'id', 'value' => 'id')));
				$form->add(new Tag('input', array('type' => 'password', 'name' => 'password', 'value' => 'password')));
				$form->add(new Tag('input', array('type' => 'submit'), 'Envoyer'));

			$this->add($form);
		}
	}

?>