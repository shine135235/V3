import React , {Component} from "react";
import { Form, Input, Icon , Button, InputNumber, Upload, Modal ,Radio,message} from 'antd';
import $axios from "axios";
import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class AddAppMall extends Component {
    state = {
        confirmDirty: false,
        previewVisibleMain: false,
        previewVisible: false,
        previewImageMain: '',
        previewImage: '',
        fileListMain: [],
        fileList: [],
        Value:"true",
      };
    handleCancelMain = () => {
        this.setState({ previewVisibleMain: false })
    }
    handleCancel = () => {
        this.setState({ previewVisible: false })
    }
    
    handlePreviewMain = (file) => {
        //eslint-disable-next-line
        console.log('file',file);
        this.setState({
            previewImageMain: file.url || file.thumbUrl,
            previewVisibleMain: true,
        });
    }
    
    handlePreview = (file) => {
        //eslint-disable-next-line
        console.log('file',file);
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    
    handleChangeMain = ({ fileList }) => {
        //eslint-disable-next-line
        console.log('fileListMain',fileList);
        this.setState({ fileListMain:fileList });
    }
    handleChange = ({ fileList }) => {
        //eslint-disable-next-line
        console.log('fileList',fileList);
        this.setState({ fileList });
    }
    success = (msg) => {
        message.success(msg);
    };
    error = (msg) => {
        message.error(msg);
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return;
            }
            let resource = [];
            let resourcePath = this.state.fileListMain;
            if(resourcePath.length == 0){
                this.props.form.setFields({
                    merchandiseMainPic:{
                        error:"请上传商品主图！",
                    }
                })
                return;
            }else{
                for (let i = 0;i<resourcePath.length;i++){
                    if(resourcePath[i].response !== undefined){
                        resource.push(resourcePath[i].response);
                    }
                }
            }
            resource = resource.join(",");
            let detailresource = [];
            let detailresourcePath = this.state.fileList;
            if(detailresourcePath.length == 0){
                this.props.form.setFields({
                    merchandisePic:{
                        error:"请上传商品图！",
                    }
                })
                return;
            }
            for (let i = 0;i<detailresourcePath.length;i++){
                if(detailresourcePath[i].response !== undefined){
                    detailresource.push(detailresourcePath[i].response);
                }
            }
            detailresource = detailresource.join(",");
            let name = values.merchandiseName;
            let count = values.merchandiseNum;
            let vcoin = values.merchandiseCoin;
            let status = values.merchandiseIsPublish;
            this.addAppMallData({name,count,vcoin,resource,detailresource,status});
        });
    }
    addAppMallData = ({name = '',count = '',vcoin = '',resource = '',detailresource = '',status = ''}) => {
        $axios.post("http://172.16.6.9:9090/app/goods",{
                "name": name,
                "count":count,
                "vcoin":vcoin,
                "resource":resource,
                "detailresource":detailresource,
                "status":status,
        }).then((json) => {
            if(json.data.success == true){
                this.success('添加成功');
                setTimeout(() => {
                    this.props.changeShowPage({pageNumber:1})
                    this.props.getListData({});
                },1000);
            }else{
                this.error('添加失败');
            }
        })
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    beforeUploadMain=(file) => {
        let fileSize = file.size/1024;
        if(fileSize > 200){
            this.error("图片过大，请删除重新上传！");
            return false;
        }
    }
    beforeUpload=(file) => {
        let fileSize = file.size/1024;
        if(fileSize > 200){
            this.error("图片过大，请删除重新上传！");
            return false;
        }
    }
    goBack = () =>{
        this.props.changeShowPage({pageType:"list"})
    }
    render(){
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
        };
        const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 14,
            offset: 6,
            },
        },
        };
        const { previewVisibleMain,previewVisible, previewImageMain, previewImage, fileListMain, fileList } = this.state;
        const uploadButtonMain = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className='addAppMall'>
                <div className='addAppMall_Title'>新增商品</div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                            label="商品名称"
                            hasFeedback
                        >
                        {getFieldDecorator('merchandiseName', {
                            rules: [ 
                                {
                                    required: true, message: '请输入商品名称!',
                                },
                                {
                                    max:30,message:"超出最大字符长度30！"
                                }
                            ],
                        })(
                            <Input  style={{"width":"40%"}}/>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                        label="商品数量"
                        hasFeedback
                    >
                        {getFieldDecorator('merchandiseNum', {
                            rules: [
                                {
                                    required: true, message: 'Please input your password!',
                                }
                            ],
                            initialValue: 1,
                        })(
                            <InputNumber min={1} max={9999999999} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="兑换所需维币"
                        hasFeedback
                    >
                        {getFieldDecorator('merchandiseCoin', {
                            rules: [
                                {
                                    required: true, message: 'Please confirm your password!',
                                }
                            ],
                            initialValue: 1200,
                        })(
                            <InputNumber min={1} max={99999999999} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传商品主图'
                        hasFeedback
                    >
                        {getFieldDecorator('merchandiseMainPic', {
                            rules: [{ required: true, message: '请上传商品主图!'}],
                        })(
                            <div>
                                <Upload
                                    action="http://172.16.6.9:9090/app/goods/uploadimg"
                                    listType="picture-card"
                                    fileList={fileListMain}
                                    onPreview={this.handlePreviewMain}
                                    onChange={this.handleChangeMain}
                                    beforeUpload={this.beforeUploadMain}
                                >
                                {fileListMain.length >= 4 ? null : uploadButtonMain}
                                </Upload>
                                <Modal visible={previewVisibleMain} footer={null} onCancel={this.handleCancelMain}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImageMain} />
                                </Modal>
                                
                                <div>图片分辨率建议：750*750，图片大小不超过200k</div>  
                            </div>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传商品图"
                    >
                        {getFieldDecorator('merchandisePic', {
                            rules: [{ required: true, message: '请上传商品图!' }],
                        })(
                            <div>
                                <Upload
                                    action="http://172.16.6.9:9090/app/goods/uploadimg"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    beforeUpload={this.beforeUpload}
                                >
                                {fileList.length >= 4 ? null : uploadButton}
                                </Upload>
                                <div>图片分辨率建议：750*450，图片大小不超过200k</div>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>  
                            </div>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                        label="是否发布"
                    >
                        {getFieldDecorator('merchandiseIsPublish', {
                            rules: [{ required: true, message: '请选择是否发布!' }],
                            initialValue: "true",
                        })(
                            <RadioGroup>
                                <Radio value="true">发布</Radio>
                                <Radio value="false">暂不发布</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button  onClick = {this.goBack} style={{"marginLeft":"6%"}}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const addAppMall = Form.create()(AddAppMall);
export default addAppMall;
