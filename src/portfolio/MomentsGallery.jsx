import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, X, Camera } from 'lucide-react';
import { useContent } from './useContent';
import '../moments.css';

function Photo({ item, full = false }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="moment-missing" role="img" aria-label={item.alt}><Camera size={36} /><span>Photo unavailable</span></div> :
    <img src={full ? item.fullSrc || item.src : item.src} alt={item.alt} draggable="false" loading={full ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}
export default function MomentsGallery() {
  const { moments } = useContent();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef(null);
  const enlarge = useRef(null);
  const dragged = useRef(false);
  const reduced = useReducedMotion();
  const item = moments[index];
  const change = step => {
    setDirection(step); setIndex(current => (current + step + moments.length) % moments.length);
  };
  useEffect(() => {
    if (!zoomed) return undefined;
    const modal = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    return () => { modal.close(); document.body.style.overflow = previous; requestAnimationFrame(() => document.querySelector('#moments .moment-image-button')?.focus({ preventScroll: true })); };
  }, [zoomed]);
  const tilt = event => {
    if (reduced || event.pointerType !== 'mouse' || event.buttons) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${-(event.clientY - box.top - box.height / 2) / box.height * 6}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(event.clientX - box.left - box.width / 2) / box.width * 6}deg`);
  };
  const untilt = event => { event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg'); };
  const keyboard = event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); change(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); }
  };
  const controls = <><button type="button" className="moment-control" aria-label="Previous moment" onClick={() => change(-1)}><ArrowLeft size={19} /></button><span className="moment-counter">{String(index + 1).padStart(2, '0')} / {String(moments.length).padStart(2, '0')}</span><button type="button" className="moment-control" aria-label="Next moment" onClick={() => change(1)}><ArrowRight size={19} /></button></>;
  return <section id="moments" className="section wrap moments-section" aria-label="Moments photo gallery" onKeyDown={zoomed ? undefined : keyboard}>
    <div className="section-heading"><div><p className="eyebrow"><span>PERSONAL /</span> MOMENTS & MEMORIES</p><h2>Life through <span className="muted">the lens.</span></h2></div><p className="section-description">Code, conversations, and a little stage time. A different side of the story.</p></div>
    <div className="moments-layout">
      <div className="moment-stack" onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="moment-stack-back back-two" aria-hidden="true" /><div className="moment-stack-back back-one" aria-hidden="true" />
        <div className="moment-frame">
          <AnimatePresence initial={false} mode="wait">
            <Motion.div key={item.id} className="moment-photo" initial={{ opacity: 0, x: reduced ? 0 : direction * 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : direction * -35 }} transition={{ duration: reduced ? 0 : .25, ease: [.22, 1, .36, 1] }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={.15}
              onDragStart={() => { dragged.current = true; }} onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 45 || Math.abs(info.velocity.x) > 350) change(info.offset.x < 0 ? 1 : -1);
                requestAnimationFrame(() => { dragged.current = false; });
              }}>
              <button ref={enlarge} type="button" className="moment-image-button" aria-label="Enlarge photo" onClick={() => { if (!dragged.current) setZoomed(true); }}>
                <Photo item={item} /><span className="moment-zoom"><Maximize2 size={19} /></span>
              </button>
              {item.placeholder && <span className="moment-placeholder">ILLUSTRATIVE PHOTO / PLACEHOLDER</span>}
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="moment-editorial"><p className="eyebrow">{item.category}</p><h3 data-testid="moment-title">{item.title}</h3><p className="moment-caption">{item.caption}</p>
        {item.placeholder && <p className="moment-disclaimer">Sample imagery, not Kamal’s personal photograph.</p>}
        <div className="moment-navigation">{controls}</div>
        <div className="moment-dots" aria-label="Choose a moment">{moments.map((moment, i) => <button key={moment.id} aria-label={`Show moment ${i + 1}: ${moment.title}`} aria-current={i === index ? 'true' : undefined} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}><span /></button>)}</div>
        <span className="sr-only" aria-live="polite">Moment {index + 1} of {moments.length}: {item.title}</span>
      </div>
    </div>
    <dialog ref={dialog} className="moment-dialog" aria-labelledby="moment-modal-title" onCancel={event => { event.preventDefault(); setZoomed(false); }} onKeyDown={keyboard} onClick={event => { if (event.target === event.currentTarget) setZoomed(false); }}>
      <button type="button" autoFocus className="moment-control moment-close" aria-label="Close enlarged photo" onClick={() => setZoomed(false)}><X size={22} /></button>
      {zoomed && <><div className="moment-full-photo"><Photo key={item.id} item={item} full /></div><div className="moment-modal-footer"><div><h3 id="moment-modal-title">{item.title}</h3><p>{item.placeholder ? 'Illustrative placeholder. ' : ''}{item.caption}</p></div><div className="moment-navigation">{controls}</div></div></>}
    </dialog>
  </section>;
}
