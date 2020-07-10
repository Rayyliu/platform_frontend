import React from 'react'
import { Form, Input, message } from 'antd'
import Promptbox from '../../components/PromptBox/index'
import { debounce, encrypt } from '../../utils/util'
import { get, post } from '../../utils/ajax'
import {menu} from "../tabs";
import {connect} from "react-redux";
import {getUser, initMenus} from "../../store/actions";
import {bindActionCreators} from "redux";
import {authenticateSuccess} from '../../utils/session'



const store = connect(
    (state) => ({ user: state.user}),
    (dispatch) => bindActionCreators({ getUser,initMenus}, dispatch)
);

@store
@Form.create()
class RegisterForm extends React.Component {
    state = {
        focusItem: -1,   //当前焦点聚焦在哪一项上
        loading: false   //注册的loding
    };
    /**
     * 返回登录面板
     */
    backLogin = () => {
        this.props.form.resetFields();
        this.props.toggleShow()
    };
    onSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onRegister(values)
            }
        });
    };

    /**
     * 加载菜单
     */
    initMenus = async (token)=>{
        await this.props.initMenus(token);
    };

    /**
     * 初始化信息
     */
    init = async (user) => {
        await this.props.getUser(user);
    };

    /**
     * 注册成功后直接登陆
     */
    login =()=>{
        this.props.history.push('/Home/index')
        console.log(this.props)
    }

    /**
     * 注册函数
     */
    onRegister = async (values) => {
        //如果正在注册，则return，防止重复注册
        if (this.state.loading) {
            return
        }
        this.setState({
            loading: true
        });
        const hide = message.loading('注册中...', 0);
        //加密密码
        const ciphertext = encrypt(values.registerPassword);
        const res = await post('/user/register', {
            email: values.registerUsername,
            password: ciphertext,
        });
        console.log("res==="+JSON.stringify(res))
        this.setState({
            loading: false
        });
        hide();
        if (res.code === 0) {
            message.success('注册成功')
        }
        authenticateSuccess('Bearer '+ res.data.token)
        // await this.initMenus(menu)
        await this.initMenus(menu);
        await this.init({
            username: res.data.email,
            mobile: res.data.mobile,
            role: res.data.role
        });
        this.login();


    };

    /**
     * @description: 检查用户名是否重复，这里用了函数防抖（函数防抖的典型应用），防抖函数要注意this和事件对象
     * 也可以在input的失去焦点的时候验证，这时候不用函数防抖
     * @param {type} 事件对象
     * @return: 
     */
    checkName = debounce(async (value) => {
        if (value) {
            const res = await get(`/user/checkName?username=${value}`)
            if (res.status === 0 && res.data.num) {
                this.props.form.setFields({
                    registerUsername: {
                        value,
                        errors: [new Error('用户名已存在')]
                    }
                })
            }
        }
    });
    render() {
        const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form;
        const { focusItem } = this.state;
        return (
            <div>
                <h3 className="title">管理员注册</h3>
                <Form hideRequiredMark>
                    <Form.Item
                        help={<Promptbox info={getFieldError('registerUsername') && getFieldError('registerUsername')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 0 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 0 ? 1 : 0 }}
                        label={<span className='iconfont icon-User' style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('registerUsername', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '用户名不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '用户名至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={16}
                                className="myInput"
                                autoComplete="new-password"  //禁用表单自动填充(不管用？)
                                onFocus={() => this.setState({ focusItem: 0 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                onChange={(e) => this.checkName(e.target.value)}
                                placeholder="用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<Promptbox info={getFieldError('registerPassword') && getFieldError('registerPassword')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 1 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 1 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('registerPassword', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '密码不能为空' },
                                { pattern: '^[^ ]+$', message: '密码不能有空格' },
                                { min: 3, message: '密码至少为3位' },
                            ]

                        })(
                            <Input
                                maxLength={16}
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 1 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<Promptbox info={getFieldError('confirmPassword') && getFieldError('confirmPassword')[0]} />}
                        style={{ marginBottom: 35 }}
                        wrapperCol={{ span: 20, pull: focusItem === 2 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 2 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                { required: true, message: '请确认密码' },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && value !== getFieldValue('registerPassword')) {
                                            callback('两次输入不一致！')
                                        }
                                        callback()
                                    }
                                },
                            ]

                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 2 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="确认密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn" onClick={this.onSubmit}>注册</div>
                            <div className="registerBtn" onClick={this.backLogin}>返回登录</div>
                        </div>
                    </Form.Item>
                </Form>
                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}

export default RegisterForm