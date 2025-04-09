import './App.css'
import SessionsTable from './components/SessionsTable';

function App() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Vos sessions de travail
      </h1>
      <SessionsTable />
    </div>
  );
}

export default App;