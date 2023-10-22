import logo from "../assets/bird.png";
import { Link } from "react-router-dom";
import {
  signOut,
  signInWithRedirect,
  signInAnonymously,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { useEffect } from "react";

const Header = ({
  auth,
  isLoggedIn,
  setIsLoggedIn,
  setIsAnon,
  setSelectedUserFeed,
}) => {
  const signInGoogle = async () => {
    const provider = await new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithRedirect(auth, provider);
  };

  const signInGuest = () => {
    try {
      signInAnonymously(auth)
        .then((result) => {
          const user = result.user;
          localStorage.setItem("anonymousUID", user.uid);
          updateProfile(user, {
            displayName: "Anonymous",
            photoURL:
              "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
          });
          console.log("Signed-in Anonymously", result.user);
          setIsAnon(true);
        })

        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const signOutGoogle = () => {
    signOut(auth).then(console.log("Signed out"));
    setSelectedUserFeed(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const anonymousUserUID = localStorage.getItem("anonymousUID");
    if (anonymousUserUID) {
      signOut(auth)
        .then(() => {
          localStorage.removeItem("anonymousUID");
          setIsLoggedIn(false);
        })
        .catch((error) => {
          console.error("Error signing out anonymous user:", error);
        });
    }
  }, []);

  return (
    <header>
      <Link to="/">
        <img
          src={logo}
          alt="bird logo"
          onClick={() => setSelectedUserFeed(null)}
        />
      </Link>
      {!isLoggedIn && (
        <div className="login">
          <button onClick={signInGoogle}>Sign-In</button>
          <button onClick={signInGuest}>Guest</button>
        </div>
      )}
      {isLoggedIn && <button onClick={signOutGoogle}>Sign-Out</button>}
    </header>
  );
};

export default Header;
