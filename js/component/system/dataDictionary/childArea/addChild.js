import React,{Component} from 'react';
import $axios from 'axios';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Button,Modal,Form,Input,LocaleProvider,message,Tooltip,Icon } from 'antd';
import config from '../../../../config';

// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class Addchild extends Component{
    state = {
        addVisible:this.props.addVisible,
        addLoading:false,
        alertVisible:false
      }
    componentDidMount(){

    }
    componentDidUpdate(){
       
    }
    handleSubmit = (e) => {
        e.preventDefault();
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //   if (!err) {
        //       //eslint-disable-next-line
        //     console.log('Received values of form: ', values);
        //   }
        // });
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = (e) => { 
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //eslint-disable-next-line
            // console.log("test",values);
            if(err) {
                return ;
            }
            this.setState({ addLoading: true});
          if (!err) {
                $axios({
                    url:`${config.api_server}/sys/area/add`,
                    method:'post',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:values
                }).then((res) => {
                    let datas = res.data.success;
                    if(datas){
                        this.props.getDataList({pageNum:1,pageSize:10,param:""})
                            setTimeout(() => {
                                let success = "添加片区成功"
                                this.success(success);
                            }, 3000);
                            setTimeout(() => {
                                this.setState({ addLoading: false, addVisible: false});
                              }, 3000);  
                    }else{
                        this.setState({ addLoading: false});
                        let error = ""
                        if(res.data.message && res.data.message != ""){
                            error = res.data.message
                        }else{
                            error = "添加片区失败"
                        }
                        setTimeout(() => {
                                this.error(error);
                        }, 1000);
                    }
                })
            }            
        })  
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
    }

    AddNew = () => {
        this.setState({
           addVisible: true,
           editVisible: false,
          });
    }
    eventCodeName = (rule, value, callback) =>{
        let cat =/^[A-Z]+$/g;
        if(cat.test(value)){
            callback()
        }else{
            callback('建议代号格式区域名称拼音首字母大写')
        }    
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const text = <span>代号为区域名称拼音首字母大写</span>;
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
        return (
            <span>
                <Button type="primary" onClick = {this.AddNew} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="新建片区"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;建议代号为区域名称拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >
                 <LocaleProvider local={zhCN}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            区域名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入区域名称', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Input placeholder = "如：北京"/>
                        )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            代号&nbsp;
                            <Tooltip placement="top" title={text}>
                                    <Icon type="info-circle-o"  className = "iTip" />
                            </Tooltip>
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: '请输入代号', whitespace: true }, {
                                validator: this.eventCodeName,
                            }],
                        })(
                            <Input placeholder = "如：BJ"/>
                        )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            描述&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('areaDesc', {
                            rules: [{ required: false, message: '请输入区域描述!', whitespace: true }],
                        })(
                            <TextArea rows={4} />
                        )}
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(Addchild);

export default WrappedRegistrationForm;