import React from "react"
import "./Error.css"

interface ErrorPropsType {
  errorMessage : string
}
const Error : (props: ErrorPropsType) => JSX.Element = (props: ErrorPropsType) =>{
  const {
    errorMessage
  } = props
    return (
        <section id="error-case" className="error-message">
        {errorMessage}
      </section>
    )
}


export default Error