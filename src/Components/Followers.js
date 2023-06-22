import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Followers = ( {db, user, isLoggedIn} ) => {
    
    const [followerList, setFollowerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getFollowerList = async () => {
            if (user !== null) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                const newUser = userSnap.data();
                setFollowerList(newUser.followedBy);
                setIsLoading(false);
                }
            }
        getFollowerList();
    }, [user, isLoading])

    let followerListItems;
    if (followerList === undefined) {
        return null;
    }
    if (!isLoggedIn) {
        return <p>Log in to see who is following you!</p>;
      }
    if (isLoading) {
        return <p>Loading...</p>;
      }
    if (followerList.length > 0) {
        followerListItems = followerList.map(person => {
            return (
                <li className="follow-list" key={person.id}>
                    <img src={person.photo} alt="followers" />
                    <div>{person.name}</div>
                </li>
            )
        })
    }
    
    return ( 
        <div>
            {!isLoggedIn &&
                <p>Log in to see who is following you!</p>
            }
            {isLoggedIn && 
                <ul>
                    {followerListItems}
                </ul>
            }
        </div>
     );
}
 
export default Followers;