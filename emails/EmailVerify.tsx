import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'

type Props = {
  customerName: string
  verifyUrl: string
}

export default function EmailVerify({
  customerName = 'Arjun',
  verifyUrl = 'https://albaeon.com/auth/confirm?token=xxx',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Albaeon email address</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>VERIFY YOUR EMAIL</Text>
          </Section>

          {/* Body */}
          <Section style={styles.section}>
            <Heading style={styles.h2}>One step away, {customerName}.</Heading>
            <Text style={styles.text}>
              Thank you for creating an Albaeon account. Please verify your email address to activate your account and start exploring the collection.
            </Text>
            <Text style={styles.text}>
              This verification link is valid for <span style={styles.highlight}>24 hours</span>.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Link href={verifyUrl} style={styles.cta}>
              VERIFY EMAIL ADDRESS
            </Link>
          </Section>

          <Hr style={styles.hr} />

          {/* What's next */}
          <Section style={styles.section}>
            <Text style={styles.featureLabel}>ONCE VERIFIED YOU CAN</Text>
            {[
              'Track your orders in real time',
              'Save addresses for faster checkout',
              'Build your wishlist',
              'Access order history and invoices',
            ].map((f) => (
              <Text key={f} style={styles.feature}>→ {f}</Text>
            ))}
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              If you did not create this account, no action is required.
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://albaeon.com/contact" style={styles.footerLink}>Support</Link>
              {' · '}
              <Link href="https://albaeon.com" style={styles.footerLink}>albaeon.com</Link>
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
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: '0 0 12px' },
  highlight: { color: '#E6C979' },
  ctaSection: { textAlign: 'center' as const, padding: '28px 0' },
  cta: { backgroundColor: '#E6C979', color: '#130F18', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' },
  featureLabel: { color: '#E6C979', fontSize: '10px', letterSpacing: '3px', margin: '0 0 12px' },
  feature: { color: '#E8E2D6', fontSize: '14px', margin: '0 0 8px' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}