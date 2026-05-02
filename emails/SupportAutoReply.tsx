import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'

type Props = {
  customerName: string
  subject: string
  ticketId: string
}

export default function SupportAutoReply({
  customerName = 'Arjun',
  subject = 'Order issue',
  ticketId = 'TKT-001',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>We received your message — Albaeon Support</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>SUPPORT</Text>
          </Section>

          <Section style={styles.section}>
            <Heading style={styles.h2}>We got your message, {customerName}.</Heading>
            <Text style={styles.text}>
              Thank you for reaching out. We have received your message regarding{' '}
              <strong style={{ color: '#E8E2D6' }}>{subject}</strong> and will get back to you within 24 hours.
            </Text>
            <Text style={styles.ticketRef}>Reference: {ticketId}</Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.section}>
            <Text style={styles.text}>
              While you wait, you can track your order or check our FAQs:
            </Text>
            <Text style={styles.link}>
              <Link href="https://albaeon.com/track-order" style={styles.anchor}>Track your order →</Link>
            </Text>
            <Text style={styles.link}>
              <Link href="https://albaeon.com/return-policy" style={styles.anchor}>Return & refund policy →</Link>
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
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
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: '0 0 12px' },
  ticketRef: { color: '#E6C979', fontSize: '13px', margin: 0 },
  link: { margin: '8px 0' },
  anchor: { color: '#E6C979', fontSize: '14px' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
}