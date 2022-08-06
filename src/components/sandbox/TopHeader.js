import React,{useState} from 'react'
import { Layout,Dropdown,Menu,Avatar} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
const { Header} = Layout;
function TopHeader(props) {
  const history= useHistory()
  // const [collapsed, setcollapsed] = useState(false);
  const changeCollapsed = ()=>{
    // setcollapsed(!collapsed)
    props.changeCollapsed()
  }
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu>
      <Menu.Item>
       {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={()=>{
        localStorage.removeItem("token")
        history.push("/login")
      }}>退出</Menu.Item>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
    {/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: this.toggle,
    })} */}
    {
      props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}></MenuUnfoldOutlined> : <MenuFoldOutlined onClick={changeCollapsed}></MenuFoldOutlined>
    }
    <div style={{float:"right"}}>
      <span>欢迎 <span style={{color:"skyblue"}}>{username}</span>回来</span>
      <Dropdown overlay={menu}>
        <span><Avatar size="large" icon={<UserOutlined />} /></span>
     </Dropdown>
    </div>

  </Header>
  )
}
// const mapStateToProps=(state)=>{
//   return {
//     isCollapsed:state.CollapsedReducer.isCollapsed
//   }
// }
export default connect((state)=>{
  return {
    isCollapsed:state.CollapsedReducer.isCollapsed
  }
},{
  changeCollapsed(){
    return{
      type:"change-collapsed"
    }
  }
})(TopHeader)