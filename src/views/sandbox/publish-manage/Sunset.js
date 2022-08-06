import axios from 'axios';
import {Button} from 'antd'
import React,{useEffect,useState} from 'react'
import NewsPublished from '../../../components/publish-manage/NewsPublished';
import usePublish from '../../../components/publish-manage/usePublish';
export default function Sunset() {
  
 const  {dataSource,handleDelete} = usePublish(3)
  return (
    <div>
      <NewsPublished dataSource={dataSource} button={(id)=><Button type='danger' onClick={()=>handleDelete(id)}>删除</Button>
        }
      ></NewsPublished>
    </div>
  )
}
