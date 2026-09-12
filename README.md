# Tablero-Kanban // Kanban Board

(ES)
Un cliente ha encargado una página web de organización estilo Kanban.


(EN)
'Kanban styled' board development for a client. // Desarrollo de un tablero (estilo Kanban) para cliente.

# MUY IMPORTANTE: Conecta tu JSON Server

Para poder ejecutar y obtener las diferentes tareas dentro de esta página web, va a ser necesario que tengas JSON Server. Existen muchos tutoriales, pero aquí te lo explico en términos de principiante para que lo entiendas (versión Mac©). 

1. Instala node.js (te servirá para ejecutar otras cosas). Para ello, ve a su página web y sigue las instrucciones. La manera que me recomienda es copiando el código en terminal (bash), y esto LO TENDRÁS QUE HACER SIEMPRE QUE VAYAS A INICIARLO (al menos eso ocurre en mi caso, pues sino no ejecuta el resto de instrucciones que le mando). Está recomendado que instales la versión LTS (y que encontrarás menos errores o 'bugs').
2. Ejecuta este código en ese mismo terminal: npm install json-server.
3. Dentro de la página web (Visual Studio) que vayas a crear, tendrás que crear un archivo llamado db.json (en este, ya aparece incluido). Aquí aparecerá la información que almacena la página web. Para el caso concreto, ya aparece la información que debe incluirse.
4. Ejecuta en ese mismo terminal este código: npx json-server db.json.
5. Asegúrate de que en tu aarchivo de JavaScript (script.js) aparezca lo siguiente: const API_URL = "http://localhost:3000";

De esta manera, el servidor empezará a ejecutarse y todo el contenido que se encuentre en el archivo db.json se mostrará en tu página web. 
