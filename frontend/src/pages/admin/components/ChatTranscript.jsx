import { useEffect, useRef } from 'react';
import { Loader2, FileText, MapPin, Mic, Video, BarChart3, MessageSquareOff } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import Avatar from './Avatar';

const AVATAR_COLORS = ['#0D9488', '#6D5BD0', '#2C5680', '#D08700', '#D14343', '#0B7A70'];
const colorFor = (id = '') => {
  const s = String(id);
  return AVATAR_COLORS[(s.charCodeAt(0) + s.length) % AVATAR_COLORS.length] || T.primary;
};

const fmtTime = (ts) => {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const dayKey = (ts) => {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? '' : d.toDateString();
};

const fmtDay = (ts) => {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

const Attachment = ({ icon, label }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: T.inkSoft }}>
    {icon} {label}
  </span>
);

// Render a single message's body, handling all stored message types.
const Body = ({ m }) => {
  if (m.type === 'image' && m.image) {
    return (
      <a href={m.image} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
        <img src={m.image} alt="" style={{ maxWidth: 200, maxHeight: 200, borderRadius: radius.md, objectFit: 'cover', display: 'block' }} />
        {m.content && <div style={{ marginTop: 6 }}>{m.content}</div>}
      </a>
    );
  }
  if (m.type === 'video') return <Attachment icon={<Video size={14} />} label="Video" />;
  if (m.type === 'document') return <Attachment icon={<FileText size={14} />} label={m.documentData?.name || m.documentData?.fileName || 'Document'} />;
  if (m.type === 'location') return <Attachment icon={<MapPin size={14} />} label={m.locationData?.address || 'Location'} />;
  if (m.type === 'voice') return <Attachment icon={<Mic size={14} />} label="Voice message" />;
  if (m.type === 'poll' || m.quoteData) {
    const q = m.quoteData?.question || m.content || 'Poll';
    const opts = m.quoteData?.options || [];
    return (
      <div>
        <Attachment icon={<BarChart3 size={14} />} label={q} />
        {Array.isArray(opts) && opts.length > 0 && (
          <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 12, color: T.muted }}>
            {opts.map((o, i) => <li key={i}>{typeof o === 'string' ? o : o?.text || o?.label || `Option ${i + 1}`}</li>)}
          </ul>
        )}
      </div>
    );
  }
  return <span>{m.content || <em style={{ color: T.faint }}>(empty message)</em>}</span>;
};

/**
 * ChatTranscript
 * --------------
 * Read-only chat viewer for admin moderation. Renders messages as bubbles with a
 * sender label, day separators and timestamps. When `meId` is provided, messages
 * from that sender are right-aligned (used for one-to-one DM views); otherwise all
 * messages are left-aligned with sender names (group view).
 */
const ChatTranscript = ({ messages = [], meId = null, loading, error, emptyText = 'No messages yet.' }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40, color: T.muted, fontSize: 13 }}>
        <Loader2 size={16} className="admin-spin" /> Loading messages…
      </div>
    );
  }
  if (error) {
    return <div style={{ padding: 32, textAlign: 'center', color: T.danger, fontSize: 13, fontWeight: 600 }}>{error}</div>;
  }
  if (!messages.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 48, color: T.faint }}>
        <MessageSquareOff size={28} />
        <div style={{ fontSize: 13, fontWeight: 600 }}>{emptyText}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 14px' }}>
      {messages.map((m, i) => {
        const mine = meId && String(m.senderId) === String(meId);
        const prev = messages[i - 1];
        const dk = dayKey(m.createdAt);
        const showDay = dk && (!prev || dayKey(prev.createdAt) !== dk);

        return (
          <div key={m.id}>
            {showDay && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 8px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, background: T.surfaceAlt, border: `1px solid ${T.line}`, padding: '3px 12px', borderRadius: 99 }}>
                  {fmtDay(m.createdAt)}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: mine ? 'flex-end' : 'flex-start', margin: '4px 0' }}>
              {!mine && <Avatar name={m.senderName} color={colorFor(m.senderId)} size={28} />}
              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                {!mine && (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: colorFor(m.senderId), marginBottom: 2 }}>{m.senderName || 'User'}</span>
                )}
                <div
                  style={{
                    fontSize: 13, lineHeight: 1.45, color: mine ? '#fff' : T.ink, fontWeight: 500,
                    background: mine ? T.primary : T.surface,
                    border: `1px solid ${mine ? 'transparent' : T.line}`,
                    padding: '8px 11px',
                    borderRadius: 14,
                    borderTopRightRadius: mine ? 4 : 14,
                    borderTopLeftRadius: mine ? 14 : 4,
                    wordBreak: 'break-word', whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.replyTo && (
                    <div style={{ borderLeft: `3px solid ${mine ? 'rgba(255,255,255,0.6)' : T.primary}`, paddingLeft: 8, marginBottom: 6, opacity: 0.85, fontSize: 12 }}>
                      <div style={{ fontWeight: 700 }}>{m.replyTo.name || 'User'}</div>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{m.replyTo.content || ''}</div>
                    </div>
                  )}
                  <Body m={m} />
                </div>
                <span style={{ fontSize: 10.5, color: T.faint, marginTop: 3 }}>{fmtTime(m.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default ChatTranscript;
