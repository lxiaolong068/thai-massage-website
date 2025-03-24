import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Set dynamic response to prevent caching
export const dynamic = 'force-dynamic';

// Upload directories
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const THERAPISTS_DIR = path.join(UPLOAD_DIR, 'therapists');

// Ensure upload directories exist
async function ensureDirectoriesExist() {
  try {
    // Ensure upload root directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      await fsPromises.mkdir(UPLOAD_DIR, { recursive: true });
      console.log('Created upload root directory:', UPLOAD_DIR);
    }
    
    // Ensure therapist images directory exists
    if (!fs.existsSync(THERAPISTS_DIR)) {
      await fsPromises.mkdir(THERAPISTS_DIR, { recursive: true });
      console.log('Created therapists image directory:', THERAPISTS_DIR);
    }
  } catch (error) {
    console.error('Error creating directories:', error);
    throw new Error('Failed to create upload directories');
  }
}

// Check if file is an image
function isImageFile(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  return allowedTypes.includes(file.type);
}

// Write file to disk and return access URL
async function saveFileToDisk(file: File): Promise<string> {
  // File extension
  const fileExt = path.extname(file.name).toLowerCase() || '.jpg';
  
  // Generate unique filename
  const uniqueFilename = `${uuidv4()}${fileExt}`;
  const filePath = path.join(THERAPISTS_DIR, uniqueFilename);
  
  try {
    // Read file content
    const buffer = await file.arrayBuffer();
    
    // Write file to disk
    await fsPromises.writeFile(filePath, Buffer.from(buffer));
    
    // Verify file was written successfully
    const fileStats = await fsPromises.stat(filePath);
    
    if (fileStats.size === 0) {
      throw new Error('File save failed, written file size is 0');
    }
    
    console.log(`File successfully saved to: ${filePath}, size: ${fileStats.size} bytes`);
    
    // Get public URL path (this is crucial - we're returing a URL format that works in Next.js)
    const publicPath = `/uploads/therapists/${uniqueFilename}`;
    console.log('Public URL path:', publicPath);
    
    // Verify the file is accessible
    const fullPublicPath = path.join(process.cwd(), 'public', publicPath);
    if (fs.existsSync(fullPublicPath)) {
      console.log('File is accessible at path:', fullPublicPath);
    } else {
      console.error('File not accessible at expected path:', fullPublicPath);
    }
    
    return publicPath;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

// Handle file upload request
export async function POST(request: NextRequest) {
  console.log('Received file upload request');
  
  try {
    // Ensure directories exist
    await ensureDirectoriesExist();
    
    // Check if request contains file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file found in request');
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Please provide a file to upload' }
        },
        { status: 400 }
      );
    }
    
    // Print file info for debugging
    console.log('Received file:', {
      filename: file.name,
      type: file.type,
      size: file.size,
    });
    
    // Validate file type
    if (!isImageFile(file)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Only image files are allowed (JPEG, PNG, GIF, WebP, SVG)' }
        },
        { status: 400 }
      );
    }
    
    // Validate file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      console.error('File too large:', file.size);
      return NextResponse.json(
        {
          success: false,
          error: { message: 'File size cannot exceed 5MB' }
        },
        { status: 400 }
      );
    }
    
    // Save file and get URL
    const fileUrl = await saveFileToDisk(file);
    
    // List directory contents for debugging
    try {
      const files = await fsPromises.readdir(THERAPISTS_DIR);
      console.log('Current files in upload directory:', files);
    } catch (error) {
      console.error('Error reading upload directory:', error);
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }
    });
  } catch (error) {
    // Log error
    console.error('Error during file upload:', error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'File upload failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
} 