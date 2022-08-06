import React,{useState,useEffect} from 'react'
import {Table,Button, Modal,Tree } from 'antd'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const {confirm} = Modal
export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [rightList, setrightList] = useState([]);
  const [currentRights, setcurrentRights] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render:(item)=>{
        return(
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)}/>
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
              setisModalVisible(true)
              setcurrentRights(item.rights)
              setcurrentId(item.id)
            }}/>
             
          </div>
        )
      }
    },
  
  ]
  useEffect(() => {
    axios.get("/roles").then(res=>{
      setdataSource(res.data)
    })
  }, []);
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res=>{
      const list=res.data
      // list.forEach(item => {
      //   if(item.children.length===0){
      //     item.children=""
      //   }
      // });
     
      setrightList(list)
    })
    
  }, []);
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
    axios.delete(`/roles/${item.id}`)
  }

  const handleOk=()=>{

    console.log(currentRights);
    
    setisModalVisible(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }
  const handleCancel=()=>{
    setisModalVisible(false)
  }
  const onCheck=(checkKeys)=>{
    setcurrentRights(checkKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Tree
      checkable
      // defaultExpandedKeys={['0-0-0', '0-0-1']}
      // defaultSelectedKeys={['0-0-0', '0-0-1']}
      // defaultCheckedKeys={currentRights}
      // onSelect={onSelect}
      onCheck={onCheck}
      checkedKeys={currentRights}
      treeData={rightList}
      checkStrictly={true}

    />
      </Modal>
    
    </div>
  )
}
