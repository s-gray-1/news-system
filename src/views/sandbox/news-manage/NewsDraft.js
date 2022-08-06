import React,{useState,useEffect} from 'react'
import {Table,Button, Modal,Tree, notification } from 'antd'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
const {confirm} = Modal
export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([]);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [rightList, setrightList] = useState([]);
  const [currentRights, setcurrentRights] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const {username}  = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
        const list = res.data
        setdataSource(list)
    })
}, [username])
const columns = [
  {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
          return <b>{id}</b>
      }
  },
  {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
          return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
  },
  {
      title: '作者',
      dataIndex: 'author'
  },
  {
      title: '分类',
      dataIndex: 'category',
      render:(category)=>{
          return category.title
      }
  },
  {
      title: "操作",
      render: (item) => {
          return <div>
              <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
              
              <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
                  props.history.push(`/news-manage/update/${item.id}`)
              }}/>

              <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)}/>
          </div>
      }
  }
];

const handleCheck = (id)=>{
  axios.patch(`/news/${id}`,{
      auditState:1
  }).then(res=>{
      props.history.push('/audit-manage/list')

      notification.info({
          message: `通知`,
          description:
            `您可以到${'审核列表'}中查看您的新闻`,
          placement:"bottomRight"
      });
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
    axios.delete(`/news/${item.id}`)
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
