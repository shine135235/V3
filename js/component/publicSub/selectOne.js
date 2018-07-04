import React,{Component} from 'react';
import $axios from 'axios';
import {Form,Select} from 'antd';
import config from '../../config';
// import './dictionaryAll.less';

// const FormItem = Form.Item;
const Option = Select.Option;
// let realObj={};
// let realKeys={};
class DynamicFieldSet extends Component {
    state = {
        realObj:{},
        realKeys:{},
        selectData:[],
        value:[]
    }
    componentDidMount(){
         let rowCode = this.props.rowCode;
         $axios.get(`${config.api_server}/sys/dictitem/query/id?code=${rowCode}`).then((res) =>{
             if(res.data.data){
                 if(res.data.data.length != 0){
                     this.setState({selectData:res.data.data})
                 }
                // eslint-disable-next-line
                // console.log("get单位类型",res)
             } 
         })
    }
    handleChange = (value) =>{
       // console.log("sssssssssssssssssssssssss",value)
        sessionStorage.setItem('selectValue',value)
    }
    handleFocus = () =>{
       
    }
    render() {
        
        // let option = [];
         let realOj = this.state.selectData;
         let initialSlect = this.props.values;
        if(realOj.length != 0){
            if(initialSlect != ""){
                for(let i = 0;i<realOj.length;i++){
                    if(realOj[i].dictItemId == initialSlect){
                        break;
                    }else{
                        if(i == realOj.length - 1){
                            initialSlect = ""
                        }
                    }
                }
            }
        }
        return (
             <Select
            showSearch
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur} 
            defaultValue = {initialSlect}
            optionFilterProp="children"
            onSelect={this.onSelect}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {/* {option} */}
                {
                    realOj.map((item,k)=>{
                        return(
                            <Option key = {k} value={item.dictItemId}>{item.itemValue}</Option>
                        ) 
                    })
                }
            </Select> 
        );      
    }
}
const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;