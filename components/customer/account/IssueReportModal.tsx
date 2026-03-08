"use client";

import Image from "next/image";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import {
    Check,
    ChevronDown,
    Info,
    Shield,
    TriangleAlert,
    Video,
    X,
} from "lucide-react";
import { useEffect, useId, useState, type ChangeEvent } from "react";
import type { CustomerOrder } from "@/lib/customer/orders";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const issueTypes = [
    "Damaged product / torn fabric",
    "Wrong item received",
    "Wrong size or colour sent",
    "Missing item from order",
    "Other",
] as const;

const maxVideoSizeInBytes = 100 * 1024 * 1024;

type SubmittedIssue = {
    contactValue: string;
    issueType: string;
    submittedAt: string;
    ticketId: string;
};

function formatFileSize(size: number) {
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function formatSubmittedAt(date: Date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return `${get("day")} ${get("month")} ${get("year")}, ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
}

function ContactCard({
    active,
    label,
    value,
    onClick,
}: {
    active: boolean;
    label: string;
    value: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-1 flex-col gap-2 border px-5 py-4 text-left transition-colors duration-200 ${
                active
                    ? "border-gold/60 bg-gold/6"
                    : "border-gold/10 bg-primary hover:border-gold/30"
            }`}
        >
            <div className="flex items-center gap-2">
                <span
                    className={`h-2.5 w-2.5 rounded-full border ${
                        active ? "border-gold bg-gold" : "border-text-muted/45 bg-transparent"
                    }`}
                />
                <span
                    className={`${cinzel.className} text-[11px] font-semibold tracking-[0.2em] ${
                        active ? "text-gold" : "text-text-muted"
                    }`}
                >
                    {label}
                </span>
            </div>
            <span className="font-sans text-[11px] text-text-muted">
                {value}
            </span>
        </button>
    );
}

export default function IssueReportModal({
    order,
}: {
    order: CustomerOrder;
}) {
    const [open, setOpen] = useState(false);
    const [issueTypeOpen, setIssueTypeOpen] = useState(false);
    const [issueType, setIssueType] = useState<string>("");
    const [description, setDescription] = useState("");
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const [contactPreference, setContactPreference] = useState<"Email" | "WhatsApp">("Email");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [successDetails, setSuccessDetails] = useState<SubmittedIssue | null>(null);
    const fileInputId = useId();

    const selectedItem = order.items[selectedItemIndex];
    const trimmedDescription = description.trim();
    const selectedContactValue =
        contactPreference === "Email" ? order.contactEmail : order.shippingAddress.phone;
    const canSubmit =
        Boolean(issueType) &&
        Boolean(trimmedDescription) &&
        Boolean(selectedItem) &&
        Boolean(contactPreference) &&
        Boolean(videoFile) &&
        !fileError;

    useEffect(() => {
        if (!open && !successDetails) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (successDetails) {
                    setSuccessDetails(null);
                    return;
                }

                setOpen(false);
                setIssueTypeOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, successDetails]);

    function resetForm() {
        setIssueType("");
        setIssueTypeOpen(false);
        setDescription("");
        setSelectedItemIndex(0);
        setContactPreference("Email");
        setVideoFile(null);
        setFileError("");
    }

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
        setIssueTypeOpen(false);
    }

    function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            setVideoFile(null);
            setFileError("");
            return;
        }

        if (!file.type.startsWith("video/")) {
            setVideoFile(null);
            setFileError("Please upload a video file in MP4, MOV, or AVI format.");
            return;
        }

        if (file.size > maxVideoSizeInBytes) {
            setVideoFile(null);
            setFileError("Video is too large. Maximum file size is 100MB.");
            return;
        }

        setVideoFile(file);
        setFileError("");
    }

    function handleSubmit() {
        if (!canSubmit) {
            return;
        }

        const now = new Date();

        setSuccessDetails({
            contactValue: selectedContactValue,
            issueType,
            submittedAt: formatSubmittedAt(now),
            ticketId: `AIS-${String(now.getTime()).slice(-5)}`,
        });
        closeModal();
        resetForm();
    }

    return (
        <>
            <section className="border border-gold bg-[#E6A8170A] p-6 sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-[560px] space-y-2">
                        <div className="flex items-center gap-3">
                            <TriangleAlert className="h-5 w-5 text-[#E6A817]" />
                            <p className={`${cinzel.className} text-[15px] font-bold tracking-[0.3em] text-[#E6A817]`}>
                                PRODUCT ISSUE?
                            </p>
                        </div>
                        <p className="font-sans text-[13px] leading-7 text-text-muted">
                            Received a damaged or incorrect item? We do not accept returns, but we will make it right. Report the issue with an unboxing video and our team will review it within 48 hours.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={openModal}
                            className={`${cinzel.className} inline-flex items-center gap-2 border border-[#E6A817] px-6 py-3 text-[10px] font-semibold tracking-[0.3em] text-[#E6A817] transition-colors duration-200 hover:bg-[#E6A817] hover:text-nav`}
                        >
                            REPORT AN ISSUE
                        </button>
                        <p className="font-sans text-[10px] text-text-muted">
                            {order.issueSupport.note}
                        </p>
                    </div>
                </div>

            </section>

            {open ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0914E0] p-4 sm:p-10"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="report-issue-title"
                        className="w-full max-w-[600px] overflow-hidden border border-[#E6A8174D] bg-primary-deep shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-[#E6A81733] bg-surface px-6 py-5 sm:px-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <TriangleAlert className="h-5 w-5 text-[#E6A817]" />
                                    <h2
                                        id="report-issue-title"
                                        className={`${cinzel.className} text-[11px] font-bold tracking-[0.35em] text-[#E6A817]`}
                                    >
                                        REPORT A PRODUCT ISSUE
                                    </h2>
                                </div>
                                <p className="font-sans text-[12px] text-text-muted">
                                    {`Order ${order.id} / ${selectedItem.name}`}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-[18px] text-text-muted transition-colors duration-200 hover:text-gold"
                                aria-label="Close report issue modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6 sm:p-8">
                            <div className="flex gap-3 border-l-[3px] border-[#E6A817] bg-[#E6A8170F] px-4 py-3">
                                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#E6A817]" />
                                <div className="space-y-2">
                                    <p className="font-sans text-[12px] leading-6 text-text-muted">
                                        Albaeon does not accept returns. However, if you received a damaged or incorrect product, submit this form with a video clearly showing the issue. Our team will review and respond within 48 hours.
                                    </p>
                                    {!order.issueSupport.available ? (
                                        <p className="font-sans text-[11px] text-[#E6A817]">
                                            {order.issueSupport.note}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                    ISSUE TYPE
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIssueTypeOpen((current) => !current)}
                                    className="flex h-11 w-full items-center justify-between border border-gold/30 bg-primary px-4 font-sans text-[14px] text-text-primary"
                                >
                                    <span className={issueType ? "text-text-primary" : "text-gold"}>
                                        {issueType || "Select"}
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                                            issueTypeOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {issueTypeOpen ? (
                                    <div className="border border-gold/15 bg-primary">
                                        {issueTypes.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setIssueType(option);
                                                    setIssueTypeOpen(false);
                                                }}
                                                className={`block w-full border-l-2 px-4 py-3 text-left font-sans text-[13px] transition-colors duration-200 ${
                                                    option === issueType
                                                        ? "border-gold text-gold"
                                                        : "border-transparent text-text-primary hover:bg-gold/5"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                        DESCRIBE THE ISSUE
                                    </p>
                                    <span className={`${cinzel.className} text-[10px] text-[#E6A817]`}>*</span>
                                </div>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    maxLength={500}
                                    rows={5}
                                    placeholder="Describe what is wrong with the product in detail - where is the damage, what exactly is incorrect..."
                                    className="min-h-[100px] w-full resize-none border border-gold/15 bg-primary px-4 py-3 font-sans text-[14px] text-text-primary outline-none placeholder:text-text-muted"
                                />
                                <p className="text-right font-sans text-[11px] text-text-muted">
                                    {`${description.length} / 500`}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                    AFFECTED ITEM
                                </p>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => {
                                        const active = selectedItemIndex === index;

                                        return (
                                            <button
                                                key={item.sku}
                                                type="button"
                                                onClick={() => setSelectedItemIndex(index)}
                                                className={`flex w-full items-center gap-4 border px-4 py-3 text-left transition-colors duration-200 ${
                                                    active
                                                        ? "border-gold/40 bg-gold/6"
                                                        : "border-gold/10 bg-primary hover:border-gold/30"
                                                }`}
                                            >
                                                <div className="relative h-10 w-10 overflow-hidden border border-gold/10 bg-surface">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`${cinzel.className} text-[12px] font-semibold text-text-primary`}>
                                                        {item.name}
                                                    </p>
                                                    <p className="font-sans text-[11px] text-text-muted">
                                                        {`${item.color} / ${item.size}`}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`flex h-4 w-4 items-center justify-center border ${
                                                        active
                                                            ? "border-gold text-gold"
                                                            : "border-text-muted/45 text-transparent"
                                                    }`}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                        UPLOAD VIDEO
                                    </p>
                                    <span className={`${cinzel.className} bg-[#E6A8171A] px-2 py-0.5 text-[9px] font-semibold tracking-[0.2em] text-[#E6A817]`}>
                                        REQUIRED
                                    </span>
                                </div>
                                <p className="font-sans text-[11px] leading-6 text-text-muted">
                                    Upload a short video (max 2 minutes, up to 100MB) clearly showing the product issue. Accepted formats: MP4, MOV, AVI.
                                </p>

                                <div className="space-y-3 border border-[#E6A81740] bg-[#E6A81708] px-6 py-8 text-center">
                                    <Video className="mx-auto h-9 w-9 text-[#E6A817B3]" />
                                    <p className={`${cinzel.className} text-[11px] font-semibold tracking-[0.2em] text-text-primary`}>
                                        DRAG AND DROP YOUR VIDEO HERE
                                    </p>
                                    <p className="font-sans text-[12px] text-text-muted">
                                        or
                                    </p>
                                    <label
                                        htmlFor={fileInputId}
                                        className={`${cinzel.className} inline-flex cursor-pointer border border-[#E6A81759] px-6 py-2.5 text-[10px] font-semibold tracking-[0.3em] text-[#E6A817] transition-colors duration-200 hover:bg-[#E6A817] hover:text-nav`}
                                    >
                                        BROWSE FILES
                                    </label>
                                    <input
                                        id={fileInputId}
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/x-msvideo,video/*"
                                        className="hidden"
                                        onChange={handleVideoChange}
                                    />
                                </div>

                                <p className="text-center font-sans text-[11px] text-text-muted">
                                    Max file size: 100MB / MP4, MOV, AVI
                                </p>

                                {videoFile ? (
                                    <div className="space-y-1 border border-[#E6A81733] bg-primary px-4 py-3">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="truncate font-sans text-[12px] text-text-primary">
                                                {videoFile.name}
                                            </p>
                                            <span className="font-sans text-[11px] text-text-muted">
                                                {formatFileSize(videoFile.size)}
                                            </span>
                                        </div>
                                        <p className="text-right font-sans text-[10px] text-text-muted">
                                            Ready to attach
                                        </p>
                                    </div>
                                ) : null}

                                {fileError ? (
                                    <p className="font-sans text-[11px] text-[#E6A817]">
                                        {fileError}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-3">
                                <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                    HOW SHOULD WE CONTACT YOU?
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <ContactCard
                                        active={contactPreference === "Email"}
                                        label="EMAIL"
                                        value={order.contactEmail}
                                        onClick={() => setContactPreference("Email")}
                                    />
                                    <ContactCard
                                        active={contactPreference === "WhatsApp"}
                                        label="WHATSAPP"
                                        value={order.shippingAddress.phone}
                                        onClick={() => setContactPreference("WhatsApp")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gold/10 bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <div className="flex items-center gap-2 font-sans text-[12px] text-text-muted">
                                <Shield className="h-4 w-4" />
                                <span>Our team responds within 48 hours</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`${cinzel.className} border border-gold/15 px-6 py-3 text-[10px] font-semibold tracking-[0.3em] text-text-muted transition-colors duration-200 hover:border-gold/30 hover:text-gold`}
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className={`${cinzel.className} border px-6 py-3 text-[10px] font-semibold tracking-[0.3em] transition-colors duration-200 ${
                                        canSubmit
                                            ? "border-[#E6A817] bg-[#E6A8171A] text-[#E6A817] hover:bg-[#E6A817] hover:text-nav"
                                            : "border-[#E6A817] bg-[#E6A8171A] text-[#E6A817] opacity-35"
                                    }`}
                                >
                                    SUBMIT REPORT
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            ) : null}

            {successDetails ? (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0D0914E0] p-4 sm:p-10"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSuccessDetails(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="report-success-title"
                        className="w-full max-w-[600px] border border-gold/15 bg-primary-deep px-8 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:px-10 sm:py-14"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#4CAF7D] bg-[#4CAF7D10]">
                            <Check className="h-7 w-7 text-[#4CAF7D]" />
                        </div>

                        <h2
                            id="report-success-title"
                            className={`${cormorant.className} mt-5 text-[34px] font-light text-text-primary sm:text-[38px]`}
                        >
                            Report Submitted
                        </h2>
                        <p className={`${cinzel.className} mt-2 text-[12px] font-semibold tracking-[0.2em] text-gold`}>
                            {`Ticket #${successDetails.ticketId}`}
                        </p>
                        <p className="mx-auto mt-4 max-w-[380px] font-sans text-[14px] leading-7 text-text-muted">
                            {`Your issue report has been received. Our team will review your video and contact you at ${successDetails.contactValue} within 48 hours.`}
                        </p>

                        <div className="mx-auto mt-6 h-px w-full max-w-[480px] bg-gold/10" />

                        <div className="mt-5 space-y-2 font-sans text-[13px] text-text-muted">
                            <p>{`Order / ${order.id}`}</p>
                            <p>{`Issue type / ${successDetails.issueType}`}</p>
                            <p>{`Submitted / ${successDetails.submittedAt}`}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSuccessDetails(null)}
                            className={`${cinzel.className} mt-8 inline-flex border border-gold px-12 py-3 text-[10px] font-semibold tracking-[0.3em] text-gold transition-colors duration-200 hover:bg-gold hover:text-nav`}
                        >
                            DONE
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    );
}
