import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'

type Props = {
  customerName: string
}

export default function Welcome({ customerName = 'Arjun' }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Albaeon — Wear the Myth</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>WELCOME</Text>
          </Section>

          <Section style={styles.section}>
            <Heading style={styles.h2}>Welcome, {customerName}.</Heading>
            <Text style={styles.text}>
              Your account has been created. You are now part of the Albaeon world — premium mythological clothing built for those who carry history on their back.
            </Text>
            <Text style={styles.text}>
              Explore the latest collection and find something worthy of the myth.
            </Text>
          </Section>

          <Section style={styles.ctaSection}>
            <Link href="https://albaeon.com/shop" style={styles.cta}>
              EXPLORE COLLECTION
            </Link>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.section}>
            <Text style={styles.featureLabel}>YOUR ACCOUNT INCLUDES</Text>
            {[
              'Order tracking and history',
              'Saved addresses for faster checkout',
              'Wishlist to save your favourites',
              'Priority support access',
            ].map((f) => (
              <Text key={f} style={styles.feature}>→ {f}</Text>
            ))}
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              <Link href="https://albaeon.com/account" style={styles.footerLink}>My Account</Link>
              {' · '}
              <Link href="https://albaeon.com/contact" style={styles.footerLink}>Support</Link>
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
  ctaSection: { textAlign: 'center' as const, padding: '28px 0' },
  cta: { backgroundColor: '#E6C979', color: '#130F18', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' },
  featureLabel: { color: '#E6C979', fontSize: '10px', letterSpacing: '3px', margin: '0 0 12px' },
  feature: { color: '#E8E2D6', fontSize: '14px', margin: '0 0 8px' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}