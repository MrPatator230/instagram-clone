# 🔥 Ferrosocial - Instagram Clone

Ferrosocial is a warm and vibrant social media platform inspired by Instagram, built with modern web technologies. Share your warmest moments with a community that celebrates connection and positivity.

## ✨ Features

- **User Authentication** - Secure registration and login system
- **Photo Sharing** - Upload and share your favorite moments
- **Social Feed** - Browse posts from the community
- **Interactions** - Like and comment on posts
- **User Profiles** - Personalized profile pages
- **Responsive Design** - Works beautifully on all devices
- **Warm Color Theme** - Orange and coral color palette for a welcoming feel

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side routing
- **Styled Components** for CSS-in-JS styling
- **Axios** for API communication
- **React Icons** for beautiful icons

### Backend
- **Node.js** with Express.js framework
- **MySQL** database with connection pooling
- **JWT** authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **CORS** and security middleware

### Database Schema
- **Users** - User accounts and profiles
- **Posts** - Photo posts with captions
- **Likes** - Post likes tracking
- **Comments** - Post comments system
- **Follows** - User following relationships

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MrPatator230/instagram-clone.git
cd instagram-clone
```

2. **Set up the database**
```bash
# Create MySQL database
mysql -u root -p < database/schema.sql
```

3. **Configure Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

4. **Configure Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env if needed (default should work for development)
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

3. **Visit the Application**
Open http://localhost:3000 in your browser

## 📁 Project Structure

```
ferrosocial/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication and file upload
│   ├── routes/          # API routes
│   ├── server.js        # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── styles/      # Global styles
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # React entry point
│   └── package.json
├── database/
│   └── schema.sql       # MySQL database schema
└── uploads/             # User uploaded images
```

## 🎨 Color Palette

Ferrosocial uses a warm, welcoming color scheme:

- **Primary Orange**: `#FF6B35` - Main brand color
- **Secondary Red**: `#E74C3C` - Accent and highlights  
- **Soft Coral**: `#FF8A65` - Interactive elements
- **Warm Cream**: `#FDF2E9` - Background base
- **Light Peach**: `#FAE5D3` - Secondary backgrounds

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev      # Start with nodemon for auto-reload
npm start        # Start production server
```

### Frontend Development  
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Database Management
- The schema includes sample data for testing
- Use MySQL Workbench or command line for database management
- All tables use proper foreign keys and indexes for performance

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Posts
- `GET /api/posts/feed` - Get posts feed
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/like` - Toggle like on post
- `GET /api/posts/user/:username` - Get user's posts

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments/post/:postId` - Add comment
- `DELETE /api/comments/:id` - Delete comment

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- File upload validation
- SQL injection protection
- XSS protection with helmet

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ferrosocial
JWT_SECRET=your_jwt_secret
UPLOAD_PATH=../uploads
MAX_FILE_SIZE=5242880
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Ferrosocial
```

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] Stories feature
- [ ] Image filters and editing
- [ ] Video upload support
- [ ] Social login (Google, Facebook)
- [ ] Mobile app (React Native)
- [ ] Advanced search and hashtags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Instagram's user interface
- Built with modern React and Node.js best practices
- Uses Material Design principles for icons and interactions

---

Made with ❤️ and 🔥 by the Ferrosocial team
