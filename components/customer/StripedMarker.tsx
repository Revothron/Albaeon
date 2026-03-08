type StripedMarkerProps = {
    className?: string;
};

export default function StripedMarker({
    className = "h-6 w-4 shrink-0",
}: StripedMarkerProps) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 20"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="0" y="0" width="24" height="0.3" opacity="0.3" />
            <rect x="0" y="1.8" width="24" height="0.4" opacity="0.4" />
            <rect x="0" y="3.6" width="24" height="0.5" opacity="0.5" />
            <rect x="0" y="5.4" width="24" height="0.6" opacity="0.6" />
            <rect x="0" y="7.2" width="24" height="0.7" opacity="0.7" />
            <rect x="0" y="9.0" width="24" height="0.8" opacity="0.8" />
            <rect x="0" y="10.8" width="24" height="1.0" opacity="0.9" />
            <rect x="0" y="12.8" width="24" height="1.2" opacity="1" />
            <rect x="0" y="14.8" width="24" height="1.5" opacity="1" />
            <rect x="0" y="17.0" width="24" height="1.8" opacity="1" />
            <rect x="0" y="19.2" width="24" height="2.2" opacity="1" />
        </svg>
    );
}
