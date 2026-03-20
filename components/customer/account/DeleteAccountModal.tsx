"use client";

import { Cormorant_Garamond } from "next/font/google";
import { useEffect, useState } from "react";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function DeleteAccountModal({
    email,
}: {
    email: string;
}) {
    const [open, setOpen] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState("");

    const isMatch = confirmEmail.trim().toLowerCase() === email.toLowerCase();

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    function closeModal() {
        setOpen(false);
        setConfirmEmail("");
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn-danger"
            >
                Delete Account
            </button>

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
                        aria-labelledby="delete-account-title"
                        className="w-full max-w-[460px] border border-[#C0392B4D] bg-[#1E1630] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-10"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--status-error)] text-[24px] font-medium text-[var(--status-error)]">
                            !
                        </div>

                        <h2
                            id="delete-account-title"
                            className={`${cormorant.className} mt-4 text-[28px] text-text-primary`}
                        >
                            Delete your account?
                        </h2>

                        <p className="mx-auto mt-3 max-w-[340px] font-sans text-[13px] leading-7 text-text-muted">
                            This will permanently delete your Albaeon account, all order history, saved addresses, and profile data.
                        </p>

                        <div className="mt-6 space-y-1.5 text-left">
                            <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">
                                Type your email to confirm
                            </label>
                            <input
                                type="email"
                                value={confirmEmail}
                                onChange={(event) => setConfirmEmail(event.target.value)}
                                placeholder={email}
                                className="w-full border border-[#C0392B40] bg-primary px-3.5 font-sans text-[14px] text-text-primary outline-none placeholder:text-text-muted"
                            />
                        </div>

                        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="border border-gold/15 px-7 py-2.5 font-sans text-[13px] text-text-muted transition-colors duration-200 hover:border-gold/30 hover:text-gold"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!isMatch}
                                className="btn-danger"
                            >
                                Delete My Account
                            </button>
                        </div>

                        <p className="mt-4 font-sans text-[11px] text-text-muted">
                            This action is permanent and cannot be reversed.
                        </p>
                    </div>
                </div>
            ) : null}
        </>
    );
}


