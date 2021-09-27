// Importation package HTTP de node
const http =require('http');

// Importation APP pour l'utilisation de l'application sur le serveur
const app = require('./app'); 

// La fonction NORMALIZEPORT renvoie un port valide
const normalizePort = (val) => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};

// Ajout du SET PORT de connexion 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); 

// Fonction ERRORHANDLER recherchant et gérant les erreurs
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges.`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
};


// Appel au serveur
const server = http.createServer(app);

// Affichage du port de connexion et gère les erreurs
server.on('error', errorHandler);
server.on('listening', () => { 
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`); //  enregistre le port nommé sur lequel le serveur s'exécute dans la console
});

// Connexion au port defini
server.listen(port);