const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

// Load .env file
dotenv.config();

// Gemini API configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Safety settings for Gemini API
const safetySettings = [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
    },
];

// Clean and validate API key
function validateApiKey(apiKey) {
    if (!apiKey) return null;
    // Clean spaces and unnecessary characters
    const cleanKey = apiKey.trim();
    // Check minimum length of API key
    if (cleanKey.length < 30) {
        console.error('API key too short:', cleanKey.length);
        return null;
    }
    return cleanKey;
}

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - Updated
app.use(cors({
    origin: '*', // Tüm originlere izin ver
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false // credentials'ı false yapıyoruz
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Parse JSON bodies
app.use(express.json());

// Rate limiter configurations
const generateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1 // Maximum 1 request per minute
});

const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30 // Maximum 30 requests per minute
});

// Rate limiting variables
let MIN_REQUEST_INTERVAL = 30000; // Initially 30 seconds
const MAX_REQUEST_INTERVAL = 120000; // Maximum 2 minutes
let lastRequestTime = 0;
let consecutiveErrors = 0;

// Calculate and update wait time
function getWaitTime() {
    const now = Date.now();
    // No wait for first request
    if (lastRequestTime === 0) {
        return 0;
    }
    
    const timeSinceLastRequest = now - lastRequestTime;
    const waitTime = Math.max(0, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    return waitTime;
}

// Increase wait time on error
function increaseWaitTime() {
    consecutiveErrors++;
    // Increase wait time by 10 seconds for each error
    MIN_REQUEST_INTERVAL = Math.min(
        MAX_REQUEST_INTERVAL,
        MIN_REQUEST_INTERVAL + (10000 * consecutiveErrors)
    );
    console.log(`Wait time increased to ${MIN_REQUEST_INTERVAL/1000} seconds`);
}

// Decrease wait time on success
function decreaseWaitTime() {
    consecutiveErrors = 0;
    // Decrease wait time by 5 seconds on successful request
    MIN_REQUEST_INTERVAL = Math.max(30000, MIN_REQUEST_INTERVAL - 5000);
    console.log(`Wait time decreased to ${MIN_REQUEST_INTERVAL/1000} seconds`);
}

// Create folder for articles
const articlesDir = path.join(__dirname, 'articles');
(async () => {
    try {
        await fs.access(articlesDir);
    } catch {
        await fs.mkdir(articlesDir);
    }
})();

// Metni daha insansı hale getirme fonksiyonu
async function humanizeText(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const humanizePrompt = `Please make the following text more natural, fluid, and human-like.
Preserve the markdown format but make the language more conversational.
Keep technical terms but explain them in a more understandable way.
Follow these rules:

1. Soften formal language while maintaining professionalism
2. Explain technical terms but don't remove them
3. Make paragraphs shorter and more readable
4. Make transitions and connections more natural
5. Preserve markdown formatting
6. Don't change the content, only the style of presentation

Here's the text:

${text}`;

        const result = await model.generateContent(humanizePrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Humanize process error:', error);
        return text; // Return original text in case of error
    }
}

const articleTypes = {
    'tech-trends': {
        keywords: [
            'metaverse', 'NFT', 'IoT', 'artificial intelligence', 'virtual reality',
            'blockchain', 'robotics', 'autonomous systems', '5G', 'quantum computing',
            'cybersecurity', 'cloud technology', 'big data'
        ],
        titleTemplates: [
            "What Awaits Us in {keyword} Technology in 2024?",
            "{keyword}: How is the Technology of the Future Shaping Today?",
            "The Impact of {keyword} Technology on the Business World",
            "Next-Generation {keyword} Applications and Use Cases",
            "Recent Developments and Trends in the Field of {keyword}"
        ]
    },
    'tech-leaders': {
        keywords: [
            'Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Sam Altman', 'Satya Nadella',
            'success strategy', 'leadership', 'innovation', 'entrepreneurship', 'technology vision'
        ],
        titleTemplates: [
            "5 Key Strategies Behind {keyword}'s Success",
            "What Does {keyword} Think About This Technology?",
            "{keyword}'s Vision for the Future and Investment Strategies",
            "Golden Advice for Young Entrepreneurs from {keyword}",
            "Life Lessons from the Genius of the Tech World: {keyword}"
        ]
    },
    'investment-insights': {
        keywords: [
            'cryptocurrency', 'stock market', 'technology companies', 'startup investments',
            'risk analysis', 'market trends', 'economic crisis', 'geopolitical impacts'
        ],
        titleTemplates: [
            "How Would a War Affect {keyword}?",
            "Opportunities and Risks in the {keyword} Market",
            "What Awaits {keyword} Investors in 2024?",
            "How Would an Economic Crisis Impact the {keyword} Market?",
            "5 Key Points to Consider in {keyword} Investments"
        ]
    },
    'personal-growth': {
        keywords: [
            'digital skills', 'career development', 'remote work', 'productivity',
            'work-life balance', 'leadership skills', 'networking', 'communication'
        ],
        titleTemplates: [
            "How to Improve Yourself in {keyword}?",
            "7 Ways to Develop {keyword} Skills in the Digital Age",
            "Expert-Recommended Strategies for {keyword}",
            "How to Develop {keyword} for a Successful Career?",
            "Common Mistakes in {keyword} and Their Solutions"
        ]
    }
};


// Makale başlığı oluşturma fonksiyonu
function generateTitlesByType(type, count = 5) {
    const articleType = articleTypes[type];
    if (!articleType) {
        throw new Error('Invalid article type');
    }

    const titles = [];
    const usedTemplates = new Set();
    const usedKeywords = new Set();

    while (titles.length < count) {
        // Random template ve keyword seç
        const templateIndex = Math.floor(Math.random() * articleType.titleTemplates.length);
        const keywordIndex = Math.floor(Math.random() * articleType.keywords.length);
        
        const template = articleType.titleTemplates[templateIndex];
        const keyword = articleType.keywords[keywordIndex];
        
        // Template ve keyword kombinasyonunun benzersiz olduğundan emin ol
        const combination = `${templateIndex}-${keywordIndex}`;
        if (!usedTemplates.has(combination)) {
            const title = template.replace('{keyword}', keyword);
            titles.push({
                title,
                keywords: [keyword, ...articleType.keywords.slice(0, 3)].filter((k, i, arr) => arr.indexOf(k) === i),
                type
            });
            usedTemplates.add(combination);
        }
    }

    return titles;
}

// AI ile başlık üretme fonksiyonu
async function generateAITitles(type, count = 5) {
    try {
        console.log('Starting title generation for type:', type, 'count:', count);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            safetySettings
        });
        
        // Prepare a type-based prompt
        let prompt = '';
        let keywords = [];
        
        switch(type) {
            case 'tech-trends':
                keywords = ['artificial intelligence', 'blockchain', 'metaverse', 'IoT', 'cybersecurity', '5G', 'quantum', 'robotics'];
                prompt = `You are a technology journalist specializing in tech trends. Generate ${count} compelling article titles on current and specific technology topics.`;
                break;

            case 'tech-leaders':
                keywords = ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Sam Altman', 'Satya Nadella'];
                prompt = `You are a technology analyst and biography writer who closely follows tech leaders. Generate ${count} detailed and specific article titles.`;
                break;

            case 'investment-insights':
                keywords = ['cryptocurrency', 'stock market', 'technology companies', 'startup', 'risk analysis', 'economic crisis'];
                prompt = `You are a financial analyst specializing in fintech and technology investments. Generate ${count} detailed and analytical article titles.`;
                break;

            case 'personal-growth':
                keywords = ['digital skills', 'career development', 'remote work', 'work-life balance', 'leadership'];
                prompt = `You are a consultant specializing in career development and professional skills in the digital age. Generate ${count} specific and actionable article titles.`;
                break;

            default:
                throw new Error(`Invalid article type: ${type}`);
        }

        prompt += `\nGeneral Rules:
        1. Titles should be in English
        2. Each title must appear on a new line
        3. Avoid blank lines between titles
        4. No extra spaces at the start or end of titles
        5. Do not use numbering or bullet points
        6. All titles must be unique and original
        7. Include numbers and specific data whenever possible
        8. Refer to current dates and real developments
        9. Avoid clickbait, offer real value instead`;

        console.log('Sending prompt to Gemini API:', prompt);

        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            });

            if (!result?.response) {
                throw new Error('No response from Gemini API');
            }

            const text = result.response.text();
            if (!text) {
                throw new Error('Empty response text from Gemini API');
            }
            
            console.log('Raw response from Gemini API:', text);
            
            // Separate and format titles
            const titles = text.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('-') && !line.match(/^\d+\./))
                .slice(0, count)
                .map(title => ({
                    title,
                    type,
                    keywords: keywords.slice(0, 3),
                    summary: `A detailed analysis and evaluation of ${title}.`,
                    readingTime: `${Math.floor(Math.random() * 5) + 3} minutes`
                }));

            console.log('Processed titles:', titles);

            if (!titles || titles.length === 0) {
                throw new Error('No titles were generated');
            }

            res.json(titles);
        } catch (apiError) {
            console.error('Gemini API error:', apiError);
            
            // Fallback title generation system
            const backupTitles = generateBackupTitles(type, count);
            console.log('Using backup titles:', backupTitles);
            
            res.json(backupTitles);
        }
    } catch (error) {
        console.error('Detailed error in generateAITitles:', {
            error: error.message,
            stack: error.stack,
            type: type,
            count: count
        });
        throw new Error(`Failed to generate titles: ${error.message}`);
    }
}


// Random başlık endpoint'i
app.get('/api/topics/random', generalLimiter, async (req, res) => {
    try {
        const count = Math.min(parseInt(req.query.count) || 5, 10);
        const type = req.query.type || 'tech-trends';

        console.log('Received request for random topics:', {
            count: count,
            type: type,
            rawCount: req.query.count,
            rawType: req.query.type,
            apiKey: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
        });

        // Validate article type
        const validTypes = ['tech-trends', 'tech-leaders', 'investment-insights', 'personal-growth'];
        if (!validTypes.includes(type)) {
            console.log('Invalid article type received:', type);
            return res.status(400).json({ 
                error: 'Invalid article type',
                validTypes: validTypes,
                receivedType: type
            });
        }

        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            console.error('Gemini API key is missing');
            return res.status(500).json({
                error: 'Server configuration error',
                details: 'API key is not configured'
            });
        }

        // Generate titles using AI
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro"
        });

        // Prepare the prompt based on the type
        let prompt = '';
        let keywords = [];
        
        switch(type) {
            case 'tech-trends':
                keywords = ['artificial intelligence', 'blockchain', 'metaverse', 'IoT', 'cybersecurity', '5G', 'quantum computing', 'robotics'];
                prompt = `Generate ${count} creative and engaging article titles about technology trends and innovations.
                Main topics: ${keywords.join(', ')}
                
                Key points:
                1. Each title must be completely unique
                2. Titles should be between 3-8 words
                3. They must be engaging and clickable
                4. Reflect current technology trends
                5. Avoid clichés
                6. Each title should focus on a different topic
                7. Titles may include questions, claims, or discoveries`;
                break;

            case 'tech-leaders':
                keywords = ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Sam Altman', 'Satya Nadella'];
                prompt = `Generate ${count} creative and engaging article titles about technology leaders and visionaries.
                Featured names: ${keywords.join(', ')}
                
                Key points:
                1. Each title must be completely unique
                2. Highlight different aspects and projects of the leaders
                3. Titles should be between 3-8 words
                4. Reflect recent events and developments
                5. Avoid clichés
                6. Each title should focus on a different topic
                7. Titles may include predictions, analyses, or interviews`;
                break;

            case 'investment-insights':
                keywords = ['cryptocurrency', 'stock market', 'tech companies', 'startups', 'risk analysis', 'economic crisis'];
                prompt = `Generate ${count} creative and engaging article titles about technology investments and financial trends.
                Main topics: ${keywords.join(', ')}
                
                Key points:
                1. Each title must be completely unique
                2. Balance investment opportunities and risks
                3. Titles should be between 3-8 words
                4. Reflect current market dynamics
                5. Avoid clichés
                6. Each title should focus on a different topic
                7. Titles may include analysis, forecasts, or strategies`;
                break;

            case 'personal-growth':
                keywords = ['digital skills', 'career development', 'remote work', 'work-life balance', 'leadership'];
                prompt = `Generate ${count} creative and engaging article titles about personal and professional growth in the digital age.
                Main topics: ${keywords.join(', ')}
                
                Key points:
                1. Each title must be completely unique
                2. Focus on practical and applicable topics
                3. Titles should be between 3-8 words
                4. Reflect modern career challenges
                5. Avoid clichés
                6. Each title should focus on a different topic
                7. Titles may include tips, experiences, or strategies`;
                break;

            default:
                throw new Error(`Invalid article type: ${type}`);
        }

        prompt += `\nGeneral rules:
        1. Titles must be in English
        2. Each title should be on a new line
        3. No empty lines between titles
        4. No extra spaces at the beginning or end of titles
        5. Do not use numbering or bullet points
        6. Only return a list of titles
        7. Each title must be unique without repetition`;

        console.log('Sending prompt to Gemini API:', prompt);

        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            });

            if (!result?.response) {
                throw new Error('No response from Gemini API');
            }

            const text = result.response.text();
            if (!text) {
                throw new Error('Empty response text from Gemini API');
            }
            
            console.log('Raw response from Gemini API:', text);
            
            // Split and format titles
            const titles = text.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('-') && !line.match(/^\d+\./))
                .slice(0, count)
                .map(title => ({
                    title,
                    type,
                    keywords: getKeywordsForTitle(title),
                    summary: `A detailed analysis and review about ${title}.`,
                    readingTime: `${Math.floor(Math.random() * 5) + 3} minutes`
                }));

            console.log('Processed titles:', titles);

            if (!titles || titles.length === 0) {
                throw new Error('No titles were generated');
            }

            res.json(titles);
        } catch (apiError) {
            console.error('Gemini API error:', apiError);
            
            // Fallback title generation system
            const backupTitles = generateBackupTitles(type, count);
            console.log('Using backup titles:', backupTitles);
            
            res.json(backupTitles);
        }
    } catch (error) {
        console.error('Detailed error in /api/topics/random:', {
            error: error.message,
            stack: error.stack,
            query: req.query
        });
        
        res.status(500).json({ 
            error: 'Error occurred while generating titles',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});


// Yedek başlık üretme fonksiyonu
function generateBackupTitles(type, count) {
    const titles = [];
    const templates = {
        'tech-trends': [
            "OpenAI's GPT-4V Model: Visual Analysis Accuracy Reaches 95%",
            "NVIDIA's H200 GPU: AI Training Performance Doubled",
            "Apple's M3 Ultra Chip: 40-Core GPU Enhances Render Speed by 80%",
            "Tesla's FSD V12 Update: Autonomous Driving Safety Improved by 60%",
            "Microsoft's Azure AI Studio: Custom Model Training Accelerated by 70%",
            "Intel's Meteor Lake Chips: AI Performance Increases by 2.5x",
            "Meta's Llama 3 Model: Sets New Record with 1.4 Trillion Parameters",
            "Samsung's 3nm Chips: Energy Consumption Reduced by 45%",
            "Google's Gemini Pro: Multimodal AI Success Hits 85%",
            "AWS Graviton4 Processor: Server Performance Improved by 35%"
        ],
        'tech-leaders': [
            "Sam Altman's Q* Project: Roadmap to AGI",
            "Jensen Huang's AI Chip Strategy: 200% Growth Target for 2024",
            "Satya Nadella's Copilot Vision: AI Integration in Every App",
            "Mark Zuckerberg's Meta AI Plan: $100 Billion Investment in 2024",
            "Elon Musk's xAI Grok Model: Trained with Twitter Data",
            "Tim Cook's Vision Pro Strategy: The Spatial Computing Revolution",
            "Sundar Pichai's Bard Advanced Announcement: A GPT-4 Competitor",
            "Lisa Su's AI GPU Roadmap: Details on RDNA 4 Architecture",
            "Pat Gelsinger's IDM 2.0 Plan: Intel's AI Chip Manufacturing Strategy",
            "Andy Jassy's AWS AI Stack Vision: Fully Integrated AI Infrastructure"
        ],
        'investment-insights': [
            "NVIDIA's AI Chip Sales: 300% Growth in Q4",
            "Microsoft's OpenAI Investment: $13 Billion Additional Funding",
            "Meta's AI Infrastructure Investment: $25 Billion Budget for 2024",
            "Apple's Vision Pro Production: Initial Batch of 400,000 Units",
            "Tesla's Dojo Supercomputer: Targeting 1,000 Systems in 2024",
            "Google's TPU v5 Investment: $10 Billion in AI Infrastructure",
            "Amazon's Bedrock Platform: 40% Growth in Enterprise AI Market",
            "AMD's AI GPU Market Share: Targeting 50% in 2024",
            "Intel's Fab Investments: $20 Billion Expansion",
            "Anthropic's Series D Funding Round: $4.1 Billion Valuation"
        ]
    };

    // Get titles for the selected type and shuffle them
    const selectedTemplates = templates[type] || templates['tech-trends'];
    const shuffled = selectedTemplates.sort(() => Math.random() - 0.5);
    
    // Return the requested number of titles
    return shuffled.slice(0, count).map(title => ({
        title,
        type,
        keywords: getKeywordsForTitle(title),
        summary: `A detailed analysis and evaluation of ${title}.`,
        readingTime: `${Math.floor(Math.random() * 5) + 3} minutes`
    }));
}


// Başlık için anahtar kelimeler üretme fonksiyonunu güncelle
function getKeywordsForTitle(title) {
    const techKeywords = {
        'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural networks'],
        'hardware': ['processor', 'GPU', 'chip', 'hardware', 'architecture'],
        'cloud': ['cloud computing', 'serverless', 'edge computing', 'container'],
        'security': ['cybersecurity', 'encryption', 'privacy', 'zero-trust'],
        'mobile': ['5G', '6G', 'mobile technology', 'telecommunications'],
        'software': ['software', 'platform', 'framework', 'API', 'microservices']
    };

    const titleLower = title.toLowerCase();
    let matchedKeywords = [];

    // Identify technology categories mentioned in the title
    Object.entries(techKeywords).forEach(([category, keywords]) => {
        if (keywords.some(keyword => titleLower.includes(keyword.toLowerCase()))) {
            matchedKeywords.push(...keywords.slice(0, 2));
        }
    });

    // Check for specific company and product names
    const companies = ['OpenAI', 'NVIDIA', 'Google', 'Microsoft', 'Apple', 'Meta', 'Intel', 'AMD', 'Tesla'];
    const matchedCompanies = companies.filter(company => 
        title.includes(company)
    );

    if (matchedCompanies.length > 0) {
        matchedKeywords.push(...matchedCompanies);
    }

    // If not enough keywords are found, add general technology keywords
    if (matchedKeywords.length < 3) {
        matchedKeywords.push('technology', 'innovation', 'digital transformation');
    }

    // Return unique keywords, limited to 5
    return [...new Set(matchedKeywords)].slice(0, 5);
}


// Makale üretme fonksiyonunu güncelleme
async function generateArticle(topic, tone, length) {
    try {
        console.log('Starting article generation:', { topic, tone, length });

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Customize the prompt based on the article topic
        let promptPrefix = '';
        if (topic.toLowerCase().includes('elon musk') || topic.toLowerCase().includes('jeff bezos')) {
            promptPrefix = 'Write an article about technology leaders and their impact on the tech world. ';
        } else if (topic.toLowerCase().includes('crypto') || topic.toLowerCase().includes('investment')) {
            promptPrefix = 'Write an analytical article about investment opportunities and market trends. ';
        } else if (topic.toLowerCase().includes('growth') || topic.toLowerCase().includes('career')) {
            promptPrefix = 'Write an inspiring article about personal and professional growth. ';
        } else {
            promptPrefix = 'Write an informative article about technology trends and innovations. ';
        }

        const prompt = `${promptPrefix}

Topic: ${topic}
Length: ${length} words
Tone: ${tone}

The article should include the following sections, starting each section with ##:

## Introduction and Key Points
## Current State Analysis
## Expert Opinions and Data
## Future Impacts
## Practical Recommendations

Key considerations:
1. Use a fluent and clear language
2. Include specific examples and data
3. Incorporate expert quotes and opinions
4. Provide actionable recommendations
5. Maintain a professional yet approachable tone
6. Focus on practical applications
7. Conclude with clear takeaways

Write the article in English and return it in markdown format.`;

        console.log('Sending API request...');

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        if (!text) {
            throw new Error('Generated content is empty');
        }

        // Add title
        text = `# ${topic}\n\n${text}`;

        // Humanize the text
        console.log('Humanizing text...');
        const humanizedText = await humanizeText(text);

        return {
            id: Date.now().toString(),
            topic: topic,
            content: humanizedText,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Article generation error:', error);
        throw new Error(`Error generating article: ${error.message}`);
    }
}


// Makale üretme endpoint'i
app.post('/api/articles/generate', generateLimiter, async (req, res) => {
    try {
        const waitTime = getWaitTime();
        if (waitTime > 0) {
            return res.status(429).json({ 
                error: 'Rate limit exceeded',
                waitTime: waitTime,
                message: `Please wait ${Math.ceil(waitTime / 1000)} seconds`,
                nextRequestTime: lastRequestTime + MIN_REQUEST_INTERVAL
            });
        }

        const { topic, tone = 'professional', length = 1000 } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic not specified' });
        }

        lastRequestTime = Date.now();
        const article = await generateArticle(topic, tone, length);
        
        // Successful request, decrease wait time
        decreaseWaitTime();

        // Create safe filename
        const safeFileName = Buffer.from(topic).toString('base64').replace(/[+/=]/g, '');
        const fileName = `${article.id}-${safeFileName}.md`;
        const filePath = path.join(articlesDir, fileName);

        // Save with UTF-8 encoding
        await fs.writeFile(filePath, article.content, 'utf8');

        res.json(article);

    } catch (error) {
        console.error('Error in generate endpoint:', error);
        increaseWaitTime();
        res.status(500).json({ 
            error: 'Failed to generate article',
            message: error.message
        });
    }
});

// Makaleleri listeleme endpoint'i
app.get('/api/articles', async (req, res) => {
    try {
        const files = await fs.readdir(articlesDir);
        const articles = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(articlesDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const [timestamp, ...rest] = file.split('-');
                const topic = Buffer.from(rest.join('-').replace('.md', ''), 'base64').toString();
                
                return {
                    id: timestamp,
                    topic,
                    content,
                    createdAt: new Date(parseInt(timestamp)).toISOString()
                };
            })
        );
        
        // Sort by creation date, newest first
        articles.sort((a, b) => b.id - a.id);
        
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ 
            error: 'Failed to fetch articles',
            message: error.message 
        });
    }
});

// Makale silme endpoint'i
app.delete('/api/articles/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        
        if (!articleId) {
            return res.status(400).json({ error: 'Makale ID\'si belirtilmedi' });
        }

        const files = await fs.readdir(articlesDir);
        const articleFile = files.find(file => file.startsWith(articleId));

        if (!articleFile) {
            return res.status(404).json({ error: 'Makale bulunamadı' });
        }

        const filePath = path.join(articlesDir, articleFile);
        
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log('Makale başarıyla silindi:', articleFile);
            res.json({ 
                success: true,
                message: 'Makale başarıyla silindi',
                deletedFile: articleFile 
            });
        } catch (error) {
            console.error('Dosya silme hatası:', error);
            res.status(500).json({ 
                error: 'Makale silinirken bir hata oluştu',
                details: error.message 
            });
        }
    } catch (error) {
        console.error('Silme işlemi hatası:', error);
        res.status(500).json({ 
            error: 'Beklenmeyen bir hata oluştu',
            details: error.message 
        });
    }
});

const techPersonalities = [
  {
    name: "Jeff Bezos",
    role: "Amazon Founder",
    keywords: ["leadership", "e-commerce", "innovation", "space technology", "Blue Origin"]
  },
  {
    name: "Elon Musk",
    role: "Tesla & SpaceX CEO",
    keywords: ["electric vehicles", "space exploration", "artificial intelligence", "Neuralink"]
  },
  {
    name: "Mark Zuckerberg",
    role: "Meta CEO",
    keywords: ["social media", "metaverse", "virtual reality", "connectivity"]
  },
  {
    name: "Satya Nadella",
    role: "Microsoft CEO",
    keywords: ["cloud computing", "enterprise software", "AI", "leadership"]
  },
  {
    name: "Sam Altman",
    role: "OpenAI CEO",
    keywords: ["artificial intelligence", "AGI", "machine learning", "tech ethics"]
  }
];

const personalityTitleTemplates = [
  "{name} Reveals Why {keyword} Is the Future of Tech",
  "The {keyword} Secret That Made {name} Successful",
  "{name}'s Surprising Take on {keyword} Changes Everything",
  "Why {name} Thinks {keyword} Will Transform Business",
  "How {name} Uses the {keyword} Method to Stay Ahead",
  "{name} Says This {keyword} Rule Makes Success Inevitable",
  "Inside {name}'s Revolutionary Approach to {keyword}",
  "{name}'s {keyword} Strategy That's Disrupting Tech"
];

// Function to generate a description for a title
function generateTitleDescription(title, keywords) {
  const description = {
    title: title,
    keywords: keywords,
    summary: `Discover the insights and strategies behind ${title.toLowerCase()}, exploring how modern technology and leadership principles intersect in today's rapidly evolving tech landscape.`,
    readingTime: Math.floor(Math.random() * 5) + 3 + " minutes",
    category: keywords[0]
  };
  return description;
}

// Enhanced random title generation function
function generateTechPersonalityTitle() {
  const personality = techPersonalities[Math.floor(Math.random() * techPersonalities.length)];
  const template = personalityTitleTemplates[Math.floor(Math.random() * personalityTitleTemplates.length)];
  const keyword = personality.keywords[Math.floor(Math.random() * personality.keywords.length)];
  
  const title = template
    .replace("{name}", personality.name)
    .replace("{keyword}", keyword);
    
  return generateTitleDescription(title, [
    ...personality.keywords.slice(0, 3),
    "leadership",
    "technology"
  ]);
}

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Articles directory:', articlesDir);
}); 