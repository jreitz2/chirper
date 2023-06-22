import logo from '../assets/bird.png';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Header = ( { signInGoogle, auth, isLoggedIn, setIsLoggedIn } ) => {

    const signOutGoogle = () => {
        signOut(auth).then(console.log("Signed out"));
        setIsLoggedIn(false);
    }

    return ( 
        <header>
            <Link to="/"><img src={logo} alt="bird logo" /></Link>
            {!isLoggedIn && <button onClick={signInGoogle}>Sign-In</button>}
            {isLoggedIn && <button onClick={signOutGoogle}>Sign-Out</button>}
        </header>
     );
}
 
export default Header;