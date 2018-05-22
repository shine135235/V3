import React,{Component} from 'react';
import { Button,Modal,Form,Input } from 'antd';
// import WrappedRegistrationForm from "./test";
import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:this.props.addVisible,
        addLoading:false,
      }
    componentDidMount(){

    }
    componentDidUpdate(){
       
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              //eslint-disable-next-line
            console.log('Received values of form: ', values);
          }
        });
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        //eslint-disable-next-line
       // console.log("add",nextProps);
        //eslint-disable-next-line
      //  console.log("add",prevState);
        if(nextProps.addVisible === prevState.addVisible) {
          return null;
        }
        // return {
        //   lastRow: nextProps.currentRow,
        //   isCrollingDown: nextProps.curentRow > prevState.lastRow
        // }
        return{
            addVisible:true,
            // addLoading:true,
        }
    }
    addHandleOk = () => {
        this.setState({ addLoading: true });
        setTimeout(() => {
          this.setState({ addLoading: false, addVisible: false });
        }, 3000);
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
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
        return (
            <Modal
                visible={this.state.addVisible}
                title="添加工单来源"
                onOk={this.addHandleOk}
                onCancel={this.addHandleCancel}
                footer={[
                    <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.addLoading} onClick={this.addHandleOk}>
                    保存
                    </Button>,
                ]}
            >
                {/* <Form layout="inline">
                    <FormItem label="Username">
                        {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Username is required!' }],
                        })(<Input />)}
                    </FormItem>
                </Form> */}
                {/* <WrappedRegistrationForm /> */}
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        事件类型名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '请输入事件类型名称!', whitespace: true }, {
                            validator: this.eventName,
                        }],
                    })(
                        <Input />
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
                    {getFieldDecorator('dis', {
                        rules: [{ required: true, message: '请输入事件类型描述!', whitespace: true }],
                    })(
                        <TextArea rows={4} />
                    )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;