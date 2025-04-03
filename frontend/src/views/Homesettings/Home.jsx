import React from 'react';
import MainLayout from '../../utils/MainLayOut/MainLayout';


export function AdminHomePage() {
    return (
        <>
            <MainLayout rightContent={<PageForm />} />
        </>
    );
}

export function PageForm() {
  return (
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
      }}>
          <img src="http://localhost:3001/images/adminpage.png" alt="map" />
      </div>
  );
}
