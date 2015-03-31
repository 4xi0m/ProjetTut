<?php

	//	file : Script.class.php
	//	brief :  Class modelizing a script HTML tag
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Script
	//	brief :  Class modelizing a script HTML tag
	//====================================================================================================

	class  Script extends HTMLComponent
	{
		protected $m_attributes;				//	String[]
		protected $m_content;				//	String




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_attributes : tag's attributes
		//	type : p_attributes is an array
		//	param[in] p_content : tag's content
		//	type : p_content is a string
		//	return : void
		public function __construct($p_attributes, $p_content = '')	{
			Debug::type(__METHOD__, 'is_array($p_attributes)', is_array($p_attributes));

			parent::__construct();
			$this->m_attributes = $p_attributes;
			$this->m_content = $p_content;
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : generate
		//	brief : generates the script's HTML code
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
			echo($tabulations.'<script'.$attributes.'>'."\n");
			if($this->m_content != '')	{
				echo($tabulations.'	'.$this->m_content."\n");
			}
			echo($tabulations.'</script>'."\n");
		}
	}

?>