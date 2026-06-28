import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const navItems = [
    { label: 'Admin Dashboard', path: '/' },
    { label: 'Customer Simulator', path: '/customer' }
  ];

  return (
    <nav style={{
      backgroundColor: 'var(--bg-navbar)',
      color: 'var(--text-inverse)',
      padding: '0 40px',
      borderBottom: '1px solid #333'
    }}>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {navItems.map((item, index) => (
          <li key={index} style={{
            borderRight: '1px solid #333',
            borderLeft: index === 0 ? '1px solid #333' : 'none'
          }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                display: 'block',
                padding: '16px 20px',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                borderBottom: isActive ? '3px solid var(--highlight-cyan)' : '3px solid transparent',
                color: isActive ? 'var(--highlight-cyan)' : 'inherit'
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
