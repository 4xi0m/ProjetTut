<?php

	//	file : Model.class.php
	//	brief :  Abstract class modelizing models in a web application
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Model
	//	brief :  Abstract class modelizing models in a web application
	//====================================================================================================

	abstract class  Model
	{
		protected $m_data;				//	Array
		protected $m_dataBase;		//	PDO




		//	name : __construct
		//	brief : class constructor
		//	param[in] p_data : data to assign to the model
		//	type : p_data is an array
		//	return : void
		public function __construct($p_data)	{
			Debug::type(__METHOD__, 'is_array($p_data)', is_array($p_data));

			$this->m_dataBase = NULL;
			$this->m_data = $p_data;
		}




		//	name : __destruct
		//	brief : class destructor
		//	return : void
		public function __destruct()	{
		}




		//	name : connect
		//	brief : connects the model to a database
		//	param[in] dataBase : address of the database
		//	type : dataBase is a string
		//	param[in] user : user's name
		//	type : user is a string
		//	param[in] password : user's password
		//	type : password is a string
		//	postcondition : m_dataBase is a PDO
		//	return : void
		public function connect($dataBase, $user, $password)	{
			Debug::type(__METHOD__, 'is_string($dataBase)', is_string($dataBase));
			Debug::type(__METHOD__, 'is_string($user)', is_string($user));
			Debug::type(__METHOD__, 'is_string($password)', is_string($password));

			try	{
				$this->m_dataBase = new PDO($dataBase, $user, $password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
			}
			catch(Exception $exception)	{
				throw new SQLException($exception->getMessage(), 10);
			}

			Debug::postcondition(__METHOD__, '$this->m_dataBase instanceof PDO', $this->m_dataBase instanceof PDO);
		}




		//	name : hydrate
		//	brief : hydrates the model with p_data
		//	param[in] p_data : data to assign to the model
		//	type : p_data is an array
		//	return : void
		public function hydrate($p_data)	{
			Debug::type(__METHOD__, 'is_array($p_data)', is_array($p_data));

			foreach($p_data as $key => $value)	{
				$this->m_data[$key] = $value;
			}
		}




		//	name : get
		//	brief : m_data getter
		//	param[in] key : key of the data to return 
		//	type : key is a string
		//	precondition : key is a valid key in m_data
		//	return : *
		public function get($key)	{
			Debug::type(__METHOD__, 'is_string($key)', is_string($key));
			Debug::precondition(__METHOD__, 'isset($this->m_data[$key])', isset($this->m_data[$key]));

			return $this->m_data[$key];
		}




		//	name : rQuery
		//	brief : executes a SQL query to read data from m_dataBase
		//	param[in] query : query to execute on the database
		//	type : query is a string
		//	param[in] arguments : query's arguments
		//	type : arguments is an array
		//	precondition : the model is connected to a database
		//	return : void
		public function rQuery($query, $arguments = array())	{
			Debug::type(__METHOD__, 'is_string($query)', is_string($query));
			Debug::type(__METHOD__, 'is_array($arguments)', is_array($arguments));
			Debug::precondition(__METHOD__, '$this->m_dataBase instanceof PDO', $this->m_dataBase instanceof PDO);

			try{
				$statement = $this->m_dataBase->prepare($query);
				$statement->execute($arguments);
				$this->m_data['query'] = $statement->fetchAll();
				$statement->closeCursor();
			}
			catch(Exception $exception)	{
					throw new SQLException($exception->getMessage(), 11);
			}
		}




		//	name : wQuery
		//	brief : executes a SQL query to write data in m_dataBase
		//	param[in] query : query to execute on the database
		//	type : query is a string
		//	param[in] arguments : query's arguments
		//	type : arguments is an array
		//	precondition : the model is connected to a database
		//	return : void
		public function wQuery($query, $arguments = array())	{
			Debug::type(__METHOD__, 'is_string($query)', is_string($query));
			Debug::type(__METHOD__, 'is_array($arguments)', is_array($arguments));
			Debug::precondition(__METHOD__, '$this->m_dataBase instanceof PDO', $this->m_dataBase instanceof PDO);

			try{
				$statement = $this->m_dataBase->prepare($query);
				$statement->execute($arguments);
			}
			catch(Exception $exception)	{
					throw new SQLException($exception->getMessage(), 12);
			}
		}
	}

?>