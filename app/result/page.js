"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError("Session ID is missing");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout_sessions?session_id=${sessionId}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Failed to fetch session");
          setLoading(false);
          return;
        }

        const sessionData = await res.json();
        setSession(sessionData);
      } catch (error) {
        console.error("Error fetching session:", error);
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <Typography>{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => router.push("/")}
        >
          Go Back Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
      {session.payment_status === "paid" ? (
        <>
          <Typography>Payment successful!</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              SessionId: {sessionId}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => router.push("/generate")}
          >
            Go to Dashboard
          </Button>
        </>
      ) : (
        <>
          <Typography>Payment unsuccessful!</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => router.push("/")}
          >
            Go Back Home
          </Button>
        </>
      )}
    </Container>
  );
}
