import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentPage } from './useContentPage';
import { showToast } from '../../../../utils/toast';
import { getChatSocket } from '../../../../services/socket';
import { isTicketUnread, markTicketSeen, countUnread } from '../../../../utils/ticketSeen';
import {
  createTicket,
  getMyTickets,
  getMyTicket,
  replyToTicket,
} from '../../../../services/ticket.api';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'account', label: 'Account' },
  { value: 'payment', label: 'Payment' },
  { value: 'group', label: 'Group' },
  { value: 'order', label: 'Order' },
  { value: 'other', label: 'Other' },
];

const STATUS_STYLE = {
  open: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Open' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'In Progress' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Resolved' },
  closed: { bg: 'bg-slate-200', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Closed' },
};

const StatusPill = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.open;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const fmtTime = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
};

const fmtDate = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
};

// Human day label for the in-thread date separators.
const dayLabel = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  const today = new Date();
  const yst = new Date(); yst.setDate(today.getDate() - 1);
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(dt, today)) return 'Today';
  if (same(dt, yst)) return 'Yesterday';
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Group thread messages by calendar day so we can render date separators.
const groupByDay = (thread) => {
  const groups = [];
  (thread || []).forEach((m) => {
    const label = dayLabel(m.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(m);
    else groups.push({ label, items: [m] });
  });
  return groups;
};

// ── Small avatar for a message sender (Support headset vs user initial) ──
const SenderAvatar = ({ isAdmin, name }) => (
  isAdmin ? (
    <div className="w-8 h-8 rounded-full bg-primary/10 border border-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 00-12 0v5a2 2 0 01-2 2h1m14-9v5a2 2 0 002 2h1M6 15a4 4 0 004 4h.5" />
      </svg>
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-[11px] font-black text-slate-500">{(name || 'Y').slice(0, 1).toUpperCase()}</span>
    </div>
  )
);

// ── FAQ accordion (admin-managed content) ───────────────────────────
const FaqList = ({ sections, loading }) => {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(null);
  const filtered = sections.filter((f) => (f.title || '').toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <>
      <div className="flex items-center gap-2 bg-surface border border-slate-200 rounded-2xl px-4 h-[44px] focus-within:border-primary transition-all">
        <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." className="flex-1 text-[13px] font-medium text-ink placeholder:text-muted bg-transparent outline-none" />
      </div>

      <h3 className="text-[12px] font-black text-faint uppercase tracking-wide mt-1">Frequently Asked Questions</h3>
      <div className="flex flex-col gap-2.5">
        {filtered.map((faq, idx) => (
          <div key={faq.id || idx} className="bg-surface border border-line rounded-2xl overflow-hidden">
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full flex items-center justify-between px-4 py-3.5 text-left">
              <p className="text-[13px] font-bold text-ink flex-1 pr-3">{faq.title}</p>
              <svg className={`w-4 h-4 text-muted flex-shrink-0 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-[12px] text-faint leading-relaxed whitespace-pre-line">{faq.body}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-[12px] text-muted text-center py-8">No FAQs found.</p>}
      </div>
    </>
  );
};

// ── New ticket form ─────────────────────────────────────────────────
const TicketForm = ({ onSubmitted }) => {
  const [form, setForm] = useState({ subject: '', category: 'general', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.subject.trim().length < 3) return setErr('Please enter a subject (min 3 characters).');
    if (form.message.trim().length < 5) return setErr('Please describe your issue (min 5 characters).');
    setSubmitting(true);
    try {
      const { data } = await createTicket({
        subject: form.subject.trim(),
        category: form.category,
        message: form.message.trim(),
      });
      showToast('Ticket submitted! Our team will get back to you soon.');
      setForm({ subject: '', category: 'general', message: '' });
      onSubmitted?.(data);
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Could not submit your ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-3">
      <h3 className="text-[13px] font-black text-ink">Submit a Support Request</h3>
      {err && <div className="bg-red-50 text-red-600 text-[11px] font-semibold rounded-xl px-3 py-2">{err}</div>}

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-faint">Subject</label>
        <input value={form.subject} onChange={set('subject')} maxLength={120} placeholder="Brief summary of your issue" className="h-[42px] px-3 text-[13px] font-medium text-ink bg-surface-alt border border-line rounded-xl outline-none focus:border-primary" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-faint">Category</label>
        <select value={form.category} onChange={set('category')} className="h-[42px] px-3 text-[13px] font-medium text-ink bg-surface-alt border border-line rounded-xl outline-none focus:border-primary">
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-faint">Message</label>
        <textarea value={form.message} onChange={set('message')} maxLength={4000} rows={4} placeholder="Describe your issue in detail…" className="px-3 py-2.5 text-[13px] font-medium text-ink bg-surface-alt border border-line rounded-xl outline-none focus:border-primary resize-none" />
      </div>

      <button type="submit" disabled={submitting} className="h-[44px] bg-primary text-white text-[13px] font-black rounded-xl active:scale-95 transition-all disabled:opacity-60">
        {submitting ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  );
};

// ── Single ticket thread (clean support-desk conversation) ──────────
const TicketThread = ({ ticketId, onSeen }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState(null); // optimistic outgoing message
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { data } = await getMyTicket(ticketId);
      setTicket(data);
    } catch {
      showToast('Could not load this ticket.');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { load(); }, [load]);

  // Whenever the thread changes, mark it read up to the latest message and let
  // the parent recompute unread badges.
  useEffect(() => {
    if (!ticket) return;
    const t = ticket.thread || [];
    const lastAt = ticket.lastMessageAt || t[t.length - 1]?.createdAt || ticket.updatedAt;
    markTicketSeen(ticketId, lastAt);
    onSeen?.();
  }, [ticket, ticketId, onSeen]);

  // Live updates: join this ticket's room and merge in admin replies / status
  // changes as they happen, so the user never has to refresh.
  useEffect(() => {
    if (!ticketId) return undefined;
    let socket;
    try { socket = getChatSocket(); } catch { return undefined; }
    if (!socket) return undefined;

    const onUpdate = (payload) => {
      if (!payload || String(payload.id) !== String(ticketId)) return;
      setTicket((prev) => (prev ? { ...prev, ...payload } : payload));
    };

    const join = () => socket.emit('join_ticket', ticketId);
    join();
    socket.on('connect', join); // re-join after a reconnect
    socket.on('ticket_update', onUpdate);

    return () => {
      socket.emit('leave_ticket', ticketId);
      socket.off('ticket_update', onUpdate);
      socket.off('connect', join);
    };
  }, [ticketId]);

  // Auto-scroll to the newest message.
  const threadLen = (ticket?.thread || []).length;
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threadLen, pending, loading]);

  const send = async () => {
    const body = reply.trim();
    if (!body || sending) return;
    setSending(true);
    setPending({ id: `pending-${Date.now()}`, sender: 'user', body, createdAt: new Date().toISOString(), pending: true });
    setReply('');
    try {
      const { data } = await replyToTicket(ticketId, body);
      setTicket(data);
    } catch {
      showToast('Could not send your reply.');
      setReply(body); // restore so the user doesn't lose their text
    } finally {
      setPending(null);
      setSending(false);
    }
  };

  const closed = ticket?.status === 'closed';
  const groups = useMemo(() => {
    const base = ticket?.thread || [];
    const all = pending ? [...base, pending] : base;
    return groupByDay(all);
  }, [ticket?.thread, pending]);

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)]">
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : ticket ? (
        <>
          {/* Ticket header card */}
          <div className="bg-surface border border-line rounded-2xl p-4 flex-shrink-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[14px] font-black text-ink flex-1 leading-snug">{ticket.subject}</h3>
              <StatusPill status={ticket.status} />
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9.5px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">{ticket.category}</span>
              <span className="text-[10px] text-muted font-semibold">Opened {fmtDate(ticket.createdAt)}</span>
            </div>
          </div>

          {/* Conversation */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 flex flex-col gap-3 no-scrollbar">
            {groups.map((group, gi) => (
              <div key={gi} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-center my-1">
                  <span className="text-[9px] font-black text-muted bg-surface-alt border border-line px-2.5 py-0.5 rounded-full">{group.label}</span>
                </div>
                {group.items.map((m, i) => {
                  const isAdmin = m.sender === 'admin';
                  return (
                    <div key={m.id || i} className="flex gap-2.5 px-0.5">
                      <SenderAvatar isAdmin={isAdmin} name="You" />
                      <div className={`flex-1 min-w-0 rounded-2xl rounded-tl-sm px-3.5 py-2.5 border ${isAdmin ? 'bg-primary/5 border-teal-100' : 'bg-surface border-line'} ${m.pending ? 'opacity-70' : ''}`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-[11px] font-black ${isAdmin ? 'text-primary' : 'text-ink'}`}>
                            {isAdmin ? (m.senderName || 'Support Team') : 'You'}
                          </span>
                          <span className="text-[9px] text-muted font-semibold flex items-center gap-1">
                            {m.pending && <span className="w-2.5 h-2.5 border border-muted border-t-transparent rounded-full animate-spin" />}
                            {fmtTime(m.createdAt)}
                          </span>
                        </div>
                        <p className="text-[12.5px] text-ink leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">{m.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Composer */}
          {closed ? (
            <div className="flex-shrink-0 bg-surface-alt border border-line rounded-2xl px-4 py-3 text-center">
              <p className="text-[11px] font-bold text-muted">This ticket is closed. Reply to reopen isn't available — raise a new request if you still need help.</p>
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-end gap-2 pt-1">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
                placeholder="Type a reply…"
                className="flex-1 px-3.5 py-3 text-[13px] font-medium text-ink bg-surface border border-line rounded-2xl outline-none focus:border-primary resize-none max-h-28"
              />
              <button
                onClick={send}
                disabled={sending || !reply.trim()}
                className="w-11 h-11 flex items-center justify-center bg-primary text-white rounded-full active:scale-90 transition-all disabled:opacity-40 flex-shrink-0"
                aria-label="Send reply"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l0-14m0 0l-6 6m6-6l6 6" /></svg>
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

// ── My tickets list ─────────────────────────────────────────────────
const MyTickets = ({ tickets, loading, onOpen }) => {
  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }
  if (!tickets.length) {
    return <p className="text-[12px] text-muted text-center py-12">You haven't raised any tickets yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {tickets.map((t) => {
        const unread = isTicketUnread(t, 'user');
        return (
          <button
            key={t.id}
            onClick={() => onOpen(t.id)}
            className={`bg-surface border rounded-2xl p-4 text-left active:scale-[0.99] transition-all ${unread ? 'border-primary/40 ring-1 ring-primary/10' : 'border-line'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                <p className={`text-[13px] flex-1 truncate ${unread ? 'font-black text-ink' : 'font-bold text-ink'}`}>{t.subject}</p>
              </div>
              <StatusPill status={t.status} />
            </div>
            <p className={`text-[11px] mt-1 line-clamp-1 ${unread ? 'text-ink font-semibold' : 'text-faint'}`}>
              {unread ? 'New reply from Support' : t.message}
            </p>
            <p className="text-[9px] text-muted font-semibold mt-1.5 capitalize">{t.category} · Updated {fmtDate(t.lastMessageAt || t.updatedAt)}</p>
          </button>
        );
      })}
    </div>
  );
};

const HelpCenter = () => {
  const navigate = useNavigate();
  const { page, loading } = useContentPage('help-center');
  const [tab, setTab] = useState('faqs'); // 'faqs' | 'tickets'
  const [openTicketId, setOpenTicketId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [seenTick, setSeenTick] = useState(0); // bump to recompute unread badges

  const sections = page?.sections || [];
  const contactEmail = page?.contactEmail;

  // Keep a live ref of the open ticket so the socket handler isn't stale.
  const openRef = useRef(openTicketId);
  useEffect(() => { openRef.current = openTicketId; }, [openTicketId]);

  const fetchTickets = useCallback(() => {
    setTicketsLoading(true);
    getMyTickets()
      .then(({ data }) => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setTickets([]))
      .finally(() => setTicketsLoading(false));
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // App-level live updates: even when not viewing a specific ticket, merge
  // incoming replies so the list + unread badges stay current, and toast when
  // Support replies to a thread the user isn't currently reading.
  useEffect(() => {
    let socket;
    try { socket = getChatSocket(); } catch { return undefined; }
    if (!socket) return undefined;

    const onUpdate = (payload) => {
      if (!payload) return;
      setTickets((prev) => {
        const idx = prev.findIndex((t) => String(t.id) === String(payload.id));
        if (idx === -1) { fetchTickets(); return prev; }
        const next = [...prev];
        next[idx] = { ...next[idx], ...payload };
        // Bubble the just-updated ticket to the top (most recent activity).
        const [moved] = next.splice(idx, 1);
        next.unshift(moved);
        return next;
      });

      const thread = payload.thread || [];
      const last = thread[thread.length - 1];
      if (last?.sender === 'admin' && String(openRef.current) !== String(payload.id)) {
        showToast('New reply from Support 💬');
      }
    };

    socket.on('ticket_update', onUpdate);
    return () => socket.off('ticket_update', onUpdate);
  }, [fetchTickets]);

  const unreadCount = useMemo(() => countUnread(tickets, 'user'), [tickets, seenTick]);

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20 flex-shrink-0">
        <button
          onClick={() => {
            // When viewing a ticket, the single back button returns to the
            // ticket list; otherwise it leaves the Help Center.
            if (openTicketId) { setOpenTicketId(null); fetchTickets(); }
            else navigate(-1);
          }}
          className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all"
        >
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink flex-1">
          {openTicketId ? 'Support Conversation' : (page?.title || 'Help Center')}
        </h1>
        {openTicketId && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
          </span>
        )}
      </div>

      {/* Tabs (hidden while reading a thread to keep focus on the chat) */}
      {!openTicketId && (
        <div className="px-5 pt-4 flex-shrink-0">
          <div className="flex gap-1 p-1 bg-surface-alt border border-line rounded-2xl">
            {[{ id: 'faqs', label: 'Help & FAQs' }, { id: 'tickets', label: 'My Tickets' }].map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setOpenTicketId(null); }}
                className={`flex-1 h-9 rounded-xl text-[12px] font-black transition-all inline-flex items-center justify-center gap-1.5 ${tab === t.id ? 'bg-surface text-primary shadow-sm' : 'text-muted'}`}
              >
                {t.label}
                {t.id === 'tickets' && unreadCount > 0 && (
                  <span className="min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[9px] font-black inline-flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 pb-10">
        {openTicketId ? (
          <TicketThread ticketId={openTicketId} onSeen={() => setSeenTick((k) => k + 1)} />
        ) : tab === 'faqs' ? (
          <>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="bg-surface border border-line rounded-2xl p-3.5 text-center active:scale-95 transition-all cursor-pointer block">
                <span className="text-xl">📧</span>
                <p className="text-[12px] font-bold text-ink mt-1.5">Email Us</p>
                <p className="text-[9px] text-muted mt-0.5">{contactEmail}</p>
              </a>
            )}
            <FaqList sections={sections} loading={loading} />

            <div className="mt-2">
              <h3 className="text-[12px] font-black text-faint uppercase tracking-wide mb-3">Still need help?</h3>
              <TicketForm onSubmitted={() => { fetchTickets(); setTab('tickets'); }} />
            </div>
          </>
        ) : (
          <MyTickets tickets={tickets} loading={ticketsLoading} onOpen={setOpenTicketId} />
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
