import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import { styled } from '@mui/system';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

const FlashcardContainer = styled(Paper)(({ theme }) => ({
  perspective: '1000px',
  width: '100%',
  height: '300px',
  cursor: 'pointer',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const FlashcardContent = styled(Box)(({ theme, flipped }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.6s',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
}));

const FlashcardBack = styled(FlashcardContent)(({ theme }) => ({
  transform: 'rotateY(180deg)',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

function FlashCard() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [progress, setProgress] = useState(new Map());

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get(`${API_URL}/flashcards`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const addFlashcard = async () => {
    try {
      await axios.post(`${API_URL}/flashcards`, {
        question: newQuestion,
        answer: newAnswer,
      });
      setNewQuestion('');
      setNewAnswer('');
      fetchFlashcards();
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const deleteFlashcard = async (id) => {
    try {
      await axios.delete(`${API_URL}/flashcards/${id}`);
      fetchFlashcards();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  };

  const markAsKnown = (id) => {
    setProgress((prev) => new Map(prev).set(id, true));
    nextCard();
  };

  const markAsUnknown = (id) => {
    setProgress((prev) => new Map(prev).set(id, false));
    nextCard();
  };

  const reviewUnknownCards = () => {
    const unknownCards = flashcards.filter((card) => progress.get(card.id) === false);
    if (unknownCards.length > 0) {
      setFlashcards(unknownCards);
      setCurrentCard(0);
    } else {
      alert('No unknown cards to review!');
    }
  };

  const knownCount = Array.from(progress.values()).filter((v) => v === true).length;
  const unknownCount = Array.from(progress.values()).filter((v) => v === false).length;

  return (
    <Box mt={4}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Flashcard App
        </Typography>

        {flashcards.length > 0 ? (
          <Box mb={4}>
            <FlashcardContainer
              elevation={3}
              onClick={() => setFlipped(!flipped)}
            >
              <FlashcardContent flipped={!flipped}>
                <Typography variant="h5" align="center">
                  {flashcards[currentCard].question}
                </Typography>
              </FlashcardContent>
              <FlashcardBack flipped={flipped}>
                <Typography variant="h5" align="center">
                  {flashcards[currentCard].answer}
                </Typography>
              </FlashcardBack>
            </FlashcardContainer>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <IconButton onClick={prevCard}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Button color="success" onClick={() => markAsKnown(flashcards[currentCard].id)}>
                  Known
                </Button>
                <Button color="error" onClick={() => markAsUnknown(flashcards[currentCard].id)}>
                  Unknown
                </Button>
              </Box>
              <IconButton onClick={nextCard}>
                <ArrowForward />
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="center" mt={1}>
              <IconButton color="error" onClick={() => deleteFlashcard(flashcards[currentCard].id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" align="center">
            No flashcards available
          </Typography>
        )}
        <Box mt={3}>
          <Typography variant="body1" align="center">
            Known: {knownCount} | Unknown: {unknownCount}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h5" align="center" gutterBottom>
            Add New Flashcard
          </Typography>
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <TextField
            label="Answer"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={addFlashcard}>
                Add Flashcard
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="secondary" fullWidth onClick={reviewUnknownCards}>
                Review Unknown Cards
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default FlashCard;