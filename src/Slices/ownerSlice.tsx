import { createSlice } from "@reduxjs/toolkit";

export interface OwnerType {
    ownerID : string,
    ownerName : string,
    dp : string, 
}
export interface OwnerSliceStateType {
    owners : {
        [ownerID : string] : OwnerType
    }
    auth : {
        loggedInUser : string,
    }
}

const initialState : OwnerSliceStateType = {
    owners : {
    },
    auth : {
        loggedInUser : "",
    }
}
const ownersSlice = createSlice({
    name : 'owners',
    initialState,
    reducers : {
        addOwner(state : OwnerSliceStateType, action) {
            const owner = action.payload;
            const {
                ownerName,
                ownerID,
                dp,
            } : OwnerType = owner
            return {
                ...state,
                owners : {
                    ...state.owners,
                    [ownerID] : {
                        ownerID : ownerID,
                        ownerName : ownerName,
                        dp : dp, 
                    }
                }
            }            
        },
        login(state : OwnerSliceStateType, action){
            const userID = action.payload
            return {
                ...state,
                auth : {
                    loggedInUser : userID
                }
            }
        }
    }
})

export const {addOwner, login} = ownersSlice.actions
export default ownersSlice.reducer