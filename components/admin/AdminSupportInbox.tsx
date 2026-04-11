'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowUpRight, ChevronDown, X, Paperclip, Save, Send,
} from 'lucide-react'
import Link from 'next/link'
import {
  AdminFieldLabel, AdminPageHeading, AdminPrimaryButton,
  AdminStatusBadge, AdminTextInput,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import { createClient } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────
type TicketStatus = 'unread' | 'pending' | 'resolved'
type TicketPriority = 'low' | 'normal' | 'high'

type Reply = {
  id: string
  message: string
  sent_at: string
  is_customer: boolean
  author: string
}

type Ticket = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: TicketStatus
  priority: TicketPriority
  linked_order_id: string | null
  created_at: string
  replies: Reply[]
}

// ── Helpers ───────────────────────────────────────────
function statusTone(s: TicketStatus) {
  return s === 'resolved' ? 'success' : s === 'pending' ? 'warning' : 'info'
}

function statusLabel(s: TicketStatus) {
  return s === 'resolved' ? 'Resolved' : s === 'pending' ? 'In Review' : 'Open'
}

function priorityTone(p: TicketPriority) {
  return p === 'high' ? 'warning' : p === 'normal' ? 'info' : 'success'
}

function priorityLabel(p: TicketPriority) {
  return p === 'high' ? 'High Priority' : p === 'normal' ? 'Medium Priority' : 'Low Priority'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const dateRanges = ['ALL', 'TODAY', 'YESTERDAY', 'LAST WEEK', 'LAST MONTH', 'LAST QUARTER', 'LAST YEAR']

// ── Filter Dropdown ───────────────────────────────────
function FilterDropdown({
  id, value, options, openId, onToggle, onSelect, className = '',
}: {
  id: string
  value: string
  options: string[]
  openId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string, value: string) => void
  className?: string
}) {
  const isOpen = openId === id
  return (
    <div className={`group relative w-full ${className}`} data-filter-dropdown>
      <button
        type="button"
        className={`flex h-[38px] w-full items-center justify-between border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-primary transition-colors duration-200 hover:border-gold/30`}
        aria-expanded={isOpen}
        onClick={() => onToggle(id)}
      >
        <span>{value}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-full min-w-[160px] border border-gold/12 bg-nav p-2 shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold`}
              onClick={() => { onSelect(id, option); onToggle(id) }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────
export default function AdminSupportInbox() {
  const supabase = createClient()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [activeRange, setActiveRange] = useState('ALL')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [priorityFilter, setPriorityFilter] = useState('All Priority')
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)

  const statusOptions = ['All Status', 'Open', 'In Review', 'Resolved']
  const priorityOptions = ['All Priority', 'High Priority', 'Medium Priority', 'Low Priority']

  // ── Load tickets ──────────────────────────────────
  const loadTickets = useCallback(async () => {
    setLoading(true)

    const { data: ticketRows } = await supabase
      .from('support_tickets')
      .select(`
        id, name, email, subject, message,
        status, priority, linked_order_id, created_at,
        support_replies (
          id, message, sent_at,
          profiles (first_name, last_name, email)
        )
      `)
      .order('created_at', { ascending: false })

    if (!ticketRows) { setLoading(false); return }

    const mapped: Ticket[] = ticketRows.map((t) => {
      const replies: Reply[] = [
        {
          id: `customer-${t.id}`,
          message: t.message,
          sent_at: t.created_at,
          is_customer: true,
          author: t.name,
        },
        ...(t.support_replies ?? []).map((r: {
          id: string
          message: string
          sent_at: string
          profiles: { first_name?: string; last_name?: string; email?: string }[] | null
        }) => {
          const profileArr = Array.isArray(r.profiles) ? r.profiles : r.profiles ? [r.profiles] : []
          const p = profileArr[0] ?? null
          const author = p
            ? [p.first_name, p.last_name].filter(Boolean).join(' ') || p.email || 'Admin'
            : 'Albaeon Support'
          return {
            id: r.id,
            message: r.message,
            sent_at: r.sent_at,
            is_customer: false,
            author,
          }
        }),
      ].sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime())

      return {
        id: t.id,
        name: t.name,
        email: t.email,
        subject: t.subject,
        message: t.message,
        status: t.status as TicketStatus,
        priority: t.priority as TicketPriority,
        linked_order_id: t.linked_order_id,
        created_at: t.created_at,
        replies,
      }
    })

    setTickets(mapped)
    if (!selectedTicketId && mapped.length > 0) {
      setSelectedTicketId(mapped[0].id)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadTickets() }, [])

  // ── Click outside dropdown ────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      if (!e.target.closest('[data-filter-dropdown]')) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Filter tickets ────────────────────────────────
  const filteredTickets = useMemo(() => {
    const now = new Date()

    return tickets.filter((t) => {
      // ── Date range filter ───────────────────────
      if (activeRange !== 'ALL') {
        const created = new Date(t.created_at)
        const startOf = (d: Date) =>
          new Date(d.getFullYear(), d.getMonth(), d.getDate())

        let from: Date | null = null
        let to: Date | null = null

        if (activeRange === 'TODAY') {
          from = startOf(now)
          to = null
        } else if (activeRange === 'YESTERDAY') {
          const yesterday = new Date(now)
          yesterday.setDate(now.getDate() - 1)
          from = startOf(yesterday)
          to = startOf(now)
        } else if (activeRange === 'LAST WEEK') {
          from = new Date(now)
          from.setDate(now.getDate() - 7)
        } else if (activeRange === 'LAST MONTH') {
          from = new Date(now)
          from.setMonth(now.getMonth() - 1)
        } else if (activeRange === 'LAST QUARTER') {
          from = new Date(now)
          from.setMonth(now.getMonth() - 3)
        } else if (activeRange === 'LAST YEAR') {
          from = new Date(now)
          from.setFullYear(now.getFullYear() - 1)
        }

        if (from && created < from) return false
        if (to && created >= to) return false
      }

      // ── Search filter ───────────────────────────
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const matchesName = t.name.toLowerCase().includes(q)
        const matchesEmail = t.email.toLowerCase().includes(q)
        const matchesSubject = t.subject.toLowerCase().includes(q)
        const matchesMessage = t.message.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesSubject && !matchesMessage) return false
      }

      // ── Status filter ───────────────────────────
      if (statusFilter !== 'All Status') {
        const map: Record<string, TicketStatus> = {
          'Open': 'unread',
          'In Review': 'pending',
          'Resolved': 'resolved',
        }
        if (t.status !== map[statusFilter]) return false
      }

      // ── Priority filter ─────────────────────────
      if (priorityFilter !== 'All Priority') {
        const map: Record<string, TicketPriority> = {
          'High Priority': 'high',
          'Medium Priority': 'normal',
          'Low Priority': 'low',
        }
        if (t.priority !== map[priorityFilter]) return false
      }

      return true
    })
  }, [tickets, search, statusFilter, priorityFilter, activeRange])

  const selectedTicket = useMemo(
    () => filteredTickets.find((t) => t.id === selectedTicketId) ?? filteredTickets[0] ?? null,
    [filteredTickets, selectedTicketId]
  )

  const unreadCount = tickets.filter((t) => t.status === 'unread').length
  const openCount = tickets.filter((t) => t.status !== 'resolved').length

  // ── Send reply ────────────────────────────────────
  async function handleSendReply() {
    if (!reply.trim() || !selectedTicket) return
    setSending(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSending(false); return }

    const { error } = await supabase
      .from('support_replies')
      .insert({
        ticket_id: selectedTicket.id,
        admin_id: user.id,
        message: reply.trim(),
      })

    if (!error) {
      await supabase
        .from('support_tickets')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id)

      setReply('')
      await loadTickets()
    }

    setSending(false)
  }

  // ── Change status ─────────────────────────────────
  async function handleStatusChange(ticketId: string, newStatus: TicketStatus) {
    setSavingStatus(true)
    await supabase
      .from('support_tickets')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', ticketId)
    await loadTickets()
    setSavingStatus(false)
  }

  function handleSelect(id: string, value: string) {
    if (id === 'status') setStatusFilter(value)
    if (id === 'priority') setPriorityFilter(value)
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <AdminPageHeading eyebrow="SUPPORT" title="Support" subtitle="Loading..." />
        <div className="border border-gold/10 bg-[#1E1A2E] p-8 text-center">
          <p className={`${adminRaleway.className} text-[13px] text-text-muted`}>Loading tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminPageHeading
        eyebrow="SUPPORT"
        title="Support"
        subtitle={`${unreadCount} unread · ${openCount} open`}
      />

      {/* Date range filters */}
      <div className="flex flex-wrap gap-2">
        {dateRanges.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => setActiveRange(range)}
            className={`${adminCinzel.className} border px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] transition-colors duration-200 ${activeRange === range
              ? 'border-gold bg-gold/12 text-gold'
              : 'border-gold/12 text-text-muted hover:border-gold/30 hover:text-text-primary'
              }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Filters */}
      <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_150px] lg:items-end">
          <div>
            <AdminFieldLabel>SEARCH TICKETS</AdminFieldLabel>
            <AdminTextInput
              placeholder="Search by customer name, email, subject..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <AdminFieldLabel>STATUS</AdminFieldLabel>
            <FilterDropdown
              id="status"
              value={statusFilter}
              options={statusOptions}
              openId={openDropdown}
              onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)}
              onSelect={handleSelect}
            />
          </div>
          <div>
            <AdminFieldLabel>PRIORITY</AdminFieldLabel>
            <FilterDropdown
              id="priority"
              value={priorityFilter}
              options={priorityOptions}
              openId={openDropdown}
              onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </section>

      {/* Main inbox */}
      <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E] lg:grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">

        {/* Ticket list */}
        <aside className="border-b border-gold/10 bg-nav lg:border-b-0 lg:border-r lg:border-r-gold/10 lg:max-h-[800px] lg:overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-6 text-center">
              <p className={`${adminRaleway.className} text-[13px] text-text-muted`}>
                No tickets found
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const active = ticket.id === selectedTicket?.id
              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => { setSelectedTicketId(ticket.id); setChatOpen(true) }}
                  className={`block w-full border-b border-gold/8 px-5 py-4 text-left transition-colors duration-200 ${active ? 'border-l-4 border-l-gold bg-gold/6 pl-4' : 'hover:bg-gold/4'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={`${adminRaleway.className} text-[14px] font-medium text-text-primary`}>
                      {ticket.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {ticket.status === 'unread' && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-[var(--status-error)]" />
                      )}
                      <AdminStatusBadge
                        label={statusLabel(ticket.status)}
                        tone={statusTone(ticket.status)}
                      />
                    </div>
                  </div>
                  <p className={`${adminRaleway.className} mt-2 text-[13px] text-text-primary`}>
                    {ticket.subject}
                  </p>
                  <p className={`${adminRaleway.className} mt-1 text-[12px] font-light text-text-muted truncate`}>
                    {ticket.message.slice(0, 80)}
                    {ticket.message.length > 80 ? '...' : ''}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <AdminStatusBadge
                      label={priorityLabel(ticket.priority)}
                      tone={priorityTone(ticket.priority)}
                    />
                    {ticket.linked_order_id && (
                      <span className={`${adminCinzel.className} text-[11px] text-gold`}>
                        Order →
                      </span>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </aside>

        {/* Chat panel */}
        <div className="flex min-h-[760px] flex-col">
          {chatOpen && selectedTicket ? (
            <>
              {/* Header */}
              <header className="border-b border-gold/10 bg-nav px-5 py-4 md:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className={`${adminCinzel.className} text-[12px] tracking-[0.08em] text-text-primary`}>
                      {selectedTicket.subject.toUpperCase()}
                    </p>
                    <p className={`${adminRaleway.className} mt-2 text-[11px] font-light text-text-muted`}>
                      {selectedTicket.name} · {selectedTicket.email} · {formatDate(selectedTicket.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <button
                      type="button"
                      onClick={() => setChatOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center border border-gold/20 text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <AdminStatusBadge
                        label={statusLabel(selectedTicket.status)}
                        tone={statusTone(selectedTicket.status)}
                      />
                      <AdminStatusBadge
                        label={priorityLabel(selectedTicket.priority)}
                        tone={priorityTone(selectedTicket.priority)}
                      />

                      {selectedTicket.linked_order_id && (
                        <Link
                          href={`/admin/orders/${selectedTicket.linked_order_id}`}
                          className={`${adminCinzel.className} inline-flex h-8 items-center gap-1 border border-gold/20 px-3 text-[10px] font-semibold tracking-[0.14em] text-gold hover:border-gold/40`}
                        >
                          View Order
                          <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                        </Link>
                      )}

                      {/* Status changer */}
                      <details className="group relative">
                        <summary className={`${adminCinzel.className} flex h-8 list-none cursor-pointer items-center justify-between gap-2 border border-gold/20 px-3 text-[10px] font-semibold tracking-[0.14em] text-text-primary marker:hidden transition-colors duration-200 hover:border-gold/40 [&::-webkit-details-marker]:hidden`}>
                          <span>CHANGE STATUS</span>
                          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.8} />
                        </summary>
                        <div className="absolute right-0 top-full z-20 mt-2 w-[180px] border border-gold/12 bg-nav p-2 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                          {([
                            { label: 'Mark as Open', value: 'unread' as TicketStatus },
                            { label: 'Mark as In Review', value: 'pending' as TicketStatus },
                            { label: 'Mark as Resolved', value: 'resolved' as TicketStatus },
                          ]).map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              disabled={savingStatus}
                              className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold disabled:opacity-50`}
                              onClick={() => handleStatusChange(selectedTicket.id, option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#1E1A2E] px-5 py-5 md:px-7 md:py-6 max-h-[400px]">
                {selectedTicket.replies.map((message) => (
                  <article
                    key={message.id}
                    className={`space-y-3 border px-5 py-4 ${message.is_customer
                      ? 'border-gold/10 bg-primary'
                      : 'border-gold/10 bg-gold/[0.04]'
                      }`}
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                        {message.author}
                        {!message.is_customer && (
                          <span className="ml-2 font-sans text-[10px] text-gold">ADMIN</span>
                        )}
                      </p>
                      <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                        {formatDate(message.sent_at)}
                      </p>
                    </div>
                    <p className={`${adminRaleway.className} whitespace-pre-line text-[14px] font-light leading-[1.8] text-text-primary`}>
                      {message.message}
                    </p>
                  </article>
                ))}
              </div>

              {/* Reply box */}
              <footer className="border-t border-gold/10 bg-nav px-5 py-5 md:px-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className={`${adminCinzel.className} text-[9px] tracking-[0.3em] text-gold`}>
                    REPLY TO CUSTOMER
                  </p>
                  <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                    Reply will be sent to: {selectedTicket.email}
                  </p>
                </div>

                <textarea
                  rows={5}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  disabled={sending}
                  className={`${adminRaleway.className} mt-4 w-full resize-none border border-gold/15 bg-footer px-4 py-3 text-[14px] font-light text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50`}
                />

                <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`${adminRaleway.className} inline-flex h-9 items-center gap-2 border border-gold/15 px-3 text-[12px] text-text-muted transition-colors duration-200 hover:text-text-primary`}
                    >
                      <Paperclip className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Attach Media
                    </button>
                    <button
                      type="button"
                      onClick={() => setReply('Thank you for reaching out. We are looking into this and will get back to you within 24 hours.')}
                      className={`${adminRaleway.className} inline-flex h-9 items-center gap-2 border border-gold/15 px-3 text-[12px] text-text-muted transition-colors duration-200 hover:text-text-primary`}
                    >
                      Quick Reply
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`${adminRaleway.className} inline-flex h-9 items-center gap-2 border border-gold/15 px-3 text-[12px] text-text-muted transition-colors duration-200 hover:text-text-primary`}
                    >
                      <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Save Draft
                    </button>
                    <AdminPrimaryButton
                      label={sending ? 'SENDING...' : 'SEND REPLY'}
                      icon={<Send className="h-3.5 w-3.5" strokeWidth={1.8} />}
                      onClick={handleSendReply}
                      disabled={sending || !reply.trim()}
                    />
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[#1E1A2E] px-6">
              <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                Select a ticket to view the conversation.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}