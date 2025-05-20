# WAGA Protocol – Blockchain-Powered Coffee Traceability

WAGA Protocol is a modern web application that leverages blockchain technology to bring transparency, traceability, and financial empowerment to the coffee value chain. This project features a token pre-sale interface, community dashboard, interactive demo, and a suite of tools for both users and administrators.

## Features

- **Token Pre-Sale**: Simulated interface for purchasing WAGA tokens with ETH or USDC.
- **Community Dashboard**: Engage with resources, forums, events, and members.
- **Interactive Demo**: Step-by-step walkthrough of the coffee tokenization process.
- **Admin Panel**: Manage users, content, reports, and platform settings.
- **Modern UI**: Built with Next.js, Tailwind CSS, Framer Motion, and Radix UI.
- **Web3 Integration**: Wallet connection and simulated blockchain interactions.

## Project Structure

```
app/
  ├── globals.css                # Global styles (Tailwind, custom CSS)
  ├── layout.tsx                 # Root layout, providers, and navigation
  ├── page.tsx                   # Main landing page
  ├── token-pre-sale/            # Token pre-sale interface
  ├── community/                 # Community dashboard, forums, resources, etc.
  ├── admin/                     # Admin dashboard and management tools
components/
  ├── demo/steps/                # Interactive demo steps (batch creation, minting, etc.)
  ├── ui/                        # Reusable UI components (buttons, cards, sidebar, etc.)
  ├── ...                        # Other shared components
context/
  ├── ...                        # React context providers (wallet, demo, community, auth)
hooks/
  ├── ...                        # Custom React hooks
lib/
  ├── ...                        # Utility libraries (e.g., Supabase client)
public/
  ├── ...                        # Static assets
styles/
  ├── ...                        # Additional CSS
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Supabase](https://supabase.com/) project (for production data, optional)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/waga-protocol.git
   cd waga-protocol
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in any required values (e.g., Supabase keys).

4. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Scripts

- `pnpm dev` – Start the development server
- `pnpm build` – Build for production
- `pnpm start` – Start the production server
- `pnpm lint` – Lint the codebase

## Key Technologies

- **Next.js** – React framework for SSR and static sites
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Utility-first CSS framework
- **Framer Motion** – Animations and transitions
- **Radix UI** – Accessible UI primitives
- **Supabase** – Backend-as-a-Service (auth, database)
- **Lucide Icons** – Icon set

## Customization

- **Tokenomics, features, and roadmap** can be edited in [app/token-pre-sale/page.tsx](app/token-pre-sale/page.tsx).
- **Demo steps** are in [components/demo/steps/](components/demo/steps/).
- **Community and admin features** are in [app/community/](app/community/) and [app/admin/](app/admin/).

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

*This project is for demonstration purposes. No actual transactions are processed.*
