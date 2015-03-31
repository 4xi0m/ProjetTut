<?php

	//	file : Comment.class.php
	//	brief :  Class modelizing an HTML comment
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Comment
	//	brief :  Class modelizing an HTML comment
	//====================================================================================================

	class Comment extends HTMLComponent
	{
		protected $m_content;				//	String




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_content : comment's content
		//	type : p_content is a string
		//	return : void
		public function __construct($p_content = '')	{
			Debug::type(__METHOD__, 'is_string($p_content)', is_string($p_content));

			parent::__construct();
			$this->m_content = $p_content;
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : generate
		//	brief : generates the comment's HTML code
		//	param[in] tabulations : tabulations in the generated HTML code
		//	type : tabulations is a string
		//	return : void
		public function generate($tabulations)	{
			Debug::type(__METHOD__, 'is_string($tabulations)', is_string($tabulations));

			echo($tabulations.'<!--'."\n");
			echo($tabulations.'	'.$this->m_content."\n");
			echo($tabulations.'-->'."\n");
		}
	}

?>