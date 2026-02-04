import { createAuthClient } from "better-auth/react"
import { redirect } from "next/navigation";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})

export const { useSession } = authClient

export const googleSignIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};

export const githubSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
};

export const discordSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "discord"
    })
};

export const signOut = async () => {
    await authClient.signOut()
    redirect('/')
}

//     authClient.signIn.social({
//   provider: "github",          // or "google", "apple", etc.
//   callbackURL: "/dashboard",
//   errorCallbackURL: "/error",
//   newUserCallbackURL: "/welcome",
//   disableRedirect: false,      // or true if you want manual handling
// });