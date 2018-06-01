import React,{Component} from 'react';
import {Button,Form, Modal, Input,Select,message} from 'antd';
import $axios from "axios";
import config from '../../../../../config';
import './index.less';


const FormItem = Form.Item;
const Option = Select.Option;
class EditServerDetail extends Component {
    state = {
        loading: false,
        visible: false,
        categoryData: [],
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
            let serverItemName = values.serverDetailNameEdit;
            let serverLogId = values.serverDetailPnameEdit;
            
            this.setState({ loading: true });
            this.editServerDetailData({id,serverLogId,serverItemName});
        })
    }
    handleCancel = () => {
        this.props.changeVisibleType({visibleEdit:false});
    }
    editServerDetailData = ({id = "",serverLogId = "",serverItemName = ""}) => {
        $axios.put(`${config.api_server}/pro/sla/item`,{
            "id":id,
            "logid":serverLogId,
            "name":serverItemName,
        }).then(json => {
            //eslint-disable-next-line
            console.log("editServerDetailData",json);
            if(json.data.success){
                this.success("编辑成功！");
                this.props.getListData({});
                this.setState({ loading: false});
                this.props.changeVisibleType({visibleEdit:false});
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
        this.getLogListData()
    }
    render(){
        const {loading ,categoryData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const optionArr = [];
        for(let i = 0;i<categoryData.length;i++){
            let item = categoryData[i];
            optionArr.push(
                <Option value={item.id} key={i}>{item.name}</Option>
            )
        }
        return(
            <div className='serverDetailEdit'>
                 <Modal
                    visible={this.props.visibleEdit}
                    title="编辑服务细类"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
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
                            {getFieldDecorator('serverDetailPnameEdit', {
                                rules: [
                                { required: true, message: '请选择服务大类名称!' },
                                ],
                                initialValue:this.props.logid,
                            })(
                                <Select placeholder="请选择服务大类名称" optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} showSearch>
                                    {optionArr}
                                </Select>
                            )}
                         </FormItem>
                         <FormItem
                            {...formItemLayout}
                            label="服务细类名称"
                         >
                            {getFieldDecorator('serverDetailNameEdit', {
                                rules: [
                                { required: true, message: '请填写服务细类名称!' },
                                ],
                                initialValue:this.props.name,
                            })(
                                <Input/>
                            )}
                         </FormItem>
                     </Form>
                 </Modal>
            </div>
        )
    }
}

const editServerDetail = Form.create()(EditServerDetail);
export default editServerDetail;
