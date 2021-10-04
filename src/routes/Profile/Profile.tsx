import React, { useEffect, useCallback } from 'react'
import TextArea, { TextAreaPropType } from '../../components/TextArea/TextArea';
import Loading from "../../components/Loading/Loading"
import GistDesc, { GistDescPropsType } from '../../components/GistDesc/GistDesc';
import Pagination from '../../components/Pagination/Pagination';
import {getOwnerData, OwnerDataType, OwnerGistType} from "../../Selectors/ownerSelectors"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { setApiCallState, setError } from '../../Slices/gistSlice';
import { getApiCallState, getErrorMessage } from '../../Selectors/gistSelectors';
import { fetchGistsOfUserAPI } from '../../Middleware/gistMiddleware';
import { useAppDispatch } from '../../hooks';
import Error from "../../components/Error/Error"
import withEnhancedLogic, { WrappedCompPropsType } from '../../components/enhanceLoggic';
import { StoreStateType } from '../../store';
import "./Profile.css"

const  Profile : (props: WrappedCompPropsType) => JSX.Element 
    = (props: WrappedCompPropsType) => {
        
    //extracting  url params
    const{
        handleError,
        errorMessage,
        apiCallState,
        params : {ownerName}
    } = props

    //selectors
    const ownerData : OwnerDataType = useSelector((state : StoreStateType) => getOwnerData(state, ownerName))
    //consts
    const itemsPerPage : number = 6
    
    //defining hooks
    const dispatch = useAppDispatch()
    useEffect(() => {
        onPageChange(1)
    }, [ownerName])
   
    //event handlers
    const onPageChange : (pageNum: number) => void = useCallback((pageNum : number) => {
        dispatch(setApiCallState('loading'))
        dispatch(fetchGistsOfUserAPI({
            handleError, ownerName, pageNum, itemsPerPage
        }))
    },[ownerName])
    
    //extracting selectors
    const {
        dp,
        ownerGists
    } = ownerData
    return (
        (
        errorMessage ? <Error errorMessage={errorMessage}/> : 
        <>
            { apiCallState === "loading" ?  <Loading/> : undefined}
            <section className={apiCallState === "loading" ? "profile-hidden" : "profile-display"}>
                <section className={"profile-section"}>
                    <section className="profile-pic-section">
                        <img src={dp} alt="dp" />
                        <p>{ownerName}</p>
                        <button type="button">
                            <a  
                                href={`https://github.com/${ownerName}`}
                                target="_blank">
                                View GitHub Profile
                            </a>
                        </button>
                    </section>
                    <section className="profile-border">
                    </section>
                    <section className="profile-gist-section">
                        {
                            ownerGists.map((singleGists : OwnerGistType) => {
                                //extracting data
                                const {
                                    gistID,
                                    files,
                                    description,
                                    date
                                } = singleGists;
                                //event handlers
                                const firstfilename : string = Object.keys(files)[0]
                                const textAreaProps : TextAreaPropType = {
                                    defaultNotes : `https://api.github.com/gists/${gistID}`,
                                    defaultRows : 5
                                };
                                const gistDecsProps : GistDescPropsType = {
                                    dp, 
                                    ownerName, 
                                    date, 
                                    description, 
                                    filename : firstfilename
                                }
                                return (
                                <>
                                <Link to={`/gistdetail/${gistID}`} key={gistID} className="profile-link-decor">
                                    <section  className="profile-gist-header">
                                        <GistDesc {...gistDecsProps}/>
                                    </section>
                                    <section className="profile-gist-textarea">  
                                            <TextArea {...textAreaProps}/>   
                                    </section>
                                </Link>
                                </>
                                )
                        })}
                    </section>
                </section>
                {
                    <section className="gridview-paggination">
                        <Pagination
                            totalPages={""}
                            onPageChange={onPageChange}
                            dataLength={Object.keys(ownerGists).length}
                            itemsPerPage={itemsPerPage}
                        />
                    </section>
                }
                <section className="profile-bottom-border">
                        <hr />
                </section>
            </section>

        </>)
    )
}

export default withEnhancedLogic(Profile);