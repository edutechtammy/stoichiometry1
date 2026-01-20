import React, { useState } from 'react';
import './TOC.css';

const TOC = ({ sections, currentSlideId, onNavigate, groups = [] }) => {
    const [expandedGroups, setExpandedGroups] = useState(new Set(['Lesson Mode'])); // Start with Lesson Mode expanded

    const toggleGroup = (groupTitle) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupTitle)) {
            newExpanded.delete(groupTitle);
        } else {
            newExpanded.add(groupTitle);
        }
        setExpandedGroups(newExpanded);
    };

    const renderSlideButton = (section, index) => {
        const isActive = currentSlideId === (section.navid || section.id);

        return (
            <div key={section.id || index} className={`toc-item ${isActive ? 'active' : ''}`}>
                <button
                    className="toc-button"
                    onClick={() => onNavigate(section.navid || section.id)}
                >
                    <div className="toc-number">{index + 1}</div>
                    <div className="toc-text">{section.title || `Slide ${index + 1}`}</div>
                </button>
            </div>
        );
    };

    return (
        <div className="toc">
            <h2 className="toc-title">Table of Contents</h2>
            <div className="toc-list">
                {groups.length > 0 ? (
                    groups.map((group, groupIndex) => {
                        const groupSlides = sections.slice(group.startIndex, group.endIndex + 1);

                        // If no title, render slides at root level
                        if (!group.title) {
                            return groupSlides.map((section, slideIndex) =>
                                renderSlideButton(section, group.startIndex + slideIndex)
                            );
                        }

                        // Render as collapsible group
                        const isExpanded = expandedGroups.has(group.title);

                        return (
                            <div key={group.title} className="toc-group">
                                <button
                                    className="toc-group-header"
                                    onClick={() => toggleGroup(group.title)}
                                >
                                    <span
                                        className="toc-group-icon"
                                        style={{
                                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                                        }}
                                    >
                                        ▶
                                    </span>
                                    <span className="toc-group-title">{group.title}</span>
                                </button>
                                {isExpanded && (
                                    <div className="toc-group-list">
                                        {groupSlides.map((section, slideIndex) =>
                                            renderSlideButton(section, group.startIndex + slideIndex)
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    // Fallback: render all sections as flat list if no groups provided
                    sections && sections.map((section, index) => renderSlideButton(section, index))
                )}
            </div>
        </div>
    );
};

export default TOC;
