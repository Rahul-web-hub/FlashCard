import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import './Theme.css';

const API_URL = import.meta.env.VITE_API_URL;

function FlashCard() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

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

  return (
    <Box mt={4}>
      <Container maxWidth="sm">
        <Typography variant="h1" align="center" gutterBottom>
          Flashcard App
        </Typography>

        {flashcards.length > 0 ? (
          <div
            className={`flashcard-container ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
              <div className="flashcard-front">
                <Typography variant="h4" align="center">
                  {flashcards[currentCard].question}
                </Typography>
              </div>
              <div className="flashcard-back">
                <Typography variant="h4" align="center">
                  {flashcards[currentCard].answer}
                </Typography>
              </div>
            </div>
            <Box display="flex" justifyContent="space-between" p={2}>
              <Button startIcon={<ArrowBack />} onClick={prevCard}>
                Previous
              </Button>
              <Button endIcon={<ArrowForward />} onClick={nextCard}>
                Next
              </Button>
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={() => deleteFlashcard(flashcards[currentCard].id)}
              >
                Delete
              </Button>
            </Box>
          </div>
        ) : (
          <Typography variant="h4" align="center">
            No flashcards available
          </Typography>
        )}

        <Box mt={3}>
          <Typography variant="h4" align="center" gutterBottom>
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
          <Box mt={2}>
            <Button variant="contained" color="primary" fullWidth onClick={addFlashcard}>
              Add Flashcard
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default FlashCard;
