import { ErrorStyles } from "./ErrorBoundary";

function PageNotFound() {
    return (
        <>
            <div style={ErrorStyles.errorPage}>
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </>
    )
}
export default PageNotFound;