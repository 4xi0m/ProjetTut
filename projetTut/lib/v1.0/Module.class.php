<?php

	//	file : Module.class.php
	//	brief :  Abstract class modelizing a module in a web application
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Module
	//	brief :  Abstract class modelizing a module in a web application
	//====================================================================================================

	abstract class  Module extends Block
	{
		public static $path = 'Applications/Modules';			//	String
		protected $m_model;												//	Model&
		protected $m_view;												//	View&
		protected $m_controlOutputs;									//	String[]




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_model : model to assign to the module
		//	type : p_model is a Model
		//	param[in] p_view : model to assign to the module
		//	type : p_view is a View
		//	param[in] p_settings : global settings to assign to the module
		//	type : p_settings is an array
		//	return : void
		public function __construct(&$p_model, &$p_view, $p_settings)	{
			Debug::type(__METHOD__, '$p_model instanceof Model || is_null($p_model)', $p_model instanceof Model || is_null($p_model));
			Debug::type(__METHOD__, '$p_view instanceof View || is_null($p_view)', $p_view instanceof View || is_null($p_view));

			parent::__construct($p_settings);
			$this->m_model = $p_model;
			$this->m_view = $p_view;
			$this->m_controlOutputs = array();
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : getPath
		//	brief : returns the current module's directory full path
		//	return : String
		public static function getPath()	{
			return Module::$path.'/'.get_called_class().'/';
		}




		//	name : generate
		//	brief : generates the module's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	return : void
		public function generate($tabulations)	{
			if($this->m_view != NULL)	{
				$this->m_view->generate($tabulations, $this->m_controlOutputs);
			}
		}
	}

?>