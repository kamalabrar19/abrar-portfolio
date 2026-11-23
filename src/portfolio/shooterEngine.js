export const WORLD = { left: -5.3, right: 5.3, bottom: -2.65, top: 2.65 };
export const SCORE_KEY = 'kamal-shooter-high-score';
const TYPES = [
  { label: 'BUG', color: '#ff5f56', shape: 'bug' },
  { label: 'n8n', color: '#ff8b52', shape: 'workflow' },
  { label: 'ERR', color: '#c879ff', shape: 'error' },
];
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export function createGame() {
  return { player: { x: -4.2, y: 0 }, enemies: [], bullets: [], score: 0, lives: 3,
    playing: false, time: 0, spawnClock: 0, cooldown: 0, invulnerable: 0, nextId: 1, burst: null };
}
function spawn(game, random) {
  const type = TYPES[Math.min(2, Math.floor(random() * TYPES.length))];
  return { ...type, id: game.nextId++, x: 6.2, y: (random() * 2 - 1) * 2.15,
    z: 0, speed: 1.8 + random() * .5 };
}
export function startGame(random = Math.random) {
  const game = createGame();
  game.playing = true;
  game.enemies = [spawn(game, random)];
  return game;
}
export function movePlayer(game, x, y) {
  if (!game.playing) return;
  game.player = { x: clamp(x, WORLD.left + .6, 2.9), y: clamp(y, -2.25, 2.25) };
}
export function fire(game) {
  if (!game.playing || game.cooldown > 0) return false;
  game.bullets.push({ id: game.nextId++, x: game.player.x + .8, y: game.player.y, z: 0, speed: 8.4 });
  game.cooldown = .18;
  return true;
}
// Relative swept segment vs. a circular hitbox. Handles fast crossing shots.
export function sweptHit(ax, ay, bx, by, radius) {
  const dx = bx - ax, dy = by - ay;
  const t = clamp(-(ax * dx + ay * dy) / (dx * dx + dy * dy || 1), 0, 1);
  return (ax + t * dx) ** 2 + (ay + t * dy) ** 2 <= radius ** 2;
}
export function stepGame(game, elapsed, input = {}, random = Math.random) {
  if (!game.playing || !Number.isFinite(elapsed) || elapsed <= 0) return;
  const dt = Math.min(elapsed, .05); // Never fast-forward a hidden browser tab.
  const previousPlayer = game.player;
  if (input.x || input.y) {
    const length = Math.hypot(input.x || 0, input.y || 0) || 1;
    movePlayer(game, game.player.x + (input.x || 0) / length * 4.5 * dt,
      game.player.y + (input.y || 0) / length * 4.5 * dt);
  }
  game.time += dt;
  game.cooldown = Math.max(0, game.cooldown - dt);
  game.invulnerable = Math.max(0, game.invulnerable - dt);
  if (input.firing) fire(game);
  if (game.burst && game.time >= game.burst.until) game.burst = null;
  game.spawnClock += dt;
  if (game.spawnClock >= 1.15) {
    game.spawnClock -= 1.15;
    game.enemies.push(spawn(game, random));
  }
  const oldEnemies = new Map(game.enemies.map(enemy => [enemy.id, { x: enemy.x, y: enemy.y }]));
  game.enemies.forEach(enemy => { enemy.x -= enemy.speed * dt; });
  const destroyed = new Set();
  game.bullets = game.bullets.filter(bullet => {
    const oldX = bullet.x;
    bullet.x += bullet.speed * dt;
    const candidates = game.enemies.filter(enemy => {
      if (destroyed.has(enemy.id)) return false;
      const old = oldEnemies.get(enemy.id);
      return sweptHit(oldX - old.x, bullet.y - old.y, bullet.x - enemy.x, bullet.y - enemy.y, .55);
    }).sort((a, b) => oldEnemies.get(a.id).x - oldEnemies.get(b.id).x);
    if (!candidates.length) return bullet.x < WORLD.right + 1;
    const enemy = candidates[0];
    destroyed.add(enemy.id);
    game.score += 1; // One point per destroyed target, never per overlapping bullet.
    game.burst = { x: enemy.x, y: enemy.y, color: enemy.color, until: game.time + .4 };
    return false;
  });
  game.enemies = game.enemies.filter(enemy => {
    if (destroyed.has(enemy.id)) return false;
    const old = oldEnemies.get(enemy.id);
    if (game.invulnerable <= 0 && sweptHit(old.x - previousPlayer.x, old.y - previousPlayer.y,
      enemy.x - game.player.x, enemy.y - game.player.y, .66)) {
      game.lives = Math.max(0, game.lives - 1);
      game.invulnerable = 1;
      game.burst = { x: game.player.x, y: game.player.y, color: '#ff5f56', until: game.time + .4 };
      if (game.lives === 0) game.playing = false;
      return false;
    }
    return enemy.x > WORLD.left - 1;
  });
}
export function snapshot(game) {
  return { ...game, player: { ...game.player }, enemies: game.enemies.map(item => ({ ...item })),
    bullets: game.bullets.map(item => ({ ...item })) };
}
export function readBest(storage) {
  try { const value = Number(storage.getItem(SCORE_KEY)); return Number.isSafeInteger(value) && value >= 0 ? value : 0; }
  catch { return 0; }
}
export function saveBest(storage, score) {
  try { storage.setItem(SCORE_KEY, String(score)); } catch { /* Private mode: keep playing. */ }
}
