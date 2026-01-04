# Campaign Onboarding - Standalone Next.js App

A beautiful, fully-featured campaign onboarding flow built with Next.js 15, React 19, TypeScript, and Tailwind CSS. This standalone application showcases a multi-step onboarding experience with AI-powered campaign generation for marketing teams.

## 🚀 Features

- **Multi-Step Onboarding Flow**: Login → Team Size → Feature Showcases → Campaign Generator → Results
- **AI Campaign Generation**: Mock AI that generates comprehensive marketing campaigns including:
  - Taglines and audience personas
  - Social media posts
  - Email campaigns
  - Google Search Ads
  - Meta (Facebook/Instagram) Feed Ads
- **Beautiful UI Components**: Built with Radix UI primitives and styled with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Type-Safe**: Fully typed with TypeScript
- **Modern Stack**: Next.js 15 with App Router and React 19

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.17 or higher
- **npm**: Version 9 or higher (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

## 🛠️ Installation

1. **Navigate to the project directory**:
```bash
cd campaign-onboarding-standalone
```

2. **Install dependencies**:
```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Radix UI components
- Tailwind CSS
- Lucide React icons
- TypeScript

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

### Linting

Run ESLint:

```bash
npm run lint
```

## 📁 Project Structure

```
campaign-onboarding-standalone/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind directives
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main campaign onboarding page
│   ├── components/
│   │   └── ui/                  # Reusable UI components
│   │       ├── button.tsx       # Button component
│   │       ├── card.tsx         # Card components
│   │       ├── input.tsx        # Input field
│   │       ├── label.tsx        # Form label
│   │       ├── textarea.tsx     # Text area
│   │       ├── progress.tsx     # Progress bar
│   │       ├── badge.tsx        # Badge component
│   │       ├── tabs.tsx         # Tabs navigation
│   │       └── radio-group.tsx  # Radio button group
│   └── lib/
│       └── utils.ts             # Utility functions (cn helper)
├── public/                       # Static assets
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: 120 60% 50%;        /* Primary brand color */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  /* ... other colors */
}
```

### Modifying the Flow

The onboarding flow is controlled by step states in `src/app/page.tsx`. You can:
- Add new steps by extending the step type union
- Remove steps by deleting the corresponding conditional blocks
- Reorder steps by changing the navigation handlers

### Customizing AI Generation

The mock AI generation function is located in `src/app/page.tsx`:

```typescript
const generateCampaign = async (data: CampaignData): Promise<GeneratedResult> => {
  // Replace with real API call to your AI service
  // ...
}
```

Replace the mock implementation with your actual AI service integration.

## 🧩 UI Components

This project uses a curated set of UI components built on top of Radix UI:

- **Button**: Flexible button component with variants (default, outline, ghost, link)
- **Card**: Container component for content sections
- **Input & Textarea**: Form input components
- **Label**: Form label component
- **Progress**: Progress bar with animation
- **Badge**: Status badge component
- **Tabs**: Tab navigation component
- **RadioGroup**: Radio button group for selections

All components are fully accessible and keyboard navigable.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm run dev
```

### Installation Issues

If you encounter installation issues:

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete `node_modules` and `package-lock.json`:
```bash
rm -rf node_modules package-lock.json
```

3. Reinstall:
```bash
npm install
```

### Build Errors

If you encounter build errors:

1. Check Node.js version (should be 18.17+)
2. Run type checking to identify issues:
```bash
npm run typecheck
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure everything
4. Deploy!

### Other Platforms

This Next.js app can be deployed to:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Digital Ocean App Platform**
- Any platform that supports Node.js

Build command: `npm run build`  
Start command: `npm start`  
Output directory: `.next`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips

- Use the browser's developer tools to inspect and customize components
- All components support className prop for easy styling extensions
- The app uses CSS variables for theming - easy to create light/dark modes
- Mock data is hardcoded - replace with real API calls for production use

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
