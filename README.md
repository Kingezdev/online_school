# Attendance Tracking System

A modern, responsive web application for managing student attendance records. Built with React and Vite, this system provides an intuitive interface for tracking attendance across multiple courses.

## 📋 Features

- **Course Management** - Track attendance for multiple courses
- **Student Records** - Manage student information and attendance status
- **Attendance Tracking** - Mark attendance by date with visual feedback
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates** - Instant feedback on attendance changes
- **Tutor Dashboard** - Dedicated interface for instructors to manage courses

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/attendance.git
cd attendance
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start the development server with hot module reloading
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
attendance/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── main.jsx          # React entry point
│   ├── index.css         # Global styles
│   └── assets/           # Static assets
├── public/               # Public static files
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

## 🧑‍💼 Supported Courses

The system pre-configured with common university courses:
- STAT 201: Discrete Probability Distributions
- COSC 203: Discrete Structures
- COSC 205: Digital Logic Design
- COSC 211: Object-Oriented Programming I
- MATH 201: Mathematical Methods I
- MATH 207: Linear Algebra I
- MATH 209: Numerical Analysis I
- GENS 101: Nationalism
- GENS 103: English and Communication Skills

## 🎨 Technologies

- **React** 19.2.4 - UI library
- **Vite** 8.0.0 - Build tool and dev server
- **ESLint** 9.39.4 - Code quality and style enforcement
- **JavaScript (ES Modules)** - Modern ES module syntax

## 📝 Development

### Code Quality

The project uses ESLint to maintain code quality. Run linting with:
```bash
npm run lint
```

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Created for educational and attendance management purposes.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Note:** This is a development version. For production use, additional security measures and database integration may be required.
