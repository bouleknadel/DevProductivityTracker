import { useState, useEffect } from 'react';
import { getAllSession } from '../services/Session';
import { useWebSocket } from '../hooks/useWebSocket';

const SessionsTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      const response = await getAllSession();
      setSessions(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useWebSocket('ws://localhost:8083/ws/sessions', (data) => {
    console.log('Reçu une mise à jour via WebSocket:', data);
    fetchSessions();
  });

  useEffect(() => {
    fetchSessions(); // Chargement initial
  }, []);

  if (loading) return <div className="p-4">Chargement en cours...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Nom</th>
            <th className="py-3 px-6 text-left">Début</th>
            <th className="py-3 px-6 text-left">Fin</th>
            <th className="py-3 px-6 text-left">Durée (min)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id} className="hover:bg-gray-50 border-b">
              <td className="py-4 px-6">{session.id}</td>
              <td className="py-4 px-6">{session.id}</td>
              <td className="py-4 px-6">
                {new Date(session.startTime).toLocaleString()}
              </td>
              <td className="py-4 px-6">
                {session.endTime 
                  ? new Date(session.endTime).toLocaleString() 
                  : <span className="text-blue-500">En cours</span>}
              </td>
              <td className="py-4 px-6">
                {session.duration || (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsTable;