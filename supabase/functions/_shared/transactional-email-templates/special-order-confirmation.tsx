import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Autowurx'

interface SpecialOrderConfirmationProps {
  fullName?: string
  makeModel?: string
  yearRange?: string
  color?: string
  budget?: string
  paymentMethod?: string
  orderId?: string
}

const SpecialOrderConfirmationEmail = ({
  fullName,
  makeModel,
  yearRange,
  color,
  budget,
  paymentMethod,
  orderId,
}: SpecialOrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your special vehicle order is confirmed at {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={brandTag}>SPECIAL ORDERS</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            {fullName ? `Thanks, ${fullName}!` : 'Thanks for your order!'}
          </Heading>
          <Text style={text}>
            We've received your special vehicle order along with your $500
            deposit. Our team is now searching for the perfect match and will
            be in touch within <strong>3-14 days</strong>.
          </Text>

          <Section style={detailsBox}>
            <Text style={detailsTitle}>ORDER DETAILS</Text>
            {orderId && (
              <Text style={detailRow}>
                <strong>Order ID:</strong> {orderId}
              </Text>
            )}
            {makeModel && (
              <Text style={detailRow}>
                <strong>Vehicle:</strong> {makeModel}
              </Text>
            )}
            {yearRange && (
              <Text style={detailRow}>
                <strong>Year range:</strong> {yearRange}
              </Text>
            )}
            {color && (
              <Text style={detailRow}>
                <strong>Color:</strong> {color}
              </Text>
            )}
            {budget && (
              <Text style={detailRow}>
                <strong>Budget:</strong> {budget}
              </Text>
            )}
            {paymentMethod && (
              <Text style={detailRow}>
                <strong>Payment method:</strong> {paymentMethod}
              </Text>
            )}
            <Text style={detailRow}>
              <strong>Deposit:</strong> $500.00 (received)
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>What happens next?</Heading>
          <Text style={text}>
            1. Our sourcing team starts the hunt within 24 hours.
          </Text>
          <Text style={text}>
            2. We'll send you matches as we find them — you have full approval.
          </Text>
          <Text style={text}>
            3. Once you choose, we coordinate inspection, paperwork, and delivery.
          </Text>

          <Text style={footer}>
            Questions? Just reply to this email and our team will get back to
            you. Thanks for trusting {SITE_NAME}.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SpecialOrderConfirmationEmail,
  subject: 'Your Autowurx Special Order is Confirmed',
  displayName: 'Special order confirmation',
  previewData: {
    fullName: 'Jane Doe',
    makeModel: '2022 Ford Bronco',
    yearRange: '2021-2023',
    color: 'Cactus Gray',
    budget: '$45,000-$55,000',
    paymentMethod: 'Preapproved Financing',
    orderId: 'ord_abc123',
  },
} satisfies TemplateEntry

// Styles — body must be white per platform rules
const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'DM Sans', Arial, sans-serif",
  margin: '0',
  padding: '0',
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '0',
}
const header = {
  backgroundColor: '#1a1a1a',
  padding: '28px 32px',
  textAlign: 'center' as const,
}
const brand = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#FFD700',
  margin: '0',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
}
const brandTag = {
  fontSize: '11px',
  color: '#ffffff',
  letterSpacing: '0.2em',
  margin: '4px 0 0',
  textTransform: 'uppercase' as const,
}
const content = {
  padding: '32px 32px 16px',
}
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '0 0 16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
}
const h2 = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '8px 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
}
const text = {
  fontSize: '15px',
  color: '#3a3a3a',
  lineHeight: '1.6',
  margin: '0 0 12px',
}
const detailsBox = {
  backgroundColor: '#fafafa',
  border: '1px solid #e5e5e5',
  borderLeft: '4px solid #FFD700',
  padding: '20px',
  margin: '20px 0',
  borderRadius: '4px',
}
const detailsTitle = {
  fontSize: '11px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  letterSpacing: '0.15em',
  margin: '0 0 12px',
}
const detailRow = {
  fontSize: '14px',
  color: '#3a3a3a',
  margin: '0 0 6px',
  lineHeight: '1.5',
}
const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
}
const footer = {
  fontSize: '13px',
  color: '#777777',
  margin: '24px 0 0',
  lineHeight: '1.6',
}
