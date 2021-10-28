import logo from './logo.svg';
import React from "react";
import {BrowserRouter as Router, Route, NavLink, Switch} from "react-router-dom";
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import TripRecordList from "./components/TripRecordList";


function App() {
  return (
    <div>
      <Header />
      <div className="App">
        <Router>
              <Main />
        </Router>
      </div>
      <Footer />
    </div>
  );
}

// function Navigation() {
//   return(
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
//       <div className='container'>
//         <ul className="navbar-nav mr-auto">
//           <li className="nav-item"><NavLink exact className="nav-link" activeClassName="active" to="/">Home</NavLink></li>
//           <li className="nav-item"><NavLink exact className="nav-link" activeClassName="active" to="/articles">Articles</NavLink></li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

function Main() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/triprecords" component={TripRecordList} />
    </Switch>
  )
}



export default App;
