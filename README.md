# Proyecto Sistemas Operativos 
## Prevención de Bloqueos - Andrea Gómez

Pagina de Vercel : [click aca](https://proyecto-so-two.vercel.app/).

Hice una pagina con vercel donde puede ver el front end de la pagina y la simulación, todo creado usando solamente Visual Studio Code. Dentro de la carpeta src, en app.js allí esta el codigo con explicación en los comentarios. Debido a la naturaleza de aplicaciones con react, la mayoria de los archivos fue creado automaticamente, lo unico editado fue app.js y app.css para darle estilo a la pagina. 


La idea de esto es simular el proceso visto en clase, en el codigo tiene una seccion donde todo el proceso ira correctamente si se cumplen ciertas condiciones. Las cuales se tomaron estas a la hora de realizarlo:

- Las necesidades maximas son mayores que los recursos otorgados.
- Al menos un valor en diferencia debe ser menor que la cantidad de recursos disponibles iniciales.
- El maximo total necesario se refiere a que no puede haber un proceso que pida mas de lo que hay entre todos los recursos, en caso de ser asi se mostrara una advertencia de que algun proceso quedara en espera por falta de recursos. Se coloco en la UI para ser mas accesible para la revision de errores.
- No se usan mas recursos de los que ya hay desde un principio, mostrado en total de recursos en el sistema.
