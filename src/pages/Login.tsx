import { Link } from "react-router-dom";
import { register as rRegister } from '../routing';
import { useLoginErrorManagement, useModalViewManagement, useFormManagement } from "../hooks/LoginHooks";

export default function Login() {

  const {setModalView, ModalComponent} = useModalViewManagement();
  const {stateErrors, isValidationFailed} = useLoginErrorManagement();
  const {emailRef, passwordRef, onFormSubmit} = useFormManagement({
    setModalView, 
    isValidationFailed
  })

  return (
    <form className="auth-box" onSubmit={onFormSubmit}>
        {
          ModalComponent()
        }
        <h1 className="auth-box-title">GIV Chat</h1>
        <div className="auth-box-type">Login</div>
        <div className='input-field-box'>
            <input type="text" id="auth-email" className='input-field' ref={emailRef} required/>
            <label htmlFor="auth-email" className="auth-input-label">Email</label>
            {
              stateErrors.emailError &&
              <div className="auth-error-text">
                {stateErrors.emailError}
              </div>
            }
        </div>
        <div className='input-field-box'>
            <input type="password" id="auth-password" className='input-field' ref={passwordRef} required />
            <label htmlFor="auth-password" className="auth-input-label">Password</label>
            {
              stateErrors.passError &&
              <div className="auth-error-text">
                {stateErrors.passError}
              </div>
            }
        </div>
        <input type="submit" value="Submit" className="auth-btn-submit"/>
        <p className="auth-footer-notice">
            You don't have an account? <Link to={rRegister} className="auth-nav-link">Register</Link>
        </p>
    </form>
  )
}
