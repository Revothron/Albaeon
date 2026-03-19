export type AdminOrder = {
    id: string;
    customerId: string;
    customer: string;
    email: string;
    phone: string;
    date: string;
    amount: string;
    payment: { label: string; tone: "success" | "info" | "warning" | "danger" | "muted" };
    fulfillment: { label: string; tone: "success" | "info" | "warning" | "danger" | "muted" };
    provider: string;
    paymentMethod: string;
    transactionId: string;
    shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postal: string;
        country: string;
    };
    items: Array<{
        name: string;
        sku: string;
        qty: number;
        price: string;
        total: string;
    }>;
    totals: {
        subtotal: string;
        shipping: string;
        tax: string;
        total: string;
    };
};

export const adminOrders: AdminOrder[] = [
    {
        id: "ALB-00142",
        customerId: "arjun-sharma",
        customer: "Arjun Sharma",
        email: "arjun@gmail.com",
        phone: "+91 98765 43210",
        date: "28 Feb 2026",
        amount: "Rs 1,299",
        payment: { label: "Paid", tone: "success" },
        fulfillment: { label: "Shipped", tone: "info" },
        provider: "Banian City",
        paymentMethod: "UPI",
        transactionId: "TXN-289341",
        shippingAddress: {
            line1: "214 Indigo Avenue",
            line2: "Sector 18",
            city: "Gurgaon",
            state: "Haryana",
            postal: "122001",
            country: "India",
        },
        items: [
            { name: "Empire Oversized Tee", sku: "ALB-EMT", qty: 1, price: "Rs 1,299", total: "Rs 1,299" },
        ],
        totals: { subtotal: "Rs 1,299", shipping: "Rs 0", tax: "Rs 0", total: "Rs 1,299" },
    },
    {
        id: "ALB-00141",
        customerId: "priya-nair",
        customer: "Priya Nair",
        email: "priya@gmail.com",
        phone: "+91 98123 45678",
        date: "27 Feb 2026",
        amount: "Rs 2,199",
        payment: { label: "Paid", tone: "success" },
        fulfillment: { label: "Fulfilled", tone: "success" },
        provider: "Gelato",
        paymentMethod: "Card",
        transactionId: "TXN-289112",
        shippingAddress: {
            line1: "11 Crescent Road",
            line2: "Indiranagar",
            city: "Bengaluru",
            state: "Karnataka",
            postal: "560038",
            country: "India",
        },
        items: [
            { name: "Pantheon Hoodie", sku: "ALB-PHH", qty: 1, price: "Rs 2,199", total: "Rs 2,199" },
        ],
        totals: { subtotal: "Rs 2,199", shipping: "Rs 0", tax: "Rs 0", total: "Rs 2,199" },
    },
    {
        id: "ALB-00140",
        customerId: "rahul-verma",
        customer: "Rahul Verma",
        email: "rahul@gmail.com",
        phone: "+91 90909 33221",
        date: "26 Feb 2026",
        amount: "Rs 1,799",
        payment: { label: "Paid", tone: "success" },
        fulfillment: { label: "Processing", tone: "warning" },
        provider: "Banian City",
        paymentMethod: "Net Banking",
        transactionId: "TXN-288992",
        shippingAddress: {
            line1: "89 Residency Lane",
            city: "Pune",
            state: "Maharashtra",
            postal: "411001",
            country: "India",
        },
        items: [
            { name: "Medusa Crop Tee", sku: "ALB-MCT", qty: 1, price: "Rs 1,799", total: "Rs 1,799" },
        ],
        totals: { subtotal: "Rs 1,799", shipping: "Rs 0", tax: "Rs 0", total: "Rs 1,799" },
    },
    {
        id: "ALB-00139",
        customerId: "sneha-patel",
        customer: "Sneha Patel",
        email: "sneha@gmail.com",
        phone: "+91 99887 66554",
        date: "25 Feb 2026",
        amount: "Rs 3,598",
        payment: { label: "Paid", tone: "success" },
        fulfillment: { label: "Pending", tone: "muted" },
        provider: "Banian City",
        paymentMethod: "Wallet",
        transactionId: "TXN-288772",
        shippingAddress: {
            line1: "54 Park Street",
            city: "Kolkata",
            state: "West Bengal",
            postal: "700016",
            country: "India",
        },
        items: [
            { name: "Atlas Drop Shoulder", sku: "ALB-ADS", qty: 2, price: "Rs 1,799", total: "Rs 3,598" },
        ],
        totals: { subtotal: "Rs 3,598", shipping: "Rs 0", tax: "Rs 0", total: "Rs 3,598" },
    },
    {
        id: "ALB-00138",
        customerId: "kiran-mehta",
        customer: "Kiran Mehta",
        email: "kiran@gmail.com",
        phone: "+91 97001 12345",
        date: "24 Feb 2026",
        amount: "Rs 1,299",
        payment: { label: "Paid", tone: "success" },
        fulfillment: { label: "Fulfilled", tone: "success" },
        provider: "Gelato",
        paymentMethod: "Card",
        transactionId: "TXN-288552",
        shippingAddress: {
            line1: "12 Sunrise Towers",
            line2: "Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            postal: "400050",
            country: "India",
        },
        items: [
            { name: "Cerberus Raglan", sku: "ALB-CRG", qty: 1, price: "Rs 1,299", total: "Rs 1,299" },
        ],
        totals: { subtotal: "Rs 1,299", shipping: "Rs 0", tax: "Rs 0", total: "Rs 1,299" },
    },
    {
        id: "ALB-00137",
        customerId: "maya-kapoor",
        customer: "Maya Kapoor",
        email: "maya@gmail.com",
        phone: "+91 90123 77889",
        date: "24 Feb 2026",
        amount: "Rs 2,499",
        payment: { label: "Pending", tone: "warning" },
        fulfillment: { label: "Processing", tone: "warning" },
        provider: "Banian City",
        paymentMethod: "UPI",
        transactionId: "TXN-288401",
        shippingAddress: {
            line1: "218 Horizon Road",
            city: "Jaipur",
            state: "Rajasthan",
            postal: "302001",
            country: "India",
        },
        items: [
            { name: "Olympus Oversized Hoodie", sku: "ALB-OOH", qty: 1, price: "Rs 2,499", total: "Rs 2,499" },
        ],
        totals: { subtotal: "Rs 2,499", shipping: "Rs 0", tax: "Rs 0", total: "Rs 2,499" },
    },
    {
        id: "ALB-00136",
        customerId: "ethan-cole",
        customer: "Ethan Cole",
        email: "ethan@g.com",
        phone: "+1 415 333 2211",
        date: "23 Feb 2026",
        amount: "$210",
        payment: { label: "Paid", tone: "success" },
        fulfillment: { label: "Delivered", tone: "success" },
        provider: "Gelato",
        paymentMethod: "Card",
        transactionId: "TXN-288204",
        shippingAddress: {
            line1: "217 Main Street",
            city: "San Francisco",
            state: "CA",
            postal: "94105",
            country: "United States",
        },
        items: [
            { name: "Atlas Drop Shoulder", sku: "ALB-ADS", qty: 1, price: "$210", total: "$210" },
        ],
        totals: { subtotal: "$210", shipping: "$0", tax: "$0", total: "$210" },
    },
];
