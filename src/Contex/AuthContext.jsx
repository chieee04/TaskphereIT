import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔹 Check localStorage user (for custom accounts from your table)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 🔹 Check Supabase Auth session (for admin or email-based login)
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user); // Supabase user
      }
    };
    getSession();

    // 🔹 Listen for login/logout changes in Supabase
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("user", JSON.stringify(session.user)); // Save to localStorage too
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Custom login for local users (not Supabase)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("customUser");
  localStorage.removeItem("adminUser");
  await supabase.from("current_user").delete().neq("id", 0);
    await supabase.auth.signOut(); // 🔹 Log out from Supabase too
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
