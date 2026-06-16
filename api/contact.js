const { Resend } = require('resend');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Retrieve and validate Resend API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured in environment variables.');
    return res.status(500).json({ error: 'Mail service configuration error: RESEND_API_KEY is missing' });
  }

  try {
    const resend = new Resend(apiKey);
    const { name, email, service, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Resend's default sender for unverified domains
      to: ['pineapple.apt26@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Requested:</strong> ${service || 'None specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

