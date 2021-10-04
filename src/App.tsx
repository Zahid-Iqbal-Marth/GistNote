import "./App.css"
import Navbar from "./components/Navbar/Navbar"
import GistView from "./routes/GistView/GistView";
import GistDetailedView from "./routes/GistDetailedView/GistDetailedView";
import GistInsertion from "./routes/GistInsertion/GistInsertion";
import Profile from "./routes/Profile/Profile";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
function App() {

	return (
		<Router>
		<Navbar/>
		<main className="App-main-section">
			<Switch>
				<Route path="/" exact component={GistView}/>
				<Route path="/gistdetail/:gistID" exact component={GistDetailedView}/>
				<Route path="/gistinsertion/:gistID?" exact component={GistInsertion}/>
				<Route path="/profile/:ownerName" exact component={Profile}/>
			</Switch>
		</main>
		</Router>
	);
}

export default App;
