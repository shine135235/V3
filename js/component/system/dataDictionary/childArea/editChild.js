import React,{Component} from 'react';
import $axios from 'axios'
import { Button,Modal,Form,Input,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class Editchild extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        // alertVisible:false
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
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        const modal = Modal.success({
            title: '操作成功',
            content: '添加字典类别管理成功',
          });
          setTimeout(() => modal.destroy(), 2000);
    };

     error = () => {
        Modal.error({
          title: '操作失败',
          content: '添加字典类别失败',
        });
      }
      editHandleOk = (e) => {
        this.setState({ editLoading: true});
         e.preventDefault();
         let obj = {id: this.props.record.areaId};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return ;
            }
            let parm = Object.assign(values,obj);
            //eslint-disable-next-line
            console.log("222",values);
            $axios({
                url:`${config.api_server}/sys/area/update`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:parm
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getDataList({});
                    setTimeout(() => {
                        this.setState({ editLoading: false, editVisible: false});
                    }, 1000);  
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ editLoading: false});
                    setTimeout(() => {
                        this.error();
                    }, 1000);
                }
           })
        });  
    }

    editHandleCancel = () => {
        this.setState({editVisible:false})
        this.props.changeT({editVisible:false});
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
        let nameValue = "";
        let categoryCodeV = "";
        let description = "";
        let recordDataV = this.props.record; 
        // //eslint-disable-next-line
        // console.log("recordDataVrecordDataV1",recordDataV);
        if(recordDataV.areaId){
            nameValue = recordDataV.areaName;
            categoryCodeV = recordDataV.areaCode;
            description = recordDataV.areaDesc
        }
        return (

            <span>
                <Modal
                    visible={this.props.editVisible}
                    title="编辑片区"
                    onOk={this.editHandleOk}
                    onCancel={this.editHandleCancel}
                    destroyOnClose={true}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母</span>,
                        <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.editHandleOk}>
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
                             initialValue:nameValue,
                            rules: [{ required: true, message: '请输区域名称', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Input placeholder = "请输区域名称"/>
                        )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            代号&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('categoryCode', {
                             initialValue:categoryCodeV,
                            rules: [{ required: true, message: '请输入代号', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Input placeholder = "请输入代号"/>
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
                        {getFieldDecorator('describeCode', {
                            initialValue:description,
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
const WrappedRegistrationForm = Form.create()(Editchild);

export default WrappedRegistrationForm;