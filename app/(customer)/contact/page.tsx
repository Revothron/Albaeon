export default function ContactPage() {
    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-2xl mx-auto px-6 py-20">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-4 text-center">
                    Contact Us
                </h1>
                <p className="text-text-muted text-sm text-center mb-10">
                    Have a question or need assistance? Reach out to us.
                </p>

                <div className="card-surface p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Name</label>
                            <input
                                type="text"
                                className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-muted text-sm mb-2">Subject</label>
                        <input
                            type="text"
                            className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-text-muted text-sm mb-2">Message</label>
                        <textarea
                            rows={5}
                            className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none"
                        />
                    </div>
                    <button className="btn-primary w-full">Send Message</button>
                </div>
            </div>
        </div>
    );
}
