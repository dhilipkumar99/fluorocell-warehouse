import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Submission } from '@/models/Submission';

/**
 * GET handler for retrieving a specific submission by ID
 */
export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const submissionId = params.id;
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      );
    }
    
    // Get submission
    const submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns this submission or is an admin
    if (submission.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Get input files
    const inputFiles = await Submission.getFiles(submission, 'input');
    
    // Get output files if available
    let outputFiles = [];
    if (submission.outputFolderId) {
      outputFiles = await Submission.getFiles(submission, 'output');
    }
    
    return NextResponse.json({
      success: true,
      submission,
      inputFiles,
      outputFiles,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission details' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for updating a submission
 */
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const submissionId = params.id;
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      );
    }
    
    // Get existing submission
    const existingSubmission = await Submission.findById(submissionId);
    
    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Only allow updates by the owner or admin
    if (existingSubmission.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Only allow certain fields to be updated
    const allowedFields = ['title', 'description', 'status', 'outputFolderId'];
    const updates = {};
    
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = body[key];
      }
    });
    
    // Update submission
    const updatedSubmission = await Submission.update(submissionId, updates);
    
    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a submission
 */
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const submissionId = params.id;
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      );
    }
    
    // Get existing submission
    const existingSubmission = await Submission.findById(submissionId);
    
    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Only allow deletion by the owner or admin
    if (existingSubmission.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Delete submission record
    await db.submission.delete({
      where: { id: submissionId },
    });
    
    // Note: You may want to add code here to delete files from storage as well
    
    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}