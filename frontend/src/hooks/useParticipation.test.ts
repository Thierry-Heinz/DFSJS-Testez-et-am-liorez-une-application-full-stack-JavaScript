import { describe, expect, it } from 'vitest';
import api from '../services/api';
import { useParticipation } from './useParticipation';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Test ===> useParticipation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call post and refetch if participate', async () => {
    const refetch = vi.fn();
    const { participate } = useParticipation({
      sessionId: 1,
      userId: 1,
      refetch,
    });

    await participate();
    expect(api.post).toHaveBeenCalledWith('/session/1/participate/1');
    expect(refetch).toHaveBeenCalled();
  });

  it('should display error if cannot participate', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const refetch = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(api.post).mockRejectedValue(new Error('Internal server error'));
    const { participate } = useParticipation({
      sessionId: 1,
      userId: 1,
      refetch,
    });

    await participate();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to join session');
  });

  it('should call delete and refetch if unparticipate', async () => {
    const refetch = vi.fn();
    const { unparticipate } = useParticipation({
      sessionId: 1,
      userId: 1,
      refetch,
    });

    await unparticipate();
    expect(api.delete).toHaveBeenCalledWith('/session/1/participate/1');
    expect(refetch).toHaveBeenCalled();
  });

  it('should display error if cannot unparticipate', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const refetch = vi.fn();
    vi.mocked(api.delete).mockRejectedValue(new Error('Internal server error'));
    const { unparticipate } = useParticipation({
      sessionId: 1,
      userId: 1,
      refetch,
    });

    await unparticipate();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to leave session');
  });
});
