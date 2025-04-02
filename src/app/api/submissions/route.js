import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Submission } from '@/models/Submission';

/**
 * GET handler for retrieving multiple submissions
 * Can be filtered by status, limited, or paginated
 */
export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : undefined;
    
    // Get submissions based on filters
    let submissions;
    if (status) {
      // Only get submissions with matching status if admin
      if (session.user.role === 'admin') {
        submissions = await Submission.findByStatus(status, { limit, offset, includeUser: true });
      } else {
        // Regular users can only see their own submissions with a specific status
        submissions = await db.submission.findMany({
          where: {
            userId: session.user.id,
            status,
          },
          orderBy: { createdAt: 'desc' },
          ...(limit ? { take: limit } : {}),
          ...(offset ? { skip: offset } : {}),
        });
      }
    } else {
      // Get user's submissions
      submissions = await Submission.findByUser(session.user.id, { limit, offset });
    }
    
    // Get total count for pagination
    const totalCount = await db.submission.count({
      where: {
        userId: session.user.id,
        ...(status ? { status } : {}),
      },
    });
    
    return NextResponse.json({
      submissions,
      count: submissions.length,
      total: totalCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new submission
 * This is an alternative to the upload route if needed for different submission creation flows
 */
export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, description, inputFolderId } = body;
    
    if (!title || !inputFolderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create submission
    const submission = await Submission.create({
      title,
      description,
      status: 'pending',
      inputFolderId,
      userId: session.user.id,
    });
    
    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}