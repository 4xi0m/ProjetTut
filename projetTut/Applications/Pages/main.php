<?php
include_once('Applications/Modules/Login/Login.module.class.php');

Debug::enable('log.txt');

	
try
{
	$app = new Application('Application');

	$Login = new Login();
	$app->addBlock($Login);
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
