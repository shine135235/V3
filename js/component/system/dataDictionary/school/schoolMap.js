import React,{Component} from 'react';
// import BMap from 'BMap';
// import $axios from 'axios';

import { Button,Modal,Form,Icon,message} from 'antd';
// import Mapmodal from './testMap'
// import src from "./map.html";
import MapModalTest from './testMap';

// import './index.less';
// let BMap = window.BMap;

class AddEventCategory extends Component{
    constructor(props){
        super(props);
        this.state = {
            mapVisible:false,
            addLoading:false,
            searchData:this.props.searchData,
            initialData:"",
            data:[],
            fl:false,
            point:""
          }
    }
   
    componentDidMount(){
        //eslint-disable-next-line
      //  console.log("searchDatasearchDatasearchDatasearchData",this.props.searchData);              
    }
    componentDidUpdate(){

    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("添加用户单位成功")
    };
    error = () => {
        message.error("添加用户单位失败")
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll(['lat','lng'],(err) => {         
            if (err) {
                return ;
            } 
            let point = document.getElementById("noInputLat").value;
            let noInputCh = document.getElementById("noInputCh").innerHTML;
              //eslint-disable-next-line
            // console.log("sssssssssss",point); 
              //eslint-disable-next-line
            // console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",noInputCh); 
             this.props.getChPoint(noInputCh)
             this.props.prentsData(point)
            this.setState({ mapVisible:false}); 
        });     
    }
    addHandleCancel = () => {
         //eslint-disable-next-line
        // console.log("sssssssssss");
        // this.props.mapChange({mapVisible: false})
        this.setState({mapVisible:false})
    }
    AddNews = () => {
        this.setState({
            mapVisible: true,
        });
    }
    handleChange = () => {
        
    }
    handleBlur = () => {
       
    }
    handleFocus = () => {     

    }


    mapShow = () =>{
        this.setState({mapVisible:true})
        this.props.addrMassage();
        //eslint-disable-next-line
        console.log("mapShowmapShowmapShow",this.props.searchData);
    }
    // setLat = (point) =>{
    //     //eslint-disable-next-line
    //     console.log("pointpointpoint",point);
    //     //返回地图搜索框坐标
    //       this.setState({point:point})
    //       this.props.prentssetLat(point)
    // }
    // childsData = (value) =>{
    //     //eslint-disable-next-line
    //     console.log("valuevaluevalue",value);
    //     //返回地图搜索框中文
    //       this.props.prentsData(value)
    // }
    // setChPoint = (value) =>{
    //     this.props.getChPoint(value)
    // }
    render(){
        return (
            <span>
                <Button   onClick = {this.mapShow} style = {{"marginTop":"4px","width":"36px","padding":"0"}}><Icon type="environment" style={{ fontSize: 20, color: '#08c' }}/></Button>
                <Modal
                    visible={this.state.mapVisible}
                    title="用户单位地理位置"
                    // getContainer={MapModalTest}
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    afterClose = {this.afterClose}
                    destroyOnClose={true}
                    width = {800}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        // <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary"  htmlType="submit" onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >   
                <div>
                    <MapModalTest searchData = {this.props.searchData} initialData = {this.state.initialData} setLat = {this.setLat} childsData = {this.childsData} setChPoint = {this.setChPoint}/>
                </div>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);


export default WrappedRegistrationForm;