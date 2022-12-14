import React from 'react'
import { BrowserRouter, Redirect, Route,Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'
export default function IndexRouter() {
  return (
   
      <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/news" component={News}></Route>
        <Route path="/detail/:id" component={Detail}></Route>

        {/* <Route path="/" component={NewsSandBox}></Route> */}
        <Route path="/" render={()=>
          localStorage.getItem("token")?<NewsSandBox></NewsSandBox>:
          <Redirect to="/login"></Redirect>
        }></Route>
      </Switch>
      </BrowserRouter>
  
    
  )
}
