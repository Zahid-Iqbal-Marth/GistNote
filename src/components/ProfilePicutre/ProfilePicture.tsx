import React from 'react'
import "./ProfilePicture.css"
interface ProfilePicturePropsType {
    dp : string
}
const ProfilePicture : (props: ProfilePicturePropsType) => JSX.Element = (props : ProfilePicturePropsType) => {

    const {dp} = props;
    return (
        <img className="profilepicture-image" src={dp} alt="dp" />
    )
}

export default ProfilePicture
