import React,{Component} from 'react';
import { Button,Modal,Form,Input} from 'antd';

// const { TextArea } = Input;
const FormItem = Form.Item;
class AddKnowledge extends Component{
    constructor(props){
        super(props)
        this.state={
            addVisible: false,
            htmlContent: `<p style="text-align:center;">\n\t<strong><u><span style="background-color:#E53333;">的撒多撒的撒多撒</span></u></strong><strong><u><span style="background-color:#E53333;">的撒多撒</span></u></strong><strong><u><span style="background-color:#E53333;">的撒多撒</span></u></strong><strong><u><span style="background-color:#E53333;">的撒多撒</span></u></strong>\n</p>\n<p style="text-align:center;">\n\t<strong><u><span style="background-color:#E53333;"><img src="http://101.200.173.227:9092/resource/20180526/11.jpeg" alt="" /><br />\n</span></u></strong>\n</p>\n<h1 style="text-align:left;">\n\t<strong><u><span style="background-color:#E53333;">的撒啊啊啊啊啊啊啊啊啊啊啊啊啊<span style={{background-color:#B8D100"}}>嘟嘟嘟嘀嘀多多多多多多多</span></span></u></strong>\n</h1>`,
  markdownContent: "## HEAD 2 \n markdown examples \n ``` welcome ```",
  responseList: []

        }
    }
    receiveRaw = (content) => {
        console.log("recieved Raw content", content);
    }
    AddNews = () => {
        this.setState({
           addVisible: true,
        });
    } 
    onChange=(info) =>{
       console.log(info)
       this.setState({
           responseList:info.fileList
       })
    }
    render(){
       
          const { getFieldDecorator } = this.props.form;
        // let option =[];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        }; 
        return (
            <span>
            <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
            <Modal
                    visible={this.state.addVisible}
                    title="新增知识"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    afterClose = {this.afterClose}
                    width = {900}
                    height = {600}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >
                <div className='addKnowledge'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            知识库类型&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('falutName', {
                                rules: [{ required: true, message: '请输知识库类型', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输知识库类型"/>
                            )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            主题&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('zhuti', {
                                rules: [{ required: true, message: '请输主题', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输主题"/>
                            )}
                        </FormItem>
                    </Form>
                    <div className= "addKnowledgeLz" style = {{"height":"500px","overflowY":"auto"}}>
                   
                    </div>
                </div>
            </Modal>
        </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddKnowledge);

export default WrappedRegistrationForm;