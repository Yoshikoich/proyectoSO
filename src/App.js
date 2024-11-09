import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados iniciales de los procesos y recursos
  const [procesos, setProcesos] = useState([
    { nombre: 'A', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'B', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'C', asignados: 0, maximo: 0, diferencia: 0 },
  ]);

  // Estado de los recursos disponibles iniciales, independientes de los recursos asignados
  const [recursosDisponibles, setRecursosDisponibles] = useState(0);

  // Estado para almacenar mensajes de simulación y resultados
  const [mensajes, setMensajes] = useState([]);
  const [datosGenerados, setDatosGenerados] = useState(false);

  // Función para generar valores aleatorios únicos para la "Necesidad Máxima" de cada proceso
  function generarValoresUnicos() {
    const valoresUnicos = new Set();
    while (valoresUnicos.size < 3) {
      valoresUnicos.add(Math.floor(Math.random() * 5) + 3); // Genera valores entre 3 y 7
    }
    return Array.from(valoresUnicos);
  }

  // Función para generar los datos de los procesos y los recursos iniciales
  const generarDatos = () => {
    const maximos = generarValoresUnicos(); // Genera valores únicos para 'Necesidad Máxima'
    const nuevosProcesos = procesos.map((proceso, index) => {
      const asignados = Math.floor(Math.random() * maximos[index]);
      const diferencia = maximos[index] - asignados;
      return {
        ...proceso,
        asignados,
        maximo: maximos[index],
        diferencia,
      };
    });

    // Genera un valor aleatorio para recursos disponibles independiente de los asignados
    const recursosDisponiblesIniciales = Math.floor(Math.random() * 6); // Valores entre 0 y 5
    setProcesos(nuevosProcesos);
    setRecursosDisponibles(recursosDisponiblesIniciales);
    setDatosGenerados(true);
    setMensajes(['✅ Datos generados y condiciones cumplidas']);
  };

  // Función para simular el algoritmo del banquero
  const comenzarSimulacion = () => {
    let recursos = recursosDisponibles; // Copia de recursos disponibles para manipular en el ciclo
    const colaProcesos = [...procesos].sort((a, b) => a.maximo - b.maximo); // Ordena procesos por necesidad máxima
    const nuevosMensajes = [];

    colaProcesos.forEach((proceso) => {
      if (proceso.diferencia <= recursos) {
        // El proceso puede entrar porque su diferencia es menor o igual a los recursos disponibles
        nuevosMensajes.push(`🟢 Otorgando recursos al proceso ${proceso.nombre} (Recursos Disponibles: ${recursos} - Diferencia: ${proceso.diferencia})`);
        
        // Reducimos los recursos disponibles
        recursos -= proceso.diferencia;
        
        // Proceso 'entra' y libera sus recursos máximos al salir
        nuevosMensajes.push(`🟢 READY - Proceso ${proceso.nombre} está en ejecución.`);
        
        nuevosMensajes.push(`🔄 Devolviendo recursos de ${proceso.nombre} (Recursos Disponibles: ${recursos} + Necesidad Máxima: ${proceso.maximo})`);
        
        // Incrementamos los recursos disponibles cuando el proceso sale
        recursos += proceso.maximo;
      } else {
        // El proceso espera ya que no hay recursos suficientes
        nuevosMensajes.push(`🟡 Proceso ${proceso.nombre} - Esperando`);
      }
    });

    nuevosMensajes.push('✅ Todos los procesos han sido procesados.');
    setMensajes(nuevosMensajes);
  };

  return (
    <div className="App">
      <h1>Algoritmo del Banquero - Prevención de Bloqueos</h1>

      {/* Botones de acciones */}
      <button onClick={generarDatos}>Generar Datos</button>
      <button onClick={comenzarSimulacion} disabled={!datosGenerados}>
        Empezar Prevención de Bloqueos
      </button>

      {/* Tabla de procesos */}
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

      {/* Mostramos los recursos disponibles iniciales generados */}
      <h3>Recursos Disponibles Iniciales: {recursosDisponibles}</h3>

      {/* Mensajes de simulación */}
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
