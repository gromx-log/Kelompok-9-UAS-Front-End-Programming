'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function CustomHeader({title, subtitle}: HeaderProps) {

  return (
    <>
    
    <header 
        className="py-5 text-center" 
        style={{ 
          marginTop: '7rem', 
          paddingTop: '3rem',
          paddingBottom: '3rem',
          backgroundColor: 'var(--color-primary)' 
        }}
    >
        <div className="container">
          <h1 className="display-4 fw-bold fade-in-up" style={{ color: 'var(--color-text)' }}>
            {title}
          </h1>
          <p className="lead fs-4 fade-in-up delay-1" style={{ color: 'var(--color-text-muted)' }}>             
            {subtitle}
          </p>
        </div>
    </header>        
    
    </>
  );
}