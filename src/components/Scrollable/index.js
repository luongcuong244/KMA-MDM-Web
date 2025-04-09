import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Scrollable = ({ 
    children, 
    allowScroll = true,
    orientation = 'vertical' 
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const containerRef = useRef(null);

    useEffect(() => {
        const imgElements = containerRef.current.querySelectorAll('img');

        imgElements.forEach((img) => {
            img.setAttribute('draggable', false);
        });
    }, []);

    const handleMouseDown = (e) => {
        if (!allowScroll) {
            return;
        }
        setIsDragging(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setStartY(e.pageY - e.currentTarget.offsetTop);
        setScrollLeft(e.currentTarget.scrollLeft);
        setScrollTop(e.currentTarget.scrollTop);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;
        const distanceX = x - startX;
        const distanceY = y - startY;

        if (orientation === 'vertical') {
            e.currentTarget.scrollTop = scrollTop - distanceY;
        } else if (orientation === 'horizontal') {
            e.currentTarget.scrollLeft = scrollLeft - distanceX;
        } else if (orientation === 'both') {
            e.currentTarget.scrollTop = scrollTop - distanceY;
            e.currentTarget.scrollLeft = scrollLeft - distanceX;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return React.cloneElement(React.Children.only(children), {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        ref: containerRef,
        style: { overflow: 'auto' }, // Ensure the container has overflow set for scrollbars
    });
};

Scrollable.propTypes = {
    orientation: PropTypes.oneOf(['vertical', 'horizontal', 'both']).isRequired,
};

export default Scrollable;