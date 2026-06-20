import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux";
import { store } from '../src/redux/store.js';

export const serverUrl = "http://localhost:8080"
createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
   </BrowserRouter>
)
