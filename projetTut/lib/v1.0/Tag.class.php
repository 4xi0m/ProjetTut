<?php

	//	file : Tag.class.php
	//	brief :  Class modelizing a common HTML tag
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Tag
	//	brief :  Class modelizing a common HTML tag
	//====================================================================================================

	class  Tag extends HTMLComponent
	{
		protected $m_tag;						//	String
		protected $m_attributes;				//	String[]
		protected $m_content;					//	String
		protected $m_components;				//	HTMLComponent&[]




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_tag : name of the HTML tag
		//	type : p_tag is a string
		//	param[in] p_attributes : tag's attributes
		//	type : p_attributes is an array
		//	param[in] p_content : tag's content
		//	type : p_content is a string
		//	return : void
		public function __construct($p_tag, $p_attributes = array(), $p_content = '')	{
			Debug::type(__METHOD__, 'is_string($p_tag)', is_string($p_tag));
			Debug::type(__METHOD__, 'is_array($p_attributes)', is_array($p_attributes));
			Debug::type(__METHOD__, 'is_string($p_content)', is_string($p_content));

			parent::__construct();
			$this->m_tag = $p_tag;
			$this->m_attributes = $p_attributes;
			$this->m_content = $p_content;
			$this->m_components = array();
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : add
		//	brief : adds an HTML component to the current HTML component
		//	param[in] p_component : HTML component to add
		//	type : p_component is a HTMLComponent
		//	return : void
		public function add(&$p_component)	{
			Debug::type(__METHOD__, '$p_component instanceof HTMLComponent', $p_component instanceof HTMLComponent);

			$this->m_components[] = $p_component;
		}




		//	name : setAttribute
		//	brief : sets a new value to the given attribute for the current HTML component
		//	param[in] p_attribute : attribute to set
		//	param[in] p_value : value of the attribute
		//	type : p_attribute is a string
		//	type : p_value is a string
		//	return : void
		public function setAttribute($p_attribute, $p_value)	{
			Debug::type(__METHOD__, 'is_string($p_attribute)', is_string($p_attribute));
			Debug::type(__METHOD__, 'is_string($p_value)', is_string($p_value));

			$this->m_attributes[$p_attribute] = $p_value;
		}




		//	name : generate
		//	brief : generates the component's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	return : void
		public function generate($tabulations)	{
			Debug::type(__METHOD__, 'is_string($tabulations)', is_string($tabulations));

			$singleTags = array('input', 'br', 'hr', 'img', 'meta', 'link');

			//	m_attributes serialization
			$attributes = '';
			foreach($this->m_attributes as $attribute => $value)	{
				$attributes = $attributes.' '.$attribute.'="'.$value.'"';
			}

			//	<tag> type HTML tags
			if(in_array($this->m_tag, $singleTags))	{
				echo($tabulations.'<'.$this->m_tag.' '.$attributes.'>'."\n");
			}

			//	<tag></tag> type HTML tags
			else{
				echo($tabulations.'<'.$this->m_tag.$attributes.">\n");
				if($this->m_content != '')	{
					echo($tabulations.'	'.$this->m_content."\n");
				}
				foreach($this->m_components as $component)	{
					$component->generate($tabulations.'	');
				}
				echo($tabulations.'</'.$this->m_tag.">\n");
			}
		}
	}

?>