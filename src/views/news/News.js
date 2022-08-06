import axios from 'axios';
import React,{useEffect,useState} from 'react'
import {NavLink} from 'react-router-dom'
import {PageHeader,Card, Col, Row,List} from 'antd'
import _ from 'lodash'
export default function News() {
  const [list, setlist] = useState([]);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res=>{
     
     
      setlist( Object.entries(_.groupBy(res.data,item=>item.category.title)))
   
    })
   
  }, []);
  return (
    <div style={{
      width:"95%",
      margin:"0 auto"

    }}>
       <PageHeader
        className="site-page-header"
       
        title="新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16,16]}>
         {
           list.map(item=>
            <Col span={8} key={item[0]}>
            <Card title={item[0]} bordered={true} hoverable={true}>
            <List
              size="small"
              bordered
              dataSource={item[1]}
              renderItem={data => <List.Item><NavLink to={`/detail/${data.id}`}>{data.title}</NavLink></List.Item>}
              pagination={
                {pageSize:3}
              }
            />

            </Card>
          </Col>
            
            
            )
         }
        
  
       
         
        </Row>
      </div>
    </div>
  )
}
