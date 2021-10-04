import React, { useState, useEffect, useCallback} from 'react'
import { useSelector } from 'react-redux';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {getSearchBy} from "../../Selectors/gistSelectors";
import "./Pagination.css"

interface PaginationPropsType {
    totalPages : string,
    onPageChange : (value : number) => void,
    dataLength : number,
    itemsPerPage : number,
}

const Pagination : (props: PaginationPropsType) => JSX.Element = (props : PaginationPropsType) => {

    const {
        totalPages,
        onPageChange,
        dataLength,
        itemsPerPage,
    } = props;

    //selectors
    const searchBy : string = useSelector(getSearchBy)

    //state
    const [currentPageNum, setcurrentPageNum] = useState<number>(1);

    //hooks
    useEffect(() => {
        !searchBy && onPageChange(currentPageNum)
    }, [currentPageNum, searchBy]);
    useEffect(() => {
        setcurrentPageNum(1)
    }, [searchBy])

    //event handlers
    const handleNextPage : () => void = useCallback(() =>{
        setcurrentPageNum(preState => preState + 1)
    }, [setcurrentPageNum]);
    const handlePrevPage : () => void = useCallback(() =>{
        setcurrentPageNum(preState => preState - 1)
    }, [setcurrentPageNum]);

    //consts
    const disableNextPage : boolean = currentPageNum > 1 && dataLength < itemsPerPage;
    const disablePreviousPage : boolean = currentPageNum === 1;
    const displayPagination : boolean = !(dataLength < itemsPerPage && currentPageNum === 1)
    return (
            <section className={displayPagination ? "pagination-display" : "pagination-hidden"}>
                <section className={"pagination-section"}>
                <section>
                </section>
                <section>
                    <button 
                        className={"pagination-nextpage-btn " + (disableNextPage ? "pagination-nextpage-btn-disabled" : "")} 
                        disabled = {disableNextPage}
                        onClick={handleNextPage}>
                        <span className="pagination-nextpage-text">Next Page</span> 
                        <ArrowForwardIcon/>
                    </button>
                </section>
                <section className="pagination-nav-section">
                    <span className="currentPage">
                        Page <input type="number" value={currentPageNum} disabled />
                        {totalPages}
                    </span>
                    <button 
                        onClick={handlePrevPage}
                        disabled = {disablePreviousPage}>
                        <ArrowBackIosIcon className={"pagination-nav-btn " + (disablePreviousPage ? "pagination-nav-btn-disabled" : "")}/>
                    </button>
                    <button 
                        onClick={handleNextPage}
                        disabled = {disableNextPage}>
                        <ArrowForwardIosIcon className={"pagination-nav-btn " + (disableNextPage ? "pagination-nav-btn-disabled" : "")} />
                    </button>
                </section>
            </section>
        
            </section>
            )
}



export default Pagination;
