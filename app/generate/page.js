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
//   CircularProgress,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";

// export default function GenerateQuestionsPage() {
//   const { isLoaded, isSignedIn } = useUser();
//   const router = useRouter();

//   const [text, setText] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [filteredQuestions, setFilteredQuestions] = useState([]);
//   const [difficultyFilter, setDifficultyFilter] = useState("");
//   const [importanceFilter, setImportanceFilter] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Handle text submission to generate questions
//   const handleSubmit = async () => {
//     setLoading(true);
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
//         setQuestions(data.questions.questions);
//         setFilteredQuestions(data.questions.questions);
//       } else {
//         console.error("Failed to generate questions");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//   }, [difficultyFilter, importanceFilter, questions]);

//   if (!isLoaded) return null;
//   if (!isSignedIn) {
//     router.push("/sign-in");
//     return null;
//   }

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
//         Generate Questions
//       </Typography>

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
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <CircularProgress size={24} color="inherit" />
//           ) : (
//             "Generate Questions"
//           )}
//         </Button>
//       </Box>

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

//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {!loading && filteredQuestions.length > 0 ? (
//         <AnimatePresence>
//           {filteredQuestions.map((item, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Accordion>
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   aria-controls={`panel${index}-content`}
//                   id={`panel${index}-header`}
//                 >
//                   <Typography>{item.question}</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Typography>
//                     <strong>Answer:</strong> {item.answer}
//                   </Typography>
//                   <Typography>
//                     <strong>Difficulty:</strong> {item.difficulty}
//                   </Typography>
//                   <Typography>
//                     <strong>Importance:</strong> {item.importance}
//                   </Typography>
//                 </AccordionDetails>
//               </Accordion>
//             </motion.div>
//           ))}
//         </AnimatePresence>
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
import { useUser, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Toolbar,
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
  Modal,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

export default function GenerateQuestionsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [importanceFilter, setImportanceFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [savedChats, setSavedChats] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch saved chats on load
  useEffect(() => {
    const fetchSavedChats = async () => {
      if (!user) return;

      try {
        const savedChatsRef = collection(
          db,
          "saved_questions",
          user.id,
          "saved_sets"
        );
        const snapshot = await getDocs(savedChatsRef);
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedChats(chats);
      } catch (error) {
        console.error("Error fetching saved chats:", error);
      }
    };

    if (user) {
      fetchSavedChats();
    }
  }, [user]);

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

  const handleSave = async () => {
    if (!saveName.trim()) return; // Prevent saving with an empty name
    if (!user) return; // Ensure the user is authenticated

    try {
      // Create a reference to the document with the specific saveName
      const docRef = doc(
        db,
        "saved_questions",
        user.id,
        "saved_sets",
        saveName
      );

      // Set the document with the questions and metadata
      await setDoc(docRef, {
        name: saveName,
        questions: questions,
        createdAt: new Date(),
      });

      // Close the modal after saving
      setModalOpen(false);
      setSaveName("");

      // Refresh saved chats after saving
      const savedChatsRef = collection(
        db,
        "saved_questions",
        user.id,
        "saved_sets"
      );
      const snapshot = await getDocs(savedChatsRef);
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSavedChats(chats);
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  // Handle displaying saved questions when a chat is clicked
  const handleChatClick = async (chatId) => {
    try {
      const chatDocRef = doc(
        db,
        "saved_questions",
        user.id,
        "saved_sets",
        chatId
      );
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists()) {
        setQuestions(chatDoc.data().questions);
        setFilteredQuestions(chatDoc.data().questions);
        setDrawerOpen(false); // Close the sidebar after selecting a chat
      }
    } catch (error) {
      console.error("Error loading saved chat:", error);
    }
  };

  if (!isLoaded) return null;
  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              View Saved Chats
            </Button>
          </Box>
          <SignedOut>
            <Link href="/sign-in" passHref>
              <Button
                color="inherit"
                sx={{ textDecoration: "none", color: "white" }}
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button
                color="inherit"
                sx={{ textDecoration: "none", color: "white" }}
              >
                Sign Up
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {" "}
        {/* Added margin-top for spacing */}
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
          {!loading && (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Generate Questions
            </Button>
          )}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setModalOpen(true)}
            sx={{ ml: 2 }}
            disabled={!questions.length}
          >
            Save Questions
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
        {/* Drawer for Saved Chats */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250 }}>
            <Typography variant="h6" sx={{ m: 2 }}>
              Saved Chats
            </Typography>
            <List>
              {savedChats.map((chat) => (
                <ListItem
                  button
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <ListItemText primary={chat.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        {/* Save Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="save-modal-title"
          aria-describedby="save-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="save-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Save Questions
            </Typography>
            <TextField
              label="Enter a name for your questions"
              fullWidth
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
