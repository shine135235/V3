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
        message.success("编辑事件类型成功")
    };
    error = (error) => {
        message.error(error)
    }
    editHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //eslint-disable-next-line
            console.log("valuesvaluesvalues",values)
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
                    this.props.getParentListDatas({pageNum :1,pageSize:10,search:""});
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})
                        this.setState({ addLoading: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ addLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                        error = "编辑事件类型失败"
                    }
                    setTimeout(() => {
                            this.error(error);
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

   detailSelect = (value) =>{
    let bData = this.state.dataDetail;
    if(bData.length > 0){
        for (let i = 0; i < bData.length; i++) {
            if(value == bData[i].id){
                this.props.form.setFieldsValue({
                    projects:bData[i].faultname
                })
            }
       }
    }
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
        let initialSlect = this.props.faultAllId;
        let initialSlects = this.props.faultDetailId;
        let bDataList = this.props.faultDetailList;
        //eslint-disable-next-line
        //console.log('子类编辑下拉',bDataList);
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].faultname}</Option>);
           }
            if(initialSlect != ""){
                for(let i = 0;i<bData.length;i++){
                    if(bData[i].id == initialSlect){
                        break;
                    }else{
                        if(i == bData.length - 1){
                            initialSlect = ""
                        }
                    }
                }
            }
        }
        if(bDataList.length > 0){
            for (let i = 0; i < bDataList.length; i++) {
                childrenList.push(<Option key = {i} value = {bDataList[i].id}>{bDataList[i].faultname}</Option>);
           }
           if(initialSlects != ""){
                for(let i = 0;i<bDataList.length;i++){
                    if(bDataList[i].id == initialSlects){
                        break;
                    }else{
                        if(i == bDataList.length - 1){
                            initialSlects = ""
                        }
                    }
                }
            }
        }
        return (
            <Modal
                visible={this.props.editVisible}
                title="事件类型编辑"
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
                        所属事件大类&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                        {getFieldDecorator('faultAll', {
                            initialValue:initialSlect,
                            rules: [{ required: true, message: '请选择所属事件大类名称', whitespace: true }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="children"
                                placeholder=""
                                // onSelect={this.onSelect}
                                onSelect = {this.AllChange}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        所属事件细类&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                        {getFieldDecorator('faultDetail', {
                            initialValue:initialSlects,
                            rules: [{ required: true, message: '请选择所属事件细类名称', whitespace: true }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="children"
                                placeholder=""
                                onSelect={this.detailSelect}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {childrenList}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            事件类型名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('faultName', {
                            initialValue:this.props.faultname,
                            rules: [{ required: true, message: '请输入事件类型名称'}],
                        })(
                            <Input placeholder = "请输入事件类型名称"/>
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