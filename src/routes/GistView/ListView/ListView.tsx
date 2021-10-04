import React, {useCallback} from 'react'
import "./ListView.css"
import ProfilePicture from '../../../components/ProfilePicutre/ProfilePicture'
import { useHistory } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {GistViewType} from "../../../Selectors/gistSelectors"

interface ListViewPropsType {
  listViewProps : GistViewType[]
}
const ListView : (props: ListViewPropsType) => JSX.Element = (props : ListViewPropsType) => {
    //extracting props
    const {
        listViewProps : tableData,
    } = props;
    //defining hooks
    const history = useHistory();
    const handleRoute : (gistID: string) => void = useCallback(
      (gistID : string) => {
        history.push(`/gistdetail/${gistID}`) 
    },[])
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead className=".list-view th">
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Time</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">NoteBook</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row : GistViewType) => {
            const {gistID, dp, ownerName, date, time, description, files} = row
            const index = Object.keys(files)[0]
            const {
                [index] : {
                    filename = ""
                } = {}
            } = files
            return (<TableRow key={gistID} onClick={() => handleRoute(gistID)}>
                <TableCell>
                    <button className="list-check-btn" type="button" />
                </TableCell>
                <TableCell align="left"><ProfilePicture dp={dp}/></TableCell>
                <TableCell align="left">{ownerName}</TableCell>
                <TableCell align="left">{date}</TableCell>
                <TableCell align="left">{time}</TableCell>
                <TableCell align="left">{description !== null ? description.slice(0,20) : null}</TableCell>
                <TableCell align="left">{filename.slice(0,15)}</TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
}


export default ListView