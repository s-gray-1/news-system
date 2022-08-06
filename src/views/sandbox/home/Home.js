import React,{useEffect,useRef,useState} from 'react'
import { Card, Col, Row,List,Avatar,Drawer } from 'antd';
import {NavLink} from 'react-router-dom'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);
  const [visible, setvisible] = useState(false);
  const [piechart, setpiechart] = useState(null);
  const piRef=useRef()
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(
      res=>{
        console.log(res.data);
        setviewList(res.data)
       
      }
    )
  }, []);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(
      res=>{
        console.log(res.data);
        setstarList(res.data)
      }
    )
  }, []);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(
      res=>{
        console.log(_.groupBy(res.data,item=>item.category.title));
        renderBarView(_.groupBy(res.data,item=>item.category.title))
        setallList(res.data)
      }
    )
  return ()=>{
    window.onresize=null
  }
   
  }, []);
  const renderBarView=(obj)=>{
    // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'));
  // 绘制图表
  myChart.setOption({
    title: {
      text: '新闻分类图示'
    },
    tooltip: {
      
    },
    xAxis: {
      data: Object.keys(obj),
      axisLabel:{
        rotate:"45",
        interval:0

      }
    },
    yAxis: {
      name:"数量",
      minInterval:1
    },
    legend:{
      data:["数量"]
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: Object.values(obj).map(item=>item.length)
      }
    ]
  })
  window.onresize=()=>{
    console.log("resize");
    myChart.resize()
  }
  }
const renderPiView=()=>{
  //  数据处理
  var currentList=allList.filter(item=>item.author===username)
  var groupObj=_.groupBy(currentList,item=>item.category.title)
  var list=[]
    for( var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }
  
    var myChart 
    if(!piechart){
      myChart=echarts.init(piRef.current);
      setpiechart(myChart)
    }else{
      myChart=piechart
    }
    var option;

    option = {
      title: {
        text: `${username}用户新闻分类图示`,
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }
  const {username,region,role:{roleName}} =JSON.parse(localStorage.getItem("token"))
  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={8}>
        <Card title="用户最常浏览" bordered={true}>
          <List
            size="small"
          
            bordered
            dataSource={viewList}
            renderItem={item => <List.Item> <NavLink to={`/news-manage/preview/${item.id}`}> {item.title}</NavLink></List.Item>}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="点赞最多" bordered={false}>
        <List
            size="small"
          
            bordered
            dataSource={starList}
            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
          />
        </Card>
      </Col>
      <Col span={8}>
          <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <SettingOutlined key="setting"  onClick={
              ()=>{
                setTimeout(() => {
                  setvisible(true)
                  renderPiView()
                }, 0);
              
              }
            }/>,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={username}
            description={
              <div>
                <b>{region?region:"全球"}</b>
                <span style={{paddingLeft:"30px"}}>
                  {roleName}
                </span>
              </div>
            }
          />
        </Card>,
      </Col>
    </Row>
    <Drawer title="个人新闻分类" placement="right" onClose={()=>{
      setvisible(false)
    }} visible={visible} width="500px">
       <div ref={piRef} style={{height:"400px",marginTop:"30px", width:"100%"}}>

       </div>
      </Drawer>
    <div id="main" style={{height:"400px",marginTop:"30px", width:"100%"}}></div>
  </div>
  )
}
