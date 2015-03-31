<?php

	//	file : Link.class.php
	//	brief :  Class modelizing a link HTML tag
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Link
	//	brief :  Class modelizing a link HTML tag
	//====================================================================================================

	class  Link extends HTMLComponent
	{
		protected $m_attributes;				//	String[]




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_attributes : tag's attributes
		//	type : p_attributes is an array
		//	return : void
		public function __construct($p_attributes)	{
			Debug::type(__METHOD__, 'is_array($p_attributes)', is_array($p_attributes));

			parent::__construct();
			$this->m_attributes = $p_attributes;
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : generate
		//	brief : generates the link's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	return : void
		public function generate($tabulations)	{
			Debug::type(__METHOD__, 'is_string($tabulations)', is_string($tabulations));

			//	m_attributes serialization
			$attributes = '';
			foreach($this->m_attributes as $attribute => $value)	{
				$attributes = $attributes.' '.$attribute.'="'.$value.'"';
			}
			echo($tabulations.'<link'.$attributes.'>'."\n");
		}
	}

?>