import React from "react";
import {Button, Cascader, Form,Select, Icon, Input, InputNumber, message, Collapse,Radio,Switch,Divider,Card} from "antd";
import {del, get, post} from "../../utils/ajax";
import RadioGroup from "antd/es/radio/group";

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
            headerDetail: '',
            body: '',
            path:'',
            method:'',
            sign:false,
        },
        comps:[],
        key: 'parameter',
        // isShowPanel:false
    }

    // componentDidMount() {
    //     this.initState();
    // }

    // componentWillReceiveProps(nextProps) {
    //     console.log("nextProps" + JSON.stringify(nextProps))
    //         this.props.form.setFieldsValue(nextProps.defaultValue)
    // }
    // initState=()=>{
    //     console.log("Detail组件里的interfaceName==="+JSON.stringify(this.props.fields.interfaceName))
    //     this.setState({
    //         header:this.props.fields.headerdetail,
    //         body:this.props.fields.body,
    //     })
    // }


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


    // getItemsValue = ()=>{    //3、自定义方法，用来传递数据（需要在父组件中调用获取数据）
    //     const valus= this.props.form.getFieldsValue();       //4、getFieldsValue：获取一组输入控件的值，如不传入参数，则获取全部组件的值
    //     return valus;
    // }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    };

    render() {
        const tabList=[
            {
                key: 'parameter',
                tab: 'parameter',
            },
            {
                key: 'expected',
                tab: 'expected',

        }]

        const contentList = {
            tab1: <p>content1</p>,
            tab2: <p>content2</p>,
        };
        const { getFieldDecorator} = this.props.form;
        const { comps } = this.state;
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
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Path">
                            {getFieldDecorator('path', {
                                rules: [{ required: true, message: 'Path is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Body">
                            {getFieldDecorator('body', {
                                rules: [{ required: true, message: 'Body is required!' }],
                            })(<Input />)}
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
                                   <div>
                                       <Card
                                             bordered={false}
                                             tabList={tabList}
                                             activeTabKey={this.state.key}
                                             onTabChange={key => {
                                                 this.onTabChange(key, 'key');
                                             }}
                                       >
                                           {contentList[this.state.key]}
                                       </Card>
                                   </div>

                                )}
                        </Form.Item>

                        <Form.Item label="签名">
                            {getFieldDecorator('sign', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="启用" unCheckedChildren="废弃" checked={fields.sign}  />
                            )}
                        </Form.Item>

                        <Form.Item label={'请求方式'}>
                            {getFieldDecorator('method', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '请求方式必选!'}
                                ],
                            })(
                                <RadioGroup  onChange={this.onMethodChange} value={fields.method}>
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
