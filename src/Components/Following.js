import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Following = ({ db, user, isLoggedIn, isAnon, setSelectedUserFeed }) => {
  const [followingList, setFollowingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAnon) {
      const getFollowingList = async () => {
        if (user !== null) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const newUser = userSnap.data();
          setFollowingList(newUser.following);
          setIsLoading(false);
        }
      };
      getFollowingList();
    }
  }, [user, isLoading, db, isAnon]);

  const handleSetSelectedUserFeed = (person) => {
    setSelectedUserFeed({
      uid: person.id,
      name: person.name,
    });
  };

  let followingListItems;
  if (followingList === undefined) {
    return null;
  }
  if (!isLoggedIn) {
    return <p>Log in to see who you are following!</p>;
  }
  if (isAnon)
    return (
      <p>Anonymous users can't follow other users! Please create an account.</p>
    );
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (followingList.length > 0) {
    followingListItems = followingList.map((person) => {
      return (
        <Link to="/" key={person.id}>
          <li
            className="follow-list"
            onClick={() => handleSetSelectedUserFeed(person)}
          >
            <img src={person.photo} alt="following" />
            <div>{person.name}</div>
          </li>
        </Link>
      );
    });
  }

  return (
    <div>
      {!isLoggedIn && <p>Log in to see who you're following!</p>}
      {isLoggedIn && <ul>{followingListItems}</ul>}
    </div>
  );
};

export default Following;
