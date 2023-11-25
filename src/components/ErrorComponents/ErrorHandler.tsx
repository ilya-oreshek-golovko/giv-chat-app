export const ErrorHandler = ({message} : {message : string}) => {
    if(!message) return null;
    console.log(message);
    return(
        <div className="auth-error-text">
            {message}
        </div>
    );
}