# AI Article Generator

A web application that produces original and professional articles about the latest developments in the technology world using modern web technologies and Google's Gemini AI model.

## 🎯 Project Purpose

- Generate original articles about current technology developments
- Create titles containing specific and measurable data
- Provide content on technology leaders and investment trends
- Create resources for professional development

## 🚀 Features

### Title Generation
- **AI-Powered Titles**
  - Focused on current technology developments
  - Specific products and updates
  - Measurable data and impacts
  - Category-based customization

### Content Categories
- **Technology Trends**
  - AI and ML updates
  - Hardware and chip technologies
  - Sustainable technology
  - Space and health technologies

- **Technology Leaders**
  - Leader profiles and strategies
  - Company decisions and investments
  - Vision and future plans
  - Approaches to technology trends

- **Investment Insights**
  - Analysis of technology companies
  - Market projections
  - Financial metrics
  - Risk and opportunity assessments

- **Personal Development**
  - Digital skills
  - Career strategies
  - Certification roadmaps
  - Productivity techniques

### User Interface
- Modern and responsive design
- Dark/Light mode support
- Content in Markdown format
- Category-based filtering
- Search function

## 🛠 Technology Stack

### Backend
- Node.js & Express.js
- Google Gemini AI API
- Rate limiting and security
- Markdown support

### Frontend
- Next.js 13+
- React & TypeScript
- Tailwind CSS
- React Markdown
- Theme support

## 💻 Installation

1. Clone the repository:
```bash
git clone [repo-url]
cd video-app
```

2. Backend setup:
```bash
cd backend
npm install
```

3. Frontend setup:
```bash
cd web
npm install
```

4. Create a .env file for the backend:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Running

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd web
npm run dev
```

The application will run at http://localhost:3000.

## 📁 Project Structure

```
video-app/
├── backend/
│   ├── index.js
│   └── package.json
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── api/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── types/
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- `PORT`: The port on which the API server will run (default: 3001)
- `GEMINI_API_KEY`: Google Gemini AI API access key

### Rate Limiting
- Article generation: 1 request per minute
- Title generation: 5 requests per minute
- General requests: 30 requests per minute

### Content Limits
- Article length: 800-2000 words
- Title length: 3-8 words
- Minimum wait time: 30 seconds
- Maximum wait time: 120 seconds

## 🤝 Contributing

1. Fork it
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Markdown Documentation](https://remarkjs.github.io/react-markdown/) 