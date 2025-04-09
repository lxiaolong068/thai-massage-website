import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { TherapistStatus } from '@prisma/client';
import TherapistList from '@/components/TherapistList';

// Define types for processed data
type ProcessedTherapist = {
  id: string;
  imageUrl: string | null;
  experienceYears: number;
  workStatus: TherapistStatus;
  name: string;
  bio: string;
};

export default async function TherapistsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Get translations
  const t = await getTranslations('therapists');
  const commonT = await getTranslations('common');

  let therapists: ProcessedTherapist[] = [];
  try {
    const fetchedTherapists = await prisma.therapist.findMany({
      where: {
        workStatus: TherapistStatus.AVAILABLE,
      },
      include: {
        translations: {
          where: {
            locale: locale,
          },
          select: {
            locale: true,
            name: true,
            bio: true,
          },
        },
      },
    });

    // Process the fetched data
    therapists = fetchedTherapists.map((therapist): ProcessedTherapist => {
      const translation = therapist.translations.find(tr => tr.locale === locale);
      return {
        id: therapist.id,
        imageUrl: therapist.imageUrl,
        experienceYears: therapist.experienceYears,
        workStatus: therapist.workStatus,
        name: translation?.name ?? 'Name unavailable',
        bio: translation?.bio ?? 'Bio unavailable',
      };
    });
  } catch (error) {
    console.error("Failed to fetch therapists:", error);
    therapists = [];
  }

  // Prepare translations for client components
  const clientTranslations = {
    bookNow: commonT('buttons.bookNow'),
    bookingModalTitle: t('bookingModal.title'),
    therapistAltText: t('therapist'),
    title: t('title'),
    subtitle: t('subtitle'),
    noTherapists: t('noTherapists'),
    whyChoose: {
      title: t('whyChoose.title'),
      certified: {
        title: t('whyChoose.certified.title'),
        description: t('whyChoose.certified.description'),
      },
      personalized: {
        title: t('whyChoose.personalized.title'),
        description: t('whyChoose.personalized.description'),
      },
      punctual: {
        title: t('whyChoose.punctual.title'),
        description: t('whyChoose.punctual.description'),
      },
    },
  };

  return (
    <main className="pt-20">
      <TherapistList
        therapists={therapists}
        locale={locale}
        translations={clientTranslations}
      />
    </main>
  );
} 