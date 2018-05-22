import React,{Component} from 'react';
import {Button,Modal, Form,Input, Row, Col,message} from 'antd';
import $axios from 'axios';
import './index.less';

const FormItem = Form.Item;
class AddSla extends Component {
    state = {
        loading: false,
        visible: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({ loading: true });
            
            let slaBadResponseHour = Number(values.slaBadResponseHour);
            let slaBadResponseMin = Number(values.slaBadResponseMin);
            let slaBadSolutionHour = Number(values.slaBadSolutionHour);
            let slaBadSolutionMin = Number(values.slaBadSolutionMin);
            let slaCommonResponseHour = Number(values.slaCommonResponseHour);
            let slaCommonResponseMin = Number(values.slaCommonResponseMin);
            let slaCommonSolutionHour = Number(values.slaCommonSolutionHour);
            let slaCommonSolutionMin = Number(values.slaCommonSolutionMin);
            let slaGreatResponseHour = Number(values.slaGreatResponseHour);
            let slaGreatResponseMin = Number(values.slaGreatResponseMin);
            let slaGreatSolutionHour = Number(values.slaGreatSolutionHour);
            let slaGreatSolutionMin = Number(values.slaGreatSolutionMin);

            let badResponseTime = slaBadResponseHour*60+slaBadResponseMin;
            let badSolutionTime = slaBadSolutionHour*60+slaBadSolutionMin;
            let commonResponseTime = slaCommonResponseHour*60+slaCommonResponseMin;
            let commonSolutionTime = slaCommonSolutionHour*60+slaCommonSolutionMin;
            let greatResponseTime = slaGreatResponseHour*60+slaGreatResponseMin;
            let greatSolutionTime = slaGreatSolutionHour*60+slaGreatSolutionMin;
            let list = [
                {
                    "serviceLevelName":"一般故障",
                    "responseTime":commonResponseTime.toString(),
                    "solutionTime":commonSolutionTime.toString()
                },{
                    "serviceLevelName":"严重故障",
                    "responseTime":badResponseTime.toString(),
                    "solutionTime":badSolutionTime.toString()
                },{
                    "serviceLevelName":"重大故障",
                    "responseTime":greatResponseTime.toString(),
                    "solutionTime":greatSolutionTime.toString()
                }
            ]
            let slaName = values.slaName;
            let slaStatus = "0"
            this.addSlaData({slaName,slaStatus,list});
            
        })
        
    }
    addSlaData = ({slaName = "",slaStatus = "",list = []}) => {
        $axios.post(`http://172.16.6.11:9090/ops/sla/creation`,{
            "name":slaName,
            "slaStatus":slaStatus,
            "list":list
        }).then((json) => {
            // eslint-disable-next-line
            console.log("tianjia",json);
            if(json.data.success){
                this.success("添加成功！");
                this.setState({ loading: false, visible: false });
            }else{
                this.error("添加失败！");
            }
            this.props.getListData({});
        })
    }
    success = (text) => {
        message.success(text);
    }
    error = (text) => {
        message.error(text);
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    checkTime = (e) => {
        // eslint-disable-next-line
        console.log("val",e.target.id);
        let val = e.target.value;
        let id = e.target.id;
        if(val >= 60){
            
        // eslint-disable-next-line
        console.log("val",val);
        let error = [new Error("分钟数不能大于60！")]
            if(id == "slaBadResponseMin"){
                this.props.form.setFields({
                    slaBadResponseMin:{
                        value:val,
                        errors:error
                    }
                })
            }else if(id == "slaBadSolutionMin"){
                this.props.form.setFields({
                    slaBadSolutionMin:{
                        value:val,
                        errors:error
                    }
                })

            }else if(id == "slaCommonResponseMin"){
                this.props.form.setFields({
                    slaCommonResponseMin:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaCommonSolutionMin"){
                this.props.form.setFields({
                    slaCommonSolutionMin:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaGreatResponseMin"){
                this.props.form.setFields({
                    slaGreatResponseMin:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaGreatSolutionMin"){
                this.props.form.setFields({
                    slaGreatSolutionMin:{
                        value:val,
                        errors:error
                    }
                })
                
            }
        }
    }
    render(){
        const {visible,loading} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        }
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        }
        return(
            <div className='addSla'>
                <Button type="primary" icon="plus" onClick={this.showModal}>新建</Button>
                <Modal
                    visible={visible}
                    title="SLA新建"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width={650}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={loading} htmlType="submit" onClick={this.handleOk}>保存</Button>,
                    ]}
                >
                    <Form>
                        <FormItem 
                            {...formItemLayout} 
                            label="SLA名称"
                        >
                            {getFieldDecorator('slaName', {
                                rules: [{
                                    required: true,
                                    message: '请填写SLA名称',
                                }],
                            })(
                                <Input placeholder="请填写SLA名称..." />
                            )}
                        </FormItem>
                        <div style={{"marginLeft":"4%","marginBottom":"2%"}}>一般故障</div>
                        <Row style={{"marginLeft":"4%"}}>
                            <Col span={12}>
                                <FormItem 
                                    {...formItemLayout1} 
                                    label="响应时间"
                                    required={true}
                                >
                                     <Row style={{"marginLeft":"2%"}}>
                                        <Col span={11}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonResponseHour', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:"2",
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonResponseMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:"0",
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem 
                                    {...formItemLayout1} 
                                    label="解决时间"
                                    required={true}
                                >
                                    <Row style={{"marginLeft":"2%"}}>
                                        <Col span={11}>
                                            <FormItem>    
                                                {getFieldDecorator('slaCommonSolutionHour', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:"24",
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonSolutionMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:"0",
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{"marginLeft":"4%","marginBottom":"2%","marginTop":"2%"}}>严重故障</div>
                        <Row style={{"marginLeft":"4%"}}>
                            <Col span={12}>
                                <FormItem 
                                    {...formItemLayout1} 
                                    label="响应时间"
                                    required={true}
                                >
                                     <Row style={{"marginLeft":"2%"}}>
                                        <Col span={11}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadResponseHour', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障响应时间',
                                                    }],
                                                    initialValue:"1",
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadResponseMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障响应时间',
                                                    }],
                                                    initialValue:"0",
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem 
                                    {...formItemLayout1} 
                                    label="解决时间"
                                    required={true}
                                >
                                    <Row style={{"marginLeft":"2%"}}>
                                        <Col span={11}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadSolutionHour', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:"12",
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadSolutionMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:"0",
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{"marginLeft":"4%","marginBottom":"2%","marginTop":"2%"}}>重大故障</div>
                        <Row style={{"marginLeft":"4%"}}>
                            <Col span={12}>
                                <FormItem 
                                    {...formItemLayout1} 
                                    label="响应时间"
                                    required={true}
                                >
                                     <Row style={{"marginLeft":"2%"}}>
                                        <Col span={11}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatResponseHour', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:"0",
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatResponseMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:"30",
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem 
                                    {...formItemLayout1} 
                                    label="解决时间"
                                    required={true}
                                >
                                    <Row style={{"marginLeft":"2%"}}>
                                        <Col span={11}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatSolutionHour', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:"6",
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatSolutionMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:"0",
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const addSla = Form.create()(AddSla);
export default addSla;