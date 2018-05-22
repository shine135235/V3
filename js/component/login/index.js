import React,{Component} from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import 'antd/dist/antd.css';
import './login.less';

const FormItem = Form.Item;

class LoginForm extends Component {
    constructor(props){
      super(props)
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post(`http://172.16.6.5:9090/sys/user/login`,{
            userName:values.userName,
            passWord:btoa(values.password)
          }).then(res =>{
            if(res.data.flag==='success'){
              message.success('登录成功!');
              sessionStorage.setItem('isLogin',true)
              sessionStorage.setItem("user",JSON.stringify(res.data.info)); 
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