import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class SignIn extends React.Component{
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      error: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(ev){
    this.setState({ [ev.target.name]: ev.target.value });
  }
  async onSubmit(ev){
    ev.preventDefault();
    const { username, password } = this.state;
    try {
      await this.props.signIn({
        username,
        password
      });
    }
    catch(ex){
      this.setState({ error: ex.response.data.error });
    }
  }
  render(){
    const { onChange, onSubmit } = this;
    const { username, password, error } = this.state;
    return (
      <form onSubmit={ onSubmit }>
        { error }
        <input value={ username } onChange={ onChange } name='username'/>
        <input value={ password } onChange={ onChange } name='password'/>
        <button>Sign In</button>
      </form>
    );
  }
}


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
ReactDOM.render(<App />, document.querySelector('#root'));
