import React,{useState,useEffect,useRef} from 'react'
import { Table, Tag,Button,Modal,Popover,Switch,Form,Input,Select} from 'antd';
import axios from 'axios';
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';
const {confirm}=Modal
const {Option} =Select
export default function UserList() {

  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false);
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const [isUpdateVisible, setisUpdateVisible] = useState(false);
  const [current, setcurrent] = useState(null);
  const addForm =useRef(null)
  const updateForm =useRef(null)
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
  
  useEffect(() => {
    const roleObj={
      "1":"superadmin",
      "2":"admin",
      "3":"editor",
      
      
    }
    axios.get("/users?_expand=role").then(res=>{
      const list=res.data
     setdataSource(roleObj[roleId]==="superadmin"?list:[
       ...list.filter(item=>item.username===username),
       ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
     ])
    })
    
  }, [roleId,region,username]);
  useEffect(() => {
    axios.get("/roles").then(res=>{
      const list=res.data
      setroleList(list)
    })
    
  }, []);
  useEffect(() => {
    axios.get("/regions").then(res=>{
      const list=res.data
      setregionList(list)
    })
    
  }, []);
 
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),{
          text:"全球",
          value:"全球"
        }
      ],
      onFilter:(value,item)=>{
        if(value==="全球"){
          return item.region===""
        }
        return item.region===value
      },
      render: (region) => {
        return <b>{region===""?"全球":region}</b>
    }
    
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role?.roleName
      }
 
    },
    {
      title: '用户名',
      dataIndex: 'username',
     
 
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
      }
     
 
    },
    {
      title: '操作',
      render:(item)=>{
        return(
          <div>
             <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={()=>confirmMethod(item)}/>
               
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>handleUpdate(item)}/>

          </div>
        )
      }
    },
  ]
  const handleUpdate=(item)=>{
    setcurrent(item)
    setTimeout(() => {
      setisUpdateVisible(true)
      updateForm.current.setFieldsValue(item)
    }, 0);
  }

  const handleChange=(item)=>{
    item.roleState=!item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
  }
  const confirmMethod = (item)=>{
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 删除
  const deleteMethod=(item)=>{
    console.log(item);
    // 当前页面同步状态加后端同步
    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/users/${item.id}`)

  }
  const addFormOk=()=>{
    addForm.current.validateFields().then(value=>{
      console.log(value);
      setisAddVisible(false)
      addForm.current.resetFields()
      // post到后端 生成id 再设置 datasource 方便后面 删除和更新
      axios.post(`/users`,  {
        ...value,
   
        "roleState": true,
        "default": false,
       
      }).then(res=>{
        console.log(res.data);
        setdataSource([...dataSource,{
          ...res.data,
          role:roleList.filter(item=>item.id===value.roleId)[0]
        }])
      })


    }).catch(err=>{
      console.log(err);
    })

  }  
  // 更新
  const upadateFormOk=()=>{
    updateForm.current.validateFields().then(value=>{
      setisUpdateVisible(false)
      setdataSource(dataSource.map(item=>{
        if(item.id===current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      axios.patch(`/users/${current.id}`,
        value
      )
    })
    
  }
  return (
    <div>
      <Button type='primary' onClick={
        ()=>{
          setisAddVisible(true)
        }
      }>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}  pagination={{
        pageSize:5
      }} rowKey={(item)=>item.id}/>
      <Modal
      visible={isAddVisible}
      title="添加用户"
      okText="确定"
      cancelText="取消"
      onCancel={()=>{
        setisAddVisible(false)
      }}
      onOk={() => addFormOk()}
    >
      <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
    </Modal>

    <Modal
      visible={isUpdateVisible}
      title="更新用户"
      okText="确更新"
      cancelText="取消"
      onCancel={()=>{
        setisUpdateVisible(false)
      }}
      onOk={() => upadateFormOk()}
    >
      <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdate={true}></UserForm>
    </Modal>
    </div>
  )
}
