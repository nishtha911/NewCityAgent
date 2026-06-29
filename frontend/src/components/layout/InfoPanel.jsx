import React from 'react';

/**
 * InfoPanel — Displays user instructions and system logic for a given page.
 * Placed at the bottom of each page. Adapts to light/dark mode via CSS variables.
 *
 * Props:
 *   instructions: Array<{ text: string }> — bullet points for the user
 *   systemLogic: string — explanation of what the system does under the hood
 */
export default function InfoPanel({ instructions = [], systemLogic = '' }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0',
      background: 'var(--info-panel-bg)',
      border: '1px solid var(--info-panel-border)',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '40px 0 0 0',
      boxShadow: 'var(--card-shadow)',
      fontSize: '0.875rem'
    }}>

      {/* Left — User Instructions */}
      <div style={{
        flex: 1,
        padding: '22px 28px',
        borderRight: '1px solid var(--info-panel-border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px'
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--accent-lilac)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--accent-lilac)'
          }} />
          <span style={{
            color: 'var(--accent-lilac)',
            fontWeight: '700',
            letterSpacing: '0.08em',
            fontSize: '0.75rem',
            textTransform: 'uppercase'
          }}>
            User Instructions
          </span>
        </div>

        <ul style={{ paddingLeft: '0', margin: 0, listStyle: 'none' }}>
          {instructions.map((item, i) => (
            <li key={i} style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              marginBottom: i < instructions.length - 1 ? '10px' : 0,
              color: 'var(--info-panel-text)',
              lineHeight: '1.55'
            }}>
              <span style={{
                color: 'var(--accent-lilac)',
                marginTop: '2px',
                flexShrink: 0,
                fontSize: '0.75rem'
              }}>✓</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right — System Logic */}
      <div style={{
        flex: 1,
        padding: '22px 28px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px'
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--secondary-magenta)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--secondary-magenta)'
          }} />
          <span style={{
            color: 'var(--secondary-magenta)',
            fontWeight: '700',
            letterSpacing: '0.08em',
            fontSize: '0.75rem',
            textTransform: 'uppercase'
          }}>
            System Logic
          </span>
        </div>

        <p style={{
          color: 'var(--info-panel-text)',
          lineHeight: '1.65',
          margin: 0
        }}>
          {systemLogic}
        </p>
      </div>
    </div>
  );
}
