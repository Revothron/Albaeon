import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link, Row, Column,
} from '@react-email/components'

type Props = {
  customerName: string
  orderNumber: string
  items: { name: string; color: string; size: string; quantity: number }[]
  reviewUrl: string
  supportUrl: string
  invoiceUrl: string
}

export default function OrderDelivered({
  customerName = 'Arjun',
  orderNumber = 'ALB-00142',
  items = [{ name: 'Empire Oversized Tee', color: 'Black', size: 'L', quantity: 1 }],
  reviewUrl = 'https://albaeon.com/account/orders',
  supportUrl = 'https://albaeon.com/contact',
  invoiceUrl = 'https://albaeon.com/account/orders',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Albaeon order {orderNumber} has been delivered</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>ORDER DELIVERED</Text>
          </Section>

          {/* Body */}
          <Section style={styles.section}>
            <Heading style={styles.h2}>Your order arrived, {customerName}.</Heading>
            <Text style={styles.text}>
              Order <span style={styles.highlight}>{orderNumber}</span> has been delivered. We hope you love what you received.
            </Text>
            <Text style={styles.text}>
              If anything is not right with your order, contact our support team within 7 days of delivery.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Items */}
          <Section style={styles.section}>
            <Text style={styles.h3}>DELIVERED ITEMS</Text>
            {items.map((item, i) => (
              <Row key={i} style={styles.itemRow}>
                <Column style={styles.itemDot}>
                  <Text style={styles.dot}>—</Text>
                </Column>
                <Column>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.color} / {item.size} · Qty {item.quantity}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={styles.hr} />

          {/* Actions */}
          <Section style={styles.section}>
            <Text style={styles.h3}>NEXT STEPS</Text>
            <Row style={styles.actionRow}>
              <Column>
                <Text style={styles.actionLabel}>Download Invoice</Text>
                <Text style={styles.actionDesc}>
                  Your invoice is available in your account under Order History.
                </Text>
                <Link href={invoiceUrl} style={styles.actionLink}>
                  VIEW ORDER →
                </Link>
              </Column>
            </Row>
            <Row style={styles.actionRow}>
              <Column>
                <Text style={styles.actionLabel}>Something Wrong?</Text>
                <Text style={styles.actionDesc}>
                  Wrong item, damaged product, or missing piece — we will sort it out.
                </Text>
                <Link href={supportUrl} style={styles.actionLink}>
                  CONTACT SUPPORT →
                </Link>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Link href={reviewUrl} style={styles.cta}>
              VIEW ORDER HISTORY
            </Link>
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Thank you for wearing the myth.
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://albaeon.com/shop" style={styles.footerLink}>Shop Collection</Link>
              {' · '}
              <Link href={supportUrl} style={styles.footerLink}>Support</Link>
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
  headerSub: { color: '#4CAF7D', fontSize: '10px', letterSpacing: '4px', margin: '8px 0 0' },
  section: { padding: '20px 0' },
  h2: { color: '#E8E2D6', fontSize: '22px', fontWeight: 300, margin: '0 0 12px' },
  h3: { color: '#E6C979', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', margin: '0 0 16px' },
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: '0 0 12px' },
  highlight: { color: '#E6C979' },
  itemRow: { padding: '8px 0', borderBottom: '1px solid rgba(230,201,121,0.08)' },
  itemDot: { width: '24px' },
  dot: { color: '#E6C979', fontSize: '14px', margin: 0 },
  itemName: { color: '#E8E2D6', fontSize: '14px', margin: '0 0 3px', fontWeight: 500 },
  itemMeta: { color: '#B7AFC3', fontSize: '12px', margin: 0 },
  actionRow: { padding: '12px 0', borderBottom: '1px solid rgba(230,201,121,0.08)' },
  actionLabel: { color: '#E8E2D6', fontSize: '14px', fontWeight: 500, margin: '0 0 4px' },
  actionDesc: { color: '#B7AFC3', fontSize: '13px', lineHeight: '1.6', margin: '0 0 8px' },
  actionLink: { color: '#E6C979', fontSize: '11px', letterSpacing: '2px', textDecoration: 'none' },
  ctaSection: { textAlign: 'center' as const, padding: '28px 0' },
  cta: { backgroundColor: '#E6C979', color: '#130F18', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}