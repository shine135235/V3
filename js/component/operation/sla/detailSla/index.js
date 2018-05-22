import React,{Component} from 'react';
import {
    Button,
    Modal, Form,Input, Row, Col} from 'antd';

const FormItem = Form.Item;
class DetailSla extends Component {
    state = {
        loading: false,
    }
    // handleOk = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (err) {
    //             return;
    //         }
    //         // eslint-disable-next-line
    //         console.log("sla",values);
    //         this.setState({ loading: true });
    //         setTimeout(() => {
    //             this.setState({ loading: false});
    //             this.props.changeVisibleType({ visibleDetail: false });
    //         }, 3000);
    //     })
        
    // }
    handleCancel = () => {
        this.props.changeVisibleType({ visibleDetail: false });
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
            if(id == "slaBadResponseMinDetail"){
                this.props.form.setFields({
                    slaBadResponseMinDetail:{
                        value:val,
                        errors:error
                    }
                })
            }else if(id == "slaBadSolutionMinDetail"){
                this.props.form.setFields({
                    slaBadSolutionMinDetail:{
                        value:val,
                        errors:error
                    }
                })

            }else if(id == "slaCommonResponseMinDetail"){
                this.props.form.setFields({
                    slaCommonResponseMinDetail:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaCommonSolutionMinDetail"){
                this.props.form.setFields({
                    slaCommonSolutionMinDetail:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaGreatResponseMinDetail"){
                this.props.form.setFields({
                    slaGreatResponseMin:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaGreatSolutionMinDetail"){
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
        // const {loading} = this.state;
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
            <div className='DetailSla'>
                <Modal
                    visible={this.props.visibleDetail}
                    title="SLA详情"
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width={650}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>关闭</Button>,
                        // <Button key="submit" type="primary" loading={loading} htmlType="submit" onClick={this.handleOk}>保存</Button>,
                    ]}
                >
                    <Form>
                        <FormItem 
                            {...formItemLayout} 
                            label="SLA名称"
                        >
                            {getFieldDecorator('slaNameDetail', {
                                rules: [{
                                    required: true,
                                    message: '请填写SLA名称',
                                }],
                                initialValue:this.props.detailData.name,
                            })(
                                <Input placeholder="请填写SLA名称..."  disabled={true}/>
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
                                                {getFieldDecorator('slaCommonResponseHourDetail', {
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
                                                {getFieldDecorator('slaCommonResponseMinDetail', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonResponseMin,
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime} disabled={true}/>
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
                                                {getFieldDecorator('slaCommonSolutionHourDetail', {
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
                                                {getFieldDecorator('slaCommonSolutionMinDetail', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonSolutionMin,
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime} disabled={true}/>
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
                                                {getFieldDecorator('slaBadResponseHourDetail', {
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
                                                        message: '请填写严重故障响应时间Detail',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadResponseMin,
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime} disabled={true}/>
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
                                                {getFieldDecorator('slaBadSolutionHourDetail', {
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
                                                {getFieldDecorator('slaBadSolutionMinDetail', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadSolutionMin,
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime} disabled={true}/>
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
                                                {getFieldDecorator('slaGreatResponseHourDetail', {
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
                                                {getFieldDecorator('slaGreatResponseMinDetail', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatResponseMin,
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime} disabled={true}/>
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
                                                {getFieldDecorator('slaGreatSolutionHourDetail', {
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
                                                {getFieldDecorator('slaGreatSolutionMinDetail', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatSolutionMin,
                                                })(
                                                    <Input addonAfter='分钟' onBlur={this.checkTime} disabled={true}/>
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
const detailSla = Form.create()(DetailSla);
export default detailSla;