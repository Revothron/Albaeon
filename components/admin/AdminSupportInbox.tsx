"use client";

import { useMemo, useState } from "react";
import {
    ArrowUpRight,
    Paperclip,
    Save,
    Send,
    Video,
} from "lucide-react";
import {
    AdminFieldLabel,
    AdminPageHeading,
    AdminPrimaryButton,
    AdminSelectBox,
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

export default function AdminSupportInbox() {
    const [activeRange, setActiveRange] = useState("TODAY");
    const [selectedTicketId, setSelectedTicketId] = useState(tickets[0].id);

    const selectedTicket = useMemo(
        () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0],
        [selectedTicketId]
    );

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
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_150px_150px]">
                    <div>
                        <AdminFieldLabel>SEARCH TICKETS</AdminFieldLabel>
                        <AdminTextInput placeholder="Search by customer name, email, subject..." />
                    </div>
                    <div>
                        <AdminFieldLabel>STATUS</AdminFieldLabel>
                        <AdminSelectBox value="All Status" />
                    </div>
                    <div>
                        <AdminFieldLabel>PRIORITY</AdminFieldLabel>
                        <AdminSelectBox value="All Priority" />
                    </div>
                </div>
            </section>

            <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E] lg:grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="border-b border-gold/10 bg-nav lg:border-b-0 lg:border-r lg:border-r-gold/10">
                    {tickets.map((ticket) => {
                        const active = ticket.id === selectedTicket.id;

                        return (
                            <button
                                key={ticket.id}
                                type="button"
                                onClick={() => setSelectedTicketId(ticket.id)}
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

                            <div className="flex flex-wrap items-center gap-2">
                                <AdminStatusBadge label={selectedTicket.status} tone={selectedTicket.statusTone} />
                                <AdminStatusBadge label={selectedTicket.priority} tone={selectedTicket.priorityTone} />
                                <button
                                    type="button"
                                    className={`${adminCinzel.className} inline-flex h-8 items-center gap-1 border border-gold/20 px-3 text-[10px] font-semibold tracking-[0.14em] text-gold`}
                                >
                                    View Order
                                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                                </button>
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
                </div>
            </section>
        </div>
    );
}
