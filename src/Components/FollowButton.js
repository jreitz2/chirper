import { doc, getDoc, updateDoc } from "firebase/firestore";
import follow from "../assets/follow.png";

const FollowButton = ({ chirp, db, user, isAnon }) => {
  const handleFollow = async () => {
    if (user !== null) {
      const followRef = await doc(db, "chirps", chirp.id);
      const followSnap = await getDoc(followRef);
      const newFollow = await followSnap.data().authorId;
      const newFollowName = await followSnap.data().author;
      const newFollowPhoto = await followSnap.data().authorPhoto;
      const userRef = await doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const newUser = await userSnap.data();
      const followedUserRef = await doc(db, "users", newFollow);
      const followedUserSnap = await getDoc(followedUserRef);
      const newFollowedUser = await followedUserSnap.data();

      if (newUser.following.length === 0) {
        await updateDoc(userRef, {
          following: [
            { id: newFollow, name: newFollowName, photo: newFollowPhoto },
          ],
          followingIds: [newFollow],
        });
        if (newFollowedUser.followedBy.length === 0) {
          await updateDoc(followedUserRef, {
            followedBy: [
              { id: user.uid, name: newUser.name, photo: newUser.photo },
            ],
          });
        } else {
          await updateDoc(followedUserRef, {
            followedBy: [
              ...newFollowedUser.followedBy,
              { id: user.uid, name: newUser.name, photo: newUser.photo },
            ],
          });
        }
      } else if (!newUser.followingIds.includes(newFollow)) {
        await updateDoc(userRef, {
          following: [
            ...newUser.following,
            { id: newFollow, name: newFollowName, photo: newFollowPhoto },
          ],
          followingIds: [...newUser.followingIds, newFollow],
        });
        if (newFollowedUser.followedBy.length === 0) {
          await updateDoc(followedUserRef, {
            followedBy: [
              { id: user.uid, name: newUser.name, photo: newUser.photo },
            ],
          });
        } else {
          await updateDoc(followedUserRef, {
            followedBy: [
              ...newFollowedUser.followedBy,
              { id: user.uid, name: newUser.name, photo: newUser.photo },
            ],
          });
        }
      }
    }
  };

  return (
    <div>
      <img src={follow} alt="follow" onClick={isAnon ? null : handleFollow} />
    </div>
  );
};

export default FollowButton;
