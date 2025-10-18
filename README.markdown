# SmartFit

SmartFit is an AI-powered chatbot application designed to reduce online shopping returns by providing personalized fit recommendations for clothes and footwear. With the recent migration from in-memory storage and localStorage/sessionStorage to MongoDB, it now offers enhanced scalability, data persistence, and robust user management while retaining all existing functionality.

## Features

- **AI-Powered Fit Analysis**: Utilizes natural language processing, YOLO for object detection, OpenCV for image processing, and MediaPipe for body measurement analysis to recommend fits.
- **Personalized Recommendations**: Reduces returns by up to 30% with tailored suggestions based on user measurements.
- **MongoDB Integration**: Migrated to MongoDB for scalable data storage and user management.
- **Interactive Chatbot**: Engages users with real-time fit queries and responses.
- **Responsive Design**: Optimized for seamless use across devices.

## Tech Stack

- **Frontend**: Built with HTML, CSS, and JavaScript for an interactive user interface.
- **Backend**: Python with Flask handling API endpoints, AI model integration, and data processing.
- **Database**: MongoDB for storing user data, measurements, products, and recommendations.
- **AI/ML Tools**: NLP, YOLO, OpenCV, and MediaPipe for advanced fit analysis.
- **Build Tools**: npm for dependency management and development.

## Installation

To set up SmartFit locally:

1. Clone the repository:
   ```
   git clone https://github.com/Dharaneesh05/SmartFit.git
   ```
2. Navigate to the project directory:
   ```
   cd SmartFit
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start MongoDB:
   ```
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```
5. Set up environment variables: Create a `.env` file based on `.env.example` (if available) and add necessary keys (e.g., MongoDB URI, JWT secret).
6. Start the development server:
   ```
   npm run dev
   ```
   - Frontend will run on `http://localhost:5000`.
   - API on `http://localhost:5000/api`.

For production build:
```
npm run build
npm run start
```

## Usage

- **Fit Analysis**: Input body measurements to receive personalized clothing and footwear recommendations.
- **Chatbot Interaction**: Engage with the AI chatbot for real-time fit queries.
- **User Management**: Register and log in to save preferences and history.
- Example: Navigate to `http://localhost:5000` to start the fit analysis process.

## Screenshots

### Homepage
![Homepage Screenshot](screenshots/homepage.png)

### Fit Analysis
![Fit Analysis Screenshot](screenshots/fit-analysis.png)

### Chatbot Interface
![Chatbot Screenshot](screenshots/chatbot.png)

## Contributing

Contributions are welcome! Fork the repo, create a branch, and submit a pull request. Please follow the code style and add tests for new features.
