import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, BarChart2, Megaphone, MoreVertical,
  Phone, Video, Smile, Paperclip, Mic, Check, CheckCheck
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

/* ─── Constants ──────────────────────────────────────────────────── */
// Chat is now fullscreen (no Layout nav). Input sits at bottom-0.
const INPUT_BAR_H    = 64;  // px
const MSG_BOTTOM_PAD = INPUT_BAR_H + 8;

const GROUP = {
  name: 'iPhone 16 Pro Max — Bulk Buy',
  subtitle: '18 members · 12 active',
  avatarColor: 'bg-orange-500',
  initials: 'iP',
};

const SEED_MESSAGES = [
  { id: 1,  type: 'system',   text: 'Ankit A. created this group', time: 'Apr 14' },
  { id: 2,  type: 'admin',    text: "🎉 Group has reached 18/20 members! Just 2 spots left. Vendor deal will be submitted once we're full.", time: '10:15' },
  { id: 3,  type: 'other',    sender: 'Rahul S.', initials: 'RS', color: '#1877f2', bg: '#e8f0fe',
              text: 'Has anyone checked the current market price? Flipkart has it at ₹1,12,000 right now.', time: '10:22', status: 'read' },
  { id: 4,  type: 'other',    sender: 'Priya K.', initials: 'PK', color: '#7c3aed', bg: '#ede9fe',
              text: "Amazon is even higher at ₹1,18,000. If we lock ₹99K that's a huge win! 🔥", time: '10:24', status: 'read' },
  { id: 5,  type: 'me',       text: "The vendor confirmed ₹99K for 20+ units. Let's fill the last 2 spots quickly.", time: '10:30', status: 'read' },
  {
    id: 6, type: 'poll',
    sender: 'Ankit A.', initials: 'AA', color: '#f97316', bg: '#fff3e0',
    question: 'When should we finalize the deal?',
    options: [
      { label: 'This week',              votes: 12 },
      { label: 'Next week',              votes: 4  },
      { label: 'When target hits',       votes: 2  },
    ],
    totalVotes: 18,
    time: '10:35',
  },
  { id: 7,  type: 'other',    sender: 'Sonia M.', initials: 'SM', color: '#059669', bg: '#d1fae5',
              text: 'Voted for this week — deal is too good to wait 👏', time: '10:42', status: 'read' },
  { id: 8,  type: 'other',    sender: 'Vikram T.', initials: 'VT', color: '#d97706', bg: '#fef3c7',
              text: 'Same here. Ready to confirm the moment the group locks.', time: '10:44', status: 'read' },
  { id: 9,  type: 'me',       text: "Great! I'll ping everyone once vendor submits the final offer.", time: '10:46', status: 'read' },
];

/* ─── Date Separator ─────────────────────────────────────────────── */
const DateSep = ({ label }) => (
  <div className="flex items-center justify-center my-4">
    <span className="text-[11px] font-semibold text-gray-400 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100">
      {label}
    </span>
  </div>
);

/* ─── Tick icon ──────────────────────────────────────────────────── */
const Tick = ({ status }) => {
  if (status === 'read')     return <CheckCheck size={13} className="text-secondary shrink-0" />;
  if (status === 'delivered') return <CheckCheck size={13} className="text-gray-400 shrink-0" />;
  return <Check size={13} className="text-gray-400 shrink-0" />;
};

/* ─── Poll Bubble ────────────────────────────────────────────────── */
const PollBubble = ({ msg }) => {
  const [voted, setVoted] = useState(null);

  return (
    <div className="bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm overflow-hidden max-w-[75vw]">
      {/* Poll header */}
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2 border-b border-gray-50">
        <BarChart2 size={14} className="text-primary" />
        <span className="text-[11px] font-black uppercase tracking-wider text-primary">Group Poll</span>
        <span className="ml-auto text-[11px] text-gray-400 font-medium">{msg.totalVotes} votes</span>
      </div>
      {/* Question */}
      <p className="px-4 py-2.5 text-[14px] font-bold text-gray-900 leading-snug">{msg.question}</p>
      {/* Options */}
      <div className="px-3 pb-3 space-y-2">
        {msg.options.map((opt, i) => {
          const pct = Math.round((opt.votes / msg.totalVotes) * 100);
          const active = voted === i;
          return (
            <button
              key={i}
              onClick={() => setVoted(i)}
              className={`relative w-full text-left rounded-xl overflow-hidden border transition-all ${
                active ? 'border-primary/40' : 'border-gray-100'
              }`}
            >
              {/* fill bar */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 rounded-xl ${
                  active ? 'bg-primary/12' : 'bg-gray-50'
                }`}
                style={{ width: voted !== null ? `${pct}%` : '0%' }}
              />
              <div className="relative flex items-center justify-between px-3 py-2.5">
                <span className={`text-[13px] font-semibold ${active ? 'text-primary' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
                {voted !== null && (
                  <span className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-gray-400'}`}>
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Message Bubble ─────────────────────────────────────────────── */
const Bubble = ({ msg }) => {
  const isMe = msg.type === 'me';

  if (msg.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] text-gray-400 font-medium bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">
          {msg.text}
        </span>
      </div>
    );
  }

  if (msg.type === 'admin') {
    return (
      <div className="flex justify-center my-3 px-4">
        <div className="bg-secondary/8 border border-secondary/15 rounded-2xl px-4 py-3 max-w-[88%] flex items-start gap-2.5">
          <Megaphone size={13} className="text-secondary shrink-0 mt-0.5" />
          <p className="text-[12.5px] font-semibold text-secondary leading-relaxed">{msg.text}</p>
        </div>
      </div>
    );
  }

  if (msg.type === 'poll') {
    return (
      <div className="flex items-end gap-2 px-4 my-1">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mb-1"
          style={{ backgroundColor: msg.bg, color: msg.color }}
        >
          {msg.initials}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold ml-1" style={{ color: msg.color }}>{msg.sender}</span>
          <PollBubble msg={msg} />
          <span className="text-[10px] text-gray-400 ml-1">{msg.time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 px-4 my-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
      {/* Avatar — only for others */}
      {!isMe && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mb-1"
          style={{ backgroundColor: msg.bg, color: msg.color }}
        >
          {msg.initials}
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[72vw] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Sender name for received */}
        {!isMe && (
          <span className="text-[11px] font-bold ml-2" style={{ color: msg.color }}>
            {msg.sender}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`relative px-3.5 py-2.5 shadow-sm ${
            isMe
              ? 'bg-[#e7f3ff] text-gray-900 rounded-2xl rounded-br-none'
              : 'bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-bl-none'
          }`}
        >
          <p className="text-[14px] leading-relaxed font-normal">{msg.text}</p>

          {/* Time + tick */}
          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-gray-400">{msg.time}</span>
            {isMe && <Tick status={msg.status} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const GroupChat = () => {
  const { groupId } = useParams();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    /*
      This component renders inside <Layout> which wraps <main className="pb-32 md:pb-0">.
      We use a fixed/sticky header and a fixed input bar that sits ABOVE the BottomNav (≈74px).
      The message scroll area gets bottom padding equal to input bar + bottom nav + buffer.
    */
    <div className="flex flex-col bg-[#f0f2f5]" style={{ minHeight: '100dvh' }}>

      {/* ── Chat Header (sticky) ───────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Back */}
          <Link
            to={`/groups/${groupId}`}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>

          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full ${GROUP.avatarColor} flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-white font-black text-sm">{GROUP.initials}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-[15px] text-gray-900 leading-tight truncate">
              {GROUP.name}
            </h2>
            <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {GROUP.subtitle}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Video size={20} className="text-gray-500" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Phone size={18} className="text-gray-500" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <MoreVertical size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Messages Scroll Area ───────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto py-3"
        style={{ paddingBottom: `${MSG_BOTTOM_PAD}px` }}
      >
        <DateSep label="Today" />

        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-end gap-2 px-4 mt-1"
            >
              <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0 mb-1" />
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Bar — fixed at screen bottom (no nav present) ───── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
        <InputBar
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

/* ─── Input Bar ──────────────────────────────────────────────────── */
const InputBar = ({ input, setInput, inputRef, onSend }) => (
  <form
    onSubmit={onSend}
    className="flex items-end gap-2 px-3 py-2.5"
  >
    {/* Attach */}
    <button
      type="button"
      className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
    >
      <Paperclip size={20} />
    </button>

    {/* Text field */}
    <div className="flex-1 flex items-end bg-gray-100 rounded-3xl px-4 py-2.5 min-h-[44px] max-h-32 relative">
      <textarea
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend(e);
          }
        }}
        rows={1}
        placeholder="Message"
        className="flex-1 bg-transparent text-[14.5px] text-gray-900 font-normal outline-none resize-none leading-relaxed placeholder:text-gray-400"
        style={{ maxHeight: '80px', overflowY: 'auto' }}
      />
      <button
        type="button"
        className="w-6 h-6 flex items-center justify-center text-gray-400 shrink-0 ml-2"
      >
        <Smile size={18} />
      </button>
    </div>

    {/* Send / Mic */}
    <AnimatePresence mode="wait">
      {input.trim() ? (
        <motion.button
          key="send"
          type="submit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0"
        >
          <Send size={18} className="text-white ml-0.5" />
        </motion.button>
      ) : (
        <motion.button
          key="mic"
          type="button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0"
        >
          <Mic size={18} className="text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  </form>
);

export default GroupChat;
