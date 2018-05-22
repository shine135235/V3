import React,{Component} from 'react';
import {  Button } from 'antd';
import * as echarts from "echarts";
import "./index.less"

export default class AppUseTeacher extends Component{
    initEcharts=({eleId,typeName,type,lineType = "red"})=>{
        //eslint-disable-next-line
        console.log(eleId);
        let myChart = echarts.init(document.getElementById(`${eleId}`));
        //eslint-disable-next-line
        console.log(myChart);
        let option = {
            color:[`${lineType}`],
            title : {
                text: `${type}情况-${typeName}`,
                subtext: '(单位：次数)'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[`${type}`]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    // dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    // saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:`${type}`,
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                }
            ]
        };
        myChart.setOption(option);
    }
    initEchartF =  (e)=> {
        let eleName = e.target.innerText.replace(" ","");
        this.initEcharts({eleId:"appUseTeacherTopCharts",typeName:eleName,type:"工单报障"});
        this.initEcharts({eleId:"appUseTeacherBottomCharts",typeName:eleName,type:"工单评价"});
    }
    componentDidMount() {
        this.initEcharts({eleId:"appUseTeacherTopCharts",typeName:"上一周",type:"工单报障"});
        this.initEcharts({eleId:"appUseTeacherBottomCharts",typeName:"上一周",type:"工单评价"});
    }
    render(){
        return (
            <div className='appUseTeacherCom'>
                <div className='app-useTeacherCom-title'>
                    <div className="appUseTeacherTitle">老师使用情况</div>
                    <div className="appUseTeacherTopBtn_group">
                        <Button onClick={this.initEchartF}>上一周</Button>
                        <Button onClick={this.initEchartF}>上一月</Button>
                        <Button onClick={this.initEchartF}>上一季</Button>
                        <Button onClick={this.initEchartF}>上一年</Button>
                    </div>
                    <Button className="appUseTeacherTopBtn_right">筛选</Button>
                </div>
                <div className='appUseTeacher-charts-wrap'>
                    <div id="appUseTeacherTopCharts" className="appUseTeacherTopCharts"></div>
                    <div id="appUseTeacherBottomCharts" className="appUseTeacherBottomCharts"></div>
                </div>
            </div>
        )
    }
}
