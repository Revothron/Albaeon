export type AdminCustomerOrderStatus = "Shipped" | "Delivered" | "Processing" | "Pending";

export type AdminCustomerOrderHistoryItem = {
    id: string;
    date: string;
    amount: string;
    status: AdminCustomerOrderStatus;
};

export type AdminCustomer = {
    id: string;
    name: string;
    username: string;
    registered: string;
    email: string;
    phone: string;
    orders: number;
    spent: string;
    lastOrder: string;
    aov: string;
    countryCode: string;
    country: string;
    city: string;
    region: string;
    postal: string;
    memberSince: string;
    segment: string;
    shippingAddress: string[];
    billingAddress: string[];
    orderHistory: AdminCustomerOrderHistoryItem[];
};

export const adminCustomers: AdminCustomer[] = [
    {
        id: "arjun-sharma",
        name: "Arjun Sharma",
        username: "arjunsh",
        registered: "12 Jan 2026",
        email: "arjun@g.com",
        phone: "+91 98765 43210",
        orders: 8,
        spent: "Rs 14,200",
        lastOrder: "28 Feb 2026",
        aov: "Rs 1,775",
        countryCode: "IN",
        country: "India",
        city: "Bengaluru",
        region: "Karnataka",
        postal: "560038",
        memberSince: "January 2026",
        segment: "Repeat Buyer",
        shippingAddress: [
            "Arjun Sharma",
            "42, MG Road, Indiranagar",
            "Bengaluru, Karnataka 560038",
            "India / +91 98765 43210",
        ],
        billingAddress: [
            "Arjun Sharma",
            "42, MG Road, Indiranagar",
            "Bengaluru, Karnataka 560038",
            "India / +91 98765 43210",
        ],
        orderHistory: [
            { id: "ALB-00142", date: "28 Feb 2026", amount: "Rs 1,299", status: "Shipped" },
            { id: "ALB-00141", date: "27 Feb 2026", amount: "Rs 2,199", status: "Delivered" },
            { id: "ALB-00140", date: "26 Feb 2026", amount: "Rs 1,799", status: "Processing" },
            { id: "ALB-00139", date: "25 Feb 2026", amount: "Rs 3,598", status: "Pending" },
            { id: "ALB-00138", date: "24 Feb 2026", amount: "Rs 1,299", status: "Delivered" },
        ],
    },
    {
        id: "priya-nair",
        name: "Priya Nair",
        username: "priyanair",
        registered: "4 Feb 2026",
        email: "priya@g.com",
        phone: "+91 99887 66554",
        orders: 5,
        spent: "Rs 8,950",
        lastOrder: "26 Feb 2026",
        aov: "Rs 1,790",
        countryCode: "IN",
        country: "India",
        city: "Chennai",
        region: "Tamil Nadu",
        postal: "600020",
        memberSince: "February 2026",
        segment: "Emerging Loyalist",
        shippingAddress: [
            "Priya Nair",
            "17, Besant Avenue, Adyar",
            "Chennai, Tamil Nadu 600020",
            "India / +91 99887 66554",
        ],
        billingAddress: [
            "Priya Nair",
            "17, Besant Avenue, Adyar",
            "Chennai, Tamil Nadu 600020",
            "India / +91 99887 66554",
        ],
        orderHistory: [
            { id: "ALB-00137", date: "26 Feb 2026", amount: "Rs 1,499", status: "Delivered" },
            { id: "ALB-00136", date: "22 Feb 2026", amount: "Rs 2,499", status: "Delivered" },
            { id: "ALB-00135", date: "18 Feb 2026", amount: "Rs 1,799", status: "Shipped" },
            { id: "ALB-00134", date: "11 Feb 2026", amount: "Rs 1,199", status: "Delivered" },
            { id: "ALB-00133", date: "4 Feb 2026", amount: "Rs 1,954", status: "Delivered" },
        ],
    },
    {
        id: "ethan-cole",
        name: "Ethan Cole",
        username: "ethanc",
        registered: "21 Jan 2026",
        email: "ethan@g.com",
        phone: "+1 512 555 0142",
        orders: 3,
        spent: "$210",
        lastOrder: "24 Feb 2026",
        aov: "$70",
        countryCode: "US",
        country: "United States",
        city: "Austin",
        region: "Texas",
        postal: "73301",
        memberSince: "January 2026",
        segment: "New Customer",
        shippingAddress: [
            "Ethan Cole",
            "208 South Congress Ave",
            "Austin, Texas 73301",
            "United States / +1 512 555 0142",
        ],
        billingAddress: [
            "Ethan Cole",
            "208 South Congress Ave",
            "Austin, Texas 73301",
            "United States / +1 512 555 0142",
        ],
        orderHistory: [
            { id: "ALB-00132", date: "24 Feb 2026", amount: "$70", status: "Shipped" },
            { id: "ALB-00131", date: "10 Feb 2026", amount: "$92", status: "Delivered" },
            { id: "ALB-00130", date: "23 Jan 2026", amount: "$48", status: "Delivered" },
        ],
    },
    {
        id: "maria-gomez",
        name: "Maria Gomez",
        username: "mariag",
        registered: "9 Dec 2025",
        email: "maria@g.com",
        phone: "+1 305 555 0190",
        orders: 6,
        spent: "$468",
        lastOrder: "20 Feb 2026",
        aov: "$78",
        countryCode: "US",
        country: "United States",
        city: "Miami",
        region: "Florida",
        postal: "33101",
        memberSince: "December 2025",
        segment: "Repeat Buyer",
        shippingAddress: [
            "Maria Gomez",
            "51 Biscayne Boulevard",
            "Miami, Florida 33101",
            "United States / +1 305 555 0190",
        ],
        billingAddress: [
            "Maria Gomez",
            "51 Biscayne Boulevard",
            "Miami, Florida 33101",
            "United States / +1 305 555 0190",
        ],
        orderHistory: [
            { id: "ALB-00129", date: "20 Feb 2026", amount: "$84", status: "Delivered" },
            { id: "ALB-00128", date: "15 Feb 2026", amount: "$76", status: "Delivered" },
            { id: "ALB-00127", date: "7 Feb 2026", amount: "$92", status: "Processing" },
            { id: "ALB-00126", date: "29 Jan 2026", amount: "$68", status: "Delivered" },
            { id: "ALB-00125", date: "13 Jan 2026", amount: "$74", status: "Delivered" },
        ],
    },
    {
        id: "rahul-verma",
        name: "Rahul Verma",
        username: "rahulv",
        registered: "3 Jan 2026",
        email: "rahul@g.com",
        phone: "+91 98111 22334",
        orders: 4,
        spent: "Rs 6,380",
        lastOrder: "18 Feb 2026",
        aov: "Rs 1,595",
        countryCode: "IN",
        country: "India",
        city: "Pune",
        region: "Maharashtra",
        postal: "411001",
        memberSince: "January 2026",
        segment: "Occasional Buyer",
        shippingAddress: [
            "Rahul Verma",
            "9 Koregaon Park Lane",
            "Pune, Maharashtra 411001",
            "India / +91 98111 22334",
        ],
        billingAddress: [
            "Rahul Verma",
            "9 Koregaon Park Lane",
            "Pune, Maharashtra 411001",
            "India / +91 98111 22334",
        ],
        orderHistory: [
            { id: "ALB-00124", date: "18 Feb 2026", amount: "Rs 1,799", status: "Delivered" },
            { id: "ALB-00123", date: "10 Feb 2026", amount: "Rs 1,299", status: "Delivered" },
            { id: "ALB-00122", date: "29 Jan 2026", amount: "Rs 1,492", status: "Shipped" },
            { id: "ALB-00121", date: "9 Jan 2026", amount: "Rs 1,790", status: "Delivered" },
        ],
    },
    {
        id: "sneha-patel",
        name: "Sneha Patel",
        username: "snehap",
        registered: "11 Feb 2026",
        email: "sneha@g.com",
        phone: "+91 99099 88776",
        orders: 2,
        spent: "Rs 2,998",
        lastOrder: "27 Feb 2026",
        aov: "Rs 1,499",
        countryCode: "IN",
        country: "India",
        city: "Ahmedabad",
        region: "Gujarat",
        postal: "380015",
        memberSince: "February 2026",
        segment: "New Customer",
        shippingAddress: [
            "Sneha Patel",
            "88 Satellite Road",
            "Ahmedabad, Gujarat 380015",
            "India / +91 99099 88776",
        ],
        billingAddress: [
            "Sneha Patel",
            "88 Satellite Road",
            "Ahmedabad, Gujarat 380015",
            "India / +91 99099 88776",
        ],
        orderHistory: [
            { id: "ALB-00120", date: "27 Feb 2026", amount: "Rs 1,499", status: "Shipped" },
            { id: "ALB-00119", date: "16 Feb 2026", amount: "Rs 1,499", status: "Delivered" },
        ],
    },
];

export function getAdminCustomerById(id: string) {
    return adminCustomers.find((customer) => customer.id === id);
}
