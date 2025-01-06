interface Article {
    id: string;
    topic: string;
    tone?: string;
    length?: number;
    content: string;
    createdAt: string;
}

export interface TitleDescription {
    title: string;
    type: string;
    keywords: string[];
    summary: string;
    readingTime: string;
    category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getArticles = async () => {
    const response = await fetch(`${API_URL}/api/articles`);
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    return response.json();
};

export async function generateArticle(topic: string, tone: string = 'professional', length: number = 1000) {
    try {
        const response = await fetch(`${API_URL}/api/articles/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic, tone, length }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 429) {
                throw new Error(`Rate limit exceeded. ${errorData.message}`);
            }
            throw new Error(errorData.error || 'Failed to generate article');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating article:', error);
        throw error;
    }
}

export const deleteArticle = async (id: string) => {
    const response = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete article');
    }

    return response.json();
};

export async function getRandomTopics(count: number = 5, type: string = 'tech-trends'): Promise<TitleDescription[]> {
    try {
        console.log('Fetching random topics:', { count, type });
        
        const response = await fetch(`${API_URL}/api/topics/random?count=${count}&type=${type}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch random topics');
        }

        const data = await response.json();
        console.log('Received topics:', data);

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid response format or empty response');
        }

        return data;
    } catch (error) {
        console.error('Error fetching random topics:', error);
        throw error;
    }
}

export async function getPersonalityTitles(count: number = 5): Promise<TitleDescription[]> {
    try {
        console.log('Fetching personality titles:', { count });
        
        const response = await fetch(`${API_URL}/api/topics/personalities?count=${count}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch personality titles');
        }

        const data = await response.json();
        console.log('Received personality titles:', data);

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid response format or empty response');
        }

        return data;
    } catch (error) {
        console.error('Error fetching personality titles:', error);
        throw error;
    }
} 