import React,{Component} from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import 'antd/dist/antd.css';
import './login.less';
import config from '../../config';

const FormItem = Form.Item;

class LoginForm extends Component {
    constructor(props){
      super(props)
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post(`${config.api_server}/sys/user/login`,{
            userName:values.userName,
            passWord:btoa(values.password)
          }).then(res =>{
            console.log(res.data)
            if(res.data.flag==='success'){
              message.success('登录成功!');
              sessionStorage.setItem('isLogin',true)
              sessionStorage.setItem("user",JSON.stringify(res.data.info)); 
              // sessionStorage.setItem("v2Token",JSON.stringify(res.data.v2.token)); 
              sessionStorage.setItem("v2IP",JSON.stringify(res.data.v2.IP)); 
              // sessionStorage.setItem("roles",JSON.stringify(res.data.v2.roles)); 
              // sessionStorage.setItem("CURRENT_ROLENAME",JSON.stringify(res.data.v2.CURRENT_ROLENAME)); 
              // sessionStorage.setItem("GROUP_ID",JSON.stringify(res.data.v2.GROUP_ID)); 
              // sessionStorage.setItem("GROUP_NAME",JSON.stringify(res.data.v2.GROUP_NAME)); 
              // sessionStorage.setItem("USERNAME",JSON.stringify(res.data.v2.USERNAME)); 
              // sessionStorage.setItem("USER_ID",JSON.stringify(res.data.v2.USER_ID)); 
              // sessionStorage.setItem("PERMISSIONS",JSON.stringify(res.data.v2.PERMISSIONS)); 
              // sessionStorage.setItem("refreshTime",JSON.stringify(res.data.v2.refreshTime)); 
              // sessionStorage.setItem("v2Title",res.data.v2title);  
              sessionStorage.setItem("v2UserName",values.userName);  
              sessionStorage.setItem("v2Pwd",btoa(values.password));  
              sessionStorage.setItem("isDeskUnit",JSON.stringify(res.data.info.totalDeskUnit));  
              sessionStorage.setItem("deskUnitId",JSON.stringify(res.data.info.unitId).replace(/"/g,""));  
              sessionStorage.setItem("isOpen",JSON.stringify(res.data.info.userRole[0].open));  
              // sessionStorage.setItem("isOpen",false);  

              //eslint-disable-next-line
              this.props.history.push('/Home');
            }else{
              message.error(res.data)
            }
          })
          
        }
      });
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
          <div className='login-wrap'>
          <div className='login-content'>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住登录</Checkbox>
            )}
            <a className="login-form-forgot" href="">忘记密码</a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </FormItem>
        </Form>
        </div>
        {this.props.children}
        </div> 
      );
    }
  }
  
  const Login = Form.create()(LoginForm);

  export default Login;