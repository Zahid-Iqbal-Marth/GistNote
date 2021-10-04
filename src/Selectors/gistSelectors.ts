import {map as lodashMap} from "lodash"
import { GistFilesType, GistType } from "../Slices/gistSlice";
import { StoreStateType } from "../store";

export interface GistViewType {
    gistID : string,
    dp : string,
    ownerName : string,
    date : string,
    time : string,
    created_at : Date,
    description : string,
    files : GistFilesType
}

export interface GistDetailedViewType {
    dp : string,
    ownerName : string,
    date : string,
    time : string,
    description : string,
    files : GistFilesType,
    starState : string
}

export const getGistsView : (state: StoreStateType) => GistViewType[] 
    = (state : StoreStateType) =>{

    const gistsView : GistViewType[] = []
    const {
        gistsState : {
            gists,
            searchBy
        },
        ownersState : {
            owners
        }
    } = state;
    const getData = (gist : GistType, gistID : string) => {
        const {
            date = "",
            time = "",
            description = "",
            created_at = new Date(),
            ownerID = "",
            files = {}        
        } = gist

        const patt = new RegExp(searchBy.content, 'i');
        const found = searchBy.type === 'id'? patt.test(gistID) : patt.test(description);
        if (!found) return

        const {
            [ownerID] : {
                ownerName = "",
                dp = ""
            } = {}
        } = owners
        gistsView.push({
            gistID,
            dp,
            ownerName,
            date,
            time,
            created_at,
            description,
            files
        })
    }
    gists !== {}  && lodashMap(gists, getData)
    return gistsView
}

export const getApiCallState : (state: StoreStateType) => string
    = (state : StoreStateType) => {

    const {
        gistsState : {
            apiCallState
        }
    } = state
    return apiCallState
}

export const getSearchBy : (state: StoreStateType) => string
    = (state : StoreStateType) => {
    const {
        gistsState : {
            searchBy : {
                content
            }
        }
    } = state
    return content
}

export const getErrorMessage : (state : StoreStateType) => string 
    = (state : StoreStateType) => {
        const {
            gistsState : {
                error
            }
        } = state
        return error
    }

export const getDetailGistView : (state: StoreStateType, gistID: string) => GistDetailedViewType
    = (state : StoreStateType, gistID : string) => {
    
    const {
        gistsState : {
            gists
        },
        ownersState : {
            owners
        }
    } = state;
    const {
        [gistID] : {
            date = "",
            time = "",
            description = "",
            ownerID = "",
            files = {},
            stared = false
        } = {}
    } = gists;
    const {
        [ownerID] : {
            ownerName = "",
            dp = ""
        } = {}
    } = owners
    const gistsDetailedView : GistDetailedViewType = {
        dp,
        ownerName,
        date,
        time,
        description,
        files,
        starState : stared ? " Unstar" : " Star"
    }

    return gistsDetailedView
}

