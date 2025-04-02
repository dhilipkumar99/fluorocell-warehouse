import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  sendSubmissionNotification, 
  sendProcessingCompleteNotification 
} from '@/lib/email';

/**
 * API route for sending email notifications about submissions
 * Handles different notification types (new submission, processing complete, etc.)
 */
export async function POST(request) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { submissionId, type } = await request.json();
    
    if (!submissionId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get submission details with user data
    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        user: true, // Include user to get their email
      },
    });
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Check permission - only the owner or admins can send notifications
    if (submission.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
    
    // Send appropriate notification based on type
    switch (type) {
      case 'new':
        await sendSubmissionNotification(submission, submission.user.email);
        break;
        
      case 'complete':
        await sendProcessingCompleteNotification(submission, submission.user.email);
        break;
        
      case 'failed':
        // You can implement a failed processing notification here
        return NextResponse.json(
          { error: 'Notification type not implemented' },
          { status: 501 }
        );
        
      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: `${type} notification sent to ${submission.user.email}`,
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send email notification', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET route to check notification status or types
 * Could be used to get available notification types or check sending capabilities
 */
export async function GET(request) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Return available notification types
    return NextResponse.json({
      available: true,
      notificationTypes: [
        { id: 'new', description: 'New submission received' },
        { id: 'complete', description: 'Processing completed' },
        // Add more notification types as implemented
      ]
    });
  } catch (error) {
    console.error('Error checking email service:', error);
    return NextResponse.json(
      { error: 'Failed to check email service status' },
      { status: 500 }
    );
  }
}