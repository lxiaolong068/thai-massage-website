# Thai Massage Website

*[中文版本](README.md) | English Version*

This is a Thai massage service website built with Next.js 14 and Tailwind CSS. The website features an elegant design, responsive layout, and is optimized for SEO, making it perfect for showcasing Thai massage services and online booking.

## Features

- **Responsive Design**: Perfectly adapts to mobile, tablet, and desktop devices
- **Modern UI Design**: Beautiful interface with smooth user experience
- **Multilingual Support**: English, Chinese, and Korean interfaces
- **Rich Components**:
  - Dynamic carousel display
  - Service items and price lists
  - Professional massage therapist team introduction
  - Customer testimonials
  - Contact form and map integration
- **Multi-step Booking System**: User-friendly booking process
- **Form Validation**: Ensures valid user input data
- **SEO Optimization**: Metadata and structure optimized for search engines

## Technology Stack

- [Next.js 14](https://nextjs.org/) - React framework with server-side rendering and static generation
- [React 18](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript superset
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid custom designs
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization solution for Next.js
- [ESLint](https://eslint.org/) - Code quality tool for consistency
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager

## Detailed Project Structure

```
thai-massage/
├── public/                 # Static assets
│   └── images/             # Image resources
│       ├── slider-1.jpg    # Carousel images
│       ├── therapist-1.jpg # Therapist images
│       └── ...             # Other images
├── src/                    # Source code
│   ├── app/                # Next.js App Router
│   │   ├── [locale]/       # Internationalized routes
│   │   │   ├── page.tsx    # Multilingual home page
│   │   │   ├── about/      # About page
│   │   │   ├── services/   # Services page
│   │   │   ├── therapists/ # Therapists page
│   │   │   ├── contact/    # Contact page
│   │   │   └── book/       # Booking page
│   │   ├── globals.css     # Global styles
│   │   └── page.tsx        # Redirect to default language
│   ├── components/         # React components
│   │   ├── Header.tsx      # Header navigation component
│   │   ├── Footer.tsx      # Footer component
│   │   ├── Hero.tsx        # Hero carousel component
│   │   ├── About.tsx       # About us component
│   │   ├── Services.tsx    # Services and pricing component
│   │   ├── Therapists.tsx  # Massage therapist team component
│   │   ├── Testimonials.tsx# Customer testimonials component
│   │   ├── Contact.tsx     # Contact form component
│   │   ├── LanguageSwitcher.tsx # Language switcher component
│   │   └── ...             # Other components
│   ├── i18n/               # Internationalization files
│   │   ├── messages/       # Translation files
│   │   │   ├── en.json     # English translations
│   │   │   ├── zh.json     # Chinese translations
│   │   │   └── ko.json     # Korean translations
│   │   ├── i18n.ts         # i18n configuration
│   │   ├── client.ts       # Client-side i18n utilities
│   │   └── server.ts       # Server-side i18n utilities
│   └── styles/             # Other style files
├── scripts/                # Script files
│   ├── check-image-references.js  # Image reference checking script
│   ├── backup-unused-images.js    # Unused image backup script
│   ├── download-images.js  # Image download script
│   └── extract-translations.js # Translation extraction script
├── middleware.ts           # Next.js middleware (handles i18n routing)
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── .npmrc                  # pnpm configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Component Description

### 1. Home Page Component (`src/app/[locale]/page.tsx`)
The home page component integrates multiple sub-components, including carousel, service introduction, massage therapist team, etc.

### 2. Carousel Component (`src/components/Hero.tsx`)
Displays beautiful massage service images with automatic and manual carousel functionality.

### 3. Services Component (`src/components/Services.tsx`)
Displays various massage services, detailed descriptions, and pricing information.

### 4. Therapist Team Component (`src/components/Therapists.tsx`)
Displays information about professional massage therapists, their specialties, and experience.

### 5. Booking System (`src/app/[locale]/book/page.tsx`)
Multi-step booking form, including service selection, time selection, and personal information.

### 6. Language Switcher Component (`src/components/LanguageSwitcher.tsx`)
Allows users to switch between English, Chinese, and Korean language interfaces.

## Internationalization Implementation

This project uses `next-intl` for multilingual support with the following features:

### 1. Supported Languages
- English (en) - Default language
- Chinese (zh)
- Korean (ko)

### 2. Implementation Method
- Uses Next.js dynamic routing with `[locale]` parameter for multilingual routes
- Automatically detects user browser language settings via middleware
- Provides intuitive language switching functionality
- Stores translations in JSON format
- Provides appropriate SEO metadata for different language versions

### 3. Translation File Structure
Translation files are organized by functional areas and stored in the `src/i18n/messages/` directory:
```json
{
  "common": {
    "navigation": { ... },
    "buttons": { ... }
  },
  "home": { ... },
  "services": { ... },
  "about": { ... },
  "contact": { ... },
  "therapists": { ... },
  "booking": { ... }
}
```

## Utility Scripts

The project includes several utility scripts for managing image resources and project maintenance:

### 1. Check Image References (`scripts/check-image-references.js`)

This script checks image references in the project, helping to identify unused images and missing images.

```bash
node scripts/check-image-references.js
```

Features:
- Scans all image references in the source code
- Checks if referenced images exist
- Identifies unused image resources
- Creates placeholders for missing images

### 2. Backup Unused Images (`scripts/backup-unused-images.js`)

This script moves unused images to a backup directory, reducing project size while preserving these resources for future use.

```bash
node scripts/backup-unused-images.js
```

Features:
- Identifies images not referenced in the code
- Moves these images to the `public/images_backup` directory
- Preserves original filenames for easy restoration

### 3. Download Image Resources (`scripts/download-images.js`)

This script downloads image resources needed for the project from the web.

```bash
node scripts/download-images.js
```

Features:
- Downloads images from a predefined URL list
- Automatically saves to the `public/images` directory
- Skips existing images to avoid duplicate downloads

### 4. Extract Translations (`scripts/extract-translations.js`)

This script extracts text that needs to be translated from the source code and generates translation templates.

```bash
node scripts/extract-translations.js
```

Features:
- Scans all text that needs translation in the source code
- Generates translation template files
- Identifies missing translations

## Performance Optimization

- Using Next.js image optimization features
- Component lazy loading
- Code splitting
- Static generation and incremental static regeneration
- Custom Tailwind CSS components to reduce duplicate style classes
- Code optimization check tools to help identify and fix code issues
- Dynamic import of translation files to reduce initial loading time

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- pnpm package manager (recommended)

### Local Development

1. Clone the repository

```bash
git clone https://github.com/yourusername/thai-massage.git
cd thai-massage
```

2. Install dependencies

```bash
pnpm install
```

3. Run the development server

```bash
pnpm dev
```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
```

### Running in Production

```bash
pnpm start
```

## SEO Optimization

This project has been optimized for search engines with the following settings:

- **Semantic HTML**: Using appropriate HTML tag structure
- **Metadata Optimization**:
  - Adding appropriate titles and meta descriptions
  - Supporting Open Graph protocol for social media sharing
  - Adding canonical link tags
- **Multilingual SEO**:
  - Providing appropriate metadata for each language version
  - Using hreflang tags to indicate language relationships
- **Image Optimization**:
  - Using Next.js Image component to automatically optimize images
  - Adding appropriate alt text
- **Responsive Design**: Ensuring good user experience on all devices
- **Structured Data**: Adding JSON-LD structured data to enhance search result display

## Customization and Extension

You can customize the website by modifying the following files:

- `tailwind.config.js` - Customize colors, fonts, and other design variables
- `src/app/globals.css` - Add custom global styles
- `src/app/[locale]/layout.tsx` - Modify website metadata and layout
- `public/images/` - Replace image resources
- `src/i18n/messages/` - Modify or add translation texts

### Adding New Services

1. Add new service items in `src/components/Services.tsx`
2. Add corresponding images in the `public/images/` directory
3. Add corresponding translations in the translation files
4. If needed, update service options in the booking form

### Adding New Therapists

1. Add new therapist information in the `therapists` array in `src/components/Therapists.tsx`
2. Add corresponding translations in the translation files

### Adding New Languages

1. Add the new language code to the `locales` array in `src/i18n/config.ts`
2. Create a new language translation file in the `src/i18n/messages/` directory
3. Ensure all text that needs translation has corresponding translations

## Troubleshooting

### Common Issues

1. **Failed to Install Dependencies**
   - Make sure you're using Node.js 18.17.0 or higher
   - Try using `pnpm install --force`

2. **Images Not Displaying**
   - Check if the image paths are correct
   - Make sure images are downloaded to the `public/images/` directory

3. **Style Issues**
   - Ensure Tailwind CSS is correctly configured
   - Check if class names are correctly applied

4. **Internationalization Issues**
   - Check if translation files are complete
   - Ensure all components correctly use the translation API
   - Check if middleware configuration is correct

## Contributing

Contributions are welcome through issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)