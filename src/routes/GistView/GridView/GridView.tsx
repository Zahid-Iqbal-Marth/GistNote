import React, { useState } from 'react'
import "./GridView.css"
import GistDesc from "../../../components/GistDesc/GistDesc"
import TextArea from '../../../components/TextArea/TextArea';
import { Link } from 'react-router-dom';
import {GistViewType} from "../../../Selectors/gistSelectors"

interface GridViewProps {
    gridViewProps : GistViewType[]
}
const  GridView : (props: GridViewProps) => JSX.Element = (props : GridViewProps) => {
    
    const {
        gridViewProps
    } = props;
    return (
        <>
        <section className="gridview-items-display">
            {
            gridViewProps.map((singleGist : GistViewType) => {
                const {
                    gistID, 
                    dp, 
                    ownerName, 
                    date, 
                    description, 
                    files
                } = singleGist
                const gistDecsProps = {
                    dp, 
                    ownerName, 
                    date, 
                    description, 
                    filename : ((files === {}) ? "" : files[Object.keys(files)[0]].filename).slice(0,15),
                }
                const textAreaProps = {
                    isEditable : false,
                    defaultNotes : `https://api.github.com/gists/${gistID}`,
                    defaultRows : 5
                };
                return (
                    <Link to={`/gistdetail/${gistID}`} key={gistID} className="GistView-link-decor">
                        <section  className="gridview-box">
                            <TextArea {...textAreaProps}/>
                            <hr />
                            <GistDesc {...gistDecsProps}/>
                        </section>
                    </Link>
            )})}
        </section>

        </>
    )
}


export default  GridView;