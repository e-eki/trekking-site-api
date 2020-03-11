'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';

// название сайта
const siteName = 'Путешествия за снегом';

module.exports = {
    version: '1.0'
    // настройки сервера
    , server: {
        port: 3000   //process.env.PORT || 3000
        , host: (NODE_ENV == 'development') ? 'localhost' : 'trekking-site.herokuapp.com'  
        , protocol: (NODE_ENV == 'development') ? 'http' : "https"
    }
    // название файла с логами БД
    , logFileName: 'dbLogs.log'
    // настройки соединения с БД
    , db : {
        mongo : {
            url: 'mongodb://<dbuser>:<dbpassword>@ds046677.mlab.com:46677/ch'
            , options: {
                autoReconnect: true //(process.env.NODE_ENV == 'production')  //??
                , useNewUrlParser: true 
            }
        }
    }
    // настройки получения хэша
    , bcrypt: {
        saltLength: 10
    }
    // настройки почты
    , mail_settings: {
        service: 'Gmail' 
        , auth: { 
            user: '<user>', 
            pass: '<password>'
        }
        , email: 'snow.trekking.forum@gmail.com'
        , feedbackSubject: `Feedback с сайта «${siteName}»`
    }
    // настройки безопасности
    , security: {
        // количество писем в день через форму обратной связи - с одного устройства (с одним fingerprint)
        feedbackMaxCount: 5,
    }
    
    //--- настройки сайта

    // название сайта
    , siteName: siteName
    // адреса api
    , apiRoutes: {
        feedback: 'feedback',
    }
};
