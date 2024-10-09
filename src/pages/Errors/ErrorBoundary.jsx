// src/components/ErrorBoundary.js
import React from 'react';
import { toast } from 'react-toastify';
import PageNotFound from './_404'
import ServerError from './_500'


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false || props.err ,
      errorCode: null || props.status,
    };
  }

  // Lifecycle method to catch errors in child components
  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    // console.log(error)
    return { hasError: true, errorCode: error.code || '500' };
  }

  // Display the error with react-toastify
  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service or console
    console.error('Error caught in ErrorBoundary:', error, errorInfo);

    // Show a toast notification for the error
    if (error.code === '404') {
      toast.error('Page not found (404)');
    } else if (error.code === '500') {
      toast.error('Server error (500)');
    } else {
      toast.error('An unexpected error occurred.');
    }
  }

  // Render fallback UI based on the type of error
  render() {
    if (this.state.hasError) {
      // Custom fallback UI based on errorCode
      if (this.state.errorCode === '404') {
        return (          
           <PageNotFound />
        );
      } else if (this.state.errorCode === '500') {
        return (
          <ServerError />
        );
      } else {
        return (
          <div style={ErrorStyles.errorPage}>
            <h1>Something Went Wrong</h1>
            <p>An unexpected error has occurred. Please try again.</p>
          </div>
        );
      }
    }

    // If no error, render child components as usual
    return this.props.children;
  }
}

// Styles for the error page
export const ErrorStyles = {
  errorPage: {
    textAlign: 'center',
    marginTop: '50px',
    color: '#333',
  },
};

export default ErrorBoundary;
