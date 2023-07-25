const mysql = require('mysql');

const connection = mysql.createConnection({
	host : 'sql9.freesqldatabase.com',
	database : 'sql9635235',
	user : 'sql9635235',
	password : 'wbrdq8seVI'
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;
