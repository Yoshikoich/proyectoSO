import React, { useState } from 'react';
import './App.css';

function App() {
  const [processes, setProcesses] = useState([
    { name: 'A', assigned: 0, maxNeed: 0, difference: 0 },
    { name: 'B', assigned: 0, maxNeed: 0, difference: 0 },
    { name: 'C', assigned: 0, maxNeed: 0, difference: 0 },
  ]);
  const [availableResources, setAvailableResources] = useState(0); // Variable para recursos disponibles
  const [message, setMessage] = useState('');
  const [simulationLog, setSimulationLog] = useState([]);
  
  // Generación de datos aleatorios únicos
  const generateData = () => {
    const assignedResources = processes.map(() => Math.floor(Math.random() * 3) + 1); // Recursos asignados entre 1 y 3
    const maxNeeds = Array.from(new Set([4, 5, 6])).sort(() => 0.5 - Math.random()); // Valores únicos de Necesidad Máxima

    // Recalcular la diferencia y generar la tabla
    const newProcesses = processes.map((process, index) => ({
      ...process,
      assigned: assignedResources[index],
      maxNeed: maxNeeds[index],
      difference: maxNeeds[index] - assignedResources[index]
    }));

    // Genera un valor aleatorio de recursos disponibles entre 0 y 5
    const randomAvailable = Math.floor(Math.random() * 6);
    setAvailableResources(randomAvailable);
    
    // Comprobar si se cumplen las condiciones para algún proceso
    const valid = newProcesses.some(process => process.difference <= randomAvailable);
    setMessage(valid ? "✅ Datos generados y condiciones cumplidas" : "❌ Las condiciones no se cumplen");
    setProcesses(newProcesses);
    setSimulationLog([]); // Limpia el log de simulación
  };

  // Simulación de prevención de bloqueos
  const startSimulation = () => {
    let resources = availableResources;
    const log = [];
    const processQueue = [...processes].sort((a, b) => a.maxNeed - b.maxNeed); // Ordena por necesidad máxima

    processQueue.forEach(process => {
      if (process.difference <= resources) {
        // Proceso puede entrar
        log.push(`🟢 Otorgando recursos al proceso ${process.name}: ${resources} - ${process.difference} = ${resources - process.difference}`);
        resources -= process.difference;

        // Estado "READY"
        log.push(`⚙️ Proceso ${process.name} - READY`);

        // Proceso sale y devuelve sus recursos
        log.push(`🔄 Devolviendo recursos del proceso ${process.name}: ${resources} + ${process.maxNeed} = ${resources + process.maxNeed}`);
        resources += process.maxNeed;
      } else {
        // Proceso no puede entrar, espera
        log.push(`🟡 Proceso ${process.name} - Esperando (Diferencia: ${process.difference}, Recursos Disponibles: ${resources})`);
      }
    });

    // Actualización de logs y mensaje final
    log.push("✅ Todos los procesos han sido procesados.");
    setSimulationLog(log);
    setAvailableResources(resources); // Actualiza el estado final de recursos disponibles
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Algoritmo del Banquero - Prevención de Bloqueos</h1>
      </header>
      
      <div className="controls">
        <button onClick={generateData}>Generar Datos</button>
        <button onClick={startSimulation}>Empezar Prevención de Bloques</button>
      </div>
      
      <div className="table-section">
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
            {processes.map((process, index) => (
              <tr key={index}>
                <td>{process.name}</td>
                <td>{process.assigned}</td>
                <td>{process.maxNeed}</td>
                <td>{process.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="status">
        <h2>Estado de Simulación</h2>
        <p>Recursos Disponibles Iniciales: {availableResources}</p>
        <p>{message}</p>
        <div className="simulation-log">
          {simulationLog.map((entry, index) => (
            <p key={index}>{entry}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
