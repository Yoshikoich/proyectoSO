import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados iniciales de los procesos y recursos
  const [procesos, setProcesos] = useState([
    { nombre: 'A', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'B', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'C', asignados: 0, maximo: 0, diferencia: 0 },
  ]);

  // Estado de los recursos disponibles iniciales
  const [recursosDisponibles, setRecursosDisponibles] = useState(0);
  const [mensajes, setMensajes] = useState([]);
  const [datosGenerados, setDatosGenerados] = useState(false);

  // Generar valores únicos para Necesidad Máxima
  function generarValoresUnicos() {
    const valoresUnicos = new Set();
    while (valoresUnicos.size < 3) {
      valoresUnicos.add(Math.floor(Math.random() * 5) + 3); // Valores entre 3 y 7
    }
    return Array.from(valoresUnicos);
  }

  // Función para generar los datos de los procesos
  const generarDatos = () => {
    const maximos = generarValoresUnicos();
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

     // Calcular el total de recursos necesarios
     const maximoTotal = nuevosProcesos.reduce((total, proceso) => total + proceso.maximo, 0);
    
     // Verificar si la necesidad máxima total excede los recursos disponibles iniciales
     if (maximoTotal > recursosDisponiblesIniciales) {
       setMensajes([
         '⚠️ La necesidad máxima total de los procesos excede los recursos disponibles.',
         'No se podrá realizar la prevención de bloqueo.',
       ]);
     } else {
       setMensajes(['✅ Datos generados y condiciones revisadas']);
     }
   };

    // Generar recursos disponibles y asegurar la condición de disponibilidad
    let recursosDisponiblesIniciales;
    do {
      recursosDisponiblesIniciales = Math.floor(Math.random() * 6); // Valores entre 0 y 5
    } while (!nuevosProcesos.some((p) => p.diferencia <= recursosDisponiblesIniciales));

    setProcesos(nuevosProcesos);
    setRecursosDisponibles(recursosDisponiblesIniciales);
    setDatosGenerados(true);
    setMensajes(['✅ Datos generados y condiciones revisadas']);
  };

  // Función para simular el algoritmo del banquero
  const comenzarSimulacion = () => {
    let recursos = recursosDisponibles;
    // Ordena procesos por la diferencia (necesidad restante) para tratar de cumplir los más pequeños primero
    const colaProcesos = [...procesos].sort((a, b) => a.diferencia - b.diferencia);
    const nuevosMensajes = [];
  
    colaProcesos.forEach((proceso) => {
      if (proceso.diferencia <= recursos) {
        nuevosMensajes.push(`🟢 Proceso ${proceso.nombre} entra (Recursos Disponibles: ${recursos} - Diferencia: ${proceso.diferencia})`);
        
        // Reducir recursos
        recursos -= proceso.diferencia;
        
        nuevosMensajes.push(`🔄 Proceso ${proceso.nombre} ejecutándose. Recursos actuales: ${recursos}`);
        
        // Proceso libera sus recursos máximos al salir
        recursos += proceso.maximo;
        
        nuevosMensajes.push(`🟢 Proceso ${proceso.nombre} sale y devuelve ${proceso.maximo} recursos. Recursos actuales: ${recursos}`);
      } else {
        // Proceso espera si no hay suficientes recursos
        nuevosMensajes.push(`🟡 Proceso ${proceso.nombre} - Espera por falta de recursos.`);
      }
    });
  
    nuevosMensajes.push('✅ Todos los procesos han sido procesados.');
    setMensajes(nuevosMensajes);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <img src="https://www.uny.edu.ve/wp-content/uploads/2015/11/logo-universidad-yacambu.png" alt="Logo de la universidad" className="logo" />
        <p className="membrete">Universidad de Yacambu - Facultad de Ingeniería - Sistemas Operativos Noviembre 2024</p>
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
