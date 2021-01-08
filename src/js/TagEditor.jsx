import React, { Component } from "react";
import ReactDOM from "react-dom";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';

import TextField from '@material-ui/core/TextField';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Button as MaterialButton } from '@material-ui/core';

import Draggable from 'react-draggable'; // The default
import { useDrop } from 'react-dnd';

// for hooks to refer to previous components
function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const DroppableTextField = ({tagId, channel, tag, handleChange, handleKeyUp}) => {
    const [{ canDrop, isOver}, drop] = useDrop({
        tagId: tagId,
        channel: channel,
        tag: tag,
        accept: "cell",
        drop: () => ({ 
          channel: channel, tag: tag, 
          handleChange: handleChange, handleKeyup: handleKeyUp }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const isActive = canDrop && isOver;
    let backgroundColor = '#FFFFFF';
    if (isActive) {
        backgroundColor = "rgba(255,250,205, 1)";
    }
    else if (canDrop) {
        backgroundColor = "rgba(255,250,205, 0.4)";
    }

   const val = tag["props"][channel] == null ? "" : tag["props"][channel];

    const textField = (
      <TextField 
        ref={drop}
        style={{ "background": backgroundColor}}
        label={(channel == "column" ? "column" : channel)} 
        margin="dense"
        //size="small"
        autoComplete='off'
        value={val}
        placeholder="empty"
        variant="outlined"
        //error={tag["props"][key] == null}
        InputLabelProps={{shrink: true, required: (tag["props"][channel] == null)}}
        onChange={(e) => handleChange(channel, e.target.value)}
        onKeyUp={handleKeyUp}
      />);

    return textField;
};


// the tag editor element
function TagEditor({tagId, tagProps, editorOpen, 
                    updateTagProperty, closeTagEditor, removeTag}) {

  const [tag, setTag] = React.useState(tagProps);
  const prevTagProps = usePrevious(tagProps)
  const prevTagId = usePrevious(tagId)

  React.useEffect(() => {
    // rerender the component when parent property updated
    if (JSON.stringify(prevTagProps) != JSON.stringify(tagProps)) {
      setTag(tagProps);
    }
  });

  const handleChange = (key, value) => {
    const tempTag = JSON.parse(JSON.stringify(tag));
    tempTag["props"][key] = value;
    setTag(tempTag);
  };

  const handleClose = () => {
    setTag(tagProps);
    closeTagEditor();
  }

  const elementEditor = Object.keys(tag["props"])
    .map(function(key) {
      return (
        <Grid item xs className="not-draggable" key={"element-editor-" + tagId + key} xs={6}>
          <DroppableTextField 
            key={"element-editor-field" + tagId + key}
            id={"mui-element-editor-input-" + tagId + key}
            tagId={tagId} channel={key} tag={tag} 
            handleChange={handleChange}
            handleKeyUp={(e) => { 
              if (e.key === "Enter") { 
                updateTagProperty(tagId, tag); 
                closeTagEditor(); }}}/>
        </Grid>);
      // const val = tag["props"][key] == null ? "" : tag["props"][key];
      // return (
      //   <Grid item xs className="not-draggable" key={"element-editor-" + tagId + key} xs={6}>
      //     <TextField 
      //       key={"element-editor-field" + tagId + key}
      //       id={"mui-element-editor-input-" + tagId + key}
      //       label={(key == "column" ? "column" : key)} 
      //       margin="dense"
      //       //size="small"
      //       autoComplete='off'
      //       value={val}
      //       placeholder="empty"
      //       variant="outlined"
      //       //error={tag["props"][key] == null}
      //       InputLabelProps={{shrink: true, required: (tag["props"][key] == null)}}
      //       onChange={(e) => handleChange(key, e.target.value)}
      //       onKeyUp={(e) => { if (e.key === "Enter") { updateTagProperty(tagId, tag); closeTagEditor(); }}}
      //     />
      //   </Grid>
      // );
    }.bind(this));

  const editorStatus = editorOpen ? "editor-visible" : "editor-hidden";

  const tagEditor = (
    <Draggable cancel=".not-draggable">
      <Card id={"tag" + tagId} className={"tag-editor-card" + " " + editorStatus}>
        <CardContent className="tag-editor-card-content">
          <Grid container spacing={1}>
            <Grid item xs xs={10} style={{ cursor: 'move' }}>
              <Typography variant="body1" component="h2">
                Editing <Typography variant="inherit">{tag["type"] + " #" + (tagId + 1)}</Typography>
              </Typography>
            </Grid>
            <Grid item xs xs={2} style={{textAlign: "right",  cursor: 'move'}}>
              <CloseIcon fontSize="small" style={{cursor: 'pointer'}}
                onClick={handleClose}/>
            </Grid>
            <Divider />
            {elementEditor}
          </Grid>
        </CardContent>
        <CardActions className="tag-editor-card-action">
          <ButtonGroup className="left-btn" color="secondary" 
              size="small" aria-label="outlined primary button group">
            <MaterialButton aria-label="delete" color="secondary" onClick={() => { removeTag(tagId); }}>
              Delete
            </MaterialButton>
          </ButtonGroup>
          <ButtonGroup className="right-btn" color="primary" 
              size="small" aria-label="outlined primary button group">
            <MaterialButton 
              onClick={() => {updateTagProperty(tagId, tag); handleClose();}}>
              Save
            </MaterialButton>
            <MaterialButton onClick={handleClose}>
              Cancel
            </MaterialButton>
          </ButtonGroup>
        </CardActions>
      </Card>
    </Draggable>)

  return tagEditor;
}

export default TagEditor;