import React,{Component} from 'react';
import echarts from 'echarts';
import {Input} from 'antd';
// const SubMenu = Menu.SubMenu;

let tyss = "";
let tit = "";
export default class Achievements extends Component{
    constructor(props){
        super(props);
        this.state={         
        }
    }
    componentDidUpdate() {
        let ecData = this.props.ecData;
        if(ecData.length > 0){
            for(let i = 0;i<ecData.length;i++){
                // let value = ""
                // if(this.props.type == "score"){
                //     value = ecData[i].countLower/ecData[i].countAll * 100;
                //     tyss = "分";
                //     tit = "满意度评分"
                //  }else{
                //     value = (ecData[i].countLower/ecData[i].countAll * 100).toFixed(2);
                //     tyss = "%";
                //     tit = "达成率"
                //  }
                // let echartsid = "echarts" + i
                // let Gauge=echarts.init(document.getElementById(echartsid));
                // let option = {
                //     title:{
                //         left:'center',
                //         top:'85%',
                //         textStyle:{
                //             color:'#333',
                //             fontSize:12
                //         },
                //         zlevel:1
                //     },
                //     grid:{
                //         y:100
                //     },
                //     tooltip : {
                //         formatter: `{a}{b} : {c}${tyss}`
                //     },
                //     series: [
                //         {
                //             name: tit,
                //             type: 'gauge',
                //             radius:'100%',
                //             detail: {
                //                 formatter:`${value}${tyss}`,
                //                 offsetCenter:[0,'60%'],
                //                 color:'#333',
                //                 fontSize:16
                //             },
                //             center: ['50%', '60%'],
                //             data:[{value:value}],
                //             axisLine: {  
                //                 show: false,
                //                 lineStyle: {  
                //                     width: 20, // 这个是修改宽度的属性  
                //                     color: [[0.2, '#f3627a'], [0.8, '#3aa1ff'], [1, '#4ccb72']]
                //                 }   
                //             },
                //             axisTick:{
                //                 show:false//刻度
                //             },
                //             splitLine: {
                //                 show: false//分割线
                //             },
                //             axisLabel: {
                //                 distance: 0,
                //                 fontSize: 12,
                //             },
                //             pointer: {
                //                 show: true,
                //                 length: '60%',
                //                 width: 5,
                //             }
                //         }
                //     ]
                // };
                let value = ""
                let inVal = ""
                if(this.props.type == "score"){
                    value = ecData[i].countLower/ecData[i].countAll * 100;
                    tyss = "分";
                    tit = "满意度评分"
                    inVal = tit
                   
                 }else{
                    value = (ecData[i].countLower/ecData[i].countAll * 100).toFixed(2);
                    let cs = ecData[i].countAll - ecData[i].countLower
                    tyss = "%";
                    tit = "  达成率"
                    if(this.props.type == "response"){
                        inVal = "总故障:"+ecData[i].countAll+"\n超时故障:"+cs+"\n"+tit
                    }else{
                        inVal = "总故障:"+ecData[i].countAll+"\n逾期故障:"+cs+"\n"+tit
                    }  
                 }
                let echartsid = "echarts" + i
                let Gauge=echarts.init(document.getElementById(echartsid));
                let option = {
                    title:{
                        left:'center',
                        top:'85%',
                        textStyle:{
                            color:'#333',
                            fontSize:12
                        },
                        zlevel:1
                    },
                    grid:{
                        y:100
                    },
                    tooltip : {
                        formatter: `{a}{b} : {c}${tyss}`,
                        textStyle:{
                            align:'right'
                            },
                    },
                    series: [
                        {
                            name: inVal,
                            type: 'gauge',
                            radius:'100%',
                            detail: {
                                formatter:`${value}${tyss}`,
                                offsetCenter:[0,'60%'],
                                color:'#333',
                                fontSize:16
                            },
                            center: ['50%', '60%'],
                            data:[{value:value}],
                            axisLine: {  
                                show: false,
                                lineStyle: {  
                                    width: 20, // 这个是修改宽度的属性  
                                    color: [[0.2, '#f3627a'], [0.8, '#3aa1ff'], [1, '#4ccb72']]
                                }   
                            },
                            axisTick:{
                                show:false//刻度
                            },
                            splitLine: {
                                show: false//分割线
                            },
                            axisLabel: {
                                distance: 0,
                                fontSize: 12,
                            },
                            pointer: {
                                show: true,
                                length: '60%',
                                width: 5,
                            }
                        }
                    ]
                };
                Gauge.setOption(option)
            }
        }
    }
    componentDidMount (){
        
    }
    render(){
        let ecData = this.props.ecData;
        let arr= [];
        if(ecData){
           
            for(let i = 0;i<ecData.length;i++){
                let bid = "echarts" + i
                arr.push(<div style = {{"width":"25%","height":"25%"}}>
                <div id={bid} style = {{"width":"100%","height":"85%"}}></div>
                <div style= {{textAlign:"center","width":"100%","height":"15%"}}>
                    <Input  value= {ecData[i].name} title = {ecData[i].name} />
                    {/* {ecData[i].name} */}
                </div>
            </div>)
            }
        }
        return (
            <div className ="echartbox"  style = {{"width":"100%","height":"100%"}}>
                {arr}
            </div>
        )
    }
}
