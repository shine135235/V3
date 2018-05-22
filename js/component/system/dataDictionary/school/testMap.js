import React,{Component} from 'react';
import {Input} from 'antd';

const Search = Input.Search;
export default class TestMap extends Component {
    componentDidMount(){
        if(document.getElementById("schoolMap")){
            //eslint-disable-next-line
             console.log("sssssssssss",document.getElementById("schoolMap"));
             let BMap = window.BMap;
             var map = new BMap.Map("schoolMap");
            var point = new BMap.Point(116.331398,39.897445);
            map.enableScrollWheelZoom(true);
            map.centerAndZoom(point,12);
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint("北京市朝阳区恒祥大厦", function(point){
                if (point) {
                    map.centerAndZoom(point, 16);
                    map.addOverlay(new BMap.Marker(point));
                }else{
                    alert("您选择地址没有解析到结果!");
                }
            }, "北京市");
                    
                }
            }

    render(){
        return(
            <div sttle = {{width:"100%",height:600}}>
                <div style = {{width:"100%",height:40,"marginBotton":"10px"}}>
                <Search placeholder="搜索"  style={{ width: 350,float:"right" }} onSearch={this.onSearch} />
                </div>
                <div style={{width:"100%",height:560}} id='schoolMap'>
                
                </div>
            </div>  
         
        )
    }
}