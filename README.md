## TV Series Finder 📺

Está migrado con el web starter kit de Adalab. Este Kit incluye un motor de plantillas HTML, el preprocesador SASS y un servidor local; nos ayuda a trabajar más cómodamente y automatiza tareas.

En él hay 3 tipos de ficheros y carpetas:

- Los ficheros que están sueltos en la raíz del repositorio, como gulpfile.js, package.json... Son la configuración del proyecto y no necesitamos modificarlos.
- La carpeta `src/`: son los ficheros de nuestra página web, como HTML, CSS, JS...
- Las carpetas `public/` y `docs/`, que son generadas automáticamente cuando arrancamos el proyecto. El Kit lee los ficheros que hay dentro de `src/`, los procesa y los genera dentro de `public/` y `docs/`.

Necesitas tener instalado [Node JS](https://nodejs.org/) para trabajar con este Starter Kit, pero mi ejercicio puedes verlo directamente desde el enlace de hitHub pages.

- Se trata de un buscador de series, por lo cual tenemos que hacer una llamada al servidor, en este caso API, que almacena los datos que necesitamos.
  Para ello hemos de recoger el contenido para la búsqueda en un campo de formulario; la usuaria escribirá su preferencia y con una función filtraremos ese contenido para conseguir del servidor los datos que hacen referencia a lo que el usuario desea de forma más concreta.

- Después mostraremos los resultados de la búsqueda, habilitando con un evento de esucha para que la usuaria pueda seleccionar su serie favorita.

- Crearemos un contenedor para almacenar la selección de fvoritas de la usuaria, teniendo en cuenta que pueda cambiar la selección de forma dinámica y si pulsa dos veces en la misma no la añada por duplicado.
  A continuación pintamos en pantalla la lista de favoritos de la usuaria, y puede eliminarlos de uno en uno o todos a la vez.

- Las favoritas siempre permanecen en el localStorage, para que al recargar página ya le aparezcan en panatalla y se ahorre el trabajo de volverlas a buscar. Tiene que eliminarlas de forma consciente.

- Y para iniciar una nueva búsqueda sólo tiene que pulsar un botón de reload del formulario inicial, que borrará la lista de búsqueda anterior (excepto favoritas) y dejará limpia la pantalla para la nueva búsqueda.

- A destacar: La sección de favoritos aparece y desaparece según haya o no favoritas seleccionadas.

Sigo aprendiendo, más sobre mí [#gitFuntastic](https://github.com/Sagramielgo).
