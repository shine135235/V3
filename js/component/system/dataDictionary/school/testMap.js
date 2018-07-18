import React,{Component} from 'react';
import {Input,message} from 'antd';

const Search = Input.Search;
// let _this;
export default class TestMap extends Component {
    constructor(props){  
        super(props)
        // _this = this
        this.state = {
            searchData:this.props.searchData,
            seach:""
        }
    }
    mapFun = () =>{
        if(document.getElementById("schoolMap")){
            let searchdata = ""
            let BMap = window.BMap;
            var map = new BMap.Map("schoolMap");
            var point = new BMap.Point(116.331398,39.897445);
            map.enableScrollWheelZoom(true);
            map.centerAndZoom(point,12);
             // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            if(this.state.seach != ""){
                searchdata = this.state.seach;
            }else{
                searchdata = this.state.searchData;
            }              
           // searchdata = this.props.searchData;    
            // 将地址解析结果显示在地图上,并调整地图视野          
            myGeo.getPoint(searchdata, function(point){
                if (point) {
                    map.centerAndZoom(point, 16);
                     //eslint-disable-next-line
                    //console.log("addOverlayaddOverlayaddOverlay",point);
                    let arr = [];
                    arr.push(point.lng)
                    arr.push(point.lat)
                    let str = arr.join(",")
                     //eslint-disable-next-line
                     //console.log("arrarrarrarrarr",str);
                    document.getElementById("noInputLat").value = str;
                     //eslint-disable-next-line
                    //  document.getElementById("noInput").value = str;
                   // _this.props.setLat(point)
                    map.addOverlay(new BMap.Marker(point));
                }
            }, "北京市"); 
            var geoc = new BMap.Geocoder();    
            map.addEventListener("click", function(e){        
                var pt = e.point;
                map.clearOverlays();   
                geoc.getLocation(pt, function(rs){
                    var addComp = rs.point;
                    var massage = rs.address;
                    //eslint-disable-next-line
                    console.log("rsrsrsrsrsrsrsrsrsrs",rs);
                     //eslint-disable-next-line
                     console.log("massagemassagemassagemassage",massage);
                    map.addOverlay(new BMap.Marker(addComp));
                  // document.getElementById("noInput").value = 
                    //_this.props.setLat(addComp)
                   // _this.props.setChPoint(rs.address)
                   message.success(`您选择的地理位置位为：${massage}`)
                   let arr = [];
                   arr.push(e.point.lng)
                   arr.push(e.point.lat)
                   let str = arr.join(",")
                   console.log(str)
                   document.getElementById("noInputLat").value = str;
                   document.getElementById("noInputCh").innerText = massage;
                   // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                });   
            });      
         }
    }
    componentDidMount(){
        this.mapFun();
    }
    componentDidUpdate(){
       if(this.state.searchData != ""){
           this.mapFun();
        //   this.props.setLat(s);
       }   
    }
    onSearch = (value) =>{
        this.setState({seach:value})
        //返回地图搜索框中文
        //eslint-disable-next-line
        console.log("onsearchValue",value);
        document.getElementById("noInputCh").innerHTML = value;
        //  this.props.childsData(value)
          this.mapFun();
    }
    render(){
        return(
            <div sttle = {{width:"100%",height:600}}>
                <div style = {{width:"100%",height:40,"marginBotton":"10px"}}>
                <Search placeholder="搜索"  style={{ width: 350,float:"right" }} onSearch={this.onSearch} id = "mapSearch" />
                <input   id = "noInputLat"  value="" style = {{display:"none"}}/>
                <span  id = "noInputCh"   style = {{display:"none"}}></span>
                </div>
                    <div style={{width:"100%",height:560}} id='schoolMap'>
                </div>
            </div>  
        )
    }
}