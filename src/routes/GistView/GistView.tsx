import React, {useState, useCallback}from 'react'
import ListView from './ListView/ListView';
import GridView from './GridView/GridView';
import Loading from '../../components/Loading/Loading';
import Pagination from '../../components/Pagination/Pagination';
import { getGistsView, GistViewType, } from '../../Selectors/gistSelectors';
import { useSelector } from 'react-redux';
import { setApiCallState } from '../../Slices/gistSlice';
import { useEffect } from "react";
import { fetchGistsAPI } from '../../Middleware/gistMiddleware';
import { List, GridOn } from '@material-ui/icons';
import { useAppDispatch } from '../../hooks';
import Error from "../../components/Error/Error"
import './GistView.css'
import withEnhancedLogic, { WrappedCompPropsType } from '../../components/enhanceLoggic';

const GistView : (props: WrappedCompPropsType) => JSX.Element = (props: WrappedCompPropsType) => {

    const {
        handleError,
        apiCallState,
        errorMessage,
    } = props

    //selectors
    const gistViewData : GistViewType[] = useSelector(getGistsView)

    //state
    const [view, setView] = useState<string>('list')
    
    //defining hooks
	const dispatch = useAppDispatch()
    const itemsPerPage : number = 12
    useEffect(() => {
        onPageChange(1)
    }, [])

    //event handlers
    const onPageChange : (pageNum: number) => void = useCallback((pageNum : number) => {
        dispatch(setApiCallState('loading'))
        dispatch(fetchGistsAPI({
            handleError, pageNum, itemsPerPage
        }))
    },[])
    
    //consts
    const totalGists : number = 3000
    const totalPages : number = Math.ceil(totalGists/itemsPerPage)
    //preparing props
    return (
        errorMessage ? <Error errorMessage={errorMessage}/> : 
        <>
        <section className="gridview-view-type">
            <button type="button" onClick={() => setView("grid")}>
                <GridOn className={view === 'list' ? 
                        "gridview-icon" : "gridview-icon-selected"}/>
            </button>
            <div className="gridview-vb"/>
            <button type="button" onClick={() => setView("list")}>
                <List className={view === 'list' ? 
                        "gridview-icon-selected" : "gridview-icon"}/>
            </button>
        </section>

        { apiCallState === "loading" ?  <Loading /> : undefined}
            <section className={apiCallState === "loading" ? "gridview-hidden" : "gridview-display"}>
                <section className="gridview-view">
                    {
                        view === 'list' ?       
                        <ListView listViewProps={gistViewData}/> :
                        <GridView gridViewProps={gistViewData}/>
                    }
                </section>
                <section className="gridview-paggination">
                    <Pagination
                        totalPages={`of ${totalPages}`}
                        onPageChange={onPageChange}
                        dataLength={gistViewData.length}
                        itemsPerPage={itemsPerPage}
                    />
                </section>
            </section>
        </>
    )
}

export default withEnhancedLogic(GistView);