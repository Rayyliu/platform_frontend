import React from 'react'
import {Form, Input, Row, Col,message} from 'antd'
import { randomNum } from '../../utils/util'
import Promptbox from '../../components/PromptBox/index'
import { authenticateSuccess } from '../../utils/session'
import { withRouter } from 'react-router-dom'
import { post, get } from '../../utils/ajax'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getUser, initMenus} from "../../store/actions";
import { menu } from '../tabs'


const store = connect(
    (state) => ({ user: state.user}),
    (dispatch) => bindActionCreators({ getUser,initMenus}, dispatch)
);

@store
@withRouter @Form.create()
class LoginForm extends React.Component {
    state = {
        focusItem: -1,   //当前焦点聚焦在哪一项上
        code: ''  //验证码
    };
    componentDidMount() {
        this._createCode()
    }
    onSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onLogin(values)
            }
        });
    };
    /**
     * 转换面板为注册面板
     */
    goRegister = () => {
        this.props.form.resetFields();
        this.props.toggleShow();
        this._createCode()
    };
    /**
     * 表单验证成功后的登录函数
     */
    onLogin = async (values) => {
        // 表单登录时，若验证码长度小于4则不会验证，所以我们这里要手动验证一次
        if (this.state.code.toUpperCase() !== values.captcha.toUpperCase()) {
            this.props.form.setFields({
                captcha: {
                    value: values.captcha,
                    errors: [new Error('验证码错误')]
                }
            });
            return
        }
        console.log("values==="+JSON.stringify(values))
        // const res = await get(`/user/findByUsername?userName=${values.username}`);
        // if (res.code !== 0) {
        //     this.props.form.setFields({
        //         username: {
        //             value: values.username,
        //             errors: [new Error('用户名不存在')]
        //         }
        //     });
        //     console.log("res=="+JSON.stringify(res))
        //     this._createCode();
        //     this.props.form.resetFields('captcha');
        //     return
        // }
        const res2 = await post('/login', {
            email: values.username,
            password: values.password
        });
        console.log("res2==="+JSON.stringify(res2))
        if (res2.code !== 0) {
            this.props.form.setFields({
                username:{
                    value: '',
                    errors: [new Error(res2.message)]
                }
            });
            this._createCode();
            this.props.form.resetFields('captcha');
            return
        }
        // localStorage.setItem('username', values.username);
        // await authenticateSuccess('Bearer '+res2.data.token);
        await authenticateSuccess('Bearer '+res2.data);
        console.log("返回session=="+'Bearer '+res2.data)
        // await this.initMenus(res2.data.token);
        this.initMenus(menu);
        // await this.init(res2.data.token);
        this.init({
            email: values.username,
            user_id:res2.data.userid,
        });

        message.loading('加载中...', 1, ()=>this.props.history.push('/'));
        // this.props.history.push('/');
        console.log("华丽的分割线")
    };
    initMenus = async (token)=>{
        console.log("this.props==="+JSON.stringify(this.props))
        console.log("token==="+JSON.stringify(token))
        await this.props.initMenus(token);
    };
    /**
     * 初始化信息
     */
    init = async (token) => {
        await this.props.getUser(token);
    };
    /**
     * 生成验证码
     */
    _createCode = () => {
        const ctx = this.canvas.getContext('2d');
        const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        let code = '';
        ctx.clearRect(0, 0, 80, 40);
        for (let i = 0; i < 4; i++) {
            const char = chars[randomNum(0, 57)];
            code += char;
            ctx.font = randomNum(20, 25) + 'px SimHei';//设置字体随机大小
            ctx.fillStyle = '#D3D7F7';
            ctx.textBaseline = 'middle';
            ctx.shadowOffsetX = randomNum(-3, 3);
            ctx.shadowOffsetY = randomNum(-3, 3);
            ctx.shadowBlur = randomNum(-3, 3);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            let x = 80 / 5 * (i + 1);
            let y = 40 / 2;
            let deg = randomNum(-25, 25);
            /**设置旋转角度和坐标原点**/
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);
            ctx.fillText(char, 0, 0);
            /**恢复旋转角度和坐标原点**/
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y)
        }
        this.setState({
            code
        })
    };
    changeCaptcha = () => {
        this.props.form.resetFields(['captcha']);
        this._createCode()
    };

    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
        const { focusItem, code } = this.state;
        return (
            <div>
                <h3 className="title">管理员登录</h3>
                <Form hideRequiredMark>
                    <Form.Item
                        help={<Promptbox info={getFieldError('username') && getFieldError('username')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 0 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 0 ? 1 : 0 }}
                        label={<span className='iconfont icon-User' style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('username', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请输入用户名' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                            ]
                        })(
                            <Input
                                className="myInput"
                                onFocus={() => this.setState({ focusItem: 0 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<Promptbox info={getFieldError('password') && getFieldError('password')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 1 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 1 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }]
                        })(
                            <Input
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
                        help={<Promptbox info={getFieldError('captcha') && getFieldError('captcha')[0]} />}
                        style={{ marginBottom: 20 }}
                        wrapperCol={{ span: 20, pull: focusItem === 2 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 2 ? 1 : 0 }}
                        label={<span className='iconfont icon-securityCode-b' style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
                        colon={false}>
                        <Row gutter={8}>
                            <Col span={15}>
                                {getFieldDecorator('captcha', {
                                    validateFirst: true,
                                    rules: [
                                        { required: true, message: '请输入验证码' },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                                                    callback('验证码错误')
                                                }
                                                callback()
                                            }
                                        }
                                    ]
                                })(
                                    <Input
                                        className="myInput"
                                        onFocus={() => this.setState({ focusItem: 2 })}
                                        onBlur={() => this.setState({ focusItem: -1 })}
                                        onPressEnter={this.onSubmit}
                                        placeholder="验证码"
                                    />
                                )}
                            </Col>
                            <Col span={9}>
                                <canvas onClick={this.changeCaptcha} width="80" height='40' ref={el => this.canvas = el} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn" onClick={this.onSubmit}>登录</div>
                            <div className="registerBtn" onClick={this.goRegister}>注册</div>
                            {/*<div className="registerBtn" onClick={this.goRegister}>微信登录</div>*/}
                        </div>
                    </Form.Item>
                </Form>

                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}

export default LoginForm
