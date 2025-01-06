import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    IconButton, 
    Card, 
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticleList = ({ articles, onDelete }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleDeleteClick = (article) => {
        setSelectedArticle(article);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await onDelete(selectedArticle.id);
            setDeleteDialogOpen(false);
            setSelectedArticle(null);
            setSnackbarOpen(true);
        } catch (err) {
            setError('Makale silinirken bir hata oluştu');
        }
    };

    const handleClose = () => {
        setDeleteDialogOpen(false);
        setSelectedArticle(null);
        setError('');
    };

    return (
        <Box>
            {articles.map((article) => (
                <Card key={article.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {article.topic}
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    {new Date(article.createdAt).toLocaleString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Box>
                            <IconButton 
                                onClick={() => handleDeleteClick(article)}
                                aria-label="delete"
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <Box className="markdown-content" sx={{ 
                            '& h1': {
                                display: 'none' // Başlığı gizle çünkü zaten üstte gösteriyoruz
                            },
                            '& h2': {
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mt: 4,
                                mb: 2,
                                '&:first-of-type': {
                                    mt: 0
                                }
                            },
                            '& h3': {
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                mt: 3,
                                mb: 2
                            },
                            '& p': {
                                fontSize: '1rem',
                                lineHeight: 1.7,
                                mb: 2,
                                '&:last-child': {
                                    mb: 0
                                }
                            },
                            '& strong': {
                                color: 'primary.main',
                                fontWeight: 'bold'
                            },
                            '& ul, & ol': {
                                pl: 3,
                                mb: 2,
                                listStylePosition: 'outside',
                                '& ul, & ol': {
                                    mb: 0
                                }
                            },
                            '& li': {
                                mb: 1,
                                pl: 1,
                                display: 'list-item',
                                '& > p': {
                                    mb: 0
                                },
                                '&:last-child': {
                                    mb: 0
                                }
                            },
                            '& blockquote': {
                                borderLeft: '4px solid',
                                borderColor: 'grey.300',
                                pl: 2,
                                py: 0.5,
                                my: 2,
                                mx: 0,
                                '& p': {
                                    mb: 0
                                }
                            }
                        }}>
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({node, ...props}) => <Typography variant="h3" {...props} />,
                                    h2: ({node, ...props}) => <Typography variant="h4" component="h2" {...props} />,
                                    h3: ({node, ...props}) => <Typography variant="h5" component="h3" {...props} />,
                                    p: ({node, ...props}) => <Typography variant="body1" component="p" gutterBottom {...props} />,
                                    strong: ({node, ...props}) => <Box component="strong" {...props} />,
                                    ul: ({node, ...props}) => <Box component="ul" {...props} />,
                                    ol: ({node, ...props}) => <Box component="ol" {...props} />,
                                    li: ({node, children, ...props}) => (
                                        <Box 
                                            component="li" 
                                            {...props}
                                            sx={{
                                                '&::marker': {
                                                    color: 'text.primary'
                                                }
                                            }}
                                        >
                                            {typeof children === 'string' ? (
                                                <Typography component="span" variant="body1">
                                                    {children}
                                                </Typography>
                                            ) : children}
                                        </Box>
                                    )
                                }}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            <Dialog
                open={deleteDialogOpen}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Makaleyi Sil
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        "{selectedArticle?.topic}" başlıklı makaleyi silmek istediğinizden emin misiniz?
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>İptal</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Makale başarıyla silindi"
            />
        </Box>
    );
};

export default ArticleList; 