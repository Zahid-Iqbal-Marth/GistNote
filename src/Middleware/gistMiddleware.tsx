import { cleanStore, setApiCallState, receiveGists, deleteGist, starGistToggle } from "../Slices/gistSlice";
import { addOwner } from "../Slices/ownerSlice";
import {returnAPI, returnHeaders, AUTH_TOKEN} from "./middlewareUtilities"
import { AnyAction, Dispatch } from "redux";
import {map as lodashMap} from "lodash"

export interface GistsResponceDataType {
    owner : {
        login : string,
        id : string,
        avatar_url : string
    },
    id : string,
    created_at : Date,
    description : string,
    files : {},    
}

interface FetchGistsAPIParamsType{
    handleError : (error : string) => void
    pageNum : number, 
    itemsPerPage : number
}

export const fetchGistsAPI : ({ handleError, pageNum, itemsPerPage }: FetchGistsAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({ handleError, pageNum, itemsPerPage} :  FetchGistsAPIParamsType) => async (dispatch : Dispatch<AnyAction>) => {

    try {
        const gistsResponce = await fetch(returnAPI(`gists/public?page=${pageNum}&per_page=${itemsPerPage}`), returnHeaders());
        if (gistsResponce.status !== 200) {
            const errorMessage = gistsResponce.status === 403 ? "Error: 403 Forbidden" : gistsResponce.status === 403 ? "Error: 422 Validation failed" : ""
            handleError(errorMessage)
            return
        }
        const gistsResponceData : GistsResponceDataType[] = await gistsResponce.json()
        dispatch(cleanStore())
        const insertGist = (gist : GistsResponceDataType) => {
            const {
                owner : {
                    login : ownerName,
                    id : ownerID,
                    avatar_url : dp
                },
                id : gistID,
                created_at,
                description,
                files,
            } = gist
            dispatch(receiveGists({
                gistID, created_at, description, ownerID, files, stared : false
            }));
            dispatch(addOwner({
                ownerName, ownerID, dp
            }))
        }
        lodashMap(gistsResponceData, insertGist)
        dispatch(setApiCallState('idle'))
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }

}


interface FetchGistNotesAPIParamsType {
    handleError: (error: string) => void, 
    gistID: string, 
    isLoggedIn: boolean
}
export const fetchGistNotesAPI : ({ handleError, gistID, isLoggedIn }: FetchGistNotesAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({handleError, gistID, isLoggedIn}: FetchGistNotesAPIParamsType) => async (dispatch : Dispatch<AnyAction>) =>{
    
    try{
        const notesResponce = await fetch(returnAPI(`gists/${gistID}`), returnHeaders());
        if (notesResponce.status === 404) {
            handleError(`This item doesn't exist`)
            return
        }
        const notesResponceData : GistsResponceDataType = await notesResponce.json()
        const {
            owner : {
                login : ownerName,
                id : ownerID,
                avatar_url : dp
            },
            created_at,
            description,
            files,
        } = notesResponceData
        if (isLoggedIn){
            const isStarGistsResponce = await fetch(returnAPI(`gists/${gistID}/star`), returnHeaders());
            const staredStatus = isStarGistsResponce.status === 204 ? true : false
            console.log("isStarGistsResponce", isStarGistsResponce)
            dispatch(receiveGists({
                gistID, created_at, description, ownerID, files, stared : staredStatus
            }));
        }
        else{
            dispatch(receiveGists({
                gistID, created_at, description, ownerID, files, stared : false
            }));
        }
        dispatch(addOwner({
            ownerName, ownerID, dp
        }))
        dispatch(setApiCallState('idle'))
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }
}

interface FetchGistsOfUserAPIParamsType {
    handleError : (error: string) => void, 
    ownerName : string, 
    pageNum : number, 
    itemsPerPage : number,
}

export const fetchGistsOfUserAPI : ({ handleError, ownerName, pageNum, itemsPerPage }: FetchGistsOfUserAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({handleError, ownerName, pageNum, itemsPerPage}:FetchGistsOfUserAPIParamsType) => async(dispatch : Dispatch<AnyAction>)=> {
   
    try{
        const userGistsResponce = await fetch(returnAPI(`users/${ownerName}/gists?page=${pageNum}&per_page=${itemsPerPage}`), returnHeaders());
        if (userGistsResponce.status === 404) {
            handleError(`This User doesn't exist`)
            return
        }
        const userGistsResponceData : GistsResponceDataType[] = await userGistsResponce.json()
        dispatch(cleanStore())
        const insertUserGist = (gist : GistsResponceDataType) => {
            const {
                owner : {
                    id : ownerID,
                },
                id : gistID,
                created_at,
                description,
                files,
            } = gist
            dispatch(receiveGists({
                gistID, created_at, description, ownerID, files, stared : false
            }));
        }
        lodashMap(userGistsResponceData, insertUserGist)
        dispatch(setApiCallState('idle'))
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }
}
interface CreateGistAPIParamsType{
    handleError : (error: string) => void, 
    gist : {
        description : string,
        public : boolean,
        files : {
            [filename : string] : {
                content : string
            }
        }
    }
    handleRedirect : (id : string) => void, 
}
export const createGistAPI : ({ handleError, gist, handleRedirect }: CreateGistAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({handleError, gist, handleRedirect} : CreateGistAPIParamsType) => async (dispatch : Dispatch<AnyAction>) => {

    try{
        const createGistsResponce = await fetch(returnAPI(`gists`), returnHeaders('POST',JSON.stringify(gist)));
        if (createGistsResponce.status === 422) {
            handleError(`Validation Error`)
            return
        }
        const createGistsResponceData : {id : string} = await createGistsResponce.json()
        const {
            id,
        } = createGistsResponceData
        handleRedirect(id)
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }
    
}

interface UpdateGistAPIParamsType{
    handleError : (error: string) => void, 
    gist : {
        description : string,
        public : boolean,
        files : {
            [filename : string] : {
                content : string
            }
        }
    },
    gistID : string
    handleRedirect : (id : string) => void, 
}
export const updateGistAPI : ({ handleError, gist, gistID, handleRedirect }: UpdateGistAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({handleError, gist, gistID, handleRedirect} : UpdateGistAPIParamsType) => async (dispatch : Dispatch<AnyAction>) => {

    try{
        const updateGistsResponce = await fetch(returnAPI(`gists/${gistID}`), returnHeaders('POST',JSON.stringify(gist)));
        if (updateGistsResponce.status === 422) {
            handleError(`Validation Error`)
            return
        }
        const updateGistsResponceData : {id : string} = await updateGistsResponce.json()
        const {
            id,
        } = updateGistsResponceData
        handleRedirect(id)
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }
    
}

interface DeleteGistAPIParamsType{
    handleError : (error: string) => void, 
    gistID : string
    handleDeleteRedirect : () => void, 
}

export const deleteGistAPI : ({ handleError, gistID, handleDeleteRedirect }: DeleteGistAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({handleError, gistID, handleDeleteRedirect} : DeleteGistAPIParamsType) => async (dispatch : Dispatch<AnyAction>) => {

    try{
        const deleteGistsResponce = await fetch(returnAPI(`gists/${gistID}`), returnHeaders('DELETE'));
        if (deleteGistsResponce.status === 404) {
            handleError(`Error : Resource Not Found`)
            return
        }
        dispatch(deleteGist(gistID))
        handleDeleteRedirect()
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }

}



export const starGistToggleAPI : (gistID: string, starState : string) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = (gistID : string, starState : string) => async  (dispatch : Dispatch<AnyAction>) => {

    try{
        const method = starState === ' Star' ? 'PUT' : 'DELETE'
        const starGistToggleAPIResponce = await fetch(returnAPI(`gists/${gistID}/star`),
        returnHeaders(
            method,
            "",
            new Headers({
                'Authorization': AUTH_TOKEN,
                'Content-Length' : "0"
            }
        )));
        starGistToggleAPIResponce.status === 204 && dispatch(starGistToggle(gistID))
    }
    catch(error){
        console.log("Error : ", error)
    }    
}

// export const unstarGistAPI :  (gistID: string) => (dispatch: Dispatch<AnyAction>) => Promise<void>
//     = (gistID : string) => async  (dispatch : Dispatch<AnyAction>) => {

//     try{
//         const unstarGistAPIResponce = await fetch(returnAPI(`gists/${gistID}/star`), 
//         returnHeaders(
//             'DELETE',
//             "",
//             new Headers({
//                 'Authorization': AUTH_TOKEN,
//                 'Content-Length' : "0"
//             }
//         )));
//         unstarGistAPIResponce.status === 204 && dispatch(unstarGist(gistID))
//     }
//     catch(error){
//         console.log("Error : ", error)
//     }        
// }

interface ForkGistAPIParamsType{
    handleError : (error: string) => void, 
    gistID : string
    handleForkRedirect : (id : string) => void, 
}
export const forkGistAPI : ({ handleError, gistID, handleForkRedirect }: ForkGistAPIParamsType) => (dispatch: Dispatch<AnyAction>) => Promise<void>
    = ({handleError, gistID, handleForkRedirect} : ForkGistAPIParamsType) => async (dispatch : Dispatch<AnyAction>) => {

    try{
        const forkGistsResponce = await fetch(returnAPI(`gists/${gistID}/forks`),returnHeaders('POST'));
        if (forkGistsResponce.status !== 201) {
            const errorMessage = forkGistsResponce.status === 404 ? "Error: Not Found" :
                                 forkGistsResponce.status === 422 ? "Validation Error" : ""
            handleError(`${errorMessage}`)
            return
        }
        const forkGistsResponceData : {id : string} = await forkGistsResponce.json()
        const {
            id,
        } = forkGistsResponceData
        dispatch(setApiCallState('idle')) 
        handleForkRedirect(id)
    }
    catch(error){
        handleError("TypeError: Failed to fetch")
    }
    
}