import React , { Component } from "react";
import {  Button } from 'antd';
import * as echarts from "echarts";
import "./index.less";

export default class AppUseEngineer extends Component {
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
        this.initEcharts({eleId:"appUseEngineerTopCharts",typeName:eleName,type:"工单响应"});
        this.initEcharts({eleId:"appUseEngineerMiddleCharts",typeName:eleName,type:"工单处理"});
        this.initEcharts({eleId:"appUseEngineerBottomCharts",typeName:eleName,type:"知识库新建"});
    }
    componentDidMount() {
        this.initEcharts({eleId:"appUseEngineerTopCharts",typeName:"上一周",type:"工单响应"});
        this.initEcharts({eleId:"appUseEngineerMiddleCharts",typeName:"上一周",type:"工单处理"});
        this.initEcharts({eleId:"appUseEngineerBottomCharts",typeName:"上一周",type:"知识库新建"});
    }
    render(){
        return(
            <div className='appUseEngineerCom'>
                <div className='app-useEngineerCom-title'>
                    <div className="appUseEngineerTitle">工程师使用情况</div>
                    <div className="appUseEngineerTopBtn_group">
                        <Button onClick={this.initEchartF}>上一周</Button>
                        <Button onClick={this.initEchartF}>上一月</Button>
                        <Button onClick={this.initEchartF}>上一季</Button>
                        <Button onClick={this.initEchartF}>上一年</Button>
                    </div>
                    <Button className="appUseEngineerTopBtn_right">筛选</Button>
                </div>
                <div className='appUseEngineer-charts-wrap'>
                    <div id="appUseEngineerTopCharts" className="appUseEngineerTopCharts"></div>
                    <div id="appUseEngineerMiddleCharts" className="appUseEngineerMiddleCharts"></div>
                    <div id="appUseEngineerBottomCharts" className="appUseEngineerBottomCharts"></div>
                </div>
            </div>
        )
    }
}