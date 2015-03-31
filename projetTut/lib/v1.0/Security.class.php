<?php

	//	file : Security.class.php
	//	brief :  Abstract class providing security tools
	//	author : Matthieu JABBOUR
	//	version : 1.0
	//	date : 2014/12/04



	//====================================================================================================
	//	name : Security
	//	brief :  Abstract class providing security tools
	//====================================================================================================
	abstract class  Security
	{
		//	name : secure
		//	brief : securises an array or a string to avoid any security issue
		//	param[in] variable : variable to securise
		//	type : variable is a string or an array
		//	return : string or Array
		public static function secure($variable)
		{
			Debug::type(__METHOD__, 'is_string($variable) || is_array($variable)', is_string($variable) || is_array($variable));

			if(is_string ($variable)) {
				return htmlspecialchars($variable, ENT_QUOTES);
			}
			else if(is_array($variable) && !empty($variable)) 	{
				foreach($variable as $key => $value) {
					$variable[$key] = self::secure($value);
				}
			}
			return $variable;
		}




		//	name : unsecure
		//	brief : unsecurises an array or a string securised with Security::secure()
		//	param[in] variable : variable to unsecurise
		//	type : variable is a string or an array
		//	return : string or Array
		public static function unsecure($variable)
		{
			Debug::type(__METHOD__, 'is_string($variable) || is_array($variable)', is_string($variable) || is_array($variable));

			if(is_string ($variable)) {
				return (htmlspecialchars_decode($variable, ENT_QUOTES));
			}
			else if(is_array($variable) && !empty($variable)) 	{
				foreach($variable as $key => $value) {
					$variable[$key] = self::unsecure($value);
				}
			}
			return $variable;
		}
	}

?>