import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: false,
            alert: false,
            alertMsg: "",
            remember: false
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleCheck = (e) => {

    }

    handleClick = () => {

        this.setState({ alert: false, alertMsg: "", loading: true })
        fetch('https://covid-19-shopping.herokuapp.com/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.id) {
                    this.props.routeChange('home');
                    this.props.loadUser(res);
                    if (this.state.remember) {
                        localStorage.setItem('user', JSON.stringify(res))
                    }
                } else {
                    this.setState({ alert: true, alertMsg: res, loading: false })
                }
            })
    }

    handleChecked = (e) => {
        this.setState({ remember: e.target.checked })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Sign In</h5>
                                {this.state.alert && <div className="alert alert-danger" role="alert">{this.state.alertMsg}</div>}
                                <form className="form-signin">
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="email" type="email" id="inputEmail" className="form-control" placeholder="Email address" autoFocus />
                                        <label htmlFor="inputEmail">Email address</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="password" type="password" id="inputPassword" className="form-control" placeholder="Password" />
                                        <label htmlFor="inputPassword">Password</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-3">
                                        <input onChange={this.handleChecked} type="checkbox" />
                                        <label htmlFor="customCheck1">Remember password</label>
                                    </div>
                                    <button disabled={this.state.loading} type="button" onClick={this.handleClick} className="btn btn-lg btn-primary btn-block text-uppercase">
                                        {this.state.loading && <CircularProgress style={{ color: "white" }} size={15} />}
                                        {!this.state.loading && "Sign In"}
                                    </button>
                                    <hr className="my-4" />
                                    <h6 onClick={() => this.props.routeChange('register')} style={{ textAlign: 'center', cursor: 'pointer' }}>Register instead</h6>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;