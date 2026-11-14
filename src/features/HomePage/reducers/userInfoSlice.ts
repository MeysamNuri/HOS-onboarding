import type { IGetUser } from "@core/types/models";
import type { PayloadAction  } from "@reduxjs/toolkit";
import  { createSlice  } from "@reduxjs/toolkit";

interface UserInfoState {
    value: IGetUser | null;
}

const initialState: UserInfoState = {
    value: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        serials: [],
        userName: ""
    },
};

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
     setUserValue: (state, action: PayloadAction<IGetUser | null>) => {
  state.value = action.payload;
},


    },
});

export const { setUserValue } = userInfoSlice.actions;
export default userInfoSlice.reducer;