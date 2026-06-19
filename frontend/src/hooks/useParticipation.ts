import api from '../services/api';
import { authService } from '../services/auth.service';

type UseParticipateProps = {
  sessionId: number | undefined;
  userId: number | undefined;
  refetch(): Promise<void>;
};

export const useParticipation = ({
  sessionId,
  userId,
  refetch,
}: UseParticipateProps) => {
  const token = authService.getToken();

  const participate = async (): Promise<any> => {
    try {
      await api.post(
        `/session/${sessionId}/participate/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      refetch();
    } catch (err: any) {
      alert('Failed to join session');
      console.error(err);
    }
  };

  const unparticipate = async (): Promise<any> => {
    try {
      await api.delete(`/session/${sessionId}/participate/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refetch();
    } catch (err: any) {
      alert('Failed to leave session');
      console.error(err);
    }
  };

  return {
    participate,
    unparticipate,
  };
};
