import React,{Component} from 'react';
import {Button,Modal, Form,Input, Row, Col,message} from 'antd';
import $axios from 'axios';
import config from '../../../../config';

const FormItem = Form.Item;
class EditSla extends Component {
    state = {
        loading: false,
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // eslint-disable-next-line
            console.log("sla",values);
            this.setState({ loading: true });
            let slaBadResponseHour = Number(values.slaBadResponseHourEdit);
            let slaBadResponseMin = Number(values.slaBadResponseMinEdit);
            let slaBadSolutionHour = Number(values.slaBadSolutionHourEdit);
            let slaBadSolutionMin = Number(values.slaBadSolutionMinEdit);
            let slaCommonResponseHour = Number(values.slaCommonResponseHourEdit);
            let slaCommonResponseMin = Number(values.slaCommonResponseMinEdit);
            let slaCommonSolutionHour = Number(values.slaCommonSolutionHourEdit);
            let slaCommonSolutionMin = Number(values.slaCommonSolutionMinEdit);
            let slaGreatResponseHour = Number(values.slaGreatResponseHourEdit);
            let slaGreatResponseMin = Number(values.slaGreatResponseMinEdit);
            let slaGreatSolutionHour = Number(values.slaGreatSolutionHourEdit);
            let slaGreatSolutionMin = Number(values.slaGreatSolutionMinEdit);

            let badResponseTime = slaBadResponseHour*60+slaBadResponseMin;
            let badSolutionTime = slaBadSolutionHour*60+slaBadSolutionMin;
            let commonResponseTime = slaCommonResponseHour*60+slaCommonResponseMin;
            let commonSolutionTime = slaCommonSolutionHour*60+slaCommonSolutionMin;
            let greatResponseTime = slaGreatResponseHour*60+slaGreatResponseMin;
            let greatSolutionTime = slaGreatSolutionHour*60+slaGreatSolutionMin;
            let list = [
                {
                    "id":this.props.detailData.commonId,
                    "serviceLevelName":"一般故障",
                    "responseTime":commonResponseTime.toString(),
                    "solutionTime":commonSolutionTime.toString()
                },{
                    "id":this.props.detailData.badId,
                    "serviceLevelName":"严重故障",
                    "responseTime":badResponseTime.toString(),
                    "solutionTime":badSolutionTime.toString()
                },{
                    "id":this.props.detailData.greatId,
                    "serviceLevelName":"重大故障",
                    "responseTime":greatResponseTime.toString(),
                    "solutionTime":greatSolutionTime.toString()
                }
            ]
            let slaName = values.slaNameEdit;
            let slaStatus = "0";
            let id = this.props.detailData.rId;

            this.editSlaData({id,slaName,slaStatus,list});
        })
        
    }
    editSlaData = ({id="",slaName = "",slaStatus = "",list = []}) => {
        $axios.post(`${config.api_server}/ops/sla/edition`,{
            "name":slaName,
            "slaStatus":slaStatus,
            "list":list,
            "id":id
        }).then((json) => {
            this.setState({ loading: false});
            if(json.data.success){
                this.success("编辑成功！");
                this.props.changeVisibleType({ visibleEdit: false });
            }else{
                this.error("编辑失败！");
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
        this.props.changeVisibleType({ visibleEdit: false });
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
            if(id == "slaBadResponseMinEdit"){
                this.props.form.setFields({
                    slaBadResponseMinEdit:{
                        value:val,
                        errors:error
                    }
                })
            }else if(id == "slaBadSolutionMinEdit"){
                this.props.form.setFields({
                    slaBadSolutionMinEdit:{
                        value:val,
                        errors:error
                    }
                })

            }else if(id == "slaCommonResponseMinEdit"){
                this.props.form.setFields({
                    slaCommonResponseMinEdit:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaCommonSolutionMinEdit"){
                this.props.form.setFields({
                    slaCommonSolutionMinEdit:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaGreatResponseMinEdit"){
                this.props.form.setFields({
                    slaGreatResponseMin:{
                        value:val,
                        errors:error
                    }
                })
                
            }else if(id == "slaGreatSolutionMinEdit"){
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
        const {loading} = this.state;
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
            <div className='editSla'>
                <Modal
                    visible={this.props.visibleEdit}
                    title="SLA编辑"
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
                            {getFieldDecorator('slaNameEdit', {
                                rules: [{
                                    required: true,
                                    message: '请填写SLA名称',
                                }],
                                initialValue:this.props.detailData.name,
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
                                                {getFieldDecorator('slaCommonResponseHourEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonResponseHour,
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonResponseMinEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonResponseMin,
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
                                                {getFieldDecorator('slaCommonSolutionHourEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonSolutionHour,
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaCommonSolutionMinEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写一般故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaCommonSolutionMin,
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
                                                {getFieldDecorator('slaBadResponseHourEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadResponseHour,
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadResponseMinEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadResponseMin,
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
                                                {getFieldDecorator('slaBadSolutionHourEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadSolutionHour,
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaBadSolutionMinEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写严重故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaBadSolutionMin,
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
                                                {getFieldDecorator('slaGreatResponseHourEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatResponseHour,
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatResponseMinEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障响应时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatResponseMin,
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
                                                {getFieldDecorator('slaGreatSolutionHourEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatSolutionHour,
                                                })(
                                                    <Input addonAfter='小时'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={11} style={{"marginLeft":"4%"}}>
                                            <FormItem>
                                                {getFieldDecorator('slaGreatSolutionMinEdit', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请填写重大故障解决时间',
                                                    }],
                                                    initialValue:this.props.detailData.slaGreatSolutionMin,
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
const editSla = Form.create()(EditSla);
export default editSla;