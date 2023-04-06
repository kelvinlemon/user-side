import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import $ from 'jquery';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function App() {
  const [foodType, setFoodType] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionCookies, setCookies] = useState([])
  const [buttonLabel, setButtonLabel] = useState('Menu');
  const [loginLabel, setLoginLabel] = useState('Login');
  const [table, setTable] = useState();
  const [foodOrders, setFoodOrder] = useState({});
  
  

  const getUniqueTypes = (data) => {
    const types = new Set();
    const uniqueTypes = [];
    for (let i = 0; i < data.length; i++) {
      if (!types.has(data[i].type)) {
        types.add(data[i].type);
        uniqueTypes.push(data[i].type);
      }
    }
    return uniqueTypes.sort();
  }

  useEffect( () => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    const table = data.charAt(0);
    const session = data.slice(1);
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/toorder',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      data:{
        table:table,
        session:session
      },
      success: function(response) {
        setFoodItems(response[0][0]);
        setTable(response[1]['table'])
        setFoodType(getUniqueTypes(response[0][0]));
        setButtonLabel('Menu');
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
        setFoodItems(response[0][0]);
        setTable(response[1]['table']);
        setFoodType(getUniqueTypes(response[0][0]));
        setButtonLabel('Menu');
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
        if (response != "Session is invalid!"){
          setFoodItems(response);
        }
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
          {buttonLabel === 'Menu' && <TypeList foodData ={foodItems} typeData ={foodType} setOrder ={setFoodOrder} orderData={foodOrders}/>}
          {buttonLabel === 'Ordered' && <OrderedList foodData ={foodItems} loginStatus={loginLabel}/>}
          {buttonLabel === 'Submit' && <SubmitList foodData ={foodItems} setOrder ={setFoodOrder} orderData={foodOrders} />}
          {buttonLabel === 'Login' && <LoginPage loginLabel={setLoginLabel} setButtonLabel={setButtonLabel} buttonLabel={buttonLabel}/>}
          {buttonLabel === 'Register' && <RegisterPage setButtonLabel={setButtonLabel}/>}
          {buttonLabel === 'Logined' && loginLabel ==='Logined' && <LoginedPage loginLabel={setLoginLabel} setOrder ={setFoodOrder}/>}
        </main>
        <footer className="App-footer">
          <button className="App-menu-button" onClick={handleMenuClick}>Menu</button>
          <button className="App-ordered-button" onClick={handleOrderedClick}>Ordered</button>
          <button className="App-submit-button"onClick={handleSubmitPageClick}>Submit</button>
        </footer>
      </div>
    );}
}

function TypeList(props){

  const [clickType, setClickType] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [foodValues, setFoodValues] = useState(props.orderData);


  const handleFoodTypeClick = (type) => {
    setClickType(type);
    const data = props.foodData;
    const result = data.filter(item => item.type == type.type);
    setFoodItems(result);
  };

  const handleIncrement = (item) => {
    setFoodValues(values => ({
      ...values,
      [item.foodName]: (values[item.foodName] || 0) + 1
    }));
    props.setOrder(values => ({
      ...values,
      [item.foodName]: (values[item.foodName] || 0) + 1
    }));
  };

  const handleDecrement = (item) => {
    setFoodValues((values) => {
      const newValues = { ...values };
      if (values[item.foodName] === 1) {
        delete newValues[item.foodName];
      } else {
        newValues[item.foodName] = Math.max((values[item.foodName] || 0) - 1, 0);
      }
      return newValues;
    });
    props.setOrder((values) => {
      const newValues = { ...values };
      if (values[item.foodName] === 1) {
        delete newValues[item.foodName];
      } else {
        newValues[item.foodName] = Math.max((values[item.foodName] || 0) - 1, 0);
      }

      if (Object.keys(newValues).length == 1 && newValues[item.foodName] == 0){
        return {};
      }
      return newValues;
    });
  };

  return(
          <div className="App-menu">
            <div className="App-food-types">
              <ul>
              {props.typeData.map((type,index) => (
                  <li key={index} className={clickType === {type} ? 'active' : ''} onClick={() => handleFoodTypeClick({type})}>{type}</li>
                ))}
              </ul>
            </div>
            <div className="App-food-items">
              <ul>
                {foodItems.map((item) => (
                  <li key={item._id}>
                  {item.foodName}
                  <button onClick={() => handleIncrement(item)}>+</button>
                  <span>{foodValues[item.foodName] || 0}</span>
                  <button onClick={() => handleDecrement(item)}>-</button>
                </li>
                ))}
              </ul>
            </div>
          </div>
  )
}

function OrderedList(props){
  const [foodItems, setFoodItems] = useState(props.foodData);

  const addCustomerHistory = (food) => {
    var log=false;
    var reply = window.confirm(`Comfirm to add a personal food history: '${food.foodName}' to your account?`)
    if (reply){
     log=true;
    }
    if (log){
      $.ajax({
        type: 'POST',
        url: 'https://sdp2023-dbapi.herokuapp.com/addcustomerhistory',
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data:{
          foodid:food.id
        },
        success: function(response) {
          console.log(response);
        },
        error: function(error) {
          console.error(error);
        }
      }); 
    }
  };
  
 return(
      <div>
        <h4>Your order:</h4>
        <ul>
          {foodItems.map((item) => (
            <li key={item._id}>{item.foodName}, quantity: {item.quantity}
            {props.loginStatus == 'Logined' ?(
              <button className='submit' onClick={() => addCustomerHistory(item)}>add</button>
            ):null}
            </li>
          ))}
        </ul>
        </div>
 )
}

function SubmitList(props){

  const [foodItems, setFoodItems] = useState(props.foodData);  
  const [foodValues, setFoodValues] = useState(props.orderData);
  console.log(props.orderData);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(foodValues).length != 0){
      var log=false;
      var reply = window.confirm('Comfirm to submit order?')
      if (reply){
       log=true;
      }
      if (log){
        var data ='';
        var count = 0;
        for (var x in foodValues){
          var result = foodItems.filter(item => item.foodName === x);
          if (count == 0){
            data = result[0]._id + ' ' + foodValues[x];
          }else{
            data += ' ' + result[0]._id + ' ' + foodValues[x];
          }
          count++;
        }
        $.ajax({
          type: 'POST',
          url: 'https://sdp2023-dbapi.herokuapp.com/submit',
          xhrFields: { withCredentials: true },
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: 'include',
          crossDomain: true,
          data:{
            order: data,
          },
          success: function(response) {
            console.log(response);
            setFoodValues({});
            props.setOrder({});
          },
          error: function(error) {
            console.error(error);
          }
        });
      }
    }else{
      alert('No food have been placed');
    }
    
  };

  const handleIncrement = (key) => {
    setFoodValues(values => ({
      ...values,
      [key]: (values[key] || 0) + 1
    }));
    props.setOrder(values => ({
      ...values,
      [key]: (values[key] || 0) + 1
    }));
  };

  const handleDecrement = (key) => {
    setFoodValues((values) => {
      const newValues = { ...values };
      if (values[key] === 1) {
        delete newValues[key];
      } else {
        newValues[key] = Math.max((values[key] || 0) - 1, 0);
      }
      if (Object.keys(newValues).length == 1 && newValues[key] == 0){
        return {};
      }
      return newValues;
    });
    props.setOrder((values) => {
      const newValues = { ...values };
      if (values[key] === 1) {
        delete newValues[key];
      } else {
        newValues[key] = Math.max((values[key] || 0) - 1, 0);
      }

      if (Object.keys(newValues).length == 1 && newValues[key] == 0){
        return {};
      }
      return newValues;
    });
  };

  return(
    <div>
      <h4>Your submit:</h4>
      <ul>
        {Object.entries(foodValues).map(([key, value]) => (
          <li key={key}>
            {key}: 
            <button onClick={() => handleIncrement(key)}>+</button>
            <span> {value}</span>
            <button onClick={() => handleDecrement(key)}>-</button>
          </li>
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
        <button className ='submit' onClick={registerForm}>register</button>
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

  const [userbuttonLabel, setUserButtonLabel] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [adviseLabel, setAdviseLabel] = useState('');
  const [foodValues, setFoodValues] = useState({});
  const [chartData, setChartData] = useState([]);
  const COLORS = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'];
  const items = [
    'Grains',
    'Vegetables',
    'Fruits',
    'Meat, fish, egg and alternatives',
    'Milk and alternatives',
    'Food and drinks with high Fat/oil, salt and sugar'
  ];
  const [question, setQuestion] = useState('');
  const [aiResponse, setaiResponse] = useState('');


  const handleHistoryClick = () => {
    setUserButtonLabel('History');
    setFoodItems([]);
    setAdviseLabel(null);
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/chistory',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
        setFoodItems(response);
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const deleteCustomerHistory = (item) => {
    var log=false;
    var reply = window.confirm(`Comfirm to delete: '${item.foodName}' to your account?`)
    if (reply){
     log=true;
    }
    if (log){
      $.ajax({
        type: 'DELETE',
        url: 'https://sdp2023-dbapi.herokuapp.com/deletecustomerhistory/'+item.historyId,
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: function(response) {
          console.log(response);
          handleHistoryClick();
        },
        error: function(error) {
          console.error(error);
        }
      }); 
    }
  };


  const handleAdviseClick = () => {
    setUserButtonLabel('Advise');
    setAdviseLabel(null);
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
        //console.log(response);
        setFoodItems(response);
        setAdviseLabel('recommend');
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };
  

  /*const handlecustomizeRecommend = (event) => {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/customizerecommend',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data:{
        type:food.type,
        price:food.price,
        foodClass:food.class,
        style:food.style,
        healthTag:food.health,
        drink:food.drink,
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
        setFoodItems(response);
        setAdviseLabel('recommend');
      },
      error: function(error) {
        console.error(error);
      }
    });
  };*/


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
        setFoodItems(response);
        setAdviseLabel('recommend');
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
        setFoodItems(response);
        setAdviseLabel('recommend');
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = 110;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {chartData[index].value}
      </text>
    );
  };
  

  const handleChartClick = () => {
    setAdviseLabel(null);
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/chartanalysis',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function(response) {
        console.log(response);
        setChartData(response);
        setUserButtonLabel('Chart');
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const handleAIClick = () => {
    setUserButtonLabel('AI');
    setAdviseLabel(null);
  };

  const handleAIChartClick = () => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/aiAnalysisChart',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},

      success: function(response) {
        console.log(response.data);
        setQuestion(null);
        setaiResponse(response.data)
        setAdviseLabel('AI');
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
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
        question: question
      },
      success: function(response) {
        console.log(response.data);
        setQuestion(null);
        setaiResponse(response.data)
        setAdviseLabel('AI');
      },
      error: function(error) {
        console.error(error);
      }
    }); 
  };

  const handleIncrement = (item) => {
    setFoodValues(values => ({
      ...values,
      [item.foodName]: (values[item.foodName] || 0) + 1
    }));
    props.setOrder(values => ({
      ...values,
      [item.foodName]: (values[item.foodName] || 0) + 1
    }));
  };

  const handleDecrement = (item) => {
    setFoodValues((values) => {
      const newValues = { ...values };
      if (values[item.foodName] === 1) {
        delete newValues[item.foodName];
      } else {
        newValues[item.foodName] = Math.max((values[item.foodName] || 0) - 1, 0);
      }
      return newValues;
    });
    props.setOrder((values) => {
      const newValues = { ...values };
      if (values[item.foodName] === 1) {
        delete newValues[item.foodName];
      } else {
        newValues[item.foodName] = Math.max((values[item.foodName] || 0) - 1, 0);
      }

      if (Object.keys(newValues).length == 1 && newValues[item.foodName] == 0){
        return {};
      }
      return newValues;
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
          {foodItems.map((item) => (
              <li key={item.historyId}>
                {item.foodName}, price:{item.Price}, time:{item.time}
                <button className="submit" type='submit' onClick={() => deleteCustomerHistory(item)} >Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ):userbuttonLabel === 'Advise' ? (
          <>
            <button className="submit" onClick={healthRecommend}>health recommend</button>
            {/*<button className="submit" onClick={customizeRecommend}>customize recommend</button>*/}
            <button className="submit" onClick={randomRecommendFood}>random recommend food</button>
            <button className="submit" onClick={randomRecommendDrink}>random recommend drink</button>
          </>
      ):userbuttonLabel === 'Chart' ? (
        <>
              <h4>Chart:</h4>
              <PieChart width={400} height={400}>
              <Pie
                dataKey="percentage"
                isAnimationActive={false}
                data={chartData}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              </PieChart>
              <ul>
                {items.map((item, index) => (
                  <li key={index}>{index+1}: {item}</li>
                ))}
              </ul>
        </>
      ):userbuttonLabel === 'AI' ? (
        <div>
        <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter your question here"
        />
        <button className="submit"  onClick={aiAdivse}>ask health question</button>
        <button className="submit"  onClick={handleAIChartClick}>analysis my Chart</button>
        </div>
      ):null}
      {adviseLabel === 'recommend'?(
        <>
            {foodItems.foodName}
            <button onClick={() => handleIncrement(foodItems)}>+</button>
            <span>{foodValues[foodItems.foodName] || 0}</span>
            <button onClick={() => handleDecrement(foodItems)}>-</button>
        </>
      )
      :adviseLabel === 'AI'?(
        <div>{aiResponse}</div>
      ):null}
    </div>
  )
}

export default App;
