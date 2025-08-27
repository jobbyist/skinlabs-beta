import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendTrialExpirationNotification(email: string, daysLeft: number): Promise<boolean> {
  const subject = `Your SKYNN Premium Trial expires in ${daysLeft} days`;
  const html = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: linear-gradient(135deg, #ef4444, #f87171); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 0;">SKYNN by SkinLabs</h1>
        <p style="color: white; opacity: 0.9; margin: 8px 0 0 0;">South Africa's Trusted Skincare Platform</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin-bottom: 20px;">Your Premium Trial is Ending Soon</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Hi there! Your SKYNN Premium trial expires in <strong>${daysLeft} days</strong>. 
        </p>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Don't miss out on:
        </p>
        
        <ul style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px; padding-left: 20px;">
          <li>Unlimited access to premium skincare guides</li>
          <li>Personalized skincare routine recommendations</li>
          <li>Exclusive deals from South African brands</li>
          <li>Advanced ingredient analysis tools</li>
        </ul>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'your-domain.replit.app'}/subscription" 
             style="background: linear-gradient(135deg, #ef4444, #f87171); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Subscribe to Premium - R149/year
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
          Questions? Reply to this email or contact us at hello@skinlabs.co.za
        </p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} SKYNN by SkinLabs. Cape Town, South Africa
        </p>
      </div>
    </div>
  `;
  
  const text = `
    Your SKYNN Premium Trial expires in ${daysLeft} days
    
    Don't miss out on unlimited access to premium skincare guides, personalized routine recommendations, exclusive deals, and advanced ingredient analysis.
    
    Subscribe to Premium for only R149/year: https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'your-domain.replit.app'}/subscription
    
    Questions? Contact us at hello@skinlabs.co.za
  `;

  return await sendEmail({
    to: email,
    from: 'hello@skinlabs.co.za',
    subject,
    text,
    html
  });
}