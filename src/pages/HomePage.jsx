import { useW } from '../hooks/useW.js';
import { C, COURSES, LECTURER_COURSES } from '../data/constants.js';

export function HomePage({ setPage, role }) {
  const w = useW();
  const isLg = w >= 1024;

  // Student Homepage Content
  if (role === "student") {
    return (
      <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <div className="flex items-center gap-2 mt-4">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-abu-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">My Courses</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all registered courses.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">My Assignments</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all assignment and submissions.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Quizzes</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all quizzes and submissions.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Discussions</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Manage Discussions</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Manage
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Profile</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Manage profile, edit and update.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lecturer Homepage Content
  if (role === "lecturer") {
    return (
      <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <div className="flex items-center gap-2 mt-4">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-abu-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">My Courses</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all registered courses.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">My Assignments</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all assignment and submissions.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Quizzes</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all quizzes and submissions.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Discussions</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Manage Discussions</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Manage
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Profile</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Manage profile, edit and update.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Homepage Content
  if (role === "admin") {
    return (
      <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <div className="flex items-center gap-2 mt-4">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-abu-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">My Courses</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all registered courses.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">My Assignments</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all assignment and submissions.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Quizzes</h3>
              <p className="text-sm text-gray-600 text-center mb-4">View all quizzes and submissions.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Discussions</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Manage Discussions</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Manage
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-abu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Profile</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Manage profile, edit and update.</p>
              <button className="w-full bg-abu-blue text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
