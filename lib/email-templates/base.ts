// Email styling constants - shared across all templates
export const emailStyles = {
  container:
    "font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;",
  header: "background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 40px 30px; text-align: center;",
  headerLogo: "color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;",
  headerTagline: "color: #bae6fd; font-size: 14px; margin-top: 8px;",
  body: "padding: 40px 30px;",
  heading: "color: #0c4a6e; font-size: 24px; margin-bottom: 20px;",
  text: "color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;",
  highlight: "background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0;",
  button:
    "display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;",
  footer: "background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;",
  footerText: "color: #64748b; font-size: 14px; margin: 8px 0;",
  signature: "margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;",
}

// Company configuration
export const EMAIL_CONFIG = {
  COMPANY_EMAIL: "hello@valartravel.de",
  COMPANY_NAME: "Valar Travel",
  SUPPORT_PHONE: "+49 160 92527436",
  SITE_URL: "https://valartravel.de",
}

// Base email template wrapper
export function emailWrapper(content: string, preheader?: string): string {
  const { COMPANY_EMAIL, SUPPORT_PHONE, SITE_URL } = EMAIL_CONFIG
  const year = new Date().getFullYear()
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}</head><body style="margin: 0; padding: 20px; background-color: #f1f5f9;"><div style="${emailStyles.container}"><div style="${emailStyles.header}"><h1 style="${emailStyles.headerLogo}">Valar Travel</h1><p style="${emailStyles.headerTagline}">Luxury Caribbean Villa Experiences</p></div><div style="${emailStyles.body}">${content}<div style="${emailStyles.signature}"><p style="${emailStyles.text}">Warm regards,</p><p style="${emailStyles.text}"><strong>Sarah Kuhmichel</strong><br>Founder, Valar Travel<br><a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9;">${COMPANY_EMAIL}</a><br><a href="tel:${SUPPORT_PHONE}" style="color: #0ea5e9;">${SUPPORT_PHONE}</a></p></div></div><div style="${emailStyles.footer}"><p style="${emailStyles.footerText}">Valar Travel GmbH | Luxury Caribbean Villas</p><p style="${emailStyles.footerText}"><a href="${SITE_URL}" style="color: #0ea5e9; text-decoration: none;">Website</a> · <a href="https://wa.me/4916092527436" style="color: #0ea5e9; text-decoration: none;">WhatsApp</a> · <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9; text-decoration: none;">Email</a></p><p style="${emailStyles.footerText}; font-size: 12px; margin-top: 16px;">© ${year} Valar Travel. All rights reserved.</p></div></div></body></html>`
}

// Newsletter wrapper with unsubscribe link
export function newsletterWrapper(content: string, email: string, preheader?: string): string {
  const { COMPANY_EMAIL, SUPPORT_PHONE, SITE_URL } = EMAIL_CONFIG
  const year = new Date().getFullYear()
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}</head><body style="margin: 0; padding: 20px; background-color: #f1f5f9;"><div style="${emailStyles.container}"><div style="${emailStyles.header}"><h1 style="${emailStyles.headerLogo}">Valar Travel</h1><p style="${emailStyles.headerTagline}">Luxury Caribbean Villa Experiences</p></div><div style="${emailStyles.body}">${content}<div style="${emailStyles.signature}"><p style="${emailStyles.text}">Warm regards,</p><p style="${emailStyles.text}"><strong>Sarah Kuhmichel</strong><br>Founder, Valar Travel<br><a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9;">${COMPANY_EMAIL}</a><br><a href="tel:${SUPPORT_PHONE}" style="color: #0ea5e9;">${SUPPORT_PHONE}</a></p></div></div><div style="${emailStyles.footer}"><p style="${emailStyles.footerText}">Valar Travel GmbH | Luxury Caribbean Villas</p><p style="${emailStyles.footerText}"><a href="${SITE_URL}" style="color: #0ea5e9; text-decoration: none;">Website</a> · <a href="https://wa.me/4916092527436" style="color: #0ea5e9; text-decoration: none;">WhatsApp</a> · <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9; text-decoration: none;">Email</a></p><p style="${emailStyles.footerText}; font-size: 12px; margin-top: 16px;">© ${year} Valar Travel. All rights reserved.<br><a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe from newsletter</a></p></div></div></body></html>`
}
