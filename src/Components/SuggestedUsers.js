import {
  collection,
  orderBy,
  query,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const SuggestedUsers = ({ db }) => {
  const [users, setUsers] = useState([]);
  const colRef = collection(db, "users");
  const colQuery = query(colRef, orderBy("chirpCount", "desc"), limit(10));

  useEffect(() => {
    const unsub = onSnapshot(colQuery, (querySnapshot) => {
      const tempUsers = [];
      querySnapshot.forEach((doc) => {
        tempUsers.push({ ...doc.data(), id: doc.id });
      });
      setUsers(tempUsers);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <aside className="suggested-users">
      <div className="account-bg">Suggested Users</div>
      {users.map((user) => (
        <div key={user.uid} className="suggested-user-item">
          <img src={user.photo} alt="" />
          <p>{user.name}</p>
        </div>
      ))}
    </aside>
  );
};

export default SuggestedUsers;
