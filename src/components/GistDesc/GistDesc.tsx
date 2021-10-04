import React from 'react'
import ProfilePicture from '../ProfilePicutre/ProfilePicture';
import { Link } from 'react-router-dom';
import "./GistDesc.css";

export interface GistDescPropsType {
    dp : string, 
    ownerName : string, 
    date : string, 
    description : string, 
    filename : string
}
const GistDesc : (props: GistDescPropsType) => JSX.Element = (props : GistDescPropsType) => {

    const {
        dp, 
        ownerName, 
        date, 
        description, 
        filename
    } = props;
    return (
        <section className="gistdesc-section">
            <section>
                <Link to={`/profile/${ownerName}`} className="gistdesc-link-decor">
                    <ProfilePicture dp={dp}/>
                </Link>
            </section>
            <section className="gistdesc-text-details">
                <section className="gistdesc-name-notes">
                    <span >
                        {ownerName} / 
                    </span>
                    <span >
                        <strong>
                             {` ${filename}`}
                        </strong>
                    </span>
                </section>
                <section className="gistdesc-time-keyword">
                    {date}
                </section>
                <section className="gistdesc-time-keyword">
                    <small>
                        {
                            description ? description.slice(0,15) : null
                        }
                    </small>
                </section>
            </section>
        </section>
    )
}

export default  GistDesc