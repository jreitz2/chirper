import { Link, useLocation } from "react-router-dom";

const Navbar = ({ selectedUserFeed }) => {
  function CustomLink({ to, label }) {
    const location = useLocation();
    const isActive = location.pathname == to;

    const activeStyles = {
      fontWeight: isActive ? "bold" : "normal",
      background: isActive ? "blanchedalmond" : "white",
    };

    return (
      <Link to={to} style={activeStyles}>
        {label}
      </Link>
    );
  }

  return (
    <nav>
      <CustomLink
        to="/"
        label={selectedUserFeed ? `${selectedUserFeed.name}'s Feed` : `Feed`}
      ></CustomLink>
      <CustomLink to="/Followers" label="Followers"></CustomLink>
      <CustomLink to="/Following" label="Following"></CustomLink>
    </nav>
  );
};

export default Navbar;
