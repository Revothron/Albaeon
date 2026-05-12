import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'

type Props = {
  customerName: string
  resetUrl: string
  expiresIn?: string
}

export default function PasswordReset({
  customerName = 'Arjun',
  resetUrl = 'https://albaeon.com/reset-password?token=xxx',
  expiresIn = '15 minutes',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Albaeon password</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>PASSWORD RESET</Text>
          </Section>

          {/* Body */}
          <Section style={styles.section}>
            <Heading style={styles.h2}>Reset your password, {customerName}.</Heading>
            <Text style={styles.text}>
              We received a request to reset your Albaeon account password. Click the button below to choose a new password.
            </Text>
            <Text style={styles.text}>
              This link expires in <span style={styles.highlight}>{expiresIn}</span>. If you did not request a password reset, you can safely ignore this email.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Link href={resetUrl} style={styles.cta}>
              RESET PASSWORD
            </Link>
          </Section>

          <Hr style={styles.hr} />

          {/* Security note */}
          <Section style={styles.section}>
            <Text style={styles.securityLabel}>SECURITY NOTE</Text>
            <Text style={styles.securityText}>
              Albaeon will never ask for your password by email or phone. If you did not make this request, please contact us immediately at{' '}
              <Link href="mailto:support@albaeon.com" style={styles.link}>
                support@albaeon.com
              </Link>
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footer}>
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
  securityLabel: { color: '#E6C979', fontSize: '10px', letterSpacing: '3px', margin: '0 0 10px' },
  securityText: { color: '#B7AFC3', fontSize: '13px', lineHeight: '1.7', margin: 0 },
  link: { color: '#E6C979' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}