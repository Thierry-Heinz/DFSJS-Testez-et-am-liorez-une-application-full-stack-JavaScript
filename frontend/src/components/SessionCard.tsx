import { Link } from 'react-router-dom';
import { Session } from '../types';

type Props = {
  isAdmin: boolean | undefined;
  session: Session;
  handleDelete: (id: number) => void;
};

const SessionCard = ({ isAdmin, session, handleDelete }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{session.name}</h3>
      <p className="text-gray-600 mb-2">
        Date: {new Date(session.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        Teacher: {session.teacher.firstName} {session.teacher.lastName}
      </p>
      <p className="text-gray-600 mb-4">Participants: {session.users.length}</p>
      <p className="text-gray-700 mb-4 line-clamp-3">{session.description}</p>

      <div className="flex space-x-2">
        <Link
          to={`/sessions/${session.id}`}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700"
        >
          View Details
        </Link>

        {isAdmin && (
          <button
            onClick={() => handleDelete(session.id)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
