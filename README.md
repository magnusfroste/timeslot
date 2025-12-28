# Timeslotfit

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/magnusfroste/timeslotfit/blob/main/LICENSE)
[![CI](https://github.com/magnusfroste/timeslotfit/actions/workflows/ci.yml/badge.svg)](https://github.com/magnusfroste/timeslotfit/actions/workflows/ci.yml)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)](https://github.com/magnusfroste/timeslotfit)

**Timeslotfit has helped thousands to get quick meetings - simply.** Create time slots, share the link, and let others pick their availability. No registration required.

🚀 **Free to use** - The cloud version is completely free!

## Features

- ⚡ **Lightning Fast** - Create and share meeting timeslots in under 30 seconds
- 🔓 **No Sign-Up Required** - Participants can respond without creating accounts
- 🔄 **Real-Time Updates** - See responses instantly as people make their selections
- 📱 **Mobile Friendly** - Works perfectly on all devices and screen sizes

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Getting Started

### Prerequisites
- A [Supabase](https://supabase.com) account and project
- Node.js and npm

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/magnusfroste/timeslotfit.git
   cd timeslotfit
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase project details:
     ```
     VITE_SUPABASE_PROJECT_ID="your-project-id"
     VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
     VITE_SUPABASE_URL="https://your-project-id.supabase.co"
     ```

4. Set up Supabase:
   - Install the Supabase CLI: `npm install supabase --save-dev`
   - Login to Supabase: `npx supabase login`
   - Link your project: `npx supabase link --project-ref your-project-id`
   - Push the database schema: `npx supabase db push`
   - Deploy edge functions: `npx supabase functions deploy`

5. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment

Deploy to your own infrastructure - the code is standard web app code that can be deployed anywhere.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
