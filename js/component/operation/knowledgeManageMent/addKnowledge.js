import 'braft-editor/dist/braft.css'
import React,{Component} from 'react';
import BraftEditor from 'braft-editor'
import {Button,Form,Input,Select,LocaleProvider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
 import $axios from 'axios';
import config from '../../../config'

// const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
class AddKnowledge extends Component{
    constructor(props){
        super(props)
        this.state={
            addVisible: false,
            responseList: [],
            data:[]
        }
    }
    getTyoeList = () =>{
        $axios.get(`${config.api_server}/ops/knowledgetype`).then((res) =>{
            //eslint-disable-next-line
           // console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊",res)
            if(res.data){
                if(res.data.length != 0){
                    this.setState({data:res.data})
                }
                
            } 
        })
    }
    
    componentDidMount(){
        this.getTyoeList();
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
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (err) {
              return
            //console.log('Received values of form: ', values);
          }
           //eslint-disable-next-line
           //console.log("adddddddddddddd",values)
          let bValue = values;
          bValue.textContent = values.solvingSteps
          bValue.faultPhenomenon = "I wana say bye~"
          $axios({
            url:`${config.api_server}/ops/knowledge`,
            method:'post',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:bValue
        }).then((res) => {
             //eslint-disable-next-line
           //  console.log("rowrowrowrowrowrowrowrow",res.data)
            let datas = res.data.success;
            if(datas){
                this.props.getParentListData({})
                this.props.changeShowType({})
                setTimeout(() => {
                    this.setState({ addLoading: false, addVisible: false});
                }, 1000);
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
    render(){
        const editorProps = {
            height: 350,
            contentFormat: 'html',
            initialContent: '',
            onChange :this.SaveHtml,
            image:true,
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

        let option =[];
        let bData = this.state.data;
        if(bData.length > 0){
            option =  bData.map((item,k)=>{
                return(
                    <Option key = {k} value={item.id}>{item.name}</Option>
                ) 
            })     
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
                            hasFeedback
                            >
                                {getFieldDecorator('knowledgeType', {
                                    rules: [{ required: true, message: '请输知识库类型', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Select>
                                        {option}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                主题&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('theme', {
                                    rules: [{ required: true, message: '请输主题', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input placeholder = "请输主题"/>
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
                                    rules: [{ required: true, message: '请输', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <BraftEditor {...editorProps} />
                                )}
                               
                            </FormItem>
                            <FormItem
                            wrapperCol={{ span: 12,offset : 2}}
                            >
                                <Button type="primary" htmlType="submit" onClick = {this.handleSubmit} style = {{"marginRight":"20px"}}>保存</Button>
                                <Button type="primary" htmlType="submit" onClick = {this.goBack}>返回</Button>
                            </FormItem>
                        </Form>
                    </LocaleProvider>
                        {/* <div className= "addKnowledgeLz">
                            <BraftEditor {...editorProps} />
                        </div> */}
                </div>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddKnowledge);

export default WrappedRegistrationForm;