// "use client";

// import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import {
//   Box,
//   Button,
//   Container,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   TextField,
//   Grid,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useRouter } from "next/navigation";

// export default function GenerateQuestionsPage() {
//   const { isLoaded, isSignedIn } = useUser();
//   const router = useRouter();

//   const [text, setText] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [filteredQuestions, setFilteredQuestions] = useState([]);
//   const [difficultyFilter, setDifficultyFilter] = useState("");
//   const [importanceFilter, setImportanceFilter] = useState("");

//   // Handle text submission to generate questions
//   const handleSubmit = async () => {
//     try {
//       const response = await fetch("/api/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("console response:", data.questions.questions);
//         setQuestions(data.questions.questions);
//         setFilteredQuestions(data.questions.questions); // Initialize with full set of questions
//       } else {
//         console.error("Failed to generate questions");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   // UseEffect to apply filters whenever the filter values change
//   useEffect(() => {
//     let filtered = questions;

//     if (difficultyFilter) {
//       filtered = filtered.filter(
//         (question) =>
//           question.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
//       );
//     }

//     if (importanceFilter) {
//       filtered = filtered.filter(
//         (question) =>
//           question.importance.toLowerCase() === importanceFilter.toLowerCase()
//       );
//     }

//     setFilteredQuestions(filtered);
//   }, [difficultyFilter, importanceFilter, questions]); // Trigger filtering when any of these change

//   // Redirect to sign-in page if not signed in
//   if (!isLoaded) return null; // Wait for Clerk to load
//   if (!isSignedIn) {
//     router.push("/sign-in");
//     return null;
//   }

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
//         Generate Questions
//       </Typography>

//       {/* Text Submission Form */}
//       <Box sx={{ mb: 4 }}>
//         <TextField
//           label="Enter text to generate questions"
//           multiline
//           fullWidth
//           rows={4}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <Button variant="contained" color="primary" onClick={handleSubmit}>
//           Generate Questions
//         </Button>
//       </Box>

//       {/* Filters */}
//       <Box sx={{ mb: 4 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth>
//               <InputLabel>Filter by Difficulty</InputLabel>
//               <Select
//                 value={difficultyFilter}
//                 onChange={(e) => setDifficultyFilter(e.target.value)}
//                 label="Filter by Difficulty"
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="easy">Easy</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="hard">Hard</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth>
//               <InputLabel>Filter by Importance</InputLabel>
//               <Select
//                 value={importanceFilter}
//                 onChange={(e) => setImportanceFilter(e.target.value)}
//                 label="Filter by Importance"
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="high">High</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Questions Display */}
//       {filteredQuestions.length > 0 ? (
//         filteredQuestions.map((item, index) => (
//           <Accordion key={index}>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls={`panel${index}-content`}
//               id={`panel${index}-header`}
//             >
//               <Typography>{item.question}</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography>
//                 <strong>Answer:</strong> {item.answer}
//               </Typography>
//               <Typography>
//                 <strong>Difficulty:</strong> {item.difficulty}
//               </Typography>
//               <Typography>
//                 <strong>Importance:</strong> {item.importance}
//               </Typography>
//             </AccordionDetails>
//           </Accordion>
//         ))
//       ) : (
//         <Typography>
//           No questions available. Please generate some questions.
//         </Typography>
//       )}
//     </Container>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function GenerateQuestionsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [importanceFilter, setImportanceFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle text submission to generate questions
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions.questions);
        setFilteredQuestions(data.questions.questions);
      } else {
        console.error("Failed to generate questions");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = questions;

    if (difficultyFilter) {
      filtered = filtered.filter(
        (question) =>
          question.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    if (importanceFilter) {
      filtered = filtered.filter(
        (question) =>
          question.importance.toLowerCase() === importanceFilter.toLowerCase()
      );
    }

    setFilteredQuestions(filtered);
  }, [difficultyFilter, importanceFilter, questions]);

  if (!isLoaded) return null;
  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Generate Questions
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          label="Enter text to generate questions"
          multiline
          fullWidth
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Generate Questions"
          )}
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                label="Filter by Difficulty"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Importance</InputLabel>
              <Select
                value={importanceFilter}
                onChange={(e) => setImportanceFilter(e.target.value)}
                label="Filter by Importance"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && filteredQuestions.length > 0 ? (
        <AnimatePresence>
          {filteredQuestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <strong>Answer:</strong> {item.answer}
                  </Typography>
                  <Typography>
                    <strong>Difficulty:</strong> {item.difficulty}
                  </Typography>
                  <Typography>
                    <strong>Importance:</strong> {item.importance}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <Typography>
          No questions available. Please generate some questions.
        </Typography>
      )}
    </Container>
  );
}
