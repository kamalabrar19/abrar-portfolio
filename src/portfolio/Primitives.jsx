import { motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function Reveal({ children, className = '' }) {
  const reduced = useReducedMotion();
  return <Motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '60px' }} transition={{ duration: 0.55 }}>{children}</Motion.div>;
}
export function SectionHeading({ number, label, title, description }) {
  return <div className="section-heading"><div><p className="eyebrow"><span>{number} /</span> {label}</p><h2>{title}</h2></div>{description && <p className="section-description">{description}</p>}</div>;
}
export function Tags({ items }) { return <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>; }
export function ExternalLink({ href, children, className = '', ...props }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>{children}<ArrowUpRight size={16} aria-hidden="true" /></a>;
}
