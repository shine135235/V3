
import 'antd/dist/antd.css';
import React,{Component} from 'react';
import axios from 'axios';
//eslint-disable-next-line
import corejs from 'core-js';
//eslint-disable-next-line
import es6shim from 'es6-shim';
import { Tabs,Table,Radio,DatePicker,LocaleProvider,Progress } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import BarReact from './barCharts';
import PieReact from './pieCharts';

import './index.less';

const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
let titName='运维单位';
let rts=location.search.split('=')[1]
if(rts==2){
    titName='故障细类';
}else if(rts==3){
    titName='学校类型';
}else if(rts==4){
    titName='维保期限';
}


const columns = [{
    title:titName,
    dataIndex: 'name',
    key: '1',
  }, {
    title: '工单总数',
    dataIndex: '工单总数',
    key: '2',
    sorter: (a, b) => a.工单总数 - b.工单总数,
  }, {
    title: '处理中',
    dataIndex: '处理中',
    key: '3',
  }, {
    title: '已完成',
    dataIndex: '已完成',
    key: '4',
  },{
    title:"已完成/工单总数",
    key:'5',
    render:(text,record) =>(
        <Progress percent={((record.已完成/(record.工单总数==0?1:record.工单总数))*100).toFixed(2)} status="active" df={text} />
    )
    },{
    title: '总占比(%)',
    dataIndex: '占比',
    key: '5',
  }];
export default class Census extends Component{
    state={
        cdata:[],
        data:[],
        cols:{}, 
        radioDisable:false,
        token:localStorage.getItem('token'),
        reprottype:location.search.split('=')[1],
        querytype:'month',
    }
    getData(token,rt,qt,st,et){
        axios.get(`http://${location.host}/GetOmmReport`,{
            params:{
                token:token,
                reprottype:rt,
                querytype:qt,
                startTime:st,
                endTime:et
            }
        }).then(res =>{
            let barData=[],legendData=[],complete=[],doing=[],pieData=[],PieObj={};
            res.data.map(item =>{
                legendData.push(item.name);
                barData.push(item.工单总数);
                complete.push(item.已完成);
                doing.push(item.处理中);
                PieObj.value=item.工单总数;
                PieObj.name=item.name;
                pieData.push(PieObj);
                PieObj={};
            });
            this.setState({
                data:res.data
            })
            if(rt==1||rt==2){
                this.setState({
                    barOption:{
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['工单总数','已完成','处理中']
                        },
                        grid: {  
                            y2: 140  
                        }, 
                        xAxis: [
                            {
                                type: 'category',
                                data:legendData,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel:{  
                                    interval:0,//横轴信息全部显示  
                                    rotate:-30,//-30度角倾斜显示  
                               }  
                            }
                        ],
                        yAxis:{
                                type: 'value',
                                name: '工单总数',
                                axisLabel: {
                                    formatter: '{value} 个'
                                }
                        },
                        series: [
                            {
                                name:'工单总数',
                                type:'bar',
                                data:barData
                            },
                            {
                                name:'已完成',
                                type:'bar',
                                data:complete
                            },
                            {
                                name:'处理中',
                                type:'bar',
                                data:doing
                            }
                        ]
                    }
                })
            }else{
                //eslint-disable-next-line
                console.log(res.data)
                //eslint-disable-next-line
                console.log(pieData)
                this.setState({
                    pieOption:{
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: legendData
                        },
                        series : [
                            {
                                selectedMode: 'single',
                                selectedOffset: 10,
                                name: titName,
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:pieData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                })
            }
        })
    }
    timeChange=(date, dateString) =>{
        this.getData(this.state.token,this.state.reprottype,'',dateString[0],dateString[1])
    }
    openTime=(status) =>{
        //时间选择器弹出时禁用按日期查询按钮
        this.setState({
            querytype:'',
            radioDisable:status
        })
    }
    componentDidMount(){
        this.getData(this.state.token,this.state.reprottype,this.state.querytype)
    }
    btnChange=(e) =>{
        this.getData(this.state.token,this.state.reprottype,e.target.value)
    }
    render(){
        if(this.state.reprottype==1 || this.state.reprottype==2){
            return(
                <div className='charts-wrap'>
                <div className='chart-query'>
                <RadioGroup defaultValue={this.state.querytype} disabled={this.state.radioDisable} size="large" onChange={this.btnChange}>
                    <RadioButton value="day">按日查询</RadioButton>
                    <RadioButton value="week">按周查询</RadioButton>
                    <RadioButton value="month">按月查询</RadioButton>
                </RadioGroup>
                </div>
                <div className="date-picker">
                <LocaleProvider locale={zh_CN}>
                <RangePicker onChange={this.timeChange} />
                </LocaleProvider>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="表格显示" key="1">
                    <Table columns={columns} dataSource={this.state.data} />
                    </TabPane>
                    <TabPane tab="图形显示" key="2"  ref={(div) => { this.chartDiv = div; }}>
                    <BarReact option={this.state.barOption} />
                    </TabPane>
                </Tabs>
                </div>
            )
        } else{
            return(
                <div className='charts-wrap'>
                <div className='chart-query'>
                <RadioGroup defaultValue={this.state.querytype} disabled={this.state.radioDisable} size="large" onChange={this.btnChange}>
                    <RadioButton value="day">按日查询</RadioButton>
                    <RadioButton value="week">按周查询</RadioButton>
                    <RadioButton value="month">按月查询</RadioButton>
                </RadioGroup>
                </div>
                <div className="date-picker">
                <LocaleProvider locale={zh_CN}>
                <RangePicker onChange={this.timeChange} onOpenChange={this.openTime} />
                </LocaleProvider>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="表格显示" key="1">
                    <Table columns={columns} dataSource={this.state.data} />
                    </TabPane>
                    <TabPane tab="图形显示" key="2">
                     <PieReact option={this.state.pieOption}/>
                    </TabPane>
                </Tabs>
                </div>
            )
        }       
    }
}