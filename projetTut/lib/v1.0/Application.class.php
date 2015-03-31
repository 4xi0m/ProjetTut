<?php

	//	file : Application.class.php
	//	brief :  Class modelizing a web application
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Application
	//	brief :  Class modelizing a web application
	//====================================================================================================
	class  Application
	{
		private $m_running;				//	bool
		private $m_title;						//	String
		private $m_blocks;					//	Block&[]
		private $m_links;					//	Link&[]
		private $m_scripts;					//	Script&[]
		private $m_metas;					//	Meta&[]




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_title : application's title
		//	type : p_title is a string
		//	return : void
		public function __construct($p_title = '')	{
			Debug::type(__METHOD__, 'is_string($p_title)', is_string($p_title));

			$this->m_running = false;
			$this->m_title = $p_title;
			$this->m_blocks = array();
			$this->m_links = array();
			$this->m_scripts = array();
			$this->m_metas = array();
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : isRunning
		//	brief : returns true if the web application is launched, false else
		//	return : bool
		public function isRunning()	{
			return $this->m_running;
		}




		//	name : setTitle
		//	brief : m_title setter
		//	param[in] p_title : title to set to the application
		//	type : p_title is a string
		//	precondition : the web application is not already launched
		//	return : void
		public function setTitle($p_title)	{
			Debug::type(__METHOD__, 'is_string($p_title)', is_string($p_title));
			Debug::precondition(__METHOD__, '$this->isRunning() == false', $this->isRunning() == false);

			$this->m_title = $p_title;
		}




		//	name : addBlock
		//	brief : adds a block to the application
		//	param[in] p_block : block to add
		//	type : p_block is a Block
		//	precondition : the web application is not already launched
		//	precondition : the block is not already in the application
		//	return : void
		public function addBlock(&$p_block)	{
			Debug::type(__METHOD__, '$p_block instanceof Block', $p_block instanceof Block);
			Debug::precondition(__METHOD__, '$this->isRunning() == false', $this->isRunning() == false);
			Debug::precondition(__METHOD__, 'in_array($p_block, $this->m_blocks, true) == false', in_array($p_block, $this->m_blocks, true) == false);

			$this->m_blocks[] = $p_block;

			foreach($p_block->getSettings() as $setting)	{
				if($setting instanceof Link)	{
					$this->addLink($setting);
				}
				else if($setting instanceof Meta)	{
					$this->addMeta($setting);
				}
				if($setting instanceof Script)	{
					$this->addScript($setting);
				}
			}
		}




		//	name : addMeta
		//	brief : adds a meta property to the application
		//	param[in] p_meta : meta to add
		//	type : p_meta is a Meta
		//	precondition : the web application is not already launched
		//	return : void
		public function addMeta($p_meta)	{
			Debug::type(__METHOD__, '$p_meta instanceof Meta', $p_meta instanceof Meta);
			Debug::precondition(__METHOD__, '$this->isRunning() == false', $this->isRunning() == false);

			$this->m_metas[] = $p_meta;
		}




		//	name : addScript
		//	brief : adds a script property to the application
		//	param[in] p_script : script to add
		//	type : p_script is a Script
		//	precondition : the web application is not already launched
		//	return : void
		public function addScript($p_script)	{
			Debug::type(__METHOD__, '$p_script instanceof Script', $p_script instanceof Script);
			Debug::precondition(__METHOD__, '$this->isRunning() == false', $this->isRunning() == false);

			$this->m_scripts[] = $p_script;
		}




		//	name : addLink
		//	brief : adds a link property to the application
		//	param[in] p_link : link to add
		//	type : p_link is a Link
		//	precondition : the web application is not already launched
		//	return : void
		public function addLink($p_link)	{
			Debug::type(__METHOD__, '$p_link instanceof Link', $p_link instanceof Link);
			Debug::precondition(__METHOD__, '$this->isRunning() == false', $this->isRunning() == false);

			$this->m_links[] = $p_link;
		}




		//	name : run
		//	brief : launches the web application
		//	param[in] options : execution options for blocks
		//	type : options is an array
		//	return : void
		public function run($options = array())	{
			Debug::type(__METHOD__, 'is_array($options)', is_array($options));

			foreach($this->m_blocks as $block)	{
				$block->execute($options);
			}

			echo("		<head>\n");
			foreach($this->m_metas as $meta)	{
				$meta->generate('			');
			}
			foreach($this->m_links as $link)	{
				$link->generate('			');
			}
			foreach($this->m_scripts as $script)	{
				$script->generate('			');
			}

			echo("			<title>".$this->m_title."</title>\n");
			echo("		</head>\n");
			echo("		<body>\n");

			foreach($this->m_blocks as $block)	{
				$block->generate('			');
			}

			echo("		</body>\n");
			$this->m_running = true;
		}
	}

?>