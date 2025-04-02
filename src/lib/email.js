import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

/**
 * Creates a Microsoft Graph client for sending emails
 * @returns {Client} Microsoft Graph client
 */
function createGraphClient() {
  // Read credentials from environment variables
  const clientId = process.env.MS_GRAPH_CLIENT_ID;
  const tenantId = process.env.MS_GRAPH_TENANT_ID;
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET;

  if (!clientId || !tenantId || !clientSecret) {
    throw new Error('Microsoft Graph credentials are not properly configured');
  }

  // Create the credential
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  
  // Create the auth provider
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
  });

  // Create and return the Graph client
  return Client.initWithMiddleware({
    authProvider
  });
}

/**
 * Send an email notification via Microsoft Graph API
 * @param {Object} options Email options
 * @param {string} options.to Recipient email
 * @param {string} options.subject Email subject
 * @param {string} options.body Email body (HTML allowed)
 * @returns {Promise<Object>} Result of the email send operation
 */
export async function sendEmail({ to, subject, body }) {
  try {
    const client = createGraphClient();
    const senderEmail = process.env.MS_GRAPH_SENDER_EMAIL || 'dhilip@fluorocell.ai';

    const email = {
      message: {
        subject,
        body: {
          contentType: 'HTML',
          content: body
        },
        toRecipients: [
          {
            emailAddress: {
              address: to
            }
          }
        ]
      },
      saveToSentItems: true
    };

    // Send the email
    return await client.api(`/users/${senderEmail}/sendMail`)
      .post(email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send a notification about a new submission
 * @param {Object} submission The submission details
 * @param {string} userEmail The user's email address
 * @returns {Promise<void>}
 */
export async function sendSubmissionNotification(submission, userEmail) {
  const subject = `Fluorocell Warehouse: New Submission Received (ID: ${submission.id})`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Fluorocell Warehouse - Submission Received</h2>
      <p>We've received your submission. It's been added to our processing queue.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Submission Details</h3>
        <p><strong>Title:</strong> ${submission.title}</p>
        <p><strong>ID:</strong> ${submission.id}</p>
        <p><strong>Status:</strong> ${submission.status}</p>
        <p><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString()}</p>
      </div>
      
      <p>You'll receive another notification when your results are ready for download.</p>
      <p>You can also check the status of your submission at any time by visiting your dashboard at <a href="https://fluorocell-warehouse.vercel.app/dashboard">https://fluorocell-warehouse.vercel.app/dashboard</a>.</p>
      
      <p style="color: #6b7280; font-size: 0.9em; margin-top: 30px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;
  
  return sendEmail({
    to: userEmail,
    subject,
    body
  });
}

/**
 * Send a notification when processing is complete
 * @param {Object} submission The submission details
 * @param {string} userEmail The user's email address
 * @returns {Promise<void>}
 */
export async function sendProcessingCompleteNotification(submission, userEmail) {
  const subject = `Fluorocell Warehouse: Results Ready (ID: ${submission.id})`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Fluorocell Warehouse - Processing Complete</h2>
      <p>Great news! Your submission has been successfully processed and your results are ready.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Submission Details</h3>
        <p><strong>Title:</strong> ${submission.title}</p>
        <p><strong>ID:</strong> ${submission.id}</p>
        <p><strong>Status:</strong> ${submission.status}</p>
        <p><strong>Completed:</strong> ${new Date(submission.updatedAt).toLocaleString()}</p>
      </div>
      
      <p>
        <a href="https://fluorocell-warehouse.vercel.app/submissions/${submission.id}" style="background-color: #22c55e; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 15px;">
          View & Download Results
        </a>
      </p>
      
      <p style="color: #6b7280; font-size: 0.9em; margin-top: 30px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;
  
  return sendEmail({
    to: userEmail,
    subject,
    body
  });
}