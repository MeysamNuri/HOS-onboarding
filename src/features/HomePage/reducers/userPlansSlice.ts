import type { IUserPlans } from "@core/types/models";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UserPlansState {
    value: IUserPlans | null;
}

const initialState: UserPlansState = {
    value: {
        serviceCode: "",
        packetCode: "",
        serial: "",
        phoneNumber: "",
        agentCode:"",
        discountCode:""
    },
};

const userPlansSlice = createSlice({
    name: "userPlans",
    initialState,
    reducers: {
        setUserPlansValue: (state, action: PayloadAction<IUserPlans | null>) => {
            state.value = action.payload;
        },
    },
});

export const { setUserPlansValue } = userPlansSlice.actions;
export default userPlansSlice.reducer;