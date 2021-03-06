import React , { Component } from 'react';
import {withRouter} from 'react-router-dom';
import Modal from './Modal';
import './index.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { register, registrationError,
        login, loginError, clearMessage,
        unlockAccount, forgotPassword,} from './Actions/authentication.js';
import Banner from './Banner';


class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      showModal: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
      alphabets: false,
      numbers: false,
      passLength: false,
      passMatch: false,
      showForgotModal: false,
      loginEmail: "",
      loginPassword: "",
      forgotPasswordEmail: "",
      showBanner: false,
      bannerMessage: "Login Failed",
      bannerStatus: 3,
      bannerLabel: "",
      bannerAction: false,
    };

    this.Register = this.Register.bind(this);
    this.login = this.login.bind(this);
    this.modalCallBack = this.modalCallBack.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.forgotModalCallBack = this.forgotModalCallBack.bind(this);
    this.handleLoginInputs = this.handleLoginInputs.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  componentWillMount(){
    if(localStorage.getItem("token") === this.props.token && this.props.history) {
        this.props.history.push("/todo");
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.loginSuccess){
      this.props.history.push("/todo");
    }
    if(nextProps.loginSuccess || nextProps.registrationSuccess || nextProps.logoutSuccess){
      this.setState({bannerStatus:1});
    }
    if(nextProps.messageText){
      this.setState({showBanner: true, bannerMessage: nextProps.messageText});
    }else {
      this.setState({showBanner: false})
    }
  }

  modalCallBack(val){
    this.setState({showModal:val});
  }

  forgotModalCallBack(val){
    this.setState({showForgotModal:val});
  }

  handleLoginInputs(e){
    if(e.currentTarget.name === "loginEmail"){
      this.setState({loginEmail:e.currentTarget.value, forgotPasswordEmail: e.currentTarget.value});
    }
    if(e.currentTarget.name === "loginPassword") {
      this.setState({loginPassword: e.currentTarget.value})
    }
    if(e.currentTarget.name === "forgotPasswordEmail") {
      this.setState({forgotPasswordEmail: e.currentTarget.value});
    }
  }

  Register(){
    if(this.state.alphabets && this.state.numbers && this.state.passLength && this.state.match) {
    this.setState({showModal: false});
    this.props.register(this.state.firstName,this.state.lastName, this.state.email, this.state.password);
    }
  }

  login() {
    if(this.state.loginEmail && this.state.loginPassword) {
      this.props.login(this.state.loginEmail,this.state.loginPassword);
    }
  }

  forgotPassword() {
    this.setState({showForgotModal: false});
    if(this.state.bannerAction){
      this.props.unlockAccount(this.state.forgotPasswordEmail);
    } else{
      this.props.forgotPassword(this.state.forgotPasswordEmail);
    }
  }

  handleInputs(e){
    if(e.currentTarget.name === "firstName"){
      this.setState({firstName: e.currentTarget.value});
    }
    if(e.currentTarget.name === "lastName"){
      this.setState({lastName: e.currentTarget.value});
    }
    if(e.currentTarget.name === "email"){
      this.setState({email: e.currentTarget.value});
    }
    if(e.currentTarget.name === "password"){
      this.setState({password: e.currentTarget.value},
                    () => {
                            this.setState({alphabets: (/[A-Za-z]/.test(this.state.password) || /[A-Za-z]/.test(this.state.rePassword)),
                                           numbers: (/[0-9]/.test(this.state.password) || /[0-9]/.test(this.state.rePassword)),
                                           passLength: ((this.state.password.length >7) || this.state.rePassword.length >7),
                                           match: ((this.state.password === this.state.rePassword) && this.state.password.length !== 0)
                                         })
                    });
    }
    if(e.currentTarget.name === "rePassword"){
      this.setState({rePassword: e.currentTarget.value},
                     () => {
                          this.setState({alphabets: (/[A-Za-z]/.test(this.state.rePassword) || /[A-Za-z]/.test(this.state.password)),
                                        numbers: (/[0-9]/.test(this.state.rePassword) || /[0-9]/.test(this.state.password)),
                                        passLength: (this.state.rePassword.length >7) || (this.state.password.length >7)
                                      })
                          this.setState({match: ((this.state.password === this.state.rePassword) && this.state.rePassword.length !==0)})
                       });
    }
  }

  render(){
    return (
      <div className="loginPage">
        <h1 className="loginPageTitle"> Todo App</h1>
        <div className="LoginBox">
          <h2 className="loginHeading"> Login </h2>
          <label> Email: </label>
          <input className="loginPageInput" name="loginEmail" type="text" placeholder="abc@gmail.com" value={this.state.loginEmail} onChange={this.handleLoginInputs} /> <br/> <br/><br/>
          <label> Password: </label>
          <input className="loginPageInput" name="loginPassword" value={this.state.loginPassword} onChange={this.handleLoginInputs} onKeyDown={(e) => {if(e.keyCode === 13) {this.login}}}  type="password" placeholder="password"/>

          <button onClick={this.login} onKeyDown={(e) => {if(e.keyCode === 13) {this.login}}}  className="loginButton"> Login </button>

          <a href="#" className={`smallLinks registerLink`} onClick={() => {this.props.clearMessage();this.setState({showModal: true})}}>Register</a>
          <a href="#" className="smallLinks forgotPasswordLink" onClick={() => {this.props.clearMessage();this.setState({showForgotModal: true, bannerLabel: "Forgot Password", bannerAction: false})}}> Forgot Password </a>
          <a href="#" className="smallLinks unlockAccountLink" onClick={() => {this.props.clearMessage();this.setState({showForgotModal: true, bannerLabel: "Unlock Account", bannerAction: true})}}> Unlock Account </a>

          <div className="loginBannerContainer">
            <Banner
                  status={this.state.bannerStatus}
                  closeAfter={this.state.bannerAfterClose}
                  showBanner={this.state.showBanner}
                  closeButton={false}
                  className={`loginBanner`}
                  callBack={(status) => this.setState({showBanner: status})}>
              {this.state.bannerMessage}
            </Banner>
          </div>

          <Modal callBack={this.modalCallBack} showModal={this.state.showModal}>
            <div className="registerModal">
              <h3 className="registerModalHeading"> Register</h3>
              <form onSubmit={(e) => e.preventDefault()}>
              <table className="registerModalForm">
                <tbody>
                  <tr>
                    <td className ="registerModalFormTableRow">
                      <label> First Name </label>
                    </td>
                    <td className ="registerModalFormTableRow">
                      <input className="registerModalFormTableRowInput" type="text" value={this.state.firstName} onChange={this.handleInputs} id="fn" name= "firstName" placeholder="First Name"  /> <br/>
                    </td>
                  </tr>
                  <tr>
                    <td className ="registerModalFormTableRow">
                      <label> Last Name </label>
                    </td>
                    <td className ="registerModalFormTableRow">
                      <input className="registerModalFormTableRowInput" type="text" value={this.state.lastName} onChange={this.handleInputs} id="ln" name= "lastName" placeholder="Last Name"  /> <br/>
                    </td>
                  </tr>
                  <tr>
                    <td className ="registerModalFormTableRow">
                      <label> Email </label>
                    </td>
                    <td className ="registerModalFormTableRow">
                      <input className="registerModalFormTableRowInput" type="email" value={this.state.email} onChange={this.handleInputs} id="email" name= "email" placeholder="abc@gmail.com"  /> <br/>
                    </td>
                  </tr>
                  <tr>
                    <td className ="registerModalFormTableRow">
                      <label> Password </label>
                    </td>
                    <td className ="registerModalFormTableRow">
                      <input className="registerModalFormTableRowInput" type="password" value={this.state.password} onChange={this.handleInputs} id="pass" name="password" placeholder="P@ssw0rd"  /> <br/>
                    </td>
                  </tr>
                  <tr>
                    <td className ="registerModalFormTableRow">
                      <label> Re-Enter Password </label>
                    </td>
                    <td className ="registerModalFormTableRow">
                      <input className="registerModalFormTableRowInput" type="password" value={this.state.rePassword} onChange={this.handleInputs} id="repass" name="rePassword" placeholder="P@ssw0rd"  /> <br/>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={`registrationPageChecks`}>
                <label className={`registrationPageChecksLabel`}> Password Requirements: </label>
                <p className={`registrationPageCheck1 ${this.state.alphabets?"check":""}`}> Alphabets </p>
                <p className={`registrationPageCheck2 ${this.state.numbers?"check":""}`}> Numbers </p>
                <p className={`registrationPageCheck3 ${this.state.passLength?"check":""}`}> Min 8 characters </p>
                <p className={`registrationPageCheck4 ${this.state.match?"check":""}`}>Match </p>
              </div>
              <button className="registerButton" onClick={this.Register}> Register </button>
              </form>
            </div>
          </Modal>

          <Modal callBack={this.forgotModalCallBack} showModal={this.state.showForgotModal}>
            <div className="forgotModal">
              <h3 className="forgotModalHeading"> {this.state.bannerLabel}</h3>
              <form onSubmit={(e) => e.preventDefault()}>
              <table className="forgotModalForm">
                <tbody>
                  <tr>
                    <td className ="forgotModalFormTableRow">
                      <label> Email: </label>
                    </td>
                    <td className ="forgotModalFormTableRow">
                      <input className="forgotModalFormTableRowInput" type="email" value={this.state.forgotPasswordEmail} onChange={this.handleLoginInputs} id="email" name= "forgotPasswordEmail" placeholder="abc@gmail.com"  />
                    </td>
                  </tr>
                </tbody>
              </table>
                    <button className="forgotButton" onClick={this.forgotPassword}> Submit </button>
                </form>
            </div>
          </Modal>

        </div>
      </div>
    )
  }
}


function mapStateToProps(store) {
  return {loginSuccess: store.authenticationReducer.loginSuccess,
          token: store.authenticationReducer.token,
          messageText: store.authenticationReducer.messageText,
          registrationSuccess: store.authenticationReducer.registrationSuccess,
          logoutSuccess: store.authenticationReducer.logoutSuccess,
          };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({register,
                             registrationError,
                             login,loginError,clearMessage,
                             unlockAccount, forgotPassword}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Login));
