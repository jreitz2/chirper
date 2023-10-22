import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Followers = ({ db, user, isLoggedIn, isAnon, setSelectedUserFeed }) => {
  const [followerList, setFollowerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAnon) {
      const getFollowerList = async () => {
        if (user !== null) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const newUser = userSnap.data();
          setFollowerList(newUser.followedBy);
          setIsLoading(false);
        }
      };
      getFollowerList();
    }
  }, [user, isLoading, db, isAnon]);

  const handleSetSelectedUserFeed = (person) => {
    setSelectedUserFeed({
      uid: person.id,
      name: person.name,
    });
  };

  let followerListItems;

  if (followerList === undefined) {
    return null;
  }
  if (!isLoggedIn) {
    return <p>Log in to see who is following you!</p>;
  }
  if (isAnon)
    return (
      <p>Anonymous users can't have followers! Please create an account.</p>
    );
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (followerList.length > 0) {
    followerListItems = followerList.map((person) => {
      return (
        <Link to="/" key={person.id}>
          <li
            className="follow-list"
            onClick={() => handleSetSelectedUserFeed(person)}
          >
            <img src={person.photo} alt="followers" />
            <div>{person.name}</div>
          </li>
        </Link>
      );
    });
  }

  return (
    <div>
      {!isLoggedIn && <p>Log in to see who is following you!</p>}
      {isLoggedIn && <ul>{followerListItems}</ul>}
    </div>
  );
};

export default Followers;
