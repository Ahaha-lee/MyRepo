import pinyin from "pinyin";

export const INITIAL_VIP= [
    {vip_id:1, vipname:'喜羊羊', nowpoints:500, usedpoints:200, phone:'12345678910', regisdate:'2024-05-01T15:30:00'},
    {vip_id:2, vipname:'美羊羊', nowpoints:420, usedpoints:300, phone:'22345678910', regisdate:'2024-06-06T10:30:00'},
    {vip_id:3, vipname:'沸羊羊', nowpoints:450, usedpoints:100, phone:'32345678910', regisdate:'2024-07-031T11:30:00'},
    {vip_id:4, vipname:'懒羊羊', nowpoints:330, usedpoints:220, phone:'42345678910', regisdate:'2024-08-01T14:30:00'},
    {vip_id:5, vipname:'暖羊羊', nowpoints:550, usedpoints:100, phone:'52345678910', regisdate:'2024-08-05T17:30:00'}
];

export const VIPKEY = "initialvip";


export const PRODUCTS=
 [
        { id: 1, name: '苹果', price: 1.00, codenumeber: '12345', notes: '', pinyin: pinyin('苹果', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 2, name: '橙子', price: 0.50, codenumeber: '22345', notes: '', pinyin: pinyin('橙子', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 3, name: '梨子', price: 1.00, codenumeber: '32345', notes: '', pinyin: pinyin('梨子', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 4, name: '西瓜', price: 2.00, codenumeber: '42345', notes: '', pinyin: pinyin('西瓜', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 5, name: '玫瑰', price: 1.50, codenumeber: '52345', notes: '', pinyin: pinyin('玫瑰', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 6, name: '苹果醋', price: 3.00, codenumeber: '62345', notes: '', pinyin: pinyin('苹果醋', { style: pinyin.STYLE_NORMAL }).join('') }
];

export const PRODUCTSKEY='products';

export const CHILL=[
    { id: 1, name: '苹果', price: 1.00, quantities: 5 , diacount:0},
    { id: 2, name: '橙子', price: 0.50, quantities: 2 , diacount:0},
    { id: 4, name: '西瓜', price: 2.00, quantities: 3 , diacount:0}
];



