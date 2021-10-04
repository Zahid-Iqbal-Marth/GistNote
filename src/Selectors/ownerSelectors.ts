import {map as lodashMap} from "lodash"
import {filter as lodashFilter} from "lodash"
import { GistFilesType, GistType } from "../Slices/gistSlice";
import { OwnerType } from "../Slices/ownerSlice";
import { StoreStateType } from "../store";
export interface OwnerGistType {
    gistID : string,
    files : GistFilesType,
    created_at : Date,
    date : string,
    description : string    
}
export interface OwnerDataType{
    ownerID : string,
    ownerName : string,
    dp : string,
    github : string,
    ownerGists : OwnerGistType[]      
}
export const getOwnerData : (state: StoreStateType, ownerName: string) => OwnerDataType
    = (state : StoreStateType, ownerName : string) => {

    const {
        gistsState : {
            gists = {}
        },
        ownersState : {
            owners = {}
        }
    } = state;
    const selectedOwner = lodashFilter(owners, (owner : OwnerType) => owner.ownerName === ownerName)[0]
    const {ownerID, dp} = selectedOwner
    const ownerData : OwnerDataType = {
        ownerID,
        ownerName,
        dp,
        github : `https://api.github.com/users/${ownerName}`,
        ownerGists : lodashFilter(gists, (gists : GistType) => gists.ownerID === ownerID)    
    }
    return ownerData
}

export const getAuthData : (state: StoreStateType) => {
    ownerName: string;
    ownerID: string;
    dp: string;
}
    = (state : StoreStateType) => {

    const {
        ownersState : {
            owners,
            auth : {
                loggedInUser
            }
        }
    } = state;
    const {
        [loggedInUser] : {
            ownerName = "",
            ownerID = "",
            dp = ""
        } = {}
    } = owners
    const loggedInUserData = {
        ownerName,
        ownerID,
        dp
    }
    return loggedInUserData  
}