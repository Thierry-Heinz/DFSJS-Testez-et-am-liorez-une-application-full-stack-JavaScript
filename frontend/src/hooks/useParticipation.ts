import api from '../services/api';

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
  const participate = async (): Promise<any> => {
    try {
      await api.post(`/session/${sessionId}/participate/${userId}`);
      refetch();
    } catch (err: any) {
      alert('Failed to join session');
      console.error(err);
    }
  };

  const unparticipate = async (): Promise<any> => {
    try {
      await api.delete(`/session/${sessionId}/participate/${userId}`);
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
