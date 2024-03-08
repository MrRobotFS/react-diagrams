import React, { useState, useRef, useEffect } from "react";
import { PortWidget } from "@projectstorm/react-diagrams-core";
import { FaTimes, FaArrowsAltH, FaPencilAlt, FaExpand, FaExpandArrowsAlt, FaUnlock, FaLock, FaCircle } from "react-icons/fa";
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
  const [resizing, setResizing] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [nodeSize, setNodeSize] = useState({ width: 100, height: 100 });
  const [nodePosition, setNodePosition] = useState({ top: 0, left: 0 });
  const [isLocked, setIsLocked] = useState(false);
  // const [showTopAndBottomPorts, setShowTopAndBottomPorts] = useState(false);

  const handleNodeClick = () => {
    setSelectionState(selectionState === 'node' ? 'none' : 'node');
    setSelectedLinks([]);
  };

  const handleDeleteNodeClick = e => {
    e.stopPropagation();
    props.node.remove();
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
      link.setColor(link.originalColor || '#808080');
    }
  };

  /* Consistent arrowheads */
  const handleToggleOutArrowhead = e => {
    e.stopPropagation();

    const newShowOutArrowhead = !props.node.showOutArrowhead;
    props.node.showOutArrowhead = newShowOutArrowhead;
    setShowOutArrowhead(newShowOutArrowhead);

    setHasOutLinks(Object.keys(props.node.getPort("out").links).length > 0);
};

useEffect(() => {
    if (props.node.showOutArrowhead !== undefined) {
        setShowOutArrowhead(props.node.showOutArrowhead);
    }
}, [props.node]);


  // const handleToggleOutArrowhead = e => {
  //   e.stopPropagation();
  //   setShowOutArrowhead(!showOutArrowhead);

  //   setHasOutLinks(Object.keys(props.node.getPort("out").links).length > 0);
  // };

  // useEffect(() => {
  //   const hasLinks = Object.keys(props.node.getPort("out").links).length > 0;

  //   if (!hasLinks) {
  //     setShowOutArrowhead(false);
  //   }

  //   setHasOutLinks(hasLinks);
  // }, [props.node]);

  const handleEditText = () => {
    if (props.node.name === "input_text") {
      const newText = prompt("Introduce el texto para el nodo:", props.node.customText || "");
      props.node.customText = newText;
      setCustomText(newText);
    } else {
      const newText = prompt("Introduce el texto adicional para el nodo:", customText);
      setCustomText(newText);
    }
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

  useEffect(() => {
    if (props.node.name === "input_text") {
      setCustomText(props.node.customText || "");
    }
  }, [props.node.customText]);

  const startResizing = (e) => {
    setResizing(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };

  const stopResizing = () => {
    setResizing(false);
  };

  const handleResizing = (e) => {
    if (resizing) {
      const dx = e.clientX - initialMousePosition.x;
      const dy = e.clientY - initialMousePosition.y;
      const newNodeSize = {
        width: nodeSize.width + dx,
        height: nodeSize.height + dy,
      };
      setNodeSize(newNodeSize);
      props.node.setSize(newNodeSize.width, newNodeSize.height);
      setNodePosition({
        top: nodePosition.top - dy / 2,
        left: nodePosition.left - dx / 2,
      });
      setInitialMousePosition({ x: e.clientX, y: e.clientY });
    }
  };


  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizing);
      document.addEventListener("mouseup", stopResizing);
    }
    return () => {
      document.removeEventListener("mousemove", handleResizing);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [resizing, initialMousePosition, nodeSize]);

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
  };

  /*Show hide top/bottom buttons*/
  // const toggleTopAndBottomPorts = () => {
  //   setShowTopAndBottomPorts(!showTopAndBottomPorts);
  // };

  const hasTopInLinks = Object.keys(props.node.getPort("top").links).length > 0;
  const hasBottomOutLinks = Object.keys(props.node.getPort("bottom").links).length > 0;

  return (
    <div
    title={props.node.name}
      ref={nodeRef}
      className={`my-node ${selectionState === 'node' ? "selected" : ""}`}
      onClick={handleNodeClick}
      style={{
        backgroundColor: selectionState === 'node' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        boxShadow: selectionState === 'node' ? '0 0 5px #00f' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: props.node.name === 'groups' ? '2px dashed black' : '2px solid black',
        width: `${props.node.size.width}px`,
        height: `${props.node.size.height}px`,
        top: `${props.node.name === "input_text" ? 5 : nodePosition.top}px`,
        left: `${nodePosition.left}px`,
        zIndex: props.node.name !== 'groups' ? 2 : 0,
      }}
    >
      {selectionState === 'node' && (
        <div>
          <button
            className="edit-button"
            onClick={handleEditText}
            style={{
              color: 'white', borderRadius: '50%', backgroundColor: '#FFA500',
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
          {/* <button
            onClick={toggleTopAndBottomPorts}
            style={{
              color: 'white',
              borderRadius: '50%',
              backgroundColor: '#FFA500',
              border: '2px solid #FFA500',
              position: 'absolute',
              top: '-10px',
              right: '-100px',
              width: '18px',
              height: '18px',
              zIndex: 1000,
              padding: '0',
              fontSize: '12px'
            }}
          >
            <FaCircle />
          </button> */}

          
          {selectionState === 'node' && props.node.name === 'groups' && (
            <button
              className="lock-toggle-button"
              onClick={handleLockToggle}
              style={{
                color: 'white',
                borderRadius: '50%',
                backgroundColor: isLocked ? 'green' : 'grey',
                border: `2px solid ${isLocked ? 'green' : 'grey'}`,
                position: 'absolute',
                top: '-10px',
                right: '-100px', // Adjust position as needed
                width: '18px',
                height: '18px',
                zIndex: 1000,
                padding: '0',
                fontSize: '12px'
              }}
            >
              {isLocked ? <FaLock /> : <FaUnlock />}
            </button>
          )}

        </div>
      )}

      {props.node.name !== "input_text" && (
        <div
          className="my-node-header-container"
          style={{
            backgroundColor: props.node.color,
            display: 'flex',
            justifyContent: props.node.name === 'groups' ? 'flex-start' : 'left',
            paddingLeft: props.node.name === 'groups' ? '10px' : undefined,
            alignItems: 'center'
          }}
        >
          <div className={`my-node-header-text ${props.node.name === 'groups' ? "groups-header-text" : ""}`} style={{ color: props.node.name === 'groups' ? 'black' : undefined }}>
            {props.node.name === 'groups' ? nodeIcons[props.node.nodeType] : props.node.name}
          </div>
        </div>
      )}
      {props.node.name === "input_text" ? (
        <p>{props.node.customText}</p>
      ) : (
        <>
          {props.node.name !== "groups" && (
            <img
              src={nodeIcons[props.node.nodeType] || "fallback-image-url"}
              alt={props.node.name}
              width="60"
              height="60"
              draggable="false"
            />
          )}
          {props.node.name === "groups" && !isLocked && (
            <FaExpandArrowsAlt
              onMouseDown={startResizing}
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                fontSize: '20px',
                color: 'gray',
                cursor: 'pointer'
              }}
            />
          )}
          {customText && <div className="custom-text-container">
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
          </div>}
        </>
      )}

      <PortWidget
        className="port-container left-port"
        engine={props.engine}
        port={props.node.getPort("in")}
      >
        <div className="my-port">
          {hasInLinks && (
            <>
              {/* <svg className="arrowhead" viewBox="0 0 20 20" onClick={(e) => showDeleteButtonsForLinks(props.node.getPort("in"), e)}>
                <path d="M0 0 L20 10 L0 20 L5 10 Z"></path>
              </svg> */}
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
                      right: '35px',
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
          {/* {showOutArrowhead && hasOutLinks && (
            <svg className="arrowhead" viewBox="0 0 20 20" onClick={(e) => showDeleteButtonsForLinks(props.node.getPort("out"), e)}>
              <path d="M20 0 L0 10 L20 20 L15 10 Z"></path>
            </svg>
          )} */}
        </div>
      </PortWidget>
      {/* {showTopAndBottomPorts && ( */}
      <>
        <PortWidget
          className="port-container-top top-port"
          engine={props.engine}
          port={props.node.getPort("top")}
        >
          <div className="my-port">
            {hasTopInLinks && (
              <>
                {/* <svg className="arrowhead" viewBox="0 0 20 20" onClick={(e) => showDeleteButtonsForLinks(props.node.getPort("top"), e)}>
                  <path d="M10 0 L20 20 L0 20 Z"></path>
                </svg> */}
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
                        border: '2px solid red', position: 'absolute', top: '35px',
                        left: `${(25 * index) - 10}px`,
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
          className="port-container-bottom bottom-port"
          engine={props.engine}
          port={props.node.getPort("bottom")}
        >
          <div className="my-port">
            {showOutArrowhead && hasBottomOutLinks && (
              <>
                <svg className="arrowhead" viewBox="0 0 20 20" onClick={(e) => showDeleteButtonsForLinks(props.node.getPort("bottom"), e)}>
                  <path d="M10 20 L20 0 L0 0 Z"></path>
                </svg>
                {selectionState === 'link' && selectedLinks.map((link, index) => (
                  <button
                    key={link.getID()}
                    className="delete-button"
                    onClick={(e) => handleDeleteLinkClick(link, e)}
                    onMouseEnter={() => handleLinkHover(link, true)}
                    onMouseLeave={() => handleLinkHover(link, false)}
                    style={{
                      color: 'white', borderRadius: '50%', backgroundColor: 'red',
                      border: '2px solid red', position: 'absolute', bottom: '35px',
                      left: `${(25 * index) - 10}px`,
                      width: '18px', height: '18px', zIndex: 2000,
                      padding: '0', fontSize: '12px',
                    }}
                  >
                    <FaTimes />
                  </button>
                ))}
              </>
            )}
          </div>
        </PortWidget>

      </>
      {/* )} */}
    </div>
  );

};