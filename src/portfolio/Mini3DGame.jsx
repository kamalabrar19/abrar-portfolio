import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Crosshair, Play, RotateCcw, Trophy, X } from 'lucide-react';
import { createGame, startGame, stepGame, fire, movePlayer, snapshot, readBest, saveBest } from './shooterEngine';
import '../game.css';

const ShooterCanvas = lazy(() => import('./ShooterCanvas'));
const directions = { arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
  arrowup: [0, 1], w: [0, 1], arrowdown: [0, -1], s: [0, -1] };

export default function Mini3DGame() {
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState(createGame);
  const simulation = useRef(createGame());
  const input = useRef({ keys: new Set(), firing: false });
  const arena = useRef(null);
  const playButton = useRef(null);
  const [highScore, setHighScore] = useState(() => {
    try { return readBest(window.localStorage); } catch { return 0; }
  });
  const best = useRef(highScore);
  const publish = useCallback(() => {
    const current = simulation.current;
    if (current.score > best.current) {
      best.current = current.score;
      setHighScore(current.score);
      try { saveBest(window.localStorage, current.score); } catch { /* Storage can be blocked. */ }
    }
    setGame(snapshot(current));
  }, []);
  const clearInput = useCallback(() => {
    input.current.keys.clear(); input.current.firing = false;
  }, []);
  const reset = useCallback(() => {
    simulation.current = startGame();
    clearInput(); publish();
    arena.current?.focus({ preventScroll: true });
  }, [clearInput, publish]);
  const shoot = useCallback(() => { fire(simulation.current); publish(); }, [publish]);
  const move = useCallback((dx, dy) => {
    const current = simulation.current;
    movePlayer(current, current.player.x + dx, current.player.y + dy); publish();
  }, [publish]);
  const tick = useCallback(delta => {
    const current = simulation.current;
    if (!current.playing) return;
    let x = 0, y = 0;
    input.current.keys.forEach(key => { const direction = directions[key]; if (direction) { x += direction[0]; y += direction[1]; } });
    stepGame(current, delta, { x, y, firing: input.current.firing });
    publish();
  }, [publish]);
  const pause = useCallback(() => {
    simulation.current.playing = false; clearInput(); publish();
  }, [clearInput, publish]);
  useEffect(() => {
    if (!open) return undefined;
    arena.current?.focus({ preventScroll: true });
    const hidden = () => { if (document.hidden) pause(); };
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', hidden);
    return () => { window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', hidden); clearInput(); };
  }, [open, pause, clearInput]);
  const onKeyDown = event => {
    const key = event.key.toLowerCase();
    if (key === 'escape') { event.preventDefault(); pause(); return; }
    if (!directions[key] && key !== ' ') return;
    event.preventDefault();
    if (key === ' ') { input.current.firing = true; shoot(); }
    else input.current.keys.add(key);
  };
  const onKeyUp = event => {
    const key = event.key.toLowerCase();
    input.current.keys.delete(key);
    if (key === ' ') { event.preventDefault(); input.current.firing = false; }
  };
  const pointerMove = event => {
    if (event.pointerType === 'touch' && event.buttons === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const halfHeight = Math.tan(38 * Math.PI / 360) * 12;
    const x = ((event.clientX - rect.left) / rect.width * 2 - 1) * halfHeight * rect.width / rect.height;
    const y = (1 - (event.clientY - rect.top) / rect.height * 2) * halfHeight;
    movePlayer(simulation.current, x, y); publish();
  };
  const stopFiring = () => { input.current.firing = false; };
  const close = () => {
    pause(); setOpen(false);
    requestAnimationFrame(() => playButton.current?.focus({ preventScroll: true }));
  };

  if (!open) return <section id="playground" className="game-invite wrap">
    <div><p className="eyebrow"><span>PLAYGROUND / 01</span> INTERACTIVE ZONE</p><h2>Defend the <span>signal.</span></h2>
      <p>Fly the KA fighter, clear digital bugs, and keep your three shields intact. One target. One point.</p></div>
    <button ref={playButton} className="button primary" onClick={() => { reset(); setOpen(true); }}><Play size={17} fill="currentColor" />Play shooter</button>
  </section>;

  return <section id="playground" className="game-section" onKeyDown={onKeyDown} onKeyUp={onKeyUp}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) pause(); }}>
    <div className="wrap game-shell">
      <div className="game-header"><div><p className="eyebrow"><span>PLAYGROUND / 01</span> DIGITAL SKIES</p><h2>Ship the fix.<br /><span>Break the bugs.</span></h2></div>
        <button className="icon-button" aria-label="Close game" onClick={close}><X size={19} /></button></div>
      <div className="shooter-hud" aria-label="Mission statistics">
        <span>SCORE <strong data-testid="score">{game.score}</strong></span>
        <span><Trophy size={14} aria-hidden="true" /> BEST <strong data-testid="best-score">{highScore}</strong></span>
        <span>SHIELDS <strong data-testid="lives">{game.lives} / 3</strong></span>
      </div>
      <div ref={arena} className="game-stage" tabIndex={0} role="group" aria-label="Shooter arena" aria-describedby="shooter-instructions"
        data-enemy-ids={game.enemies.map(item => item.id).join(',')} data-bullet-count={game.bullets.length}
        data-player-x={game.player.x} data-player-y={game.player.y}
        onPointerMove={pointerMove} onPointerDown={event => {
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          pointerMove(event); input.current.firing = true; shoot();
        }} onPointerUp={stopFiring} onPointerCancel={stopFiring} onLostPointerCapture={stopFiring}>
        <Suspense fallback={<div className="game-overlay" role="status">Loading the flight deck…</div>}><ShooterCanvas game={game} onTick={tick} /></Suspense>
        {!game.playing && <div className="game-overlay" role="status"><h3>{game.lives ? 'Mission paused' : 'Mission complete'}</h3><p>{game.lives ? 'Ready when you are.' : `${game.score} bugs cleared. Take another flight?`}</p>
          <button className="button primary" onPointerDown={event => event.stopPropagation()} onClick={() => {
            if (!game.lives) reset(); else { simulation.current.playing = true; publish(); arena.current?.focus({ preventScroll: true }); }
          }}>{game.lives ? 'Resume mission' : 'Play again'}</button></div>}
      </div>
      <div className="game-controls"><div className="game-status"><span className="live-dot" />{game.playing ? 'LIVE MISSION' : game.lives ? 'PAUSED' : 'MISSION OVER'}<span className="game-count">{game.score} bugs cleared</span></div>
        <div className="game-buttons">
          {[['left', -.35, 0, '←'], ['up', 0, .35, '↑'], ['down', 0, -.35, '↓'], ['right', .35, 0, '→']].map(([name, x, y, symbol]) => <button className="game-control" key={name} aria-label={`Move fighter ${name}`} onClick={() => move(x, y)}>{symbol}</button>)}
          <button className="game-control fire-control" onClick={shoot} aria-label="Fire weapons"><Crosshair size={17} /></button>
          <button className="button secondary" onClick={pause}>Pause</button>
          <button className="button secondary" onClick={reset}><RotateCcw size={15} />Restart</button>
        </div>
      </div>
      <p id="shooter-instructions" className="game-note">Mouse / drag or WASD / arrows to fly. Click or hold Space to fire. Touch buttons work too. Escape pauses. One point per bug; collision costs one shield.</p>
    </div>
  </section>;
}
