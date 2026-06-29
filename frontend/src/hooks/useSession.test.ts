import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockSessions } from '../tests/fixtures';
import { useSession } from './useSession';
import api from '../services/api';
import { act } from 'react';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Test ===> useSession', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch sessions', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockSessions });

    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sessions).toEqual(mockSessions);
  });

  it('should fetch a session if an id is provided', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockSessions[0] });

    const { result } = renderHook(() => useSession(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.session).toEqual(mockSessions[0]);
  });

  it('should display error if cannot fetch', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Failed to load Sessions'));

    const { result } = renderHook(() => useSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load sessions');
  });

  it('should call callback after delete', async () => {
    vi.mocked(api.delete).mockResolvedValue({});
    const callback = vi.fn();
    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.deleteSession(1, callback);
    });

    expect(callback).toHaveBeenCalled();
  });

  it('should not throw error if delete fails', async () => {
    vi.mocked(api.delete).mockResolvedValue(new Error('Internal server error'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.deleteSession(1);
    });

    expect(console.error).toHaveBeenCalled();
  });

  it('should refetch after delete without callback', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockSessions });
    vi.mocked(api.delete).mockResolvedValue({});
    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.deleteSession(1);
    });

    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should refetch sessions', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockSessions });
    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.refetch();
    });

    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
