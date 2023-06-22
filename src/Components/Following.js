import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Following = ( {db, user, isLoggedIn} ) => {
    
    const [followingList, setFollowingList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getFollowingList = async () => {
            if (user !== null) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                const newUser = userSnap.data();
                setFollowingList(newUser.following)
                setIsLoading(false);
                }
            }
        getFollowingList();
    }, [user, isLoading])

    let followingListItems;
    if (followingList === undefined) {
        return null;
    }
    if (!isLoggedIn) {
        return <p>Log in to see who you are following!</p>;
      }
    if (isLoading) {
        return <p>Loading...</p>;
      }
    if (followingList.length > 0) {
        followingListItems = followingList.map(person => {
            return (
                <li className="follow-list" key={person.id}>
                    <img src={person.photo} alt="following" />
                    <div>{person.name}</div>
                </li>
            )
        })
    }

    return ( 
        <div>
            {!isLoggedIn &&
                <p>Log in to see who you're following!</p>
            }
            {isLoggedIn && 
                <ul>
                    {followingListItems}
                </ul>
            }
        </div>
     );
}
 
export default Following;