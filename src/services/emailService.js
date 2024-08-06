const nodemailer = require('nodemailer');
const logger = require('./../config/logger');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});
if (process.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    );
}

const sendEmail = async (options) => {
  const msg = {
    from: process.env.EMAIL_FROM,
    to: options?.to,
    subject: options?.subject,
    text: options?.text,
    html: options?.html,
    attachments: options.attachments,
  };
  await transport.sendMail(msg);
};

const sendOnboardingEmail = async (to, name) => {
  const subject = 'Welcome to Twitee!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Twitee!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f8fa;
                color: #14171a;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: 0 auto;
            }
            h1 {
                color: #1da1f2;
            }
            p {
                line-height: 1.5;
            }
            a {
                color: #1da1f2;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                background-color: #1da1f2;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
            }
            .button:hover {
                background-color: #0a85d9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Twitee!</h1>
            <p>Hi ${name},</p>
            <p>Welcome to the Twitee community! We're excited to have you on board. Here’s a quick guide to help you get started and make the most out of your Twitee experience.</p>
            
            <h2>1. Complete Your Profile</h2>
            <ul>
                <li><strong>Add a profile picture</strong>: A great photo makes it easier for people to recognize you.</li>
                <li><strong>Write a bio</strong>: Share a bit about yourself. You have 160 characters, so make them count!</li>
                <li><strong>Follow interests</strong>: Select topics and accounts you’re interested in to get personalized recommendations.</li>
            </ul>
            
            <h2>2. Twit Your First Post</h2>
            <p>Your followers are waiting! Share your thoughts, a quote, a photo, or anything you'd like. Just click the 'Twit' button and you're ready to go.</p>
            
            <h2>3. Connect with Others</h2>
            <p>Follow friends, colleagues, and interesting people. The more accounts you follow, the more interesting your timeline will be.</p>
            
            <h2>4. Explore Trends</h2>
            <p>Stay updated with what’s happening in the world by exploring the trending topics. Click on the ‘Explore’ tab to see what’s hot right now.</p>
            
            <h2>5. Engage and Have Fun</h2>
            <p>Reply to twits, join conversations, and use hashtags to reach a broader audience. Twitee is all about connecting and sharing in real-time.</p>
            
            <p>If you need any help, our support team is always here for you. Just visit our Help Center for FAQs and assistance.</p>
            
            <p>Thanks for joining Twitee. We can't wait to see what you'll share!</p>
            
            <p>Best,<br>The Twitee Team</p>
        </div>
    </body>
    </html>
    `;

  await sendEmail({ to, subject, html });
};

module.exports = {
  transport,
  sendEmail,
  sendOnboardingEmail,
};
