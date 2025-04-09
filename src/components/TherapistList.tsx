'use client';

import { TherapistStatus } from '@prisma/client';
import TherapistCardWrapper from './TherapistCardWrapper';

type ProcessedTherapist = {
  id: string;
  imageUrl: string | null;
  experienceYears: number;
  workStatus: TherapistStatus;
  name: string;
  bio: string;
};

type Translations = {
  bookNow: string;
  bookingModalTitle: string;
  therapistAltText: string;
  title: string;
  subtitle: string;
  noTherapists: string;
  whyChoose: {
    title: string;
    certified: {
      title: string;
      description: string;
    };
    personalized: {
      title: string;
      description: string;
    };
    punctual: {
      title: string;
      description: string;
    };
  };
};

type Props = {
  therapists: ProcessedTherapist[];
  locale: string;
  translations: Translations;
};

export default function TherapistList({ therapists, locale, translations }: Props) {
  if (!therapists.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">{translations.noTherapists}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">{translations.title}</h1>
      <p className="text-xl text-gray-600 text-center mb-12">{translations.subtitle}</p>

      {/* Why Choose Us Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">{translations.whyChoose.title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{translations.whyChoose.certified.title}</h3>
            <p className="text-gray-600">{translations.whyChoose.certified.description}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{translations.whyChoose.personalized.title}</h3>
            <p className="text-gray-600">{translations.whyChoose.personalized.description}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{translations.whyChoose.punctual.title}</h3>
            <p className="text-gray-600">{translations.whyChoose.punctual.description}</p>
          </div>
        </div>
      </div>

      {/* Therapists Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {therapists.map((therapist) => (
          <TherapistCardWrapper
            key={therapist.id}
            therapist={therapist}
            locale={locale}
            translations={{
              bookNow: translations.bookNow,
              bookingModalTitle: translations.bookingModalTitle,
              therapistAltText: translations.therapistAltText,
            }}
          />
        ))}
      </div>
    </div>
  );
} 