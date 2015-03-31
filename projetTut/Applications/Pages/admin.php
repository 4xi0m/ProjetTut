<?php
include_once('Applications/Modules/Conference/Conference.module.class.php');
include_once('Applications/Modules/RestrictedAccess/RestrictedAccess.module.class.php');

Debug::enable('log.txt');


try
{
	$app = new Application('Application');

	$conf = new Conference();
	$rest = new RestrictedAccess();
	$app->addBlock($conf);
	$app->addBlock($rest);
	$app->run();
}
catch(TypeException $e)	{
	echo('TypeException (1) : '.$e->getMessage().' Line : '.$e->getLine().' File : '.$e->getFile());
}
catch(SQLException $e)	{
	echo('SQLException ('.$e->getCode().') : '.$e->getMessage());
}
catch(Exception $e)	{
	echo('Error : '.$e->getMessage());
}

?>
