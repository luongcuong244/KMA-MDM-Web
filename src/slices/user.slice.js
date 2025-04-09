import { createSlice } from "@reduxjs/toolkit";
import ROLE from "../enums/role.enum";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null, // sử dụng
    userName: null,  // sử dụng
    userPublicName: null,
    avatar: null,
    role: ROLE.moderator,  // sử dụng
    amount: null,  // sử dụng
    luckyWheelSpin: null, // sử dụng
    membershipClass: null,
    realName: null,
    dateOfBirth: null,
    gender: null,
    address: null,
    phoneNumber: null,
    email: null,
    amountOwed: null,
    createdDate: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload?.userId;
      state.userName = action.payload?.userName;
      state.userPublicName = action.payload?.userPublicName;
      state.avatar = action.payload?.avatar;
      state.role = action.payload?.role;
      state.amount = action.payload?.amount;
      state.luckyWheelSpin = action.payload?.luckyWheelSpin;
      state.membershipClass = action.payload?.membershipClass;
      state.realName = action.payload?.realName;
      state.dateOfBirth = action.payload?.dateOfBirth;
      state.gender = action.payload?.gender;
      state.address = action.payload?.address;
      state.phoneNumber = action.payload?.phoneNumber;
      state.email = action.payload?.email;
      state.amountOwed = action.payload?.amountOwed;
      state.createdDate = action.payload?.createdDate;
    },
    setUserPublicName: (state, action) => {
      state.userPublicName = action.payload.userPublicName;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
    },
    setMoney: (state, action) => {
      state.amount = action.payload;
    },
    setMembershipClass: (state, action) => {
      state.membershipClass = action.payload.membershipClass;
    },
    setRealName: (state, action) => {
      state.realName = action.payload.realName;
    },
    setDateOfBirth: (state, action) => {
      state.dateOfBirth = action.payload.dateOfBirth;
    },
    setGender: (state, action) => {
      state.gender = action.payload.gender;
    },
    setAddress: (state, action) => {
      state.address = action.payload.address;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload.phoneNumber;
    },
    setEmail: (state, action) => {
      state.email = action.payload.email;
    },
    setAmountOwed: (state, action) => {
      state.amountOwed = action.payload.amountOwed;
    },
    setCreatedDate: (state, action) => {
      state.createdDate = action.payload.createdDate;
    },
  },
});

export const {
  setUser,
  setUserNull,
  setUserPublicName,
  setAvatar,
  setMoney,
  setLuckyWheelSpin,
  setMembershipClass,
  setRealName,
  setDateOfBirth,
  setGender,
  setAddress,
  setPhoneNumber,
  setEmail,
  setAmountOwed,
  setCreatedDate,
} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
