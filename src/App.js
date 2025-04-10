import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignIn";
import PATH from "./enums/path.enum";
import AdminPages from "./pages/AdminPages";
import AccountPages from "./pages/AccountPages";
import userService from "./services/user.service";
import "./App.css";
import { selectUser, setUser } from "./slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { selectModalAppearance } from "./slices/modal_appearance.slice";
import { setSignOutDialogShowing, setBlockUserDialogShowing } from "./slices/modal_appearance.slice";
import AlertDialog from "./components/AlertDialog";
import GoToHomePage from "./pages/GoToHome";
import NeedSignInPage from "./pages/NeedSignIn";
import ROLE from "./enums/role.enum";

function App() {

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const modalAppearance = useSelector(selectModalAppearance);

  const [render, setRender] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      userService
        .getCurrentUser()
        .then(async (data) => {
          if (data) {
            dispatch(setUser(data));
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setRender(true);
        });
    }
    fetchData();
  }, []);

  return (
    <>
      {render && (
        <>
          <AlertDialog
            title={"Thông báo"}
            message={"Phiên đăng nhập hết hạn. Đăng nhập lại để tiếp tục!"}
            isOpen={modalAppearance.isSignOutDialogShowing}
            onClickPositiveButton={() => {
              window.location.href = PATH.signIn;
              dispatch(setSignOutDialogShowing(false));
            }}
            closeWhenClickOutside={false}
          />

          <AlertDialog
            title={"Thông báo"}
            message={"Tài khoản của bạn đã bị khoá. Đăng nhập lại để biết thêm thông tin!"}
            isOpen={modalAppearance.isBlockUserDialogShowing}
            onClickPositiveButton={() => {
              window.location.href = PATH.root;
              dispatch(setBlockUserDialogShowing(false));
            }}
            closeWhenClickOutside={false}
          />

          <Routes>
            <Route
              path={"/*"}
              element={user?._id ? <AccountPages /> : <SignInPage />}
            />
            <Route 
              path={`${PATH.admin}/*`}
              element={
                user?.userId ?
                  (user?.role === ROLE.admin) ? <AdminPages /> : <GoToHomePage message={"Bạn không có quyền truy cập trang này!"} />
                  : <NeedSignInPage />
              }
            />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
