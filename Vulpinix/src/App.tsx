import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Add FedCM permissions policy to the document
    // This enables the 'identity-credentials-get' feature
    const addPermissionsPolicy = () => {
      // Check if meta tag already exists
      let metaTag = document.querySelector('meta[http-equiv="Permissions-Policy"]');
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('http-equiv', 'Permissions-Policy');
        metaTag.setAttribute('content', 'identity-credentials-get=(self), browsing-topics=()');
        document.head.appendChild(metaTag);
      }
    };

    addPermissionsPolicy();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
fetch("http://localhost:5000/")
  .then(res => res.text())
  .then(data => console.log(data));