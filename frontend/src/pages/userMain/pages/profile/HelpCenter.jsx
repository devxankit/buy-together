import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentPage } from './useContentPage';
import { showToast } from '../../../../utils/toast';
import { getChatSocket } from '../../../../services/socket';
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
  open: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Open' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
  closed: { bg: 'bg-slate-200', text: 'text-slate-600', label: 'Closed' },
};

const StatusPill = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.open;
  return <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>;
};

const fmtDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};

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

// ── Single ticket thread (detail view) ──────────────────────────────
const TicketThread = ({ ticketId }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

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

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await replyToTicket(ticketId, reply.trim());
      setTicket(data);
      setReply('');
    } catch {
      showToast('Could not send your reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Back navigation is handled by the single context-aware header button. */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : ticket ? (
        <>
          <div className="bg-surface border border-line rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[14px] font-black text-ink flex-1">{ticket.subject}</h3>
              <StatusPill status={ticket.status} />
            </div>
            <p className="text-[10px] text-muted font-semibold mt-1 capitalize">{ticket.category} · {fmtDate(ticket.createdAt)}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {(ticket.thread || []).map((m, i) => (
              <div key={m.id || i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${m.sender === 'admin' ? 'bg-primary-soft self-start border border-teal-100' : 'bg-primary text-white self-end'}`}>
                <p className={`text-[9px] font-black mb-0.5 ${m.sender === 'admin' ? 'text-teal-700' : 'text-white/70'}`}>
                  {m.sender === 'admin' ? (m.senderName || 'Support') : 'You'} · {fmtDate(m.createdAt)}
                </p>
                <p className={`text-[12px] leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere] ${m.sender === 'admin' ? 'text-ink' : 'text-white'}`}>{m.body}</p>
              </div>
            ))}
          </div>

          {ticket.status !== 'closed' && (
            <div className="flex items-end gap-2 mt-1">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={1} placeholder="Type a reply…" className="flex-1 px-3 py-2.5 text-[13px] font-medium text-ink bg-surface-alt border border-line rounded-xl outline-none focus:border-primary resize-none" />
              <button onClick={send} disabled={sending || !reply.trim()} className="h-[42px] px-4 bg-primary text-white text-[12px] font-black rounded-xl active:scale-95 transition-all disabled:opacity-50">
                {sending ? '…' : 'Send'}
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

// ── My tickets list ─────────────────────────────────────────────────
const MyTickets = ({ onOpen, refreshKey }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMyTickets()
      .then(({ data }) => { if (active) setTickets(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setTickets([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }
  if (tickets.length === 0) {
    return <p className="text-[12px] text-muted text-center py-12">You haven't raised any tickets yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {tickets.map((t) => (
        <button key={t.id} onClick={() => onOpen(t.id)} className="bg-surface border border-line rounded-2xl p-4 text-left active:scale-[0.99] transition-all">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-bold text-ink flex-1">{t.subject}</p>
            <StatusPill status={t.status} />
          </div>
          <p className="text-[11px] text-faint mt-1 line-clamp-1">{t.message}</p>
          <p className="text-[9px] text-muted font-semibold mt-1.5 capitalize">{t.category} · Updated {fmtDate(t.lastMessageAt || t.updatedAt)}</p>
        </button>
      ))}
    </div>
  );
};

const HelpCenter = () => {
  const navigate = useNavigate();
  const { page, loading } = useContentPage('help-center');
  const [tab, setTab] = useState('faqs'); // 'faqs' | 'tickets'
  const [openTicketId, setOpenTicketId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const sections = page?.sections || [];
  const contactEmail = page?.contactEmail;

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button
          onClick={() => {
            // When viewing a ticket, the single back button returns to the
            // ticket list; otherwise it leaves the Help Center.
            if (openTicketId) { setOpenTicketId(null); setRefreshKey((k) => k + 1); }
            else navigate(-1);
          }}
          className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all"
        >
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">{page?.title || 'Help Center'}</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <div className="flex gap-1 p-1 bg-surface-alt border border-line rounded-2xl">
          {[{ id: 'faqs', label: 'Help & FAQs' }, { id: 'tickets', label: 'My Tickets' }].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setOpenTicketId(null); }}
              className={`flex-1 h-9 rounded-xl text-[12px] font-black transition-all ${tab === t.id ? 'bg-surface text-primary shadow-sm' : 'text-muted'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4 pb-10">
        {tab === 'faqs' ? (
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
              <TicketForm onSubmitted={() => { setRefreshKey((k) => k + 1); setTab('tickets'); }} />
            </div>
          </>
        ) : openTicketId ? (
          <TicketThread ticketId={openTicketId} />
        ) : (
          <MyTickets onOpen={setOpenTicketId} refreshKey={refreshKey} />
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
