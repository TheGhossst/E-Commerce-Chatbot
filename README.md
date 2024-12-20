# E-Commerce Chatbot

## Overview

An e-commerce chatbot built with Next.js, Python Flask, and Firebase to enhance the shopping experience by providing an efficient interface for product search, exploration, and purchase processes. The chatbot integrates with a simulated e-commerce server that processes user queries and returns relevant product data from a mock inventory.

## Features

- **Responsive User Interface**: Compatible with desktop, tablet, and mobile devices.
- **Authentication**: Secure login and session management.
- **Chatbot Interface**: Simple and intuitive with options to reset conversations and track sessions with timestamps.
- **Backend API**: Flask-based API for handling product search and retrieval.
- **Mock Inventory**: At least 100 mock e-commerce products stored in Firebase Firestore.
- **Technical Documentation**: Includes architecture details, tool choices, and mock data creation steps.

## Technologies Used

- **Frontend**: Next.js, React, HTML5, TailWindCSS
- **Backend**: Python Flask
- **Database**: Firebase Firestore
- **Other Tools**: Firebase Admin SDK, dotenv for environment variables, Flask-CORS for cross-origin support

## Project Structure

```
E-Commerce-Chatbot
├── api/            # Backend API
│   ├── lib/          # Utility files
│   │   └── firebase.ts # Firebase initialization
│   ├── app.py       # Flask application entry point
│   ├── populatedb.py # Script to populate Firestore with mock data
│   ├── requirements.txt # Python dependencies
│   └── test.py       # API test scripts
├── app/            # Next.js pages
│   ├── landingpage/  # Landing page of the website
│   ├── signup/       # User signup page
│   ├── login/        # User login page
│   └── chatbot/      # Chatbot interface page
├── .env.local      # Environment variables
├── firebase-admin-sdk.json # Firebase Admin SDK credentials
```

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Python 3.8+ installed
- Firebase Admin SDK credentials

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/TheGhossst/E-Commerce-Chatbot
   cd E-Commerce-Chatbot
   ```

2. **Create Environment Variables**:
   Create a `.env.local` file in the root directory with the following content:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
   FIREBASE_ADMIN_SDK_PATH=
   ```

3. **Frontend Setup**:

   ```bash
   npm install
   npm run dev
   ```

4. **Backend Setup**:

   - Activate the virtual environment:
     ```bash
     .\.venv\Scripts\activate   # On Windows
     source .venv/bin/activate   # On macOS/Linux
     ```
   - Navigate to the API folder:
     ```bash
     cd api
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the Flask server:
     ```bash
     python app.py
     ```

   Alternatively, on Windows, you can use the PowerShell script:

   ```bash
   .\run-dev-api.ps1
   ```

## Backend API Endpoints

### Base URL

```
http://localhost:5000
```

### Endpoints

1. **Home**: `GET /`

   - Description: Displays a welcome message.

2. **Search Products**: `GET /api/products/search`

   - Query Parameter: `query` (string) - Search term for product names.
   - Example:
     ```bash
     curl "http://localhost:5000/api/products/search?query=keyboard"
     ```

3. **Get Product by ID**: `GET /api/products/<product_id>`

   - Path Parameter: `product_id` (string) - The ID of the product to retrieve.
   - Example:
     ```bash
     curl "http://localhost:5000/api/products/123"
     ```

## Firebase Setup

1. Add your Firebase Admin SDK JSON credentials file to the project.
2. Ensure your Firestore database contains the `products` collection with the following fields:
   - `name` (string)
   - `description` (string)
   - `price` (number)
   - `stock` (number)
   - `name_lower` (string) - Lowercase version of the product name for case-insensitive search.

## Challenges and Solutions

- **Cross-Origin Resource Sharing (CORS)**: Implemented `Flask-CORS` to allow the frontend to interact with the backend API.
- **Product Name Search**: Currently searching with product name is only possible.
- **Case-Insensitive Search**: Added a `name_lower` field to products for efficient search queries.
- **Session Management**: Used Firebase Authentication for secure login and session persistence.

## Contribution

Feel free to fork this repository and submit pull requests for enhancements or bug fixes.

## Contact

For any questions or feedback, please open an issue on the repository.

