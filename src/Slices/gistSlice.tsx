import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {map as lodashMap} from "lodash"

export interface GistFileType {
    filename : string,
    content : string
}
export interface GistFilesType {
    [filename : string] : GistFileType
}
export interface GistType {
    gistID : string,
    date : string,
    time : string,
    created_at : Date,
    description : string,
    ownerID : string,
    stared : boolean,
    files : GistFilesType,
}

export interface SearchByType {
    type : string,
    content : string
}

export interface GistSliceStateType {
    gists : {
        [gistID : string] : GistType
    },
    apiCallState : string,
    error : string,
    searchBy : SearchByType
}

//actions type
export interface ReceiveGistsType {
    gistID : string,
    created_at : Date, 
    description : string, 
    ownerID : string, 
    files : GistFilesType, 
    stared: boolean
}


const initialState : GistSliceStateType = {
    gists : {
    },
    apiCallState : 'idle',
    error : '',
    searchBy : {
        type : 'id',
        content : ''
    }
}

const gistsSlice = createSlice({
    name : 'gists',
    initialState,
    reducers : {
        receiveGists(state : GistSliceStateType, {payload} : PayloadAction<ReceiveGistsType>){
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
            const {
                gistID,
                created_at,
                description,
                ownerID,
                files,
                stared,
            } = payload
            const date = new Date(created_at)
            const gistNotes : GistFilesType = {};
            lodashMap(files, (file : GistFileType) => {    
                const {
                    content = "",
                    filename = ""
                } = file
                gistNotes[filename] = {
                    filename,
                    content
                }
            })
            return {
                ...state,
                gists : {
                    ...state.gists,
                    [gistID] : {
                        gistID,
                        date : date.toLocaleDateString("en-US",options),
                        time : date.toLocaleTimeString(),
                        created_at : date,
                        description,
                        ownerID,
                        stared : stared,
                        files : gistNotes,
                    }
                },
                
            }            
        },
        deleteGist(state : GistSliceStateType, {payload : gistID} : PayloadAction<string>){  
            const {
                gists
            } = state
            const { [gistID]: value, ...updatedGist } = gists;
            return {
                ...state,
                gists: updatedGist
            }
        },
        starGistToggle(state : GistSliceStateType, {payload : gistID} : PayloadAction<string>){
            const {
                gists : {
                    [gistID] : {
                        stared
                    }
                }
            } = state
            return {
                ...state,
                gists : {
                    ...state.gists,
                    [gistID] : {
                        ...state.gists[gistID],
                        stared : !stared
                    }
                }
            }
        },
        setApiCallState(state : GistSliceStateType, {payload : apiCallState} : PayloadAction<string>){
            return {
                ...state,
                apiCallState
            }
        },
        cleanStore(state : GistSliceStateType){
            return {
                ...state,
                gists : {}
            }
        },
        setSearchBy(state : GistSliceStateType, {payload : searchBy} : PayloadAction<SearchByType>){
            return {
                ...state,
                searchBy
            }
        },
        setError(state : GistSliceStateType, {payload : error} : PayloadAction<string>){
            return {
                ...state,
                error
            }
        }
    },
})

export const {
    receiveGists,
    setApiCallState,
    cleanStore,
    setSearchBy,
    deleteGist,
    starGistToggle,
    setError
} = gistsSlice.actions
export default gistsSlice.reducer
