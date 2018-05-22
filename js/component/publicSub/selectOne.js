import React,{Component} from 'react';
import $axios from 'axios';
import {Form,Select} from 'antd';
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
         $axios.get(`http://172.16.6.11:9090/sys/dictitem/query/id?code=${rowCode}`).then((res) =>{
             if(res.data.data){
                 if(res.data.data.length != 0){
                     this.setState({selectData:res.data.data})
                 }
                 //eslint-disable-next-line
                //  console.log("get单位类型",res)
             } 
         })
    }
    handleChange = (value) =>{
        sessionStorage.setItem('selectValue',value)
    }
    handleFocus = () =>{
       
    }
    render() {
        
        // let option = [];
         let realOj = this.state.selectData;
        // if(realOj.length != 0){
        //     option =  realOj.map((item,k)=>{
        //         return(
        //             <Option key = {k} value={item.itemKey}>{item.itemValue}</Option>
        //         ) 
        //     })
        // }
        return (
             <Select
            showSearch
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur} 
            defaultValue = {this.props.values}
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