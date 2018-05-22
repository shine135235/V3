import React,{Component} from 'react';
import { Button,Modal,Form,Input } from 'antd';
// import WrappedRegistrationForm from "./test";
import './faultLevel.less';

// const { TextArea } = Input;
const FormItem = Form.Item;
class EditEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
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
        //console.log("edit",nextProps);
        //eslint-disable-next-line
       // console.log("edit",prevState);
        if(nextProps.editVisible === prevState.editVisible) {
          return null;
        }
        // return {
        //   lastRow: nextProps.currentRow,
        //   isCrollingDown: nextProps.curentRow > prevState.lastRow
        // }
        return{
            editVisible:true,
            // addLoading:true,
        }
    }
    editHandleOk = () => {
        this.setState({ editLoading: true });
        setTimeout(() => {
          this.setState({ editLoading: false, editVisible: false });
        }, 3000);
    }
    editHandleCancel = () => {
        this.setState({ editVisible: false });
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
                visible={this.state.editVisible}
                title="编辑故障级别"
                onOk={this.editHandleOk}
                onCancel={this.editHandleCancel}
                footer={[
                    <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.editLoading} onClick={this.editHandleOk}>
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
                        故障级别名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '请输入故障级别名称!', whitespace: true }, {
                            validator: this.eventName,
                        }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
const WrappedRegistrationForm = Form.create()(EditEventCategory);

export default WrappedRegistrationForm;