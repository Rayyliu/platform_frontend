import React from 'react'
import LoadableComponent from '../utils/LoadableComponent'
const Account = LoadableComponent(import('./Setting/Account'), true);
const Permission = LoadableComponent(import('./Setting/Permission'), true);
const Role = LoadableComponent(import('./Setting/Role'), true);
const Menu = LoadableComponent(import('./Setting/Menu'), true);
const Home = LoadableComponent(import('./Home/index'), true);
const Banners = LoadableComponent(import('./Banners/index'), true);
const Generalize = LoadableComponent(import('./Platform/Generalize'), true);
const Stick = LoadableComponent(import('./Platform/Stick/index'), true);
const Trade = LoadableComponent(import('./Env/index'), true);
const Order = LoadableComponent(import('./Orders/index'), true);
const Transfer = LoadableComponent(import('./Transfer/index'), true);

const menu = [
    {
        name: '首页',
        icon: 'home',
        key: 'Home'
    },
    {
        name: '项目管理',
        icon: 'project',
        key: 'Banner'
    },
    {
        name: '测试环境',
        icon: 'cloud',
        key: 'Trade'
    },
    {
        name: '数据服务',
        icon: 'database',
        key: 'Trade'
    },
    {
        name: '接口管理',
        icon: 'italic',
        key: 'Order'
    },
    {
        name: '用例管理',
        icon: 'copyright',
        key: 'Transfer'
    },
    {
        name: '测试计划',
        icon: 'dashboard',
        key: 'Platform',
        children: [
            {
                name: '推广设置',
                icon: 'fullscreen',
                key: 'Generalize',
            },
            {
                name: '置顶设置',
                icon: 'caret-up',
                key: 'Stick',
            }
        ]
    },
    {
        name: '定时任务',
        icon: 'clock-circle',
        key: 'Banner'
    },
    {
        name: '运行报告',
        icon: 'diff',
        key: 'Setting',
        children: [
            {
                name: '菜单设置',
                icon: 'menu',
                key: 'Menu',
            },
            {
                name: '权限设置',
                icon: 'paper-clip',
                key: 'Permission',
            },
            {
                name: '角色管理',
                icon: 'robot',
                key: 'Role',
            },
            {
                name: '账号管理',
                icon: 'contacts',
                key: 'Account',
            }
        ]
    },
    {
        name: '签名方式',
        icon: 'highlight',
        key: 'Trade'
    },
    {
        name: '用户管理',
        icon: 'team',
        key: 'Trade'
    }
];

const tabs = {
    Home: <Home />,
    Banner:<Banners />,
    Order: <Order />,
    Trade: <Trade />,
    Transfer: <Transfer />,
    Generalize: <Generalize />,
    Stick: <Stick />,

    Menu: <Menu />,
    Permission: <Permission/>,
    Role: <Role />,
    Account: <Account />,
};

export {
    menu,
    tabs
}
