import 'braft-editor/dist/braft.css'
import React,{Component} from 'react';
import BraftEditor from 'braft-editor'
import {Button,Form,Input,LocaleProvider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import AuditDisc from './auditDisc';
 import $axios from 'axios';
import config from '../../../config'

const { TextArea } = Input;
const FormItem = Form.Item;
class AuditKnowledge extends Component{
    constructor(props){
        super(props)
        this.state={
            addVisible: false,
            responseList: [],
            data:[],
            resnShow:"none",
            unPassCode:0
        }
    }
  
    
    componentDidMount(){
        // this.getTyoeList();
    }
    receiveRaw = () => {
     //   console.log("recieved Raw content", content);
    }
    AddNews = () => {
        this.setState({
           addVisible: true,
        });
    } 
    addHandleCancel = () =>{
        this.setState({
            addVisible: false,
         });
    }
    SaveHtml=(content) =>{
        console.log(content)
    }
    onChange=(info) =>{
       console.log(info)
       this.setState({
           responseList:info
       })
    }
    addHandleOk = () =>{
    }
    goBack = () =>{
        this.props.changeShowType({})
    }
    handleChange = () =>{
     //   console.log("valvalval",val)
    }
    onInsert = () =>{
      //  console.log("sssssssssssssssss",val)
    }
    upImg=(param) =>{
        // console.log(param)
        //  $axios.post('http://172.16.6.5:9090/upload/resource/commonupload',{
        //      file:param.file
        //  })
        //  .then(response => {
        //    if (response.data.code === 0) {
        //          console.log(response.data.data);
        //    }
        //  })
        const serverURL = `${config.api_server}/upload/resource/commonupload`
        const xhr = new XMLHttpRequest
        const fd = new FormData()

        const successFn = () => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            console.log(xhr)
            param.success({
               url: `${config.api_server}${JSON.parse(xhr.responseText).path.replace(/\\/g,'/')}`,
            })
        }

        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        }

        const errorFn = () => {
            // 上传发生错误时调用param.error
            param.error({
            msg: 'unable to upload.'
            })
        }

        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)

        fd.append('file', param.file)
        fd.append('type','knowledge')
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
    }
    success = () => {
        message.success("操作成功")
    };
    error = () => {
        message.error("操作失败")
    }
    handleSubmit = (type,e) => {
        //  //eslint-disable-next-line
        //  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",value)
        e.preventDefault();
        this.props.form.validateFields((err,value) => {
          if (err) {
              return
          }
          
          let bValue = {};
        if(type == "pass"){
            this.setState({modalShow:true})
            bValue.code = "3"
            bValue.desc = ""
        }else if(type == "unPass"){
            bValue.code = "1"
            if(value.desc){
                bValue.desc = value.desc
            }else{
                bValue.desc = ""
            }
        }
        let ids = []
        ids.push(this.props.detailData.id)
        bValue.knowledgeIds = ids;
        //eslint-disable-next-line
          // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",bValue)
            $axios({
            url:`${config.api_server}/ops/knowledge/review`,
            method:'post',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:bValue
            }).then((res) => {
                //eslint-disable-next-line
             //console.log("rowrowrowrowrowrowrowrow",res.data)
                let datas = res.data.success;
                if(datas){
                    this.props.getParentListData({})
                    this.props.changeShowType({})
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    setTimeout(() => {
                        this.error();
                    }, 3000);
                }
            })
        });
      }
      unPass = () =>{
        this.setState({resnShow:"block",unPassCode:"1"})
      }

    render(){
        //eslint-disable-next-line
       // console.log("sssssssssssssssssssssssssssssssssssss",this.props.detailData.textContent)
        let initalData = this.props.detailData.textContent;
       let outhtml=initalData.replace(/&lt;/g,"<");
          outhtml=outhtml.replace(/&gt;/g,">");
          outhtml=outhtml.replace(/&quot;/,"\"");
          let cont = []
          cont.push(outhtml)
          //eslint-disable-next-line
        // console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvv",outhtml)
        const editorProps = {
            height: 0,
            overflowY:"auto",
            controls:[],
            contentFormat: 'html',
            initialContent: outhtml,
            onChange :this.SaveHtml,
            image:true,
            disabled:true,
            onHTMLChange:this.handleChange,
            // onRawChange: this.handleRawChange,
            media:{
                image:true,
                uploadFn:this.upImg,
                onInsert:this.onInsert
            }
          }
         
          const { getFieldDecorator } = this.props.form;
        // let option =[];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        }; 
        let UnBtn = []
        if(this.state.unPassCode == "0"){
            UnBtn.push( <Button key = "auditPase" type="primary" htmlType="submit" onClick = {this.handleSubmit.bind(this,"pass")} style = {{"marginRight":"20px"}}>审核通过</Button>,
            <Button key="auditUnPase" type="primary"  onClick={this.unPass} style = {{"marginRight":"20px"}}>审核不通过</Button>) 
        }else if(this.state.unPassCode == "1"){
            UnBtn.push(<Button key="auditUnPase" type="primary"  onClick = {this.handleSubmit.bind(this,"unPass")} style = {{"marginRight":"20px"}}>确认审核不通过</Button>) 
        }
        return (
                <div className='data-class-overKnow'>
                 <LocaleProvider locale = {zhCN}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                知识库类型&nbsp;
                                </span>
                            )}
                            >
                                {getFieldDecorator('knowledgeType', {
                                     initialValue:this.props.detailData.knowledgeTypeName,
                                    rules: [{ required: false, message: '请输知识库类型', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                   <Input  readOnly = {true}/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                主题&nbsp;
                                </span>
                            )}
                            >
                                {getFieldDecorator('theme', {
                                     initialValue:this.props.detailData.theme,
                                    rules: [{ required: false, message: '请输主题', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input placeholder = "请输主题" readOnly = {true}/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                解决步骤&nbsp;
                                </span>
                            )}
                            >
                                {getFieldDecorator('solvingSteps', {
                                    rules: [{ required: false, whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <div  className = "auditBra" style = {{"overflowY":"auto"}}>
                                    <BraftEditor {...editorProps}  style = {{"overflowY":"auto"}}/>
                                    </div>
                                )}
                               
                            </FormItem>
                            <FormItem
                             style = {{"display":this.state.resnShow}}
                            {...formItemLayout}
                            label={(
                                <span>
                                审核不通过原因&nbsp;
                                </span>
                            )}
                            >
                                {getFieldDecorator('desc', {
                                    rules: [{ required: false, whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <TextArea  rows = {4} key = "0"/>
                                )}
                               
                            </FormItem>
                            <FormItem
                            wrapperCol={{ span: 12,offset : 2}}
                            >   
                                <div>
                                  {UnBtn}    
                                    <Button key = "back" onClick = {this.goBack}>返回</Button>
                                </div>
                            </FormItem>
                        </Form>
                    </LocaleProvider>
                        {/* <div className= "addKnowledgeLz">
                            <BraftEditor {...editorProps} />
                        </div> */}
                        {/* <AuditDisc modalShow = {this.state.modalShow}/> */}
                </div>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AuditKnowledge);

export default WrappedRegistrationForm;