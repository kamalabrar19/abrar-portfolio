// @vitest-environment jsdom
import { act, fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import Mini3DGame from './Mini3DGame';

const frame = vi.hoisted(() => ({ tick: null }));
vi.mock('@react-three/fiber', async () => {
  const React = await import('react');
  return {
    Canvas: ({ children }) => children,
    useFrame: callback => {
      React.useEffect(() => {
        // Scene owns the simulation, other callbacks animate meshes only.
        if (callback.toString().includes('onTick')) frame.tick = callback;
      }, [callback]);
    },
  };
});
vi.mock('@react-three/drei', () => ({ PerspectiveCamera: () => null, Sparkles: () => null, Text: () => null }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

test('a 60fps game records shots hitting targets, not just a mounted canvas', async () => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(.5);
  // R3F elements are inert DOM nodes here; only the GPU renderer is replaced.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Mini3DGame />);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Play shooter' })); await import('./ShooterCanvas'); });
  // Give mocked R3F group nodes their renderer-owned transform property.
  document.querySelectorAll('group').forEach(node => { node.position = { x: 0, y: 0, z: 0 }; });
  for (let i = 0; i < 240; i++) {
    if (i % 15 === 0) fireEvent.click(screen.getByRole('button', { name: 'Fire weapons' }));
    act(() => { vi.advanceTimersByTime(16); frame.tick({}, .016); });
  }
  expect(screen.queryByText('0 bugs cleared')).toBeNull();
});
