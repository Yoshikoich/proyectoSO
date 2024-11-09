import React, { useState } from 'react';
import './App.css';

function App() {
  const [procesos, setProcesos] = useState([
    { nombre: 'A', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'B', asignados: 0, maximo: 0, diferencia: 0 },
    { nombre: 'C', asignados: 0, maximo: 0, diferencia: 0 },
  ]);

  const [recursosDisponibles, setRecursosDisponibles] = useState(0);
  const [recursosTotales, setRecursosTotales] = useState(0);
  const [mensajes, setMensajes] = useState([]);
  const [datosGenerados, setDatosGenerados] = useState(false);

  function generarValoresUnicos() {
    const valoresUnicos = new Set();
    while (valoresUnicos.size < 3) {
      valoresUnicos.add(Math.floor(Math.random() * 5) + 3);
    }
    return Array.from(valoresUnicos);
  }

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

    // Calcula la sumatoria de recursos asignados
    const totalAsignados = nuevosProcesos.reduce((acc, proceso) => acc + proceso.asignados, 0);
    
    // Recursos disponibles iniciales aleatorios independientes de la sumatoria de asignados
    const recursosDisponiblesIniciales = Math.floor(Math.random() * 6);

    setProcesos(nuevosProcesos);
    setRecursosDisponibles(recursosDisponiblesIniciales);
    setRecursosTotales(totalAsignados + recursosDisponiblesIniciales); // Recursos Totales
    setDatosGenerados(true);
    setMensajes(['✅ Datos generados y condiciones cumplidas']);
  };

  const comenzarSimulacion = () => {
    let recursos = recursosDisponibles;
    let colaProcesos = [...procesos];
    let nuevosMensajes = [];
    let procesados = new Set();
    let cambiosRealizados = true;

    while (procesados.size < procesos.length && cambiosRealizados) {
      cambiosRealizados = false;

      colaProcesos.forEach((proceso) => {
        if (!procesados.has(proceso.nombre) && proceso.diferencia <= recursos) {
          nuevosMensajes.push(`🟢 Otorgando recursos al proceso ${proceso.nombre} (Recursos Disponibles: ${recursos} - Diferencia: ${proceso.diferencia})`);
          
          // Resta los recursos de la diferencia para ejecutar el proceso
          recursos -= proceso.diferencia;
          nuevosMensajes.push(`🟢 READY - Proceso ${proceso.nombre} está en ejecución.`);
          
          // Al devolver los recursos, muestra el cálculo realizado
          const recursosPrevios = recursos;
          recursos += proceso.maximo;
          nuevosMensajes.push(`🔄 Devolviendo recursos de ${proceso.nombre} (Recursos Disponibles: ${recursosPrevios} + Necesidad Máxima: ${proceso.maximo}) = ${recursos}`);
          
          // Marca el proceso como procesado y registra que hubo un cambio
          procesados.add(proceso.nombre);
          cambiosRealizados = true;
        }
      });

      if (!cambiosRealizados) {
        nuevosMensajes.push('⚠️ No se pueden procesar más procesos sin riesgo de bloqueo.');
      }
    }

    if (procesados.size === procesos.length) {
      nuevosMensajes.push('✅ Todos los procesos han sido procesados sin bloqueos.');
    } else {
      nuevosMensajes.push('⚠️ No fue posible procesar todos los procesos debido a insuficientes recursos disponibles.');
    }

    setMensajes(nuevosMensajes);
  };

  return (
    <div className="App">
      <h1>Algoritmo del Banquero - Prevención de Bloqueos</h1>
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
      <h3>Recursos Totales: {recursosTotales}</h3>

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
