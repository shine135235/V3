import React,{Component} from 'react';
import { Button, Modal, Form,Input,message} from 'antd';
import axios from 'axios';
import {ProjectList} from '../../../public'

const FormItem=Form.Item;
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
class AddOrderType extends Component{
    constructor(props){
        super(props)
        this.state={
            loading:false,
            visible:this.props.ishow,
            values:[],
            pageSize:10,
            reset:false
        }
    }
    getProject={
        name:''
    };
    handleOk=(e) =>{
    e.preventDefault();
    //eslint-disable-next-line
    console.log(sessionStorage.getItem('projectID'))
    this.props.form.validateFields(['name','ab'],(err) => {
        if (!err) {
            let addParams={
                "name":this.props.form.getFieldValue('name'),
                "ab":this.props.form.getFieldValue('ab'),
                "projectid":sessionStorage.getItem('projectID')
            }
            if(addParams.projectid==null){
                this.setState({
                    selectStatus:'error',
                    selectHelp:'请选择所属项目后提交'
                })
            }else{
                this.setState({
                    loading:true
                });
                this.props.form.setFields({
                    project:{
                        success:''
                    }
               })
                axios.post('http://172.16.6.9:9090/pro/work/worktype',addParams).then(res =>{
                    if(res.data.success){
                        message.success('添加成功!')
                        this.setState({
                            loading:false
                        });
                        this.handleCancel();
                        this.props.flush(1,this.state.pageSize);
                    }else{
                        message.error(res.data.message)
                    }
                })
            }
        }else{
            //eslint-disable-next-line
            message.error("请将表单输入完整!")
        }
        }); 
    }
    handleCancel=() =>{
        this.props.cannel();
        this.props.form.resetFields();
        this.setState({
            values:[],
            reset:true
        })
        this.setState({
            selectStatus:null,
            selectHelp:null
        })
        sessionStorage.removeItem('projectID');
    }
    render(){
        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        return(
            <Modal
            title="新建工单类型"
            wrapClassName="vertical-center-modal"
            visible={this.props.ishow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
                  提交
                </Button>,
              ]}
            >
            <FormItem
                {...formItemLayout}
                label="工单名称"
                >
                {getFieldDecorator('name',{
                    rules: [{
                        required: true, 
                        message: '工单名称!'
                    }],
                })(<Input />)}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="工单缩写"
                >
                {getFieldDecorator('ab',{
                    rules: [{
                        required: true, 
                        message: '工单缩写!'
                    }],
                })(<Input />)}
            </FormItem>
            <FormItem
            {...formItemLayout}
            label="所属项目"
            validateStatus={this.state.selectStatus}
            hasFeedback
            help={this.state.selectHelp}
            >
            {getFieldDecorator('project', {
                rules: [{ required: true}]
            })(<ProjectList /> )}
            </FormItem>
            </Modal>
        )
    }
}
export const AddOrderTypeModal=Form.create()(AddOrderType);


class EditOrderType extends Component{
    constructor(props){
        super(props)
        this.state={
            loading:false,
            visible:this.props.ishow,
            reset:false,
            pageSize:10
        }
    }
    handleOk =() =>{
            this.props.form.validateFields(['name','ab'],(err) =>{
                if(!err){
                    let editParam={
                        "id":this.props.id,
                        "name":this.props.form.getFieldValue('name'),
                        "ab":this.props.form.getFieldValue('ab'),
                        "projectid":sessionStorage.getItem('projectID')===null?this.props.projectid:sessionStorage.getItem('projectID')
                    }
                    axios.put('http://172.16.6.9:9090/pro/work/worktype',editParam).then(res =>{
                        if(res.data.success){
                            message.success('修改成功!');
                            this.handleCancel()
                            this.props.flush(1,this.state.pageSize);
                        }else{
                            message.error(res.data.message)
                        }
                    })
                }else{
                    //eslint-disable-next-line
                    message.error("请将表单输入完整!")
                }
            })
       
    }
    handleCancel=() =>{
        this.props.cannel();
        this.setState({
            value:[],
            reset:true
        });
        this.props.form.resetFields()
        sessionStorage.removeItem('projectID');
    }
    render(){ 
        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
            title="编辑工单类型"
            wrapClassName="vertical-center-modal"
            visible={this.props.ishow}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
                  提交
                </Button>,
              ]}
            >
            <Form>
            <FormItem
                {...formItemLayout}
                label="工单名称"
                >
                {getFieldDecorator('name',{
                    rules: [{
                        required: true, 
                        message: '工单名称!'
                    }],
                    initialValue:this.props.name
                })(<Input />)}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="工单缩写"
                >
                {getFieldDecorator('ab',{
                    rules: [{
                        required: true, 
                        message: '工单缩写!'
                    }],
                    initialValue:this.props.ab
                })(<Input />)}
            </FormItem>
            <FormItem
            {...formItemLayout}
                label="所属项目"
            >
            {getFieldDecorator('project', {
                rules: [{ required: true, message: ' 请选择项目!' }]
            })(<ProjectList values={this.props.projectid} /> )}
            </FormItem>
            </Form>
            </Modal>
        )
    }
}

export  const EditOrderTypeModal=Form.create()(EditOrderType);