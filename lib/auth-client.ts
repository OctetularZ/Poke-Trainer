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

//     authClient.signIn.social({
//   provider: "github",          // or "google", "apple", etc.
//   callbackURL: "/dashboard",
//   errorCallbackURL: "/error",
//   newUserCallbackURL: "/welcome",
//   disableRedirect: false,      // or true if you want manual handling
// });
}