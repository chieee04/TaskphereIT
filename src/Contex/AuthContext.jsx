import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

// Sign in
const signInUser = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("sign in error occurred: ", error);
      return { success: false, error: error.message };
    }

    console.log("sign-in success: ", data);
    return { success: true, data };
  } catch (error) {
    console.error("an error occurred: ", error);
  }
};

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });
}, []);
  // Signout
  const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("there was an error:", error);
  }
};

  return (
    <AuthContext.Provider value={{ session, signOut, signInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};