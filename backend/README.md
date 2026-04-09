# VigilearnLMS Backend

Backend API for the VigilearnLMS Learning Management System.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone and navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vigilearn_lms
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB**
   - If using local MongoDB, ensure it's running
   - If using MongoDB Atlas, update the MONGODB_URI in `.env`

5. **Seed the database** (optional - creates sample users and courses)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user (admin only)
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - Get courses (filtered by user role)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (lecturer/admin)
- `PUT /api/courses/:id` - Update course (lecturer/admin)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `POST /api/courses/:id/enroll` - Enroll in course (student)
- `POST /api/courses/:id/unenroll` - Unenroll from course (student)

### Other Features (Coming Soon)
- Assignments management
- Quiz system
- Forums
- Attendance tracking
- Dashboard analytics

## Default Login Credentials

After running the seed script:

### Admin
- Username: `admin`
- Password: `admin123`

### Lecturers
- Username: `lecturer1` through `lecturer4`
- Password: `lecturer123`

### Students
- Username: `student1` through `student3`
- Password: `student123`

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── courseController.js  # Course management logic
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User model
│   ├── Course.js           # Course model
│   ├── Assignment.js       # Assignment model
│   ├── Quiz.js             # Quiz model
│   ├── Forum.js            # Forum model
│   └── Attendance.js       # Attendance model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── courses.js          # Course routes
│   ├── assignments.js      # Assignment routes (placeholder)
│   ├── quizzes.js          # Quiz routes (placeholder)
│   ├── forums.js           # Forum routes (placeholder)
│   ├── attendance.js       # Attendance routes (placeholder)
│   └── dashboard.js        # Dashboard routes (placeholder)
├── uploads/                # File upload directory
├── seed.js                 # Database seeding script
├── server.js               # Main server file
└── package.json
```

## Features Implemented

✅ **Core Backend Structure**
- Express.js server with middleware setup
- MongoDB connection with Mongoose
- JWT authentication system
- Role-based access control
- CORS configuration
- Security middleware (helmet, rate limiting)

✅ **User Management**
- User registration (admin only)
- User login with JWT
- Profile management
- Role-based permissions (student, lecturer, admin)

✅ **Course Management**
- Create, read, update courses
- Student enrollment/unenrollment
- Lecturer course assignment
- Role-based course access

✅ **Database Models**
- User model with password hashing
- Course model with relationships
- Assignment, Quiz, Forum, Attendance models (ready for implementation)

## Next Steps

1. **Assignments System** - File uploads, submissions, grading
2. **Quiz System** - Create questions, attempts, scoring
3. **Forums** - Discussion boards with posts and replies
4. **Attendance** - Mark attendance, generate reports
5. **Dashboard APIs** - Analytics and statistics
6. **Frontend Integration** - Connect React app to backend APIs

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)

## Development Notes

- The backend is designed to work with the existing React frontend
- All routes require authentication except login
- Role-based permissions are enforced at route level
- Database relationships are properly established
- Error handling is centralized
- The codebase follows RESTful API conventions
