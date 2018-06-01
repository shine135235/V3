import React,{Component} from 'react';
import $axios from 'axios';
// import {History} from 'react-router-dom';
import { Form,Icon,message,Row,Col,Progress,Input,Upload,Modal,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../config';
import "./index.less"

const FormItem = Form.Item;
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
        //eslint-disable-next-line
        console.log('file.typefile.type ', file);
        const type = file.type === 'application/x-x509-ca-cert';
        if (!type) {
            message.error('文件类型不对，请上传后缀为.cer的证书文件!');
        }
          return type;
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
    // handleChange = ({ fileList }) => this.setState({ fileList })
    handleChange = (info) => {
        let fileList = info.fileList;
        //eslint-disable-next-line
        console.log('fileListfileListfileList ', fileList);
        // 3. filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
          if (file.type) {
            return file.type === 'application/x-x509-ca-cert';
          }
          return true;
        });
    
        this.setState({ fileList });
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
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const formItemLayoutCol = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
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
                        <Col span = {4}>
                            <div>
                            <Progress type="circle" percent={this.state.percent} format={() => `${this.state.remain} 天`}  style = {{"fontSize":"18px"}}/>
                            </div>
                        </Col>
                        <Col span= {18}>
                            <FormItem
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
                            <Col span = {18} key = {1}  >
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
                                    <Icon type="copy" className = "iconCopy" style={{ fontSize: 20, color: '#08c'}} onClick = {this.copyCode}/>
                            </Col>
                        </Row>
                        <Row>
                            <FormItem
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
                                    <div>
                                        <div style = {{width:"100%"}}>
                                            <Upload
                                            action="http://172.16.6.5:9090/sys/license/upload"
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
                        </Row>
                        <FormItem
                        wrapperCol={{ offset: 3}}
                        >
                            <div style = {{width:"100%"}}>此文件从开发商处获取，如有疑问请致电技术支持电话：010-85988334</div>
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
