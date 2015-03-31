<?php

	//	file : Layout.class.php
	//	brief :  Abstract class modelizing a layout in a web application
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Layout
	//	brief :  Abstract class modelizing a layout in a web application
	//====================================================================================================

	abstract class  Layout extends Block
	{
		public static $path = 'Applications/Layouts';						//	String
		protected $m_blocks;														//	Block&[]




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_settings : global settings to assign to the block
		//	type : p_settings is an array
		//	return : void
		public function __construct($p_settings)	{
			Debug::type(__METHOD__, 'is_array($p_settings)', is_array($p_settings));

			parent::__construct($p_settings);
			$this->m_blocks = array();
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : getPath
		//	brief : returns the current layout's directory full path
		//	return : String
		public static function getPath()	{
			return Layout::$path.'/'.get_called_class().'/';
		}




		//	name : addBlock
		//	brief : adds a block to the layout
		//	param[in] p_block : block to add
		//	type : p_block is a Block
		//	precondition : the block is not already in the layout
		//	return : void
		public function addBlock(&$p_block)	{
			Debug::type(__METHOD__, '$p_block instanceof Block', $p_block instanceof Block);
			Debug::precondition(__METHOD__, 'in_array($p_block, $this->m_blocks, true) == false', in_array($p_block, $this->m_blocks, true) == false);

			$this->m_blocks[] = $p_block;

			foreach($p_block->getSettings()	as $setting)	{
				$this->m_settings[] = $setting;
			}
		}




		//	name : execute
		//	brief : executes the layout's processes
		//	param[in] options : execution options
		//	type : options is an array
		//	return : void
		public function execute($options)	{
			foreach($this->m_blocks as $block)	{
				$block->execute($options);
			}
		}
	}

?>