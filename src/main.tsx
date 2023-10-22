import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import { client } from './graphql/client.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
)
