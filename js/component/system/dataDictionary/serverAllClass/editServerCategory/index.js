import React,{Component} from "react";
import {Button, Form,Modal,Select,Input,message} from "antd";
import $axios from "axios";
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
class EditServerCategory extends Component {
    state = {
        loading: false,
        projectData:[],
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err){
                return;
            }
            //eslint-disable-next-line
            console.log('Received values of form: ', values);
            this.setState({ loading: true });
            let id = this.props.rowId;
            let serverName = values.serverCategoryNameEdit;
            let serverPname = values.serverCategoryPnameEdit;

            this.editServerCategory({id,serverName,serverPname});
            setTimeout(() => {
                this.setState({ loading: false});
                this.props.changeVisibleVal({ visibleEdit: false });
            }, 3000);
        });
    }
    handleCancel = () => {
        this.props.changeVisibleVal({ visibleEdit: false });
    }
    editServerCategory = ({id = "",serverName = "",serverPname = ""}) =>{
        $axios.put(`http://172.16.6.9:9090/pro/sla/servicelog`,{
            "name":serverName,
            "id":id,
            "projectid":serverPname,
        }).then((json) => {
            //eslint-disable-next-line
            console.log(json);
            if(json.data.success){
                this.success("编辑成功！");
                this.props.getListData({});
                this.setState({ loading: false});
                this.props.changeVisibleVal({ visibleEdit: false });
            }else{
                this.error("编辑失败！");
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
        $axios.get(`http://172.16.6.9:9090/pro/pList`).then((json) => {
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
    //     let rowId = this.props.rowId;
    //     let curPid = this.props.projectid;
    //     let curName = this.props.name;
    //     // eslint-disable-next-line
    //     console.log("curPid",curPid);
    //     // eslint-disable-next-line
    //     console.log("curName",curName);
    //     let serverCategoryName = this.props.form.getFieldValue('serverCategoryNameEdit');
    //     let serverCategoryPname = this.props.form.getFieldValue('serverCategoryPnameEdit');
    //     if(listData.length !==0){
    //         for(let i = 0;i < listData.length;i++){
    //             //当前数据的项目ID === 所选项目的ID
    //             if(curPid === serverCategoryPname){
    //                 //当前数据的大类 === 所填大类
    //                 if(curName === serverCategoryName){
    //                     // eslint-disable-next-line
    //                     console.log("当前数据的大类 === 所填大类");
    //                 }else{
    //                     //当前数据的大类 !== 所填大类
    //                     if(rowId !== listData[i].id && serverCategoryName === listData[i].name){
    //                         this.props.form.setFields({
    //                             serverCategoryNameEdit:{
    //                                 value:serverCategoryName,
    //                                 errors:[new Error("该项目下服务大类已存在，请重新填写！")]
    //                             }
    //                         });
    //                     }
    //                     // eslint-disable-next-line
    //                     console.log("当前数据的大类 !== 所填大类");
    //                 }
    //             }else if(curPid !== serverCategoryPname){//console.log("当前数据的项目ID !== 所选项目的ID");// eslint-disable-line
    //                 if(curName === serverCategoryName){console.log("当前数据的大类 === 所填的大类");// eslint-disable-line
    //                     if(rowId !== listData[i].id && serverCategoryName === listData[i].name){
    //                         this.props.form.setFields({
    //                             serverCategoryNameEdit:{
    //                                 value:serverCategoryName,
    //                                 errors:[new Error("该项目下服务大类已存在，请重新填写！")]
    //                             }
    //                         });
    //                     }
    //                 }else{console.log("当前数据的大类 !== 所填的大类");// eslint-disable-line
    //                     if(rowId !== listData[i].id && serverCategoryPname === listData[i].projectid && serverCategoryName === listData[i].name){
    //                         this.props.form.setFields({
    //                             serverCategoryNameEdit:{
    //                                 value:serverCategoryName,
    //                                 errors:[new Error("该项目下服务大类已存在，请重新填写！")]
    //                             }
    //                         });
    //                     }
    //                 }
    //             }
    //             // if(rowId !== listData[i].id){
    //             //     // if(serverCategoryPname == listData[i].projectid && serverCategoryName == listData[i].name){
    //             //     //     this.props.form.setFields({
    //             //     //         serverCategoryNameEdit:{
    //             //     //             value:serverCategoryName,
    //             //     //             errors:[new Error("该项目下服务大类已存在，请重新填写！")]
    //             //     //         }
    //             //     //     });
    //             //     //     return;
    //             //     // }

    //             // }
    //         }
    //     }
    // }
    render(){
        const {loading ,projectData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const optionArr = [];
        for(let i = 0;i<projectData.length;i++){
            let item = projectData[i];
            optionArr.push(
                <Option value={item.id} key={i}>{item.name}</Option>
            )
        }
        return(
            <div className='serverCategoryEdit'>
                <Modal
                    visible={this.props.visibleEdit}
                    title="编辑服务大类"
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
                        {getFieldDecorator('serverCategoryPnameEdit', {
                            rules: [
                              { required: true, message: '请选择项目!' },
                            ],
                            initialValue:this.props.projectid,
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
                            {getFieldDecorator('serverCategoryNameEdit', {
                                rules: [{ required: true, message: '请填写服务大类名称!' }],
                                initialValue:this.props.name,
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

const editServerCategory = Form.create()(EditServerCategory);
export default editServerCategory;
