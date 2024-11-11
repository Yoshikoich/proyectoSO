import React, { useState } from 'react';
import './App.css';

function App() {
  // Un array de estados iniciales de los procesos y recursos, se le coloca inicialmente 0 para luego ser rellenado por datos random
  const [procesos, setProcesos] = useState([
    { nombre: 'A', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'B', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'C', asignados: 0, maximo: 0, diferencia: 0 },
  ]);

  // Estado de los recursos disponibles iniciales
  const [recursosDisponibles, setRecursosDisponibles] = useState(0); // Número de recursos actualmente disponibles para asignar.
  const [totalRecursosSistema, setTotalRecursosSistema] = useState(0); // Total de recursos en el sistema, que es la suma de recursosDisponibles y la suma de los asignados de todos los procesos.
  const [maximoTotal, setMaximoTotal] = useState(0); // El valor más alto de maximo entre todos los procesos, indicando la necesidad máxima del proceso más demandante
  const [mensajes, setMensajes] = useState([]); // Esto es para el aviso para la simulación
  const [datosGenerados, setDatosGenerados] = useState(false); // Esto avisa que los datos iniciales han sido generados o no, para poder activar el boton de simulación
  const [progreso, setProgreso] = useState(0); // Estado de progreso de la barra

  // Generar valores únicos para Necesidad Máxima, esto es para que posteriormente empiece con el proceso con la necesidad maxima menor
  function generarValoresUnicos() {
    const valoresUnicos = new Set(); // usamos set para que no haya duplicados
    while (valoresUnicos.size < 3) {
      valoresUnicos.add(Math.floor(Math.random() * 5) + 3); // Valores entre 3 y 7, escogido por gusto, puede ser cambiado
    }
    return Array.from(valoresUnicos); // Convertimos el set en un array
  }

  // Función para generar los datos de los procesos, 
  const generarDatos = () => {
    const maximos = generarValoresUnicos(); // llamamos a la función para generar valores no duplicados
    const nuevosProcesos = procesos.map((proceso, index) => {
      const asignados = Math.floor(Math.random() * maximos[index]); 
      const diferencia = maximos[index] - asignados; // Se calcula la diferencia para la tabla
      return {
        ...proceso,
        asignados,
        maximo: maximos[index],
        diferencia, //regresamos todos los valores generados para la tabla
      };
    });

    // Generar recursos disponibles y asegurar la condición de disponibilidad. Esto es para revisar que haya al menos un valor menor en diferencia cuando se ve los recursos disponibles iniciales 
    let recursosDisponiblesIniciales;
    do {
      recursosDisponiblesIniciales = Math.floor(Math.random() * 6); // Valores entre 0 y 5
    } while (!nuevosProcesos.some((p) => p.diferencia <= recursosDisponiblesIniciales));

    setProcesos(nuevosProcesos);
    setRecursosDisponibles(recursosDisponiblesIniciales);
    setDatosGenerados(true);

    // Calcular el total de recursos en el sistema (recursos disponibles + suma de recursos asignados)
    const totalRecursos = recursosDisponiblesIniciales + nuevosProcesos.reduce((total, proceso) => total + proceso.asignados, 0);
    setTotalRecursosSistema(totalRecursos); // Guardar en el estado

    // Calcular el valor máximo entre las necesidades máximas de todos los procesos. Esto para la condición y que sea facilmente visible.
    const maximoNecesidad = Math.max(...nuevosProcesos.map(proceso => proceso.maximo));
    setMaximoTotal(maximoNecesidad); // Guardar en el estado `maximoTotal`

    // Verificar si la necesidad máxima total excede los recursos totales del sistema
    if (maximoNecesidad > totalRecursos) {
      setMensajes([
        '⚠️ Advertencia: La necesidad máxima de algún proceso excede la cantidad total de recursos en el sistema.',
        'Por lo tanto un proceso o varios procesos serian bloqueados.',
      ]);
    } else {
      setMensajes(['✅ Datos generados y condiciones revisadas']);
    }

    // Reiniciar el progreso
    setProgreso(0);
  };

  // Función para simular el algoritmo de prevención de bloqueos vista en clase
  const comenzarSimulacion = () => {
    let recursos = recursosDisponibles; // recursos disponibles en el momento de darle a empezar simulacion
    // Ordena procesos por la diferencia (necesidad restante) para tratar de cumplir los más pequeños primero. Eso lo hace sort
    const colaProcesos = [...procesos].sort((a, b) => a.diferencia - b.diferencia);
    const nuevosMensajes = [];

    colaProcesos.forEach((proceso, index) => {
      if (proceso.diferencia <= recursos) {
        nuevosMensajes.push(`🟢 Proceso ${proceso.nombre} entra (Recursos Disponibles: ${recursos} - Diferencia: ${proceso.diferencia})`);
        
        // Reducir recursos
        recursos -= proceso.diferencia;
        
        nuevosMensajes.push(`🔄 Proceso ${proceso.nombre} ejecutándose. Recursos actuales: ${recursos}`);
        
        // Proceso libera sus recursos máximos al salir
        recursos += proceso.maximo;
        
        nuevosMensajes.push(`🟢 Proceso ${proceso.nombre} sale y devuelve ${proceso.maximo} recursos. Recursos actuales: ${recursos}`);

        // Actualizar el progreso
        setProgreso(((index + 1) / colaProcesos.length) * 100);
      } else {
        // Proceso espera si no hay suficientes recursos, esto es cuando le das click a empezar simulación luego de ver la advertencia 
        nuevosMensajes.push(`🟡 Proceso ${proceso.nombre} - Espera por falta de recursos.`);
      }
    });

    nuevosMensajes.push('✅ Todos los procesos han sido procesados.');
    setMensajes(nuevosMensajes);
  };

  // a partir de acá es mas lo que seria el html de la pagina donde se llaman las funciones para realizar la simulación
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <img src="https://www.uny.edu.ve/wp-content/uploads/2015/11/logo-universidad-yacambu.png" alt="Logo de la universidad" className="logo" />
        <p className="membrete">Universidad Yacambu - Facultad de Ingeniería - Sistemas Operativos Noviembre 2024 - Andrea Gómez</p>
      </header>

      <h1>Proyecto: Prevención de Bloqueos</h1>

      <button onClick={generarDatos}>Generar Datos</button>
      <button onClick={comenzarSimulacion} disabled={!datosGenerados}>
        Empezar Prevención de Bloqueos
      </button>

      <h2>Tabla de Procesos</h2>
      <table>
        <thead>
          <tr>
            <th>Proceso</th>
            <th>Recursos Asignados</th>
            <th>Necesidad Máxima</th>
            <th>Diferencia</th>
          </tr>
        </thead>
        <tbody>
          {procesos.map((proceso, index) => (
            <tr key={index}>
              <td>{proceso.nombre}</td>
              <td>{proceso.asignados}</td>
              <td>{proceso.maximo}</td>
              <td>{proceso.diferencia}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Recursos Disponibles Iniciales: {recursosDisponibles}</h3>
      <h3>Total de Recursos en el Sistema: {totalRecursosSistema}</h3>
      <h3>Máximo Total Necesario: {maximoTotal}</h3> {/* Nueva línea para mostrar el máximo total */}

      {/* Barra de progreso */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progreso}%` }}>
          {Math.round(progreso)}%
        </div>
      </div>

      <h2>Estado de Simulación</h2>
      <div className="simulacion">
        {mensajes.map((mensaje, index) => (
          <p key={index}>{mensaje}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
