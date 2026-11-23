import { expect, test } from 'vitest';
import { startGame, stepGame, fire, movePlayer, readBest, saveBest } from './shooterEngine';
const target = (id, x = 0, y = 0) => ({ id, x, y, speed: 0, color: '#ff5555' });
const bullet = (id, x = -1, y = 0, speed = 100) => ({ id, x, y, speed });

test('fast crossing bullet destroys the target and scores exactly once', () => {
  const game = startGame(() => .5);
  game.enemies = [target(100)]; game.bullets = [bullet(200)];
  stepGame(game, .05);
  expect(game.enemies).toHaveLength(0);
  expect(game.bullets).toHaveLength(0);
  expect(game.score).toBe(1);
  expect(game.burst.color).toBe('#ff5555');
  stepGame(game, .016);
  expect(game.score).toBe(1);
});

test('overlapping shots cannot award duplicate points for one enemy', () => {
  const game = startGame(() => .5);
  game.enemies = [target(100)]; game.bullets = [bullet(200), bullet(201)];
  stepGame(game, .05);
  expect(game.score).toBe(1);
  expect(game.enemies).toHaveLength(0);
  expect(game.bullets).toHaveLength(1);
});

test('one bullet hits the nearest enemy only while an off-axis shot misses', () => {
  const game = startGame(() => .5);
  game.enemies = [target(101, 2), target(100)];
  game.bullets = [bullet(200), bullet(201, -1, 2)];
  stepGame(game, .05);
  expect(game.enemies.map(enemy => enemy.id)).toEqual([101]);
  expect(game.score).toBe(1);
  expect(game.bullets.map(item => item.id)).toEqual([201]);
});

test('ship collisions use the actual ship x and y and allow brief recovery', () => {
  const game = startGame(() => .5);
  movePlayer(game, 1, 1);
  game.enemies = [target(100, 1, 1), target(101, 1, 1)];
  stepGame(game, .016);
  expect(game.lives).toBe(2);
  expect(game.enemies).toHaveLength(1);
  stepGame(game, .016);
  expect(game.lives).toBe(2);
});

test('three separate hits end the mission and stopped games ignore shots', () => {
  const game = startGame(() => .5);
  for (let i = 0; i < 3; i++) {
    game.invulnerable = 0;
    game.enemies = [target(100 + i, game.player.x, game.player.y)];
    stepGame(game, .016);
  }
  expect(game.lives).toBe(0);
  expect(game.playing).toBe(false);
  expect(fire(game)).toBe(false);
  const before = structuredClone(game);
  stepGame(game, 2);
  expect(game).toEqual(before);
  const fresh = startGame(() => .5);
  expect(fresh.lives).toBe(3); expect(fresh.score).toBe(0);
  expect(fresh.cooldown).toBe(0); expect(fresh.bullets).toHaveLength(0);
});

test('pause freezes simulation and resuming does not accumulate a shot backlog', () => {
  const game = startGame(() => .5);
  game.playing = false;
  const before = structuredClone(game);
  stepGame(game, 10, { firing: true });
  expect(game).toEqual(before);
  game.playing = true;
  stepGame(game, 10, { firing: true });
  expect(game.bullets).toHaveLength(1);
  expect(game.time).toBe(.05);
});

test('invalid or blocked high-score storage never stops gameplay', () => {
  const blocked = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  expect(readBest(blocked)).toBe(0);
  expect(() => saveBest(blocked, 3)).not.toThrow();
  for (const value of ['NaN', '-5', 'Infinity', '3.5']) expect(readBest({ getItem: () => value })).toBe(0);
  expect(readBest({ getItem: () => '12' })).toBe(12);
});
