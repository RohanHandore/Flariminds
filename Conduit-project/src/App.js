import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './Screens/Dashboard/Dashboard';
import PreIntegration from './Screens/CustomerStatus/PreIntegration/PreIntegration';
import Integration from './Screens/CustomerStatus/Integration/Integration';
import Live from './Screens/CustomerStatus/Live/Live';
import {DistributerBirdView} from './Screens/CustomerStatus/DistributorBirdView/DistributorBirdView';
import {Retail} from './Screens/RetailPartners/RetailPartners';

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route exact path="/" element={<Dashboard />}></Route>
					<Route exact path="/preintegration" element={<PreIntegration />}></Route>
					<Route exact path="/integration" element={<Integration />}></Route>
					<Route exact path="/live" element={<Live />}></Route>
					<Route exact path="/distributedbirdview" element={<DistributerBirdView/>}></Route>
					<Route exact path="/retail" element={<Retail />}></Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
