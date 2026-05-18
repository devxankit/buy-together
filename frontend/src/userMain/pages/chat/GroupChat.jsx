import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import { Avatar } from '../../../components/ui/Avatar';
import Progress from '../../../components/ui/Progress';
import ProductGlyph from '../../../components/ui/ProductGlyph';

const MESSAGES = [
  { type: 'system', text: 'Group started · 7 days ago' },
  { type: 'other', who: 'Priya', text: 'Hey everyone! I really need this by Diwali, hoping we hit 10 fast 🙏', time: '10:24 AM', seed: 3 },
  { type: 'self', text: 'Same here. Let\'s all share with 2 friends each tonight.', time: '10:28 AM' },
  { type: 'poll' },
  { type: 'other', who: 'Apple India', text: 'Stock confirmed for 10 units in Delhi NCR. Will release deal once target hits.', time: '11:12 AM', seed: 2, vendor: true },
  { type: 'system', text: 'Aman joined the group' },
  { type: 'other', who: 'Aman', text: 'Just joined! Anyone wants the 512GB variant?', time: '11:18 AM', seed: 4 },
];

const Poll = () => {
  const opts = [
    { l: 'Titanium Black', v: 60, top: true },
    { l: 'Natural Titanium', v: 28 },
    { l: 'White Titanium', v: 12 },
  ];
  return (
    <div style={{
      background: '#fff', borderRadius: 18, padding: 14,
      border: `1px solid ${c.line}`, alignSelf: 'flex-start', maxWidth: '88%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Avatar seed={2} size={22} />
        <span style={{ fontSize: 11.5, fontWeight: 500, color: c.ink }}>Aman started a poll</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 12 }}>Which color do you prefer?</div>
      {opts.map((o, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{
            position: 'relative', borderRadius: 10, padding: '8px 12px',
            background: o.top ? c.primarySoft : c.surfaceAlt,
            border: `1px solid ${o.top ? c.primary : c.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${o.v}%`,
              background: o.top ? 'rgba(15,107,83,0.10)' : 'rgba(15,15,18,0.04)',
            }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: c.ink, position: 'relative' }}>{o.l}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: o.top ? c.primary : c.muted, position: 'relative' }}>{o.v}%</span>
          </div>
        </div>
      ))}
      <div style={{ fontSize: 10.5, fontWeight: 500, color: c.faint, marginTop: 6 }}>7 voted · closes in 4h</div>
    </div>
  );
};

const Bubble = ({ msg }) => {
  if (msg.type === 'system') return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        padding: '6px 14px', borderRadius: 99,
        background: c.savingSoft, color: c.saving,
        fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="check" size={12} color={c.saving} stroke={3} /> {msg.text}
      </div>
    </div>
  );
  if (msg.type === 'poll') return <Poll />;
  const isSelf = msg.type === 'self';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start', gap: 4 }}>
      {!isSelf && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 38 }}>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: c.muted }}>{msg.who}</span>
          {msg.vendor && <Icon name="verified" size={11} color={c.info} fill={c.info} stroke={0} />}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, maxWidth: '82%' }}>
        {!isSelf && <Avatar seed={msg.seed || 3} size={28} />}
        <div style={{
          padding: '10px 14px', borderRadius: 16,
          background: isSelf ? c.ink : '#fff',
          color: isSelf ? '#fff' : c.ink,
          border: isSelf ? 'none' : `1px solid ${c.line}`,
          fontSize: 13, fontWeight: 400, lineHeight: 1.4,
          borderTopLeftRadius: isSelf ? 16 : 6,
          borderTopRightRadius: isSelf ? 6 : 16,
        }}>{msg.text}</div>
      </div>
      {msg.time && (
        <span style={{ fontSize: 9.5, fontWeight: 500, color: c.faint, paddingLeft: isSelf ? 0 : 38, paddingRight: isSelf ? 6 : 0 }}>
          {msg.time}
        </span>
      )}
    </div>
  );
};

const GroupChat = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: c.surfaceAlt }}>
      {/* Header */}
      <div style={{
        padding: 'max(36px, calc(env(safe-area-inset-top, 0px) + 12px)) 16px 12px', background: '#fff',
        borderBottom: `1px solid ${c.line}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: 12, background: c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="arrowL" size={18} color={c.ink} stroke={2.4} />
        </button>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: c.ink, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProductGlyph kind="phone" size={22} tone="rgba(255,255,255,0.7)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: c.ink, letterSpacing: -0.2 }}>iPhone 16 Pro · group</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.saving, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: c.muted }}>7 members · 3 online</span>
          </div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="users" size={18} color={c.ink} stroke={2.2} />
        </button>
      </div>

      {/* Progress strip */}
      <div style={{
        margin: '10px 16px 0', padding: '10px 14px', borderRadius: 14,
        background: `linear-gradient(135deg, ${c.primarySoft}, #DCE9E3)`,
        border: `1px solid rgba(15,107,83,0.20)`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Icon name="flame" size={18} color={c.primary} stroke={2.2} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: c.ink }}>3 more to unlock 8% off</div>
          <div style={{ marginTop: 4 }}><Progress value={7} total={10} height={4} /></div>
        </div>
        <button style={{ background: c.ink, color: '#fff', fontSize: 10.5, fontWeight: 500, padding: '7px 12px', borderRadius: 99, border: 'none', cursor: 'pointer' }}>
          INVITE
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MESSAGES.map((msg, i) => <Bubble key={i} msg={msg} />)}
      </div>

      {/* Composer */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom, 0px))',
        background: '#fff',
        borderTop: `1px solid ${c.line}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button style={{ width: 40, height: 40, borderRadius: 12, background: c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="plus" size={18} color={c.ink} stroke={2.4} />
        </button>
        <div style={{
          flex: 1, height: 44, borderRadius: 14, background: c.surfaceAlt,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
        }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message…"
            style={{ flex: 1, fontSize: 13.5, color: text ? c.ink : c.faint, background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit', fontWeight: 400 }}
          />
          <Icon name="image" size={18} color={c.faint} stroke={2.2} />
          <Icon name="mic" size={18} color={c.faint} stroke={2.2} />
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: 12,
          background: c.primary, boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)',
          border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="send" size={18} color="#fff" stroke={2.4} />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
