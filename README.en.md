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
│   └── download-images.js  # Image download script
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── .npmrc                  # pnpm configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Component Description

### 1. Home Component (`src/app/page.tsx`)
The home component integrates multiple sub-components, including carousel, service introduction, massage therapist team, etc.

### 2. Carousel Component (`src/components/Hero.tsx`)
Displays beautiful massage service images with automatic carousel and manual switching.

### 3. Services Component (`src/components/Services.tsx`)
Displays various massage services, detailed descriptions, and pricing information.

### 4. Therapist Team Component (`src/components/Therapists.tsx`)
Displays information about professional massage therapists, their specialties, and experience.

### 5. Booking System (`src/app/book/page.tsx`)
Multi-step booking form, including service selection, time selection, and personal information.

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

### Build for Production

```bash
pnpm build
```

### Run Production Version

```bash
pnpm start
```

## Vercel Deployment Guide

Vercel is the best platform for deploying Next.js applications, offering seamless integration and automatic deployment.

### Deployment Steps

1. **Create a Vercel Account**
   - Visit [Vercel website](https://vercel.com/) and register an account
   - You can log in directly with your GitHub, GitLab, or Bitbucket account

2. **Import Project**
   - Click "Import Project" in the Vercel console
   - Select "Import Git Repository"
   - Authorize Vercel to access your GitHub/GitLab/Bitbucket account
   - Select the thai-massage repository

3. **Configure Project**
   - Project name: Enter your desired project name, such as "thai-massage"
   - Framework preset: Vercel will automatically detect Next.js
   - Build command: Keep the default (`next build`)
   - Output directory: Keep the default (`.next`)
   - Environment variables: Add if needed

4. **Deploy Project**
   - Click the "Deploy" button
   - Vercel will automatically build and deploy your project
   - After deployment, you'll get a URL like `https://your-project-name.vercel.app`

5. **Custom Domain** (Optional)
   - Click "Domains" in the project settings
   - Add your custom domain
   - Follow Vercel's instructions to configure DNS records

### Continuous Deployment

Vercel supports continuous deployment, automatically rebuilding and deploying your project whenever you push changes to your Git repository.

- **Preview Deployments**: When you create a Pull Request, Vercel automatically creates a preview deployment
- **Production Deployments**: When you merge to the main branch, Vercel automatically updates the production environment

### Monitoring and Analytics

Vercel provides built-in monitoring and analytics tools:

- **Analytics**: View website traffic and performance metrics
- **Logs**: View deployment and runtime logs
- **Speed Insights**: Analyze website loading speed and performance

## SEO Optimization

This project has been optimized for search engines with the following settings:

- **Semantic HTML**: Using appropriate HTML tag structure
- **Metadata Optimization**:
  - Adding appropriate title and meta descriptions
  - Supporting Open Graph protocol for social media sharing
  - Adding canonical link tags
- **Image Optimization**:
  - Using Next.js Image component to automatically optimize images
  - Adding appropriate alt text
- **Responsive Design**: Ensuring good user experience on all devices
- **Structured Data**: Adding JSON-LD structured data to improve search result display

## Customization and Extension

You can customize the website by modifying the following files:

- `tailwind.config.js` - Customize colors, fonts, and other design variables
- `src/app/globals.css` - Add custom global styles
- `src/app/layout.tsx` - Modify website metadata and layout
- `public/images/` - Replace image resources

### Adding New Services

1. Add new service items in `src/components/Services.tsx`
2. Add corresponding images in the `public/images/` directory
3. Update service options in the booking form if needed

### Adding New Therapists

Add new therapist information in the `therapists` array in the `src/components/Therapists.tsx` file.

## Performance Optimization

- Using Next.js image optimization features
- Component lazy loading
- Code splitting
- Static generation and incremental static regeneration

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