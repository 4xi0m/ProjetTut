<?php

	//	file : mangrovaPHP.class.php
	//	brief :  Classe statique modélisant le moteur mangrovaPHP
	//	author : Matthieu JABBOUR
	//	version : 0.3
	//	date : 2014/07/23



	//====================================================================================================
	//	name : mangrovaPHP
	//	brief :  Classe statique modélisant le moteur mangrovaPHP
	//====================================================================================================
	abstract class  mangrovaPHP
	{
		public static $libraryPath = 'mangrovaPHP/';		//	String

		//	name : start
		//	brief : démarre le moteur mangrovaPHP
		//	return : void
		public static function start()	{
			include_once('pages.php');
			include_once(self::$libraryPath.'Includes.php');

			//	Détermination de la racine du site web
			$webRoot = explode('/'.basename(__FILE__), $_SERVER['PHP_SELF'])[0];
			//	Détermination de la requête dans l'URL
			$urlRequest = explode($webRoot, $_SERVER['REQUEST_URI'])[1];

			//	En cas d'absence de la page demandée
			$pageFound = false;

			foreach($Pages as $page => $path)	{
				if(preg_match($page, $urlRequest))	{
					echo("<!DOCTYPE html>\n");
					echo("	<html>\n");
					include_once($path);
					echo("	</html>\n");
					$pageFound = true;
					break;
				}
			}
			if($pageFound == false)	{
				if(array_key_exists('error404', $Pages))	{
					include_once($Pages['error404']);
				}
				else	{
					header('Location: '.$webRoot.'/mangrovaPHPError.php');
					exit;
				}
			}
		}
	}


	session_start();
	mangrovaPHP::start();

?>