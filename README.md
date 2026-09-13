# Tablero-Kanban // Kanban Board

(ES)
Un cliente ha encargado una página web de organización estilo Kanban.


(EN)
'Kanban styled' board development for a client. // Desarrollo de un tablero (estilo Kanban) para cliente.

# MUY IMPORTANTE: Conecta tu JSON Server

Para poder ejecutar y obtener las diferentes tareas dentro de esta página web, va a ser necesario que tengas JSON Server. Existen muchos tutoriales, pero aquí te lo explico en términos de principiante para que lo entiendas (versión Mac©). 

1. Instala [node.js]([https://tu-enlace.com](https://nodejs.org/es)) (permite ejecutar JavaScript en cualquier parte). Para ello, ve a su página web y sigue las instrucciones dependiendo de tu sistema operativo. Para el caso de Mac©, la manera recomendada es copiar el siguiente código en terminal (bash), y esto **LO TENDRÁS QUE HACER SIEMPRE QUE VAYAS A INICIARLO** (al menos eso ocurre en mi caso, pues sino no ejecuta el resto de instrucciones que le mando). Está recomendado que instales la versión LTS (ya que encontrarás menos errores o 'bugs'):

```
# Descarga e instala nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash

# en lugar de reiniciar la shell
\. "$HOME/.nvm/nvm.sh"

# Descarga e instala Node.js:
nvm install 24

# Verifica la versión de Node.js:
node -v # Debería mostrar "v24.21.0".

# Verifica versión de npm:
npm -v # Debería mostrar "11.19.0".
```
   
2. Ejecuta este código en ese mismo terminal:

```
npm install json-server
```
 
3. Dentro de la carpeta (de Visual Studio) en la que estés creando tu página web, tendrás que crear un archivo llamado db.json (en este proyecto ya aparece incluido). Aquí aparecerá la información que almacena la página web.

4. Ejecuta en ese mismo terminal este código:

```
npx json-server db.json
```

5. Asegúrate de que en tu aarchivo de JavaScript (script.js) aparezca lo siguiente:

```
const API_URL = "http://localhost:3000";
```

De esta manera, el servidor empezará a ejecutarse y todo el contenido que se encuentre en el archivo db.json se mostrará en tu página web.
