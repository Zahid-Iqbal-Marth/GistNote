import React, {useState} from 'react'
import "./TextArea.css"

export interface TextAreaPropType {
    defaultNotes : string,
    defaultRows : number
}
const TextArea : (props: TextAreaPropType) => JSX.Element = (props : TextAreaPropType) => {
    //extracting props
    const {
        defaultNotes,
        defaultRows
    } = props;
    return (
        <textarea className="textarea-section"
        name="" 
        id="" 
        rows={defaultRows} 
        value={defaultNotes}
        disabled
    ></textarea>
    
    )
}


export default TextArea;