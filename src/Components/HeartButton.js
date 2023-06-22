import heart from '../assets/heart.png';
import heartFilled from '../assets/heart-filled.png';
import { useEffect, useState } from 'react';
import { updateDoc, doc, getDoc} from "firebase/firestore";

const HeartButton = ( {chirp, db, user, isLoggedIn} ) => {
    
    const [isHeartFilled, setIsHeartFilled] = useState(heart);
    const [isLikedBy, setIsLikedBy] = useState([]);

    const handleHeart = () => {
        if (user !== null) {
            if (isHeartFilled === heart) {
                setIsHeartFilled(heartFilled)
                updateDoc(doc(db, "chirps", chirp.id), {
                    likedBy: [...chirp.likedBy, user.uid]
                  })
            updateHeart();
        }
    }}

    const updateHeart = async () => {
        if (user !== null) {
        setIsHeartFilled(heart);
        const heartRef = doc(db, "chirps", chirp.id);
        const heartSnap = await getDoc(heartRef);
        const newHeart = await heartSnap.data().likedBy;
        setIsLikedBy(newHeart);
        
        if (isLoggedIn && newHeart.includes(user.uid)) {
            setIsHeartFilled(heartFilled);
            }
        }
    }

    useEffect(() => {
        updateHeart();
    },[isLoggedIn])
   
    return ( 
        <div className="heart-icon">
            <img src={isHeartFilled} alt="heart button" onClick={handleHeart} />
            {isLikedBy.length > 0 ? isLikedBy.length : ""}
        </div>
     );
}
 
export default HeartButton;