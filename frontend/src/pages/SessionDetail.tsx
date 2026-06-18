import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useSession } from '../hooks/useSession';
import { useParticipation } from '../hooks/useParticipation';

function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();

  if (!id || !user) {
    navigate('/sessions');
    return null;
  }

  const { session, error, loading, deleteSession, refetch } = useSession(+id);
  const { participate, unparticipate } = useParticipation({
    sessionId: id!,
    userId: user.id,
    refetch,
  });

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }
    deleteSession(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading session...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Session not found'}
        </div>
      </div>
    );
  }

  const isParticipating = session.users.includes(user.id);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {session.name}
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Details
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Date:</strong>{' '}
                {new Date(session.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>
                <strong>Teacher:</strong> {session.teacher.firstName}{' '}
                {session.teacher.lastName}
              </p>
              <p>
                <strong>Participants:</strong> {session.users.length}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Description
            </h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {session.description}
            </p>
          </div>

          <div className="flex space-x-4">
            {user.admin ? (
              <>
                <button
                  onClick={() => navigate(`/sessions/edit/${id}`)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(+id)}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                {isParticipating ? (
                  <button
                    onClick={unparticipate}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                  >
                    Leave Session
                  </button>
                ) : (
                  <button
                    onClick={participate}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Join Session
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => navigate('/sessions')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;
