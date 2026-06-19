import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Session } from '../types';
import { useSession } from '../hooks/useSession';
import SessionCard from '../components/SessionCard';

function Sessions() {
  const user = authService.getCurrentUser();
  const { sessions, error, loading, deleteSession } = useSession();

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }
    deleteSession(id);
  };

  const isAdmin = user?.admin;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Yoga Sessions</h1>
          {isAdmin && (
            <Link
              to="/sessions/create"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Session
            </Link>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session: Session) => (
              <SessionCard
                key={session.id}
                isAdmin={isAdmin}
                session={session}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No sessions available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;
