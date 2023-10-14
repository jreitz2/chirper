import { useState, useEffect } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import avatar from "../assets/avatar.png";

const AccountInfo = ({ db, user, isLoggedIn, isAnon }) => {
  const [chirps, setChirps] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAccountInfo = async () => {
      if (user !== null) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const newUser = userSnap.data();
            setFollowers(newUser.followedBy.length);
            setFollowing(newUser.following.length);
            setChirps(newUser.chirpCount);
            setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const accountSubscription = onSnapshot(collection(db, "users"), () => {
      getAccountInfo();
    });

    getAccountInfo();

    return () => {
      accountSubscription();
    };
  }, [user, isLoading, db]);

  return (
    <aside>
      <div className="account-bg"></div>
      <div className="avatar">
        {isLoggedIn && (
          <img
            src={
              isAnon || isLoading
                ? "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
                : user.photoURL
            }
            alt="avatar"
          />
        )}
        {!isLoggedIn && <img src={avatar} alt="blank" />}
        {isLoggedIn && !isLoading && (
          <div>{isAnon ? "Anonymous" : user.displayName}</div>
        )}
        {!isLoggedIn && <div>Your Name</div>}
      </div>

      <div className="account-info">
        <div>
          <div className="account-label">Chirps</div>
          <div className="account-number">
            {!isLoggedIn && "--"}
            {isLoggedIn && chirps}
          </div>
        </div>
        <div>
          <div className="account-label">Followers</div>
          <div className="account-number">
            {!isLoggedIn && "--"}
            {isLoggedIn && followers}
          </div>
        </div>
        <div>
          <div className="account-label">Following</div>
          <div className="account-number">
            {!isLoggedIn && "--"}
            {isLoggedIn && following}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AccountInfo;
