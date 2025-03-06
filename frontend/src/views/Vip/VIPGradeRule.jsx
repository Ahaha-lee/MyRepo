import { VipGrade } from "../../api/vip";
import MainLayout from "../../utils/MainLayOut/MainLayout";
import { useState, useEffect } from "react";

export function GradRulePage() {
    return (
        <>
            <MainLayout rightContent={<GradRuleForm />} />
        </>
    );
}

export function GradRuleForm() {
    const [levels, setLevels] = useState([{ GradeName: "", GradeStartpoints: 0, GradeEndpoints: 0, GradeRemarks: "" }]);
    const [inilevels, setIniLevels] = useState([{ GradeName: "", GradeStartpoints: 0, GradeEndpoints: 0, GradeRemarks: "" }]);

    useEffect(() => {
        async function initiaGrade() {
            try {
                const res = await VipGrade.get();
                console.log("getInfo", res);
                setIniLevels(res.data || []);
            } catch (error) {
                console.log("mistake", error);
            }
        }

        initiaGrade();
    }, []);

    const handleChange = (index, event) => {
        const { name, value } = event.target;

        const newValue = (name === "GradeStartpoints" || name === "GradeEndpoints") ? parseInt(value, 10) : value;

        const newLevels = [...levels];
        newLevels[index] = {
            ...newLevels[index],
            [name]: newValue,
        };

        setLevels(newLevels);
    };

    const handleAddLevel = () => {
        setLevels([...levels, { GradeName: "", GradeStartpoints: 0, GradeEndpoints: 0, GradeRemarks: "" }]);
    };

    const handleRemoveLevel = (index) => {
        const values = [...levels];
        values.splice(index, 1);
        setLevels(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation logic
        for (let i = 0; i < levels.length; i++) {
            const { GradeStartpoints, GradeEndpoints } = levels[i];
            if (GradeEndpoints <= GradeStartpoints) {
                alert(`等级 ${levels[i].GradeName} 的结束分数必须大于开始分数`);
                return;
            }
            if (i > 0 && GradeStartpoints <= levels[i - 1].GradeEndpoints) {
                alert(`等级 ${levels[i + 1].GradeName} 的开始分数必须大于前一个等级的结束分数`);
                return;
            }
        }
        try {
            console.log(levels);
            VipGrade.insert(levels).then(res => {
                console.log("添加等级成功", res);
            }).catch(err => {
                console.log("添加等级失败", err);
            });
        } catch (err) {
            console.log("添加等级失败", err);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <p>会员 积分等级规则，管理员设计会员等级以及等级规则</p>
            </div>
            <h3>现有等级规则</h3>
            {inilevels.length>0 ?
            <div className="row">
                <table className="table">
                    <thead>
                        <th>等级名称</th>
                        <th>积分区间开始</th>
                        <th>积分区间结束</th>
                        <th>备注</th>
                    </thead>
                    <tbody>
                        {inilevels.map((inilevel, index) => (
                            <tr key={index}>
                                <td>{inilevel.GradeName}</td>
                                <td>{inilevel.GradeStartpoints}</td>
                                <td>{inilevel.GradeEndpoints}</td>
                                <td>{inilevel.GradeRemarks}</td>
                            </tr>
                            ))}
                    </tbody>
                </table>
            </div>:"还未设置等级规则"}
            <div>
                <h3>添加等级规则</h3>
            <form onSubmit={handleSubmit}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>等级名称</th>
                            <th>积分区间开始</th>
                            <th>积分区间结束</th>
                            <th>备注</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {levels.map((level, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="等级名称"
                                        name="GradeName"
                                        value={level.GradeName}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="积分区间开始"
                                        name="GradeStartpoints"
                                        value={level.GradeStartpoints}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="积分区间结束"
                                        name="GradeEndpoints"
                                        value={level.GradeEndpoints}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="备注"
                                        name="GradeRemarks"
                                        value={level.GradeRemarks}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveLevel(index)}
                                    >
                                        删除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" className="btn btn-secondary" onClick={handleAddLevel}>
                    添加等级
                </button>
                <button type="submit" className="btn btn-primary">提交</button>
            </form>
            </div>
        </div>
    );
}