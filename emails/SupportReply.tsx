import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'

type Props = {
  customerName: string
  replyMessage: string
  originalSubject: string
}

export default function SupportReply({
  customerName = 'Arjun',
  replyMessage = 'We have resolved your issue.',
  originalSubject = 'Order issue',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reply from Albaeon Support</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>SUPPORT REPLY</Text>
          </Section>

          <Section style={styles.section}>
            <Heading style={styles.h2}>Hi {customerName},</Heading>
            <Text style={styles.subject}>Re: {originalSubject}</Text>
            <Section style={styles.replyBox}>
              <Text style={styles.replyText}>{replyMessage}</Text>
            </Section>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.section}>
            <Text style={styles.text}>
              If you have any further questions, simply reply to this email.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
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
  h2: { color: '#E8E2D6', fontSize: '22px', fontWeight: 300, margin: '0 0 8px' },
  subject: { color: '#B7AFC3', fontSize: '13px', margin: '0 0 20px' },
  replyBox: { backgroundColor: '#1A1426', border: '1px solid rgba(230,201,121,0.15)', padding: '20px' },
  replyText: { color: '#E8E2D6', fontSize: '14px', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-line' as const },
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: 0 },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}