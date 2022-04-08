import React from 'react';

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

export default SignIn;
