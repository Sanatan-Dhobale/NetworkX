import { createSlice } from "@reduxjs/toolkit"
import { loginUser, registerUser, getAboutUser, getAllUsers, sentConnectionRequest, getConnectionRequest, getMyConnectionRequests } from "../../action/authAction";


const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profile_fetched: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) =>{
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) =>{
            state.isTokenThere = false
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true,
                    state.message = "Knoking the door"
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = "Login successful"
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;

            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registring you"
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = false;
                state.message = {
                    message: "Registration is successful, please login",
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            .addCase(getAboutUser.fulfilled, (state, action)=>{                
                state.isLoading = false;
                state.isError = false;
                state.profileFetched = true;
                state.loggedIn = true;
                state.user = action.payload;                            
            })
            .addCase(getAllUsers.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.all_profile_fetched = true;
                state.all_users = action.payload.profiles;
            })
            .addCase(sentConnectionRequest.fulfilled, (state, action)=>{
                state.message = action.payload.message;
            })
            .addCase(sentConnectionRequest.rejected, (state, action)=>{
                state.message = action.payload;
            })
            .addCase(getConnectionRequest.fulfilled, (state, action)=>{
                state.connections = action.payload;
            })
            .addCase(getConnectionRequest.rejected, (state, action)=>{
                state.message = action.payload;
            })
            .addCase(getMyConnectionRequests.fulfilled, (state, action)=>{
                state.connectionRequest = action.payload;                
            })
            .addCase(getMyConnectionRequests.rejected, (state, action)=>{
                state.message = action.payload;
            })

    }
});

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;

export default authSlice.reducer;