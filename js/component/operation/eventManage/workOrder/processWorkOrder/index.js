import React,{Component} from 'react';
import { Form, Button, Table, Input, Row, Col, Select, Upload, Icon, Modal,Switch } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
// const RadioGroup = Radio.Group;
class ProcessWorkOrder extends Component {
    state = {
        data:[],
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
        showAssets:"none",
        switchType:true,
    }
    goBack = () => {
        this.props.changeShowType({showType:"list"})
    }
    columns = [
        {
            title: '单号',
            dataIndex: 'count',
        },{
            title: '经办人',
            dataIndex: 'handler',
        },{
            title: '经办时间',
            dataIndex: 'assetsTime',
        },{
            title: '出库类型',
            dataIndex: 'assetsType',
        },{
            title: '状态',
            dataIndex: 'assetsStatus',
        },{
            title: '操作',
            key: 'action',
            render: () => {
                return(
                    <span>
                        <a href="javascript:void 0">删除</a>
                    </span>
                )
            }
        }
      ]
      onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
      }
      handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })
    showAssetsTable = () => {
        let showAssets = this.state.showAssets=="none"?"block":"none";
        this.setState({showAssets})
    }
    onChangeSwitch = (checked) => {
        // eslint-disable-next-line
        console.log(`switch to ${checked}`);
        // eslint-disable-next-line
        console.log(`this state before ${this.state.switchType}`);
        this.setState({switchType:checked});
        setTimeout(() => {
        // eslint-disable-next-line
        console.log(`this state ${this.state.switchType}`);
        }, 500);
    }
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        const {getFieldDecorator} = this.props.form;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
            );
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
            // span:20
            },
        };
        const formItemLayoutPeo = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 7 },
            // span:20
            },
        };
        const formItemLayout1 = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            // span:20
            },
        };
        const formItemLayout2 = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
            // span:20
            },
        };
        return(
            <div className='processWorkOrder'>
                <Form>
                    <FormItem
                        wrapperCol={{ span: 19, offset: 2 }}
                    >
                        <TextArea rows={4} disabled={true}/>
                    </FormItem>  
                    <FormItem
                        wrapperCol={{ span: 20, offset: 1 }}
                    >
                    <Button type='primary' style={{"marginLeft":"5%"}} onClick={this.showAssetsTable}>领取资产</Button>
                        <div  className='processWorkOrder_table' style={{"marginLeft":"5%","display":this.state.showAssets}}>
                            <span>领取资产信息</span>
                            <Table columns={this.columns} dataSource={this.state.data} pagination={false} style={{"marginTop":"12px"}}/>
                        </div>
                    </FormItem>
                    
                    
                    <Row style={{"marginTop":"12px"}}>
                        <Col span={10} style={{"marginLeft":"6%"}}>
                            <FormItem
                                {...formItemLayout1}
                                label="上级处理人"
                            >
                                {getFieldDecorator('processUpPeople', {
                                    rules: [{
                                        // required: true,
                                        // message: '请选择报障单位',
                                    }],
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={10}>
                        <FormItem
                                {...formItemLayout2}
                                label="当前处理人"
                            >
                                {getFieldDecorator('processNowPeople', {
                                    rules: [{
                                        // required: true,
                                        // message: '请填写报障人',
                                    }],
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row style={{"marginTop":"12px"}}>
                        <Col span={10} style={{"marginLeft":"6%"}}>
                            <FormItem
                                {...formItemLayout1}
                                label="上级派工时间"
                            >
                                {getFieldDecorator('processUpTime', {
                                    rules: [{
                                        // required: true,
                                        // message: '请选择报障单位',
                                    }],
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={10}>
                        <FormItem
                                {...formItemLayout2}
                                label="解决方式"
                            >
                                {getFieldDecorator('processSolutionType', {
                                    rules: [{
                                        required: true,
                                        message: '请选择解决方式',
                                    }],
                                })(
                                    <Select placeholder="请选择解决方式...">
                                        <Option key='1' value="22">22</Option>
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label='是否解决'
                    >
                        {getFieldDecorator("processSolutionRadio",{
                            rules:[
                                {
                                    required:false,
                                },
                            ],
                            // initialValue:1
                        })(
                            <Switch defaultChecked onChange={this.onChangeSwitch} />
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='处理描述'
                    >
                        {getFieldDecorator("processDesc",{
                            rules:[
                                {
                                    required:true,
                                },
                            ]
                        })(
                            <TextArea rows={4} placeholder='请填写处理描述...'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutPeo}
                        label='人员流转'
                    >
                        {getFieldDecorator("faultDispPerson",{
                            rules:[{
                                required:true,
                            }]
                        })(
                            <Select placeholder="请选择流转人..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                <Option key='1' value="22">22</Option>
                                <Option key='2' value="22qw">22qw</Option>
                                <Option key='3' value="22aa">22aa</Option>
                                <Option key='4' value="22ffew">22ffew</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传图片'
                    >
                        {getFieldDecorator("faultPicture")(
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 3 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                          </div>
                        )}
                        <div>可以上传3张图片，单张小于5M。图片支持的格式有：jpg,bmp,png,gif</div>
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 20, offset: 4 }}
                    >

                        <Button type="primary" htmlType="submit" onClick={this.submitFunc}>提交</Button>
                        <Button onClick={this.goBack} style={{"marginLeft":"1%"}}>返回</Button>
                    </FormItem>
                </Form>

            </div>
            
        )
    }
}

const processWorkOrder = Form.create()(ProcessWorkOrder);
export default processWorkOrder;

