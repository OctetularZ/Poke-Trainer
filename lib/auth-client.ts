import { createAuthClient } from "better-auth/react"
import { redirect } from "next/navigation";

export const authClient = createAuthClient({
    baseURL: "https://poke-trainer-omega.vercel.app"
})

export const { useSession } = authClient

export const googleSignIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

export const githubSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
    })
};

export const discordSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "discord",
        callbackURL: "/",
    })
};

export const signOut = async () => {
    await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
}

//     authClient.signIn.social({
//   provider: "github",          // or "google", "apple", etc.
//   callbackURL: "/dashboard",
//   errorCallbackURL: "/error",
//   newUserCallbackURL: "/welcome",
//   disableRedirect: false,      // or true if you want manual handling
// });