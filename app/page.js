"use client";

import Image from "next/image";
import getStripe from "@/utils/getStripe";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser(); // Destructure user state
  const router = useRouter();

  const handleSubmitCheckOut = async () => {
    const checkOutSession = await fetch("api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkOutSessionJSON = await checkOutSession.json();
    if (checkOutSession.statusCode == 500) {
      console.log(
        "Error creating checkout session",
        checkOutSessionJSON.message || "Unknown error"
      );
      return;
    }

    const stripe = await getStripe();
    const error = await stripe.redirectToCheckout({
      sessionId: checkOutSessionJSON.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleGenerateClick = () => {
    if (isLoaded && isSignedIn) {
      router.push("/generate");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Head>
        <title>qna generator SaaS</title>
        <meta name="description" content="qna generator SaaS" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            QnA Generator SaaS
          </Typography>
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

      <Box
        sx={{
          textAlign: "center",
          my: 6,
          py: 4,
          px: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Welcome to QnA Generator SaaS
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This is a SaaS application for generating QnA pairs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: "20px" }}
          onClick={handleGenerateClick}
        >
          Generate QnA
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                Automatic Question Generation
              </Typography>
              <hr
                style={{
                  border: "0",
                  borderTop: "1px solid #eee",
                  margin: "16px 0",
                }}
              />
              <Typography>
                Effortlessly generate high-quality questions from your
                presentation slides. Our AI analyzes the content and suggests
                relevant questions.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                Intelligent Answer Suggestions
              </Typography>
              <hr
                style={{
                  border: "0",
                  borderTop: "1px solid #eee",
                  margin: "16px 0",
                }}
              />
              <Typography>
                Along with the questions, receive precise answer suggestions
                based on the text, ensuring comprehensive QnA pairs.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Customizable Output</Typography>
              <hr
                style={{
                  border: "0",
                  borderTop: "1px solid #eee",
                  margin: "16px 0",
                }}
              />
              <Typography>
                Tailor the questions to your specific needs by adjusting
                difficulty levels, focus areas, and more, to create a perfect
                QnA set.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Pricing Plans
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Basic Plan</Typography>
              <hr
                style={{
                  border: "0",
                  borderTop: "1px solid #eee",
                  margin: "16px 0",
                }}
              />
              <Typography>
                <strong>$9.99/month</strong>
              </Typography>
              <Typography>
                Ideal for individuals or small teams. Get access to core
                features, including basic question generation and limited
                customization options.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
              >
                Choose Plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Pro Plan</Typography>
              <hr
                style={{
                  border: "0",
                  borderTop: "1px solid #eee",
                  margin: "16px 0",
                }}
              />
              <Typography>
                <strong>$19.99/month</strong>
              </Typography>
              <Typography>
                Perfect for growing teams. Includes all Basic features, plus
                advanced customization, priority support, and increased
                generation limits.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
                onClick={handleSubmitCheckOut}
              >
                Choose Plan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
