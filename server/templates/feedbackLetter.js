'use strict';

const config = require('../config');

module.exports = new function() {

	// создать письмо от юзера через форму обратной связи - на имейл сайта
    this.get = function(data) {
		const mainLink = `${config.server.protocol}://${config.server.host}:${config.server.port}`;	

		let letter =  
			`<!DOCTYPE HTML>
			<html>
				<head>
					<meta charset="utf-8">
					<title>Feedback с сайта «${config.forumName}»</title>
					<style type="text/css">
						.wrapper {
							margin: 5vmin;
						}
					</style>
				</head> 
				<body>
					<div class="wrapper">
						<p>${data.text}</p>
						
						<br/><a href="${mainLink}">На главную страницу сайта</a></p>
					</div>
				</body>
			</html>`;

		return letter;
    }
};
