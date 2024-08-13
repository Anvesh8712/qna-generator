import Image from "next/image";
import getStripe from "@/utils/getStripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container maxWidth="100vh">
      <Head>
        <title>qna generator SaaS</title>
        <meta name="description" content="qna generator SaaS" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            QnA Generator SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
            <Button color="inherit">SIgn Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4">Welcome to QnA Generator SaaS</Typography>
        <Typography variant="body1">
          This is a SaaS application for generating QnA pairs
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Generate QnA
        </Button>
      </Box>
    </Container>
  );
}
