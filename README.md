# By File

## Setup Instructions

1. Clone the Repository
   ```bash
   git clone <repository-url>
   cd by-file
   ```

2. Install Dependencies
   ```bash
   npm install
   ```

3. Set up Environment Variables
   - Create a `.env.local` file in the project root and add the following variables:
     ```env
     SUPABASE_URL=https://your-supabase-url.supabase.co
     SUPABASE_KEY=your-supabase-service-role-key
     ```

4. Start the Development Server
   ```bash
   npm run dev
   ```

5. Build for Production
   ```bash
   npm run build
   ```
   Then run:
   ```bash
   npm start
   ```

6. Deploy
   - Use Vercel or your preferred deployment method.

## Features

- Drag-and-Drop File Upload
- Upload History Table
- Delete Files
- Responsive Design