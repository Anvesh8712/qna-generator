import { Button, Typography, Container, AppBar, Toolbar } from "@mui/material";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
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

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <SignIn afterSignInUrl="/generate" />
      </Container>
    </>
  );
}
