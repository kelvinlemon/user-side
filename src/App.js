import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import $ from 'jquery';

function App() {
  const [foodType, setFoodType] = useState('Appetizers');
  const [foodItems, setFoodItems] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionCookies, setCookies] = useState([])
  const [buttonLabel, setButtonLabel] = useState('Menu');
  const [loginLabel, setLoginLabel] = useState('Login');
  const [userbuttonLabel, setUserButtonLabel] = useState('History');
  const [table, setTable] = useState();
  


  useEffect( () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/toorder',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      data:{
        table:'3',
        session:'342752'
      },
      success: function(response) {
        setButtonLabel('Menu');
        setFoodItems(response[0][0]);
        setTable(response[1]['table'])
        console.log(foodItems);
        console.log(table);
      },
      error: function(error) {
        console.error(error);
      }
    });

    $.ajax({
      type: 'POST',
      url: ' https://sdp2023-dbapi.herokuapp.com/csignin',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data: {
        name: '',
        password: ''
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      success: function(response) {
        if (response == 'logined'){
          setLoginLabel('Logined');
        }else{
            //alert(response)
        }
        setIsLoaded(true);
      },
      error: function(error) {
        console.error(error);
      }
    });
    
}, []);

  const handleMenuClick = () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/toorder',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        setButtonLabel('Menu');
        setFoodItems(response[0][0]);
        setTable(response[1]['table'])
      },
      error: function(error) {
        console.error(error);
      }
    }); 
    //setFoodItems(['Wings', 'Mozzarella Sticks', 'Nachos']);
  };

  const handleOrderedClick = () => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/ordered',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        setButtonLabel('Ordered');
        setFoodItems(response);
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
    
  };

  const handleSubmitPageClick = () => {
    setButtonLabel('Submit');
  };

  const handleLoginClick = () => {
    setButtonLabel('Login');
    
  };

  const handleLogoutClick = () => {
    var log=false;
    var reply = window.confirm('Are you sure to quit editing the note and log out?')
    if (reply){
      log=true;
    }
    if(log){
      $.ajax({
        type: 'GET',
        url: 'https://sdp2023-dbapi.herokuapp.com/clogout',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        success: function(response) {
          setButtonLabel('Login');
          setLoginLabel('Login');
          console.log(response);
        },
        error: function(error) {
          console.error(error);
        }
    });
    } 

  };


  const handleUserPageClick = () => {
    setButtonLabel('Logined');
  }
  if (isLoaded){
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-logo">
            <img src="logo.png" alt="Logo" />
            { loginLabel === 'Logined' && buttonLabel === 'Logined'? (
            <div className="App-login">
              <button className="App-Login-button"onClick={handleLogoutClick}>man logout</button>
            </div>
            ):loginLabel === 'Login' && buttonLabel != 'Login'? (
              <div className="App-login">
                <button className="App-Login-button"onClick={handleLoginClick}>man logoin</button>
              </div>
            ):loginLabel === 'Logined' && buttonLabel != 'Logined'? (
              <div className="App-login">
                <button className="App-Login-button"onClick={handleUserPageClick}>User</button>
              </div>
            ):null}
          </div>
          <div className="App-table">
            <p>Table Number: {table}</p>
          </div>
        </header>
        <main className="App-main">
          <h3>{buttonLabel}</h3>
          {buttonLabel === 'Menu' && <TypeList foodData ={foodItems}/>}
          {buttonLabel === 'Ordered' && <OrderedList foodData ={foodItems}/>}
          {buttonLabel === 'Submit' && <SubmitList/>}
          {buttonLabel === 'Login' && <LoginPage loginLabel={setLoginLabel} setButtonLabel={setButtonLabel} buttonLabel={buttonLabel}/>}
          {buttonLabel === 'Register' && <RegisterPage setButtonLabel={setButtonLabel}/>}
          {buttonLabel === 'Logined' && loginLabel ==='Logined' && <LoginedPage loginLabel={setLoginLabel}/>}
        </main>
        <footer className="App-footer">
          <button className="App-menu-button" onClick={handleMenuClick}>Menu</button>
          <button className="App-ordered-button" onClick={handleOrderedClick}>Ordered</button>
          <button className="App-submit-button"onClick={handleSubmitPageClick}>Submit</button>
        </footer>
      </div>
    );}
}

function TypeList(){
  const [foodType, setFoodType] = useState('Appetizers');
  const [foodItems, setFoodItems] = useState(['Wings', 'Mozzarella Sticks', 'Nachos']);

  const handleFoodTypeClick = (type) => {
    setFoodType(type);
    setFoodItems(['Wings', 'Mozzarella Sticks', 'Nachos']);
  };

  return(
          <div className="App-menu">
            <div className="App-food-types">
              <ul>
                <li className={foodType === 'Appetizers' ? 'active' : ''} onClick={() => handleFoodTypeClick('Appetizers')}>Appetizers</li>
                <li className={foodType === 'Entrees' ? 'active' : ''} onClick={() => handleFoodTypeClick('Entrees')}>Entrees</li>
                <li className={foodType === 'Desserts' ? 'active' : ''} onClick={() => handleFoodTypeClick('Desserts')}>Desserts</li>
              </ul>
            </div>
            <div className="App-food-items">
              <ul>
                {foodItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
  )
}

function OrderedList(){
  const [foodItems, setFoodItems] = useState(['Wings', 'Mozzarella Sticks', 'Nachos']);

  const addCustomerHistory = () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/addcustomerhistory',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:{
        foodid:'64073d3a0c2373a98b04a12c'
      },
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };
  
 return(
      <div>
        <h4>Your order:</h4>
        <ul>
          {foodItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        </div>
 )
}

function SubmitList(){

  const [foodItems, setFoodItems] = useState(['Wings', 'Mozzarella Sticks', 'Nachos']);  

  const handleSubmit = () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/submit',
      xhrFields: { withCredentials: true },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      withCredentials: 'include',
      crossDomain: true,
      data:{
        order: "64073d3a0c2373a98b04a126 1 64073d3a0c2373a98b04a127 2"
      },
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
    
  };

  return(
    <div>
      <h4>Your submit:</h4>
      <ul>
        {foodItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  )
}


function LoginPage(props){

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    // Send the username and password to the server using fetch() or another API call
    $.ajax({
      type: 'POST',
      url: ' https://sdp2023-dbapi.herokuapp.com/csignin',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data: {
        name: username,
        password: password
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      success: function(response) {
        if (response == 'logined'){
          props.loginLabel('Logined');
          props.setButtonLabel('Logined')
        }else{
            alert(response)
        }
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  const registerForm = ()=>{
    props.setButtonLabel('Register');

  };

  return(
    <div>
      <div className="login-container">
        <form onSubmit={handleSubmit} method="post">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Login</button>
        </form>
        <button onClick={registerForm}>register</button>
      </div>
  </div>
  )
}


function RegisterPage(props){

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    var name = event.target.username.value;
    var password = event.target.password.value; 
    var role = event.target.role.value; 
    $.ajax({
      type: 'POST',
      url: ' https://sdp2023-dbapi.herokuapp.com/register',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data: {
        name: name,
        password: password,
        role:role
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      success: function(response) {
        if (response == 'Registration success'){
          props.setButtonLabel('Login');
        }else{
            alert(response)
        }
      },
      error: function(error) {
        console.error(error);
      }
    });
  };


  return(
    <form onSubmit={handleRegisterSubmit}>
    <div>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username"/>
    </div>
    <div>
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password"/>
    </div>
    <div>
      <label htmlFor="role">Role:</label>
      <select id="role"name="role" required>
        <option value="">Select role...</option>
        <option value="student">Student</option>
        <option value="worker">Worker</option>
      </select>
    </div>
    <button type="submit">Register</button>
  </form>
  )
}

function LoginedPage(props){

  const [userbuttonLabel, setUserButtonLabel] = useState('History');
  const [foodItems, setFoodItems] = useState(['Wings', 'Mozzarella Sticks', 'Nachos']);

  const handleHistoryClick = () => {
    setUserButtonLabel('History');
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/chistory',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const deleteCustomerHistory = () => {
    $.ajax({
      type: 'DELETE',
      url: 'https://sdp2023-dbapi.herokuapp.com/deletecustomerhistory/64073d3a0c2373a98b04a12e',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };


  const handleAdviseClick = () => {
    setUserButtonLabel('Advise');
  };
  const healthRecommend = () => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/healthrecommend',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };
  const customizeRecommend = () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/customizerecommend',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data:{
        type:'',
        price:'',
        foodClass:'',
        style:'',
        healthTag:'',
        drink:'',
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };
  const randomRecommendFood = () => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/randomrecommendfood',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };
  const randomRecommendDrink = () => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/randomrecommenddrink',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const handleChartClick = () => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/chartanalysis',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const handleAIClick = () => {
    setUserButtonLabel('AI');
  };

  const aiAdivse = () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/askhealthquestion',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:{
        question: 'I got fever'
      },
      success: function(response) {
        console.log(response.data);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  return(
    <div>
      <div className="App-logined">
        <button className="" onClick={handleHistoryClick}>History</button>
        <button className="" onClick={handleAdviseClick}>Advise</button>
        <button className=""onClick={handleChartClick}>Chart</button>
        <button className=""onClick={handleAIClick}>AI assistant</button>
      </div>
      {userbuttonLabel === 'History' ? (
        <div className="App-food-items">
          <ul>
            {foodItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        ):userbuttonLabel === 'Advise' ? (
          <>
          <button className="submit" onClick={healthRecommend}>health recommend</button>
          <button className="submit" onClick={customizeRecommend}>customize recommend</button>
          <button className="submit" onClick={randomRecommendFood}>random recommend food</button>
          <button className="submit" onClick={randomRecommendDrink}>random recommend drink</button>
          </>
        ):userbuttonLabel === 'Chart' ? (
              <h4>Chart:</h4>
        ):userbuttonLabel === 'AI' ? (
          <button className="submit" onClick={aiAdivse}>ask health question</button>
        ):null}
    </div>
  )
}

export default App;
