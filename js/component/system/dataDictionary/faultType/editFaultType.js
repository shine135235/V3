import React,{Component} from 'react';
import axios from 'axios';
import { Button,Modal,Form,Input,Select,LocaleProvider,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const Option = Select.Option;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        alertVisible:false,
        data:[],
        dataDetail:[],
        faultDetailList:this.props.faultDetailList
    }
    getSelectList = () =>{
        axios.get(`${config.api_server}/sys/faultcategory/list`).then((res) =>{
            //eslint-disable-next-line
           // console.log("大类下拉列表",res.data.page.datas)
            if(res.data.page){
                if(res.data.page.datas.length != 0){
                    this.setState({data:res.data.page.datas})
                }  
            } 
        })
      }
    componentDidMount(){
        this.getSelectList();
    }  
     //操作完成提示弹框
     success = () => {
        // success('操作成功!');
        message.success("添加用户单位成功")
    };
    error = () => {
        message.error("添加用户单位失败")
    }
    editHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //eslint-disable-next-line
           // console.log("valuesvaluesvalues",values)
            if (err) {
                return ;
            }
            this.setState({ addLoading: true});
            axios({
                url:`${config.api_server}/sys/faulttype`,
                method:'put',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "id":this.props.record.id,
                    "faultTypeName":values.faultName,
                    "faultcategorypId":values.faultAll,
                    "faultcategoryId":values.faultDetail,
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getParentListData({});
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})
                        this.setState({ addLoading: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ addLoading: false});
                    setTimeout(() => {
                        this.error();
                    }, 1000);
                }
           })
        });
    }
    editHandleCancel = (e) => {
        e.preventDefault;
        this.setState({ editVisible: false });
        this.props.changeT({editVisible:false});
    }
    afterClose = () => {
        this.setState({recordData:[]})
    }
    onSelect = (value) => {
       if(value){
           axios.get(`${config.api_server}/sys/faultcategory/sublist?parentId=${value}`).then((res) =>{
           if(res.data.page){
               this.setState({dataDetail:res.data.page.datas}) 
               this.props.form.setFields({
                   faultDetail:{
                       value:"",
                       error:""
                   }
               })
           }
       })
       }
   }
   AllChange = (value) =>{
       this.props.setChildstate(value)
   }
   onSelectdetail = () =>{

   }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const children = [];
        const childrenList = [];
        let bData = this.state.data;
        let bDataList = this.props.faultDetailList;
        //eslint-disable-next-line
        //console.log('子类编辑下拉',bDataList);
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].faultname}</Option>);
           }
        }
        if(bDataList.length > 0){
            for (let i = 0; i < bDataList.length; i++) {
                childrenList.push(<Option key = {i} value = {bDataList[i].id}>{bDataList[i].faultname}</Option>);
           }
        }
        return (
            <Modal
                visible={this.props.editVisible}
                title="故障类型编辑"
                onOk={this.addHandleOk}
                onCancel={this.editHandleCancel}
                destroyOnClose={true}
                afterClose={this.afterClose}
                footer={[
                    <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.editLoading} onClick={this.editHandleOk}>
                    保存
                    </Button>,
                ]}
            >
            <LocaleProvider locale={zhCN}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            故障类型名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('faultName', {
                            initialValue:this.props.faultname,
                            rules: [{ required: true, message: '请输入故障类型名称'}],
                        })(
                            <Input placeholder = "请输入故障类型名称"/>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        所属大类&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                        {getFieldDecorator('faultAll', {
                            initialValue:this.props.faultAllId,
                            rules: [{ required: true, message: '请选择所属大类名称', whitespace: true }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="请选择所属大类名称"
                                onSelect={this.onSelect}
                                onChange = {this.AllChange}
                            >
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        所属细类&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                        {getFieldDecorator('faultDetail', {
                            initialValue:this.props.faultDetailId,
                            rules: [{ required: true, message: '请选择所属细类名称', whitespace: true }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="请选择所属细类名称"
                                onSelect={this.onSelectdetail}
                            >
                                {childrenList}
                            </Select>
                        )}
                    </FormItem>
                   
                </Form>
                </LocaleProvider>
            </Modal>
        )     
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;