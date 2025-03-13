import { useTranslations } from 'next-intl';
import BookingForm from '@/components/BookingForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment',
  description: 'Book your Thai massage appointment with our professional therapists',
};

export default function BookPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = useTranslations('booking');
  
  // 从URL参数中获取按摩师信息
  const therapistId = searchParams.therapistId as string;
  const therapistName = searchParams.therapistName as string;
  
  return (
    <main className="pt-20">
      <div className="container mx-auto py-12 px-4">
        <BookingForm initialTherapistId={therapistId} initialTherapistName={therapistName} />
      </div>
    </main>
  );
} 