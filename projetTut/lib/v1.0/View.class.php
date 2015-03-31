<?php

	//	file : View.class.php
	//	brief :  Abstract class modelizing views in a web application
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : View
	//	brief :  Abstract class modelizing views in a web application
	//====================================================================================================

	abstract class  View
	{
		protected $m_components;				//	HTMLComponent&[]
		protected $m_model;							//	Model&




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_model : model to assign to the view
		//	type : p_model is a Model, or is NULL
		//	return : void
		public function __construct(&$p_model)	{
			Debug::type(__METHOD__, '$p_model instanceof Model || is_null($p_model)', $p_model instanceof Model || is_null($p_model));

			$this->m_model = $p_model;
			$this->m_components = array();
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : setModel
		//	brief : m_model setter
		//	param[in] p_model : model to assign to the view
		//	type : p_model is a Model
		//	return : void
		public function setModel(&$p_model)	{
			Debug::type(__METHOD__, '$p_model instanceof Model', $p_model instanceof Model);

			unset($this->m_model);						//	Destruction of the previous reference to avoid any conflict with the new one
			$this->m_model = $p_model;
		}




		//	name : add
		//	brief : adds an HTML component to the view
		//	param[in] p_component : HTML component to add
		//	type : p_component is a HTMLComponent
		//	return : void
		public function add(&$p_component)	{
			Debug::type(__METHOD__, '$p_component instanceof HTMLComponent', $p_component instanceof HTMLComponent);

			$this->m_components[] = $p_component;
		}




		//	name : create
		//	brief : creates the view
		//	param[in] errors : generated errors by the controller
		//	return : void
		abstract protected function create($errors);




		//	name : generate
		//	brief : generates the view's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	param[in] errors : generated errors by the controller
		//	type : errors is an array
		//	return : void
		public function generate($tabulations, $errors)	{
			Debug::type(__METHOD__, 'is_string($tabulations)', is_string($tabulations));
			Debug::type(__METHOD__, 'is_array($errors)', is_array($errors));

			$this->create($errors);
			foreach($this->m_components as $component)	{
				$component->generate($tabulations);
			}
		}
	}

?>