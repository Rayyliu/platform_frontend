import React from "react";
import {
    Button,
    Form,
    Select,
    Icon,
    Input,
    message,
    Collapse,
    Radio,
    Switch,
    Table,
    Popconfirm,
} from "antd";
import {del, get, post} from "../../utils/ajax";
import RadioGroup from "antd/es/radio/group";
import EditableTable from "./EditableTable";

const {TextArea} = Input
@Form.create()
class InterFaceDetail extends React.Component{
    constructor(props) {
        super(props);
    this.state = {
        fields: {
            headerDetail: '',
            body: '',
            path: '',
            method: '',
            sign: false,
            header:false,
            signEntity:'',
        },
        // comps: [],
        // isShowPanel:true

    };
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
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState(
            { [type]: key }
            );
    };

    render() {




        const { getFieldDecorator} = this.props.form;
        const { comps,dataSource } = this.state;
        const { Panel } = Collapse;
        const {isShowPanel,fields} = this.props
        const CustomizedForm = Form.create({
            name: 'global_state',
            onFieldsChange(props, changedFields) {
                props.onChange(changedFields);
            },
            mapPropsToFields(props) {
                console.log("detail+props=="+JSON.stringify(props))
                return {
                    headerDetail: Form.createFormField({
                        ...props.headerDetail,
                        value: props.headerDetail,
                    }),
                    body: Form.createFormField({
                        ...props.body,
                        value: props.body,
                    }),
                    path: Form.createFormField({
                        ...props.path,
                        value: props.path,
                    }),
                    method: Form.createFormField({
                        ...props.method,
                        value: props.method,
                    }),
                    sign: Form.createFormField({
                        ...props.sign,
                        value: props.sign,
                    }),
                    header: Form.createFormField({
                        ...props.header,
                        value: props.header,
                    }),
                    signEntity: Form.createFormField({
                    ...props.signEntity,
                    value: props.signEntity,
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
                    <Collapse bordered="true" >
                        <Panel
                            header={fields.interfaceName}
                            disabled = {isShowPanel}>
                    {/*<Form layout="inline" >*/}
                        <Form.Item label="HeaderDetail">
                            {getFieldDecorator('headerDetail', {
                                rules: [{ required: true, message: 'HeaderDetail is required!' }],
                            })(<Input placeholder={"{}"}/>)}
                        </Form.Item>

                        <Form.Item label="Path">
                            {getFieldDecorator('path', {
                                rules: [{ required: true, message: 'Path is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Body">
                            {getFieldDecorator('body', {
                                rules: [{ required: true, message: 'Body is required!' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="提取参数Parameter">
                                {getFieldDecorator('parameter', {
                                    // rules: [{ required: true, message: 'parameter is required!' }],
                                    initialValue:''
                                })(<Input />)}
                        </Form.Item>

                        <Form.Item label="断言">
                                {getFieldDecorator('assertion', {
                                    // rules: [{ required: true, message: 'Assertion is required!' }],
                                    initialValue:''
                                })(
                                    <EditableTable/>
                                )}
                        </Form.Item>

                        <Form.Item label="签名">
                            {getFieldDecorator('sign', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="有" unCheckedChildren="无" checked={fields.sign}  />
                            )}
                        </Form.Item>

                        <Form.Item label="签名字段">
                            {getFieldDecorator('signEntity', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <TextArea disabled={!fields.sign} defaultValue="没有签名则禁用"/>
                            )}
                        </Form.Item>

                        <Form.Item label="header">
                            {getFieldDecorator('header', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="设置" unCheckedChildren="不设置" checked={fields.header}  />
                            )}
                        </Form.Item>

                        <Form.Item label={'请求方式'}>
                            {getFieldDecorator('method', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '请求方式必选!'}
                                ],
                            })(
                                <RadioGroup
                                    // onChange={this.onMethodChange}
                                    value={fields.method}>
                                    <Radio key="get" value={"get"}>get</Radio>
                                    <Radio key="post" value={"post"}>post</Radio>
                                    <Radio key="delete" value={"delete"}>delete</Radio>
                                    <Radio key="put" value={"put"}>put</Radio>
                                </RadioGroup>
                            )
                            }
                        </Form.Item>

                    {/*</Form>*/}
                        </Panel>
                    </Collapse>
                );
            });
        return(
            <div>
                {/*{comps.map(comp =>{*/}
                    {/*return <CustomizedForm key={comp} {...fields} />*/}
                {/*})}*/}
                {/*<Button onClick={()=>this.setState({comps:comps.concat([Date.now()])})}>加组件</Button>*/}
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
