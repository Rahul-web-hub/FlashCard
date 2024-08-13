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
} from '@mui/material';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import './Theme.css';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

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
          <div
            className={`flashcard-container ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
              <div className="flashcard-front">
                <Typography variant="h6" align="center">
                  {flashcards[currentCard].question}
                </Typography>
              </div>
              <div className="flashcard-back">
                <Typography variant="h6" align="center">
                  {flashcards[currentCard].answer}
                </Typography>
              </div>
            </div>
            <Box display="flex" justifyContent="space-between" p={2} flexWrap="wrap">
              <IconButton onClick={prevCard}>
                <ArrowBack />
              </IconButton>
              <IconButton onClick={nextCard}>
                <ArrowForward />
              </IconButton>
              <IconButton color="error" onClick={() => deleteFlashcard(flashcards[currentCard].id)}>
                <Delete />
              </IconButton>
              <Button color="success" onClick={() => markAsKnown(flashcards[currentCard].id)}>
                Known
              </Button>
              <Button color="error" onClick={() => markAsUnknown(flashcards[currentCard].id)}>
                Unknown
              </Button>
            </Box>
          </div>
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
