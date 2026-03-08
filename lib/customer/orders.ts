export type CustomerOrderStatus = "Processing" | "Shipped" | "Delivered";
export type CustomerOrderTimelineState = "complete" | "current" | "upcoming";

export type CustomerOrderItem = {
    name: string;
    collectionLabel: string;
    color: string;
    size: string;
    quantity: number;
    sku: string;
    price: number;
    image: string;
};

export type CustomerOrderTrackingStep = {
    title: string;
    time: string;
    description: string;
    state: CustomerOrderTimelineState;
    update?: {
        label: string;
        time: string;
    };
};

export type CustomerOrder = {
    id: string;
    status: CustomerOrderStatus;
    placedOn: string;
    placedAt: string;
    contactEmail: string;
    items: CustomerOrderItem[];
    shippingAddress: {
        name: string;
        line1: string;
        line2: string;
        line3: string;
        phone: string;
    };
    delivery: {
        method: string;
        detail: string;
        cost: number;
    };
    tracking: {
        carrier: string;
        trackingNumber: string;
        trackLabel: string;
        steps: CustomerOrderTrackingStep[];
    };
    payment: {
        provider: string;
        method: string;
        paidVia: string;
        statusLabel: string;
        transactionId: string;
        paymentDate: string;
        amountCharged: number;
        currencyLabel: string;
    };
    discount: number;
    coupon?: {
        code: string;
        amount: number;
    };
    issueSupport: {
        available: boolean;
        note: string;
    };
};

const currencyFormatter = new Intl.NumberFormat("en-IN");

export function formatOrderAmount(amount: number, prefix: "Rs" | "INR" | "₹" = "₹") {
    if (prefix === "₹") {
        return `₹${currencyFormatter.format(amount)}`;
    }

    return `${prefix} ${currencyFormatter.format(amount)}`;
}

export function getOrderTotalItems(order: CustomerOrder) {
    return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function getOrderSubtotal(order: CustomerOrder) {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getOrderListMeta(order: CustomerOrder) {
    const totalItems = getOrderTotalItems(order);

    return `${order.placedOn} / ${totalItems} ${totalItems === 1 ? "item" : "items"} / ${formatOrderAmount(order.payment.amountCharged, "Rs")}`;
}

export function getOrderById(id: string) {
    return customerOrders.find((order) => order.id === id);
}

function normalizeOrderLookup(value: string) {
    return value.trim().toUpperCase();
}

function normalizeContactLookup(value: string) {
    return value.trim().toLowerCase();
}

function normalizePhoneLookup(value: string) {
    return value.replace(/\D/g, "");
}

export function findOrderByLookup(orderId: string, contact: string) {
    const normalizedOrderId = normalizeOrderLookup(orderId);
    const normalizedContact = normalizeContactLookup(contact);
    const normalizedPhone = normalizePhoneLookup(contact);

    if (!normalizedOrderId || !normalizedContact) {
        return undefined;
    }

    return customerOrders.find((order) => {
        const emailMatches = order.contactEmail.toLowerCase() === normalizedContact;
        const phoneMatches = normalizedPhone.length > 0
            && normalizePhoneLookup(order.shippingAddress.phone) === normalizedPhone;

        return order.id.toUpperCase() === normalizedOrderId && (emailMatches || phoneMatches);
    });
}

export function getCurrentTrackingStep(order: CustomerOrder) {
    return (
        order.tracking.steps.find((step) => step.state === "current")
        ?? [...order.tracking.steps].reverse().find((step) => step.state === "complete")
        ?? order.tracking.steps[0]
    );
}

export const customerOrders: CustomerOrder[] = [
    {
        id: "ALB-10298",
        status: "Shipped",
        placedOn: "28 February 2026",
        placedAt: "Sunday, 28 February 2026 at 4:32 PM",
        contactEmail: "alex@albaeon.com",
        items: [
            {
                name: "Aegis Layered Coat",
                collectionLabel: "SIGNATURE OUTERWEAR / OBSIDIAN DROP",
                color: "Black",
                size: "L",
                quantity: 1,
                sku: "ALB-AEG-BLK-L",
                price: 2499,
                image: "/collection/nocturne-layer-jacket.png",
            },
        ],
        shippingAddress: {
            name: "Alex Morgan",
            line1: "42 MG Road, Indiranagar",
            line2: "Bengaluru, Karnataka 560038",
            line3: "India",
            phone: "+91 98765 43210",
        },
        delivery: {
            method: "Standard Shipping",
            detail: "Expected delivery by 6 March 2026",
            cost: 0,
        },
        tracking: {
            carrier: "Delhivery",
            trackingNumber: "DEL928374612",
            trackLabel: "TRACK ON DELHIVERY",
            steps: [
                {
                    title: "ORDER PLACED",
                    time: "28 Feb 2026, 4:32 PM",
                    description: "Your order has been confirmed and payment received.",
                    state: "complete",
                },
                {
                    title: "PROCESSING",
                    time: "1 Mar 2026, 10:15 AM",
                    description: "Your item is being prepared and handed to our fulfilment partner.",
                    state: "complete",
                },
                {
                    title: "SHIPPED",
                    time: "3 Mar 2026, 2:48 PM",
                    description: "Your order is on its way. Expected delivery by 6 March 2026.",
                    state: "current",
                    update: {
                        label: "Last update: Package in transit / Bengaluru Hub",
                        time: "3 Mar 2026, 8:00 AM",
                    },
                },
                {
                    title: "OUT FOR DELIVERY",
                    time: "Pending",
                    description: "Your courier partner will attempt delivery once the parcel reaches the final hub.",
                    state: "upcoming",
                },
                {
                    title: "DELIVERED",
                    time: "Est. 6 Mar 2026",
                    description: "Delivery confirmation will appear here once your package arrives.",
                    state: "upcoming",
                },
            ],
        },
        payment: {
            provider: "Razorpay",
            method: "UPI / HDFC Bank",
            paidVia: "Razorpay / UPI",
            statusLabel: "Paid",
            transactionId: "pay_NxK8mZ7Qrp1234",
            paymentDate: "28 February 2026, 4:33 PM",
            amountCharged: 2499,
            currencyLabel: "INR / Indian Rupees",
        },
        discount: 0,
        issueSupport: {
            available: false,
            note: "Available once your order is delivered",
        },
    },
    {
        id: "ALB-10271",
        status: "Processing",
        placedOn: "2 March 2026",
        placedAt: "Monday, 2 March 2026 at 11:18 AM",
        contactEmail: "alex@albaeon.com",
        items: [
            {
                name: "Obsidian Hoodie",
                collectionLabel: "HEAVYWEIGHT FLEECE / NOCTURNE SERIES",
                color: "Onyx",
                size: "XL",
                quantity: 1,
                sku: "ALB-OBS-ONY-XL",
                price: 1899,
                image: "/collection/sovereign-hoodie.png",
            },
        ],
        shippingAddress: {
            name: "Alex Morgan",
            line1: "42 MG Road, Indiranagar",
            line2: "Bengaluru, Karnataka 560038",
            line3: "India",
            phone: "+91 98765 43210",
        },
        delivery: {
            method: "Standard Shipping",
            detail: "Estimated 5-7 business days",
            cost: 0,
        },
        tracking: {
            carrier: "Delhivery",
            trackingNumber: "DEL602183744",
            trackLabel: "TRACK ON DELHIVERY",
            steps: [
                {
                    title: "ORDER PLACED",
                    time: "2 Mar 2026, 11:18 AM",
                    description: "Your order has been confirmed and payment received.",
                    state: "complete",
                },
                {
                    title: "PROCESSING",
                    time: "3 Mar 2026, 9:20 AM",
                    description: "Your hoodie is being quality checked, packed, and prepared for pickup.",
                    state: "current",
                },
                {
                    title: "SHIPPED",
                    time: "Pending",
                    description: "Tracking updates will appear here once the parcel is scanned by the courier.",
                    state: "upcoming",
                },
                {
                    title: "OUT FOR DELIVERY",
                    time: "Pending",
                    description: "The delivery attempt timeline will appear here after dispatch.",
                    state: "upcoming",
                },
                {
                    title: "DELIVERED",
                    time: "Pending",
                    description: "Delivery confirmation will appear here once the order is completed.",
                    state: "upcoming",
                },
            ],
        },
        payment: {
            provider: "Razorpay",
            method: "UPI / ICICI Bank",
            paidVia: "Razorpay / UPI",
            statusLabel: "Paid",
            transactionId: "pay_ObS271Qrp5088",
            paymentDate: "2 March 2026, 11:19 AM",
            amountCharged: 1899,
            currencyLabel: "INR / Indian Rupees",
        },
        discount: 0,
        issueSupport: {
            available: false,
            note: "Available once your order is delivered",
        },
    },
    {
        id: "ALB-10255",
        status: "Delivered",
        placedOn: "14 February 2026",
        placedAt: "Saturday, 14 February 2026 at 6:09 PM",
        contactEmail: "alex@albaeon.com",
        items: [
            {
                name: "Medusa Crop Tee",
                collectionLabel: "ORIGINAL DESIGN / MYTHOLOGY SERIES",
                color: "Black",
                size: "M",
                quantity: 1,
                sku: "ALB-MED-BLK-M",
                price: 1499,
                image: "/collection/aurelian-crest-tee.png",
            },
        ],
        shippingAddress: {
            name: "Alex Morgan",
            line1: "42 MG Road, Indiranagar",
            line2: "Bengaluru, Karnataka 560038",
            line3: "India",
            phone: "+91 98765 43210",
        },
        delivery: {
            method: "Standard Shipping",
            detail: "Delivered on 17 February 2026",
            cost: 0,
        },
        tracking: {
            carrier: "Blue Dart",
            trackingNumber: "BLD17440012",
            trackLabel: "TRACK ON BLUE DART",
            steps: [
                {
                    title: "ORDER PLACED",
                    time: "14 Feb 2026, 6:09 PM",
                    description: "Your order has been confirmed and payment received.",
                    state: "complete",
                },
                {
                    title: "PROCESSING",
                    time: "15 Feb 2026, 9:05 AM",
                    description: "Your tee was packed and handed to our fulfilment partner.",
                    state: "complete",
                },
                {
                    title: "SHIPPED",
                    time: "15 Feb 2026, 6:42 PM",
                    description: "Your order is on its way to the delivery destination.",
                    state: "complete",
                    update: {
                        label: "Last update: Shipment sorted at Bengaluru Facility",
                        time: "16 Feb 2026, 7:30 AM",
                    },
                },
                {
                    title: "OUT FOR DELIVERY",
                    time: "17 Feb 2026, 9:11 AM",
                    description: "Your courier partner completed the final delivery attempt.",
                    state: "complete",
                },
                {
                    title: "DELIVERED",
                    time: "17 Feb 2026, 1:14 PM",
                    description: "Package delivered successfully to Alex Morgan.",
                    state: "current",
                },
            ],
        },
        payment: {
            provider: "Razorpay",
            method: "UPI / Axis Bank",
            paidVia: "Razorpay / UPI",
            statusLabel: "Paid",
            transactionId: "pay_Med255Txn8831",
            paymentDate: "14 February 2026, 6:10 PM",
            amountCharged: 1299,
            currencyLabel: "INR / Indian Rupees",
        },
        discount: 0,
        coupon: {
            code: "MYTH10",
            amount: 200,
        },
        issueSupport: {
            available: true,
            note: "Report within 48 hours of delivery with an unboxing video",
        },
    },
    {
        id: "ALB-10231",
        status: "Delivered",
        placedOn: "3 January 2026",
        placedAt: "Saturday, 3 January 2026 at 8:24 PM",
        contactEmail: "alex@albaeon.com",
        items: [
            {
                name: "Pantheon Hoodie",
                collectionLabel: "CORE LAYER / PANTHEON ARC",
                color: "Charcoal",
                size: "XL",
                quantity: 1,
                sku: "ALB-PTH-CHR-XL",
                price: 1999,
                image: "/collection/sovereign-hoodie.png",
            },
            {
                name: "Mythcore Long Tee",
                collectionLabel: "ESSENTIALS / DARK ICONS",
                color: "Bone",
                size: "L",
                quantity: 1,
                sku: "ALB-MTL-BNE-L",
                price: 1599,
                image: "/home/best-mythcore-long-tee.png",
            },
        ],
        shippingAddress: {
            name: "Alex Morgan",
            line1: "42 MG Road, Indiranagar",
            line2: "Bengaluru, Karnataka 560038",
            line3: "India",
            phone: "+91 98765 43210",
        },
        delivery: {
            method: "Express Shipping",
            detail: "Delivered on 6 January 2026",
            cost: 0,
        },
        tracking: {
            carrier: "Ecom Express",
            trackingNumber: "ECO660231998",
            trackLabel: "TRACK ON ECOM EXPRESS",
            steps: [
                {
                    title: "ORDER PLACED",
                    time: "3 Jan 2026, 8:24 PM",
                    description: "Your order has been confirmed and payment received.",
                    state: "complete",
                },
                {
                    title: "PROCESSING",
                    time: "4 Jan 2026, 10:01 AM",
                    description: "Your items were packed and prepared for pickup.",
                    state: "complete",
                },
                {
                    title: "SHIPPED",
                    time: "4 Jan 2026, 5:36 PM",
                    description: "The parcel left our warehouse and is moving through the courier network.",
                    state: "complete",
                    update: {
                        label: "Last update: Shipment reached final delivery station",
                        time: "5 Jan 2026, 11:22 PM",
                    },
                },
                {
                    title: "OUT FOR DELIVERY",
                    time: "6 Jan 2026, 8:47 AM",
                    description: "Your order left the hub and was assigned to a delivery associate.",
                    state: "complete",
                },
                {
                    title: "DELIVERED",
                    time: "6 Jan 2026, 2:06 PM",
                    description: "Package delivered successfully to Alex Morgan.",
                    state: "current",
                },
            ],
        },
        payment: {
            provider: "Razorpay",
            method: "Card / HDFC Bank",
            paidVia: "Razorpay / Card",
            statusLabel: "Paid",
            transactionId: "pay_Pth231Txn9954",
            paymentDate: "3 January 2026, 8:25 PM",
            amountCharged: 3598,
            currencyLabel: "INR / Indian Rupees",
        },
        discount: 0,
        issueSupport: {
            available: true,
            note: "Report within 48 hours of delivery with an unboxing video",
        },
    },
];
