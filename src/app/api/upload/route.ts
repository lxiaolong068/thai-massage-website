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
const SERVICES_DIR = path.join(UPLOAD_DIR, 'services');

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

    // Ensure service images directory exists
    if (!fs.existsSync(SERVICES_DIR)) {
      await fsPromises.mkdir(SERVICES_DIR, { recursive: true });
      console.log('Created services image directory:', SERVICES_DIR);
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
async function saveFileToDisk(file: File, type: 'therapist' | 'service' = 'therapist'): Promise<string> {
  // File extension
  const fileExt = path.extname(file.name).toLowerCase() || '.jpg';
  
  // Generate unique filename
  const uniqueFilename = `${uuidv4()}${fileExt}`;
  const uploadDir = type === 'therapist' ? THERAPISTS_DIR : SERVICES_DIR;
  const filePath = path.join(uploadDir, uniqueFilename);
  
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
    
    // Get public URL path
    const publicPath = type === 'therapist' 
      ? `/uploads/therapists/${uniqueFilename}`
      : `/uploads/services/${uniqueFilename}`;
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
    const type = formData.get('type') as 'therapist' | 'service' || 'therapist';
    
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
      uploadType: type
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
    const fileUrl = await saveFileToDisk(file, type);
    
    // List directory contents for debugging
    try {
      const files = await fsPromises.readdir(type === 'therapist' ? THERAPISTS_DIR : SERVICES_DIR);
      console.log(`Current files in ${type} upload directory:`, files);
    } catch (error) {
      console.error(`Error reading ${type} upload directory:`, error);
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
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error during file upload' }
      },
      { status: 500 }
    );
  }
} 