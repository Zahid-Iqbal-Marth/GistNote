
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApiCallState, getErrorMessage } from '../Selectors/gistSelectors';
import { setApiCallState, setError } from '../Slices/gistSlice';

interface URLParamsType {
    match : {
        params : { 
            gistID? : string,
            ownerName? : string
        }
    }
}
export interface WrappedCompPropsType {
    handleError : (error : string) => void,
    apiCallState : string,
    errorMessage : string,
    params : { 
        gistID : string,
        ownerName : string
    }
}
const withEnhancedLogic = (WrappedComponent : Function) => {
// And return another component
    const HOC =  ({ match }: URLParamsType, props : object) => {

            const apiCallState : string = useSelector(getApiCallState)
            const errorMessage : string = useSelector(getErrorMessage)
            const dispatch = useDispatch()

            useEffect(() => {
                dispatch(setError(''))
            }, [])
            const handleError : (error: string) => void = useCallback((error : string) => {
                dispatch(setApiCallState('idle')) 
                dispatch(setError(error)) 
            },[setApiCallState])

            return (
                <WrappedComponent 
                    handleError={handleError}
                    apiCallState={apiCallState}
                    errorMessage={errorMessage}
                    params={match.params}/>
            )
    }
    return HOC
};

export default withEnhancedLogic;