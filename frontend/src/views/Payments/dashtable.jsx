import React from 'react';

export const DiscountDetails = ({ discountData }) => {
    return (
        <div className="row">
             <div className="col-md-6">
                <label>优惠表编号:</label>
                <div className="form-control">{discountData.DiscountruleId}</div>
            </div>
            <div className="col-md-6">
                <label>优惠类型:</label>
                <div className="form-control">{discountData.RuleTypeid}</div>
            </div>
            <div className="col-md-6">
                <label>是否为会员专享:</label>
                <div className="form-control">{discountData.Isvip ? '会员专享' : '非会员专享'}</div>
            </div>
            <div className="col-md-6">
                <label>最小消费额度:</label>
                <div className="form-control">{discountData.Minprice}</div>
            </div>
           
            <div className="col-md-6">
                <label>优惠折扣:</label>
                <div className="form-control">{discountData.DiscountRate}</div>
            </div>
            <div className="col-md-6">
                <label>满减减去的额度:</label>
                <div className="form-control">{discountData.DiscountAmount}</div>
            </div>
            <div className="col-md-6">
                <label>享受优惠的商品:</label>
                <div className="form-control">{discountData.DiscountItems}</div>
            </div>
        
            <div className="col-md-6">
                <label>优惠开始时间:</label>
                <div className="form-control">{discountData.StartDate}</div>
            </div>
            <div className="col-md-6">
                <label>优惠结束时间:</label>
                <div className="form-control">{discountData.EndDate}</div>
            </div>
            <div className="col-md-6">
                <label>优惠规则更新时间:</label>
                <div className="form-control">{discountData.UpdateDate}</div>
            </div>
        </div>
    );
};


export const DiscountTypeDetails = ({ discountTypeData }) => {  
    return (
        <div className="row">
            <div className="col-md-6">
                <label>优惠类型编号:</label>
                <div className="form-control">{discountTypeData.Type_id}</div>
            </div>
            <div className="col-md-6">
                <label>优惠类型名称:</label>
                <div className="form-control">{discountTypeData.Type_name}</div>
            </div>
            <div className="col-md-6">
                <label>优惠类型备注:</label>
                <div className="form-control">{discountTypeData.Type_desc}</div>
            </div>
        </div>
    )
};