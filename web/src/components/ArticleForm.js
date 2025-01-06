import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, CircularProgress, Typography, Alert } from '@mui/material';

const ArticleForm = ({ onArticleGenerated }) => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [waitTime, setWaitTime] = useState(0);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Lütfen bir konu girin');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/articles/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setWaitTime(data.waitTime);
                    setCountdown(Math.ceil(data.waitTime / 1000));
                    throw new Error(data.message);
                }
                throw new Error(data.error || 'Makale üretilirken bir hata oluştu');
            }

            onArticleGenerated(data);
            setTopic('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <TextField
                fullWidth
                label="Konu"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading || countdown > 0}
                sx={{ mb: 2 }}
            />
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {countdown > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Yeni makale üretmek için {countdown} saniye beklemeniz gerekiyor...
                </Alert>
            )}
            <Button
                type="submit"
                variant="contained"
                disabled={loading || !topic.trim() || countdown > 0}
                sx={{ mr: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Makale Üret'}
            </Button>
            {loading && (
                <Typography variant="body2" component="span" color="text.secondary">
                    Makale üretiliyor...
                </Typography>
            )}
        </Box>
    );
};

export default ArticleForm; 