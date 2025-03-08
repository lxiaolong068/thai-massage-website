# Thai Massage Website

*[中文版本](README.md) | English Version*

This is a Thai massage service website built with Next.js 14 and Tailwind CSS. The website features an elegant design, responsive layout, and is optimized for SEO, making it perfect for showcasing Thai massage services and online booking.

## Features

- **Responsive Design**: Perfectly adapts to mobile, tablet, and desktop devices
- **Modern UI Design**: Beautiful interface with smooth user experience
- **Multilingual Support**: Chinese and English interfaces
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
│   │   ├── book/           # Booking page
│   │   │   └── page.tsx    # Booking page component
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── Header.tsx      # Header navigation component
│   │   ├── Footer.tsx      # Footer component
│   │   ├── Hero.tsx        # Hero carousel component
│   │   ├── About.tsx       # About us component
│   │   ├── Services.tsx    # Services and pricing component
│   │   ├── Therapists.tsx  # Massage therapist team component
│   │   ├── Testimonials.tsx# Customer testimonials component
│   │   ├── Contact.tsx     # Contact form component
│   │   └── ...             # Other components
│   └── styles/             # Other style files
├── scripts/                # Script files
│   ├── check-image-references.js  # Image reference checking script
│   ├── backup-unused-images.js    # Unused image backup script
│   └── download-images.js  # Image download script
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── .npmrc                  # pnpm configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Component Description

### 1. Home Page Component (`src/app/page.tsx`)
The home page component integrates multiple sub-components, including carousel, service introduction, massage therapist team, etc.

### 2. Carousel Component (`src/components/Hero.tsx`)
Displays beautiful massage service images with automatic and manual carousel functionality.

### 3. Services Component (`src/components/Services.tsx`)
Displays various massage services, detailed descriptions, and pricing information.

### 4. Therapist Team Component (`src/components/Therapists.tsx`)
Displays information about professional massage therapists, their specialties, and experience.

### 5. Booking System (`src/app/book/page.tsx`)
Multi-step booking form, including service selection, time selection, and personal information.

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

### 4. Code Optimization Check (`scripts/optimize-code.js`)

This script checks and optimizes code quality in the project, helping to identify potential issues and improvement opportunities.

```bash
node scripts/optimize-code.js
```

Features:
- Checks for unused imports and variables
- Identifies duplicate style class combinations
- Detects oversized component files
- Discovers unused components
- Provides code optimization suggestions

## Performance Optimization

- Using Next.js image optimization features
- Component lazy loading
- Code splitting
- Static generation and incremental static regeneration
- Custom Tailwind CSS components to reduce duplicate style classes
- Code optimization check tools to help identify and fix code issues

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

## Contributing

Contributions are welcome through issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)