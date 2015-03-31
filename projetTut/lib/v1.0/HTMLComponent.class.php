<?php

	//	file : HTMLComponent.class.php
	//	brief :  Abstract class modelizing an HTML component
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : HTMLComponent
	//	brief :  Abstract class modelizing an HTML component
	//====================================================================================================

	abstract class  HTMLComponent
	{
		//	name : __construct
		//	brief : class constructor
		//	return : void
		public function __construct()	{
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : generate
		//	brief : generates the component's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	return : void
		abstract public function generate($tabulations);
	}

?>