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
        message.success("编辑故障细类成功")
    };
    error = () => {
        message.error("编辑故障细类失败")
    }
    editHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return ;
            }
            this.setState({ addLoading: true});
            $axios({
                url:`${config.api_server}/sys/faultcategory`,
                method:'put',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "id":this.props.record.id,
                    "faultName":values.projects,
                    "parentId":values.faultName,
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
        let bData = this.state.data;
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].faultname}</Option>);
           }
        }
        return (
            <Modal
                visible={this.props.editVisible}
                title="故障大细类编辑"
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
                        initialValue:this.props.record.fid,
                        rules: [{ required: true, message: '请输入类别名称', whitespace: true }, {
                            validator: this.eventName,
                        }],
                    })(
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onChange={this.handleChange}
                        >
                            {children}
                        </Select>
                    )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        故障细类名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('projects', {
                        initialValue:this.props.record.faultname,
                        rules: [{ required: true, message: '请输入故障细类名称'}],
                    })(
                        <Input placeholder = "请输入故障细类名称"/>
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