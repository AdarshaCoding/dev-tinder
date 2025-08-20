# Dev-Tinder App

A backend service that powers a developer-focused social matching platform, built with Node.js, Express, and MongoDB.

---

## Features & API Endpoints

### **User Management**

#### **POST /signup**

- Handles new user registration.
- Validates user input using `validator`.
- Passwords are hashed with `bcrypt` before persistence.
- Returns success response upon user creation.

#### **POST /login**

- Authenticates users with email and password.
- Validates email with custom utilities.
- Compares input password with hashed password using `bcrypt.compare`.
- On success:
  - Generates a signed JWT (`jsonwebtoken.sign`) with the user’s ID as payload.
  - Sends JWT in the response along with user details.
- On failure:
  - Returns an appropriate error message (`Invalid Credentials`).

---

### **Feed Management**

#### **GET /feed**

- Fetches all users from the database (`User.find({})`).
- Returns a list of users in JSON format.
- Provides proper error handling with structured error messages.

---

### **Profile Management**

#### **GET /profile**

- Protected route. Requires JWT authentication.
- Executes `userAuth` middleware before hitting the route handler.
- On successful authentication:
  - Returns the logged-in user’s profile details.
- On failure:
  - Returns an authentication error message.

---

## Middleware

### **userAuth**

Responsible for securing protected routes.

```js
// Steps inside middleware
1. Extract JWT token from the request object.
2. Validate token using jsonwebtoken.verify.
3. If valid:
   - Extract user ID from decoded payload.
   - Fetch corresponding user details from DB.
   - Attach user object to req object.
   - Call next() to proceed.
4. If invalid:
   - Return an authentication error response.
```

## Response Structure

### **All API responses follow a consistent schema.**

**✅ Success Response**

```json
{
  "success": true,
  "message": "Fetched all users successfully",
  "data": [...]
}
```

**❌ Failure Response**

```json
{
  "success": false,
  "message": "Invalid Credentials"
}
```

## Error Handling

- Implemented using try/catch blocks.
- Custom error messages replace raw library error messages for clarity.

## Tech Stack

```bash
Runtime     : Node.js
Framework   : Express.js
Database    : MongoDB (Mongoose ODM)
Auth        : JWT (JSON Web Tokens)
Password    : bcrypt
Validation  : validator
Error Mgmt  : try/catch with custom error messages
```

## Project Setup

### Prerequisites

```bash
Node.js >= 16.x
MongoDB (local or Atlas cloud instance)
npm or yarn
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dev-tinder.git
cd dev-tinder

# Install dependencies
npm install
```

### Environment Variables

Create a .env file in the project root with the following keys:

```bash
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devtinder
JWT_SECRET=your_jwt_secret_key
```

### Running the App

```bash
# Start development server
npm run dev

# Start production server
npm start
```

## Future Enhancements

### Security

- Rate limiting & request throttling
- Refresh token mechanism for JWT

### Scalability

- CI/CD pipeline integration
- Horizontal scaling with Docker/Kubernetes

### Developer Experience

- Unit & integration testing with Jest
- API documentation with Swagger/OpenAPI
