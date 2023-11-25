import { login } from "../routing";
import { Link } from "react-router-dom";
import { useFormManagement, useInputManagement, useProfilManagement, useStoredRegisterData } from "../hooks/RegisterHooks";

export function Register() {

    const {state, setState, onFormSubmit} = useFormManagement();

    useStoredRegisterData({state, setState});

    const {InputComponent} = useInputManagement({setState});

    const {ProfileComponent} = useProfilManagement({state, setState});

    return (
        <form className="auth-box" onSubmit={onFormSubmit}>
            {
                state.modal.isOpen &&
                state.modal.children
            }
            <h1 className="auth-box-title">GIV Chat</h1>
            <div className="auth-box-type">Register</div>
            {
                InputComponent({ 
                    inputID:"auth-name",
                    inputLabel:"Name", 
                    propName:"userName",
                    inputValue: state.input.userName,
                    inputType : "text",
                    errorMessage: state.errors.eUserName
                })
            }
            {
                InputComponent({ 
                    inputID:"auth-email",
                    inputLabel:"Email", 
                    propName:"email",
                    inputValue: state.input.email,
                    inputType : "text",
                    errorMessage: state.errors.eEmail
                })
            }
            {
                InputComponent({ 
                    inputID:"auth-password",
                    inputLabel:"Password", 
                    propName:"password",
                    inputValue: state.input.password,
                    inputType : "password",
                    errorMessage: state.errors.ePassword
                })
            }
            {
                InputComponent({ 
                    inputID:"auth-repeat-password",
                    inputLabel:"Repeat Password", 
                    propName:"confirmPass",
                    inputValue: state.input.confirmPass,
                    inputType : "password",
                    errorMessage: state.errors.eConfirmPassword
                })
            }
            {
                ProfileComponent()
            }
            <input type="submit" value="Submit" className="auth-btn-submit btn"/>
            <p className="auth-footer-notice">
                You already have an account? <Link to={login} className="auth-nav-link">Login</Link>
            </p>
        </form>
    )
  }
  