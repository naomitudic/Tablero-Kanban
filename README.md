# TABLERO KANBAN // KANBAN BOARD

(ES) Desarrollo de una página web de organización estilo Kanban.

(EN) 'Kanban styled boards' web page development.

## ¡Muy importante! Conecta tu JSON Server

Para poder ejecutar y obtener las diferentes tareas dentro de esta página web, va a ser necesario que tengas JSON Server. Esto es muy importante, pues toda la información de tu página web (en este caso, las diferentes tareas que vayas añadiendo) se almacena aquí. Existen muchos tutoriales, pero aquí te lo explico en términos de principiante para que sea más fácil entenderlo (versión Mac©). 

**Hay dos formas de poder hacerlo, de modo que aquí muestro ambas, en caso de que exista algún problema dentro del Terminal o no te encuentres lo suficientemente familiarizado con su funcionamiento.**

### Forma 1

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

### Forma 2

1. Vas a necesitar tener instalado [node.js]([https://tu-enlace.com](https://nodejs.org/es)) (paso ya mostrado en el anterior punto) y pnpm package manager. Para conseguir este segundo, copia este comando en tu terminal:

```
brew install pnpm
``` 

2. Tras instalar pnpm, ejecuta este código:

```
pnpm i json-server
```

3.  Una vez este descargado, aplica este código (todo en el mismo terminal):

```
pnpm install
```

4.  Finalmente **(este paso será el único que tendrás que ejecutar una vez la instalación y configuración de los anteriores comandos se haya realizado)** copia este código, y tu REST API se vinculará con http://localhost:3000.

```
pnpm start
```

### Es recomendable que utilices el segundo método (forma 2), pues a la hora de inicializar la conexión con el JSON SERVER solo tendrás que introducir un único comando (pnpm start).
