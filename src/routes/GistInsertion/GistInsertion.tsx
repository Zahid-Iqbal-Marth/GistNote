import React, { useState, useCallback, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createGistAPI, fetchGistNotesAPI, updateGistAPI } from '../../Middleware/gistMiddleware';
import { useHistory } from 'react-router';
import { getDetailGistView, GistDetailedViewType } from '../../Selectors/gistSelectors';
import { GistFilesType, GistFileType, setApiCallState } from '../../Slices/gistSlice';
import { useAppDispatch } from '../../hooks';
import withEnhancedLogic, { WrappedCompPropsType } from '../../components/enhanceLoggic';
import { getAuthData } from '../../Selectors/ownerSelectors';
import Error from "../../components/Error/Error"
import Loading from "../../components/Loading/Loading"
import {map as lodashMap} from "lodash"
import "./GistInsertion.css";
import { StoreStateType } from '../../store';

interface NewGistType {
    description : string,
    notes : GistFilesType,
}

const GistInsertion : (props: WrappedCompPropsType) => JSX.Element 
    = (props: WrappedCompPropsType) => {

    const {
        handleError,
        apiCallState,
        errorMessage,
        params : {gistID = ""},
    } = props

    //defining hooks
    const dispatch = useAppDispatch()
    const history = useHistory()

    //selectors
    const detailGistViewData : GistDetailedViewType = useSelector((state : StoreStateType) => getDetailGistView(state, gistID))
    const {ownerName : loggedInUserName}  = useSelector(getAuthData)

    //extracting data from selectors
    const update : boolean = gistID ? true : false
    const {
        description,
        files,
    } = detailGistViewData

    //state
    const [gistNoteCount, setgistNoteCount] = useState<number>(1)

    //useEffect
    useEffect(() => {
        if (update)
        {
            dispatch(setApiCallState('loading'))
            dispatch(fetchGistNotesAPI({
                handleError,
                gistID,
                isLoggedIn : loggedInUserName ? true : false
            }))
        }
    }, [])
    
    // default value for state
    const defaultSate : NewGistType = update ? {
        description,
        notes : files,
    } : 
    {
        description : "",
        notes : {
            [gistNoteCount] : {
                filename : "",
                content : ""
            }
        }
    }

    //state
    const [newGist, setNewGist] = useState<NewGistType>(defaultSate) 

    //event handles
    const handleRedirect : (id: string) => void = (id : string) => {
        history.push(`/gistdetail/${id}`);
    }
    
    const handleCUGist : (event: FormEvent<HTMLFormElement>) => void = useCallback(
        (event : FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const {
                notes,
                description
            } = newGist;
            const files : {
                [filename : string] : {
                    content : string
                }
            } = {}
            lodashMap(notes, note => {
                const {
                    filename,
                    content
                } = note
                files[filename] = {
                   content 
                }
            })
            const gistInsertionTemplate = {
                description,
                public : true,
                files
            }
            update ? 
            dispatch(updateGistAPI({
                handleError, 
                gist : gistInsertionTemplate, 
                gistID, 
                handleRedirect})) : 
            dispatch(createGistAPI({
                handleError, 
                gist : gistInsertionTemplate, 
                handleRedirect}))
        },
        [newGist],
    )

    const onAddfile : () => void = useCallback(
        () => {
            setgistNoteCount(prevState => prevState + 1)
            setNewGist(preState => ({
                ...preState,
                notes : {
                    ...preState.notes,
                    [`z${gistNoteCount}`] : {
                        filename : "",
                        content : ""
                    }
                }
            }))
        },
        [gistNoteCount, setNewGist, setgistNoteCount],
    )
    const handleDiscChange : (event: ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event : ChangeEvent<HTMLInputElement>)=> {
            setNewGist( preState =>  
                ({
                ...preState,
                description :event.target.value
                })
            )
        },
        [setNewGist],
    )
    
    //UI snipits
    const gistUI : (buttonText: string) => JSX.Element = useCallback(
        (buttonText : string) => (
            <button 
            type="submit" 
            className="gistinsertion-submit-btn">
            <strong>
                {buttonText}
            </strong>
            </button>
        ),
        [gistID],
    )
    const createGistUI : JSX.Element = gistUI("Create Gist")
    const updateGistUI : JSX.Element = gistUI("Update Gist")
    return (
        errorMessage ? <Error errorMessage={errorMessage}/> :
        apiCallState === "loading" ? <Loading/> : 
        <form onSubmit={handleCUGist} className="gistinsertion-form">
            <input  
                    className="gistinsertion-form-field"
                    type="text" 
                    name="desc" 
                    placeholder="Enter gist description..."
                    value={newGist.description} 
                    onChange={handleDiscChange}
            />
            {
                lodashMap(newGist.notes, (note : GistFileType, noteID : string) => {
                    const {
                        filename,
                        content
                    } = note
                    const handleTitleChange : (event: ChangeEvent<HTMLInputElement>) => void 
                        = (event: ChangeEvent<HTMLInputElement>)=> {

                        const reg = new RegExp("[a-zA-Z_][a-zA-Z0-9_]*");
                        const valid = reg.test(event.target.value);
                        if (valid || event.target.value === "") {
                            setNewGist(prevState => (
                                {
                                    ...prevState,
                                    notes : {
                                        ...prevState.notes,
                                        [noteID] : {
                                            ...prevState.notes[noteID],
                                            filename : event.target.value
                                        }
                                    }
                                }
                            )) 
                        }
                    }
                    const handleContentChange : (event: ChangeEvent<HTMLTextAreaElement>) => void 
                        = (event: ChangeEvent<HTMLTextAreaElement>)=> {
                            
                        setNewGist(preState => (
                            {
                                ...preState,
                                notes : {
                                    ...preState.notes,
                                    [noteID] : {
                                        ...preState.notes[noteID],
                                        content :event.target.value
                                    }
                                }
                            }
                        ))
                    }
                    return (<>
                        <input  
                            className="gistinsertion-form-field"
                            type="text" 
                            name="filename" 
                            placeholder="Enter file name. It must start with a non Integer"
                            value={filename} 
                            onChange={handleTitleChange}
                            required
                            />
                        <textarea   
                                className="gistinsertion-form-field"
                                name="content"
                                id="" 
                                cols={30} 
                                rows={content.split(/\r\n|\r|\n/).length}
                                placeholder="Enter file content..."
                                value={content}
                                onChange={handleContentChange}
                                required
                                />
                        </>)
                })
            }
                <button 
                        type="button" 
                        className="gistinsertion-submit-btn"
                        onClick={onAddfile}>
                        <strong>
                            Add file
                        </strong>
                </button>
            {update ? updateGistUI : createGistUI}
        </form>
    )
}

export default withEnhancedLogic(GistInsertion);