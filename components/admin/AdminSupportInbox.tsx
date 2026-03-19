"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    ChevronDown,
    X,
    Paperclip,
    Save,
    Send,
    Video,
} from "lucide-react";
import {
    AdminFieldLabel,
    AdminPageHeading,
    AdminPrimaryButton,
    AdminStatusBadge,
    AdminTextInput,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";

type TicketMessage = {
    sender: "customer" | "admin";
    author: string;
    timestamp: string;
    body: string;
    attachment?: string;
};

type Ticket = {
    id: string;
    customer: string;
    email: string;
    subject: string;
    preview: string;
    orderId: string;
    timestamp: string;
    status: "Open" | "In Review" | "Resolved";
    statusTone: "info" | "warning" | "success";
    priority: "High Priority" | "Medium Priority" | "Low Priority";
    priorityTone: "warning" | "info" | "success";
    unread?: boolean;
    messages: TicketMessage[];
};

const dateRanges = [
    "TODAY",
    "YESTERDAY",
    "LAST WEEK",
    "LAST MONTH",
    "LAST QUARTER",
    "LAST YEAR",
];

const tickets: Ticket[] = [
    {
        id: "142",
        customer: "Arjun Sharma",
        email: "arjun@gmail.com",
        subject: "Damaged product — Empire Oversized Tee",
        preview: "I received the tee today and there is a visible tear...",
        orderId: "ALB-00142",
        timestamp: "4 March 2026, 2:14 PM",
        status: "Open",
        statusTone: "info",
        priority: "High Priority",
        priorityTone: "warning",
        unread: true,
        messages: [
            {
                sender: "customer",
                author: "Arjun Sharma",
                timestamp: "4 March 2026, 2:14 PM",
                body: "Hello,\n\nI received my Empire Oversized Tee (Order ALB-00142) today and I noticed a visible tear along the left shoulder seam. The fabric appears to have been damaged during production or shipping.\n\nI have attached a video showing the damage clearly. Please advise on how to resolve this issue.\n\nThank you,\nArjun",
                attachment: "product_damage_video.mp4 · 12.8 MB",
            },
            {
                sender: "admin",
                author: "Albaeon Support",
                timestamp: "4 March 2026, 3:10 PM",
                body: "Thank you for reaching out, Arjun. We have received your report and are reviewing the video. Our quality team is checking this with the fulfilment partner and we will resolve this within 48 hours.",
            },
        ],
    },
    {
        id: "138",
        customer: "Priya Nair",
        email: "priya@gmail.com",
        subject: "Shipment tracking not updating",
        preview: "It has been 5 days since my order shipped but...",
        orderId: "ALB-00138",
        timestamp: "3 March 2026, 10:18 AM",
        status: "Open",
        statusTone: "info",
        priority: "Medium Priority",
        priorityTone: "info",
        unread: true,
        messages: [
            {
                sender: "customer",
                author: "Priya Nair",
                timestamp: "3 March 2026, 10:18 AM",
                body: "Hi team, the tracking link for my order has not updated in several days. Could you confirm whether the parcel is still in transit?",
            },
        ],
    },
    {
        id: "140",
        customer: "Rahul Verma",
        email: "rahul@gmail.com",
        subject: "Wrong item received — sent hoodie instead of tee",
        preview: "The parcel contained the wrong silhouette from my order.",
        orderId: "ALB-00140",
        timestamp: "2 March 2026, 8:42 PM",
        status: "In Review",
        statusTone: "warning",
        priority: "High Priority",
        priorityTone: "warning",
        messages: [
            {
                sender: "customer",
                author: "Rahul Verma",
                timestamp: "2 March 2026, 8:42 PM",
                body: "I ordered a tee but received a hoodie in the package. Please let me know the next steps for an exchange.",
            },
        ],
    },
    {
        id: "131",
        customer: "Sneha Patel",
        email: "sneha@gmail.com",
        subject: "Delivery time query",
        preview: "Can you confirm whether the order will arrive before Friday?",
        orderId: "ALB-00131",
        timestamp: "1 March 2026, 4:09 PM",
        status: "Resolved",
        statusTone: "success",
        priority: "Low Priority",
        priorityTone: "success",
        messages: [
            {
                sender: "customer",
                author: "Sneha Patel",
                timestamp: "1 March 2026, 4:09 PM",
                body: "Can you confirm whether this order will arrive before Friday? I need it for an event.",
            },
        ],
    },
    {
        id: "127",
        customer: "Kiran Mehta",
        email: "kiran@gmail.com",
        subject: "Need invoice correction for GST details",
        preview: "Please update the invoice with the GST number attached.",
        orderId: "ALB-00127",
        timestamp: "28 February 2026, 11:03 AM",
        status: "In Review",
        statusTone: "warning",
        priority: "Medium Priority",
        priorityTone: "info",
        messages: [
            {
                sender: "customer",
                author: "Kiran Mehta",
                timestamp: "28 February 2026, 11:03 AM",
                body: "I need a corrected invoice with the company GST details for reimbursement. Please advise if you need any additional information.",
            },
        ],
    },
];

function FilterDropdown({
    id,
    value,
    options,
    openId,
    onToggle,
    className = "",
}: {
    id: string;
    value: string;
    options: string[];
    openId: string | null;
    onToggle: (id: string) => void;
    className?: string;
}) {
    const isOpen = openId === id;

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
                    className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.8}
                />
            </button>
            {isOpen ? (
                <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-full min-w-[160px] border border-gold/12 bg-nav p-2 shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold`}
                            onClick={() => onToggle(id)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default function AdminSupportInbox() {
    const [activeRange, setActiveRange] = useState("TODAY");
    const [selectedTicketId, setSelectedTicketId] = useState(tickets[0].id);
    const [chatOpen, setChatOpen] = useState(true);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [unreadStatus, setUnreadStatus] = useState("UNREAD");
    const [statusOverride, setStatusOverride] = useState<string | null>(null);
    const statusOptions = ["All Status", "Open", "In Review", "Resolved"];
    const priorityOptions = ["All Priority", "High Priority", "Medium Priority", "Low Priority"];

    const selectedTicket = useMemo(
        () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0],
        [selectedTicketId]
    );

    const statusLabel = unreadStatus === "UNREAD" ? "Unread" : statusOverride ?? selectedTicket.status;

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!(event.target instanceof Element)) {
                return;
            }
            if (!event.target.closest("[data-filter-dropdown]")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleToggle = (id: string) => {
        setOpenDropdown((current) => (current === id ? null : id));
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <AdminPageHeading
                eyebrow="SUPPORT"
                title="Support"
                subtitle="3 unread tickets · 12 open"
            />

            <div className="flex flex-wrap gap-2">
                {dateRanges.map((range) => {
                    const active = activeRange === range;

                    return (
                        <button
                            key={range}
                            type="button"
                            onClick={() => setActiveRange(range)}
                            className={`${adminCinzel.className} border px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] transition-colors duration-200 ${
                                active
                                    ? "border-gold bg-gold/12 text-gold"
                                    : "border-gold/12 text-text-muted hover:border-gold/30 hover:text-text-primary"
                            }`}
                        >
                            {range}
                        </button>
                    );
                })}
            </div>

            <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_150px] lg:items-end">
                    <div>
                        <AdminFieldLabel>SEARCH TICKETS</AdminFieldLabel>
                        <AdminTextInput placeholder="Search by customer name, email, subject..." />
                    </div>
                    <div>
                        <AdminFieldLabel>STATUS</AdminFieldLabel>
                        <FilterDropdown
                            id="status"
                            value="All Status"
                            options={statusOptions}
                            openId={openDropdown}
                            onToggle={handleToggle}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel>PRIORITY</AdminFieldLabel>
                        <FilterDropdown
                            id="priority"
                            value="All Priority"
                            options={priorityOptions}
                            openId={openDropdown}
                            onToggle={handleToggle}
                        />
                    </div>
                </div>
            </section>

            <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E] lg:grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="border-b border-gold/10 bg-nav lg:border-b-0 lg:border-r lg:border-r-gold/10">
                    {tickets.map((ticket) => {
                        const active = ticket.id === selectedTicket?.id;

                        return (
                            <button
                                key={ticket.id}
                                type="button"
                                onClick={() => {
                                    setSelectedTicketId(ticket.id);
                                    setChatOpen(true);
                                    setUnreadStatus("UNREAD");
                                    setStatusOverride(null);
                                }}
                                className={`block w-full border-b border-gold/8 px-5 py-4 text-left transition-colors duration-200 ${
                                    active ? "border-l-4 border-l-gold bg-gold/6 pl-4" : "hover:bg-gold/4"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className={`${adminRaleway.className} text-[14px] font-medium text-text-primary`}>
                                        {ticket.customer}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        {ticket.unread ? (
                                            <span className="inline-flex h-2 w-2 rounded-full bg-[#C0392B]" aria-hidden="true" />
                                        ) : null}
                                        <AdminStatusBadge label={ticket.status} tone={ticket.statusTone} />
                                    </div>
                                </div>

                                <p className={`${adminRaleway.className} mt-2 text-[13px] text-text-primary`}>
                                    {ticket.subject}
                                </p>
                                <p className={`${adminRaleway.className} mt-1 text-[12px] font-light text-text-muted`}>
                                    {ticket.preview}
                                </p>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <AdminStatusBadge label={ticket.priority} tone={ticket.priorityTone} />
                                    <span className={`${adminCinzel.className} text-[11px] text-gold`}>
                                        {ticket.orderId} →
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </aside>

                <div className="flex min-h-[760px] flex-col">
                    {chatOpen ? (
                        <>
                            <header className="border-b border-gold/10 bg-nav px-5 py-4 md:px-7">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                                <p className={`${adminCinzel.className} text-[12px] tracking-[0.08em] text-text-primary`}>
                                    {selectedTicket.subject.toUpperCase()}
                                </p>
                                <p className={`${adminRaleway.className} mt-2 text-[11px] font-light text-text-muted`}>
                                    {selectedTicket.customer} · {selectedTicket.email} · {selectedTicket.orderId} · {selectedTicket.timestamp}
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-3 lg:items-end">
                                <button
                                    type="button"
                                    onClick={() => setChatOpen(false)}
                                    className="inline-flex h-8 w-8 items-center justify-center border border-gold/20 text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold"
                                    aria-label="Close chat"
                                >
                                    <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                                </button>
                                <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                className={`${adminRaleway.className} inline-flex h-8 items-center border border-[#4A90C4]/40 bg-[#4A90C4]/10 px-3 text-[12px] font-medium text-[#4A90C4]`}
                                            >
                                                {statusLabel}
                                            </button>
                                    <button
                                        type="button"
                                        className={`${adminRaleway.className} inline-flex h-8 items-center border border-gold/30 bg-gold/10 px-3 text-[12px] font-medium text-gold`}
                                    >
                                        {selectedTicket.priority}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${adminCinzel.className} inline-flex h-8 items-center gap-1 border border-gold/20 px-3 text-[10px] font-semibold tracking-[0.14em] text-gold`}
                                    >
                                        View Order
                                        <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                                    </button>
                                    <details className="group relative">
                                        <summary
                                            className={`${adminCinzel.className} flex h-8 list-none items-center justify-between gap-2 border border-gold/20 px-3 text-[10px] font-semibold tracking-[0.14em] text-text-primary marker:hidden transition-colors duration-200 hover:border-gold/40 [&::-webkit-details-marker]:hidden`}
                                        >
                                            <span>{unreadStatus}</span>
                                            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.8} />
                                        </summary>
                                        <div className="absolute right-0 top-full z-20 mt-2 w-[160px] border border-gold/12 bg-nav p-2 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                                            {["UNREAD", "OPEN", "MARK AS IN REVIEW", "MARK AS RESOLVED"].map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold`}
                                                    onClick={() => {
                                                        setUnreadStatus(option);
                                                        if (option === "OPEN") {
                                                            setStatusOverride("Open");
                                                        } else if (option === "MARK AS IN REVIEW") {
                                                            setStatusOverride("In Review");
                                                        } else if (option === "MARK AS RESOLVED") {
                                                            setStatusOverride("Resolved");
                                                        } else {
                                                            setStatusOverride(null);
                                                        }
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 space-y-4 bg-[#1E1A2E] px-5 py-5 md:px-7 md:py-6">
                        {selectedTicket.messages.map((message, index) => {
                            const customerMessage = message.sender === "customer";

                            return (
                                <article
                                    key={`${message.sender}-${index}`}
                                    className={`space-y-3 border px-5 py-4 ${
                                        customerMessage
                                            ? "border-gold/10 bg-primary"
                                            : "border-gold/10 bg-gold/[0.04]"
                                    }`}
                                >
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                                            {message.author}
                                        </p>
                                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                            {message.timestamp}
                                        </p>
                                    </div>

                                    <p className={`${adminRaleway.className} whitespace-pre-line text-[14px] font-light leading-[1.8] text-text-primary`}>
                                        {message.body}
                                    </p>

                                    {message.attachment ? (
                                        <div className="inline-flex items-center gap-2 border border-gold/10 bg-nav px-3 py-2">
                                            <Video className="h-4 w-4 text-gold" strokeWidth={1.8} />
                                            <span className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                                {message.attachment}
                                            </span>
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>

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
                            placeholder="Write your reply..."
                            className={`${adminRaleway.className} mt-4 w-full resize-none border border-gold/15 bg-footer px-4 py-3 text-[14px] font-light text-text-primary outline-none placeholder:text-text-muted`}
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
                                    label="SEND REPLY"
                                    icon={<Send className="h-3.5 w-3.5" strokeWidth={1.8} />}
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
    );
}
