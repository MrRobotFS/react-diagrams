import React, { useState, useRef, useEffect } from "react";
import { PortWidget } from "@projectstorm/react-diagrams-core";
import { FaTimes, FaArrowsAltH, FaPencilAlt } from "react-icons/fa";
import "./my-node-widget.css";

const nodeIcons = {
  LEX: "https://stelligent.com/wp-content/uploads/2017/11/AI_AmazonLex_LARGE-1.png",
  HASH_AUDIT: "https://static-00.iconduck.com/assets.00/aws-icon-2048x2048-ptyrjxdo.png",
  LAMBDA: "https://seeklogo.com/images/A/aws-lambda-logo-AE95CFC218-seeklogo.com.png",
};

export const MyNodeWidget = props => {
  const [selectionState, setSelectionState] = useState('none');
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [showOutArrowhead, setShowOutArrowhead] = useState(false);
  const [hasOutLinks, setHasOutLinks] = useState(Object.keys(props.node.getPort("out").links).length > 0);
  const [customText, setCustomText] = useState("");
  const nodeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);


  const handleNodeClick = () => {
    setSelectionState(selectionState === 'node' ? 'none' : 'node');
    setSelectedLinks([]);
  };

  const handleDeleteNodeClick = e => {
    e.stopPropagation();
    props.node.remove();

    // Update the arrowhead state when the node is deleted
    setShowOutArrowhead(false);
  };


  const showDeleteButtonsForLinks = (port, e) => {
    e.stopPropagation();
    setSelectedLinks(Object.values(port.getLinks()));
    setSelectionState('link');
  };

  const handleDeleteLinkClick = (link, e) => {
    e.stopPropagation();
    link.remove();
    setSelectedLinks(prevLinks => prevLinks.filter(l => l.getID() !== link.getID()));

    if (selectedLinks.length === 1) {
      setSelectionState('none');
    }

    // Check if there are links in the out port and update state
    setHasOutLinks(Object.keys(props.node.getPort("out").links).length > 0);
  };

  const hasInLinks = Object.keys(props.node.getPort("in").links).length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setSelectionState('none');
        setSelectedLinks([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const percentagePosition = [25, 50, 75];

  const handleLinkHover = (link, entering) => {
    if (entering) {
      link.setColor('red');
    } else {
      // Restaura el color original del link o asigna un valor por defecto
      link.setColor(link.originalColor || '#00f');
    }
  };

  const handleToggleOutArrowhead = e => {
    e.stopPropagation();
    setShowOutArrowhead(!showOutArrowhead);

    // Check if there are links in the out port and update state
    setHasOutLinks(Object.keys(props.node.getPort("out").links).length > 0);
  };

  useEffect(() => {
    // Check if there are links in the out port
    const hasLinks = Object.keys(props.node.getPort("out").links).length > 0;

    // If there are no links, hide the arrowhead
    if (!hasLinks) {
      setShowOutArrowhead(false);
    }

    // Update the hasOutLinks state
    setHasOutLinks(hasLinks);
  }, [props.node]);

  const handleEditText = () => {
    const newText = prompt("Introduce el texto para el nodo:");
    setCustomText(newText);
  };

  const handleTextClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };


  return (
    <div
      ref={nodeRef}
      className={`my-node ${selectionState === 'node' ? "selected" : ""}`}
      onClick={handleNodeClick}
      style={selectionState === 'node' ? {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0 0 5px #00f',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      } : { position: 'relative' }}
    >
      {selectionState === 'node' && (
        <div>
          <button
            className="edit-button"
            onClick={handleEditText}
            style={{
              color: 'white', borderRadius: '50%', backgroundColor: '#FFA500', // Color naranja para editar
              border: '2px solid #FFA500', position: 'absolute', top: '-10px',
              right: '-70px', width: '18px', height: '18px', zIndex: 1000,
              padding: '0', fontSize: '12px'
            }}
          >
            <FaPencilAlt />
          </button>

          <button
            className="toggle-arrowhead-button"
            onClick={handleToggleOutArrowhead}
            style={{
              color: 'white', borderRadius: '50%', backgroundColor: 'blue',
              border: '2px solid blue', position: 'absolute', top: '-10px',
              right: '-40px', width: '18px', height: '18px', zIndex: 1000,
              padding: '0', fontSize: '12px'
            }}
          >
            <FaArrowsAltH />
          </button>
          <button
            className="delete-button"
            onClick={handleDeleteNodeClick}
            style={{
              color: 'white', borderRadius: '50%', backgroundColor: 'red',
              border: '2px solid red', position: 'absolute', top: '-10px',
              right: '-10px', width: '18px', height: '18px', zIndex: 1000,
              padding: '0', fontSize: '12px'
            }}
          >
            <FaTimes />
          </button>
        </div>
      )}
      <div
        className="my-node-header-container"
        style={{ backgroundColor: props.node.color, display: 'flex', justifyContent: 'center' }}
      >
        <div className="my-node-header-text">{props.node.name}</div>
      </div>

      <img
        src={nodeIcons[props.node.nodeType] || "fallback-image-url"}
        alt={props.node.name}
        width="60"
        height="60"
        draggable="false"
      />

      <PortWidget
        className="port-container left-port"
        engine={props.engine}
        port={props.node.getPort("in")}
      >
        <div className="my-port">
          {hasInLinks && (
            <>
              <svg className="arrowhead" viewBox="0 0 20 20" onClick={(e) => showDeleteButtonsForLinks(props.node.getPort("in"), e)}>
                <path d="M0 0 L20 10 L0 20 L5 10 Z"></path>
              </svg>
              {
                selectionState === 'link' && selectedLinks.map((link, index) => (
                  <button
                    key={link.getID()}
                    className="delete-button"
                    onClick={(e) => handleDeleteLinkClick(link, e)}
                    onMouseEnter={() => handleLinkHover(link, true)}
                    onMouseLeave={() => handleLinkHover(link, false)}
                    style={{
                      color: 'white', borderRadius: '50%', backgroundColor: 'red',
                      border: '2px solid red', position: 'absolute', top: `${(25 * index) - 10}px`,
                      right: '35px', // posición fija
                      width: '18px', height: '18px', zIndex: 2000,
                      padding: '0', fontSize: '12px',
                    }}
                  >
                    <FaTimes />
                  </button>
                ))
              }
            </>
          )}
        </div>
      </PortWidget>

      <PortWidget
        className="port-container right-port"
        engine={props.engine}
        port={props.node.getPort("out")}
      >
        <div className="my-port">
          {showOutArrowhead && hasOutLinks && (
            <svg className="arrowhead" viewBox="0 0 20 20" onClick={(e) => showDeleteButtonsForLinks(props.node.getPort("out"), e)}>
              <path d="M20 0 L0 10 L20 20 L15 10 Z"></path>
            </svg>
          )}
        </div>
      </PortWidget>
      {customText !== null && (
        <div className="custom-text-container">
          {isEditing ? (
            <input
              value={customText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <span onClick={handleTextClick}>{customText}</span>
          )}
        </div>
      )}



    </div>
  );
};
