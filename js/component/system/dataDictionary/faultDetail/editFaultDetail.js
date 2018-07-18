import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Select,message,LocaleProvider } from 'antd';
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
        data:[]
    }
    getSelectList = () =>{
        $axios.get(`${config.api_server}/sys/faultcategory/list`).then((res) =>{
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
    success = () => {
        message.success("编辑事件细类成功")
    };
    error = (error) => {
        message.error(error  )
    }
    editHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return ;
            }
            this.setState({ editVisible: true});
            $axios({
                url:`${config.api_server}/sys/faultcategory`,
                method:'put',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "id":this.props.record.id,
                    "faultName":values.faultDetailName,
                    "parentId":values.faultName,
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getParentListData({pageNum:1,pageSize:10,search:""})
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})
                        this.setState({ editVisible: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ editVisible: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                         error = res.data.message
                    }else{
                        error = "编辑事件细类失败"
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
        let bData = this.state.data;
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
        console.log("this.props.recordthis.props.record",this.props.record);
        const children = [];
        let bData = this.state.data;
        let initialSlect = this.props.record.fid;
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
        return (
            <Modal
                visible={this.props.editVisible}
                title="事件细类编辑"
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
                        大类名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('faultName', {
                        initialValue:initialSlect,
                        rules: [{ required: true, message: '请输入事件大类名称', whitespace: true }, {
                            validator: this.eventName,
                        }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%' }}
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
                        事件细类名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('faultDetailName', {
                        initialValue:this.props.record.faultname,
                        rules: [{ required: true, message: '请输入事件细类名称'}],
                    })(
                        <Input placeholder = "请输入事件细类名称"/>
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