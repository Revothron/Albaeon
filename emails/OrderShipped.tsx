import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'

type Props = {
  customerName: string
  orderNumber: string
  trackingNumber: string
  courier: string
  courierUrl: string
  estimatedDelivery?: string
}

export default function OrderShipped({
  customerName = 'Arjun',
  orderNumber = 'ALB-00142',
  trackingNumber = 'DEL928374612',
  courier = 'Delhivery',
  courierUrl = 'https://delhivery.com/track',
  estimatedDelivery,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Albaeon order {orderNumber} is on its way</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>YOUR ORDER IS ON THE WAY</Text>
          </Section>

          <Section style={styles.section}>
            <Heading style={styles.h2}>It's shipped, {customerName}.</Heading>
            <Text style={styles.text}>
              Your order {orderNumber} has been handed over to {courier} and is on its way to you.
            </Text>

            <Section style={styles.trackingBox}>
              <Text style={styles.trackingLabel}>TRACKING NUMBER</Text>
              <Text style={styles.trackingNumber}>{trackingNumber}</Text>
              <Text style={styles.trackingCourier}>{courier}</Text>
              {estimatedDelivery && (
                <Text style={styles.eta}>Estimated delivery: {estimatedDelivery}</Text>
              )}
            </Section>

            <Section style={styles.ctaSection}>
              <Link href={courierUrl} style={styles.cta}>TRACK SHIPMENT</Link>
            </Section>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Need help?{' '}
              <Link href="https://albaeon.com/contact" style={styles.footerLink}>Contact support</Link>
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
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: '0 0 20px' },
  trackingBox: { backgroundColor: '#1A1426', border: '1px solid rgba(230,201,121,0.2)', padding: '20px', textAlign: 'center' as const },
  trackingLabel: { color: '#B7AFC3', fontSize: '10px', letterSpacing: '3px', margin: '0 0 8px' },
  trackingNumber: { color: '#E6C979', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', margin: '0 0 4px' },
  trackingCourier: { color: '#E8E2D6', fontSize: '13px', margin: '0 0 8px' },
  eta: { color: '#B7AFC3', fontSize: '12px', margin: 0 },
  ctaSection: { textAlign: 'center' as const, padding: '24px 0' },
  cta: { backgroundColor: '#E6C979', color: '#130F18', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}