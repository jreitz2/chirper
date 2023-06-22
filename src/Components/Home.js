import { collection, orderBy, query, limit, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import HeartButton from './HeartButton.js';
import FollowButton from "./FollowButton.js";

const Home = ( {db, user, isLoggedIn} ) => {
   
    const [feed, setFeed] = useState([]);
    const colRef = collection(db, 'chirps');
    const colQuery = query(colRef, orderBy('createdAt', 'desc'), limit(20));

    useEffect(() => {
        const unsub = onSnapshot(colQuery, (querySnapshot) => {
            const tempFeed = [];
            querySnapshot.forEach((doc) => {
                tempFeed.push({...doc.data(), id: doc.id });
            })
            setFeed(tempFeed);
        })
        return () => {
            unsub();
        }
    }, []);
   
    const chirps = feed.map(chirp => {
        return (
                <li key={chirp.id}>
                    <div className="chirp-header">
                        <img src={chirp.authorPhoto} alt="user" />
                        <div className="author">{chirp.author}</div>
                        <div>{chirp.date}</div>
                        <div>{chirp.time}</div>
                    </div>
                    <div className="chirp-text">{chirp.chirp}</div>
                    <div className="chirp-pic">
                        <img src={chirp.image} alt="" />
                    </div>
                    <div className="chirp-icons">
                        <HeartButton chirp={chirp} db={db} user={user} isLoggedIn={isLoggedIn} />
                        <FollowButton chirp={chirp} db={db} user={user} />
                    </div>
                </li>
            )
        })

    return ( 
        <div>
            <ul>
                {chirps}
            </ul>
        </div>
        );
}
 
export default Home;