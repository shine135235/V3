import React,{Component} from 'react'
import { Form, Rate,Input,Button,message,Row,Card} from 'antd';
import axios from 'axios';
import config from '../../../../../config';


const FormItem = Form.Item;
const { TextArea } = Input;

class EvalOrderForm extends Component{
    state={
        totalNum:0,
        rageLoading:false,
        resData:null,
        disabled:false,
        firstDisable:false,
        secondShow:false,
        secondDisable:false,
        thirdShow:false,
        thirdDisable:false
    }
    componentWillMount(){
        axios.get(`${config.api_server}/ops/workorder/checkevaluation/${this.props.rowData}`).then(res =>{
            this.setState({
                resData:res.data.data,
                totalNum:res.data.data.score
            })
                switch(res.data.data.evaluation.length){
                    case 1:
                    if(this.props.only==0){
                        this.setState({
                            firstDisable:true,
                            secondShow:true
                        })
                    }else{
                        this.setState({
                            firstDisable:true,
                            secondShow:false
                        })
                    }
                    break;
                    case 2:
                    if(this.props.only==0 || this.props.only==3){
                        this.setState({
                            firstDisable:true,
                            secondShow:true,
                            secondDisable:true,
                            thirdShow:true
                        })
                    }else{
                        this.setState({
                            firstDisable:true,
                            secondShow:true,
                            secondDisable:true,
                            thirdShow:false
                        })
                    }
                    break;
                    case 3:
                        this.setState({
                            firstDisable:true,
                            secondShow:true,
                            secondDisable:true,
                            thirdShow:true,
                            thirdDisable:true,
                            disabled:true
                        })
                    break;
                    default:
                    if(this.props.only==0){
                        this.setState({
                            firstDisable:false,
                            secondShow:false
                        })
                    }else{
                        this.setState({
                            firstDisable:true,
                            disabled:true,
                            secondShow:false
                        })
                    }
                    break;
                }
            
        })
    }
    componentDidMount(){
        if(this.props.only==1){
            this.setState({
                disabled:true
            })
        }
    }
    goBack = () => { 
        this.props.changeShowType('list')
    }
    submitFunc=() =>{
        this.props.form.validateFields((err,values) =>{
            if(!err){
                this.setState({
                    rageLoading:true
                })
                let timeToService=0,technologicalLevel=0,failureDescription=0,serviceAttribute=0,serviceSuggestions='';
                if(this.state.resData!==null){
                    switch(this.state.resData.evaluation.length){
                        case 0:
                        timeToService=values.time;
                        technologicalLevel=values.quality;
                        failureDescription=values.norm;
                        serviceAttribute=values.attitude;
                        serviceSuggestions=values.desc
                        break;
                        case 1:
                        timeToService=values.zptime;
                        technologicalLevel=values.zpquality;
                        failureDescription=values.zpnorm;
                        serviceAttribute=values.zpattitude;
                        serviceSuggestions=values.zpdesc
                        break;
                        case 2:
                        timeToService=values.zphtime;
                        technologicalLevel=values.zphquality;
                        failureDescription=values.zphnorm;
                        serviceAttribute=values.zphattitude;
                        serviceSuggestions=values.zphdesc
                        break;
                    }
                    if(timeToService!==0&&technologicalLevel!==0&&failureDescription!==0&&serviceAttribute!==0){
                        axios.post(`${config.api_server}/ops/workorder/evaluation`,{
                            workOrderId:this.props.rowData,
                            timeToService:timeToService,
                            technologicalLevel:technologicalLevel,
                            failureDescription:failureDescription,
                            serviceAttribute:serviceAttribute,
                            serviceSuggestions:serviceSuggestions,
                            starCount:timeToService+technologicalLevel+failureDescription+serviceAttribute
                        }).then(res =>{
                            if(res.data.success){
                                message.success('感谢您的评价!');
                                this.props.changeShowType('list');
                                this.props.refreshData(1,true);
                                this.setState({
                                    rageLoading:false
                                })
                            }else{
                                message.error('评价失败,请重试!');
                                this.setState({
                                    rageLoading:false
                                })
                            }
                            
                        })
                    }else{
                        message.error('请对本次服务作出评价!');
                        this.setState({
                            rageLoading:false
                        })
                    }
                }
            }
        })
    }
    render(){
        
        const formItemLayout = {
            labelCol: {
              xs: { span: 2 },
              sm: { span: 2 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 10 },
              sm: { span: 10 },
            // span:20
            },
        };
        const {getFieldDecorator} = this.props.form;
        let timeToService=0,technologicalLevel=0,failureDescription=0,serviceAttribute=0,serviceSuggestions='';
        let zptimeToService=0,zptechnologicalLevel=0,zpfailureDescription=0,zpserviceAttribute=0,zpserviceSuggestions='';
        let zphtimeToService=0,zphtechnologicalLevel=0,zphfailureDescription=0,zphserviceAttribute=0,zphserviceSuggestions='';
        if(this.state.resData!=null){
            if(this.state.resData.evaluation){
                switch(this.state.resData.evaluation.length){
                    case 1:
                    timeToService=this.state.resData.evaluation[0].timeToService;
                    technologicalLevel=this.state.resData.evaluation[0].technologicalLevel;
                    failureDescription=this.state.resData.evaluation[0].failureDescription;
                    serviceAttribute=this.state.resData.evaluation[0].serviceAttribute;
                    serviceSuggestions=this.state.resData.evaluation[0].serviceSuggestions;
                    break;
                    case 2:
                    timeToService=this.state.resData.evaluation[0].timeToService;
                    technologicalLevel=this.state.resData.evaluation[0].technologicalLevel;
                    failureDescription=this.state.resData.evaluation[0].failureDescription;
                    serviceAttribute=this.state.resData.evaluation[0].serviceAttribute;
                    serviceSuggestions=this.state.resData.evaluation[0].serviceSuggestions;
                    zptimeToService=this.state.resData.evaluation[1].timeToService;
                    zptechnologicalLevel=this.state.resData.evaluation[1].technologicalLevel;
                    zpfailureDescription=this.state.resData.evaluation[1].failureDescription;
                    zpserviceAttribute=this.state.resData.evaluation[1].serviceAttribute;
                    zpserviceSuggestions=this.state.resData.evaluation[1].serviceSuggestions;
                    break;
                    case 3:
                    timeToService=this.state.resData.evaluation[0].timeToService;
                    technologicalLevel=this.state.resData.evaluation[0].technologicalLevel;
                    failureDescription=this.state.resData.evaluation[0].failureDescription;
                    serviceAttribute=this.state.resData.evaluation[0].serviceAttribute;
                    serviceSuggestions=this.state.resData.evaluation[0].serviceSuggestions;
                    zptimeToService=this.state.resData.evaluation[1].timeToService;
                    zptechnologicalLevel=this.state.resData.evaluation[1].technologicalLevel;
                    zpfailureDescription=this.state.resData.evaluation[1].failureDescription;
                    zpserviceAttribute=this.state.resData.evaluation[1].serviceAttribute;
                    zpserviceSuggestions=this.state.resData.evaluation[1].serviceSuggestions;
                    zphtimeToService=this.state.resData.evaluation[2].timeToService;
                    zphtechnologicalLevel=this.state.resData.evaluation[2].technologicalLevel;
                    zphfailureDescription=this.state.resData.evaluation[2].failureDescription;
                    zphserviceAttribute=this.state.resData.evaluation[2].serviceAttribute;
                    zphserviceSuggestions=this.state.resData.evaluation[2].serviceSuggestions;
                    break;
                    default:
                    break;
                }
            }
        }
        return(
            <Form>
                    <FormItem {...formItemLayout} label='综合得分' className='non-bottom'>
                    {this.state.totalNum}
                    </FormItem>
                    <Row style={{marginBottom:'20px'}}>
                    <Card title="客户评分" bordered={true}>
                    <FormItem {...formItemLayout} label='服务时效' className='non-bottom'>
                            {getFieldDecorator('time', {
                                        rules: [{
                                            required: true,
                                            message: '请对服务时效进行评价',
                                        }],
                                        initialValue:timeToService
                                    })(
                                        <Rate disabled={this.state.firstDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='技术水平' className='non-bottom'>
                            {getFieldDecorator('quality', {
                                        rules: [{
                                            required: true,
                                            message: '请对技术水平进行评价',
                                        }],
                                        initialValue:technologicalLevel
                                    })(
                                    <Rate  disabled={this.state.firstDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='流程规范' className='non-bottom'>
                            {getFieldDecorator('norm', {
                                        rules: [{
                                            required: true,
                                            message: '请对流程规范进行评价',
                                        }],
                                        initialValue:failureDescription
                                    })(
                                    <Rate disabled={this.state.firstDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='服务态度' className='non-bottom'>
                            {getFieldDecorator('attitude', {
                                        rules: [{
                                            required: true,
                                            message: '请对服务态度进行评价',
                                        }],
                                        initialValue:serviceAttribute
                                    })(
                                    <Rate disabled={this.state.firstDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='客户评价' className='non-bottom'>
                            {getFieldDecorator('desc', {
                                rules: [{
                                    required: true,
                                    message: '请输入您的评价',
                                }],
                                initialValue:serviceSuggestions
                            })(
                                    <TextArea disabled={this.state.firstDisable} />
                            )}
                        </FormItem>
                    </Card>
                    </Row>
                        <Row style={{display:`${this.state.secondShow?'block':'none'}`,marginBottom:'20px'}}>
                        <Card title="追评" bordered={true}>
                        <FormItem {...formItemLayout} label='服务时效' className='non-bottom'>
                            {getFieldDecorator('zptime', {
                                        rules: [{
                                            required: this.state.secondDisable,
                                            message: '请对服务时效进行评价',
                                        }],
                                        initialValue:zptimeToService
                                    })(
                                        <Rate disabled={this.state.secondDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='技术水平' className='non-bottom'>
                            {getFieldDecorator('zpquality', {
                                        rules: [{
                                            required: this.state.secondDisable,
                                            message: '请对技术水平进行评价',
                                        }],
                                        initialValue:zptechnologicalLevel
                                    })(
                                    <Rate disabled={this.state.secondDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='流程规范' className='non-bottom'>
                            {getFieldDecorator('zpnorm', {
                                        rules: [{
                                            required: this.state.secondDisable,
                                            message: '请对流程规范进行评价',
                                        }],
                                        initialValue:zpfailureDescription
                                    })(
                                    <Rate disabled={this.state.secondDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='服务态度' className='non-bottom'>
                            {getFieldDecorator('zpattitude', {
                                        rules: [{
                                            required: this.state.secondDisable,
                                            message: '请对服务态度进行评价',
                                        }],
                                        initialValue:zpserviceAttribute
                                    })(
                                    <Rate disabled={this.state.secondDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='客户评价' className='non-bottom'>
                            {getFieldDecorator('zpdesc', {
                                initialValue:zpserviceSuggestions
                            })(
                                    <TextArea disabled={this.state.secondDisable} />
                            )}
                        </FormItem>
                        </Card>
                        </Row>
                        <Row style={{display:`${this.state.thirdShow?'block':'none'}`,marginBottom:'20px'}}>
                        <Card title="追评" bordered={true}>
                        <FormItem {...formItemLayout} label='服务时效' className='non-bottom'>
                            {getFieldDecorator('zphtime', {
                                        rules: [{
                                            required: this.state.thirdDisable,
                                            message: '请对服务时效进行评价',
                                        }],
                                        initialValue:zphtimeToService
                                    })(
                                        <Rate disabled={this.state.thirdDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='技术水平' className='non-bottom'>
                            {getFieldDecorator('zphquality', {
                                        rules: [{
                                            required: this.state.thirdDisable,
                                            message: '请对技术水平进行评价',
                                        }],
                                        initialValue:zphtechnologicalLevel
                                    })(
                                    <Rate disabled={this.state.thirdDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='流程规范' className='non-bottom'>
                            {getFieldDecorator('zphnorm', {
                                        rules: [{
                                            required: this.state.thirdDisable,
                                            message: '请对流程规范进行评价',
                                        }],
                                        initialValue:zphfailureDescription
                                    })(
                                    <Rate disabled={this.state.thirdDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='服务态度' className='non-bottom'>
                            {getFieldDecorator('zphattitude', {
                                        rules: [{
                                            required: this.state.thirdDisable,
                                            message: '请对服务态度进行评价',
                                        }],
                                        initialValue:zphserviceAttribute
                                    })(
                                    <Rate disabled={this.state.thirdDisable} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='客户评价' className='non-bottom'>
                            {getFieldDecorator('zphdesc', {
                                initialValue:zphserviceSuggestions
                            })(
                                    <TextArea disabled={this.state.thirdDisable} />
                            )}
                        </FormItem>
                        </Card>
                        </Row>
                        <FormItem
                        wrapperCol={{ span:4, offset: 2 }}
                        >
                            <Button type="primary" htmlType="submit" loading={this.state.rageLoading} onClick={this.submitFunc} style={{display:this.state.disabled?'none':'inline-block'}}>提交</Button>
                            <Button onClick={this.goBack} style={{"marginLeft":"1%"}}>返回</Button>
                        </FormItem>
                    </Form>
        )
    }
}


const EvalWorkOrder = Form.create()(EvalOrderForm);
export default EvalWorkOrder;