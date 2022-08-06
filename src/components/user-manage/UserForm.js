import React, { forwardRef,useState } from 'react'
import {Form,Input,Select} from "antd"
const {Option} =Select

const UserForm= forwardRef((props,ref)=> {
  const [isDisable, setisDisable] = useState(false);
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
  const roleObj={
    "1":"superadmin",
    "2":"admin",
    "3":"editor",
    
    
  }
  const checkRegionDisabled=(item)=>{
    if(props.isUpdate){
      if(roleObj[roleId]==='superadmin'){
        return false
      }else{
        return true
      }
    }else{
      if(roleObj[roleId]==='superadmin'){
        return false
      }else{
        return item.value!==region
      }
    }
  }
  const checkRoleDisabled=(item)=>{
    if(props.isUpdate){
      if(roleObj[roleId]==='superadmin'){
        return false
      }else{
        return true
      }
    }else{
      if(roleObj[roleId]==='superadmin'){
        return false
      }else{
        return roleObj[item.id]!=="editor"
      }
    }
  }
  return (
    <Form
        ref={ref}
        layout="vertical"
       
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={isDisable?[]:[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Select disabled={isDisable}>
            {
              props.regionList.map(item=>
                <Option key={item.id} value={item.value} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                )
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
            <Select onChange={
              (value)=>{
                if(value===1){

                  setisDisable(true)
                  ref.current.setFieldsValue({
                    region:""
                  })
                }else{
                  setisDisable(false)
                }
              }
            }>
            {
              props.roleList.map(item=>
                <Option key={item.id} value={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                )
            }
          </Select>
        </Form.Item>
      </Form>
  )
})
export default UserForm