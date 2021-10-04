import { createStore, applyMiddleware, combineReducers, AnyAction } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk'; 
import logger from 'redux-logger';
import gistReducer, { GistSliceStateType } from './Slices/gistSlice';
import ownerReducer, { OwnerSliceStateType } from './Slices/ownerSlice';



export interface StoreStateType {
  gistsState : GistSliceStateType;
  ownersState : OwnerSliceStateType;
} 

const rootReducer = combineReducers({
  gistsState : gistReducer,
  ownersState : ownerReducer
})
const store = createStore( rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<StoreStateType, AnyAction>, logger)); 


export default store;
export type AppDispatch = typeof store.dispatch
