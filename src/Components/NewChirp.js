import quill from '../assets/quill.png';
import { useRef, useState } from 'react';
import { addDoc, serverTimestamp, collection, updateDoc, doc, getDoc, arrayUnion } from 'firebase/firestore'
import Modal from './Modal.js';
import '../Modal.css';
import emojiIcon from '../assets/emoji.png';
import pic from '../assets/pic.png';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

const NewChirp = ( { isLoggedIn, user, db, storage } ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newChirpText, setNewChirpText] = useState("");
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);
    const imgUrlRef = useRef("");
    const colRef = collection(db, 'chirps');
    const date = new Date();
    const currentDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    const showTime = date.getHours() 
        + ':' + date.getMinutes() 
        + ":" + date.getSeconds();

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setNewChirpText("");
        setSelectedImage(null);
    };

    const handleSubmit = async () => {
        closeModal();

        try {
            await uploadImage();
            await addDoc(colRef, {
                chirp: newChirpText,
                author: user.displayName,
                authorId: user.uid,
                authorPhoto: user.photoURL,
                createdAt: serverTimestamp(),
                image: imgUrlRef.current,
                date: currentDate,
                time: showTime,
                likedBy: ""
            });
            setNewChirpText("");
            imgUrlRef.current = "";
        } catch (err) {
            console.log(err.message);
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const newUser = userSnap.data();
        if (newUser.chirpCount === undefined) {
            await updateDoc(userRef, {
                chirpCount: 1
            })
        } else {
            await updateDoc(userRef, {
                chirpCount: newUser.chirpCount + 1
            })
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            setDisplayImage(imageUrl);
            setSelectedImage(file);
        }
        reader.readAsDataURL(file);
    }

    const metadata = {
        contentType: 'image/jpeg'
      };

    const uploadImage = async () => {
        if (selectedImage == null) return;
      
        const storageRef = ref(storage, `images/${v4()}`);
            try {
                await uploadBytesResumable(storageRef, selectedImage, metadata);
                console.log("Image uploaded");
                const url = await getDownloadURL(storageRef);
                imgUrlRef.current = url;
            } catch (err) {
                console.log(err.message);
            }
    };

    return ( 
        <>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <h2>New Chirp</h2>
                <form onSubmit={handleSubmit}>
                    <textarea name="newChirp" id="" cols="30" rows="6" placeholder="What's goin' on?"
                        value={newChirpText} onChange={(e) => setNewChirpText(e.target.value)} ></textarea>
                    {selectedImage && <img className="selected-image" src={displayImage} alt="selected" />}
                    <button className="post" type="submit">Post</button>
                </form>
                    <div className="chirpIcons">
                        <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}><img src={emojiIcon} alt="emoji" /></button>
                        <button>
                            <label htmlFor='add-image'><img src={pic} alt="add upload" /></label>
                            <input type="file" id="add-image" className="image-input" accept="image/*" onChange={handleImageChange} />
                        </button>
                    </div>
                <div className={emojiPickerVisible ? 'showEmoji' : 'hideEmoji'}>
                    <Picker data={data} onEmojiSelect={(e) => {
                        setNewChirpText(newChirpText + e.native);
                        setEmojiPickerVisible(!emojiPickerVisible);
                    }}></Picker>
                </div>
            </Modal>

            <footer>
                <button onClick={openModal}>
                    {isLoggedIn && <img src={quill} alt="create new chirp" />}
                </button>
            </footer>
        </>
     );
}
 
export default NewChirp;