import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response';
import { withAdminApi } from '../../../middleware';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/lib/upload';

async function uploadQRCode(request: NextRequest) {
  try {
    const formData = await request.formData();
    const qrCode = formData.get('qrCode') as File;
    const type = formData.get('type') as string;

    if (!qrCode || !type) {
      return apiValidationError('QR code and type are required');
    }

    // 上传图片到存储服务
    const qrCodeUrl = await uploadImage(qrCode, 'qr-codes');

    // 查找或创建联系方式记录
    const contactMethod = await prisma.contactMethod.upsert({
      where: { type },
      update: { qrCode: qrCodeUrl },
      create: {
        type,
        qrCode: qrCodeUrl,
        isActive: true,
      },
    });

    return apiSuccess(contactMethod);
  } catch (error) {
    console.error('上传二维码出错:', error);
    return apiServerError('Failed to upload QR code');
  }
}

export const POST = withAdminApi(uploadQRCode); 