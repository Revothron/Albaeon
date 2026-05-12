import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Cinzel',
  src: 'https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79mT7.woff2',
})

Font.register({
  family: 'Raleway',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCFPrEHJA.woff2',
      fontWeight: 300,
    },
    {
      src: 'https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9orCFPrEHJA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9orCFPrEHJA.woff2',
      fontWeight: 600,
    },
  ],
})

const C = {
  dark: '#1A1426',
  gold: '#B8973A',
  white: '#FFFFFF',
  bg: '#F9F7F4',
  text: '#2C2040',
  muted: '#8B7F95',
  border: '#E8E2D6',
  goldBorder: '#D4AF37',
  green: '#4CAF7D',
}

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingHorizontal: 40,
    paddingVertical: 32,
    fontFamily: 'Raleway',
    fontWeight: 300,
    fontSize: 9,
    color: C.text,
  },
  // ── Header band ──────────────────────────────────────
  headerBand: {
    backgroundColor: C.dark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 28,
    paddingVertical: 24,
    marginBottom: 28,
  },
  headerBrand: {
    fontFamily: 'Cinzel',
    fontSize: 22,
    color: C.gold,
    letterSpacing: 4,
  },
  headerTagline: {
    fontSize: 7,
    color: '#A092B0',
    marginTop: 4,
    letterSpacing: 2.5,
  },
  headerContact: {
    fontSize: 7,
    color: '#A092B0',
    marginTop: 6,
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerInvoiceLabel: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: C.gold,
    letterSpacing: 4,
  },
  headerInvoiceNum: {
    fontFamily: 'Cinzel',
    fontSize: 16,
    color: C.white,
    letterSpacing: 1,
    marginTop: 4,
  },
  headerDate: {
    fontSize: 8,
    color: '#A092B0',
    marginTop: 4,
  },
  headerDelivered: {
    backgroundColor: '#1B3A2D',
    borderWidth: 1,
    borderColor: C.green,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },
  headerDeliveredText: {
    fontFamily: 'Cinzel',
    fontSize: 6,
    color: C.green,
    letterSpacing: 2.5,
  },
  // ── Section label ────────────────────────────────────
  sectionLabel: {
    fontFamily: 'Cinzel',
    fontSize: 7,
    color: C.gold,
    letterSpacing: 3,
    marginBottom: 6,
  },
  // ── Addresses ────────────────────────────────────────
  addressRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addressBlock: {
    flex: 1,
    paddingRight: 12,
  },
  addressAccent: {
    width: 2,
    backgroundColor: C.gold,
    marginRight: 8,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 8,
    color: C.text,
    lineHeight: 1.7,
  },
  addressMuted: {
    fontSize: 7,
    color: C.muted,
    lineHeight: 1.7,
  },
  paidText: {
    fontSize: 8,
    color: C.green,
    fontFamily: 'Cinzel',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  // ── Table ────────────────────────────────────────────
  table: {
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: C.dark,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontFamily: 'Cinzel',
    fontSize: 6.5,
    color: C.gold,
    letterSpacing: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.white,
  },
  tableRowAlt: {
    backgroundColor: C.bg,
  },
  colSn: { width: 20 },
  colProduct: { flex: 2.8 },
  colHsn: { width: 50, textAlign: 'center' },
  colVariant: { flex: 1.8 },
  colQty: { width: 35, textAlign: 'center' },
  colRate: { width: 65, textAlign: 'right' },
  colAmount: { width: 70, textAlign: 'right' },
  cellText: {
    fontSize: 8,
    color: C.text,
  },
  cellMuted: {
    fontSize: 6.5,
    color: C.muted,
    marginTop: 2,
  },
  cellHsn: {
    fontSize: 8,
    color: C.muted,
    textAlign: 'center',
  },
  // ── Totals ───────────────────────────────────────────
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalsRow: {
    flexDirection: 'row',
    width: 220,
    marginBottom: 3,
  },
  totalsLabel: {
    flex: 1,
    fontSize: 8.5,
    color: C.muted,
    textAlign: 'right',
    paddingRight: 12,
  },
  totalsValue: {
    width: 80,
    fontSize: 8.5,
    color: C.text,
    textAlign: 'right',
  },
  totalsDivider: {
    width: 220,
    borderTopWidth: 1.5,
    borderTopColor: C.gold,
    marginVertical: 5,
  },
  totalGrandLabel: {
    flex: 1,
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: C.dark,
    textAlign: 'right',
    paddingRight: 12,
    letterSpacing: 1,
  },
  totalGrandValue: {
    width: 80,
    fontFamily: 'Cinzel',
    fontSize: 13,
    color: C.gold,
    textAlign: 'right',
  },
  // ── Amount in words ──────────────────────────────────
  wordsSection: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
    marginBottom: 24,
  },
  wordsLabel: {
    fontFamily: 'Cinzel',
    fontSize: 7,
    color: C.muted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  wordsText: {
    fontSize: 9,
    color: C.text,
  },
  // ── Bottom info (bank + signature) ───────────────────
  bottomRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 16,
  },
  bottomLeft: {
    flex: 1,
    paddingRight: 16,
  },
  bottomRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 16,
  },
  bankLabel: {
    fontFamily: 'Cinzel',
    fontSize: 7,
    color: C.gold,
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  bankText: {
    fontSize: 7.5,
    color: C.text,
    lineHeight: 1.8,
  },
  bankLabelDim: {
    color: C.muted,
  },
  signatureLine: {
    width: 160,
    borderTopWidth: 1,
    borderTopColor: C.muted,
    marginTop: 28,
    marginBottom: 4,
  },
  signatureText: {
    fontFamily: 'Cinzel',
    fontSize: 6.5,
    color: C.muted,
    letterSpacing: 2,
  },
  signatureNote: {
    fontSize: 6.5,
    color: C.muted,
    marginTop: 4,
    textAlign: 'right',
    lineHeight: 1.6,
  },
  // ── Footer ───────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.goldBorder,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: C.muted,
  },
  footerBrand: {
    fontFamily: 'Cinzel',
    fontSize: 9,
    color: C.muted,
    letterSpacing: 3,
  },
})

// ── HSN mapping ─────────────────────────────────────────
export function getHsnCode(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('hoodie') || n.includes('sweatshirt') || n.includes('pullover')) return '6110'
  if (n.includes('jacket') || n.includes('coat') || n.includes('blazer')) return '6203'
  if (n.includes('t-shirt') || n.includes('tee') || n.includes('polo') || n.includes('singlet')) return '6109'
  if (n.includes('tank') || n.includes('vest')) return '6109'
  if (n.includes('shirt')) return '6205'
  if (n.includes('jogger') || n.includes('short') || n.includes('pant') || n.includes('trouser')) return '6203'
  if (n.includes('bag') || n.includes('tote')) return '4202'
  if (n.includes('cap') || n.includes('hat') || n.includes('beanie')) return '6505'
  if (n.includes('mug') || n.includes('cup')) return '6911'
  if (n.includes('poster') || n.includes('print') || n.includes('art')) return '4911'
  if (n.includes('phone case') || n.includes('cover')) return '4202'
  if (n.includes('baby') || n.includes('infant') || n.includes('onesie')) return '6111'
  return '6109'
}

// ── Amount in words (Indian numbering) ─────────────────
function amountInWords(amount: number): string {
  if (amount === 0) return 'Zero Only'

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function convertBelow1000(n: number): string {
    if (n === 0) return ''
    let result = ''
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' '
      if (n % 10 > 0) result += ones[n % 10] + ' '
    } else if (n > 0) {
      result += ones[n] + ' '
    }
    return result.trim()
  }

  let words = ''
  const whole = Math.floor(amount)

  const crores = Math.floor(whole / 10000000)
  const lakhs = Math.floor((whole % 10000000) / 100000)
  const thousands = Math.floor((whole % 100000) / 1000)
  const hundreds = whole % 1000

  if (crores > 0) words += convertBelow1000(crores) + ' Crore '
  if (lakhs > 0) words += convertBelow1000(lakhs) + ' Lakh '
  if (thousands > 0) words += convertBelow1000(thousands) + ' Thousand '
  if (hundreds > 0) words += convertBelow1000(hundreds)

  words = words.replace(/\s+/g, ' ').trim()
  if (words) words += ' Only'

  const paise = Math.round((amount - whole) * 100)
  if (paise > 0) {
    words = words.replace(' Only', '')
    words += ` and ${convertBelow1000(paise)} Paise Only`
  }

  return words
}

// ── Types ──────────────────────────────────────────────
export type InvoiceOrderItem = {
  name: string
  color: string
  size: string
  sku: string
  hsnCode: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type InvoiceOrder = {
  orderNumber: string
  createdAt: string
  currency: string
  subtotal: number
  discountAmount: number
  shippingAmount: number
  totalAmount: number
  couponCode?: string | null
  paymentGateway: string
  paymentId?: string | null
  shippingAddress: {
    fullName: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  customerEmail: string
  items: InvoiceOrderItem[]
  bankDetails: {
    beneficiary: string
    bankName: string
    accountNumber: string
    ifsc: string
    branch: string
  }
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`
  return `$${amount.toFixed(2)}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function InvoiceDocument({ order }: { order: InvoiceOrder }) {
  const fmt = (n: number) => formatCurrency(n, order.currency)
  const addr = order.shippingAddress

  return (
    <Document
      title={`Albaeon Invoice ${order.orderNumber}`}
      author="Albaeon"
      subject="Tax Invoice"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header band ─────────────────────────── */}
        <View style={s.headerBand}>
          <View>
            <Text style={s.headerBrand}>ALBAEON</Text>
            <Text style={s.headerTagline}>MYTHICAL CLOTHING · PRINT ON DEMAND</Text>
            <Text style={s.headerContact}>support@albaeon.com · albaeon.com</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerInvoiceLabel}>TAX INVOICE</Text>
            <Text style={s.headerInvoiceNum}>{order.orderNumber}</Text>
            <Text style={s.headerDate}>{formatDate(order.createdAt)}</Text>
            <View style={s.headerDelivered}>
              <Text style={s.headerDeliveredText}>DELIVERED</Text>
            </View>
          </View>
        </View>

        {/* ── Addresses ───────────────────────────── */}
        <View style={s.addressRow}>
          <View style={s.addressBlock}>
            <View style={s.addressLabelRow}>
              <View style={s.addressAccent} />
              <Text style={s.sectionLabel}>BILL TO</Text>
            </View>
            <Text style={s.addressText}>{addr.fullName}</Text>
            <Text style={s.addressMuted}>{order.customerEmail}</Text>
            {addr.phone && <Text style={s.addressMuted}>{addr.phone}</Text>}
          </View>
          <View style={s.addressBlock}>
            <View style={s.addressLabelRow}>
              <View style={s.addressAccent} />
              <Text style={s.sectionLabel}>SHIP TO</Text>
            </View>
            <Text style={s.addressText}>{addr.fullName}</Text>
            <Text style={s.addressText}>{addr.line1}</Text>
            {addr.line2 && <Text style={s.addressText}>{addr.line2}</Text>}
            <Text style={s.addressText}>{addr.city}, {addr.state} {addr.postalCode}</Text>
            <Text style={s.addressText}>{addr.country}</Text>
          </View>
          <View style={s.addressBlock}>
            <View style={s.addressLabelRow}>
              <View style={s.addressAccent} />
              <Text style={s.sectionLabel}>PAYMENT</Text>
            </View>
            <Text style={s.addressText}>
              {order.paymentGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
            </Text>
            {order.paymentId && (
              <Text style={s.addressMuted}>
                {order.paymentId.length > 22 ? order.paymentId.slice(0, 22) + '...' : order.paymentId}
              </Text>
            )}
            <Text style={s.paidText}>PAID</Text>
          </View>
        </View>

        {/* ── Items table ─────────────────────────── */}
        <View style={s.table}>
          <Text style={[s.sectionLabel, { marginBottom: 8 }]}>ORDER ITEMS</Text>

          <View style={s.tableHeaderRow}>
            <Text style={[s.tableHeaderText, s.colSn]}>#</Text>
            <Text style={[s.tableHeaderText, s.colProduct]}>PRODUCT</Text>
            <Text style={[s.tableHeaderText, s.colHsn]}>HSN/SAC</Text>
            <Text style={[s.tableHeaderText, s.colVariant]}>VARIANT</Text>
            <Text style={[s.tableHeaderText, s.colQty]}>QTY</Text>
            <Text style={[s.tableHeaderText, s.colRate]}>RATE</Text>
            <Text style={[s.tableHeaderText, s.colAmount]}>AMOUNT</Text>
          </View>

          {order.items.map((item, i) => (
            <View
              key={i}
              style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : undefined]}
            >
              <Text style={[s.cellText, s.colSn]}>{i + 1}</Text>
              <View style={s.colProduct}>
                <Text style={s.cellText}>{item.name}</Text>
                <Text style={s.cellMuted}>SKU: {item.sku}</Text>
              </View>
              <Text style={s.cellHsn}>{item.hsnCode}</Text>
              <View style={s.colVariant}>
                <Text style={s.cellText}>{item.color}</Text>
                <Text style={s.cellMuted}>Size: {item.size}</Text>
              </View>
              <Text style={[s.cellText, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.cellText, s.colRate]}>{fmt(item.unitPrice)}</Text>
              <Text style={[s.cellText, s.colAmount]}>{fmt(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* ── Totals ──────────────────────────────── */}
        <View style={s.totalsSection}>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Subtotal</Text>
            <Text style={s.totalsValue}>{fmt(order.subtotal)}</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>
                Discount{order.couponCode ? ` (${order.couponCode})` : ''}
              </Text>
              <Text style={[s.totalsValue, { color: C.green }]}>
                -{fmt(order.discountAmount)}
              </Text>
            </View>
          )}
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Shipping</Text>
            <Text style={[s.totalsValue, { color: C.green }]}>
              {order.shippingAmount === 0 ? 'Free' : fmt(order.shippingAmount)}
            </Text>
          </View>
          <View style={s.totalsDivider} />
          <View style={s.totalsRow}>
            <Text style={s.totalGrandLabel}>TOTAL</Text>
            <Text style={s.totalGrandValue}>{fmt(order.totalAmount)}</Text>
          </View>
        </View>

        {/* ── Amount in words ─────────────────────── */}
        <View style={s.wordsSection}>
          <Text style={s.wordsLabel}>AMOUNT IN WORDS</Text>
          <Text style={s.wordsText}>{amountInWords(order.totalAmount)}</Text>
        </View>

        {/* ── Bank details + signature ────────────── */}
        <View style={s.bottomRow}>
          <View style={s.bottomLeft}>
            <Text style={s.bankLabel}>BANK DETAILS</Text>
            <Text style={s.bankText}>
              <Text style={s.bankLabelDim}>Beneficiary: </Text>
              {order.bankDetails.beneficiary}
            </Text>
            <Text style={s.bankText}>
              <Text style={s.bankLabelDim}>Bank: </Text>
              {order.bankDetails.bankName}
            </Text>
            <Text style={s.bankText}>
              <Text style={s.bankLabelDim}>A/c No.: </Text>
              {order.bankDetails.accountNumber}
            </Text>
            <Text style={s.bankText}>
              <Text style={s.bankLabelDim}>IFSC: </Text>
              {order.bankDetails.ifsc}
            </Text>
            <Text style={s.bankText}>
              <Text style={s.bankLabelDim}>Branch: </Text>
              {order.bankDetails.branch}
            </Text>
          </View>
          <View style={s.bottomRight}>
            <View style={s.signatureLine} />
            <Text style={s.signatureText}>AUTHORIZED SIGNATORY</Text>
            <Text style={s.signatureNote}>
              This is a computer-generated{'\n'}invoice and requires no signature.
            </Text>
          </View>
        </View>

        {/* ── Footer ──────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            For support: support@albaeon.com
          </Text>
          <Text style={s.footerBrand}>ALBAEON</Text>
        </View>

      </Page>
    </Document>
  )
}
