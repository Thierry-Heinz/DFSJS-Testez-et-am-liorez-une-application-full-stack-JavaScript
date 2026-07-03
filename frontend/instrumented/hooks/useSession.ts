import { useEffect, useRef, useState } from 'react';
import { Session } from '../types';
import api from '../services/api';

export const useSession = (id?: number | undefined) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const controller = useRef(new AbortController());

  useEffect(() => {
    controller.current = new AbortController();
    fetchSessions(controller.current.signal);

    return () => {
      controller.current.abort();
    };
  }, [id]);

  const fetchSessions = async (abortSignal: AbortSignal): Promise<void> => {
    let url = `/session`;
    if (id) url += `/${id}`;

    try {
      setLoading(true);
      const response = await api.get<Session[]>(url, {
        signal: abortSignal,
      });

      setSessions(
        Array.isArray(response.data) ? response.data : [response.data],
      );
    } catch (err: unknown) {
      if (!abortSignal.aborted) {
        setError('Failed to load sessions');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (
    sessionId: number,
    callback?: () => void,
  ): Promise<void> => {
    try {
      await api.delete(`/session/${sessionId}`);
      if (!callback) {
        controller.current = new AbortController();
        fetchSessions(controller.current.signal);
      } else {
        callback();
      }
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
