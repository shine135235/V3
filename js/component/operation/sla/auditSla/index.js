import React,{Component} from 'react';
import {Button,Modal, Form,Input, Row, Col,message} from 'antd';
import $axios from 'axios';

const FormItem = Form.Item;
class AuditSla extends Component {
    state = {
        paseLoading: false,
        unPaseLoading: false,
    }
    handleOk = (type,e) => {
        e.preventDefault();
        let status = "";
        if(type == "pase"){
            status = "2";
            this.setState({ paseLoading: true });
        }else{
            status = "1";
            this.setState({ unPaseLoading: true });
        }
        // eslint-disable-next-line
        console.log("this.props.detailData",this.props.detailData);
        let id = this.props.detailData.rId;
        this.auditSla({id,status,clickType:type});
    }
    handleCancel = () => {
        this.props.changeVisibleType({ visibleAudit: false });
    }
    auditSla = ({id="",status='',clickType = ""}) => {
        $axios.put(`http://172.16.6.11:9090/ops/sla/audit`,{
            "id":id,
            "status":status
        }).then((json) => {
            // eslint-disable-next-line
            console.log("shenhe",json.data.success);
            if(clickType == "pase"){
                this.setState({ paseLoading: false });
            }else{
                this.setState({ unPaseLoading: false });
            }
            if(json.data.success){
                this.success("操作成功！");
            }else{
                this.error("操作失败！");
            }
            this.props.getListData({});
            this.props.changeVisibleType({ visibleAudit: false });
        })
    }
    success = (con) => {
        message.success(con);
    }
    error = (con) => {
        message.error(con);
    }
    render(){
        const {paseLoading,unPaseLoading} = this.state;
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
            <div className='AuditSla'>
                <Modal
                    visible={this.props.visibleAudit}
                    title="SLA审核"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width={650}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="auditPase" type="primary" loading={paseLoading}  onClick={this.handleOk.bind(this,"pase")}>审核通过</Button>,
                        <Button key="auditUnPase" type="primary" loading={unPaseLoading}  onClick={this.handleOk.bind(this,"unPase")}>审核不通过</Button>,
                    ]}
                >
                    <Form>
                        <FormItem 
                            {...formItemLayout} 
                            label="SLA名称"
                        >
                            {getFieldDecorator('slaNameAudit', {
                                rules: [{
                                    required: true,
                                    message: '请填写SLA名称',
                                }],
                                initialValue:this.props.detailData.name,
                            })(
                                <Input placeholder="请填写SLA名称..." disabled={true}/>
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
                                                {getFieldDecorator('slaCommonResponseHourAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonResponseHour,
                                                })(
                                                    <Input addonAfter='小时' disabled={true}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonResponseMinAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonResponseMin,
                                                })(
                                                    <Input addonAfter='分钟' disabled={true}/>
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
                                                {getFieldDecorator('slaCommonSolutionHourAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonSolutionHour,
                                                })(
                                                    <Input addonAfter='小时' disabled={true}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonSolutionMinAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonSolutionMin,
                                                })(
                                                    <Input addonAfter='分钟' disabled={true}/>
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
                                                {getFieldDecorator('slaBadResponseHourAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadResponseHour,
                                                })(
                                                    <Input addonAfter='小时' disabled={true}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadResponseMin', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障响应时间Audit',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadResponseMin,
                                                })(
                                                    <Input addonAfter='分钟' disabled={true}/>
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
                                                {getFieldDecorator('slaBadSolutionHourAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadSolutionHour,
                                                })(
                                                    <Input addonAfter='小时' disabled={true}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadSolutionMinAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadSolutionMin,
                                                })(
                                                    <Input addonAfter='分钟' disabled={true}/>
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
                                                {getFieldDecorator('slaGreatResponseHourAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatResponseHour,
                                                })(
                                                    <Input addonAfter='小时' disabled={true}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatResponseMinAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatResponseMin,
                                                })(
                                                    <Input addonAfter='分钟' disabled={true}/>
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
                                                {getFieldDecorator('slaGreatSolutionHourAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatSolutionHour,
                                                })(
                                                    <Input addonAfter='小时' disabled={true}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatSolutionMinAudit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatSolutionMin,
                                                })(
                                                    <Input addonAfter='分钟' disabled={true}/>
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
const auditSla = Form.create()(AuditSla);
export default auditSla;