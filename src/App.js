import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import AccountInfo from "./Components/AccountInfo";
import NewChirp from "./Components/NewChirp";
import Followers from "./Components/Followers";
import Following from "./Components/Following";
import Navbar from "./Components/Navbar";
import { useState, useEffect } from "react";
import {
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnon, setIsAnon] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyC-4DhPzWbvAQeoCjHQ0ZIf0jkv4FV9Tig",
    authDomain: "chirper-7b053.firebaseapp.com",
    projectId: "chirper-7b053",
    storageBucket: "chirper-7b053.appspot.com",
    messagingSenderId: "243994844102",
    appId: "1:243994844102:web:b32295cc5935156343b0c7",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const user = auth.currentUser;
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, [auth, user]);

  useEffect(() => {
    const updateUser = async (result) => {
      if (result !== null && !isAnon) {
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        const existingChirpCount = userDoc.exists()
          ? userDoc.data().chirpCount
          : 0;

        await setDoc(
          doc(db, "users", result.user.uid),
          {
            name: result.user.displayName,
            uid: result.user.uid,
            photo: result.user.photoURL,
            following: arrayUnion(),
            followedBy: arrayUnion(),
            followingIds: arrayUnion(),
            chirpCount: existingChirpCount,
          },
          { merge: true }
        );
      }
    };

    getRedirectResult(auth).then((result) => updateUser(result));
  }, [user]);

  return (
    <div className="App">
      <Header
        auth={auth}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setIsAnon={setIsAnon}
      />
      <main>
        <AccountInfo
          db={db}
          user={user}
          isLoggedIn={isLoggedIn}
          isAnon={isAnon}
        />
        <div className="feed">
          <Navbar></Navbar>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  db={db}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  isAnon={isAnon}
                />
              }
            ></Route>
            <Route
              path="/Following"
              element={
                <Following
                  db={db}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  isAnon={isAnon}
                />
              }
            ></Route>
            <Route
              path="/Followers"
              element={
                <Followers
                  db={db}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  isAnon={isAnon}
                />
              }
            ></Route>
          </Routes>
        </div>
      </main>
      <NewChirp
        isLoggedIn={isLoggedIn}
        user={user}
        db={db}
        storage={storage}
        isAnon={isAnon}
      />
    </div>
  );
}

export default App;
