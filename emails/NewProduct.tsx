import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link, Img,
} from '@react-email/components'

type Props = {
  productName: string
  productDescription: string
  productPrice: string
  productImage: string
  productUrl: string
}

export default function NewProduct({
  productName = 'Empire Oversized Tee',
  productDescription = 'Heavyweight oversized tee with mythic crest placement.',
  productPrice = '₹1,299',
  productImage = 'https://albaeon.com/placeholder.png',
  productUrl = 'https://albaeon.com/shop',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New arrival: {productName} — Albaeon</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>ALBAEON</Heading>
            <Text style={styles.headerSub}>NEW ARRIVAL</Text>
          </Section>

          <Section style={styles.section}>
            <Heading style={styles.h2}>{productName}</Heading>
            <Text style={styles.price}>{productPrice}</Text>
            <Text style={styles.text}>{productDescription}</Text>
          </Section>

          {productImage && (
            <Section style={styles.imageSection}>
              <Img
                src={productImage}
                alt={productName}
                width="520"
                style={styles.image}
              />
            </Section>
          )}

          <Section style={styles.ctaSection}>
            <Link href={productUrl} style={styles.cta}>
              SHOP NOW
            </Link>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              You are receiving this because you have an Albaeon account.
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://albaeon.com/account" style={styles.footerLink}>
                Manage preferences
              </Link>
              {' · '}
              <Link href="https://albaeon.com/shop" style={styles.footerLink}>
                View all products
              </Link>
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
  h2: { color: '#E8E2D6', fontSize: '24px', fontWeight: 300, margin: '0 0 8px' },
  price: { color: '#E6C979', fontSize: '18px', margin: '0 0 12px' },
  text: { color: '#B7AFC3', fontSize: '14px', lineHeight: '1.7', margin: 0 },
  imageSection: { padding: '16px 0' },
  image: { width: '100%', maxWidth: '520px', display: 'block' },
  ctaSection: { textAlign: 'center' as const, padding: '28px 0' },
  cta: { backgroundColor: '#E6C979', color: '#130F18', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' },
  hr: { borderColor: 'rgba(230,201,121,0.15)', margin: '4px 0' },
  footer: { textAlign: 'center' as const, paddingTop: '20px' },
  footerText: { color: '#B7AFC3', fontSize: '12px', margin: '4px 0' },
  footerLink: { color: '#E6C979' },
}