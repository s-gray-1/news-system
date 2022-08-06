import React,{useEffect} from 'react'
import IndexRouter from './router/IndexRouter';
import './App.css'
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
export default function App() {
  useEffect(() => {
    
  
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
      
    </Provider>
      
      
  )
}
