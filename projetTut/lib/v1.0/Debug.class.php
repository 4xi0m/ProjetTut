<?php

	//	file : Debug.class.php
	//	brief :  Abstract class providing debug tools
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04





	//====================================================================================================
	//	name : Debug
	//	brief :  Abstract class providing debug tools
	//====================================================================================================
	abstract class  Debug
	{
		private static $enabled = false;				//	bool
		private static $file = null;							//	file




		//	name : log
		//	brief : displays an information
		//	param[in] callingFunction : name of the calling function
		//	param[in] information : information to display
		//	return : void
		public static function log($callingFunction, $information)	{
			if(self::$enabled == true)	{
				fputs(self::$file, str_pad('['.$callingFunction.']', 30).'		'.$information.'
');
 			}
		}




		//	name : enable
		//	brief : enables the debug mode
		//	param[in] filePath : output file's path
		//	return : void
		public static function enable($filePath)	{
			self::$enabled = true;
			touch($filePath);
			self::$file = fopen($filePath, 'r+');
		}




		//	name : disable
		//	brief : disables the debug mode
		//	return : void
		public static function disable()	{
			self::$enabled = false;
			if(self::$file != null)	{
				fclose(self::$file);
			}
		}




		//	name : type
		//	brief : tests a type condition
		//	param[in] callingFunction : name of the calling function
		//	param[in] description : type condition's description
		//	param[in] test : type condition
		//	return : void
		public static function type($callingFunction, $description, $test)	{
			$test = ($test == true) ? 'true' : 'false';

			if(self::$enabled)	{
				self::log($callingFunction, 'Test de typage - '.$description.' : '.$test);
			}
			if($test === 'false')	{
				throw  new TypeException($description.' : '.$test, 1);
			}
		}




		//	name : precondition
		//	brief : tests a precondition
		//	param[in] callingFunction : name of the calling function
		//	param[in] description : precondition's description
		//	param[in] test : precondition
		//	return : void
		public static function precondition($callingFunction, $description, $test)	{
			$test = ($test == true) ? 'true' : 'false';

			if(self::$enabled)	{
				self::log($callingFunction, 'Test de précondition - '.$description.' : '.$test);
			}
			if($test === 'false')	{
				throw  new PreconditionException($description.' : '.$test, 2);
			}
		}




		//	name : postcondition
		//	brief : tests a postcondition
		//	param[in] callingFunction : name of the calling function
		//	param[in] description : postcondition's description
		//	param[in] test : postcondition
		//	return : void
		public static function postcondition($callingFunction, $description, $test)	{
			$test = ($test == true) ? 'true' : 'false';

			if(self::$enabled)	{
				self::log($callingFunction, 'Test de postcondition - '.$description.' : '.$test);
			}
			if($test === 'false')	{
				throw  new PostconditionException($description.' : '.$test, 3);
			}
		}
	}

?>