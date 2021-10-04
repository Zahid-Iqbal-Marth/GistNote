import {returnAPI, returnHeaders} from "./middlewareUtilities"
import {addOwner, login} from "../Slices/ownerSlice"
import { AnyAction, Dispatch } from "redux"

interface ownerResponceDataType  {
    login : string,
    id : string,
    avatar_url : string
}
export const loginAPI : (userName: string) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = (userName : string) => async (dispatch : Dispatch<AnyAction>) => {
        
    try {
        const ownerResponce = await fetch(returnAPI(`users/${userName}`),returnHeaders())
        const ownerResponceData : ownerResponceDataType = await ownerResponce.json()
        const {
            login : ownerName,
            id : ownerID,
            avatar_url : dp
        } = ownerResponceData
        dispatch(addOwner({
            ownerName, ownerID, dp
        }))
        dispatch(login(ownerID))	
    }
    catch(error){
        console.log("Error : ", error)
    }
}