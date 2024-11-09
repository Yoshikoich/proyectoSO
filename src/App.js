import React, { useState } from 'react';

const App = () => {
  const [procesos, setProcesos] = useState([]);
  const [recursosDisponiblesIniciales, setRecursosDisponiblesIniciales] = useState(5);
  const [recursosTotales, setRecursosTotales] = useState(0);
  const [log, setLog] = useState([]);
  const [secuenciaSegura, setSecuenciaSegura] = useState([]);

  // Genera datos aleatorios para los procesos
  const generarDatos = () => {
    const nuevosProcesos = [
      { nombre: 'A', recursosAsignados: 1, necesidadMaxima: 6 },
      { nombre: 'B', recursosAsignados: 2, necesidadMaxima: 3 },
      { nombre: 'C', recursosAsignados: 1, necesidadMaxima: 7 },
    ];

    const totalAsignados = nuevosProcesos.reduce((sum, proceso) => sum + proceso.recursosAsignados, 0);
    setRecursosTotales(totalAsignados + recursosDisponiblesIniciales);
    
    const procesosConDiferencia = nuevosProcesos.map(proceso => ({
      ...proceso,
      diferencia: proceso.necesidadMaxima - proceso.recursosAsignados,
    }));
    
    setProcesos(procesosConDiferencia);
    setLog(['✅ Datos generados y condiciones cumplidas']);
    setSecuenciaSegura([]);
  };

  // Simula el algoritmo del banquero para evitar bloqueos
  const prevenirBloqueo = () => {
    let recursosDisponibles = recursosDisponiblesIniciales;
    let secuencia = [];
    let procesosPendientes = [...procesos];
    let simulacionLog = [];

    while (procesosPendientes.length > 0) {
      let procesoEjecutado = false;

      for (let i = 0; i < procesosPendientes.length; i++) {
        const proceso = procesosPendientes[i];

        if (proceso.diferencia <= recursosDisponibles) {
          simulacionLog.push(`🟢 Otorgando recursos al proceso ${proceso.nombre} (Recursos Disponibles: ${recursosDisponibles} - Diferencia: ${proceso.diferencia})`);
          recursosDisponibles += proceso.recursosAsignados;
          secuencia.push(proceso.nombre);

          simulacionLog.push(`✅ READY - Proceso ${proceso.nombre} está en ejecución.`);
          simulacionLog.push(`🔄 Devolviendo recursos de ${proceso.nombre} (Recursos Disponibles: ${recursosDisponibles - proceso.necesidadMaxima} + Necesidad Máxima: ${proceso.necesidadMaxima}) = ${recursosDisponibles}`);

          // Remover el proceso de la lista de pendientes
          procesosPendientes.splice(i, 1);
          procesoEjecutado = true;
          break;
        }
      }

      if (!procesoEjecutado) {
        simulacionLog.push("⚠️ No se pueden procesar más procesos sin riesgo de bloqueo.");
        simulacionLog.push("⚠️ No fue posible procesar todos los procesos debido a insuficientes recursos disponibles.");
        setLog(simulacionLog);
        setSecuenciaSegura([]);
        return;
      }
    }

    simulacionLog.push("✅ Todos los procesos han sido procesados en el siguiente orden: " + secuencia.join(', '));
    setLog(simulacionLog);
    setSecuenciaSegura(secuencia);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', color: '#fff', backgroundColor: '#222', minHeight: '100vh' }}>
      <h1>Algoritmo del Banquero - Prevención de Bloqueos</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={generarDatos} style={buttonStyle}>Generar Datos</button>
        <button onClick={prevenirBloqueo} style={buttonStyle}>Empezar Prevención de Bloqueos</button>
      </div>
      <h2>Tabla de Procesos</h2>
      <table style={tableStyle}>
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
              <td>{proceso.recursosAsignados}</td>
              <td>{proceso.necesidadMaxima}</td>
              <td>{proceso.diferencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Recursos Disponibles Iniciales: {recursosDisponiblesIniciales}</h3>
      <h3>Recursos Totales: {recursosTotales}</h3>
      <h2>Estado de Simulación</h2>
      <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
        {log.map((line, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
  backgroundColor: '#333',
};

export default App;
