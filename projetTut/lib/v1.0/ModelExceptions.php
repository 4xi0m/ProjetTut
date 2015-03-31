<?php

	//	file : ModelExceptions.php
	//	brief :  Exception classes thrown by Model class
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : SQLException
	//	brief :  Exception lancée si une opération SQL n'est pas valide
	//====================================================================================================

	class SQLException extends Exception
	{
		//	name : __construct
		//	brief : constructeur de la classe
		//	param[in] message : message décrivant l'exception
		//	param[in] code : code  correspondant à l'exception
		//	return : void
		public function __construct($message, $code)
		{
			parent::__construct($message, $code);
		}
	}

?>