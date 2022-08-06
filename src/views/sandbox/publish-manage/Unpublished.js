import axios from 'axios';
import { Button } from 'antd';
import React,{useEffect,useState} from 'react'
import NewsPublished from '../../../components/publish-manage/NewsPublished';
import usePublish from '../../../components/publish-manage/usePublish';
export default function Unpublished() {
  
 const  {dataSource,handlePublish} = usePublish(1)
  return (
    <div>
      <NewsPublished dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handlePublish(id)}>发布</Button>}></NewsPublished>
    </div>
  )
}
