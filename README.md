# GitDates 💖

> Where Code Meets Chemistry

GitDates is a modern dating application designed specifically for developers. Connect with like-minded programmers based on your GitHub profile, coding languages, contribution patterns, and shared interests in technology.

## 🚀 Features

- **GitHub Integration**: Authenticate and create profiles using your GitHub account
- **Smart Matching**: Algorithm-based matching using coding languages, location, age, and contribution patterns
- **Real-time Messaging**: Instant messaging with Socket.io integration
- **Profile Management**: Comprehensive developer profiles with GitHub stats
- **Match Preferences**: Customize your matching criteria
- **Activity Dashboard**: Track your matches, conversations, and profile views
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Socket.io Server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with GitHub OAuth
- **Real-time**: Socket.io for messaging and notifications
- **Styling**: Tailwind CSS with custom animations
- **Storage**: Supabase for additional services
- **Animations**: Framer Motion

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Docker** and **Docker Compose** (for PostgreSQL)
- **Git**

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:gittest@localhost:5432/gitdates?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth App
NEXT_AUTH_GITHUB_ID="your-github-client-id"
NEXT_AUTH_GITHUB_SECRET="your-github-client-secret"

# Supabase (Optional - for additional services)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_SUPABASE_URL="bucket-url-for-image"
# Socket.io (Optional - falls back to NEXTAUTH_SECRET)
SOCKET_TOKEN_SECRET="your-socket-token-secret"
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd gitdates
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432 with:

- Database: `gitdates`
- Username: `postgres`
- Password: `gittest`

### 4. Set Up GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: GitDates (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** to your `.env.local` file

### 5. Set Up Supabase (Optional)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and service role key
3. Add them to your `.env.local` file

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the generated secret to your `.env` file as `NEXTAUTH_SECRET`.

### 7. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 8. Start the Development Servers

You need to run both the Next.js app and the Socket.io server:

```bash

# Terminal 2: Start with the Socket.io server
npm run dev:socket
```

### 9. Access the Application

- **Main App**: http://localhost:3000

## 🗂 Project Structure

```
gitdates/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication routes
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Main app dashboard
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── chat/          # Chat/messaging components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── section/       # Landing page sections
│   │   └── ui/            # UI components
│   ├── actions/           # Server actions
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── server.ts              # Socket.io server
└── docker-compose.yml     # PostgreSQL setup
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start Next.js development server
npm run dev:socket   # Start Socket.io server

# Building
npm run build        # Build the application
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client
npx prisma migrate   # Run database migrations
npx prisma db seed   # Seed the database

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXT_AUTH_GITHUB_ID="your-github-client-id"
NEXT_AUTH_GITHUB_SECRET="your-github-client-secret"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_SUPABASE_URL
```

## 🔒 Security Considerations

- Always use strong, unique secrets for production
- Ensure your GitHub OAuth app is configured with the correct callback URLs
- Keep your Supabase service role key secure and never expose it in client-side code
- Use environment variables for all sensitive configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure Docker is running and PostgreSQL container is up
   - Check your `DATABASE_URL` in `.env`

2. **GitHub OAuth Error**:
   - Verify your GitHub OAuth app configuration
   - Check that callback URL matches your app URL

3. **Socket.io Connection Issues**:
   - Ensure both servers are running
   - Check for port conflicts

4. **Prisma Errors**:
   - Run `npx prisma generate` after schema changes
   - Ensure database is accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Happy Coding & Dating! 💖✨**
