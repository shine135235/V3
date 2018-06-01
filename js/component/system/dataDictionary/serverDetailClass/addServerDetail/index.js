import React,{Component} from 'react';
import {Button,Form, Modal, Input,Select,message} from 'antd';
import $axios from "axios"
import config from '../../../../../config';
import './index.less';


const FormItem = Form.Item;
const Option = Select.Option;
class AddServerDetail extends Component {
    state = {
        loading: false,
        visible: false,
        categoryData: [],
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => { 
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err){
                return;
            }
            
            //eslint-disable-next-line
            console.log('Received values of form: ', values);
            let serverItemName = values.serverDetailName;
            let serverLogId = values.serverDetailPname;
            let listData = this.props.listData;
            if(listData.length !==0){
                for(let i = 0;i < listData.length;i++){
                    if(serverLogId == listData[i].logid && serverItemName == listData[i].name){
                        this.props.form.setFields({
                            serverDetailName:{
                                value:serverItemName,
                                errors:[new Error("该服务大类下服务细类已存在，请重新填写！")]
                            }
                        });
                        return;
                    }
                }
            }
            this.setState({ loading: true });
            this.addServerDetailData({serverItemName,serverLogId});
        })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    addServerDetailData = ({serverItemName = "",serverLogId = ""}) => {
        $axios.post(`${config.api_server}/pro/sla/item`,{
            "name":serverItemName,
            "logid":serverLogId,
        }).then((json) => {
            // eslint-disable-next-line
            console.log(json);
            if(json.data.success){
                this.success("添加成功！");
                this.props.getListData({});
                this.setState({ loading: false, visible: false });
            }else{
                this.error("添加失败！");
                this.setState({ loading: false});
            }
        })
    }
    success = (msg) => {
        message.success(msg);
    };
    error = (msg) => {
        message.error(msg);
    };
    getLogListData = () =>{
        $axios.get(`${config.api_server}/pro/logList`).then((json) => {
            //eslint-disable-next-line
            console.log("getLogListData",json);
            let categoryData = json.data.page.datas;
            this.setState({
                categoryData,
            })
        })
    }
    componentDidMount(){
        this.getLogListData();
    }
    // check = () => {
    //     let listData = this.props.listData;
    //     let serverDetailName = this.props.form.getFieldValue('serverDetailName');
    //     let serverDetailPname = this.props.form.getFieldValue('serverDetailPname');
    //     if(listData.length !==0){
    //         for(let i = 0;i < listData.length;i++){
    //             if(serverDetailPname == listData[i].logid && serverDetailName == listData[i].name){
    //                 this.props.form.setFields({
    //                     serverDetailName:{
    //                         value:serverDetailName,
    //                         errors:[new Error("该服务大类下服务细类已存在，请重新填写！")]
    //                     }
    //                 });
    //                 return;
    //             }
    //         }
    //     }
    // }
    render(){
        const { visible, loading ,categoryData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const optionArr = [];
        for(let i = 0;i<categoryData.length;i++){
            let item=categoryData[i];
            optionArr.push(
                <Option value={item.id} key={i}>{item.name}</Option>
            )
        }
        return(
            <div className='serverDetailNew'>
                <Button type="primary" onClick = {this.showModal} icon="plus">新建</Button>
                 <Modal
                    visible={visible}
                    title="新建服务细类"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose = {true}
                    footer={[
                      <Button key="back" onClick={this.handleCancel}>取消</Button>,
                      <Button key="submit" type="primary" htmlType='submit' loading={loading} onClick={this.handleOk}>保存</Button>,
                    ]}
                 >
                     <Form>
                         <FormItem
                            {...formItemLayout}
                            label="服务大类名称"
                         >
                            {getFieldDecorator('serverDetailPname', {
                                rules: [
                                { required: true, message: '请选择服务大类名称!' },
                                ],
                            })(
                                <Select placeholder="请选择服务大类名称"
                                optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} showSearch >
                                    {optionArr}
                                </Select>
                            )}
                         </FormItem>
                         <FormItem
                            {...formItemLayout}
                            label="服务细类名称"
                         >
                            {getFieldDecorator('serverDetailName', {
                                rules: [
                                { required: true, message: '请填写服务细类名称!' },
                                ],
                            })(
                                <Input 
                                // onBlur={this.check}
                                />
                            )}
                         </FormItem>
                     </Form>
                 </Modal>
            </div>
        )
    }
}

const addServerDetail = Form.create()(AddServerDetail);
export default addServerDetail;
