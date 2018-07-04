import React,{Component} from 'react';
import axios from 'axios';
import { Button,Modal,Form,Input,Select,LocaleProvider,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';
//  import SelectOne from "../../../publicSub/selectOne";

// const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:false,
        addLoading:false,
        rowCode:["DWLX"],
        data:[],
        dataDetail:[]
      }
      
      getSelectList = () =>{
        axios.get(`${config.api_server}/sys/faultcategory/list`).then((res) =>{
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
    componentDidUpdate(){
       
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("添加事件类型成功")
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values) => {
            //eslint-disable-next-line
            console.log("valuesvaluesvalues",values)
            if (err) {
                return ;
            }
            this.setState({ addLoading: true});
            axios({
                url:`${config.api_server}/sys/faulttype`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "faultTypeName":values.faultName,
                    "faultcategorypId":values.faultAll,
                    "faultcategoryId":values.faultDetail,
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getParentListDatas({pageNum :1,pageSize:10,search:""});
                    setTimeout(() => {
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
                        error = "添加事件类型失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
           })
        });     
    }
    addHandleCancel = () => {
        this.setState({
            addVisible: false,
            reset:true
        });
    }

    AddNews = () => {
        this.setState({
           addVisible: true,
          });
    }
    handleChange = () => {
        
    }
    handleBlur = () => {
       
        
    }
    handleFocus = () => {
        

    }
    // setSelectChange = ({datdas= ""}) =>{
    //      //eslint-disable-next-line
    //      console.log("fatvalue",datdas)
    //     this.setState({datdas})
    // }
    // afterClose = () => {
    //     sessionStorage.removeItem('selectValue');
    // }
    onFieldsChange = () =>{
        
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
        // let option =[];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        }; 
        const children = [];
        const childrenDetail = [];
        let bData = this.state.data;
        let bDataDetail = this.state.dataDetail;
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].faultname}</Option>);
            }
        }
        if(bDataDetail.length >0){
            for (let i = 0; i < bDataDetail.length; i++) {
                childrenDetail.push(<Option key = {i} value = {bDataDetail[i].id}>{bDataDetail[i].faultname}</Option>);
            }
        }

        
        return (
            <span>
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加事件类型"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    onFieldsChange = {this.onFieldsChange}
                    // afterClose = {this.afterClose}
                    destroyOnClose={true}
                    footer={[
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
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
                                rules: [{ required: true, message: '请选择所属事件大类!', whitespace: true}]
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder=""
                                    onSelect={this.onSelect}
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
                                rules: [{ required: true, message: '请选择所属事件细类!', whitespace: true}],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder=""
                                    onSelect={this.detailSelect}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {childrenDetail}
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
                                rules: [{ required: true, message: '请输入事件类型名称', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输入事件类型名称"/>
                            )}
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;