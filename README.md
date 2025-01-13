# Crypto Swap Demo

A demonstration project showcasing a cryptocurrency swapping interface built with Next.js. This project serves as a learning resource for understanding how to build modern web applications for crypto trading and DeFi interactions.

![Crypto Swap Interface](screenshot.png)

## Features

- 🔄 Real-time cryptocurrency swapping interface
- 💱 Support for multiple cryptocurrencies
- 📊 Dynamic price updates
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔧 TypeScript for enhanced type safety
- 📱 Mobile-friendly design

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API Integration**: Built-in Next.js API routes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/perception30/nextjs-crypto-swap.git
cd crypto-swap
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
crypto-swap/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Main page component
│   ├── components/         # Reusable React components
│   │   ├── CryptoSelect.tsx
│   │   └── SwapForm.tsx
│   ├── services/          # External services and API calls
│   │   └── crypto.ts
│   └── types/            # TypeScript type definitions
│       └── crypto.ts
├── public/              # Static assets
└── ...config files     # Various configuration files
```

## Learning Resources

This project demonstrates several key concepts in modern web development:

- Next.js App Router and API routes
- TypeScript integration in React applications
- Component composition and state management
- API integration and data fetching
- Responsive design with Tailwind CSS
- Form handling and validation

## Contributing

This is a demo project for learning purposes. Feel free to fork and modify for your own learning journey.

## License

MIT License - feel free to use this code for your own learning and projects.

## Disclaimer

This is a demonstration project and should not be used for actual cryptocurrency trading. It's intended purely for educational purposes to showcase web development concepts.
