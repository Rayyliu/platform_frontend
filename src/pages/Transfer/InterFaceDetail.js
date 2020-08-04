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

        // fields: {
        //     header: {
        //         value: '',
        //     },
        //     body: {
        //         value: '',
        //     },
        // },
        fields: {
            header: '',
            body: '',
        },
    }

    componentDidMount() {
        this.initState();
    }

    initState=()=>{
        console.log("Detail组件里的interfaceName==="+JSON.stringify(this.props.fields.interfaceName))
        this.setState({
            header:this.props.fields.interfaceName,
            body:this.props.fields.body,
        })
    }


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


    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    onValuesChange(_, values) {
        console.log(values);
    }

    render() {
        const { getFieldDecorator} = this.props.form;
        const { fields } = this.state;
        const { Panel } = Collapse;

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
                        value: props.header,
                    }),
                    body: Form.createFormField({
                        ...props.body,
                        value: props.body,
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
                    <Collapse bordered="true">
                        <Panel header="#{接口名}">
                    {/*<Form layout="inline">*/}
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

                        <Form.Item label="提取参数Parameter">
                                {getFieldDecorator('parameter', {
                                    // rules: [{ required: true, message: 'parameter is required!' }],
                                    initialValue:''
                                })(<Input />)}
                        </Form.Item>

                        <Form.Item label="断言字段Assertion">
                                {getFieldDecorator('assertion', {
                                    // rules: [{ required: true, message: 'Assertion is required!' }],
                                    initialValue:''
                                })(<Input />)}
                        </Form.Item>


                    {/*</Form>*/}
                        </Panel>
                    </Collapse>
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
