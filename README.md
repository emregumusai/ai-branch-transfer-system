# 🏦 AI Branch Transfer System

An intelligent customer branch transfer system powered by Google's Gemini AI. This application helps banks and financial institutions efficiently manage customer branch transfers based on preferences, proximity, and AI-powered recommendations.

## ✨ Features

- 🤖 **AI-Powered Recommendations** - Uses Google Gemini AI to analyze transfer requests
- 📊 **Smart Branch Matching** - Intelligent matching based on customer preferences
- 🎯 **Priority-Based Sorting** - Customers can rank their branch preferences
- 👥 **User Management** - Secure login and user authentication
- 🗺️ **Branch Database** - Comprehensive branch information management
- ⚡ **Real-time Processing** - Fast and efficient request handling

## 🚀 Tech Stack

### Frontend
- React 19.1.0
- Axios for API calls
- @hello-pangea/dnd for drag-and-drop functionality
- Modern responsive UI

### Backend
- Node.js with Express 5.1.0
- Google Generative AI (Gemini)
- RESTful API architecture
- JSON-based data storage

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Backend Setup

```bash
cd AIMusteriSubeDevir/backend
npm install

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

node app.js
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd AIMusteriSubeDevir/frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Login** - Enter your credentials to access the system
2. **Select Branches** - Choose your preferred branches for transfer
3. **Rank Preferences** - Drag and drop to prioritize your choices
4. **Submit Request** - Let AI analyze and process your transfer request
5. **Get Recommendations** - Receive intelligent branch suggestions

## 📂 Project Structure

```
ai-branch-transfer-system/
├── AIMusteriSubeDevir/
│   ├── backend/
│   │   ├── app.js              # Main server file
│   │   ├── routes/
│   │   │   ├── gemini.js       # AI integration
│   │   │   └── subeler.js      # Branch routes
│   │   ├── users.json          # User database
│   │   └── subeler.json        # Branch database
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── LoginForm.js
│       │   │   ├── WelcomeScreen.js
│       │   │   └── TercihSiralama.js
│       │   └── App.js
│       └── public/
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📜 License and Usage

### 🎓 Free Usage
- Personal projects
- Educational purposes
- Academic research

### 💼 Commercial Usage
**This software requires explicit permission for commercial use in banks, corporations, or enterprise applications.**

📧 **Contact for Commercial Licensing:**
- GitHub: [@emregumusai](https://github.com/emregumusai)
- **Please contact before implementing in production environments**

⚖️ See [LICENSE](LICENSE) for complete terms and conditions.

## 🔒 Security Note

This is a demonstration project. For production use:
- Implement proper authentication and authorization
- Use secure database solutions
- Add encryption for sensitive data
- Follow banking security standards and regulations

## 📞 Support

For questions, issues, or commercial licensing inquiries:
- Open an issue on GitHub
- Contact via GitHub profile

---

**Made with ❤️ by Yunus Emre Gumus**
