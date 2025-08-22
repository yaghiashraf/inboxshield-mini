import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, domain, reportData, pdfBuffer } = JSON.parse(event.body || '{}');

    if (!email || !domain || !reportData) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Email, domain, and report data are required' }),
      };
    }

    console.log(`Sending report email to: ${email} for domain: ${domain}`);

    // For now, we'll create a simple email template and log it
    // In production, you'd integrate with SendGrid, Mailgun, or similar service
    
    const emailHTML = generateEmailTemplate(domain, reportData);
    
    // Here you would integrate with your email service
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL || 'reports@inboxshield.com',
      subject: `Your InboxShield Report for ${domain}`,
      html: emailHTML,
      attachments: pdfBuffer ? [{
        content: pdfBuffer,
        filename: `inboxshield-${domain}-report.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }] : []
    };
    
    await sgMail.send(msg);
    */

    // For now, just log the email content
    console.log('Email would be sent with content:', {
      to: email,
      subject: `Your InboxShield Report for ${domain}`,
      html: emailHTML.substring(0, 200) + '...',
      attachments: pdfBuffer ? 1 : 0
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Report email prepared (email service integration needed for actual sending)',
        emailPreview: emailHTML.substring(0, 500) + '...'
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

function generateEmailTemplate(domain: string, reportData: any): string {
  const criticalIssues = reportData.dnsFixesGenerated?.filter((fix: any) => fix.priority === 'HIGH').length || 0;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your InboxShield Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .critical { background: #fef2f2; border-left-color: #ef4444; }
        .medium { background: #fefbf2; border-left-color: #f59e0b; }
        .good { background: #f0f9ff; border-left-color: #10b981; }
        .dns-record { background: #f1f5f9; padding: 12px; font-family: monospace; border-radius: 4px; margin: 8px 0; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Your InboxShield Report is Ready!</h1>
            <p>Complete Email Security Analysis for <strong>${domain}</strong></p>
        </div>
        
        <div class="content">
            <div class="score-box ${reportData.overallScore >= 80 ? 'good' : reportData.overallScore >= 60 ? 'medium' : 'critical'}">
                <h2>Security Score: ${reportData.overallScore}/100</h2>
                <p>
                    ${criticalIssues > 0 
                      ? `⚠️ <strong>${criticalIssues} critical issues</strong> found that need immediate attention.` 
                      : '✅ Your email security is in good shape!'
                    }
                </p>
            </div>
            
            <h3>📋 What's in Your Report:</h3>
            <ul>
                <li><strong>Complete DNS Analysis</strong> - SPF, DKIM, DMARC, BIMI, MTA-STS</li>
                <li><strong>Copy-Paste DNS Fixes</strong> - Ready to implement</li>
                <li><strong>Provider Instructions</strong> - GoDaddy, Cloudflare, Namecheap setup guides</li>
                <li><strong>Business Impact Analysis</strong> - Understand the cost of email issues</li>
                <li><strong>Verification Steps</strong> - How to test your fixes</li>
            </ul>
            
            ${reportData.dnsFixesGenerated && reportData.dnsFixesGenerated.length > 0 ? `
            <h3>🔧 Quick Preview - Priority Fixes:</h3>
            ${reportData.dnsFixesGenerated.slice(0, 2).map((fix: any) => `
                <div class="dns-record">
                    <strong>${fix.type} Record</strong> (${fix.priority} Priority)<br>
                    <small>Add this to your DNS: ${fix.record.substring(0, 60)}${fix.record.length > 60 ? '...' : ''}</small>
                </div>
            `).join('')}
            ` : ''}
            
            <h3>📈 Expected Results:</h3>
            <p>After implementing these fixes, you can expect:</p>
            <ul>
                <li>📧 <strong>95%+ inbox delivery rate</strong> (vs current ~${reportData.businessImpact?.estimatedDeliverabilityRate || 'unknown'})</li>
                <li>🛡️ <strong>Protection against domain spoofing</strong> and phishing</li>
                <li>📊 <strong>Better email analytics</strong> and sender reputation</li>
                <li>💼 <strong>Professional brand credibility</strong></li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="btn">Download Full Report (PDF)</a>
                <p><small>The PDF report contains complete implementation instructions and verification steps.</small></p>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>🆘 Need Help?</h4>
                <p>If you have questions about implementing these fixes or need technical assistance:</p>
                <p>📧 Email: <a href="mailto:support@inboxshield.com">support@inboxshield.com</a></p>
                <p>We're here to ensure your email deliverability improves!</p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="text-align: center; color: #64748b; font-size: 14px;">
                This report was generated on ${new Date().toLocaleDateString()} for ${domain}<br>
                Report ID: ${reportData.reportId}<br>
                <a href="https://inboxshield.com">InboxShield Mini</a> - Professional Email Security
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}