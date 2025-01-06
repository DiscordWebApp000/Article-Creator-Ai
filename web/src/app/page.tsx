"use client";

import { useState, useEffect } from "react";
import { generateArticle, getArticles, deleteArticle, getRandomTopics } from "./api/videos";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReactNode } from 'react';
import { ThemeToggle } from './components/theme-toggle';
import TitleGenerator from './components/TitleGenerator';

interface Article {
  id: string;
  topic: string;
  tone?: string;
  length?: number;
  content: string;
  createdAt: string;
}

interface MarkdownProps {
  children: ReactNode;
  inline?: boolean;
}

interface TopicResponse {
    title: string;
    type: string;
    keywords: string[];
    summary: string;
    readingTime: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'blockchain', name: 'Blockchain' },
  { id: 'ai', name: 'Artificial Intelligence' },
  { id: 'web3', name: 'Web3' },
  { id: 'defi', name: 'DeFi' },
  { id: 'nft', name: 'NFT' },
  { id: 'metaverse', name: 'Metaverse' },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [randomTopics, setRandomTopics] = useState<(string | TopicResponse)[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [length, setLength] = useState(1000);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customTopic, setCustomTopic] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const articlesPerPage = 5;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticleType, setSelectedArticleType] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const generateNewTopics = async () => {
    try {
        setIsLoadingTopics(true);
        setError(null);

        // Get existing titles
        const existingTitles = articles.map(article => article.topic.toLowerCase());

        // Seçili tür veya varsayılan olarak tech-trends ile başlık üret
        const type = selectedArticleType || 'tech-trends';
        const topics = await getRandomTopics(10, type);

        // Başlıkları formatla
        const formattedTopics = topics.map((topic: TopicResponse) => 
            topic.title
        ).filter((title: string) => !existingTitles.includes(title.toLowerCase()));

        if (formattedTopics.length === 0) {
            throw new Error("Could not generate unique titles. Please try again.");
        }

        setRandomTopics(formattedTopics);
        setSelectedTopic(null);
    } catch (err) {
        setError(typeof err === 'string' ? err : 
            err instanceof Error ? err.message : 
            "Error generating topics. Please try again.");
    } finally {
        setIsLoadingTopics(false);
    }
  };

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError("Error loading articles");
    }
  };

  const handleGenerate = async () => {
    const topicToUse = isCustomMode ? customTopic : selectedTopic;
    
    if (!topicToUse) {
      setError(isCustomMode ? "Please enter a topic" : "No topic selected");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const generatedArticle = await generateArticle(topicToUse, "professional", length);
      setArticles(prev => [generatedArticle, ...prev]);
      if (isCustomMode) {
        setCustomTopic('');
      }
    } catch (err) {
      setError("An error occurred while generating the article");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      setError("An error occurred while deleting the article");
    }
  };

  // Filter articles based on selected category
  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    
    const title = article.topic.toLowerCase();
    switch (selectedCategory) {
      case 'blockchain':
        return title.includes('blockchain');
      case 'ai':
        return title.includes('ai') || title.includes('artificial intelligence') || title.includes('machine learning');
      case 'web3':
        return title.includes('web3') || title.includes('web 3');
      case 'defi':
        return title.includes('defi') || title.includes('decentralized finance');
      case 'nft':
        return title.includes('nft') || title.includes('token');
      case 'metaverse':
        return title.includes('metaverse') || title.includes('virtual world');
      case 'technology-trends':
        return title.includes('technology') || title.includes('trends');
      case 'tech-leaders':
        return title.includes('tech leaders') || title.includes('leaders');
      case 'investment-insights':
        return title.includes('investment') || title.includes('insights');
      case 'personal-growth':
        return title.includes('personal growth') || title.includes('growth');
      default:
        return true;
    }
  });

  console.log('Filtered Articles:', filteredArticles);

  // Update pagination calculations to use filtered articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setExpandedArticle(null); // Close expanded article when changing page
  };

  const toggleArticle = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  const articleTypes = [
    {
        id: 'tech-trends',
        title: 'Technology Trends',
        description: 'The latest technology trends, innovations, and recent developments in the digital world.',
        keywords: [
            'metaverse', 'NFT', 'IoT', 'artificial intelligence', 'virtual reality',
            'blockchain', 'robotics', 'autonomous systems', '5G', 'quantum computing',
            'cybersecurity', 'cloud technology', 'big data'
        ],
        promptPrefix: 'Write a trending technology article about'
    },
    {
        id: 'tech-leaders',
        title: 'Tech Leaders',
        description: 'Stories, strategies, and insights from leading figures in the tech industry.',
        keywords: [
            'Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Sam Altman', 'Satya Nadella',
            'success strategy', 'leadership', 'innovation', 'entrepreneurship', 'technology vision',
            'management', 'startup', 'company culture'
        ],
        promptPrefix: 'Write an engaging article about tech leaders focusing on'
    },
    {
        id: 'investment-insights',
        title: 'Investment Insights',
        description: 'Investment opportunities, analyses, and forecasts in the tech and finance industries.',
        keywords: [
            'cryptocurrency', 'stock market', 'tech companies', 'startup investments',
            'risk analysis', 'market trends', 'economic crisis', 'geopolitical impacts',
            'investment strategy', 'financial technology', 'venture capital'
        ],
        promptPrefix: 'Write an investment analysis article about'
    },
    {
        id: 'personal-growth',
        title: 'Personal Growth',
        description: 'Strategies for personal and professional development in the digital age.',
        keywords: [
            'digital skills', 'career development', 'remote work', 'productivity',
            'work-life balance', 'leadership skills', 'networking', 'communication',
            'time management', 'stress management', 'motivation', 'learning techniques'
        ],
        promptPrefix: 'Write a personal development article about'
    }
];


  const handleArticleTypeSelect = async (typeId: string) => {
    setSelectedArticleType(typeId);
    setIsCustomMode(false);
    setError(null);
    setSelectedTopic(null);
    
    try {
        setIsLoadingTopics(true);
        const topics = await getRandomTopics(10, typeId);
        const formattedTopics = topics.map((topic: string | TopicResponse) => 
            typeof topic === 'string' ? topic : topic.title
        );
        setRandomTopics(formattedTopics);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate topics for selected type");
    } finally {
        setIsLoadingTopics(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">AI Article Generator</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="absolute top-0 right-0 p-4 text-destructive hover:text-destructive/80"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Article Creation and Types Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create New Article Section */}
          <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Create New Article</h2>
              
              <div className="space-y-6">
                {/* Topic Selection Mode Toggle */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => {
                      setIsCustomMode(false);
                      setCustomTopic('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      !isCustomMode
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    AI Suggestions
                  </button>
                  <button
                    onClick={() => {
                      setIsCustomMode(true);
                      setSelectedTopic(null);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      isCustomMode
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Custom Topic
                  </button>
                </div>

                {/* Custom Topic Input or AI Suggestions based on mode */}
                {isCustomMode ? (
                  <div>
                    <label className="text-lg font-medium text-foreground mb-2 block">
                      Enter Your Topic
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Enter your article topic..."
                        className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customTopic.trim()) {
                            handleGenerate();
                          }
                        }}
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={!customTopic.trim() || isGenerating}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[100px] flex items-center justify-center"
                      >
                        {isGenerating ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          "Create"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-medium text-foreground">
                        AI Suggested Titles
                      </label>
                      <button
                        onClick={generateNewTopics}
                        disabled={isLoadingTopics}
                        className="btn-secondary"
                      >
                        {isLoadingTopics ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                            Generating...
                          </div>
                        ) : (
                          "Generate New Titles"
                        )}
                      </button>
                    </div>

                    {isLoadingTopics ? (
                      <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                      </div>
                    ) : randomTopics.length > 0 ? (
                      <div className="grid gap-3">
                        {randomTopics.map((topic: string | TopicResponse, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedTopic(typeof topic === 'string' ? topic : topic.title)}
                            className={`group relative w-full rounded-lg p-4 text-left transition-all ${
                              selectedTopic === (typeof topic === 'string' ? topic : topic.title)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start">
                                <span className="mr-3 mt-1 font-mono text-sm opacity-50">
                                  {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <span className="flex-1">
                                  {typeof topic === 'string' ? topic : topic.title}
                                </span>
                              </div>
                              {typeof topic !== 'string' && (
                                <div className="mt-2">
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {topic.keywords.map((keyword: string, idx: number) => (
                                      <span 
                                        key={idx}
                                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Tahmini okuma süresi: {topic.readingTime}
                                  </p>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center text-muted-foreground">
                        Click "Generate New Titles" to generate new titles
                      </div>
                    )}
                  </div>
                )}

                {/* Length Selector */}
                <div>
                  <label className="text-lg font-medium text-foreground mb-2 block">
                    Article Length
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 800, label: 'Short', desc: '800 words' },
                      { value: 1000, label: 'Medium', desc: '1000 words' },
                      { value: 1500, label: 'Long', desc: '1500 words' },
                      { value: 2000, label: 'Extra', desc: '2000 words' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLength(option.value)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                          length === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground mt-1">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedTopic || isGenerating}
                  className="btn-primary w-full"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                      Generating Article...
                    </div>
                  ) : (
                    "Generate Article"
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Article Types Section */}
          <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Article Types</h2>
              
              <div className="space-y-4">
                {articleTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleArticleTypeSelect(type.id)}
                    className={`w-full text-left rounded-lg border p-4 hover:shadow-md transition-all ${
                      selectedArticleType === type.id 
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-2">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                    {selectedArticleType === type.id && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {type.keywords.map((keyword, idx) => (
                          <span 
                            key={idx}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="text-lg font-medium text-foreground mb-2 block">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <section className="space-y-4">
          {currentArticles.map((article) => (
            <article
              key={article.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleArticle(article.id)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{article.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(article.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(article.id);
                    }}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${
                      expandedArticle === article.id ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {expandedArticle === article.id && (
                <div className="border-t p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-4">{children}</p>,
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded">{children}</code>,
                      }}
                    >
                      {article.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
