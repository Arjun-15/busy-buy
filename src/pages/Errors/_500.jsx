import { ErrorStyles } from "./ErrorBoundary";

function ServerError() {
    return (
        <>
            <div style={ErrorStyles.errorPage}>
                <h1>500 - Server Error</h1>
                <p>Oops! Something went wrong on our end. Please try again later.</p>
            </div>
        </>
    )
}
export default ServerError;