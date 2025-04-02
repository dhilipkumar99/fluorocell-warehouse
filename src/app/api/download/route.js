import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getDownloadUrl, listFiles, createZipFromFiles } from '@/lib/storage';

export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const format = searchParams.get('format') || 'individual'; // 'individual' or 'zip'
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      );
    }
    
    // Get submission and verify ownership
    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
      },
    });
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    if (submission.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Verify submission has output files
    if (!submission.outputFolderId) {
      return NextResponse.json(
        { error: 'No output files available for this submission' },
        { status: 404 }
      );
    }
    
    // List all files in the output folder
    const files = await listFiles(submission.outputFolderId);
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No output files found' },
        { status: 404 }
      );
    }
    
    if (format === 'zip') {
      // Create a zip containing all files
      const zipFile = await createZipFromFiles(
        files,
        `fluorocell-output-${submissionId}.zip`
      );
      
      // Upload the zip file to storage temporarily
      const uploadedZip = await uploadFile(
        zipFile,
        `temp-downloads/${session.user.id}`
      );
      
      // Generate a download URL for the zip
      const downloadUrl = await getDownloadUrl(uploadedZip.url);
      
      return NextResponse.json({
        success: true,
        downloadUrl,
        filename: zipFile.name,
      });
    } else {
      // Generate download URLs for individual files
      const downloadUrls = await Promise.all(
        files.map(async (file) => {
          const url = await getDownloadUrl(file.url);
          return {
            url,
            filename: file.pathname.split('/').pop(),
            contentType: file.contentType,
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        files: downloadUrls,
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}