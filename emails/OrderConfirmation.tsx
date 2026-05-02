import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Row, Column, Link,
} from '@react-email/components'

type OrderItem = {
  name: string
  color: string
  size: string
  quantity: number
  price: string
  subtotal: string
}

type Props = {
  customerName: string
  orderNumber: string
  orderDate: string
  items: OrderItem[]
  subtotal: string
  shipping: string
  total: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal: string
    country: string
  }
  trackOrderUrl: string
}

export default function OrderConfirmation({
  customerName = 'Arjun',
  orderNumber = 'ALB-00142',
  orderDate = '20 Mar 2026',
  items = [{ name: 'Empire Oversized Tee', color: 'Black', size: 'L', quantity: 1, price: '₹1,299', subtotal: '₹1,299' }],
  subtotal = '₹1,299',
  shipping = 'Free',
  total = '₹1,299',
  shippingAddress = { line1: '42 MG Road', city: 'Bengaluru', state: 'Karnataka', postal: '560038', country: 'India' },
  trackOrderUrl = 'https://albaeon.com/track-order',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Albaeon order {orderNumber} is confirmed</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>ORDER CONFIRMED</Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.section}>
            <Heading style={styles.h2}>Thank you, {customerName}.</Heading>
            <Text style={styles.text}>
              Your order has been placed and is being prepared. We will notify you once it ships.
            </Text>
            <Text style={styles.orderMeta}>
              Order {orderNumber} · {orderDate}
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Items */}
          <Section style={styles.section}>
            <Heading style={styles.h3}>ORDER ITEMS</Heading>
            {items.map((item, i) => (
              <Row key={i} style={styles.itemRow}>
                <Column style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.color} / {item.size} · Qty {item.quantity}</Text>
                </Column>
                <Column style={styles.itemPrice}>
                  <Text style={styles.itemPriceText}>{item.subtotal}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={styles.hr} />

          {/* Totals */}
          <Section style={styles.section}>
            <Row>
              <Column><Text style={styles.totalLabel}>Subtotal</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={styles.totalValue}>{subtotal}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={styles.totalLabel}>Shipping</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{ ...styles.totalValue, color: '#4CAF7D' }}>{shipping}</Text>
              </Column>
            </Row>
            <Row>
              <Column><Text style={styles.grandTotalLabel}>TOTAL</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={styles.grandTotalValue}>{total}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          {/* Shipping address */}
          <Section style={styles.section}>
            <Heading style={styles.h3}>SHIPPING TO</Heading>
            <Text style={styles.address}>
              {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ''}{'\n'}
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal}{'\n'}
              {shippingAddress.country}
            </Text>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Link href={trackOrderUrl} style={styles.cta}>
              TRACK YOUR ORDER
            </Link>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Questions? Reply to this email or visit{' '}
              <Link href="https://albaeon.com/contact" style={styles.footerLink}>albaeon.com/contact</Link>
            </Text>
            <Text style={styles.footerText}>© 2026 Albaeon · Kerala, India</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: { backgroundColor: '#241A33', fontFamily: 'Georgia, serif', margin: 0, padding: 0 },
  container: { maxWidth: '560px', margin: '0 auto', padding: '40px 20px' },
  header: { textAlign: 'center' as const, paddingBottom: '24px' },
  logo: { color: '#E6C979', fontSize: '28px', fontWeight: 700, letterSpacing: '6px', margin: 0 },
  headerSub: { color: '#B7AFC3', fontSize: '10px', letterSpacing: '4px', margin: '8px 0 0' },
  section: { padding: '20px 0' },
  h2: { color: '#E8E2D6', fontSize: '22px', fontWeight: 300, margin: '0 0 12px' },
  h3: { color: '#E6C979', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', margin: '0 0 16px' },
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: '0 0 12px' },
  orderMeta: { color: '#E6C979', fontSize: '13px', margin: 0 },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  itemRow: { padding: '10px 0', borderBottom: '1px solid rgba(230,201,121,0.08)' },
  itemDetails: { width: '75%' },
  itemName: { color: '#E8E2D6', fontSize: '14px', margin: '0 0 4px', fontWeight: 500 },
  itemMeta: { color: '#B7AFC3', fontSize: '12px', margin: 0 },
  itemPrice: { width: '25%', textAlign: 'right' as const },
  itemPriceText: { color: '#E8E2D6', fontSize: '14px', margin: 0 },
  totalLabel: { color: '#B7AFC3', fontSize: '13px', margin: '4px 0' },
  totalValue: { color: '#E8E2D6', fontSize: '13px', margin: '4px 0' },
  grandTotalLabel: { color: '#E8E2D6', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', margin: '8px 0 0' },
  grandTotalValue: { color: '#E6C979', fontSize: '18px', fontWeight: 700, margin: '8px 0 0' },
  address: { color: '#E8E2D6', fontSize: '14px', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-line' as const },
  ctaSection: { textAlign: 'center' as const, padding: '28px 0' },
  cta: { backgroundColor: '#E6C979', color: '#130F18', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}