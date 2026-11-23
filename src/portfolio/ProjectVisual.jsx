import { ArrowRight, Bot, Braces, Database, FileText, Globe, Layers, Workflow, Zap } from 'lucide-react';

export default function ProjectVisual({ kind, name = 'NusaQuest', link = 'https://nusaquest.com/home' }) {
  const domain = link ? new URL(link).hostname : '';
  return <div className={`project-visual visual-${kind}`} aria-hidden="true"><div className="visual-grid" />
    <span className="visual-label">{kind === 'rag' ? 'RETRIEVAL → CONTEXT → RESPONSE' : kind === 'chat' ? 'UPJ / CONVERSATIONAL INTERFACE' : kind === 'flow' ? 'WORKFLOW / CONNECTED OPERATIONS' : `${name.toUpperCase()} / WEBSITE`}</span>
    {kind === 'rag' && <div className="rag-diagram"><div className="document-stack"><span><FileText size={16} /> Knowledge base</span><span><Database size={16} /> Vector context</span><span><Layers size={16} /> Your documents</span></div><div className="connection-line" /><div className="ai-node"><Bot size={30} /><small>RAG</small></div><div className="connection-line" /><div className="response-lines"><i /><i /><i /></div></div>}
    {kind === 'chat' && <div className="chat-preview"><header><span className="mini-avatar"><Bot size={15} /></span>UPJ Assistant<span className="dot" /></header><div className="chat-bubble incoming">A new way to find your answers.</div><div className="chat-bubble outgoing">Let’s start a conversation.</div><div className="chat-input">Ask a question <ArrowRight size={13} /></div></div>}
    {kind === 'flow' && <div className="workflow-diagram"><span><Zap size={22} /><small>Trigger</small></span><b>······</b><span className="flow-active"><Workflow size={26} /><small>Process</small></span><b>······</b><span><Database size={22} /><small>Connect</small></span></div>}
    {kind === 'web' && <div className="browser-preview"><div className="browser-top"><i /><i /><i /><span>{domain}</span></div><div className="browser-body"><Globe size={25} /><strong>{name}<span>Web experience</span></strong><Braces size={42} /><div className="browser-blocks"><i /><i /><i /></div></div></div>}
    <span className="visual-caption">CONCEPT DIAGRAM · NOT A PRODUCT SCREENSHOT</span>
  </div>;
}
