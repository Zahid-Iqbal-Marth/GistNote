import React, {useEffect, useCallback} from 'react'
import GistDesc, { GistDescPropsType } from '../../components/GistDesc/GistDesc';
import TextArea, { TextAreaPropType } from '../../components/TextArea/TextArea';
import { getDetailGistView, GistDetailedViewType } from '../../Selectors/gistSelectors';
import { useSelector } from 'react-redux';
import { GistFileType, setApiCallState } from '../../Slices/gistSlice';
import { useHistory } from 'react-router';
import { getAuthData } from '../../Selectors/ownerSelectors';
import {deleteGistAPI,fetchGistNotesAPI,forkGistAPI,starGistToggleAPI,} from '../../Middleware/gistMiddleware';
import Loading from '../../components/Loading/Loading';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { Edit, Delete, Code } from '@material-ui/icons';
import { useAppDispatch } from '../../hooks';
import Error from "../../components/Error/Error"
import withEnhancedLogic, { WrappedCompPropsType } from '../../components/enhanceLoggic';
import {map as lodashMap} from "lodash"
import "./GistDetailedView.css" 
import { StoreStateType } from '../../store';
import { OwnerType } from '../../Slices/ownerSlice';


const GistDetailedView : (props : WrappedCompPropsType) => JSX.Element 
    = (props : WrappedCompPropsType) => {

    const {
        handleError,
        apiCallState,
        errorMessage,
        params : {gistID} 
    } = props //extracting props

    const dispatch = useAppDispatch()//defining hooks
    const history = useHistory();
    
    const detailGistViewData : GistDetailedViewType = useSelector((state : StoreStateType) => getDetailGistView(state, gistID))
    const {ownerName : loggedInUserName} : OwnerType = useSelector(getAuthData);    //selectors

    const {
        dp,
        ownerName,
        date,
        description,
        files,
        starState
    } = detailGistViewData     //extracting and organizing data receive from selectors

    useEffect(() => { //api call for getting detailes of a gist
        if (apiCallState === "idle") {
            dispatch(setApiCallState('loading'))
            dispatch(fetchGistNotesAPI({
                handleError,
                gistID,
                isLoggedIn : loggedInUserName ? true : false
            }))
        }
    }, [gistID]) //for fork

    //event handlers
    const handleStarGist : () => void = useCallback(() => {
        dispatch(starGistToggleAPI(gistID, starState))
    },[gistID, starState])

    const handleForkRedirect : (id: string) => void = (id : string) => {
        history.push(`/gistdetail/${id}`);
    }
    const handleForkGist : () => void = useCallback(() => {
        dispatch(setApiCallState('loading')) 
        dispatch(forkGistAPI({handleError, gistID, handleForkRedirect}))
    },[gistID])

    const handleDeleteRedirect : () => void = () => {
        history.push(`/profile/${loggedInUserName}`)
    }
    const handleDelete : () => void = useCallback(() => {
        dispatch(deleteGistAPI({handleError, gistID, handleDeleteRedirect}))
    },[gistID])

    const handleEdit : () => void = useCallback(() =>{
        history.push(`/gistinsertion/${gistID}`)
    },[gistID])

    //preparing props
    const index : string = Object.keys(files)[0]
    const {
        [index] : {
            filename = ""
        } = {}
    } = files
    const gistDecsProps : GistDescPropsType ={
        dp,
        ownerName,
        date,
        description,
        filename,
     }
    //UI Snipits
    const editHandlers : JSX.Element = (
        <section className="gistdetailedview-eventhandlers">
            <button type="button" onClick={handleEdit}>
                <Edit/>
                {" Edit"}
            </button>
            <button type="button" onClick={handleDelete}>
                <Delete/>
                {" Delete"}
            </button>
        </section>
    )
    const disable : boolean = loggedInUserName === "" ? true : false
    const gistStatsUI : JSX.Element = (
        <section className="gistdetailedview-states-section">
            <section className="gistdetailedview-star">
                {
                    !disable ? (
                        <>
                        <button type="button"
                        onClick={handleStarGist}>
                    {starState === ' Star' ? <StarBorderIcon/> : <StarIcon/>}
                    {starState}
                         </button>
                    </>
                    ) : undefined
                }
            </section>
            {
                (!disable && ownerName !== loggedInUserName) ?
                <section className="gistdetailedview-fork" >
                    <button type="button" 
                            onClick={handleForkGist}>
                        <Code/>
                        {" Fork"}
                    </button>
                </section> : undefined
            }
        </section>
        )

    //rendered UI
    return (

        errorMessage ? <Error errorMessage={errorMessage}/> 
        : apiCallState === "loading" ? <Loading/> : 
        (<section className="gistdetailedview-section">
            <section className="gistdetailedview-desc">
                <GistDesc {...gistDecsProps}/>
                <section className="gistdetailedview-handlers">
                    {
                        loggedInUserName === gistDecsProps.ownerName ? editHandlers : undefined
                    }
                    {gistStatsUI}
                </section>
            </section>
            <section>
                { //handling multiple files
                    lodashMap(files, (file : GistFileType) => {
                        //extraxting data
                        const {
                            filename,
                            content,
                        } = file;
                        //preparing props
                        const textAreaProps : TextAreaPropType = {
                            defaultNotes : content.split('\n').map((line : string, index : number) => `${index + 1}   ${line}`).join('\n'),
                            defaultRows : content.split(/\r\n|\r|\n/).length
                        };
                        return (
                            <section key="filename" className="gistdetailedview-notes">
                            <section className="gistdetailedview-title">
                                <Code className="GistDetailedView-code-icon"/>
                                <span className="gistdetailedview-name">{filename}</span>
                            </section>
                            <section className="gistdetailedview-content">
                                <TextArea {...textAreaProps}/>
                            </section>
                        </section>
                        )
                    })
                }
            </section>
        </section>
                    )
    )
}

export default withEnhancedLogic(GistDetailedView);