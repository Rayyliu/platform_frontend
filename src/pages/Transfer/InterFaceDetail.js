import React from "react";
import {Button, Cascader, Form,Select, Icon, Input, InputNumber, message, Collapse} from "antd";
import {del, get, post} from "../../utils/ajax";
import {isAuthenticated} from "../../utils/session";
import options from './cities'
const { Option } = Select;
// import { CaretRightOutlined } from '@ant-design/icons';



@Form.create()
class InterFaceDetail extends React.Component{
    state = {
        //     projects:[],
        //     interfaces:[],
        // };

        fields: {
            header: {
                value: '',
            },
            body: {
                value: '',
            },
        },
    }

    /***
     * 去重查询项目名称
     */


    /**
     * 表单提交
     * */
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.createTransfer(values)
            }
        });
    };
    createTransfer = async (values) => {
        values.storeImgS = this.state.storeImgs;
        const res = await post('/transfers', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
            this.setState({
                    img:{},
                    imgs:{},
                storeImgs:[],
                fileList:[],
                tradeList:[]
                }
            );
            this.props.transferList();
        }
    };
    /**
     * 表单取消
     * */
    handleCancel= ()=>{
        //删除已经上传的所有图片
        if (JSON.stringify(this.state.img) !== '{}'){
            this.removeImg(this.state.img.key);
        }
        const imgs = this.state.imgs;
        if (imgs.length !== 0){
            const keys = [];
            for(let i = 0; i < imgs.length; i++){
                keys.push(imgs[i].key);
            }
            del('/upload/deletes', {keys: keys});
        }
        this.props.transferList();
    };


    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    }
    mapPropsToFields(props) {
        return {
            username: Form.createFormField({
                ...props.username,
                value: props.username.value,
            }),
            pwd: Form.createFormField({
                ...props.pwd,
                value: props.pwd.value,
            }),
        };
    }
    onValuesChange(_, values) {
        console.log(values);
    }

    render() {
        const { getFieldDecorator} = this.props.form;
        const { fields } = this.state;

        const CustomizedForm = Form.create({
            name: 'global_state',
            onFieldsChange(props, changedFields) {
                props.onChange(changedFields);
            },
            mapPropsToFields(props) {
                console.log("props=="+JSON.stringify(props))
                return {
                    header: Form.createFormField({
                        ...props.header,
                        value: props.header.value,
                    }),
                    body: Form.createFormField({
                        ...props.body,
                        value: props.body.value,
                    }),
                };
            },
            onValuesChange(_, values) {
                console.log("values==="+JSON.stringify(values));
            },
        })(
            props => {
                const { getFieldDecorator } = props.form;
                return (
                    <Form layout="inline">
                        <Form.Item label="Header">
                            {getFieldDecorator('header', {
                                rules: [{ required: true, message: 'Username is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Body">
                            {getFieldDecorator('body', {
                                rules: [{ required: true, message: 'Pwd is required!' }],
                            })(<Input />)}
                        </Form.Item>

                    </Form>
                );
            });
        return(
            <div>
                <CustomizedForm {...fields} onChange={this.handleFormChange}/>
            </div>
        )
    }
}
const styles = {
    urlUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    url: {
        maxWidth: '100%',
        maxHeight: '100%',
    }
};


export default InterFaceDetail;
