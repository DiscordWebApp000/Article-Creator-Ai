'use client';

import React, { useState } from 'react';
import { getRandomTopics, getPersonalityTitles } from '../api/videos';

type TitleType = 'tech' | 'personality';

export default function TitleGenerator() {
    const [titles, setTitles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [titleType, setTitleType] = useState<TitleType>('tech');
    const [count, setCount] = useState(5);

    const generateTitles = async () => {
        setLoading(true);
        try {
            const result = titleType === 'tech' 
                ? await getRandomTopics(count)
                : await getPersonalityTitles(count);
            setTitles(result);
        } catch (error) {
            console.error('Error generating titles:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Title Generator</h2>
                
                <div className="space-y-6">
                    {/* Title Type Selection */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setTitleType('tech')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                titleType === 'tech'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                            }`}
                        >
                            Technology Topics
                        </button>
                        <button
                            onClick={() => setTitleType('personality')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                titleType === 'personality'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                            }`}
                        >
                            Tech Personalities
                        </button>
                    </div>

                    {/* Title Count Selection */}
                    <div>
                        <label className="text-lg font-medium text-foreground mb-2 block">
                            Number of Titles
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {[2, 4, 6, 8, 10].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setCount(num)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                        count === num
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:border-primary/50 hover:bg-muted'
                                    }`}
                                >
                                    <span className="font-medium">{num}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateTitles}
                        disabled={loading}
                        className="w-full btn-primary"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                                Generating Titles...
                            </div>
                        ) : (
                            "Generate Titles"
                        )}
                    </button>

                    {/* Generated Titles */}
                    {titles.length > 0 && (
                        <div className="mt-6 space-y-4">
                            {titles.map((title, index) => (
                                <div key={index} className="rounded-lg border bg-card p-4 hover:shadow-md transition-all">
                                    {titleType === 'tech' ? (
                                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                                    ) : (
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2">{title.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-3">{title.summary}</p>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {title.keywords.map((keyword: string, idx: number) => (
                                                    <span 
                                                        key={idx} 
                                                        className="bg-muted px-2 py-1 rounded-full text-xs font-medium text-muted-foreground"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Reading time: {title.readingTime}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} 