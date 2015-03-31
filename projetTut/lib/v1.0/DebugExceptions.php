<?php

	//	file : DebugExceptions.php
	//	brief :  Exception classes thrown by test functions of Debug
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : TypeException
	//	brief :  Exception thrown if a type condition is not satisfied
	//====================================================================================================

	class TypeException extends Exception
	{
		//	name : __construct
		//	brief : class constructor
		//	param[in] message : message describing the exception
		//	param[in] code : exception's corresponding code
		//	return : void
		public function __construct($message, $code)
		{
			parent::__construct($message, $code);
		}
	}




	//====================================================================================================
	//	name : PreconditionException
	//	brief :  Exception thrown if a precondition is not satisfied
	//====================================================================================================

	class PreconditionException extends Exception
	{
		//	name : __construct
		//	brief : class constructor
		//	param[in] message : message describing the exception
		//	param[in] code : exception's corresponding code
		//	return : void
		public function __construct($message, $code)
		{
			parent::__construct($message, $code);
		}
	}





	//====================================================================================================
	//	name : PostconditionException
	//	brief :  Exception thrown if a postcondition is not satisfied
	//====================================================================================================

	class PostconditionException extends Exception
	{
		//	name : __construct
		//	brief : class constructor
		//	param[in] message : message describing the exception
		//	param[in] code : exception's corresponding code
		//	return : void
		public function __construct($message, $code)
		{
			parent::__construct($message, $code);
		}
	}

?>