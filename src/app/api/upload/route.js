import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { uploadFile } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get form data with files
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const files = formData.getAll('files');
    
    if (!title || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create folder IDs for input and output
    const inputFolderId = `submissions/${session.user.id}/${uuidv4()}`;
    
    // Upload files to storage
    const uploadPromises = files.map(file => uploadFile(file, inputFolderId));
    const uploadedFiles = await Promise.all(uploadPromises);
    
    // Create submission record in database
    const submission = await db.submission.create({
      data: {
        title,
        description,
        status: 'pending',
        inputFolderId,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({
      success: true,
      submission,
      files: uploadedFiles,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}