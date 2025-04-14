import React, { useState } from "react";
import styles from "./account.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/user.slice";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate, Navigate, Route, Routes } from 'react-router-dom';
import PATH from "../../enums/path.enum";
import About from "./About";
import Profile from "./Profile";
import Cookies from "universal-cookie";
import authService from "../../services/auth.service";
import MdmPages from "./MdmPages";
import ApplicationVersion from "./ApplicationVersion";
import EditConfiguration from "./EditConfiguration";

const cookies = new Cookies();

const AccountPages = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickAbout = () => {
    navigate(PATH.about);
  }

  const handleClickProfile = () => {
    navigate(PATH.profile);
  }

  const handleClickLogout = () => {
    authService.signOut();
  }

  const handleClickAppName = () => {
    window.location.href = "/";
  }

  const handleClickOutside = (event) => {
    if (event.target.closest(`.${styles.headerRight}`) === null) {
      setIsDropdownOpen(false);
    }
  }

  return (
    <div id={styles.root} onClick={handleClickOutside}>
      <div className={styles.headerContainer}>
        <p className={styles.appName} onClick={handleClickAppName}>KMA MDM</p>
        <div className={styles.headerRight}>
          <p className={styles.time}>08:37 10/04/2025</p>
          <button className={styles.userNameDropdownButton} onClick={toggleDropdown}>
            <p className={styles.userName}>{user.userName}</p>
            <IoMdArrowDropdown/>
            {
              isDropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  <li className={styles.dropdownItem} onClick={handleClickAbout}>Giới thiệu</li>
                  <li className={styles.dropdownItem} onClick={handleClickProfile}>Thông tin cá nhân</li>
                  <li className={styles.dropdownItem} onClick={handleClickLogout}>Đăng xuất</li>
                </ul>
              )
            }
          </button>
        </div>
      </div>
      <Routes>
        <Route path={"/*"} element={<MdmPages />} />
        <Route path={PATH.about} element={<About />} />
        <Route path={PATH.profile} element={<Profile />} />
        <Route path={PATH.applicationVersion} element={<ApplicationVersion />} />
        <Route path={PATH.editConfiguration} element={<EditConfiguration />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  );
}

export default AccountPages;