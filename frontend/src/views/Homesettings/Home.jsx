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
        <div>
            <h1 className="text-center">欢迎！</h1>
        </div>
    );
}
