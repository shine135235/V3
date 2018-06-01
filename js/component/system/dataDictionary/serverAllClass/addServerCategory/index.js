import React,{Component} from "react";
import {Button, Form,Modal,Select,Input,message} from "antd";
import $axios from "axios";
import config from '../../../../../config';
import './index.less'


const FormItem = Form.Item;
const Option = Select.Option;
class AddServerCategory extends Component {
    state = {
        loading: false,
        visible: false,
        projectData:[],
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
            let serverName = values.serverCategoryName;
            let serverPname = values.serverCategoryPname;
            // let listData = this.props.listData;
            // if(listData.length !==0){
            //     for(let i = 0;i < listData.length;i++){
            //         if(serverPname == listData[i].projectid && serverName == listData[i].name){
            //             this.props.form.setFields({
            //                 serverCategoryName:{
            //                     value:serverName,
            //                     errors:[new Error("该项目下服务大类已存在，请重新填写！")]
            //                 }
            //             });
            //             return;
            //         }
            //     }
            // }
            this.setState({ loading: true });
            this.addServerCategoryData({serverName,serverPname});
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    addServerCategoryData = ({serverName = "",serverPname = ""}) => {
        $axios.post(`${config.api_server}/pro/sla/servicelog`,{
            "name":serverName,
            "id":serverPname,
        }).then((json) => {
            //eslint-disable-next-line
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
    getProjectData = () => {
        $axios.get(`${config.api_server}/pro/pList`).then((json) => {
            // eslint-disable-next-line
            console.log("json",json);
            let projectData = json.data.page.datas;
            this.setState({
                projectData,
            })
        })
    }
    componentDidMount(){
        this.getProjectData();
    }
    // check = () => {
    //     let listData = this.props.listData;
    //     let serverCategoryName = this.props.form.getFieldValue('serverCategoryName');
    //     let serverCategoryPname = this.props.form.getFieldValue('serverCategoryPname');
    //     if(listData.length !==0){
    //         for(let i = 0;i < listData.length;i++){
    //             if(serverCategoryPname == listData[i].projectid && serverCategoryName == listData[i].name){
    //                 this.props.form.setFields({
    //                     serverCategoryName:{
    //                         value:serverCategoryName,
    //                         errors:[new Error("该项目下服务大类已存在，请重新填写！")]
    //                     }
    //                 });
    //                 return;
    //             }
    //         }
    //     }
    // }
    render(){
        const { visible, loading ,projectData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const optionArr = [];
        for(let i = 0;i<projectData.length;i++){
            let Item = projectData[i];
            optionArr.push(
                <Option value={Item.id} key={i}>{Item.name}</Option>
            )
        }
        return(
            <div className='serverCategoryNew'>
                <Button type="primary" onClick = {this.showModal} icon="plus">新建</Button>
                <Modal
                    visible={visible}
                    title="新建服务大类"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose = {true}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>保存</Button>,
                    ]}
                >
                     <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="项目名称"
                        >
                        {getFieldDecorator('serverCategoryPname', {
                            rules: [
                              { required: true, message: '请选择项目!' },
                            ],
                          })(
                            <Select placeholder="请选择项目" optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} showSearch>
                              {optionArr}
                            </Select>
                          )}
                        </FormItem>
                        <FormItem 
                            {...formItemLayout}
                            label="服务大类"
                        >
                            {getFieldDecorator('serverCategoryName', {
                                rules: [{ required: true, message: '请填写服务大类名称!' }],
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

const addServerCategory = Form.create()(AddServerCategory);
export default addServerCategory;
