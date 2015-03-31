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
	class  ConferenceView extends View
	{
		//	name : __construct
		//	brief : constructeur de la classe
		//	param[in] p_data : données à attribuer au modèle
		//	postcondition : m_data est bien initialisé à p_data
		//	return : void
		public function create($errors)	{

			$main = new Tag('div', array('id' => 'mainDiv'));

				$table = new Tag('table', array('border' => '1', 'width' => '100%'));

					$tr = new Tag('tr');
						$tr->add(new Tag('th', array(), 'Local video'));
						$tr->add(new Tag('th', array(), 'Remote video'));
					$table->add($tr);

					$tr = new Tag('tr');
						$td = new Tag('td');
							$td->add(new Tag('video', array('id' => 'localVideo', 'autoplay' => '')));
							$td->add(new Tag('video', array('id' => 'remoteVideo', 'autoplay' => '')));
						$tr->add($td);
					$table->add($tr);

					$tr = new Tag('tr');
						$td = new Tag('td', array('align' => 'center'));
							$td->add(new Tag('textarea', array('rows' => '4', 'cols' => '60', 'id' => 'dataChannelSend', 'disabled' => '', 'placeholder' => 'This will be enabled once the data channel is up...')));
						$tr->add($td);
						$td = new Tag('td', array('align' => 'center'));
							$td->add(new Tag('textarea', array('rows' => '4', 'cols' => '60', 'id' => 'dataChannelReceive', 'disabled' => '')));
						$tr->add($td);
					$table->add($tr);

					$tr = new Tag('tr');
						$td = new Tag('td', array('align' => 'center'));
							$td->add(new Tag('button', array('id' => 'sendButton', 'disabled' => ''), 'Send'));
						$tr->add($td);
					$table->add($tr);

				$main->add($table);

				$div = new Tag('div', array('id' => 'clients'));
				$main->add($div);


			$this->add($main);
			$this->add(new Script(array('type' => 'application/javascript', 'src' => './Applications/Modules/Conference/adapter.js')));
			$this->add(new Script(array('type' => 'application/javascript', 'src' => './Applications/Modules/Conference/fullApp.js')));
		}
	}

?>