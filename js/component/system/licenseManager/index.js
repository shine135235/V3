import React,{Component} from 'react';
import $axios from 'axios';
// import {History} from 'react-router-dom';
import { Form,Icon,message,Row,Col,Progress,Input,Upload,Modal,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../config';
import "./index.less"

const FormItem = Form.Item;
const outLogin=() =>{
    console.log(JSON.parse(sessionStorage.getItem('user')))
    $axios.post(`${config.api_server}/sys/user/logout`,{
        id:JSON.parse(sessionStorage.getItem('user')).id,
        loginId:JSON.parse(sessionStorage.getItem('user')).loginId
    }).then(res =>{
        if(res.data.flag==='success'){
            sessionStorage.clear();
            location.href='/';
        }
    })
}
class SystemConfiguration extends Component{
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        
        startTime:"",
        endTime:"",
        remain:"",
        mac:"",
        percent:0

    };

    getInitalData = () =>{
       $axios.get(`${config.api_server}/sys/license`).then((res) =>{
            let pent = Number(res.data.remain) / Number(res.data.totaldays)*100 ;
           if(res.data){
               this.setState({
                  startTime:res.data.from,
                  endTime:res.data.to,
                  remain:res.data.remain,
                  mac:res.data.mac,
                  percent:pent
               })
           }
       })
    }
    componentDidMount(){
        this.getInitalData();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
              //eslint-disable-next-line
            console.log('Received values of form: ', values);
          }
        });
    }

    copyCode = () =>{
        var Url2=document.getElementById("mac");
        if(Url2.value != ""){
            Url2.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            message.success("复制成功")
        }else{
            message.error("复制失败")
        }
    }
    beforeUpload = (file) => {
         const tName = file.name;
        if(tName === "license.lic"){
            return true;
        }else{
            message.error('文件名不对，请重新上传!');
            return false;
        }
    }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
    handleChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.filter((file) => {
            if (file.response) {
                if(file.response.flag){
                    message.success('文件上传成功!,请重新登录');
                    setTimeout(() =>{
                        outLogin()
                    },2000)
                    return true
                }else{
                    message.error(file.response.message);
                    return false
                }     
              }
              return true;    
        });
        if(info.file.name === "license.lic"){
            this.setState({ fileList });
            return true;
        }else{
            this.setState({ fileList:[] });
            //message.error('文件名不对，请重新上传!');
            return false;
        }
      }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {  fileList,previewVisible } = this.state;
       
        let datdas = "";
        if(this.state.fileList.length != 0){
             //eslint-disable-next-line
       // console.log('fileListfileListfileListfileList ',(this.state.fileList)[0].name );
            datdas = (this.state.fileList)[0].name
        }
        
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4},
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const formItemLayoutCol = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4  },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
        };
          const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传文件</div>
            </div>
          );
        return (
            <div className='license'>
                <div className='license_Content'>
                <div className='license_Title' >有效期到期情况</div>
                <LocaleProvider locale={zhCN}>
                <Form >
                    <Row style = {{"marginBottom":"15px"}}>
                        <Col span = {3} style = {{"width":"160px","height":"160px","marginRight":"16px"}}>
                            <div style= {{"heigh":"160px","fontSize":"14px"}}>
                            <Progress type="circle" strokeWidth = {8} width = {150}  percent={this.state.percent} format={() => `剩余:${this.state.remain}天`}  style = {{"fontSize":"14px"}}/>
                            </div>
                        </Col>
                        <Col span= {18} style = {{"marginTop":"3%"}}>
                            <FormItem
                            style = {{"marginBottom":"0px"}}
                                { ...formItemLayoutCol}
                                label={(
                                    <span>
                                    开始日期&nbsp;
                                    </span>
                                )}
                            >   
                                {getFieldDecorator("area",{
                                    initialValue:"",
                                    rules: [{ required: false, message: '', whitespace: true }],
                                })(
                                   <span>{this.state.startTime}</span>
                                )}

                            </FormItem>
                            <FormItem
                                { ...formItemLayoutCol}
                                label={(
                                    <span>
                                    结束日期&nbsp;
                                    </span>
                                )}
                            >   
                                {getFieldDecorator("area",{
                                    initialValue:"",
                                    rules: [{ required: false, message: '', whitespace: true }],
                                })(
                                    <span>{this.state.endTime}</span>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                            <Col span = {10} key = {1}  >
                                <FormItem
                                {...formItemLayoutWithOutLabel}
                                label={(
                                    <span>
                                    序列号&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('mac', {
                                        initialValue:this.state.mac,
                                        rules: [{ required: false, message: '请输名称', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输序列号" onBlur = {this.addOnBlur} readOnly = {true}/>
                                    )}{
                                        
                                    }
                                </FormItem>
                            </Col>
                            <Col span = {2} key = {11} style = {{"paddingTop":"4px","marginLeft":"2px"}}>
                                    <Icon type="copy" className = "iconCopy" style={{ fontSize: 20, color: '#08c'}} onClick = {this.copyCode} title = "复制序列号"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {10} key = {1}  >
                                <FormItem
                                style = {{"marginBottom":"0px"}}
                                    { ...formItemLayout}
                                    label={(
                                        <span>
                                        更新license&nbsp;
                                        </span>
                                    )}
                                >   
                                    {getFieldDecorator("updateFile",{
                                        initialValue:"",
                                        rules: [{ required: false, message: '', whitespace: true }],
                                    })(
                                        <div style = {{"paddingLeft":"0"}}>
                                            <div style = {{width:"100%"}}>
                                                <Upload
                                                action={`${config.api_server}/sys/license/upload`}
                                                listType="picture-card"
                                                fileList={fileList}
                                                onPreview={this.handlePreview}
                                                beforeUpload={this.beforeUpload}
                                                onChange={this.handleChange}
                                                >
                                                {fileList.length >= 1 ? null : uploadButton}
                                                </Upload>
                                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <span>{datdas}</span>
                                                </Modal>
                                            </div>
                                            
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                        // wrapperCol={{ offset: 2}}
                        >
                            <Col span = {16} key = {1}  >
                                <div style = {{width:"100%","paddingLeft":"10.3%"}}>此文件从开发商处获取，如有疑问请致电技术支持电话：010-85988334</div>
                            </Col>
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </div>
            </div>
        )
    }
}
const SystemConfigurationForm = Form.create()(SystemConfiguration);
export default SystemConfigurationForm;
