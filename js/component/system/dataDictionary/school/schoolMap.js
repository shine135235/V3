import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// import BMap from 'BMap';
// import $axios from 'axios';

import { Button,Modal,Icon,Form} from 'antd';
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
            data:[],
            fl:false
          }
    }
   
    componentDidMount(){
        let div = document.getElementById("schoolMap")
        //eslint-disable-next-line
        console.log("setTimeoutsetTimeoutsetTimeout",div);
                     
    }
    componentDidUpdate(){
        //eslint-disable-next-line
        let div = ReactDOM.findDOMNode(document.getElementById("schoolMap"))
        //eslint-disable-next-line
        console.log("mapShowmapShowmapShow",div);
        if(this.state.mapVisible){
            setTimeout
            let div = document.getElementById("schoolMap")
            //eslint-disable-next-line
            console.log("divdivdivdivdivdivdiv",div);
         if(div){
              let BMap = window.BMap;
              //eslint-disable-next-line
              console.log("22222222222222222",BMap);
             
          }
        }
         
        
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        const modal = Modal.success({
            title: '操作成功',
            content: '添加单位成功',
          });
          setTimeout(() => modal.destroy(), 2000);
    };

    error = () => {
        Modal.error({
          title: '操作失败',
          content: '添加单位失败',
        });
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll(['lat','lng'],(err) => {         
            if (err) {
                return ;
            }    
            this.setState({ addLoading: true}); 
        });     
    }
    addHandleCancel = () => {
         //eslint-disable-next-line
        // console.log("sssssssssss");
        this.props.mapChange({mapVisible: false})
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
    afterClose = () => {
        sessionStorage.removeItem('selectValue');
    }
    mapShow = () =>{
        this.setState({mapVisible:true})
        //eslint-disable-next-line
        let div = ReactDOM.findDOMNode(document.getElementById("schoolMap"))
        //eslint-disable-next-line
        console.log("mapShowmapShowmapShow",div);
    }
    render(){
        return (
            <span>
                <Button size = "small"  onClick = {this.mapShow} style = {{"marginTop":"5px",paddingTop:'2px'}}><Icon type="home" style={{ fontSize: 20, color: '#08c' }}/></Button>
                <Modal
                    visible={this.state.mapVisible}
                    title="用户单位地理位置"
                    // getContainer={MapModalTest}
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    afterClose = {this.afterClose}
                    width = {800}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >   
                <div>
                    <MapModalTest />
                </div>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);


export default WrappedRegistrationForm;