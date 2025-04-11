import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user.slice';
import modalAppearanceReducer from '../slices/modal_appearance.slice';
import configurationsReducer from '../slices/configuration.slice';
import applicationsReducer from '../slices/application.slice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        modalAppearance: modalAppearanceReducer,
        configurations: configurationsReducer,
        applications: applicationsReducer,
    },
});