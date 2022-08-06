import { Button } from 'antd';
import axios from 'axios';
import React,{useEffect,useState} from 'react'
import NewsPublished from '../../../components/publish-manage/NewsPublished';
import usePublish from '../../../components/publish-manage/usePublish';
export default function Published() {
    
 const  {dataSource,handleSunset} = usePublish(2)
  return (
    <div>
      <NewsPublished dataSource={dataSource} button={(id)=><Button danger  onClick={()=>handleSunset(id)}>下线</Button>}
      
      ></NewsPublished>
    </div>
  )
}
