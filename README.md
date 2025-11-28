# MERN Bug Tracker

A comprehensive bug tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) with extensive testing and debugging capabilities.

## Features

- **Bug Management**: Create, read, update, and delete bug reports
- **Status Tracking**: Track bug status (open, in-progress, resolved, closed)
- **Priority Levels**: Set priority (low, medium, high, critical)
- **Environment Details**: Capture OS, browser, device information
- **Steps to Reproduce**: Detailed reproduction steps
- **Tags**: Categorize bugs with custom tags
- **Search & Filter**: Filter by status, priority, and search text
- **Responsive Design**: Works on desktop and mobile devices

## Testing & Debugging Features

### Backend Testing
- **Unit Tests**: Validation logic, utility functions
- **Integration Tests**: API endpoints with mocked database
- **Error Handling**: Comprehensive error middleware
- **Debug Logging**: Development-mode request/response logging

### Frontend Testing
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: User workflows and API interactions
- **Error Boundaries**: Graceful error handling in React
- **E2E Testing**: Cypress tests for critical user flows

### Debugging Tools
- **Console Logging**: Strategic debug logs throughout the application
- **Chrome DevTools**: React DevTools integration
- **Node.js Inspector**: Server-side debugging capabilities
- **Error Tracking**: Comprehensive error reporting

## Project Structure
mern-bug-tracker/
├── client/ # React frontend
├── server/ # Express.js backend
├── tests/ # Test files
└── README.md


## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd mern-bug-tracker
2. Install dependencies
bash
# Install all dependencies (root, server, and client)
npm run install-all
3. Environment Setup
Create a .env file in the server directory:

env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/bugtracker
MONGO_URI_TEST=mongodb://localhost:27017/bugtracker_test
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
4. Start the application
bash
# Development mode (both client and server)
npm run dev

# Or start separately
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
Testing
Run All Tests
bash
npm test
Run Specific Test Types
bash
# Backend tests only
npm run test:server

# Frontend tests only
npm run test:client

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
Test Database Setup
bash
cd server
npm run setup-test-db
Debugging Techniques
Backend Debugging
Console Logging: Check server console for debug logs (NODE_ENV=development)

Node Inspector: Use node --inspect for debugging server code

API Testing: Use Postman or curl to test endpoints directly

Frontend Debugging
React DevTools: Browser extension for component inspection

Redux DevTools: State management debugging (if using Redux)

Network Tab: Monitor API calls and responses

Console Logs: Client-side debug logging

Error Handling
Backend: Express error middleware with detailed error responses

Frontend: React Error Boundaries for component-level error handling

Global Error Tracking: Centralized error reporting

API Endpoints
Bugs
GET /api/bugs - Get all bugs (with filtering/pagination)

GET /api/bugs/:id - Get single bug

POST /api/bugs - Create new bug

PUT /api/bugs/:id - Update bug

DELETE /api/bugs/:id - Delete bug

Health Check
GET /api/health - Application health status

Testing Approach
Backend Testing Strategy
Unit Tests: Isolated testing of middleware, validation, and utilities

Integration Tests: API endpoint testing with mocked database

Database Testing: In-memory MongoDB for test isolation

Error Testing: Comprehensive error scenario coverage

Frontend Testing Strategy
Component Tests: Isolated testing of React components

Integration Tests: User workflow testing

E2E Tests: Critical path testing with Cypress

Mock Service Worker: API mocking for reliable tests

Code Coverage Goals
Minimum 70% code coverage for unit tests

Critical path integration test coverage

E2E test coverage for main user journeys

Contributing
Fork the repository

Create a feature branch

Write tests for new functionality

Ensure all tests pass

Submit a pull request

License
MIT License - see LICENSE file for details

This comprehensive MERN Bug Tracker application includes:

1. **Complete Backend**: Express.js API with MongoDB, validation, error handling
2. **React Frontend**: Modern React components with hooks and state management
3. **Testing Suite**: Comprehensive unit, integration, and E2E tests
4. **Debugging Features**: Error boundaries, logging, development tools
5. **Documentation**: Complete setup and usage instructions

The application demonstrates professional testing and debugging practices suitable for production use.
