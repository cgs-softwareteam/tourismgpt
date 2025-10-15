<a href="https://tourismgpt.vercel.app/">
  <img alt="TourismSpot GPT destination discovery interface." src="app/(chat)/opengraph-image.png">
  <h1 align="center">TourismSpot GPT</h1>
</a>

<p align="center">
    TourismSpot GPT is a personalized travel planning platform built with Next.js and the AI SDK that delivers curated destination recommendations.
</p>

<p align="center">
  <a href="https://tourismgpt.vercel.app"><strong>Try the App</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

### Core Platform
- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://ai-sdk.dev/docs/introduction)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI GPT-4o (primary), xAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility

### User Features
- **Smart Recommendation Engine**
  - AI-powered tourism recommendations (attractions, dining, activities)
  - Multi-select preference filters (Family, Luxury, Budget, Adventure, etc.)
  - Interactive recommendation cards with save, directions, and info actions
- **Saved Recommendations** ✨ NEW
  - Save favorite recommendations for future reference
  - View all saved recommendations in one place
  - Toggle saved status on/off
- **Authentication**
  - Email/password and OAuth (Google, Facebook) via [Auth.js](https://authjs.dev)
  - Secure session management

### Admin Features
- **Analytics Dashboard**
  - User engagement metrics
  - Top attractions and dining clicks
  - OpenAI API usage and cost tracking
- **User Management** ✨ ENHANCED
  - View all registered users
  - In-panel role management with toggle switches
  - Promote/demote users between admin and user roles
  - Self-demotion protection
- **Filter Management**
  - View and monitor preference filters
  - Dynamic filter loading from database

### Data Persistence
- [Supabase Postgres](https://supabase.com) for all application data
  - User accounts and authentication
  - Chat history and messages
  - Saved recommendations
  - Analytics and usage tracking
  - Admin roles and permissions

## Model Providers

TourismSpot GPT uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) to access multiple AI models through a unified interface. The default configuration includes [xAI](https://x.ai) models (`grok-2-vision-1212`, `grok-3-mini`) routed through the gateway.

### AI Gateway Authentication

**For Vercel deployments**: Authentication is handled automatically via OIDC tokens.

**For non-Vercel deployments**: You need to provide an AI Gateway API key by setting the `AI_GATEWAY_API_KEY` environment variable in your `.env.local` file.

With the [AI SDK](https://ai-sdk.dev/docs/introduction), you can also switch to direct LLM providers like [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://ai-sdk.dev/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of TourismSpot GPT to Vercel:

1. Fork or clone this repository
2. Install Vercel CLI: `npm i -g vercel`
3. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
4. Download your environment variables: `vercel env pull`
5. Deploy through the Vercel dashboard or `vercel` CLI

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run TourismSpot GPT. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your TourismSpot GPT instance should now be running on [localhost:3000](http://localhost:3000).

## Documentation

For detailed information about the platform:

- **[Admin Manual](docs/ADMIN_MANUAL.md)** - Complete guide for administrators
- **[Platform Owner Guide](docs/PLATFORM_OWNER_GUIDE.md)** - Business overview and roadmap
- **[Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)** - Architecture and development guide

## Recent Updates (v1.1.0)

- ✅ **Saved Recommendations**: Users can now save and manage favorite recommendations
- ✅ **Enhanced User Management**: In-panel role toggle for promoting/demoting users
- ✅ **Improved Admin UX**: Real-time feedback and better authorization flow
- ✅ **Session Enhancement**: Added `isAdmin` field for efficient role checks

## License

This project is licensed under the MIT License.
