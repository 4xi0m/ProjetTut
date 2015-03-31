<?php

	//	file : Block.class.php
	//	brief :  Abstract class modelizing a function block in a web application
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Block
	//	brief :  Abstract class modelizing a function block in a web application
	//====================================================================================================

	abstract class  Block
	{
		protected $m_settings;												//	HTMLComponent&[]




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_settings : global settings to assign to the block
		//	type : p_settings is an array
		//	return : void
		public function __construct(&$p_settings)	{
			Debug::type(__METHOD__, 'is_array($p_settings)', is_array($p_settings));

			$this->m_settings = $p_settings;
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : getSettings
		//	brief : m_settings getter
		//	return : HTMLComponent&[]
		public function getSettings()	{
			return $this->m_settings;
		}




		//	name : execute
		//	brief : executes the block's processes
		//	param[in] options : execution options
		//	type : options is an array
		//	return : void
		abstract public function execute($options);




		//	name : generate
		//	brief : generates the block's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	return : void
		abstract public function generate($tabulations);
	}

?>