import React, { useState, useCallback, ChangeEvent } from "react";
import ProfilePicture from "../ProfilePicutre/ProfilePicture";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { getAuthData } from "../../Selectors/ownerSelectors";
import { SearchByType, setError, setSearchBy } from "../../Slices/gistSlice";
import { fetchGistNotesAPI } from "../../Middleware/gistMiddleware";
import { setApiCallState } from "../../Slices/gistSlice";
import { loginAPI } from "../../Middleware/ownerMiddleware";
import { login, OwnerType } from "../../Slices/ownerSlice";
import logo from "../../media/gistnotes.png";
import { SearchRounded } from "@material-ui/icons";
import "./Navbar.css";

const Navbar: (props: object) => JSX.Element = (props: object) => {
  //selectorzs
  const { ownerName: loggedInUserName, dp: loggedInUserDP }: OwnerType =
    useSelector(getAuthData);

  //defining hooks
  const dispatch = useAppDispatch();
  const history = useHistory();

  //state
  const [profileMenuTogge, setProfileMenuToggle] = useState<boolean>(false);
  const searchType: string = "id";
  const [searchBy, setSearch] = useState<SearchByType>({
    type: searchType,
    content: "",
  });

  //event handlers
  const handleError: (error: string) => void = useCallback(
    (error: string) => {
      dispatch(setApiCallState("idle"));
      dispatch(setError(error));
    },
    [setApiCallState]
  );

  const handlesearch: () => void = useCallback(() => {
    if (searchBy.content) {
      dispatch(
        setSearchBy({
          type: searchType,
          content: searchBy.content,
        })
      );
      if (searchBy.type === "id") {
        dispatch(setApiCallState("loading"));
        dispatch(
          fetchGistNotesAPI({
            handleError,
            gistID: searchBy.content,
            isLoggedIn: loggedInUserName ? true : false,
          })
        );
      }
    }
  }, [searchBy]);

  const handleSearchByChange: (event: ChangeEvent<HTMLInputElement>) => void =
    useCallback(
      (event: ChangeEvent<HTMLInputElement>) =>
        setSearch({
          type: searchType,
          content: event.target.value,
        }),
      [setSearch]
    );

  const handleLogin: () => void = useCallback(() => {
    dispatch(loginAPI("<your github user name>"));
  }, []);

  const handleProfileMenu: () => void = useCallback(() => {
    setProfileMenuToggle(!profileMenuTogge);
  }, [profileMenuTogge]);

  const handleSignOut: () => void = useCallback(() => {
    handleProfileMenu();
    dispatch(login(""));
  }, [handleProfileMenu]);

  const handleLogoClick: () => void = useCallback(() => {
    setSearch({
      type: searchType,
      content: "",
    });
    dispatch(
      setSearchBy({
        type: searchType,
        content: "",
      })
    );
  }, [setSearch]);

  //UI snipits
  const loginButton: JSX.Element = (
    <section id="login">
      <button type="button" className="navbar-login-btn" onClick={handleLogin}>
        Login
      </button>
    </section>
  );
  const dpButton: JSX.Element = (
    <button className="navbar-dp-btn" type="button" onClick={handleProfileMenu}>
      <section id="dp" className="navbar-dp">
        <ProfilePicture dp={loggedInUserDP} />
      </section>
    </button>
  );
  const dpMenu: JSX.Element = (
    <section className="navbar-profile-menu">
      <section
        className="navbar-profile-menu-content"
        onMouseLeave={handleProfileMenu}
      >
        <p>Signed In as {loggedInUserName}</p>
        <hr />
        <Link to={`/profile/${loggedInUserName}`} className="navbar-link-decor">
          <button type="button" onClick={handleProfileMenu}>
            Your gists
          </button>
        </Link>

        <button type="button">Stared gists</button>
        <Link to={"/gistinsertion"} className="navbar-link-decor">
          <button type="button" onClick={handleProfileMenu}>
            Add New Gist
          </button>
        </Link>
        <hr />
        <button type="button" onClick={handleProfileMenu}>
          <a href={`https://github.com/${loggedInUserName}`} target="_blank">
            View GitHub Profile
          </a>
        </button>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </section>
    </section>
  );
  return (
    <>
      <nav>
        <section className="navbar-nav-bar" id="navbar">
          <section id="logo">
            <Link to="/" className="navbar-link-decor">
              <img
                className="navbar-logo"
                src={logo}
                alt="logo"
                onClick={handleLogoClick}
              />
            </Link>
          </section>
          <section className="navbar-left">
            <section className="navbar-search-section" id="search-bar">
              <input
                className="navbar-search-bar"
                type="text"
                placeholder="Search Notes..."
                value={searchBy.content}
                onChange={handleSearchByChange}
              />
              <button
                type="button"
                className="navbar-search-btn"
                onClick={handlesearch}
              >
                <SearchRounded className="navbar-search-icon" />
              </button>
            </section>
            <section>{loggedInUserName ? dpButton : loginButton}</section>
          </section>
        </section>
      </nav>
      {profileMenuTogge ? dpMenu : undefined}
    </>
  );
};

export default Navbar;
