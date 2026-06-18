import { useEffect, useRef, useState } from 'react';
import { Session } from '../types';
import { authService } from '../services/auth.service';
import api from '../services/api';

export const useSession = (id?: string | undefined) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const token = authService.getToken();
  const controller = useRef(new AbortController());

  useEffect(() => {
    fetchSessions(controller.current.signal);

    return () => {
      controller.current.abort();
    };
  }, []);

  const fetchSessions = async (abortSignal: AbortSignal): Promise<void> => {
    let url = `/session`;

    if (id) url += `/${id}`;

    try {
      setLoading(true);
      const response = await api.get<Session[]>(url, {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSessions(response.data);
    } catch (err: unknown) {
      if (!abortSignal.aborted) {
        setError('Failed to load sessions');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: number): Promise<void> => {
    try {
      await api.delete(`/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      controller.current = new AbortController();
      fetchSessions(controller.current.signal);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const refetch = async (): Promise<void> => {
    controller.current = new AbortController();
    fetchSessions(controller.current.signal);
  };

  return {
    sessions,
    session: sessions[0],
    loading,
    error,
    deleteSession,
    refetch,
  };
};
