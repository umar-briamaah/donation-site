<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->



# Donation System

A comprehensive donation platform built with Next.js 14, React, and Prisma. This system allows users to create and manage donation causes, make secure payments, and track their contributions.

## Features

### 🎯 Core Features
- **User Authentication** - Secure login/register with NextAuth.js
- **Cause Management** - Create, edit, and manage donation causes
- **Payment Processing** - Integration with Flutterwave and Paystack
- **Donation Tracking** - Complete history and receipt generation
- **Admin Dashboard** - Analytics and management tools
- **PDF Receipts** - Automated receipt generation

### 🔐 Authentication & Authorization
- JWT-based authentication with NextAuth.js
- Role-based access control (User/Admin)
- Protected routes and API endpoints
- Session management

### 💳 Payment Integration
- **Flutterwave** - Cards, Bank Transfer, Mobile Money
- **Paystack** - Cards, Bank Transfer, USSD
- Secure payment verification
- Webhook handling for payment confirmation

### 📊 Admin Features
- Dashboard with analytics
- User management
- Cause approval and management
- Payment tracking and reports
- System settings

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Flutterwave & Paystack APIs
- **PDF Generation**: pdf-lib
- **UI Components**: Lucide React icons

## Project Structure

```
donation-system/
├── app/                      # Next.js 14 App Router
│   ├── layout.js            # Root layout with navigation
│   ├── page.js              # Home page with featured causes
│   ├── donate/[causeId]/    # Dynamic donation pages
│   ├── profile/             # User dashboard and settings
│   ├── admin/               # Admin panel
│   ├── auth/                # Authentication pages
│   └── api/                 # API routes
├── components/              # Reusable React components
├── lib/                     # Utility functions and configurations
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
└── styles/                  # Global styles and Tailwind CSS
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Flutterwave and/or Paystack accounts

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd donation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/donation_system"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   FLUTTERWAVE_PUBLIC_KEY="your-flutterwave-public-key"
   FLUTTERWAVE_SECRET_KEY="your-flutterwave-secret-key"
   PAYSTACK_PUBLIC_KEY="your-paystack-public-key"
   PAYSTACK_SECRET_KEY="your-paystack-secret-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Browse Causes** - Explore available donation causes
3. **Make Donations** - Choose amount and payment method
4. **Track History** - View donation history and download receipts

### For Admins
1. **Access Admin Panel** - Navigate to `/admin/dashboard`
2. **Manage Causes** - Create, edit, or deactivate causes
3. **View Analytics** - Monitor donations and user activity
4. **Generate Reports** - Export donation and user data

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify` - Verify payment status

### Donations
- `GET /api/donations/receipt/[id]/pdf` - Generate PDF receipt

## Database Schema

The application uses the following main models:

- **User** - User accounts and authentication
- **Cause** - Donation causes and goals
- **Donation** - Individual donation records

See `prisma/schema.prisma` for the complete schema.

## Payment Flow

1. User selects cause and enters donation amount
2. Payment is initialized with chosen provider (Flutterwave/Paystack)
3. User completes payment on provider's secure page
4. Payment verification webhook updates donation status
5. User receives confirmation and can download receipt

## Security Features

- Input validation and sanitization
- SQL injection protection via Prisma
- XSS protection
- CSRF protection
- Secure payment processing
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- Ensure Node.js 18+ support
- Set up PostgreSQL database
- Configure environment variables
- Run build command: `npm run build`
- Start command: `npm start`

---

Built with ❤️ for making donations easy and transparent.