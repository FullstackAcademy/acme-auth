import React from 'react';
import axios from 'axios';
import SignIn from './SignIn';

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      auth: {}
    };
    this.signIn = this.signIn.bind(this);
    this.logout = this.logout.bind(this);
  }
  logout(){
    window.localStorage.removeItem('token');
    this.setState({ auth: {}});
  }
  async attemptTokenLogin(){
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      this.setState({ auth: response.data });
    }
  }
  async componentDidUpdate(prevProps, prevState){
    if(!prevState.auth.id && this.state.auth.id){
      //user has loggedin
      const response = await axios.get('/api/purchases', {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      console.log(response.data);
    }
  }
  componentDidMount(){
    this.attemptTokenLogin();
  }
  async signIn(credentials){
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    this.attemptTokenLogin();
  }
  render(){
    const { auth } = this.state;
    const { signIn, logout } = this;
    if(!auth.id){
      return <SignIn signIn={ signIn }/>
    }
    else {
      return (
        <div>
          Welcome { auth.username }
          <button onClick={ logout }>Logout</button>
        </div>
      );
    }
  }
}

export default App;
