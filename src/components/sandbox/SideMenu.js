import React,{useEffect,useState} from 'react'
import {withRouter} from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import {
 
  UserOutlined,
  HomeOutlined,
  RobotOutlined,
 
} from '@ant-design/icons';
import './index.css'
const { Sider} = Layout
const { SubMenu } = Menu
// 模拟数据结构
// const menuList =[ {
//   key:"/home",
//   title:"首页",
//   icon:<UserOutlined />
// },
// {
//   key:"/user-manage",
//   title:"用户管理",
//   icon:<UserOutlined />,
//   children:[
//     {
//       key:"/user-manage/list",
//       title:"用户列表",
//       icon:<UserOutlined />,
//     }
//   ]
// },
// {
//   key:"/right-manage",
//   title:"权限管理",
//   icon:<UserOutlined />,
//   children:[
//     {
//       key:"/right-manage/role/list",
//       title:"角色列表",
//       icon:<UserOutlined />,
//     },
//     {
//       key:"/right-manage/right/list",
//       title:"权限列表",
//       icon:<UserOutlined />,
//     }
//   ]
// }

// ]
const iconList = {
  "/home":<HomeOutlined />,
  "/user-manage":<UserOutlined />,
  "/user-manage/list":<UserOutlined />,
  "/right-manage":<RobotOutlined />,
  "/right-manage/role/list":<UserOutlined />,
  "/right-manage/right/list":<UserOutlined />
  //.......
}


 function SideMenu(props) {
  const [menuList, setmenuList] = useState([]);
  console.log(props.location.pathname)
 
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res=>{
      console.log(res.data)
      setmenuList(res.data)
    })
  }, []);
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item)=>{
    return item.pagepermisson && rights.includes(item.key)
  }
  const renderMenu=(menuList)=>{
    return menuList.map(item=>{
      if(item.children?.length>0&&checkPagePermission(item)){
        return <SubMenu  key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} 
        onClick={()=>{
          props.history.push(item.key)
        }}
      >{item.title}</Menu.Item>
    })
  }
  const selectKeys = [props.location.pathname]
  const openKeys = ["/"+props.location.pathname.split("/")[1]]
  return (
        <Sider trigger={null} collapsible  collapsed={props.isCollapsed}>
          <div style={{display:"flex",height:'100%',flexDirection:"column"}}>
            <div className="logo"> 全球新闻发布系统</div>
            <div style={{flex:1,overflow:"auto"}}>
              <Menu theme="dark" mode="inline" selectedKeys={selectKeys}  defaultOpenKeys={openKeys}>
                {renderMenu(menuList)}
              </Menu>
            </div>
          </div>
        </Sider>
  )
}
export default connect((state)=>{
  return {
    isCollapsed:state.CollapsedReducer.isCollapsed
  }
}) (withRouter(SideMenu))