import React from 'react';
import SiderNav from '../SiderNav'
import '../../css/mainlayout.css'
const MainLayout = ({ rightContent }) => {
  return (
    <div className="layout-container">
      <div className="left">
        <SiderNav /> {/* 渲染侧边导航 */}
      </div>
      <div className="right">{rightContent}</div>
    </div>
  );
};

export default MainLayout;
