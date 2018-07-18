import 'antd/dist/antd.css';
import React,{Component} from 'react';
import { Tabs,Table,Radio,DatePicker,LocaleProvider,Progress } from 'antd';
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import axios from 'axios';
import config from '../../config';
import PieReact from './pieCharts';
import './index.less';

const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

class ChartsUser extends Component{
    state = { 
        loading: false,
        census:2,
        cdata:[],
        data:[],
        cols:{}, 
        radioDisable:false,
        reprottype:3,
        startTime:moment(new Date()).subtract(moment(new Date(),'YYYY-MM').daysInMonth(),'days').format('YYYY-MM-DD hh:mm:ss'),
        endTime:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        pieOption:{},
    }
    getData(dt,st,et){
        this.setState({
            loading:true
        })
        axios.get(`${config.api_server}/performance/workOrderStatistic/${dt}`,{
            params:{
                pageNum:1,
                pageSize:10,
                startTime:st,
                endTime:et
            }
        }).then(res =>{
            this.setState({
                data:res.data.page.datas,
                loading:false
            })
            let barData=[],legendData=[],complete=[],doing=[],pieData=[],PieObj={};
            res.data.page.datas.map(item =>{
                legendData.push(item.name);
                barData.push(item.countAll);
                complete.push(item.countFinish);
                doing.push(item.countNotFinish);
                PieObj.value=item.countAll;
                PieObj.name=item.name;
                pieData.push(PieObj);
                PieObj={};
            });
                let titName='';
                switch(this.state.census){
                    case 0:
                    titName='学校类型'
                    break;
                    case 1:
                    titName='故障大类'
                    break;
                    case 2:
                    titName='用户单位'
                    break;
                    case 3:
                    titName='维保期限'
                    break;
                }
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
        })
    }
 
    openTime=(status) =>{
        //时间选择器弹出时禁用按日期查询按钮
        this.setState({
            radioDisable:status
        })
    }
    barOption= {
        
      }
    componentDidMount(){
      this.getData(this.state.census,this.state.startTime,this.state.endTime)
    }

    btnChange=(e) =>{
        switch(parseInt(e.target.value)){
            case 0:
            this.getData(this.state.census,moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
            break;
            case 1:
            this.getData(this.state.census,moment(new Date()).subtract(7,'days').format('YYYY-MM-DD hh:mm:ss'),moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
            break;
            case 2:
            this.getData(this.state.census,moment(new Date()).subtract(moment(new Date(),'YYYY-MM').daysInMonth(),'days').format('YYYY-MM-DD hh:mm:ss'),moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
            break;
        }
    }
    handleClick=(e) =>{
        this.getData(e.key)
    }
    render(){
        let titName='';
        switch(parseInt(this.state.census)){
            case 0:
            titName='学校类型'
            break;
            case 1:
            titName='故障大类'
            break;
            case 2:
            titName='用户单位'
            break;
            case 3:
            titName='维保期限'
            break;
        }
        const columns = [{
            title:titName,
            dataIndex: 'name',
            key: '1',
          }, {
            title: '工单总数',
            dataIndex: 'countAll',
            key: '2',
            sorter: (a, b) => a.countAll - b.countAll,
          }, {
            title: '处理中',
            dataIndex: 'countNotFinish',
            key: '3',
          }, {
            title: '已完成',
            dataIndex: 'countFinish',
            key: '4',
          },{
            title:"操作",
            key:'5',
            render:(text,record) =>(
                <Progress percent={parseInt(((record.countFinish/(record.countAll==0?1:record.countAll))*100).toFixed(2))} status="active" df={text} />
            )
            },{
            title: '总占比(%)',
            key: '6',
            dataIndex:'totalPercentage'
          }];
        return(
 
                    <div className='charts-wrap'>
                    <div className='chart-query'>
                    <RadioGroup defaultValue={this.state.querytype} disabled={this.state.radioDisable} size="large" onChange={this.btnChange}>
                        <RadioButton value="0">按日查询</RadioButton>
                        <RadioButton value="1">按周查询</RadioButton>
                        <RadioButton value="2">按月查询</RadioButton>
                    </RadioGroup>
                    </div>
                    <div className="date-picker">
                    <LocaleProvider locale={zh_CN}>
                    <RangePicker onChange={this.timeChange} onOpenChange={this.openTime} />
                    </LocaleProvider>
                    </div>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="表格显示" key="1">
                        <Table columns={columns} dataSource={this.state.data} loading={this.state.loading} />
                        </TabPane>
                        <TabPane tab="图形显示" key="2">
                        <PieReact option={this.state.pieOption}/>
                        </TabPane>
                    </Tabs>
                    </div>
        )
    }
}

export default ChartsUser;