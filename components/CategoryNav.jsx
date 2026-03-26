"use client";
import { CATEGORIES } from '../utils';

export default function CategoryNav({ activeCategory, onCategoryChange }) {
  return (
    <nav className="category-nav">
      {CATEGORIES.map(group => (
        <div className="tab-group" key={group.group}>
          <span className="tab-group-label">{group.group}</span>
          <div className="category-tabs">
            {group.items.map(item => (
              <button
                key={item.id}
                className={`tab ${activeCategory === item.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(item.id, item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
