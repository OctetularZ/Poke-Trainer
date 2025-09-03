import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})

export const googleSignIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};

export const githubSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
}