import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Col} from 'antd';
import './dictionaryAll.less';

const FormItem = Form.Item; 
class EditDictionaryDetailTest extends Component{
    constructor(props){
        super(props)
        this.state={
            editLoading: false,
            editVisible: false,
            addVisible:false,
            idChild:0,
            dataSource:[],
            fromData:null,
            isOrNo:true,
            // addLoading:false,
            // parentID:this.props,
            childs:[],
            data :[]
        }
    }
    componentDidMount(){
    }
    changeChilc = (childs) =>{
        this.setState({childs})
    }
    isOrNoStyle = ({type = true}) =>{
        this.setState({isOrNo:type})
    }
    success = () => {                       //操作完成提示弹框
        const modal = Modal.success({       // success('操作成功!');
            title: '操作成功',
            content: '编辑字典类别管理成功',
          });
          setTimeout(() => modal.destroy(), 2000);
    };
    error = () => {
        const modal = Modal.error({         // success('操作成功!');
            title: '操作失败',
            content: '编辑字典类别管理失败',
          });
          setTimeout(() => modal.destroy(), 2000);
    };
    editHandleOk = () => { 
        let record = this.props.record;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ editLoading: true});
                let obj = {id:record.id};
                obj.itemKey = values.dicName1;
                obj.itemValue = values.dicName2;
                $axios({
                    url:"http://172.16.6.11:9090/sys/dictitem/update",
                    method:'post',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:obj
                }).then((res) => {
                    //eslint-disable-next-line
                    console.log(res);
                    let datas = res.data.success;
                    if(datas){
                        this.props.getDataList({});
                        setTimeout(() => {
                            this.props.changeT({editLoading: false, editVisible: false})  
                            this.setState({editLoading: false, editVisible: false})  
                        }, 3000);
                        setTimeout(() => {
                            this.success();
                        }, 3000);
                    }else{
                        setTimeout(() => {
                            this.error();
                        }, 3000);
                    }
                })
            }
        });  
    }

    editHandleCancel = () => {
        this.setState({editVisible:false})
        this.props.changeT({editVisible:false});
    }

    handleChange = () => {   
    }
    handleBlur = () => {        
    }
    handleFocus = () => {
    }
    afterClose = () => {
        this.isOrNoStyle({});
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
                sm: { span: 16 },
            },
        };   
        return (
            <span> 
                <Modal
                    visible={this.props.editVisible}
                    title="编辑字典项管理"
                    onOk={this.editHandleOk}
                    onCancel={this.editHandleCancel}
                    width={600}
                    afterClose={this.afterClose}
                    destroyOnClose={true}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;条目项标识用于后端存储,名称用于前端展示</span>,
                        <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" htmlType='submit' size="large" loading={this.state.editLoading} onClick={this.editHandleOk}
                        >保存</Button>
                    ]}
                >
                    <Form>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            所属类别&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('dicName', {
                             initialValue:this.props.record.typeName,
                        })(
                            <Input disabled = {true}  />
                        )}
                        </FormItem>
                        <FormItem
                        {... formItemLayout}
                        label={'条目项标识-名称'}
                        required={false}
                        >
                            {/* <FormItem 
                                style = {{"display":"inline-block"}}
                                {...formItemLayout}
                                > */}
                                    <Col span={11}>
                                        <FormItem >
                                            {getFieldDecorator(`dicName1`, {
                                                    initialValue:this.props.record.itemKey,
                                                    rules: [{ required: true, message: '请输入条目', whitespace: true }],
                                                })(
                                                    <Input placeholder="条目"  />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={2}>
                                        <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                        -
                                        </span>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem>
                                            {getFieldDecorator(`dicName2`, {
                                                initialValue:this.props.record.itemValue,
                                                    rules: [{ required: true, message: '请输入名称', whitespace: true }],
                                                })(
                                                    <Input placeholder="名称" />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                {/* </FormItem> */}
                        </FormItem>      
                    </Form>
                </Modal>
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(EditDictionaryDetailTest);

export default WrappedRegistrationForm;